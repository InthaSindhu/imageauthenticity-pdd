import ExcelJS from 'exceljs';
import fs from 'fs';
import path from 'path';

export class MobileExcelReporter {
  constructor(reportDir, reportFileName) {
    this.reportDir = reportDir;
    this.reportFilePath = path.join(reportDir, reportFileName);
  }

  async generateReport(resultsData) {
    if (!fs.existsSync(this.reportDir)) {
      fs.mkdirSync(this.reportDir, { recursive: true });
    }

    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Appium Mobile Automation Framework';
    workbook.created = new Date();

    const { summary, testCases, moduleMetrics } = resultsData;

    // 1. Executive Summary Sheet
    const summarySheet = workbook.addWorksheet('Executive Summary', {
      views: [{ showGridLines: true }]
    });
    this.buildSummarySheet(summarySheet, summary);

    // 2. Detailed Test Results Sheet
    const resultsSheet = workbook.addWorksheet('Mobile Test Results', {
      views: [{ showGridLines: true }]
    });
    this.buildResultsSheet(resultsSheet, testCases);

    // 3. Module Analysis Sheet
    const moduleSheet = workbook.addWorksheet('Module Analysis', {
      views: [{ showGridLines: true }]
    });
    this.buildModuleSheet(moduleSheet, moduleMetrics);

    await workbook.xlsx.writeFile(this.reportFilePath);
    return this.reportFilePath;
  }

