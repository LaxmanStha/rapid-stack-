<?php
/**
 * Logout API Endpoint
 * POST /api/logout.php
 * Header: Authorization: Bearer <token>
 */

header('Content-Type: application/json');
// Allow React dev server on :5174 to call this endpoint
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
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Token is required']);
    exit();
}

try {
    // Ensure any native PHP session is also destroyed
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }

    $user = new User();
    
    // Get user from token to find user_id for global logout
    $userData = $user->getUserByToken($token);

    if ($userData) {
        // Destroy all sessions for this user (logout from all devices)
        $user->destroyAllSessions($userData['id']);
    } else {
        // Fallback: just destroy this specific token
        $user->destroySession($token);
    }

    // Clear any native PHP session data and cookie
    $_SESSION = [];
    if (ini_get("session.use_cookies")) {
        $params = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000,
            $params["path"], $params["domain"],
            $params["secure"], $params["httponly"]
        );
    }
    session_destroy();

    http_response_code(200);
    echo json_encode(['success' => true, 'message' => 'Logged out successfully']);
} catch (Exception $e) {
    error_log("Logout endpoint error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Server error']);
}
