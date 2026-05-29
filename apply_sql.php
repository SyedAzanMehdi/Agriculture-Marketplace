<?php
$host = 'localhost';
$db   = 'agriconnect';
$user = 'root';
$pass = '';
$charset = 'utf8mb4';
$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
try {
     $pdo = new PDO($dsn, $user, $pass, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
     $pdo->exec(file_get_contents($argv[1]));
     echo "SQL executed successfully.\n";
} catch (\PDOException $e) {
     echo "Error: " . $e->getMessage() . "\n";
}
