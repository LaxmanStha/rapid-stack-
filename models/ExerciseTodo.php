<?php
/**
 * Exercise Todo Model
 * Handles all exercise todo-related database operations
 */

require_once __DIR__ . '/../config/database.php';

class ExerciseTodo {
    private $conn;
    private $table = 'exercise_todos';

    public $id;
    public $user_id;
    public $text;
    public $time;
    public $done;
    public $date;
    public $created_at;
    public $updated_at;

    public function __construct() {
        $database = new Database();
        $this->conn = $database->getConnection();
    }

    /**
     * Get all exercise todos for a user
     */
    public function getByUserId($user_id) {
        $query = "SELECT * FROM {$this->table} WHERE user_id = :user_id ORDER BY created_at DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':user_id', $user_id);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Get exercise todos for a user on a specific date
     */
    public function getByUserIdAndDate($user_id, $date) {
        $query = "SELECT * FROM {$this->table} WHERE user_id = :user_id AND date = :date ORDER BY created_at DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':user_id', $user_id);
        $stmt->bindParam(':date', $date);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Create a new exercise todo
     */
    public function create($user_id, $text, $time, $date = null) {
        $date = $date ?: date('Y-m-d');
        $query = "INSERT INTO {$this->table} (user_id, text, time, date) VALUES (:user_id, :text, :time, :date)";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':user_id', $user_id);
        $stmt->bindParam(':text', $text);
        $stmt->bindParam(':time', $time);
        $stmt->bindParam(':date', $date);

        if ($stmt->execute()) {
            $this->id = $this->conn->lastInsertId();
            $this->user_id = $user_id;
            $this->text = $text;
            $this->time = $time;
            $this->date = $date;
            $this->done = false;
            return true;
        }
        return false;
    }

    /**
     * Update an exercise todo
     */
    public function update($id, $data) {
        $fields = [];
        $params = [];
        
        if (isset($data['text'])) {
            $fields[] = 'text = :text';
            $params[':text'] = $data['text'];
        }
        if (isset($data['time'])) {
            $fields[] = 'time = :time';
            $params[':time'] = $data['time'];
        }
        if (isset($data['done'])) {
            $fields[] = 'done = :done';
            $params[':done'] = $data['done'];
        }
        if (isset($data['date'])) {
            $fields[] = 'date = :date';
            $params[':date'] = $data['date'];
        }

        if (empty($fields)) {
            return false;
        }

        $params[':id'] = $id;
        $query = "UPDATE {$this->table} SET " . implode(', ', $fields) . " WHERE id = :id";
        $stmt = $this->conn->prepare($query);

        foreach ($params as $key => $value) {
            $stmt->bindValue($key, $value);
        }

        return $stmt->execute();
    }

    /**
     * Delete an exercise todo
     */
    public function delete($id) {
        $query = "DELETE FROM {$this->table} WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);
        return $stmt->execute();
    }

    /**
     * Toggle done status of an exercise todo
     */
    public function toggleDone($id) {
        $query = "UPDATE {$this->table} SET done = NOT done, updated_at = NOW() WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);
        return $stmt->execute();
    }

    /**
     * Get weekly stats for a user
     */
    public function getWeeklyStats($user_id) {
        $weekAgo = date('Y-m-d', strtotime('-7 days'));
        $query = "SELECT date, COUNT(*) as count FROM {$this->table} WHERE user_id = :user_id AND date >= :week_ago AND done = 1 GROUP BY date";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':user_id', $user_id);
        $stmt->bindParam(':week_ago', $weekAgo);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Delete all exercise todos for a user
     */
    public function deleteAllByUserId($user_id) {
        $query = "DELETE FROM {$this->table} WHERE user_id = :user_id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':user_id', $user_id);
        return $stmt->execute();
    }
}
