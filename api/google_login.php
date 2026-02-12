<?php
/**
 * Google Login API Endpoint
 * Handles Google Sign-In token verification and user creation/login
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/../models/User.php';

// Get POST data
$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['id_token'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Missing Google ID token']);
    exit();
}

$id_token = $data['id_token'];

// Verify the token with Google
$url = "https://oauth2.googleapis.com/tokeninfo?id_token=" . $id_token;
$response = @file_get_contents($url);

if (!$response) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid Google token']);
    exit();
}

$payload = json_decode($response, true);

if (isset($payload['error_description'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => $payload['error_description']]);
    exit();
}

// Use the User model to handle login/signup logic
$userModel = new User();
$result = $userModel->loginWithGoogle($payload);

if ($result['success']) {
    http_response_code(200);
    echo json_encode($result);
} else {
    http_response_code(500);
    echo json_encode($result);
}