<?php
/**
 * ============================================================
 * AgriConnect – One-Click Database Setup & Reset Tool
 * ============================================================
 * Run this script ONCE in your browser:
 *   http://localhost/Humanoid%20Agriculture%20Mrketplace%20%20Database/setup.php
 *
 * It will:
 *  1. Drop and recreate the 'agriconnect' database
 *  2. Create all required tables
 *  3. Seed demo users with CORRECT bcrypt password hashes
 *  4. Seed crop details, inventory, marketplace listings, and offers
 */

declare(strict_types=1);

// ─── Configuration ────────────────────────────────────────────
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'agriconnect');

$errors = [];
$steps  = [];

// ─── Connect to MySQL (no DB selected yet) ────────────────────
try {
    $pdo = new PDO(
        "mysql:host=" . DB_HOST . ";charset=utf8mb4",
        DB_USER,
        DB_PASS,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );
    $steps[] = ['ok', 'Connected to MySQL server successfully.'];
} catch (PDOException $e) {
    die("<h2 style='color:red'>❌ Cannot connect to MySQL: " . htmlspecialchars($e->getMessage()) . "</h2>
         <p>Make sure XAMPP is running and MySQL is started.</p>");
}

// ─── Drop & Recreate Database ─────────────────────────────────
try {
    $pdo->exec("DROP DATABASE IF EXISTS `" . DB_NAME . "`");
    $pdo->exec("CREATE DATABASE `" . DB_NAME . "` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    $pdo->exec("USE `" . DB_NAME . "`");
    $steps[] = ['ok', "Database '" . DB_NAME . "' created fresh."];
} catch (PDOException $e) {
    $errors[] = 'Database creation failed: ' . $e->getMessage();
}

// ─── Create Tables ────────────────────────────────────────────
$tables = [
    'users' => "CREATE TABLE `users` (
        `id`         INT(11)      NOT NULL AUTO_INCREMENT,
        `name`       VARCHAR(255) NOT NULL,
        `email`      VARCHAR(255) NOT NULL,
        `password`   VARCHAR(255) NOT NULL,
        `role`       ENUM('farmer','buyer','admin') NOT NULL,
        `phone`      VARCHAR(50)  NOT NULL,
        `location`   VARCHAR(255) NOT NULL,
        `created_at` TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (`id`),
        UNIQUE KEY `email` (`email`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",

    'crop_details' => "CREATE TABLE `crop_details` (
        `id`          INT(11)      NOT NULL AUTO_INCREMENT,
        `name`        VARCHAR(100) NOT NULL,
        `category`    VARCHAR(100) NOT NULL,
        `description` TEXT,
        PRIMARY KEY (`id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",

    'added_crops' => "CREATE TABLE `added_crops` (
        `id`           INT(11)      NOT NULL AUTO_INCREMENT,
        `farmerId`     INT(11)      NOT NULL,
        `cropDetailId` INT(11)      NOT NULL,
        `quantity`     INT(11)      NOT NULL,
        `unit`         VARCHAR(20)  NOT NULL DEFAULT 'kg',
        `harvestDate`  DATE,
        `addedDate`    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (`id`),
        FOREIGN KEY (`farmerId`)     REFERENCES `users`(`id`)        ON DELETE CASCADE,
        FOREIGN KEY (`cropDetailId`) REFERENCES `crop_details`(`id`) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",

    'marketplace' => "CREATE TABLE `marketplace` (
        `id`          INT(11)       NOT NULL AUTO_INCREMENT,
        `addedCropId` INT(11)       NOT NULL,
        `price`       DECIMAL(10,2) NOT NULL,
        `location`    VARCHAR(255)  NOT NULL,
        `status`      ENUM('available','sold','archived') DEFAULT 'available',
        `listedDate`  DATE          NOT NULL,
        `clicks`      INT(11)       DEFAULT 0,
        `farmer_name`  VARCHAR(255)   DEFAULT NULL,
        `farmer_city`  VARCHAR(255)   DEFAULT NULL,
        `farmer_phone` VARCHAR(50)    DEFAULT NULL,
        PRIMARY KEY (`id`),
        FOREIGN KEY (`addedCropId`) REFERENCES `added_crops`(`id`) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",

    'offers' => "CREATE TABLE `offers` (
        `id`            INT(11)       NOT NULL AUTO_INCREMENT,
        `marketplaceId` INT(11)       NOT NULL,
        `buyerId`       INT(11)       NOT NULL,
        `offeredPrice`  DECIMAL(10,2) NOT NULL,
        `status`        ENUM('pending','accepted','rejected') DEFAULT 'pending',
        `date`          DATE          NOT NULL,
        `message`       TEXT,
        PRIMARY KEY (`id`),
        FOREIGN KEY (`marketplaceId`) REFERENCES `marketplace`(`id`) ON DELETE CASCADE,
        FOREIGN KEY (`buyerId`)       REFERENCES `users`(`id`)       ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",

    'diseases' => "CREATE TABLE `diseases` (
        `id` INT AUTO_INCREMENT PRIMARY KEY,
        `name` VARCHAR(255) NOT NULL,
        `ur_name` VARCHAR(255) NOT NULL,
        `crop` VARCHAR(255) NOT NULL,
        `type` VARCHAR(255) NOT NULL,
        `symptoms` TEXT NOT NULL,
        `ur_symptoms` TEXT NOT NULL,
        `treatment` TEXT NOT NULL,
        `ur_treatment` TEXT NOT NULL,
        `severity` VARCHAR(100) NOT NULL,
        `image` VARCHAR(500) NOT NULL,
        `condition_name` VARCHAR(100) DEFAULT 'Diseased'
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",

    'ai_diagnostics_history' => "CREATE TABLE `ai_diagnostics_history` (
        `id` INT AUTO_INCREMENT PRIMARY KEY,
        `farmerId` INT DEFAULT NULL,
        `disease_name` VARCHAR(255) NOT NULL,
        `confidence` DECIMAL(5,2) NOT NULL,
        `crop` VARCHAR(100) NOT NULL,
        `scan_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (`farmerId`) REFERENCES `users`(`id`) ON DELETE SET NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",
];

foreach ($tables as $name => $sql) {
    try {
        $pdo->exec($sql);
        $steps[] = ['ok', "Table '$name' created."];
    } catch (PDOException $e) {
        $errors[] = "Failed to create table '$name': " . $e->getMessage();
    }
}

// ─── Seed Users (with CORRECT bcrypt hashes) ──────────────────
$users = [
    ['Azan Mehdi',       'azan@farmer.pk',     '123456',   'farmer', '0301-1234567', 'Mianwali'],
    ['Usman Saif',       'usman@buyer.pk',     '123456',   'buyer',  '0312-9876543', 'Islamabad'],
    ['Admin',            'admin@agri.pk',      'admin123', 'admin',  '0300-0000000', 'Mianwali'],
    ['Kashmala Fatimah', 'kashmala@farmer.pk', '123456',   'farmer', '0333-5556677', 'Isa Khel'],
];

$stmt = $pdo->prepare(
    "INSERT INTO `users` (`name`, `email`, `password`, `role`, `phone`, `location`) VALUES (?, ?, ?, ?, ?, ?)"
);

foreach ($users as [$name, $email, $plainPass, $role, $phone, $loc]) {
    $hash = password_hash($plainPass, PASSWORD_DEFAULT);
    try {
        $stmt->execute([$name, $email, $hash, $role, $phone, $loc]);
        $steps[] = ['ok', "User '$name' ($role) inserted — email: $email, password: $plainPass"];
    } catch (PDOException $e) {
        $errors[] = "Failed to insert user '$name': " . $e->getMessage();
    }
}

// ─── Seed Crop Details ────────────────────────────────────────
$cropDetails = [
    ['Wheat',     'Grain',     'Premium quality wheat grain from Mianwali region.'],
    ['Rice',      'Grain',     'Basmati rice, long-grain fragrant variety.'],
    ['Sugarcane', 'Cash Crop', 'Fresh sugarcane ready for processing.'],
    ['Cotton',    'Cash Crop', 'High-grade lint cotton.'],
    ['Maize',     'Grain',     'Yellow maize corn, good for feed and flour.'],
    ['Mango',     'Fruit',     'Chaunsa mangoes, premium export-grade.'],
    ['Citrus',    'Fruit',     'Kinnow oranges, juicy and fresh.'],
    ['Tomato',    'Vegetable', 'Fresh red tomatoes, vine-ripened.'],
    ['Potato',    'Vegetable', 'White potatoes, medium to large size.'],
    ['Onion',     'Vegetable', 'Red onions, freshly harvested.'],
    ['Chickpea',  'Grain',     'Desi chickpeas, high protein content.'],
];

$stmt = $pdo->prepare("INSERT INTO `crop_details` (`name`, `category`, `description`) VALUES (?, ?, ?)");
foreach ($cropDetails as $row) {
    try {
        $stmt->execute($row);
    } catch (PDOException $e) {
        $errors[] = "Failed to insert crop detail '{$row[0]}': " . $e->getMessage();
    }
}
$steps[] = ['ok', count($cropDetails) . ' crop types seeded into crop_details.'];

// ─── Seed Added Crops (Inventory) ────────────────────────────
// farmerId 1 = Azan Mehdi, farmerId 4 = Kashmala Fatimah
$addedCrops = [
    [1, 1,  500,  'kg', '2026-02-10'],
    [1, 2,  300,  'kg', '2026-02-15'],
    [4, 3,  2000, 'kg', '2026-02-25'],
    [1, 4,  150,  'kg', '2026-01-05'],
    [4, 5,  400,  'kg', '2026-02-20'],
    [1, 6,  200,  'kg', '2026-03-01'],
    [4, 7,  350,  'kg', '2026-02-14'],
    [1, 8,  100,  'kg', '2026-02-28'],
    [4, 9,  600,  'kg', '2026-02-20'],
    [4, 10, 250,  'kg', '2026-02-28'],
    [1, 11, 180,  'kg', '2026-02-20'],
];

$stmt = $pdo->prepare(
    "INSERT INTO `added_crops` (`farmerId`, `cropDetailId`, `quantity`, `unit`, `harvestDate`) VALUES (?, ?, ?, ?, ?)"
);
foreach ($addedCrops as $row) {
    try {
        $stmt->execute($row);
    } catch (PDOException $e) {
        $errors[] = "Failed to insert added_crop: " . $e->getMessage();
    }
}
$steps[] = ['ok', count($addedCrops) . ' crop inventory entries seeded into added_crops.'];

// ─── Seed Marketplace Listings ────────────────────────────────
$listings = [
    [1,  95.00,  'Mianwali', 'available', '2026-02-15', 12, 'Azan Mehdi', 'Mianwali', '0301-1234567'],
    [2,  220.00, 'Mianwali', 'available', '2026-02-20', 5, 'Azan Mehdi', 'Mianwali', '0301-1234567'],
    [3,  30.00,  'Isa Khel', 'available', '2026-03-01', 8, 'Kashmala Fatimah', 'Isa Khel', '0333-5556677'],
    [4,  450.00, 'Mianwali', 'sold',      '2026-01-10', 25, 'Azan Mehdi', 'Mianwali', '0301-1234567'],
    [5,  75.00,  'Isa Khel', 'available', '2026-02-28', 2, 'Kashmala Fatimah', 'Isa Khel', '0333-5556677'],
    [6,  180.00, 'Mianwali', 'available', '2026-03-05', 40, 'Azan Mehdi', 'Mianwali', '0301-1234567'],
    [7,  120.00, 'Isa Khel', 'available', '2026-02-18', 15, 'Kashmala Fatimah', 'Isa Khel', '0333-5556677'],
    [8,  140.00, 'Mianwali', 'available', '2026-03-02', 10, 'Azan Mehdi', 'Mianwali', '0301-1234567'],
    [9,  60.00,  'Isa Khel', 'available', '2026-02-25', 4, 'Kashmala Fatimah', 'Isa Khel', '0333-5556677'],
    [10, 90.00,  'Isa Khel', 'available', '2026-03-03', 7, 'Kashmala Fatimah', 'Isa Khel', '0333-5556677'],
    [11, 200.00, 'Mianwali', 'available', '2026-02-22', 11, 'Azan Mehdi', 'Mianwali', '0301-1234567'],
];

$stmt = $pdo->prepare(
    "INSERT INTO `marketplace` (`addedCropId`, `price`, `location`, `status`, `listedDate`, `clicks`, `farmer_name`, `farmer_city`, `farmer_phone`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
);
foreach ($listings as $row) {
    try {
        $stmt->execute($row);
    } catch (PDOException $e) {
        $errors[] = "Failed to insert marketplace listing: " . $e->getMessage();
    }
}
$steps[] = ['ok', count($listings) . ' marketplace listings seeded.'];

// ─── Seed Offers ──────────────────────────────────────────────
// buyerId 2 = Usman Saif
$offers = [
    [1, 2, 85.00,  'pending',  '2026-03-06', 'I need 200kg of wheat. Can you do Rs.85/kg for bulk order?'],
    [2, 2, 200.00, 'accepted', '2026-03-04', 'Looking for 100kg basmati rice.'],
    [6, 2, 160.00, 'pending',  '2026-03-07', 'Need premium Chaunsa mangoes for export.'],
    [3, 2, 25.00,  'rejected', '2026-03-02', 'Can you provide 1000kg sugarcane at Rs.25/kg?'],
    [8, 2, 130.00, 'pending',  '2026-03-07', 'Fresh tomatoes needed for our store.'],
];

$stmt = $pdo->prepare(
    "INSERT INTO `offers` (`marketplaceId`, `buyerId`, `offeredPrice`, `status`, `date`, `message`) VALUES (?, ?, ?, ?, ?, ?)"
);
foreach ($offers as $row) {
    try {
        $stmt->execute($row);
    } catch (PDOException $e) {
        $errors[] = "Failed to insert offer: " . $e->getMessage();
    }
}
$steps[] = ['ok', count($offers) . ' offers seeded.'];

// ─── Seed Diseases ───────────────────────────────────────────
$diseases = [
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

$stmt = $pdo->prepare(
    "INSERT INTO `diseases` (`name`, `ur_name`, `crop`, `type`, `symptoms`, `ur_symptoms`, `treatment`, `ur_treatment`, `severity`, `image`, `condition_name`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
);
foreach ($diseases as $row) {
    try {
        $stmt->execute($row);
    } catch (PDOException $e) {
        $errors[] = "Failed to insert disease: " . $e->getMessage();
    }
}
$steps[] = ['ok', count($diseases) . ' diseases seeded.'];

// ─── Verify: Test API endpoint ────────────────────────────────
$totalUsers  = $pdo->query("SELECT COUNT(*) FROM users")->fetchColumn();
$totalCrops  = $pdo->query("SELECT COUNT(*) FROM marketplace")->fetchColumn();
$totalOffers = $pdo->query("SELECT COUNT(*) FROM offers")->fetchColumn();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>AgriConnect – Database Setup</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
    <style>
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Inter', sans-serif; background: #f0fdf4; color: #1a2e1a; padding: 40px 20px; }
        .container { max-width: 760px; margin: 0 auto; }
        h1 { font-size: 1.8rem; font-weight: 700; color: #166534; margin-bottom: 8px; }
        .subtitle { color: #4b7a4b; margin-bottom: 32px; }
        .card { background: white; border-radius: 12px; padding: 24px; margin-bottom: 24px; box-shadow: 0 1px 4px rgba(0,0,0,.07); }
        .step { display: flex; align-items: flex-start; gap: 10px; padding: 8px 0; border-bottom: 1px solid #f0f0f0; font-size: .9rem; }
        .step:last-child { border-bottom: none; }
        .ok  { color: #16a34a; font-weight: 700; flex-shrink: 0; }
        .err { color: #dc2626; font-weight: 700; flex-shrink: 0; }
        .stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin: 24px 0; }
        .stat { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 10px; padding: 16px; text-align: center; }
        .stat-num { font-size: 2rem; font-weight: 700; color: #16a34a; }
        .stat-lbl { font-size: .8rem; color: #4b7a4b; margin-top: 4px; }
        .creds { background: #fffbeb; border: 1px solid #fde68a; border-radius: 10px; padding: 20px; }
        .cred-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: .88rem; border-bottom: 1px solid #fef3c7; }
        .cred-row:last-child { border-bottom: none; }
        .cred-label { font-weight: 600; color: #92400e; }
        .errors { background: #fef2f2; border: 1px solid #fecaca; border-radius: 10px; padding: 16px; }
        .error-item { color: #dc2626; font-size: .85rem; padding: 4px 0; }
        .launch-btn { display: inline-block; margin-top: 24px; background: #16a34a; color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 1rem; }
        .launch-btn:hover { background: #15803d; }
    </style>
</head>
<body>
<div class="container">
    <h1>🌾 AgriConnect — Database Setup</h1>
    <p class="subtitle">One-click database initialisation complete.</p>

    <?php if (!empty($errors)): ?>
    <div class="errors">
        <strong>⚠️ Errors Encountered:</strong>
        <?php foreach ($errors as $e): ?>
        <div class="error-item">• <?= htmlspecialchars($e) ?></div>
        <?php endforeach; ?>
    </div>
    <?php endif; ?>

    <div class="stats">
        <div class="stat"><div class="stat-num"><?= $totalUsers ?></div><div class="stat-lbl">Users Seeded</div></div>
        <div class="stat"><div class="stat-num"><?= $totalCrops ?></div><div class="stat-lbl">Crop Listings</div></div>
        <div class="stat"><div class="stat-num"><?= $totalOffers ?></div><div class="stat-lbl">Offers Seeded</div></div>
    </div>

    <div class="card">
        <h2 style="font-size:1rem;margin-bottom:16px;color:#166534">✅ Setup Log</h2>
        <?php foreach ($steps as [$type, $msg]): ?>
        <div class="step">
            <span class="<?= $type ?>"><?= $type === 'ok' ? '✔' : '✖' ?></span>
            <span><?= htmlspecialchars($msg) ?></span>
        </div>
        <?php endforeach; ?>
    </div>

    <div class="creds">
        <strong style="color:#92400e;display:block;margin-bottom:12px">🔑 Demo Login Credentials</strong>
        <div class="cred-row"><span class="cred-label">🌾 Farmer</span><span>azan@farmer.pk</span><span>123456</span></div>
        <div class="cred-row"><span class="cred-label">🛒 Buyer</span><span>usman@buyer.pk</span><span>123456</span></div>
        <div class="cred-row"><span class="cred-label">🔑 Admin</span><span>admin@agri.pk</span><span>admin123</span></div>
        <div class="cred-row"><span class="cred-label">🌾 Farmer 2</span><span>kashmala@farmer.pk</span><span>123456</span></div>
    </div>

    <?php if (empty($errors)): ?>
    <a class="launch-btn" href="index.html">🚀 Launch AgriConnect App →</a>
    <?php endif; ?>
</div>
</body>
</html>
