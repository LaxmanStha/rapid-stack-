<?php
/**
 * User Model
 * Handles all user-related database operations
 */

require_once __DIR__ . '/../config/database.php';

class User {
    private $conn;
    private $table = 'users';

    public $id;
    public $name;
    public $email;
    public $password;
    public $google_id;
    public $avatar_color;
    public $avatar_url;
    public $created_at;
    public $updated_at;

    public function __construct() {
        $database = new Database();
        $this->conn = $database->getConnection();
    }

    /**
     * Create a new user
     */
    public function create($name, $email, $password = null, $google_id = null, $avatar_url = null) {
        // Check if email already exists
        if ($this->emailExists($email)) {
            return ['success' => false, 'error' => 'Email already registered'];
        }

        // Validate inputs
        if ($password) {
            $errors = $this->validate($name, $email, $password);
            if (!empty($errors)) {
                return ['success' => false, 'error' => implode(', ', $errors)];
            }
        }

        // Generate random avatar color
        $colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe', '#43e97b', '#fa709a', '#fee140', '#a18cd1'];
        $avatar_color = $colors[array_rand($colors)];

        // Hash password if provided
        $hashed_password = null;
        if ($password) {
            $hashed_password = password_hash($password, PASSWORD_BCRYPT, ['cost' => 12]);
        }

        $query = "INSERT INTO {$this->table} (name, email, password, google_id, avatar_color, avatar_url) 
                 VALUES (:name, :email, :password, :google_id, :avatar_color, :avatar_url)";

        try {
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':name', $name);
            $stmt->bindParam(':email', $email);
            $stmt->bindParam(':password', $hashed_password);
            $stmt->bindParam(':google_id', $google_id);
            $stmt->bindParam(':avatar_color', $avatar_color);
            $stmt->bindParam(':avatar_url', $avatar_url);

            if ($stmt->execute()) {
                $user_id = $this->conn->lastInsertId();
                return [
                    'success' => true,
                    'user' => [
                        'id' => (int)$user_id,
                        'name' => $name,
                        'email' => $email,
                        'google_id' => $google_id,
                        'avatar_color' => $avatar_color,
                        'avatar_url' => $avatar_url
                    ]
                ];
            }
        } catch (PDOException $e) {
            error_log("User creation error: " . $e->getMessage());
            return ['success' => false, 'error' => 'Failed to create account. Please try again.'];
        }

