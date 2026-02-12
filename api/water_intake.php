<?php
/**
 * Water Intake API Endpoint
 * Handles water intake operations: GET, POST, PUT, DELETE
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/../models/WaterIntake.php';
require_once __DIR__ . '/../models/User.php';

// Helper function to verify token
function verifyToken($token) {
    $user = new User();
    $userData = $user->getUserByToken($token);
    return $userData ? $userData['id'] : null;
}

// Get token from Authorization header or query parameter
$token = null;
$authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
if (preg_match('/Bearer\s+(.+)/', $authHeader, $matches)) {
    $token = $matches[1];
} else {
    $token = $_GET['token'] ?? null;
}

$userId = verifyToken($token);
if (!$userId) {
    http_response_code(401);
    echo json_encode(['success' => false, 'error' => 'Invalid or missing token']);
    exit();
}

$waterIntake = new WaterIntake();
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    // Get water intake entries for user
    case 'GET':
        $date = $_GET['date'] ?? null;
        $total = isset($_GET['total']) ? filter_var($_GET['total'], FILTER_VALIDATE_BOOLEAN) : false;
        $days = $_GET['days'] ?? null;
        
        if ($days) {
            $stats = $waterIntake->getDailyStats($userId, $days);
            http_response_code(200);
            echo json_encode(['success' => true, 'data' => $stats]);
        } elseif ($total && $date) {
            $result = $waterIntake->getTotalByUserIdAndDate($userId, $date);
            http_response_code(200);
            echo json_encode(['success' => true, 'data' => $result]);
        } elseif ($date) {
            $entries = $waterIntake->getByUserIdAndDate($userId, $date);
            http_response_code(200);
            echo json_encode(['success' => true, 'data' => $entries]);
        } else {
            $entries = $waterIntake->getByUserId($userId);
            http_response_code(200);
            echo json_encode(['success' => true, 'data' => $entries]);
        }
        break;

    // Create new water intake entry
    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        if (!$data || !isset($data['amount'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Missing required fields']);
            break;
        }
        if ($waterIntake->create($userId, $data['amount'], $data['time'] ?? null, $data['date'] ?? null)) {
            http_response_code(201);
            echo json_encode(['success' => true, 'data' => [
                'id' => $waterIntake->id,
                'amount' => $waterIntake->amount,
                'time' => $waterIntake->time,
                'date' => $waterIntake->date
            ]]);
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'error' => 'Failed to create water intake entry']);
        }
        break;

    // Update water intake entry
    case 'PUT':
        $id = $_GET['id'] ?? null;
        if (!$id) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Missing entry id']);
            break;
        }
        $data = json_decode(file_get_contents('php://input'), true);
        if (empty($data)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'No data to update']);
            break;
        }
        if ($waterIntake->update($id, $data)) {
            http_response_code(200);
            echo json_encode(['success' => true, 'message' => 'Water intake entry updated successfully']);
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'error' => 'Failed to update water intake entry']);
        }
        break;

    // Delete water intake entry
    case 'DELETE':
        $id = $_GET['id'] ?? null;
        if (!$id) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Missing entry id']);
            break;
        }
        if ($waterIntake->delete($id)) {
            http_response_code(200);
            echo json_encode(['success' => true, 'message' => 'Water intake entry deleted successfully']);
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'error' => 'Failed to delete water intake entry']);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(['success' => false, 'error' => 'Method not allowed']);
        break;
}
