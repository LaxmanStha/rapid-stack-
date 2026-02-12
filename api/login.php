<?php
/**
 * Login API Endpoint
 * POST /api/login.php
 * Body: { email, password }
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit();
}

require_once __DIR__ . '/../models/User.php';

// Get POST data
$data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid request data']);
    exit();
}

$email = trim($data['email'] ?? '');
$password = $data['password'] ?? '';

if (empty($email) || empty($password)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Email and password are required']);
    exit();
}

try {
    $user = new User();
    $result = $user->login($email, $password);

    if ($result['success']) {
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => 'Login successful!',
            'token' => $result['token'],
            'user' => $result['user']
        ]);
    } else {
        http_response_code(401);
        echo json_encode($result);
    }
} catch (Exception $e) {
    $errorMessage = "Login endpoint error: " . $e->getMessage();
    error_log($errorMessage);
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $errorMessage]);
}
