from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.alert import Alert
import time

# Create a new instance of the Edge driver
options = webdriver.EdgeOptions()
options.add_argument("--ignore-certificate-errors")
options.add_argument("--ignore-ssl-errors")

driver = webdriver.Edge(options=options)

# Maximize the browser window
driver.maximize_window()

# Test case: Successful login
def test_successful_login():
    driver.get("http://localhost:3000/login")  # Replace with your web application URL

    # Find the email and password input fields and enter valid credentials
    email_input = driver.find_element(By.CSS_SELECTOR, 'input[type="email"]')
    password_input = driver.find_element(By.CSS_SELECTOR, 'input[type="password"]')

    email_input.send_keys("karishram111@gmail.com")  # Replace with a valid email
    password_input.send_keys("123456")  # Replace with a valid password

    # Submit the login form
    password_input.submit()

    # Wait for the calendar page to load
    wait = WebDriverWait(driver, 10)
    wait.until(EC.url_to_be("http://localhost:3000/calendar"))  # Replace with the URL of the calendar page

    # Print the current URL for debugging
    print("Current URL:", driver.current_url)

    # Check if the user is redirected to the calendar page
    assert driver.current_url == "http://localhost:3000/calendar"  # Replace with the URL of the calendar page

    print("TEST CASE FOR LOGIN PASSED")

# Test case: Click "Add Event" button
def test_add_event():
    # Find the "Add Event" button
    time.sleep(2)
    add_event_button = driver.find_element(By.XPATH, '/html/body/div/div/div/div[1]/header/nav/button[2]')
    
    # Click the "Add Event" button
    add_event_button.click()

    # Wait for the "Add Event" form to appear
    wait = WebDriverWait(driver, 20)  # Increased wait time to 20 seconds
    wait.until(EC.visibility_of_element_located((By.XPATH, '/html/body/div[2]/div[3]/div/h2')))
    
    #EVENT TITLE
    # Click the dropdown element
    dropdown_element = driver.find_element(By.XPATH, '/html/body/div[2]/div[3]/div/div[1]/div/div')
    
    # Add a delay of 2 seconds before clicking the dropdown element
    time.sleep(1)
    
    dropdown_element.click()

    # Click another element after clicking the dropdown
    other_element = driver.find_element(By.XPATH, '/html/body/div[3]/div[3]/ul/li[2]')
    other_element.click()
    time.sleep(1)

    #YEAR
    # Click the dropdown element
    dropdown_element = driver.find_element(By.XPATH, '/html/body/div[2]/div[3]/div/div[2]/div/div')
    
    # Add a delay of 2 seconds before clicking the dropdown element
    time.sleep(1)
    
    dropdown_element.click()

    # Click another element after clicking the dropdown
    other_element = driver.find_element(By.XPATH, '/html/body/div[3]/div[3]/ul/li[2]')
    other_element.click()
    time.sleep(1)

    #CLASS
    # Click the dropdown element
    dropdown_element = driver.find_element(By.XPATH, '/html/body/div[2]/div[3]/div/div[3]/div/div')
    
    # Add a delay of 2 seconds before clicking the dropdown element
    time.sleep(1)
    
    dropdown_element.click()

    # Click another element after clicking the dropdown
    other_element = driver.find_element(By.XPATH, '/html/body/div[3]/div[3]/ul/li[2]')
    other_element.click()
    time.sleep(1)

    #DATE
    # Click the date text box
    date_text_box = driver.find_element(By.XPATH, '/html/body/div[2]/div[3]/div/div[4]/div/div/div/input')
    date_text_box.click()

    # Enter the date "06162023"
    date_text_box.send_keys("06162023")
    time.sleep(1)

    #TIME
    # Click the TIME text box
    time_text_box = driver.find_element(By.XPATH, '/html/body/div[2]/div[3]/div/div[5]/div/div/div/input')
    time_text_box.click()

    # Enter the date "0910AM"
    time_text_box.send_keys("0910AM")
    time.sleep(1)

    #DATE
    # Click the date text box
    date_text_box = driver.find_element(By.XPATH, '/html/body/div[2]/div[3]/div/div[6]/div/div/div/input')
    date_text_box.click()

    # Enter the date "06162023"
    date_text_box.send_keys("06162023")
    time.sleep(1)

    #TIME
    # Click the TIME text box
    time_text_box = driver.find_element(By.XPATH, '/html/body/div[2]/div[3]/div/div[7]/div/div/div/input')
    time_text_box.click()

    # Enter the time "1110AM"
    time_text_box.send_keys("1110AM")
    time.sleep(1)

    #COLOUR
    # Click the dropdown element
    dropdown_element = driver.find_element(By.XPATH, '/html/body/div[2]/div[3]/div/div[8]/div/div')
    
    # Add a delay of 2 seconds before clicking the dropdown element
    time.sleep(1)
    
    dropdown_element.click()

    # Click another element after clicking the dropdown
    other_element = driver.find_element(By.XPATH, '/html/body/div[3]/div[3]/ul/li[2]')
    other_element.click()
    time.sleep(1)

    # Find the "Add Event" button
    add_event_button = driver.find_element(By.XPATH, '/html/body/div[2]/div[3]/div/div[9]/button')

    # Wait for the "Add Event" button to be clickable
    wait = WebDriverWait(driver, 10)
    add_event_button = wait.until(EC.element_to_be_clickable((By.XPATH, '/html/body/div[2]/div[3]/div/div[9]/button')))

    # Add a slight delay before clicking the button
    time.sleep(1)

    # Click the "Add Event" button
    add_event_button.click()
    time.sleep(4)


    print("TEST CASE FOR ADD EVENT PASSED")

