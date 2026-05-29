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
     $filename = $argv[1] ?? 'intelligence.sql';
     $sql = file_get_contents($filename);
     $pdo->exec($sql);
     echo "SQL file '$filename' executed successfully.\n";
} catch (\PDOException $e) {
     echo "Connection failed: " . $e->getMessage() . "\n";
}
?>
