import pytest
from automation.data.test_data_generator import TestDataGenerator

ALL_TEST_CASES = TestDataGenerator.generate_all_420_test_cases()

def get_cases_for_module(module_name):
    return [tc for tc in ALL_TEST_CASES if tc["module"] == module_name]

# 1. Authentication (40)
def test_01_authentication():
    cases = get_cases_for_module("Authentication")
    assert len(cases) == 40
    return cases

# 2. Authorization (30)
def test_02_authorization():
    cases = get_cases_for_module("Authorization")
    assert len(cases) == 30
    return cases

# 3. Registration (20)
def test_03_registration():
    cases = get_cases_for_module("Registration")
    assert len(cases) == 20
    return cases

# 4. Profile Management (20)
def test_04_profile_management():
    cases = get_cases_for_module("Profile Management")
    assert len(cases) == 20
    return cases

# 5. Navigation (30)
def test_05_navigation():
    cases = get_cases_for_module("Navigation")
    assert len(cases) == 30
    return cases

# 6. Dashboard (20)
def test_06_dashboard():
    cases = get_cases_for_module("Dashboard")
    assert len(cases) == 20
    return cases

# 7. Forms (40)
def test_07_forms():
    cases = get_cases_for_module("Forms")
    assert len(cases) == 40
    return cases

# 8. CRUD Operations (40)
def test_08_crud_operations():
    cases = get_cases_for_module("CRUD Operations")
    assert len(cases) == 40
    return cases

# 9. Search (20)
def test_09_search():
    cases = get_cases_for_module("Search")
    assert len(cases) == 20
    return cases

# 10. Filters (20)
def test_10_filters():
    cases = get_cases_for_module("Filters")
    assert len(cases) == 20
    return cases

# 11. Input Validation (40)
def test_11_input_validation():
    cases = get_cases_for_module("Input Validation")
    assert len(cases) == 40
    return cases

# 12. Error Handling (20)
def test_12_error_handling():
    cases = get_cases_for_module("Error Handling")
    assert len(cases) == 20
    return cases

# 13. Session Management (20)
def test_13_session_management():
    cases = get_cases_for_module("Session Management")
    assert len(cases) == 20
    return cases

# 14. Notifications (20)
def test_14_notifications():
    cases = get_cases_for_module("Notifications")
    assert len(cases) == 20
    return cases

# 15. File Upload (20)
def test_15_file_upload():
    cases = get_cases_for_module("File Upload")
    assert len(cases) == 20
    return cases

# 16. Offline Handling (10)
def test_16_offline_handling():
    cases = get_cases_for_module("Offline Handling")
    assert len(cases) == 10
    return cases

# 17. Accessibility (20)
def test_17_accessibility():
    cases = get_cases_for_module("Accessibility")
    assert len(cases) == 20
    return cases

# 18. Responsive UI (10)
def test_18_responsive_ui():
    cases = get_cases_for_module("Responsive UI")
    assert len(cases) == 10
    return cases

# 19. Performance Smoke (20)
def test_19_performance_smoke():
    cases = get_cases_for_module("Performance Smoke")
    assert len(cases) == 20
    return cases

# 20. Regression Suite (50)
def test_20_regression_suite():
    cases = get_cases_for_module("Regression Suite")
    assert len(cases) == 50
    return cases
