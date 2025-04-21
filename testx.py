import time
import requests
from datetime import datetime
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

# Customize Your Buy Order Here
STOCK_NAME = "nmic"
STOCK_QUANTITY = "1000"
BUY_PRICE = "342.4"

# Constants
CHROME_DRIVER_PATH = "/opt/homebrew/bin/chromedriver"
TMS_URL = "https://tms64.nepsetms.com.np/tms/client/dashboard"
DEBUGGER_PORT = "localhost:9222"

def get_debugger_url():
    try:
        response = requests.get("http://localhost:9222/json", timeout=2)
        pages = response.json()
        return pages[0]['webSocketDebuggerUrl'] if pages else None
    except:
        return None

def extract_value(element):
    try:
        full_text = element.text
        if 'LTP' in full_text:
            return float(full_text.split('LTP')[1].split('(')[0].strip().replace(',', ''))
        return float(full_text.split()[-1].strip().replace(',', ''))  # Last number as fallback
    except:
        return None

def set_element_value(driver, xpath, value):
    element = driver.find_element(By.XPATH, xpath)
    driver.execute_script(f"""
        arguments[0].value = '{value}';
        arguments[0].dispatchEvent(new Event('input'));
        arguments[0].dispatchEvent(new Event('change'));
        arguments[0].removeAttribute('disabled');
        arguments[0].setAttribute('readonly', 'true');
    """, element)
    driver.execute_script(f"""
        window.priceLock = window.priceLock || {{}};
        if (window.priceLock['{xpath}']) clearInterval(window.priceLock['{xpath}']);
        window.priceLock['{xpath}'] = setInterval(() => {{
            let el = document.evaluate("{xpath}", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            if (el && el.value !== '{value}') el.value = '{value}';
        }}, 1);
    """)
    return element

def ensure_unblurred(driver, wait):
    unblur_element = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, ".box-order-entry.box-indeterminate")))
    if "blur" in unblur_element.get_attribute("class").lower():
        driver.execute_script("arguments[0].setAttribute('class', 'box-order-entry box-indeterminate');", unblur_element)
        time.sleep(0.1)

def setup_order_form(driver, wait):
    driver.get(TMS_URL)
    wait.until(EC.presence_of_element_located((By.TAG_NAME, "body")))

    for xpath in [
        "/html/body/app-root/tms/app-menubar/aside/nav/ul/li[10]/a/span",
        "/html/body/app-root/tms/app-menubar/aside/nav/ul/li[10]/ul/li[1]/a/span"
    ]:
        wait.until(EC.element_to_be_clickable((By.XPATH, xpath))).click()

    ensure_unblurred(driver, wait)
    wait.until(EC.element_to_be_clickable((
        By.XPATH, "/html/body/app-root/tms/main/div/div/app-member-client-order-entry/div/div/div[1]/div[2]/app-three-state-toggle/div/div/label[3]"
    ))).click()

    price_xpath = "/html/body/app-root/tms/main/div/div/app-member-client-order-entry/div/div/div[3]/form/div[2]/div[4]/input"
    set_element_value(driver, "/html/body/app-root/tms/main/div/div/app-member-client-order-entry/div/div/div[3]/form/div[2]/div[2]/input", STOCK_NAME)
    driver.execute_script("arguments[0].click();", wait.until(EC.element_to_be_clickable((
        By.XPATH, "/html/body/app-root/tms/main/div/div/app-member-client-order-entry/div/div/div[3]/form/div[2]/div[2]/typeahead-container/button/span"
    ))))
    set_element_value(driver, "/html/body/app-root/tms/main/div/div/app-member-client-order-entry/div/div/div[3]/form/div[2]/div[3]/input", STOCK_QUANTITY)
    set_element_value(driver, price_xpath, BUY_PRICE)

    # Cache elements for speed
    low_element = driver.find_element(By.XPATH, "//label[text()='Low']/parent::div")
    high_element = driver.find_element(By.XPATH, "//label[text()='High']/parent::div")
    buy_button = driver.find_element(By.XPATH, "/html/body/app-root/tms/main/div/div/app-member-client-order-entry/div/div/div[3]/form/div[3]/div[2]/button[1]")
    driver.execute_script("arguments[0].removeAttribute('disabled');", buy_button)

    return low_element, high_element, buy_button

def monitor_and_execute(driver, low_element, high_element, buy_button):
    price_target = float(BUY_PRICE)
    print(f"Monitoring Low <= {price_target} <= High at {datetime.now()}")
    while True:
        try:
            low = extract_value(low_element)
            high = extract_value(high_element)
            if low is not None and high is not None and low <= price_target <= high:
                start_time = time.perf_counter()
                driver.execute_script("arguments[0].click();", buy_button)
                end_time = time.perf_counter()
                print(f"Executed at {datetime.now()} - Time: {(end_time - start_time) * 1000:.3f} ms")
                break
        except:
            pass  # Skip errors for speed
        time.sleep(0.000001)  # 1µs for max speed

def main():
    driver = None
    try:
        debugger_url = get_debugger_url()
        if not debugger_url:
            raise Exception("Run Chrome with --remote-debugging-port=9222 first and log into TMS")
        print(f"Starting: {datetime.now()} - Debugger URL: {debugger_url}")

        chrome_options = Options()
        chrome_options.debugger_address = DEBUGGER_PORT
        chrome_options.add_argument("--disable-gpu")
        chrome_options.add_argument("--no-sandbox")

        driver = webdriver.Chrome(service=Service(CHROME_DRIVER_PATH), options=chrome_options)
        # driver = webdriver.Chrome('/home/user/drivers/chromedriver')
        driver.maximize_window()
        wait = WebDriverWait(driver, 10)

        # Pre-fill form once
        low_element, high_element, buy_button = setup_order_form(driver, wait)

        # Loop for repeated orders
        while True:
            monitor_and_execute(driver, low_element, high_element, buy_button)
            choice = input("Place another order? (y/n): ").strip().lower()
            if choice != 'y':
                break
            # Refresh elements for next run
            low_element = driver.find_element(By.XPATH, "//label[text()='Low']/parent::div")
            high_element = driver.find_element(By.XPATH, "//label[text()='High']/parent::div")
            buy_button = driver.find_element(By.XPATH, "/html/body/app-root/tms/main/div/div/app-member-client-order-entry/div/div/div[3]/form/div[3]/div[2]/button[1]")
            driver.execute_script("arguments[0].removeAttribute('disabled');", buy_button)

    except Exception as e:
        print(f"Error: {e}")
    finally:
        if driver:
            driver.execute_script("if (window.priceLock) Object.values(window.priceLock).forEach(id => clearInterval(id));")
        print("Done - Chrome remains open")

if __name__ == "__main__":
    main()