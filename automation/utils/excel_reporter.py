import os
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from datetime import datetime
from automation.config.appium_config import AppiumConfig

class EnterpriseExcelReporter:
    def __init__(self, output_dir=None):
        self.output_dir = output_dir or AppiumConfig.EXCEL_REPORTS_DIR
        os.makedirs(self.output_dir, exist_ok=True)

    def generate_all_reports(self, test_results, metrics):
        master_path = self.generate_master_report(test_results, metrics)
        passed_path = self.generate_passed_report(test_results)
        failed_path = self.generate_failed_report(test_results)
        summary_path = self.generate_summary_report(metrics)
        return {
            "master": master_path,
            "passed": passed_path,
            "failed": failed_path,
            "summary": summary_path
        }

    def generate_master_report(self, test_results, metrics):
        filepath = os.path.join(self.output_dir, "Automation_Test_Report.xlsx")
        wb = openpyxl.Workbook()
        
        # Default sheet -> Executed Test Cases
        ws1 = wb.active
        ws1.title = "Executed Test Cases"
        self._build_test_cases_sheet(ws1, test_results)

        # Sheet 2 -> Passed Tests
        ws2 = wb.create_sheet(title="Passed Tests")
        passed_cases = [tc for tc in test_results if tc.get("status") == "PASS"]
        self._build_test_cases_sheet(ws2, passed_cases)

        # Sheet 3 -> Failed Tests
        ws3 = wb.create_sheet(title="Failed Tests")
        failed_cases = [tc for tc in test_results if tc.get("status") == "FAIL"]
        self._build_test_cases_sheet(ws3, failed_cases)

        # Sheet 4 -> Skipped Tests
        ws4 = wb.create_sheet(title="Skipped Tests")
        skipped_cases = [tc for tc in test_results if tc.get("status") == "SKIP"]
        self._build_test_cases_sheet(ws4, skipped_cases)

        # Sheet 5 -> Execution Metrics
        ws5 = wb.create_sheet(title="Execution Metrics")
        self._build_metrics_sheet(ws5, metrics)

        # Sheet 6 -> Defect Summary
        ws6 = wb.create_sheet(title="Defect Summary")
        self._build_defect_sheet(ws6, failed_cases)

        # Sheet 7 -> Pass Rate Summary
        ws7 = wb.create_sheet(title="Pass Rate Summary")
        self._build_pass_rate_sheet(ws7, metrics, test_results)

        wb.save(filepath)
        return filepath

    def generate_passed_report(self, test_results):
        filepath = os.path.join(self.output_dir, "Passed_Test_Cases.xlsx")
        wb = openpyxl.Workbook()
        ws = wb.active
        ws.title = "Passed Test Cases"
        passed_cases = [tc for tc in test_results if tc.get("status") == "PASS"]
        self._build_test_cases_sheet(ws, passed_cases)
        wb.save(filepath)
        return filepath

    def generate_failed_report(self, test_results):
        filepath = os.path.join(self.output_dir, "Failed_Test_Cases.xlsx")
        wb = openpyxl.Workbook()
        ws = wb.active
        ws.title = "Failed Test Cases"
        failed_cases = [tc for tc in test_results if tc.get("status") == "FAIL"]
        self._build_test_cases_sheet(ws, failed_cases)
        wb.save(filepath)
        return filepath

    def generate_summary_report(self, metrics):
        filepath = os.path.join(self.output_dir, "Execution_Summary.xlsx")
        wb = openpyxl.Workbook()
        ws = wb.active
        ws.title = "Execution Summary"
        self._build_metrics_sheet(ws, metrics)
        wb.save(filepath)
        return filepath

    def _build_test_cases_sheet(self, ws, test_cases):
        headers = ["Test ID", "Module", "Test Name", "Priority", "Status", "Execution Time (s)", "Expected Result", "Actual Result / Error"]
        ws.append(headers)
        
        header_fill = PatternFill(start_color="1E293B", end_color="1E293B", fill_type="solid")
        header_font = Font(name="Segoe UI", size=11, bold=True, color="FFFFFF")
        
        for col_num, header in enumerate(headers, 1):
            cell = ws.cell(row=1, column=col_num)
            cell.fill = header_fill
            cell.font = header_font
            cell.alignment = Alignment(horizontal="center", vertical="center")

        thin_border = Border(left=Side(style='thin', color='CBD5E1'),
                             right=Side(style='thin', color='CBD5E1'),
                             top=Side(style='thin', color='CBD5E1'),
                             bottom=Side(style='thin', color='CBD5E1'))

        for row_idx, tc in enumerate(test_cases, 2):
            status = tc.get("status", "PASS")
            ws.append([
                tc.get("test_id", f"TC_{row_idx}"),
                tc.get("module", "General"),
                tc.get("name", "Test Case"),
                tc.get("priority", "P2"),
                status,
                round(tc.get("duration", 0.05), 3),
                tc.get("expected", "Passes criteria"),
                tc.get("error", "Executed successfully") if status == "FAIL" else tc.get("actual", "Success")
            ])
            
            # Formatting status cell
            status_cell = ws.cell(row=row_idx, column=5)
            if status == "PASS":
                status_cell.fill = PatternFill(start_color="D1FAE5", end_color="D1FAE5", fill_type="solid")
                status_cell.font = Font(name="Segoe UI", bold=True, color="065F46")
            elif status == "FAIL":
                status_cell.fill = PatternFill(start_color="FEE2E2", end_color="FEE2E2", fill_type="solid")
                status_cell.font = Font(name="Segoe UI", bold=True, color="991B1B")
            else:
                status_cell.fill = PatternFill(start_color="FEF3C7", end_color="FEF3C7", fill_type="solid")
                status_cell.font = Font(name="Segoe UI", bold=True, color="92400E")

            for col in range(1, 9):
                ws.cell(row=row_idx, column=col).border = thin_border

        # Adjust column widths
        widths = [14, 24, 38, 12, 12, 18, 30, 45]
        for idx, width in enumerate(widths, 1):
            col_letter = openpyxl.utils.get_column_letter(idx)
            ws.column_dimensions[col_letter].width = width

    def _build_metrics_sheet(self, ws, metrics):
        ws.title = "Execution Metrics"
        ws.merge_cells("A1:D2")
        title_cell = ws["A1"]
        title_cell.value = "ENTERPRISE APPIUM AUTOMATION METRICS"
        title_cell.font = Font(name="Segoe UI", size=14, bold=True, color="FFFFFF")
        title_cell.fill = PatternFill(start_color="0F172A", end_color="0F172A", fill_type="solid")
        title_cell.alignment = Alignment(horizontal="center", vertical="center")

        data = [
            ["Execution Timestamp", datetime.now().strftime("%Y-%m-%d %H:%M:%S")],
            ["Target Application", "Image Authenticity Verifier (Android)"],
            ["Target Package", metrics.get("package", "com.imageauth.verifier")],
            ["Automation Engine", "Appium UiAutomator2"],
            ["Total Test Cases", metrics.get("total", 0)],
            ["Passed Test Cases", metrics.get("passed", 0)],
            ["Failed Test Cases", metrics.get("failed", 0)],
            ["Skipped Test Cases", metrics.get("skipped", 0)],
            ["Pass Percentage", f"{metrics.get('pass_rate', 0)}%"],
            ["Total Execution Time", f"{metrics.get('duration_s', 0)} seconds"]
        ]

        for idx, (label, val) in enumerate(data, 4):
            ws.cell(row=idx, column=1, value=label).font = Font(name="Segoe UI", bold=True)
            ws.cell(row=idx, column=2, value=val).font = Font(name="Segoe UI")

        ws.column_dimensions["A"].width = 28
        ws.column_dimensions["B"].width = 40

    def _build_defect_sheet(self, ws, failed_cases):
        headers = ["Defect ID", "Test Case ID", "Module", "Failure Summary", "Stack Trace / Log"]
        ws.append(headers)
        for idx, tc in enumerate(failed_cases, 1):
            ws.append([
                f"DEF_{idx:03d}",
                tc.get("test_id"),
                tc.get("module"),
                tc.get("name"),
                tc.get("error", "Assertion Failure")
            ])
        ws.column_dimensions["A"].width = 14
        ws.column_dimensions["B"].width = 16
        ws.column_dimensions["C"].width = 24
        ws.column_dimensions["D"].width = 36
        ws.column_dimensions["E"].width = 50

    def _build_pass_rate_sheet(self, ws, metrics, test_results):
        ws.append(["Module Name", "Total", "Passed", "Failed", "Pass Rate (%)"])
        
        module_stats = {}
        for tc in test_results:
            mod = tc.get("module", "General")
            if mod not in module_stats:
                module_stats[mod] = {"total": 0, "passed": 0, "failed": 0}
            module_stats[mod]["total"] += 1
            if tc.get("status") == "PASS":
                module_stats[mod]["passed"] += 1
            elif tc.get("status") == "FAIL":
                module_stats[mod]["failed"] += 1

        for mod, stats in module_stats.items():
            tot = stats["total"]
            pas = stats["passed"]
            rate = round((pas / tot) * 100, 2) if tot > 0 else 0
            ws.append([mod, tot, pas, stats["failed"], f"{rate}%"])

        ws.column_dimensions["A"].width = 30
        ws.column_dimensions["B"].width = 12
        ws.column_dimensions["C"].width = 12
        ws.column_dimensions["D"].width = 12
        ws.column_dimensions["E"].width = 16
