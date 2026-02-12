<?php
/**
 * Test script to verify user database and table functionality
 */

require_once 'config/database.php';
require_once 'models/User.php';

echo "<h1>User Database Test</h1>";

try {
    // Test database connection
    $database = new Database();
    $conn = $database->getConnection();
    echo "<p style='color: green;'>✅ Database connection successful</p>";
    
    // Test users table exists
    $stmt = $conn->query("SHOW TABLES LIKE 'users'");
    if ($stmt->rowCount() > 0) {
        echo "<p style='color: green;'>✅ Users table exists</p>";
    } else {
        echo "<p style='color: red;'>❌ Users table does not exist</p>";
    }
    
    // Test inserting a test user
    echo "<h2>Testing User Creation</h2>";
    $user = new User();
    $testEmail = "test_" . time() . "@example.com";
    $result = $user->create(
        "Test User",
        $testEmail,
        "testpassword123"
    );
    
    if ($result['success']) {
        echo "<p style='color: green;'>✅ User created successfully: " . $testEmail . "</p>";
        
        // Test login
        echo "<h2>Testing User Login</h2>";
        $loginResult = $user->login($testEmail, "testpassword123");
        if ($loginResult['success']) {
            echo "<p style='color: green;'>✅ Login successful</p>";
            echo "<p><strong>User ID:</strong> " . $loginResult['user']['id'] . "</p>";
            echo "<p><strong>Name:</strong> " . $loginResult['user']['name'] . "</p>";
            echo "<p><strong>Email:</strong> " . $loginResult['user']['email'] . "</p>";
            echo "<p><strong>Token:</strong> " . $loginResult['token'] . "</p>";
            
            // Test finding user by email
            $foundUser = $user->findByEmail($testEmail);
            if ($foundUser) {
                echo "<h2>Testing User Lookup</h2>";
                echo "<p style='color: green;'>✅ User found by email</p>";
                echo "<p><strong>User Data:</strong></p>";
                echo "<pre>" . print_r($foundUser, true) . "</pre>";
            }
        } else {
            echo "<p style='color: red;'>❌ Login failed: " . $loginResult['error'] . "</p>";
        }
    } else {
        echo "<p style='color: red;'>❌ User creation failed: " . $result['error'] . "</p>";
    }
    
    // Test table structure
    echo "<h2>Users Table Structure</h2>";
    $stmt = $conn->query("DESCRIBE users");
    echo "<table border='1' cellpadding='5' cellspacing='0'>";
    echo "<tr><th>Field</th><th>Type</th><th>Null</th><th>Key</th><th>Default</th><th>Extra</th></tr>";
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        echo "<tr>";
        echo "<td>" . $row['Field'] . "</td>";
        echo "<td>" . $row['Type'] . "</td>";
        echo "<td>" . $row['Null'] . "</td>";
        echo "<td>" . $row['Key'] . "</td>";
        echo "<td>" . $row['Default'] . "</td>";
        echo "<td>" . $row['Extra'] . "</td>";
        echo "</tr>";
    }
    echo "</table>";
    
} catch (Exception $e) {
    echo "<p style='color: red;'>❌ Error: " . $e->getMessage() . "</p>";
}
