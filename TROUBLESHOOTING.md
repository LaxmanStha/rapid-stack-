# Troubleshooting Guide for Login and Signup Issues

## 1. Verify Database Setup

### Check if Apache and MySQL are Running
1. Open XAMPP Control Panel
2. Ensure Apache and MySQL services are running (should be green)
3. If not, click "Start" for both services

### Create Database and Tables
Open your browser and navigate to:
```
http://localhost/RSB/setup/create_database.php
```
This should create the database `phy_project_db` and tables `users` and `sessions`.

### Test Database Connection
Open your browser and navigate to:
```
http://localhost/RSB/test_db_connection.php
```
This will:
- Verify if the database connection works
- Check if tables exist
- Show number of existing users
- Let you test signup functionality directly

## 2. Test Signup Functionality

### Using the Test Form
1. Open `http://localhost/RSB/test_db_connection.php`
2. Fill out the test form (or use default values)
3. Click "Test Signup"
4. Check the results for success or error messages

### Using the Frontend
1. Open `http://localhost/RSB/public/index.html`
2. Click "Create Account" to switch to signup panel
3. Fill in valid details:
   - Name (at least 2 characters)
   - Email (valid format)
   - Password (at least 6 characters)
4. Check "I agree to the Terms of Service"
5. Click "Sign Up"

## 3. Common Issues and Fixes

### Database Connection Errors
- **Problem**: "Database connection failed"
- **Solution**: Check if MySQL service is running in XAMPP

### Table Not Found Errors
- **Problem**: "Table 'phy_project_db.users' doesn't exist"
- **Solution**: Run the setup script at `http://localhost/RSB/setup/create_database.php`

### Email Already Exists
- **Problem**: "Email already registered"
- **Solution**: Use a different email address

### Invalid Input Errors
- **Problem**: Validation errors like "Name must be at least 2 characters"
- **Solution**: Ensure all fields meet the requirements

## 4. Check Browser Console for Errors

### Open Developer Tools
- Chrome: F12 or Ctrl+Shift+I
- Firefox: F12 or Ctrl+Shift+I
- Safari: Cmd+Option+I

### Look for Errors
1. Check the "Console" tab for JavaScript errors
2. Check the "Network" tab for API request failures
3. Look for CORS or 404 errors (not found)

## 5. Verify API Base URL

The API base URL is configured in `public/app.js`:
```javascript
const API_BASE = window.location.origin + '/RSB/api';
```

Ensure this matches your actual project path.

## 6. Check Error Logs

### Apache Error Logs
- Location: `C:\xampp\apache\logs\error.log`

### MySQL Error Logs  
- Location: `C:\xampp\mysql\data\mysql_error.log`

## 7. If All Else Fails

1. Stop Apache and MySQL in XAMPP
2. Restart XAMPP
3. Re-run the database setup
4. Clear browser cache and localStorage
5. Test again

---

**Note**: The test scripts `test_db_connection.php` and `test_signup.php` are for debugging purposes only. They should be removed from production environments.
