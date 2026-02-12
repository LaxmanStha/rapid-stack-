<?php
/**
 * Test Signup Script
 * Directly tests the User::create() method
 */

header('Content-Type: text/html; charset=utf-8');

require_once __DIR__ . '/models/User.php';

echo "<h2>Signup Test Results</h2>";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = trim($_POST['name'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';
    
    echo "<p><strong>Attempting to create user:</strong></p>";
    echo "<p>Name: $name</p>";
    echo "<p>Email: $email</p>";
    echo "<p>Password: " . str_repeat('*', strlen($password)) . "</p>";
    
    try {
        $user = new User();
        $result = $user->create($name, $email, $password);
        
        if ($result['success']) {
            echo "<p style='color: green; font-weight: bold;'>✓ Signup successful!</p>";
            echo "<p><strong>User Data:</strong></p>";
            echo "<pre>" . print_r($result['user'], true) . "</pre>";
        } else {
            echo "<p style='color: red; font-weight: bold;'>✗ Signup failed: " . $result['error'] . "</p>";
        }
    } catch (Exception $e) {
        echo "<p style='color: red; font-weight: bold;'>✗ Error: " . $e->getMessage() . "</p>";
        echo "<p><strong>Stack Trace:</strong></p>";
        echo "<pre>" . $e->getTraceAsString() . "</pre>";
    }
} else {
    echo "<p style='color: red;'>✗ Please submit the form from test_db_connection.php</p>";
}

echo "<p><a href='test_db_connection.php'>← Back to Connection Test</a></p>";
