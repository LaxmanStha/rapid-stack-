<?php
/**
 * Token Verification API Endpoint
 * POST /api/verify.php
 * Body: { token }
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:5174');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
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

// Get token from Authorization header or body
$token = null;
$authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
if (preg_match('/Bearer\s+(.+)/', $authHeader, $matches)) {
    $token = $matches[1];
}

if (!$token) {
    $data = json_decode(file_get_contents('php://input'), true);
    $token = $data['token'] ?? null;
}

if (!$token) {
    http_response_code(401);
    echo json_encode(['success' => false, 'error' => 'Token is required']);
    exit();
}

try {
    $user = new User();
    $userData = $user->getUserByToken($token);

    if ($userData) {
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'user' => [
                'id' => (int)$userData['id'],
                'name' => $userData['name'],
                'email' => $userData['email'],
                'avatar_color' => $userData['avatar_color'],
                'member_since' => $userData['created_at']
            ]
        ]);
    } else {
        http_response_code(401);
        echo json_encode(['success' => false, 'error' => 'Invalid or expired token']);
    }
} catch (Exception $e) {
    error_log("Verify endpoint error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Server error']);
}
