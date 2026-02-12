<?php
/**
 * Database Update Script
 * Run this to add Google login fields to the database
 * Usage: php setup/update_database.php
 */

$host = getenv('DB_HOST') ?: 'localhost';
$username = getenv('DB_USER') ?: 'root';
$password = getenv('DB_PASSWORD') ?: '';
$port = getenv('DB_PORT') ?: '3306';
$db_name = getenv('DB_NAME') ?: 'phy_project_db';

try {
    $pdo = new PDO("mysql:host={$host};port={$port};dbname={$db_name};charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Add google_id field
    $pdo->exec("ALTER TABLE `users` ADD COLUMN IF NOT EXISTS `google_id` VARCHAR(255) UNIQUE AFTER `password`");
    echo "✓ Added 'google_id' column to users table\n";

    // Add avatar_url field
    $pdo->exec("ALTER TABLE `users` ADD COLUMN IF NOT EXISTS `avatar_url` VARCHAR(255) AFTER `avatar_color`");
    echo "✓ Added 'avatar_url' column to users table\n";

    // Update avatar_color default
    $pdo->exec("ALTER TABLE `users` ALTER `avatar_color` SET DEFAULT '#667eea'");
    echo "✓ Updated avatar_color default value\n";

    echo "\n✅ Database update complete!\n";
    echo "\nNote: You must run 'composer require google/apiclient:^2.0' to install the Google API Client library\n";

} catch (PDOException $e) {
    echo "✗ Error: " . $e->getMessage() . "\n";
    exit(1);
}
?>