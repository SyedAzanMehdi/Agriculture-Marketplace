<?php
$host = 'localhost';
$db   = 'agriconnect';
$user = 'root';
$pass = '';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
     $pdo = new PDO($dsn, $user, $pass, $options);
     $sql = file_get_contents($argv[1] ?? 'regional_data.sql');
     $pdo->exec($sql);
     echo "SQL executed successfully.\n";
} catch (\PDOException $e) {
     echo "Error: " . $e->getMessage() . "\n";
}
