<?php
/**
 * Test Database Connection Script
 * This script helps diagnose database connectivity issues
 */

require_once __DIR__ . '/config/database.php';

echo "<h2>Database Connection Test</h2>";

try {
    $database = new Database();
    $conn = $database->getConnection();
    echo "<p style='color: green;'>✓ Database connection successful!</p>";
    
    // Check if users table exists
    $stmt = $conn->query("SHOW TABLES LIKE 'users'");
    if ($stmt->rowCount() > 0) {
        echo "<p style='color: green;'>✓ Users table exists!</p>";
    } else {
        echo "<p style='color: red;'>✗ Users table does NOT exist!</p>";
    }
    
    // Check if sessions table exists
    $stmt = $conn->query("SHOW TABLES LIKE 'sessions'");
    if ($stmt->rowCount() > 0) {
        echo "<p style='color: green;'>✓ Sessions table exists!</p>";
    } else {
        echo "<p style='color: red;'>✗ Sessions table does NOT exist!</p>";
    }
    
    // Count existing users
    $stmt = $conn->query("SELECT COUNT(*) as count FROM users");
    $count = $stmt->fetch()['count'];
    echo "<p>Number of existing users: <strong>$count</strong></p>";
    
} catch (Exception $e) {
    echo "<p style='color: red;'>✗ Error: " . $e->getMessage() . "</p>";
}

echo "<h3>Testing Signup API Directly</h3>";
?>

<form method="post" action="test_signup.php">
    <div>
        <label>Name: </label>
        <input type="text" name="name" required value="Test User">
    </div>
    <div>
        <label>Email: </label>
        <input type="email" name="email" required value="test@example.com">
    </div>
    <div>
        <label>Password: </label>
        <input type="password" name="password" required value="password123">
    </div>
    <button type="submit">Test Signup</button>
</form>
