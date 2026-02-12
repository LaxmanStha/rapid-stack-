# Physics Project — PHP Login System

A modern, polished login/signup interface with a PHP backend and MySQL database.

## 🚀 Quick Start

### Prerequisites
- **PHP 7.4+** (with PDO MySQL extension)
- **MySQL 5.7+** or **MariaDB 10.3+**

### 1. Setup Database

Create the MySQL database and tables:

```bash
cd php-backend
php setup/create_database.php
```

Or manually create the database:

```sql
CREATE DATABASE phy_project_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Configure Environment

Edit `config/database.php` if your MySQL credentials differ from defaults:
- **Host:** `localhost`
- **User:** `root`
- **Password:** *(empty)*
- **Database:** `phy_project_db`
- **Port:** `3306`

### 3. Start Development Server

```bash
cd php-backend
php -S localhost:8000 index.php
```

### 4. Open in Browser

Navigate to [http://localhost:8000](http://localhost:8000)

## 📁 Project Structure

```
php-backend/
├── index.php              # Main router / entry point
├── config/
│   └── database.php       # Database connection (PDO)
├── models/
│   └── User.php           # User model (CRUD, auth)
├── api/
│   ├── login.php          # POST /api/login.php
│   ├── signup.php         # POST /api/signup.php
│   ├── logout.php         # POST /api/logout.php
│   ├── verify.php         # POST /api/verify.php
│   └── google_login.php   # POST /api/google_login.php
├── setup/
│   ├── create_database.php      # Database initialization script
│   ├── update_database.php      # Google login fields update script
│   └── GOOGLE_LOGIN_SETUP.md    # Google login setup instructions
├── public/
│   ├── index.html         # Main HTML (login/signup/dashboard)
│   ├── styles.css         # Modern dark theme CSS
│   └── app.js             # Frontend JavaScript
└── README.md
```

## 🔒 Security Features

- **Password hashing** with `bcrypt` (cost factor 12)
- **Prepared statements** (PDO) to prevent SQL injection
- **Input validation** on both client and server side
- **Session tokens** with expiration (7 days)
- **CORS headers** for API security
- **No sensitive data** exposed in error messages

## 🎨 UI Features

- Dark theme with glassmorphism effects
- Animated particle background
- Smooth panel transitions
- Password strength indicator
- Password visibility toggle
- Responsive design (mobile-friendly)
- Google Login integration (working)
- Social login buttons (UI only for Facebook)
- Loading states with spinners
- Error shake animations

## 🔐 Google Login Integration

### Setup Instructions
1. Follow the detailed setup guide in `setup/GOOGLE_LOGIN_SETUP.md`
2. Create Google OAuth 2.0 credentials
3. Install dependencies with `composer install`
4. Update database schema
5. Configure your Google Client ID

### POST `/api/google_login.php`
```json
{
  "id_token": "google-id-token"
}
```

##  API Endpoints

### POST `/api/signup.php`
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepass123"
}
```

### POST `/api/login.php`
```json
{
  "email": "john@example.com",
  "password": "securepass123"
}
```

### POST `/api/logout.php`
```json
{
  "token": "your-session-token"
}
```

### POST `/api/verify.php`
```json
{
  "token": "your-session-token"
}
```
