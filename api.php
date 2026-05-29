<?php
declare(strict_types=1);

/**
 * ============================================================
 * AgriConnect – Main API Controller
 * ============================================================
 * Handles all backend logic for authentication, crop management,
 * and offer processing using standard REST practices.
 */

// Global Header Configuration for JSON API standard responses
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *'); 
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle Pre-flight Cross-Origin Execution Options
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

/**
 * Class Config
 * Centralized immutable configuration schema representing system constants.
 */
class Config {
    public const DB_HOST = 'localhost';
    public const DB_NAME = 'agriconnect';
    public const DB_USER = 'root';
    public const DB_PASS = '';
}

/**
 * Class Database
 * Singleton implementation to manage the PDO active connection instance safely.
 */
class Database {
    private static ?PDO $instance = null;

    /**
     * Obtains the core PDO linkage connecting exactly once per request lifecycle.
     * @return PDO
     */
    public static function getConnection(): PDO {
        if (self::$instance === null) {
            try {
                $dsn = sprintf("mysql:host=%s;dbname=%s;charset=utf8mb4", Config::DB_HOST, Config::DB_NAME);
                $options = [
                    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES   => false,
                ];
                self::$instance = new PDO($dsn, Config::DB_USER, Config::DB_PASS, $options);
                
                // Auto-migrate schema: add is_approved column if it does not exist
                try {
                    self::$instance->exec("ALTER TABLE users ADD COLUMN is_approved TINYINT(1) DEFAULT 0");
                    // If the column was just created, approve all existing non-admin users so the system doesn't break
                    self::$instance->exec("UPDATE users SET is_approved = 1");
                } catch (PDOException $e) {
                    // Column already exists, ignore
                }

                // Auto-migrate schema: add farmer details to marketplace table if they don't exist
                try {
                    self::$instance->exec("ALTER TABLE marketplace ADD COLUMN farmer_name VARCHAR(255) DEFAULT NULL");
                } catch (PDOException $e) {}
                try {
                    self::$instance->exec("ALTER TABLE marketplace ADD COLUMN farmer_city VARCHAR(255) DEFAULT NULL");
                } catch (PDOException $e) {}
                try {
                    self::$instance->exec("ALTER TABLE marketplace ADD COLUMN farmer_phone VARCHAR(50) DEFAULT NULL");
                } catch (PDOException $e) {}

                // Backfill details for existing listings from users table if possible
                try {
                    self::$instance->exec("
                        UPDATE marketplace m
                        JOIN added_crops a ON m.addedCropId = a.id
                        JOIN users u ON a.farmerId = u.id
                        SET m.farmer_name = u.name, m.farmer_city = u.location, m.farmer_phone = u.phone
                        WHERE m.farmer_name IS NULL OR m.farmer_name = ''
                    ");
                } catch (PDOException $e) {}
                
                // Auto-migrate schema: add ai_diagnostics_history table
                try {
                    self::$instance->exec("CREATE TABLE IF NOT EXISTS ai_diagnostics_history (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        farmerId INT,
                        disease_name VARCHAR(255),
                        confidence DECIMAL(5,2),
                        crop VARCHAR(100),
                        scan_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    )");
                } catch (PDOException $e) {
                    // Ignore creation errors
                }
                
                // Auto-migrate schema: add diseases table
                try {
                    self::$instance->exec("CREATE TABLE IF NOT EXISTS diseases (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        name VARCHAR(255) NOT NULL,
                        ur_name VARCHAR(255) NOT NULL,
                        crop VARCHAR(255) NOT NULL,
                        type VARCHAR(255) NOT NULL,
                        symptoms TEXT NOT NULL,
                        ur_symptoms TEXT NOT NULL,
                        treatment TEXT NOT NULL,
                        ur_treatment TEXT NOT NULL,
                        severity VARCHAR(100) NOT NULL,
                        image VARCHAR(500) NOT NULL,
                        condition_name VARCHAR(100) DEFAULT 'Diseased'
                    )");
                    
                    $count = self::$instance->query("SELECT COUNT(*) FROM diseases")->fetchColumn();
                    if ($count == 0) {
                        $seeds = [
                            ['Rice Blast', 'دھان کا بلاسٹ', 'Rice', 'Fungal', 'Diamond-shaped spots on leaves, drying of leaves, poor grain production.', 'پتوں پر ہیرے کی شکل کے دھبے، پتوں کا خشک ہونا، اناج کی کم پیداوار۔', 'Use resistant rice varieties, avoid excess nitrogen fertilizer, spray fungicides on time.', 'مزاحم اقسام استعمال کریں، نائٹروجن کھاد کی زیادتی سے بچیں، فنگسائڈز کا بروقت سپرے کریں۔', 'Very High', 'https://images.unsplash.com/photo-1586985289688-cacf32ca6e4e?w=500&q=80', 'Diseased'],
                            ['Wheat Rust', 'گندم کی کنگی', 'Wheat', 'Fungal', 'Orange or brown powder on leaves, weak plants, reduced grain quality.', 'پتوں پر نارنجی یا بھورا سفوف، پودوں کی کمزوری، اناج کی کوالٹی میں کمی۔', 'Grow resistant wheat varieties, remove infected crop remains, use fungicide sprays.', 'مزاحم اقسام اگائیں، متاثرہ فصلوں کی باقیات ختم کریں، فنگسائڈز کا سپرے کریں۔', 'High', 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=500&q=80', 'Diseased'],
                            ['Cotton Leaf Curl', 'کپاس کا پتہ مروڑ', 'Cotton', 'Viral', 'Curled leaves, thick veins, stunted plant growth.', 'پتوں کا مڑنا، رگوں کا موٹا ہونا، پودوں کی نشوونما کا رک جانا۔', 'Control whiteflies, use healthy seeds, destroy infected plants.', 'سفید مکھی پر قابو پائیں، صحت مند بیج استعمال کریں، بیمار پودوں کو تلف کریں۔', 'Very High', 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=500&q=80', 'Diseased'],
                            ['Early Blight', 'جھلساؤ (قبل از وقت)', 'Tomato, Potato', 'Fungal', 'Brown rings on leaves, yellowing, fruit rot.', 'پتوں پر بھورے چھلے، پیلا پن، پھلوں کا سڑنا۔', 'Rotate crops, avoid overhead watering, apply fungicides.', 'فصلوں کا ہیر پھیر کریں، اوپر سے پانی دینے سے گریز کریں، فنگسائڈز لگائیں۔', 'High', 'https://images.unsplash.com/photo-1609424842837-f08e85db2b34?w=500&q=80', 'Diseased'],
                            ['Downy Mildew', 'ڈاونی ملڈیو', 'Grapes, Onion, Cucumbers', 'Fungal', 'Yellow patches on leaves, gray mold under leaves.', 'پتوں پر پیلے دھبے، پتوں کے نیچے سرمئی الی۔', 'Improve air circulation, avoid wet leaves, use disease-resistant seeds.', 'ہوا کی آمد و رفت بہتر بنائیں، گیلے پتوں سے بچیں، مزاحم بیج استعمال کریں۔', 'Medium', 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=500&q=80', 'Diseased'],
                            ['Bacterial Blight', 'بیکٹیریل بلائٹ', 'Rice, Cotton', 'Bacterial', 'Water-soaked leaf lesions, wilting, dry leaves.', 'پتوں پر پانی بھرے زخم، مرجھانا، پتوں کا خشک ہونا۔', 'Use clean seeds, avoid flooding fields unnecessarily, remove infected plants.', 'صاف بیج استعمال کریں، غیر ضروری پانی کھڑا نہ کریں، متاثرہ پودے نکال دیں۔', 'High', 'https://images.unsplash.com/photo-1550575038-2be5f7ed5e4e?w=500&q=80', 'Diseased'],
                            ['Anthracnose', 'انتھراکنوز', 'Mango, Chili, Beans', 'Fungal', 'Dark sunken spots on fruits, leaf drop, fruit decay.', 'پھلوں پر گہرے دھنسے ہوئے دھبے، پتوں کا گرنا، پھلوں کا سڑنا۔', 'Prune infected branches, keep fields clean, spray fungicides.', 'متاثرہ شاخوں کی کٹائی کریں، کھیت صاف رکھیں، فنگسائڈز سپرے کریں۔', 'High', 'https://images.unsplash.com/photo-1585518419759-7c67ffcf5e2f?w=500&q=80', 'Diseased'],
                            ['Black Rot', 'کالا سڑاؤ', 'Cabbage, Cauliflower', 'Bacterial', 'Yellow V-shaped leaf spots, black veins, rotting leaves.', 'پتوں پر پیلے وی نما دھبے، کالی رگیں، پتوں کا سڑنا۔', 'Use certified seeds, avoid overhead irrigation, rotate crops.', 'تصدیق شدہ بیج استعمال کریں، چھڑکاؤ والے پانی سے بچیں، فصل بدلیں۔', 'Medium', 'https://images.unsplash.com/photo-1510627498534-cf7e9002facc?w=500&q=80', 'Diseased'],
                            ['Root Rot', 'جڑوں کا سڑنا', 'Vegetables, Fruits', 'Fungal', 'Rotten roots, wilting plants, slow growth.', 'جڑوں کا سڑنا، پودوں کا مرجھانا، سست نشوونما۔', 'Ensure proper drainage, avoid overwatering, treat soil before planting.', 'نکاسی آب یقینی بنائیں، ضرورت سے زیادہ پانی نہ دیں، زمین کا علاج کریں۔', 'High', 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=500&q=80', 'Diseased'],
                            ['Mosaic Disease', 'موزیک بیماری', 'Tobacco, Tomato, Cucumber', 'Viral', 'Mosaic-like yellow-green leaf patterns, deformed leaves.', 'پتوں پر زرد سبز نمونے، پتے کی شکل بدلنا۔', 'Control insects, remove infected plants, use resistant varieties.', 'کیڑوں پر قابو پائیں، بیمار پودے نکالیں، مزاحم اقسام استعمال کریں۔', 'High', 'https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?w=500&q=80', 'Diseased'],
                            ['Smut Disease', 'سٹی کی کنگی', 'Corn, Wheat, Barley', 'Fungal', 'Black powdery masses, damaged grains, poor crop quality.', 'کالا سفوف، اناج کا نقصان، فصل کی خراب کوالٹی۔', 'Treat seeds before sowing, use resistant varieties, remove infected plants.', 'بیج کا علاج کریں، مزاحم اقسام استعمال کریں، بیمار پودے نکال دیں۔', 'Medium', 'https://images.unsplash.com/photo-1535808066601-684b01f18b11?w=500&q=80', 'Diseased'],
                            ['Wilt Disease', 'مرجھاؤ', 'Tomato, Banana, Cotton', 'Fungal/Bacterial', 'Sudden wilting, yellow leaves, browning inside stem.', 'اچانک مرجھانا، پیلے پتے، تنے کے اندر بھورا ہونا۔', 'Crop rotation, disease-free seedlings, proper soil drainage.', 'فصلوں کا ہیر پھیر، صحت مند پنیری، نکاسی آب کی بہتری۔', 'High', 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=500&q=80', 'Diseased'],
                            ['Leaf Spot', 'پتوں کے دھبے', 'Groundnut, Tomato, Chili', 'Fungal', 'Brown or black spots on leaves, early leaf fall, weak plants.', 'پتوں پر بھورے یا سیاہ دھبے، پتوں کا جلد گرنا، پودوں کی کمزوری۔', 'Avoid overcrowding, remove infected leaves, apply fungicides.', 'گھنی کاشت سے بچیں، متاثرہ پتے اتاریں، فنگسائڈز کا استعمال۔', 'Medium', 'https://images.unsplash.com/photo-1559181567-c3190bbb5ef3?w=500&q=80', 'Diseased'],
                            ['Stem Rot', 'تنے کا سڑنا', 'Rice, Groundnut, Soybean', 'Fungal', 'Rotting stems, plant collapse, white fungal growth.', 'تنے کا سڑنا، پودے کا گرنا، سفید الی کی نشوونما۔', 'Use clean seeds, improve soil drainage, destroy infected plants.', 'صاف بیج، نکاسی آب میں بہتری، بیمار پودوں کی تلفی۔', 'High', 'https://images.unsplash.com/photo-1643143892786-87b7a4eff1de?w=500&q=80', 'Diseased'],
                            ['Canker Disease', 'کینکر بیماری', 'Citrus, Apple, Tomato', 'Bacterial/Fungal', 'Sunken lesions on stem or fruit, cracked bark, dry branches.', 'تنے یا پھل پر گہرے زخم، چھال کا پھٹنا، خشک شاخیں۔', 'Prune infected branches, use clean tools, spray suitable chemicals.', 'متاثرہ شاخیں کاٹیں، صاف اوزار استعمال کریں، مناسب کیمیکلز کا سپرے۔', 'Medium', 'https://images.unsplash.com/photo-1568702846629-a519a1b8e3d5?w=500&q=80', 'Diseased'],
                            ['Damping Off', 'پودوں کا گرنا', 'Vegetables, Nursery', 'Fungal', 'Seedlings fall over, rotting stems near soil.', 'پنیری کا گرنا، مٹی کے قریب تنے کا سڑنا۔', 'Avoid excess moisture, use treated soil, ensure air circulation.', 'زیادہ نمی سے بچیں، علاج شدہ مٹی، ہوا کی آمد و رفت۔', 'High', 'https://images.unsplash.com/photo-1592424002053-21f369ad7fdb?w=500&q=80', 'Diseased'],
                            ['Scab Disease', 'سکاب بیماری', 'Potato, Apple', 'Fungal/Bacterial', 'Rough brown patches, cracked fruit or tubers.', 'کھردرے بھورے دھبے، پھل یا آلو کا پھٹنا۔', 'Maintain soil moisture, use disease-free seeds, rotate crops.', 'نمی برقرار رکھیں، صاف بیج، فصلوں کا ہیر پھیر۔', 'Low', 'https://images.unsplash.com/photo-1535670711867-efb226f6d81e?w=500&q=80', 'Diseased'],
                            ['Fire Blight', 'فائر بلائٹ', 'Pear, Apple', 'Bacterial', 'Burned-looking branches, black flowers and shoots.', 'جلی ہوئی شاخیں، سیاہ پھول اور شگوفے۔', 'Cut infected branches, sterilize tools, avoid excess nitrogen.', 'متاثرہ شاخیں کاٹیں، اوزار صاف کریں، نائٹروجن کی زیادتی سے بچیں۔', 'Very High', 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=500&q=80', 'Diseased'],
                            ['Clubroot', 'کلب روٹ', 'Cabbage, Turnip, Cauliflower', 'Fungal', 'Swollen roots, yellow leaves, stunted growth.', 'جڑوں کا سوجنا، پیلے پتے، رکی ہوئی نشوونما۔', 'Improve soil pH with lime, rotate crops, use resistant varieties.', 'چونے سے پی ایچ بہتر کریں، فصل بدلیں، مزاحم اقسام۔', 'High', 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=500&q=80', 'Diseased'],
                            ['Red Rot', 'سرخ سڑاؤ', 'Sugarcane', 'Fungal', 'Red discoloration inside stem, dry leaves, bad smell.', 'تنے کے اندر سرخی، خشک پتے، گندی بو۔', 'Use healthy cane setts, remove infected plants, field sanitation.', 'صحت مند بیج، بیمار پودوں کی تلفی، کھیت کی صفائی۔', 'High', 'https://images.unsplash.com/photo-1625246333195-78d9c38ad576?w=500&q=80', 'Diseased'],
                        ];
                        $stmt = self::$instance->prepare("INSERT INTO diseases (name, ur_name, crop, type, symptoms, ur_symptoms, treatment, ur_treatment, severity, image, condition_name) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
                        foreach ($seeds as $s) {
                            $stmt->execute($s);
                        }
                    }
                } catch (PDOException $e) {}
                
                // Ensure specific admin user exists
                try {
                    $adminEmail = 'admin@gmail.com';
                    $stmt = self::$instance->prepare("SELECT id FROM users WHERE email = ?");
                    $stmt->execute([$adminEmail]);
                    if (!$stmt->fetch()) {
                        $hash = password_hash('Aazan@488035', PASSWORD_DEFAULT);
                        $insertStmt = self::$instance->prepare("INSERT INTO users (name, email, password, role, phone, location, is_approved) VALUES (?, ?, ?, ?, ?, ?, ?)");
                        $insertStmt->execute(['System Admin', $adminEmail, $hash, 'admin', '0000000000', 'HQ', 1]);
                    }
                } catch (PDOException $e) {
                    // Ignore insertion errors
                }

            } catch (PDOException $e) {
                // Securely log errors serverside without returning SQL structures to the DOM layer
                error_log("Database Connection Error: " . $e->getMessage());
                http_response_code(500);
                echo json_encode(['error' => 'Database connection failed. Please try again later.']);
                exit;
            }
        }
        return self::$instance;
    }
}

/**
 * Class ApiResponse
 * Provides strict structural guarantees on outbound JSON payloads.
 */
class ApiResponse {
    
    /**
     * Resolves the request loop returning optimal state payloads.
     */
    public static function success(array $data = []): void {
        echo json_encode(array_merge(['success' => true], $data));
        exit;
    }

    /**
     * Formats failure conditions setting explicit HTTP status response boundaries.
     */
    public static function error(string $message, int $statusCode = 400): void {
        http_response_code($statusCode);
        echo json_encode(['success' => false, 'message' => $message, 'error' => $message]);
        exit;
    }

    /**
     * Delivers raw unmodified structural JSON maps.
     */
    public static function raw(array $data): void {
        echo json_encode($data);
        exit;
    }
}

/**
 * Class ApiController
 * Routes HTTP request events to exact functional business logic blocks.
 */
class ApiController {
    private PDO $db;
    private const SECRET_KEY = 'AgriConnect_Secure_Secret_2026_!@#';

    public function __construct() {
        $this->db = Database::getConnection();
    }

    private function generateToken(array $user): string {
        $payload = [
            'id' => $user['id'],
            'role' => $user['role'],
            'exp' => time() + (86400 * 30)
        ];
        $payloadEnc = base64_encode(json_encode($payload));
        $signature = hash_hmac('sha256', $payloadEnc, self::SECRET_KEY);
        return $payloadEnc . '.' . $signature;
    }

    private function getAuthUser(): ?array {
        $auth = '';
        if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
            $auth = trim($_SERVER['HTTP_AUTHORIZATION']);
        } elseif (isset($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) {
            $auth = trim($_SERVER['REDIRECT_HTTP_AUTHORIZATION']);
        } elseif (function_exists('apache_request_headers')) {
            $headers = apache_request_headers();
            if (isset($headers['Authorization'])) {
                $auth = trim($headers['Authorization']);
            }
        }

        if (preg_match('/Bearer\s+(.*)$/i', $auth, $matches)) {
            $token = $matches[1];
            $parts = explode('.', $token);
            if (count($parts) === 2) {
                $payloadEnc = $parts[0];
                $signature = $parts[1];
                $expectedSig = hash_hmac('sha256', $payloadEnc, self::SECRET_KEY);
                if (hash_equals($expectedSig, $signature)) {
                    $payload = json_decode(base64_decode($payloadEnc), true);
                    if ($payload && isset($payload['id']) && $payload['exp'] >= time()) {
                        return $payload;
                    }
                }
            }
        }
        return null;
    }

    private function requireAuth(): array {
        $user = $this->getAuthUser();
        if (!$user) {
            ApiResponse::error('Unauthorized access. Valid token required.', 401);
        }
        return $user;
    }

    /**
     * Primary HTTP entry point matching operations to specific internal handler methods.
     */
    public function handleRequest(): void {
        $method = $_SERVER['REQUEST_METHOD'];
        $action = $_GET['action'] ?? '';

        try {
            if ($method === 'POST') {
                $input = json_decode(file_get_contents('php://input'), true);
                if (!is_array($input)) {
                    $input = [];
                }
                
                switch ($action) {
                    case 'login':       $this->login($input); break;
                    case 'register':    $this->register($input); break;
                    case 'submitOffer': $this->submitOffer($input); break;
                    case 'addCrop':     $this->addCrop($input); break;
                    case 'deleteCrop':  $this->deleteCrop($input); break;
                    case 'updateOffer': $this->updateOffer($input); break;
                    case 'trackClick':  $this->trackClick($input); break;
                    case 'approveUser': $this->approveUser($input); break;
                    case 'saveDiagnosis': $this->saveDiagnosis($input); break;
                    case 'addDisease':    $this->addDisease($input); break;
                    case 'updateDisease': $this->updateDisease($input); break;
                    case 'deleteDisease': $this->deleteDisease($input); break;
                    default:            ApiResponse::error('Invalid POST action', 404);
                }
            } elseif ($method === 'GET') {
                if ($action === 'getData') {
                    $this->getData();
                } else {
                    ApiResponse::error('Invalid GET action', 404);
                }
            } else {
                ApiResponse::error('Method not allowed', 405);
            }
        } catch (Exception $e) {
            error_log('API Error: ' . $e->getMessage());
            ApiResponse::error('An internal server error occurred.', 500);
        }
    }

    /**
     * Authenticates the user profile using modern secure password validation.
     */
    private function login(array $input): void {
        $email = trim($input['email'] ?? '');
        $password = $input['password'] ?? '';

        if (empty($email) || empty($password)) {
            ApiResponse::error('Email and password are required');
        }

        $stmt = $this->db->prepare("SELECT * FROM users WHERE email = ?");
        $stmt->execute([$email]);
        $user = $stmt->fetch();

        if ($user) {
            // Check approval status
            if (isset($user['is_approved']) && $user['is_approved'] == 0 && $user['role'] !== 'admin') {
                ApiResponse::error('Your account is pending admin approval.', 403);
            }

            // Transparent migration block gracefully migrating plaintext environments to cryptographic hashing.
            if (password_verify($password, $user['password'])) {
                unset($user['password']);
                $user['token'] = $this->generateToken($user);
                ApiResponse::success(['user' => $user]);
            } elseif ($user['password'] === $password) {
                // If the user's password precisely matches a valid plaintext, migrate their hash signature immediately.
                $newHash = password_hash($password, PASSWORD_DEFAULT);
                $updateStmt = $this->db->prepare("UPDATE users SET password = ? WHERE id = ?");
                $updateStmt->execute([$newHash, $user['id']]);
                
                unset($user['password']);
                $user['token'] = $this->generateToken($user);
                ApiResponse::success(['user' => $user]);
            }
        }
        
        // Emits generic authorization exceptions deliberately obscuring specific failure details from attackers.
        ApiResponse::error('Invalid email or password', 401);
    }
    
    /**
     * Approves or revokes a user. Only admins can execute this.
     */
    private function approveUser(array $input): void {
        $admin = $this->requireAuth();
        if ($admin['role'] !== 'admin') {
            ApiResponse::error('Unauthorized access. Admin privileges required.', 403);
        }
        
        $userId = $input['userId'] ?? null;
        $status = $input['status'] ?? 1; // 1 = approved, 0 = revoked

        if (!$userId) ApiResponse::error('User ID is required', 400);

        $stmt = $this->db->prepare("UPDATE users SET is_approved = ? WHERE id = ?");
        if ($stmt->execute([$status, $userId])) {
            ApiResponse::success(['message' => 'User status updated successfully']);
        } else {
            ApiResponse::error('Failed to update user status', 500);
        }
    }

    /**
     * Saves an AI diagnostic scan result to the database for historical tracking.
     */
    private function saveDiagnosis(array $input): void {
        $authUser = $this->requireAuth();
        if (empty($input['disease_name']) || empty($input['confidence'])) {
            ApiResponse::error('Missing required diagnostic fields');
        }

        $stmt = $this->db->prepare(
            "INSERT INTO ai_diagnostics_history (farmerId, disease_name, confidence, crop) VALUES (?, ?, ?, ?)"
        );
        
        $stmt->execute([
            (int)$authUser['id'],
            htmlspecialchars(trim($input['disease_name']), ENT_QUOTES, 'UTF-8'),
            (float)$input['confidence'],
            htmlspecialchars(trim($input['crop'] ?? ''), ENT_QUOTES, 'UTF-8')
        ]);

        ApiResponse::success();
    }

    /**
     * Implements explicit validation layers when injecting new user identities into the cluster.
     */
    private function register(array $input): void {
        $required = ['name', 'email', 'password', 'role', 'phone', 'location'];
        foreach ($required as $field) {
            if (empty($input[$field])) {
                ApiResponse::error("Field '$field' is required", 400);
            }
        }

        if (!filter_var($input['email'], FILTER_VALIDATE_EMAIL)) {
            ApiResponse::error('Invalid email format', 400);
        }

        if (strlen($input['password']) < 6) {
            ApiResponse::error('Password must be at least 6 characters', 400);
        }

        if (strlen(preg_replace('/[^0-9]/', '', $input['phone'])) < 10) {
            ApiResponse::error('Phone number must be at least 10 digits', 400);
        }

        $stmt = $this->db->prepare("SELECT id FROM users WHERE email = ?");
        $stmt->execute([$input['email']]);
        if ($stmt->fetch()) {
            ApiResponse::error('Email is already registered', 409);
        }

        $hashedPassword = password_hash($input['password'], PASSWORD_DEFAULT);

        $stmt = $this->db->prepare(
            "INSERT INTO users (name, email, password, role, phone, location) VALUES (?, ?, ?, ?, ?, ?)"
        );
        
        $name = htmlspecialchars(trim($input['name']), ENT_QUOTES, 'UTF-8');
        $phone = htmlspecialchars(trim($input['phone']), ENT_QUOTES, 'UTF-8');
        $location = htmlspecialchars(trim($input['location']), ENT_QUOTES, 'UTF-8');
        $role = $input['role']; // Will be validated or strictly limited
        $email = trim($input['email']);

        $stmt->execute([
            $name,
            $email,
            $hashedPassword,
            $role,
            $phone,
            $location
        ]);

        $input['id'] = (int)$this->db->lastInsertId();
        unset($input['password']);

        // Generate token and assign to new user
        $input['token'] = $this->generateToken(['id' => $input['id'], 'role' => $input['role']]);

        ApiResponse::success(['user' => $input]);
    }

    /**
     * Interconnects an offer entity onto an existing crop node.
     */
    private function submitOffer(array $input): void {
        $authUser = $this->requireAuth();
        if ($authUser['role'] !== 'buyer' && $authUser['role'] !== 'admin') {
            ApiResponse::error('Only buyers can submit offers', 403);
        }

        if (empty($input['cropId']) || empty($input['offeredPrice'])) {
            ApiResponse::error('Missing required offer fields');
        }

        $date = date('Y-m-d');
        $message = htmlspecialchars($input['message'] ?? '', ENT_QUOTES, 'UTF-8');
        $buyerId = (int)$authUser['id'];

        $stmt = $this->db->prepare(
            "INSERT INTO offers (marketplaceId, buyerId, offeredPrice, status, date, message) VALUES (?, ?, ?, 'pending', ?, ?)"
        );
        
        $stmt->execute([
            (int)$input['cropId'],
            $buyerId,
            (float)$input['offeredPrice'],
            $date,
            $message
        ]);

        $input['id'] = (int)$this->db->lastInsertId();
        $input['date'] = $date;
        $input['status'] = 'pending';
        $input['buyerId'] = $buyerId;
        $input['message'] = $message;

        ApiResponse::success(['offer' => $input]);
    }

    /**
     * Initializes a completely new crop mapping item onto the marketplace.
     */
    private function addCrop(array $input): void {
        $authUser = $this->requireAuth();
        if ($authUser['role'] !== 'farmer' && $authUser['role'] !== 'admin') {
            ApiResponse::error('Only farmers can add crops', 403);
        }

        $required = ['name', 'category', 'quantity', 'unit', 'price', 'location'];
        foreach ($required as $field) {
            if (empty($input[$field])) {
                ApiResponse::error("Field '$field' is required for adding a crop");
            }
        }

        $farmerId = (int)$authUser['id'];
        $name = htmlspecialchars(trim($input['name']), ENT_QUOTES, 'UTF-8');
        $category = htmlspecialchars(trim($input['category']), ENT_QUOTES, 'UTF-8');
        $desc = htmlspecialchars($input['description'] ?? '', ENT_QUOTES, 'UTF-8');
        $location = htmlspecialchars(trim($input['location']), ENT_QUOTES, 'UTF-8');
        $unit = htmlspecialchars(trim($input['unit']), ENT_QUOTES, 'UTF-8');

        $farmer_name = htmlspecialchars(trim($input['farmer_name'] ?? ''), ENT_QUOTES, 'UTF-8');
        $farmer_city = htmlspecialchars(trim($input['farmer_city'] ?? ''), ENT_QUOTES, 'UTF-8');
        $farmer_phone = htmlspecialchars(trim($input['farmer_phone'] ?? ''), ENT_QUOTES, 'UTF-8');

        if (empty($farmer_name) || empty($farmer_city) || empty($farmer_phone)) {
            $userStmt = $this->db->prepare("SELECT name, location, phone FROM users WHERE id = ?");
            $userStmt->execute([$farmerId]);
            $userData = $userStmt->fetch();
            if ($userData) {
                if (empty($farmer_name)) $farmer_name = htmlspecialchars($userData['name'], ENT_QUOTES, 'UTF-8');
                if (empty($farmer_city)) $farmer_city = htmlspecialchars($userData['location'], ENT_QUOTES, 'UTF-8');
                if (empty($farmer_phone)) $farmer_phone = htmlspecialchars($userData['phone'], ENT_QUOTES, 'UTF-8');
            }
        }

        // 1. Get or Create Crop Detail
        $stmt = $this->db->prepare("SELECT id FROM crop_details WHERE name = ? AND category = ?");
        $stmt->execute([$name, $category]);
        $detail = $stmt->fetch();
        
        if ($detail) {
            $detailId = (int)$detail['id'];
        } else {
            $stmt = $this->db->prepare("INSERT INTO crop_details (name, category, description) VALUES (?, ?, ?)");
            $stmt->execute([$name, $category, $desc]);
            $detailId = (int)$this->db->lastInsertId();
        }

        // 2. Create Added Crop (Inventory)
        $date = date('Y-m-d');
        $stmt = $this->db->prepare(
            "INSERT INTO added_crops (farmerId, cropDetailId, quantity, unit, harvestDate) VALUES (?, ?, ?, ?, ?)"
        );
        $stmt->execute([
            $farmerId,
            $detailId,
            (int)$input['quantity'],
            $unit,
            $date
        ]);
        $addedCropId = (int)$this->db->lastInsertId();

        // 3. Create Marketplace Listing
        $stmt = $this->db->prepare(
            "INSERT INTO marketplace (addedCropId, price, location, status, listedDate, farmer_name, farmer_city, farmer_phone) VALUES (?, ?, ?, 'available', ?, ?, ?, ?)"
        );
        $stmt->execute([
            $addedCropId,
            (float)$input['price'],
            $location,
            $date,
            $farmer_name,
            $farmer_city,
            $farmer_phone
        ]);

        $input['id'] = (int)$this->db->lastInsertId();
        $input['status'] = 'available';
        $input['listedDate'] = $date;
        $input['clicks'] = 0;
        $input['farmerId'] = $farmerId;
        $input['name'] = $name;
        $input['category'] = $category;
        $input['description'] = $desc;
        $input['location'] = $location;
        $input['unit'] = $unit;
        $input['farmer_name'] = $farmer_name;
        $input['farmer_city'] = $farmer_city;
        $input['farmer_phone'] = $farmer_phone;

        ApiResponse::success(['crop' => $input]);
    }

    /**
     * Revokes visibility and operational state over an active crop item.
     */
    private function deleteCrop(array $input): void {
        $authUser = $this->requireAuth();
        if (empty($input['id'])) {
            ApiResponse::error('Crop ID is required');
        }

        // Get addedCropId to delete from inventory (cascades to marketplace) and check authorization
        $stmt = $this->db->prepare("
            SELECT m.addedCropId, a.farmerId 
            FROM marketplace m 
            JOIN added_crops a ON m.addedCropId = a.id 
            WHERE m.id = ?
        ");
        $stmt->execute([(int)$input['id']]);
        $row = $stmt->fetch();
        
        if (!$row) {
            ApiResponse::error('Crop not found', 404);
        }

        if ($authUser['role'] !== 'admin' && (int)$row['farmerId'] !== (int)$authUser['id']) {
            ApiResponse::error('Unauthorized to delete this crop', 403);
        }
        
        if ($row) {
            $stmt = $this->db->prepare("DELETE FROM added_crops WHERE id = ?");
            $stmt->execute([(int)$row['addedCropId']]);
        }

        ApiResponse::success();
    }

    /**
     * Modifies the phase state classification for a specific inbound offer.
     */
    private function updateOffer(array $input): void {
        $authUser = $this->requireAuth();
        if (empty($input['id']) || empty($input['status'])) {
            ApiResponse::error('Offer ID and status are required');
        }

        $allowedStatuses = ['pending', 'accepted', 'rejected'];
        if (!in_array($input['status'], $allowedStatuses, true)) {
            ApiResponse::error('Invalid offer status');
        }

        // Verify that the person updating the offer is the farmer of the respective crop
        $stmt = $this->db->prepare("
            SELECT o.id, a.farmerId
            FROM offers o
            JOIN marketplace m ON o.marketplaceId = m.id
            JOIN added_crops a ON m.addedCropId = a.id
            WHERE o.id = ?
        ");
        $stmt->execute([(int)$input['id']]);
        $row = $stmt->fetch();

        if (!$row) {
            ApiResponse::error('Offer not found', 404);
        }

        if ($authUser['role'] !== 'admin' && (int)$row['farmerId'] !== (int)$authUser['id']) {
            ApiResponse::error('Unauthorized to update this offer', 403);
        }

        $stmt = $this->db->prepare("UPDATE offers SET status = ? WHERE id = ?");
        $stmt->execute([$input['status'], (int)$input['id']]);

        ApiResponse::success();
    }

    /**
     * Tracks a click on a specific marketplace crop.
     */
    private function trackClick(array $input): void {
        if (empty($input['id'])) {
            ApiResponse::error('Crop ID is required');
        }

        $stmt = $this->db->prepare("UPDATE marketplace SET clicks = clicks + 1 WHERE id = ?");
        $stmt->execute([(int)$input['id']]);

        ApiResponse::success();
    }

    /**
     * Assembles globally required structural parameters for application mount routines.
     */
    private function getData(): void {
        $users = $this->db->query("SELECT id, name, email, role, phone, location, is_approved FROM users")->fetchAll();
        foreach ($users as &$u) {
            $u['id'] = (int)$u['id'];
            $u['is_approved'] = (int)($u['is_approved'] ?? 1); // fallback if not present
        }

        $cropsQuery = "SELECT 
            m.id as id,
            a.farmerId,
            cd.name,
            cd.category,
            a.quantity,
            a.unit,
            m.price,
            m.status,
            m.location,
            cd.description,
            m.listedDate,
            m.clicks,
            m.farmer_name,
            m.farmer_city,
            m.farmer_phone
        FROM marketplace m
        JOIN added_crops a ON m.addedCropId = a.id
        JOIN crop_details cd ON a.cropDetailId = cd.id";
        
        $crops = $this->db->query($cropsQuery)->fetchAll();
        foreach ($crops as &$c) {
            $c['id'] = (int)$c['id'];
            $c['farmerId'] = (int)$c['farmerId'];
            $c['price'] = (float)$c['price'];
            $c['quantity'] = (int)$c['quantity'];
            $c['clicks'] = (int)($c['clicks'] ?? 0);
            $c['farmer_name'] = $c['farmer_name'] ?? '';
            $c['farmer_city'] = $c['farmer_city'] ?? '';
            $c['farmer_phone'] = $c['farmer_phone'] ?? '';
        }

        $offers = $this->db->query("SELECT id, marketplaceId as cropId, buyerId, offeredPrice, status, date, message FROM offers")->fetchAll();
        foreach ($offers as &$o) {
            $o['id'] = (int)$o['id'];
            $o['cropId'] = (int)$o['cropId'];
            $o['buyerId'] = (int)$o['buyerId'];
            $o['offeredPrice'] = (float)$o['offeredPrice'];
        }

        $regionalStats = [];
        try {
            $regionalStats = $this->db->query("SELECT * FROM regional_stats")->fetchAll();
        } catch (Exception $e) {
            try {
                $this->db->exec("CREATE TABLE IF NOT EXISTS regional_stats (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    region VARCHAR(100),
                    crop_name VARCHAR(100),
                    avg_price DECIMAL(10,2),
                    demand_level INT,
                    avg_yield VARCHAR(50)
                )");
                $this->db->exec("INSERT INTO regional_stats (region, crop_name, avg_price, demand_level, avg_yield) VALUES 
                    ('Mianwali', 'Wheat', 95.00, 85, '40 maunds/acre'),
                    ('Mianwali', 'Cotton', 450.00, 90, '30 maunds/acre'),
                    ('Mianwali', 'Sugarcane', 35.00, 75, '800 maunds/acre'),
                    ('Isa Khel', 'Wheat', 92.00, 80, '38 maunds/acre'),
                    ('Isa Khel', 'Rice', 220.00, 88, '45 maunds/acre'),
                    ('Piplan', 'Citrus', 120.00, 95, '500 boxes/acre'),
                    ('Kundian', 'Gram', 150.00, 82, '15 maunds/acre'),
                    ('Kundian', 'Wheat', 94.00, 85, '35 maunds/acre'),
                    ('Daudkhel', 'Peanuts', 300.00, 89, '20 maunds/acre'),
                    ('Daudkhel', 'Sorghum', 65.00, 70, '30 maunds/acre'),
                    ('Kalabagh', 'Maize', 75.00, 90, '60 maunds/acre'),
                    ('Kalabagh', 'Wheat', 96.00, 86, '42 maunds/acre'),
                    ('Wan Bhachran', 'Sugarcane', 34.00, 78, '850 maunds/acre'),
                    ('Wan Bhachran', 'Cotton', 440.00, 91, '28 maunds/acre')
                ");
                $regionalStats = $this->db->query("SELECT * FROM regional_stats")->fetchAll();
            } catch (Exception $e2) {
            }
        }

        $govtSchemes = [];
        try {
            $query = "SELECT 
                        s.scheme_id AS id,
                        s.scheme_name AS title,
                        s.description,
                        s.category,
                        s.official_portal AS link,
                        (SELECT GROUP_CONCAT(DISTINCT benefit_description SEPARATOR '; ') FROM benefits b WHERE b.scheme_id = s.scheme_id) AS benefits,
                        (SELECT GROUP_CONCAT(DISTINCT criteria SEPARATOR '; ') FROM eligibility e WHERE e.scheme_id = s.scheme_id) AS eligibility
                      FROM schemes s
                      WHERE s.status = 'Active'
                      ORDER BY s.launch_date DESC";
            $govtSchemes = $this->db->query($query)->fetchAll();
        } catch (Exception $e) {
            $govtSchemes = [];
        }

        $diagnostics = [];
        try {
            $diagnostics = $this->db->query("SELECT * FROM ai_diagnostics_history ORDER BY scan_date DESC")->fetchAll();
        } catch (Exception $e) {
            $diagnostics = [];
        }

        $diseases = [];
        try {
            $diseases = $this->db->query("SELECT * FROM diseases")->fetchAll();
            foreach ($diseases as &$d) {
                $d['id'] = (int)$d['id'];
            }
        } catch (Exception $e) {
            $diseases = [];
        }

        ApiResponse::raw([
            'users' => $users, 
            'crops' => $crops, 
            'offers' => $offers,
            'regional_stats' => $regionalStats,
            'govt_schemes' => $govtSchemes,
            'diagnostics' => $diagnostics,
            'diseases' => $diseases
        ]);
    }

    private function requireAdmin(): array {
        $user = $this->requireAuth();
        if ($user['role'] !== 'admin') {
            ApiResponse::error('Unauthorized. Administrator access required.', 403);
        }
        return $user;
    }

    private function addDisease(array $input): void {
        $this->requireAdmin();
        
        $name = trim($input['name'] ?? '');
        $ur_name = trim($input['ur_name'] ?? '');
        $crop = trim($input['crop'] ?? '');
        $type = trim($input['type'] ?? '');
        $symptoms = trim($input['symptoms'] ?? '');
        $ur_symptoms = trim($input['ur_symptoms'] ?? '');
        $treatment = trim($input['treatment'] ?? '');
        $ur_treatment = trim($input['ur_treatment'] ?? '');
        $severity = trim($input['severity'] ?? '');
        $image = trim($input['image'] ?? '');
        $condition_name = trim($input['condition_name'] ?? 'Diseased');
        
        if (empty($name) || empty($ur_name) || empty($crop) || empty($image)) {
            ApiResponse::error('Required fields: English and Urdu names, crop type, and reference image URL are missing.');
        }
        
        $stmt = $this->db->prepare("
            INSERT INTO diseases (name, ur_name, crop, type, symptoms, ur_symptoms, treatment, ur_treatment, severity, image, condition_name)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");
        $stmt->execute([$name, $ur_name, $crop, $type, $symptoms, $ur_symptoms, $treatment, $ur_treatment, $severity, $image, $condition_name]);
        
        ApiResponse::success(['message' => 'Disease added successfully.']);
    }
    
    private function updateDisease(array $input): void {
        $this->requireAdmin();
        
        $id = (int)($input['id'] ?? 0);
        $name = trim($input['name'] ?? '');
        $ur_name = trim($input['ur_name'] ?? '');
        $crop = trim($input['crop'] ?? '');
        $type = trim($input['type'] ?? '');
        $symptoms = trim($input['symptoms'] ?? '');
        $ur_symptoms = trim($input['ur_symptoms'] ?? '');
        $treatment = trim($input['treatment'] ?? '');
        $ur_treatment = trim($input['ur_treatment'] ?? '');
        $severity = trim($input['severity'] ?? '');
        $image = trim($input['image'] ?? '');
        $condition_name = trim($input['condition_name'] ?? 'Diseased');
        
        if ($id <= 0 || empty($name) || empty($ur_name) || empty($crop) || empty($image)) {
            ApiResponse::error('Valid ID and required fields are missing.');
        }
        
        $stmt = $this->db->prepare("
            UPDATE diseases 
            SET name = ?, ur_name = ?, crop = ?, type = ?, symptoms = ?, ur_symptoms = ?, treatment = ?, ur_treatment = ?, severity = ?, image = ?, condition_name = ?
            WHERE id = ?
        ");
        $stmt->execute([$name, $ur_name, $crop, $type, $symptoms, $ur_symptoms, $treatment, $ur_treatment, $severity, $image, $condition_name, $id]);
        
        ApiResponse::success(['message' => 'Disease updated successfully.']);
    }
    
    private function deleteDisease(array $input): void {
        $this->requireAdmin();
        
        $id = (int)($input['id'] ?? 0);
        if ($id <= 0) {
            ApiResponse::error('Valid disease ID is required.');
        }
        
        $stmt = $this->db->prepare("DELETE FROM diseases WHERE id = ?");
        $stmt->execute([$id]);
        
        ApiResponse::success(['message' => 'Disease deleted successfully.']);
    }
}

// Instantiate processing stream boundary logic.
$controller = new ApiController();
$controller->handleRequest();
