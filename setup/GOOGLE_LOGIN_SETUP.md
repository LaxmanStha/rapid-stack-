# Google Login Setup Instructions

## Prerequisites

1. PHP 7.4 or later
2. Composer (for dependency management)
3. MySQL 5.7 or later
4. Google Cloud Platform account

## Step 1: Create Google OAuth 2.0 Credentials

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select an existing one)
3. Navigate to **API & Services > Credentials**
4. Click **Create Credentials > OAuth client ID**
5. Select **Web application** as the application type
6. Add authorized JavaScript origins: `http://localhost` and `http://localhost/RapidStack`
7. Add authorized redirect URIs: `http://localhost/RapidStack/api/google_login.php`
8. Click **Create** to generate your client ID and client secret

## Step 2: Install Dependencies

Run the following command to install the Google API Client library:

```bash
cd /path/to/your/project
composer install
```

## Step 3: Update Configuration

### 1. Update app.js
Replace `'YOUR_GOOGLE_CLIENT_ID_HERE'` with your actual Google Client ID:

```javascript
// In public/app.js
google.accounts.id.initialize({
    client_id: 'YOUR_ACTUAL_GOOGLE_CLIENT_ID',
    callback: handleGoogleCallback,
    auto_select: false,
    cancel_on_tap_outside: true
});
```

### 2. Update google_login.php
Replace `'YOUR_GOOGLE_CLIENT_ID_HERE'` with your actual Google Client ID:

```php
// In api/google_login.php
$client = new Google_Client(['client_id' => 'YOUR_ACTUAL_GOOGLE_CLIENT_ID']);
```

## Step 4: Update Database

### Option 1: Fresh Installation
Run the database setup script:

```bash
php setup/create_database.php
```

### Option 2: Existing Database
Run the update script to add Google login fields:

```bash
php setup/update_database.php
```

## Step 5: Test the Integration

1. Start your PHP development server:
   ```bash
   php -S localhost:8000 -t public
   ```

2. Open your browser and navigate to:
   ```
   http://localhost:8000
   ```

3. Click the **Continue with Google** button
4. You should see the Google Sign-In prompt
5. Sign in with your Google account
6. You should be logged in and redirected to the dashboard

## Troubleshooting

### Common Issues:

1. **Google API Client not found** - Ensure composer install completed successfully
2. **Invalid Client ID** - Double-check your client ID in both app.js and google_login.php
3. **Redirect URI mismatch** - Verify your authorized redirect URIs in the Google Cloud Console
4. **CORS errors** - Make sure your development server is running on the exact origin specified in your credentials
5. **Database connection errors** - Check your database configuration in config/database.php

### Debug Information:

- Check browser console for JavaScript errors
- Check server logs for PHP errors
- Enable debugging in config/database.php if needed

## Security Notes

1. Keep your Google Client ID and Client Secret confidential
2. Never commit these credentials to version control
3. Consider using environment variables for sensitive data
4. Implement proper error handling and logging

## Additional Resources

- [Google Sign-In for Web](https://developers.google.com/identity/sign-in/web)
- [Google API Client Library for PHP](https://github.com/googleapis/google-api-php-client)
- [OAuth 2.0 for Web Server Applications](https://developers.google.com/identity/protocols/oauth2/web-server)