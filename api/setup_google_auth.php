<?php
/**
 * Setup Google Auth
 * Run this script once to update your database schema for Google Login
 */

require_once __DIR__ . '/../config/database.php';

echo "<h1>Setting up Google Authentication Database Support...</h1>";

try {
    $database = new Database();
    $db = $database->getConnection();
    
    // Check if google_id column exists
    $stmt = $db->query("SHOW COLUMNS FROM users LIKE 'google_id'");
    $exists = $stmt->fetch();
    
    if (!$exists) {
        echo "<p>Adding 'google_id' column to users table...</p>";
        $sql = "ALTER TABLE users ADD COLUMN google_id VARCHAR(255) NULL AFTER email";
        $db->exec($sql);
        echo "<p style='color:green'>✓ Added google_id column</p>";
    } else {
        echo "<p style='color:blue'>✓ google_id column already exists</p>";
    }
    
    // Check if avatar_url column exists
    $stmt = $db->query("SHOW COLUMNS FROM users LIKE 'avatar_url'");
    $exists = $stmt->fetch();
    
    if (!$exists) {
        echo "<p>Adding 'avatar_url' column to users table...</p>";
        $sql = "ALTER TABLE users ADD COLUMN avatar_url TEXT NULL AFTER avatar_color";
        $db->exec($sql);
        echo "<p style='color:green'>✓ Added avatar_url column</p>";
    } else {
        echo "<p style='color:blue'>✓ avatar_url column already exists</p>";
    }
    
    // Add index for fast lookup
    try {
        $db->exec("CREATE INDEX idx_google_id ON users(google_id)");
        echo "<p style='color:green'>✓ Added index on google_id</p>";
    } catch (PDOException $e) {
        // Index might already exist
        echo "<p style='color:blue'>✓ Index on google_id already exists or skipped</p>";
    }
    
    echo "<h2>Setup Complete! You can now use Google Login.</h2>";
    echo "<p><a href='../public/index.html'>Go to Login Page</a></p>";
    
} catch (PDOException $e) {
    echo "<h2 style='color:red'>Error: " . $e->getMessage() . "</h2>";
}
