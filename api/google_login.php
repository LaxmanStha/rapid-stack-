<?php
/**
 * Google Login API
 * Handles Google Sign-In verification and authentication
 */

require_once '../config/database.php';
require_once '../models/User.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Get input data
$data = json_decode(file_get_contents('php://input'), true);

// Validate input
if (!isset($data['id_token'])) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => 'Missing Google ID token'
    ]);
    exit;
}

try {
    // Verify Google ID token
    $client = new Google_Client(['client_id' => 'YOUR_GOOGLE_CLIENT_ID_HERE']);
    $payload = $client->verifyIdToken($data['id_token']);
    
    if ($payload) {
        // Extract user information from Google payload
        $googleUserId = $payload['sub'];
        $email = $payload['email'];
        $name = $payload['name'];
        $picture = $payload['picture'] ?? null;
        $givenName = $payload['given_name'] ?? null;
        $familyName = $payload['family_name'] ?? null;
        
        // Check if user already exists
        $user = User::findByEmail($email);
        
        if ($user) {
            // Update user's Google ID if not already present
            if (empty($user->google_id)) {
                $user->google_id = $googleUserId;
                $user->save();
            }
        } else {
            // Create new user if not exists
            $user = new User();
            $user->name = $name;
            $user->email = $email;
            $user->google_id = $googleUserId;
            $user->avatar_url = $picture;
            $user->avatar_color = '#' . substr(md5($email), 0, 6);
            $user->member_since = date('Y-m-d H:i:s');
            $user->save();
        }
        
        // Generate auth token
        $token = bin2hex(random_bytes(32));
        $user->auth_token = $token;
        $user->save();
        
        // Success response
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => 'Google login successful!',
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'avatar_url' => $user->avatar_url,
                'avatar_color' => $user->avatar_color,
                'member_since' => $user->member_since
            ]
        ]);
    } else {
        // Invalid token
        http_response_code(401);
        echo json_encode([
            'success' => false,
            'error' => 'Invalid Google ID token'
        ]);
    }
} catch (Exception $e) {
    // Handle errors
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Google login failed: ' . $e->getMessage()
    ]);
}
?>