  buildSummarySheet(sheet, summary) {
    sheet.columns = [
      { width: 5 },
      { width: 34 },
      { width: 22 },
      { width: 18 },
      { width: 20 }
    ];

    // Title Banner
    sheet.mergeCells('B2:E3');
    const titleCell = sheet.getCell('B2');
    titleCell.value = 'ANDROID MOBILE APP - APPIUM E2E TEST REPORT';
    titleCell.font = { name: 'Segoe UI', size: 16, bold: true, color: { argb: 'FFFFFF' } };
    titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
    titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '0F172A' } };

    // Subtitle
    sheet.mergeCells('B4:E4');
    const subCell = sheet.getCell('B4');
    subCell.value = `Generated on: ${new Date().toLocaleString()} | Framework: Node.js + Appium UiAutomator2`;
    subCell.font = { name: 'Segoe UI', size: 10, italic: true, color: { argb: '475569' } };
    subCell.alignment = { horizontal: 'center', vertical: 'middle' };

    // KPI Summary Cards
    const kpis = [
      { label: 'Total Mobile Tests', value: summary.totalTests, color: '3B82F6' },
      { label: 'Passed Tests', value: summary.passCount, color: '10B981' },
      { label: 'Failed Tests', value: summary.failCount, color: 'EF4444' },
      { label: 'Pass Rate (%)', value: `${summary.passRate}%`, color: summary.passRate >= 90 ? '10B981' : 'F59E0B' }
    ];

    let startCol = 2;
    kpis.forEach((kpi) => {
      const colLetter = String.fromCharCode(64 + startCol);
      
      const labelCell = sheet.getCell(`${colLetter}6`);
      labelCell.value = kpi.label;
      labelCell.font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: 'FFFFFF' } };
      labelCell.alignment = { horizontal: 'center', vertical: 'middle' };
      labelCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: kpi.color } };

      const valCell = sheet.getCell(`${colLetter}7`);
      valCell.value = kpi.value;
      valCell.font = { name: 'Segoe UI', size: 18, bold: true, color: { argb: '0F172A' } };
      valCell.alignment = { horizontal: 'center', vertical: 'middle' };
      valCell.border = {
        left: { style: 'thin', color: { argb: 'CBD5E1' } },
        right: { style: 'thin', color: { argb: 'CBD5E1' } },
        bottom: { style: 'thin', color: { argb: 'CBD5E1' } }
      };

      startCol++;
    });

    // Environment & App Details Table
    sheet.mergeCells('B10:E10');
    const envHeader = sheet.getCell('B10');
    envHeader.value = 'Android Device & Application Context';
    envHeader.font = { name: 'Segoe UI', size: 12, bold: true, color: { argb: '0F172A' } };
    envHeader.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'E2E8F0' } };
    envHeader.alignment = { horizontal: 'left', vertical: 'middle' };

    const details = [
      ['Target Android Package ID', summary.appPackage || 'com.imageauth.verifier'],
      ['Android APK Artifact', summary.apkPath || 'ImageAuthenticity-debug.apk'],
      ['Automation Driver', 'Appium (UiAutomator2 Engine)'],
      ['Target OS Platform', 'Android (Capacitor Native Shell)'],
      ['Total Test Duration', `${(summary.durationMs / 1000).toFixed(2)} seconds`],
      ['Node Runtime Version', process.version]
    ];

    details.forEach((row, idx) => {
      const rowNum = 11 + idx;
      sheet.mergeCells(`C${rowNum}:E${rowNum}`);
      
      const keyCell = sheet.getCell(`B${rowNum}`);
      keyCell.value = row[0];
      keyCell.font = { name: 'Segoe UI', size: 10, bold: true };
      keyCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'F8FAFC' } };
      keyCell.border = { bottom: { style: 'thin', color: { argb: 'E2E8F0' } }, right: { style: 'thin', color: { argb: 'E2E8F0' } } };

      const valCell = sheet.getCell(`C${rowNum}`);
      valCell.value = row[1];
      valCell.font = { name: 'Segoe UI', size: 10 };
      valCell.border = { bottom: { style: 'thin', color: { argb: 'E2E8F0' } } };
    });
  }

  buildResultsSheet(sheet, testCases) {
    sheet.columns = [
      { header: '#', key: 'id', width: 6 },
      { header: 'Mobile Module / Category', key: 'category', width: 26 },
      { header: 'Test Case Name', key: 'name', width: 36 },
      { header: 'Target Mobile Screen', key: 'route', width: 24 },
      { header: 'Status', key: 'status', width: 14 },
      { header: 'Duration (ms)', key: 'duration', width: 16 },
      { header: 'Timestamp', key: 'timestamp', width: 22 },
      { header: 'Error Diagnostics / Details', key: 'error', width: 50 }
    ];

    const headerRow = sheet.getRow(1);
    headerRow.height = 28;
    headerRow.eachCell((cell) => {
      cell.font = { name: 'Segoe UI', size: 11, bold: true, color: { argb: 'FFFFFF' } };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '0F172A' } };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
    });

    testCases.forEach((tc, idx) => {
      const row = sheet.addRow({
        id: idx + 1,
        category: tc.category,
        name: tc.name,
        route: tc.route,
        status: tc.status,
        duration: tc.duration,
        timestamp: tc.timestamp,
        error: tc.error || 'N/A'
      });

      row.height = 22;
      row.getCell('id').alignment = { horizontal: 'center', vertical: 'middle' };
      row.getCell('status').alignment = { horizontal: 'center', vertical: 'middle' };
      row.getCell('duration').alignment = { horizontal: 'right', vertical: 'middle' };
      row.getCell('timestamp').alignment = { horizontal: 'center', vertical: 'middle' };
      row.getCell('category').alignment = { horizontal: 'left', vertical: 'middle' };
      row.getCell('name').alignment = { horizontal: 'left', vertical: 'middle' };
      row.getCell('route').alignment = { horizontal: 'left', vertical: 'middle' };
      row.getCell('error').alignment = { horizontal: 'left', vertical: 'middle' };

      const statusCell = row.getCell('status');
      if (tc.status === 'PASS') {
        statusCell.font = { name: 'Segoe UI', bold: true, color: { argb: '065F46' } };
        statusCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'D1FAE5' } };
      } else if (tc.status === 'FAIL') {
        statusCell.font = { name: 'Segoe UI', bold: true, color: { argb: '991B1B' } };
        statusCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FEE2E2' } };
      } else {
        statusCell.font = { name: 'Segoe UI', bold: true, color: { argb: '92400E' } };
        statusCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FEF3C7' } };
      }

      if (idx % 2 === 1) {
        row.eachCell((cell, colNumber) => {
          if (colNumber !== 5) {
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'F8FAFC' } };
          }
        });
      }
    });
  }

  buildModuleSheet(sheet, moduleMetrics) {
    sheet.columns = [
      { header: '#', key: 'id', width: 6 },
      { header: 'Mobile Module / Feature Area', key: 'module', width: 34 },
      { header: 'Total Tests', key: 'total', width: 16 },
      { header: 'Passed', key: 'passed', width: 14 },
      { header: 'Failed', key: 'failed', width: 14 },
      { header: 'Pass Rate', key: 'passRate', width: 16 },
      { header: 'Avg Duration (ms)', key: 'avgDuration', width: 20 }
    ];

    const headerRow = sheet.getRow(1);
    headerRow.height = 28;
    headerRow.eachCell((cell) => {
      cell.font = { name: 'Segoe UI', size: 11, bold: true, color: { argb: 'FFFFFF' } };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '334155' } };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
    });

    Object.keys(moduleMetrics).forEach((modName, idx) => {
      const metrics = moduleMetrics[modName];
      const passRate = metrics.total > 0 ? Math.round((metrics.passed / metrics.total) * 100) : 0;
      const avgDuration = metrics.total > 0 ? Math.round(metrics.totalDuration / metrics.total) : 0;

      const row = sheet.addRow({
        id: idx + 1,
        module: modName,
        total: metrics.total,
        passed: metrics.passed,
        failed: metrics.failed,
        passRate: `${passRate}%`,
        avgDuration
      });

      row.height = 22;
      row.getCell('id').alignment = { horizontal: 'center', vertical: 'middle' };
      row.getCell('module').alignment = { horizontal: 'left', vertical: 'middle' };
      row.getCell('total').alignment = { horizontal: 'center', vertical: 'middle' };
      row.getCell('passed').alignment = { horizontal: 'center', vertical: 'middle' };
      row.getCell('failed').alignment = { horizontal: 'center', vertical: 'middle' };
      row.getCell('passRate').alignment = { horizontal: 'center', vertical: 'middle' };
      row.getCell('avgDuration').alignment = { horizontal: 'right', vertical: 'middle' };

      const passRateCell = row.getCell('passRate');
      passRateCell.font = { name: 'Segoe UI', bold: true, color: { argb: passRate === 100 ? '065F46' : '92400E' } };
    });
  }
}