        return ['success' => false, 'error' => 'Failed to create account'];
    }

    /**
     * Authenticate user login
     */
    public function login($email, $password) {
        $query = "SELECT id, name, email, password, google_id, avatar_color, avatar_url, created_at FROM {$this->table} WHERE email = :email LIMIT 1";

        try {
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':email', $email);
            $stmt->execute();

            if ($stmt->rowCount() === 0) {
                return ['success' => false, 'error' => 'Invalid email or password'];
            }

            $user = $stmt->fetch();

            if (!password_verify($password, $user['password'])) {
                return ['success' => false, 'error' => 'Invalid email or password'];
            }

            // Generate session token
            $token = bin2hex(random_bytes(32));
            $this->createSession($user['id'], $token);

            return [
                'success' => true,
                'token' => $token,
                'user' => [
                    'id' => (int)$user['id'],
                    'name' => $user['name'],
                    'email' => $user['email'],
                    'google_id' => $user['google_id'],
                    'avatar_color' => $user['avatar_color'],
                    'avatar_url' => $user['avatar_url'],
                    'member_since' => $user['created_at']
                ]
            ];
        } catch (PDOException $e) {
            error_log("Login error: " . $e->getMessage());
            return ['success' => false, 'error' => 'Login failed. Please try again.'];
        }
    }

    /**
     * Get user by session token
     */
    public function getUserByToken($token) {
        $query = "SELECT u.id, u.name, u.email, u.google_id, u.avatar_color, u.avatar_url, u.created_at 
                  FROM {$this->table} u 
                  INNER JOIN sessions s ON u.id = s.user_id 
                  WHERE s.token = :token AND s.expires_at > NOW() 
                  LIMIT 1";

        try {
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':token', $token);
            $stmt->execute();

            if ($stmt->rowCount() === 0) {
                return null;
            }

            return $stmt->fetch();
        } catch (PDOException $e) {
            error_log("Token lookup error: " . $e->getMessage());
            return null;
        }
    }

    /**
     * Create a session for the user
     */
    private function createSession($user_id, $token) {
        // Clean up expired sessions
        $this->conn->exec("DELETE FROM sessions WHERE expires_at < NOW()");

        $expires_at = date('Y-m-d H:i:s', strtotime('+7 days'));
        $query = "INSERT INTO sessions (user_id, token, expires_at) VALUES (:user_id, :token, :expires_at)";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':user_id', $user_id);
        $stmt->bindParam(':token', $token);
        $stmt->bindParam(':expires_at', $expires_at);
        $stmt->execute();
    }

    /**
     * Destroy a session (logout)
     */
    public function destroySession($token) {
        $query = "DELETE FROM sessions WHERE token = :token";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':token', $token);
        return $stmt->execute();
    }

    /**
     * Find user by email address
     */
    public static function findByEmail($email) {
        $user = new self();
        $query = "SELECT * FROM {$user->table} WHERE email = :email LIMIT 1";
        $stmt = $user->conn->prepare($query);
        $stmt->bindParam(':email', $email);
        $stmt->execute();
        
        if ($stmt->rowCount() === 0) {
            return null;
        }
        
        $userData = $stmt->fetch();
        $user->id = $userData['id'];
        $user->name = $userData['name'];
        $user->email = $userData['email'];
        $user->password = $userData['password'];
        $user->google_id = $userData['google_id'];
        $user->avatar_color = $userData['avatar_color'];
        $user->avatar_url = $userData['avatar_url'];
        $user->created_at = $userData['created_at'];
        $user->updated_at = $userData['updated_at'];
        
        return $user;
    }

    /**
     * Find user by Google ID
     */
    public static function findByGoogleId($googleId) {
        $user = new self();
        $query = "SELECT * FROM {$user->table} WHERE google_id = :google_id LIMIT 1";
        $stmt = $user->conn->prepare($query);
        $stmt->bindParam(':google_id', $googleId);
        $stmt->execute();
        
        if ($stmt->rowCount() === 0) {
            return null;
        }
        
        $userData = $stmt->fetch();
        $user->id = $userData['id'];
        $user->name = $userData['name'];
        $user->email = $userData['email'];
        $user->password = $userData['password'];
        $user->google_id = $userData['google_id'];
        $user->avatar_color = $userData['avatar_color'];
        $user->avatar_url = $userData['avatar_url'];
        $user->created_at = $userData['created_at'];
        $user->updated_at = $userData['updated_at'];
        
        return $user;
    }

    /**
     * Save user data to database
     */
    public function save() {
        if ($this->id) {
            // Update existing user
            $query = "UPDATE {$this->table} 
                     SET name = :name, email = :email, google_id = :google_id, 
                         avatar_color = :avatar_color, avatar_url = :avatar_url, 
                         updated_at = NOW() 
                     WHERE id = :id";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':name', $this->name);
            $stmt->bindParam(':email', $this->email);
            $stmt->bindParam(':google_id', $this->google_id);
            $stmt->bindParam(':avatar_color', $this->avatar_color);
            $stmt->bindParam(':avatar_url', $this->avatar_url);
            $stmt->bindParam(':id', $this->id);
            return $stmt->execute();
        } else {
            // Create new user
            $query = "INSERT INTO {$this->table} (name, email, google_id, avatar_color, avatar_url) 
                     VALUES (:name, :email, :google_id, :avatar_color, :avatar_url)";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':name', $this->name);
            $stmt->bindParam(':email', $this->email);
            $stmt->bindParam(':google_id', $this->google_id);
            $stmt->bindParam(':avatar_color', $this->avatar_color);
            $stmt->bindParam(':avatar_url', $this->avatar_url);
            
            if ($stmt->execute()) {
                $this->id = $this->conn->lastInsertId();
                return true;
            }
            
            return false;
        }
    }

    /**
     * Check if email exists
     */
    private function emailExists($email) {
        $query = "SELECT id FROM {$this->table} WHERE email = :email LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':email', $email);
        $stmt->execute();
        return $stmt->rowCount() > 0;
    }

    /**
     * Validate user input
     */
    private function validate($name, $email, $password) {
        $errors = [];

        if (empty(trim($name)) || strlen(trim($name)) < 2) {
            $errors[] = 'Name must be at least 2 characters';
        }

        if (strlen(trim($name)) > 100) {
            $errors[] = 'Name must be less than 100 characters';
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $errors[] = 'Please enter a valid email address';
        }

        if (strlen($password) < 6) {
            $errors[] = 'Password must be at least 6 characters';
        }

        if (strlen($password) > 128) {
            $errors[] = 'Password must be less than 128 characters';
        }

        return $errors;
    }
}