# Test case: Update Event
def test_update_event():
    # Find the event element to update
    event_element = driver.find_element(By.XPATH, '/html/body/div/div/div/div[2]/div[1]/div/div[2]/div[4]/div[2]/div[2]/div[5]/div/div')

    # Click on the event element to open event details
    event_element.click()

    # Wait for the event details to appear
    wait = WebDriverWait(driver, 10)
    wait.until(EC.visibility_of_element_located((By.XPATH, '/html/body/div[2]/div[3]/div/h2')))
    time.sleep(1)

    # Find the "Update Event" button
    update_event_button = driver.find_element(By.XPATH, '/html/body/div[2]/div[3]/div/div[2]/button[2]')

    # Click the "Update Event" button
    update_event_button.click()
    time.sleep(1)

    #EVENT TITLE
    # Click the dropdown element
    dropdown_element = driver.find_element(By.XPATH, '/html/body/div[2]/div[3]/div/div[1]/div/div')
    
    # Add a delay of 2 seconds before clicking the dropdown element
    time.sleep(1)
    
    dropdown_element.click()

    # Click another element after clicking the dropdown
    other_element = driver.find_element(By.XPATH, '/html/body/div[3]/div[3]/ul/li[6]')
    other_element.click()
    time.sleep(1)

    #YEAR
    # Click the dropdown element
    dropdown_element = driver.find_element(By.XPATH, '/html/body/div[2]/div[3]/div/div[2]/div/div')
    
    # Add a delay of 2 seconds before clicking the dropdown element
    time.sleep(1)
    
    dropdown_element.click()

    # Click another element after clicking the dropdown
    other_element = driver.find_element(By.XPATH, '/html/body/div[3]/div[3]/ul/li[2]')
    other_element.click()
    time.sleep(1)

    #CLASS
    # Click the dropdown element
    dropdown_element = driver.find_element(By.XPATH, '/html/body/div[2]/div[3]/div/div[3]/div/div')
    
    # Add a delay of 2 seconds before clicking the dropdown element
    time.sleep(1)
    
    dropdown_element.click()

    # Click another element after clicking the dropdown
    other_element = driver.find_element(By.XPATH, '/html/body/div[3]/div[3]/ul/li[2]')
    other_element.click()
    time.sleep(1)


 

    # Find the "UPDATE Event" button
    add_event_button = driver.find_element(By.XPATH, '/html/body/div[2]/div[3]/div/div[9]/button')

    # Wait for the "UPDATE Event" button to be clickable
    wait = WebDriverWait(driver, 10)
    add_event_button = wait.until(EC.element_to_be_clickable((By.XPATH, '/html/body/div[2]/div[3]/div/div[9]/button')))

    # Add a slight delay before clicking the button
    time.sleep(1)

    # Click the "UPDATE Event" button
    add_event_button.click()
    time.sleep(4)

    print("TEST CASE FOR UPDATE EVENT PASSED")



def test_delete_event():
    # Find the event element to update
    event_element = driver.find_element(By.XPATH, '/html/body/div/div/div/div[2]/div[1]/div/div[2]/div[4]/div[2]/div[2]/div[5]/div/div')

    # Click on the event element to open event details
    event_element.click()

    # Wait for the event details to appear
    wait = WebDriverWait(driver, 10)
    wait.until(EC.visibility_of_element_located((By.XPATH, '/html/body/div[2]/div[3]/div/h2')))
    time.sleep(1)

    # Find the "Update Event" button
    update_event_button = driver.find_element(By.XPATH, '/html/body/div[2]/div[3]/div/div[2]/button[1]')

    # Click the "Update Event" button
    update_event_button.click()
    time.sleep(1)

    # Switch to the confirmation alert
    alert = Alert(driver)
    
    # Wait for the alert to appear
    wait.until(EC.alert_is_present())

    # Accept the alert (press OK)
    alert.accept()
    time.sleep(1)

    print("TEST CASE FOR REMOVE EVENT PASSED")


# Run the test cases
test_successful_login()
test_add_event()
test_update_event()
test_delete_event()

# Close the browser
driver.quit()