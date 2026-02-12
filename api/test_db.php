<?php
/**
 * Test API Endpoint - Check if water intake API is working
 */

header('Content-Type: application/json');

echo "Testing Water Intake API...\n\n";

// Test database connection
require_once __DIR__ . '/../config/database.php';

try {
    $database = new Database();
    $conn = $database->getConnection();
    echo "✓ Database connection successful\n";
    
    // Check if water_intake table exists
    $stmt = $conn->query("SHOW TABLES LIKE 'water_intake'");
    if ($stmt->rowCount() > 0) {
        echo "✓ water_intake table exists\n";
        
        // Count records
        $stmt = $conn->query("SELECT COUNT(*) as count FROM water_intake");
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        echo "✓ Total water intake records: " . $result['count'] . "\n";
    } else {
        echo "✗ water_intake table NOT found\n";
    }
    
    // Check if users table exists
    $stmt = $conn->query("SHOW TABLES LIKE 'users'");
    if ($stmt->rowCount() > 0) {
        echo "✓ users table exists\n";
    } else {
        echo "✗ users table NOT found\n";
    }
    
} catch (Exception $e) {
    echo "✗ Error: " . $e->getMessage() . "\n";
}

echo "\nTest complete!\n";
