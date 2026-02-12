<?php
/**
 * Test script to check API endpoint functionality
 */

// Test water intake API
echo "Testing Water Intake API...\n\n";
$token = "test_token"; // You might need to replace this with a valid token from your database

// Test 1: Get all entries (without date parameter)
echo "1. Testing get all entries:\n";
$url = "http://localhost/RSB/api/water_intake.php?token={$token}";
$response = file_get_contents($url);
echo "Response: " . $response . "\n\n";

// Test 2: Get entries for specific date
echo "2. Testing get entries for today:\n";
$today = date('Y-m-d');
$url = "http://localhost/RSB/api/water_intake.php?date={$today}&token={$token}";
$response = file_get_contents($url);
echo "Response: " . $response . "\n\n";

// Test exercise todos API
echo "Testing Exercise Todos API...\n\n";

// Test 1: Get all todos
echo "1. Testing get all todos:\n";
$url = "http://localhost/RSB/api/exercise_todos.php?token={$token}";
$response = file_get_contents($url);
echo "Response: " . $response . "\n\n";

// Test 2: Get todos for specific date
echo "2. Testing get todos for today:\n";
$url = "http://localhost/RSB/api/exercise_todos.php?date={$today}&token={$token}";
$response = file_get_contents($url);
echo "Response: " . $response . "\n\n";

echo "Test completed!\n";
?>