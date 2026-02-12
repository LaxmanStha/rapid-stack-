<?php
/**
 * Water Intake Model
 * Handles all water intake-related database operations
 */

require_once __DIR__ . '/../config/database.php';

class WaterIntake {
    private $conn;
    private $table = 'water_intake';

    public $id;
    public $user_id;
    public $amount;
    public $time;
    public $date;
    public $created_at;

    public function __construct() {
        $database = new Database();
        $this->conn = $database->getConnection();
    }

    /**
     * Get all water intake entries for a user
     */
    public function getByUserId($user_id) {
        $query = "SELECT * FROM {$this->table} WHERE user_id = :user_id ORDER BY created_at DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':user_id', $user_id);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Get water intake entries for a user on a specific date
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
     * Get total water intake for a user on a specific date
     */
    public function getTotalByUserIdAndDate($user_id, $date) {
        $query = "SELECT SUM(amount) as total FROM {$this->table} WHERE user_id = :user_id AND date = :date";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':user_id', $user_id);
        $stmt->bindParam(':date', $date);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        return $result['total'] ?: 0;
    }

    /**
     * Create a new water intake entry
     */
    public function create($user_id, $amount, $time = null, $date = null) {
        $date = $date ?: date('Y-m-d');
        $time = $time ?: date('H:i:s');
        $query = "INSERT INTO {$this->table} (user_id, amount, time, date) VALUES (:user_id, :amount, :time, :date)";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':user_id', $user_id);
        $stmt->bindParam(':amount', $amount);
        $stmt->bindParam(':time', $time);
        $stmt->bindParam(':date', $date);

        if ($stmt->execute()) {
            $this->id = $this->conn->lastInsertId();
            $this->user_id = $user_id;
            $this->amount = $amount;
            $this->time = $time;
            $this->date = $date;
            return true;
        }
        return false;
    }

    /**
     * Update a water intake entry
     */
    public function update($id, $data) {
        $fields = [];
        $params = [];
        
        if (isset($data['amount'])) {
            $fields[] = 'amount = :amount';
            $params[':amount'] = $data['amount'];
        }
        if (isset($data['time'])) {
            $fields[] = 'time = :time';
            $params[':time'] = $data['time'];
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
     * Delete a water intake entry
     */
    public function delete($id) {
        $query = "DELETE FROM {$this->table} WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);
        return $stmt->execute();
    }

    /**
     * Delete all water intake entries for a user
     */
    public function deleteAllByUserId($user_id) {
        $query = "DELETE FROM {$this->table} WHERE user_id = :user_id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':user_id', $user_id);
        return $stmt->execute();
    }

    /**
     * Get weekly water intake stats for a user
     */
    public function getWeeklyStats($user_id) {
        $weekAgo = date('Y-m-d', strtotime('-7 days'));
        $query = "SELECT date, SUM(amount) as total FROM {$this->table} WHERE user_id = :user_id AND date >= :week_ago GROUP BY date";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':user_id', $user_id);
        $stmt->bindParam(':week_ago', $weekAgo);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Get daily water intake stats for a user
     */
    public function getDailyStats($user_id, $days = 7) {
        $startDate = date('Y-m-d', strtotime("-$days days"));
        $query = "SELECT date, SUM(amount) as total FROM {$this->table} WHERE user_id = :user_id AND date >= :start_date GROUP BY date";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':user_id', $user_id);
        $stmt->bindParam(':start_date', $startDate);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
