<?php
/**
 * Signup API Endpoint
 * POST /api/signup.php
 * Body: { name, email, password }
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:5174');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Credentials: true');

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

$name = trim($data['name'] ?? '');
$email = trim($data['email'] ?? '');
$password = $data['password'] ?? '';

if (empty($name) || empty($email) || empty($password)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'All fields are required']);
    exit();
}

try {
    $user = new User();
    $result = $user->create($name, $email, $password);

    if ($result['success']) {
        // Auto-login after signup
        $loginResult = $user->login($email, $password);
        http_response_code(201);
        echo json_encode([
            'success' => true,
            'message' => 'Account created successfully!',
            'token' => $loginResult['token'] ?? null,
            'user' => $result['user']
        ]);
    } else {
        http_response_code(400);
        echo json_encode($result);
    }
} catch (Exception $e) {
    $errorMessage = "Signup endpoint error: " . $e->getMessage();
    error_log($errorMessage);
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $errorMessage]);
}
