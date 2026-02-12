<?php
/**
 * Exercise Todos API Endpoint
 * Handles exercise todo operations: GET, POST, PUT, DELETE
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

require_once __DIR__ . '/../models/ExerciseTodo.php';
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

$exerciseTodo = new ExerciseTodo();
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    // Get all exercise todos for user
    case 'GET':
        $date = $_GET['date'] ?? null;
        if ($date) {
            $todos = $exerciseTodo->getByUserIdAndDate($userId, $date);
        } else {
            $todos = $exerciseTodo->getByUserId($userId);
        }
        http_response_code(200);
        echo json_encode(['success' => true, 'data' => $todos]);
        break;

    // Create new exercise todo
    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        if (!$data || !isset($data['text']) || !isset($data['time'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Missing required fields']);
            break;
        }
        if ($exerciseTodo->create($userId, $data['text'], $data['time'], $data['date'] ?? null)) {
            http_response_code(201);
            echo json_encode(['success' => true, 'data' => [
                'id' => $exerciseTodo->id,
                'text' => $exerciseTodo->text,
                'time' => $exerciseTodo->time,
                'done' => $exerciseTodo->done,
                'date' => $exerciseTodo->date
            ]]);
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'error' => 'Failed to create exercise todo']);
        }
        break;

    // Update exercise todo
    case 'PUT':
        $id = $_GET['id'] ?? null;
        if (!$id) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Missing todo id']);
            break;
        }
        $data = json_decode(file_get_contents('php://input'), true);
        if (empty($data)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'No data to update']);
            break;
        }
        if ($exerciseTodo->update($id, $data)) {
            http_response_code(200);
            echo json_encode(['success' => true, 'message' => 'Exercise todo updated successfully']);
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'error' => 'Failed to update exercise todo']);
        }
        break;

    // Delete exercise todo
    case 'DELETE':
        $id = $_GET['id'] ?? null;
        if (!$id) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Missing todo id']);
            break;
        }
        if ($exerciseTodo->delete($id)) {
            http_response_code(200);
            echo json_encode(['success' => true, 'message' => 'Exercise todo deleted successfully']);
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'error' => 'Failed to delete exercise todo']);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(['success' => false, 'error' => 'Method not allowed']);
        break;
}
