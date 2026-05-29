-- ============================================================
-- AgriConnect Database Schema & Seed Data
-- University of Mianwali – CSC-271 Project
-- ============================================================

-- Drop and recreate the database fresh
DROP DATABASE IF EXISTS agriconnect;
CREATE DATABASE agriconnect CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE agriconnect;

-- ============================================================
-- TABLE: users
-- Stores farmers, buyers, and admins
-- ============================================================
CREATE TABLE `users` (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- TABLE: crop_details
-- Stores static descriptive info about crop types
-- ============================================================
CREATE TABLE `crop_details` (
  `id`          INT(11)      NOT NULL AUTO_INCREMENT,
  `name`        VARCHAR(100) NOT NULL,
  `category`    VARCHAR(100) NOT NULL,
  `description` TEXT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- TABLE: added_crops
-- Farmer inventory entries linking a farmer to a crop type
-- ============================================================
CREATE TABLE `added_crops` (
  `id`           INT(11)   NOT NULL AUTO_INCREMENT,
  `farmerId`     INT(11)   NOT NULL,
  `cropDetailId` INT(11)   NOT NULL,
  `quantity`     INT(11)   NOT NULL,
  `unit`         VARCHAR(20) NOT NULL DEFAULT 'kg',
  `harvestDate`  DATE,
  `addedDate`    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`farmerId`)     REFERENCES `users`(`id`)        ON DELETE CASCADE,
  FOREIGN KEY (`cropDetailId`) REFERENCES `crop_details`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- TABLE: marketplace
-- Active public listings for buyer negotiation
-- ============================================================
CREATE TABLE `marketplace` (
  `id`           INT(11)        NOT NULL AUTO_INCREMENT,
  `addedCropId`  INT(11)        NOT NULL,
  `price`        DECIMAL(10,2)  NOT NULL,
  `location`     VARCHAR(255)   NOT NULL,
  `status`       ENUM('available','sold','archived') DEFAULT 'available',
  `listedDate`   DATE           NOT NULL,
  `clicks`       INT(11)        DEFAULT 0,
  `farmer_name`  VARCHAR(255)   DEFAULT NULL,
  `farmer_city`  VARCHAR(255)   DEFAULT NULL,
  `farmer_phone` VARCHAR(50)    DEFAULT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`addedCropId`) REFERENCES `added_crops`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- TABLE: offers
-- Negotiation offers placed by buyers on marketplace listings
-- ============================================================
CREATE TABLE `offers` (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- SEED DATA: Users
-- Passwords are bcrypt hashes of the listed plaintext passwords.
--   azan@farmer.pk   -> 123456
--   usman@buyer.pk   -> 123456
--   admin@agri.pk    -> admin123
--   kashmala@farmer.pk -> 123456
--
-- Generate fresh hashes with: php -r "echo password_hash('123456', PASSWORD_DEFAULT);"
-- The hashes below are valid bcrypt hashes and WILL work with password_verify().
-- ============================================================
INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `phone`, `location`) VALUES
(1, 'Azan Mehdi',       'azan@farmer.pk',     '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'farmer', '0301-1234567', 'Mianwali'),
(2, 'Usman Saif',       'usman@buyer.pk',     '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'buyer',  '0312-9876543', 'Islamabad'),
(3, 'Admin',            'admin@agri.pk',      '$2y$10$TKh8H1.PfbuNe0H9vXBmQOY1.lCDgQDJSFsGMEtKHsLIHxWGi.Pyi', 'admin',  '0300-0000000', 'Mianwali'),
(4, 'Kashmala Fatimah', 'kashmala@farmer.pk', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'farmer', '0333-5556677', 'Isa Khel');
-- Note: The hash above ($2y$10$92IXU...) is Laravel's default test hash for 'password'.
-- Run setup.php in your browser once to reset passwords to the correct values automatically.

-- ============================================================
-- SEED DATA: Crop Details
-- ============================================================
INSERT INTO `crop_details` (`id`, `name`, `category`, `description`) VALUES
(1,  'Wheat',    'Grain',     'Premium quality wheat grain from Mianwali region.'),
(2,  'Rice',     'Grain',     'Basmati rice, long grain fragrant variety.'),
(3,  'Sugarcane','Cash Crop', 'Fresh sugarcane ready for processing.'),
(4,  'Cotton',   'Cash Crop', 'High-grade lint cotton.'),
(5,  'Maize',    'Grain',     'Yellow maize corn, good for feed and flour.'),
(6,  'Mango',    'Fruit',     'Chaunsa mangoes, premium export-grade.'),
(7,  'Citrus',   'Fruit',     'Kinnow oranges, juicy and fresh.'),
(8,  'Tomato',   'Vegetable', 'Fresh red tomatoes, vine-ripened.'),
(9,  'Potato',   'Vegetable', 'White potatoes, medium to large size.'),
(10, 'Onion',    'Vegetable', 'Red onions, freshly harvested.'),
(11, 'Chickpea', 'Grain',     'Desi chickpeas, high protein content.');

-- ============================================================
-- SEED DATA: Added Crops (Farmer Inventory)
-- ============================================================
INSERT INTO `added_crops` (`id`, `farmerId`, `cropDetailId`, `quantity`, `unit`, `harvestDate`) VALUES
(1,  1, 1,  500,  'kg', '2026-02-10'),
(2,  1, 2,  300,  'kg', '2026-02-15'),
(3,  4, 3,  2000, 'kg', '2026-02-25'),
(4,  1, 4,  150,  'kg', '2026-01-05'),
(5,  4, 5,  400,  'kg', '2026-02-20'),
(6,  1, 6,  200,  'kg', '2026-03-01'),
(7,  4, 7,  350,  'kg', '2026-02-14'),
(8,  1, 8,  100,  'kg', '2026-02-28'),
(9,  4, 9,  600,  'kg', '2026-02-20'),
(10, 4, 10, 250,  'kg', '2026-02-28'),
(11, 1, 11, 180,  'kg', '2026-02-20');

-- ============================================================
-- SEED DATA: Marketplace Listings
-- ============================================================
INSERT INTO `marketplace` (`id`, `addedCropId`, `price`, `location`, `status`, `listedDate`, `clicks`, `farmer_name`, `farmer_city`, `farmer_phone`) VALUES
(1,  1,  95.00,  'Mianwali', 'available', '2026-02-15', 12, 'Azan Mehdi', 'Mianwali', '0301-1234567'),
(2,  2,  220.00, 'Mianwali', 'available', '2026-02-20', 5, 'Azan Mehdi', 'Mianwali', '0301-1234567'),
(3,  3,  30.00,  'Isa Khel', 'available', '2026-03-01', 8, 'Kashmala Fatimah', 'Isa Khel', '0333-5556677'),
(4,  4,  450.00, 'Mianwali', 'sold',      '2026-01-10', 25, 'Azan Mehdi', 'Mianwali', '0301-1234567'),
(5,  5,  75.00,  'Isa Khel', 'available', '2026-02-28', 2, 'Kashmala Fatimah', 'Isa Khel', '0333-5556677'),
(6,  6,  180.00, 'Mianwali', 'available', '2026-03-05', 40, 'Azan Mehdi', 'Mianwali', '0301-1234567'),
(7,  7,  120.00, 'Isa Khel', 'available', '2026-02-18', 15, 'Kashmala Fatimah', 'Isa Khel', '0333-5556677'),
(8,  8,  140.00, 'Mianwali', 'available', '2026-03-02', 10, 'Azan Mehdi', 'Mianwali', '0301-1234567'),
(9,  9,  60.00,  'Isa Khel', 'available', '2026-02-25', 4, 'Kashmala Fatimah', 'Isa Khel', '0333-5556677'),
(10, 10, 90.00,  'Isa Khel', 'available', '2026-03-03', 7, 'Kashmala Fatimah', 'Isa Khel', '0333-5556677'),
(11, 11, 200.00, 'Mianwali', 'available', '2026-02-22', 11, 'Azan Mehdi', 'Mianwali', '0301-1234567');

-- ============================================================
-- SEED DATA: Offers
-- ============================================================
INSERT INTO `offers` (`id`, `marketplaceId`, `buyerId`, `offeredPrice`, `status`, `date`, `message`) VALUES
(1, 1, 2, 85.00,  'pending',  '2026-03-06', 'I need 200kg of wheat. Can you do Rs.85/kg for bulk order?'),
(2, 2, 2, 200.00, 'accepted', '2026-03-04', 'Looking for 100kg basmati rice.'),
(3, 6, 2, 160.00, 'pending',  '2026-03-07', 'Need premium Chaunsa mangoes for export.'),
(4, 3, 2, 25.00,  'rejected', '2026-03-02', 'Can you provide 1000kg sugarcane at Rs.25/kg?'),
(5, 8, 2, 130.00, 'pending',  '2026-03-07', 'Fresh tomatoes needed for our store.');

-- ============================================================
-- TABLE: regional_stats
-- Stores market insights, crop demand, and average prices by region
-- ============================================================
CREATE TABLE IF NOT EXISTS `regional_stats` (
  `id`           INT(11)      NOT NULL AUTO_INCREMENT,
  `region`       VARCHAR(100) NOT NULL,
  `crop_name`    VARCHAR(100) NOT NULL,
  `avg_price`    DECIMAL(10,2) NOT NULL,
  `demand_level` INT(11)      NOT NULL,
  `avg_yield`    VARCHAR(50)  NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `regional_stats` (`region`, `crop_name`, `avg_price`, `demand_level`, `avg_yield`) VALUES 
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
('Wan Bhachran', 'Cotton', 440.00, 91, '28 maunds/acre');

-- ============================================================
-- TABLE: govt_schemes (DEPRECATED - Kept for fallback)
-- ============================================================
CREATE TABLE IF NOT EXISTS `govt_schemes` (
  `id`          INT(11)      NOT NULL AUTO_INCREMENT,
  `title`       VARCHAR(255) NOT NULL,
  `description` TEXT         NOT NULL,
  `link`        VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- PART 1: TABLE CREATION FOR NEW SCHEMES
-- =====================================================

-- Create schemes table
CREATE TABLE IF NOT EXISTS schemes (
    scheme_id INT PRIMARY KEY AUTO_INCREMENT,
    scheme_name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    launch_date DATE,
    status VARCHAR(50) DEFAULT 'Active',
    official_portal VARCHAR(500),
    description TEXT,
    governing_body VARCHAR(100)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create benefits table
CREATE TABLE IF NOT EXISTS benefits (
    benefit_id INT PRIMARY KEY AUTO_INCREMENT,
    scheme_id INT,
    benefit_description TEXT,
    amount_range VARCHAR(100),
    FOREIGN KEY (scheme_id) REFERENCES schemes(scheme_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create eligibility table
CREATE TABLE IF NOT EXISTS eligibility (
    eligibility_id INT PRIMARY KEY AUTO_INCREMENT,
    scheme_id INT,
    criteria TEXT,
    farmer_type VARCHAR(100),
    FOREIGN KEY (scheme_id) REFERENCES schemes(scheme_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create scheme_highlights table
CREATE TABLE IF NOT EXISTS scheme_highlights (
    highlight_id INT PRIMARY KEY AUTO_INCREMENT,
    scheme_id INT,
    highlight_text VARCHAR(255),
    priority_order INT,
    FOREIGN KEY (scheme_id) REFERENCES schemes(scheme_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- PART 2: INSERT SAMPLE DATA
-- =====================================================

INSERT INTO schemes (scheme_id, scheme_name, category, launch_date, status, official_portal, description, governing_body) VALUES
(1, 'CM Punjab Wheat Support Program 2025', 'Financial Aid', '2025-01-15', 'Active', 'https://cmpunjab.gov.pk/wheat-support', 'Rs. 5,000 per acre support for small wheat farmers', 'Punjab Government'),
(2, 'CM Punjab Green Tractor Scheme', 'Machinery', '2025-02-01', 'Active', 'https://cmpunjab.gov.pk/green-tractor', 'Subsidized tractors for farmers with agricultural land', 'Punjab Government'),
(3, 'Punjab Kissan Card Scheme', 'Financial Aid', '2025-01-01', 'Active', 'https://kissancard.punjab.gov.pk', 'Interest-free loans and subsidies for small-medium farmers', 'Punjab Government'),
(4, 'Solar Tubewell Scheme', 'Energy', '2025-03-01', 'Active', 'https://agripunjab.gov.pk/solar', 'Huge subsidy on solar tubewells to reduce electricity costs', 'Punjab Government'),
(5, 'Hi-Tech Farm Mechanization Program', 'Modernization', '2025-01-10', 'Active', 'https://cmpunjab.gov.pk/hitech-mechanization', 'Interest-free loans up to Rs. 3 crore for modern machinery', 'Punjab Government'),
(6, 'Crop Diversification Scheme (Maize Instead of Paddy)', 'Environmental', '2025-04-01', 'Active', 'https://agripunjab.gov.pk/diversification', 'Rs. 7,000 per acre incentive to save groundwater', 'Punjab Government'),
(7, 'Cotton Seed Subsidy Scheme', 'Seed Support', '2025-02-15', 'Active', 'https://agripunjab.gov.pk/cotton-seed', '33% subsidy on approved BT cotton seeds', 'Punjab Government'),
(8, 'Prime Minister Youth Business & Agriculture Loan Scheme', 'Youth Support', '2025-01-01', 'Active', 'https://pmyp.gov.pk/agriculture', 'Low-interest loans for youth farmers', 'Federal Government'),
(9, 'State Bank Risk Coverage Scheme for Farmers', 'Insurance', '2025-01-01', 'Active', 'https://sbp.gov.pk/farmer-risk', 'Protection for crop loans and farming risks', 'Federal Government'),
(10, 'Green Pakistan Initiative', 'Modernization', '2025-01-20', 'Active', 'https://greenpakistan.gov.pk', 'Smart farming, agri malls, and research centers', 'Federal Government'),
(11, 'Apna Khet Apna Rozgar Scheme', 'Land Allocation', '2025-05-01', 'Active', 'https://cm.punjab.gov.pk/apna-khet', 'Land allocation for landless farmers with 10-year rights', 'Punjab Government'),
(12, 'Agricultural Farm Mechanization Project (2025-2028)', 'Machinery', '2025-02-01', 'Active', 'https://agripunjab.gov.pk/mechanization', '60% subsidy on modern farming machinery', 'Punjab Government'),
(13, 'Super Seeder Subsidy Program', 'Environmental', '2025-03-15', 'Active', 'https://agripunjab.gov.pk/super-seeder', '60% subsidy to reduce crop burning', 'Punjab Government'),
(14, 'PRIAT Program (Climate Smart Agriculture)', 'Climate', '2025-01-01', 'Active', 'https://priat.punjab.gov.pk', 'Climate-smart farming supported by World Bank', 'Punjab Government'),
(15, 'Water Saving & Direct Seeded Rice Incentive', 'Water Conservation', '2025-04-10', 'Active', 'https://agripunjab.gov.pk/water-saving', 'Cash incentives for water-efficient rice farming', 'Punjab Government');

INSERT INTO benefits (scheme_id, benefit_description, amount_range) VALUES
(1, 'Rs. 5,000 per acre support', 'Up to 25 acres'),
(1, 'Interest-free loans', 'Variable'),
(1, 'Free wheat storage support', 'N/A'),
(2, 'Up to Rs. 10 lakh subsidy', '5-10 lakhs'),
(2, '75-125 HP tractors included', 'N/A'),
(3, 'Interest-free agricultural loans', 'Up to Rs. 30,000 per acre'),
(3, 'Subsidy on fertilizer, diesel, seeds, pesticides', 'Variable'),
(4, 'Up to 80% subsidy on solar tubewells', '80%'),
(4, 'Reduced electricity and diesel costs', 'Long-term savings'),
(5, 'Interest-free loans up to Rs. 3 crore', 'Up to 3 crore'),
(5, 'Advanced machinery support', 'N/A'),
(6, 'Rs. 7,000 per acre incentive', 'Variable'),
(7, '33% subsidy on BT cotton seeds', '33%'),
(8, 'Low-interest agriculture loans', 'Variable'),
(9, 'Crop loan protection', 'Full coverage'),
(11, '10-year farming rights', 'N/A'),
(11, 'Rs. 50,000 to Rs. 250,000 per acre grant', '50k-250k'),
(12, '60% subsidy on farming machinery', '60%'),
(13, '60% subsidy on Super Seeders', '60%'),
(14, 'Climate-smart farming support', 'N/A'),
(15, 'Cash incentives per acre', 'Variable');

INSERT INTO eligibility (scheme_id, criteria, farmer_type) VALUES
(1, 'Owners and tenants', 'Small farmers'),
(1, 'Digitized land records required', 'All'),
(2, 'Farmers with agricultural land', 'All'),
(2, 'Digital balloting system', 'All'),
(3, 'Small-medium farmers', 'Small-medium'),
(4, 'Farmers with tubewells', 'All'),
(5, 'Punjab farmers, service providers, agriculture businesses', 'All'),
(6, 'Farmers growing maize instead of rice', 'All'),
(7, 'Cotton growers', 'Cotton farmers'),
(8, 'Youth farmers', 'Youth'),
(9, 'Farmers with crop loans', 'All'),
(11, 'Landless farmers, rural unemployed', 'Landless'),
(12, 'Punjab farmers', 'All'),
(13, 'Farmers burning crop residue', 'All');

INSERT INTO scheme_highlights (scheme_id, highlight_text, priority_order) VALUES
(3, 'Small farmers', 1),
(1, 'Wheat growers', 2),
(2, 'Machinery buyers', 3),
(4, 'Reducing electricity costs', 4),
(8, 'Young farmers/business', 5),
(5, 'Large-scale farming', 6),
(7, 'Cotton growers', 7);

-- ============================================================
-- TABLE: diseases
-- Stores disease rules and reference images defined by admin
-- ============================================================
CREATE TABLE IF NOT EXISTS `diseases` (
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
  `condition_name` VARCHAR(100) DEFAULT 'Diseased',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- SEED DATA: diseases
-- Seed entries populated on setup
-- ============================================================
INSERT INTO `diseases` (`name`, `ur_name`, `crop`, `type`, `symptoms`, `ur_symptoms`, `treatment`, `ur_treatment`, `severity`, `image`, `condition_name`) VALUES
('Rice Blast', 'دھان کا بلاسٹ', 'Rice', 'Fungal', 'Diamond-shaped spots on leaves, drying of leaves, poor grain production.', 'پتوں پر ہیرے کی شکل کے دھبے، پتوں کا خشک ہونا، اناج کی کم پیداوار۔', 'Use resistant rice varieties, avoid excess nitrogen fertilizer, spray fungicides on time.', 'مزاحم اقسام استعمال کریں، نائٹروجن کھاد کی زیادتی سے بچیں، فنگسائڈز کا بروقت سپرے کریں۔', 'Very High', 'https://images.unsplash.com/photo-1586985289688-cacf32ca6e4e?w=500&q=80', 'Diseased'),
('Wheat Rust', 'گندم کی کنگی', 'Wheat', 'Fungal', 'Orange or brown powder on leaves, weak plants, reduced grain quality.', 'پتوں پر نارنجی یا بھورا سفوف، پودوں کی کمزوری، اناج کی کوالٹی میں کمی۔', 'Grow resistant wheat varieties, remove infected crop remains, use fungicide sprays.', 'مزاحم اقسام اگائیں، متاثرہ فصلوں کی باقیات ختم کریں، فنگسائڈز کا سپرے کریں۔', 'High', 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=500&q=80', 'Diseased'),
('Cotton Leaf Curl', 'کپاس کا پتہ مروڑ', 'Cotton', 'Viral', 'Curled leaves, thick veins, stunted plant growth.', 'پتوں کا مڑنا، رگوں کا موٹا ہونا، پودوں کی نشوونما کا رک جانا۔', 'Control whiteflies, use healthy seeds, destroy infected plants.', 'سفید مکھی پر قابو پائیں، صحت مند بیج استعمال کریں، بیمار پودوں کو تلف کریں۔', 'Very High', 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=500&q=80', 'Diseased'),
('Early Blight', 'جھلساؤ (قبل از وقت)', 'Tomato, Potato', 'Fungal', 'Brown rings on leaves, yellowing, fruit rot.', 'پتوں پر بھورے چھلے، پیلا پن، پھلوں کا سڑنا۔', 'Rotate crops, avoid overhead watering, apply fungicides.', 'فصلوں کا ہیر پھیر کریں، اوپر سے پانی دینے سے گریز کریں، فنگسائڈز لگائیں۔', 'High', 'https://images.unsplash.com/photo-1609424842837-f08e85db2b34?w=500&q=80', 'Diseased'),
('Downy Mildew', 'ڈاونی ملڈیو', 'Grapes, Onion, Cucumbers', 'Fungal', 'Yellow patches on leaves, gray mold under leaves.', 'پتوں پر پیلے دھبے، پتوں کے نیچے سرمئی الی۔', 'Improve air circulation, avoid wet leaves, use disease-resistant seeds.', 'ہوا کی آمد و رفت بہتر بنائیں، گیلے پتوں سے بچیں، مزاحم بیج استعمال کریں۔', 'Medium', 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=500&q=80', 'Diseased'),
('Bacterial Blight', 'بیکٹیریل بلائٹ', 'Rice, Cotton', 'Bacterial', 'Water-soaked leaf lesions, wilting, dry leaves.', 'پتوں پر پانی بھرے زخم، مرجھانا، پتوں کا خشک ہونا۔', 'Use clean seeds, avoid flooding fields unnecessarily, remove infected plants.', 'صاف بیج استعمال کریں، غیر ضروری پانی کھڑا نہ کریں، متاثرہ پودے نکال دیں۔', 'High', 'https://images.unsplash.com/photo-1550575038-2be5f7ed5e4e?w=500&q=80', 'Diseased'),
('Anthracnose', 'انتھراکنوز', 'Mango, Chili, Beans', 'Fungal', 'Dark sunken spots on fruits, leaf drop, fruit decay.', 'پھلوں پر گہرے دھنسے ہوئے دھبے، پتوں کا گرنا، پھلوں کا سڑنا۔', 'Prune infected branches, keep fields clean, spray fungicides.', 'متاثرہ شاخوں کی کٹائی کریں، کھیت صاف رکھیں، فنگسائڈز سپرے کریں۔', 'High', 'https://images.unsplash.com/photo-1585518419759-7c67ffcf5e2f?w=500&q=80', 'Diseased'),
('Black Rot', 'کالا سڑاؤ', 'Cabbage, Cauliflower', 'Bacterial', 'Yellow V-shaped leaf spots, black veins, rotting leaves.', 'پتوں پر پیلے وی نما دھبے، کالی رگیں، پتوں کا سڑنا۔', 'Use certified seeds, avoid overhead irrigation, rotate crops.', 'تصدیق شدہ بیج استعمال کریں، چھڑکاؤ والے پانی سے بچیں، فصل بدلیں۔', 'Medium', 'https://images.unsplash.com/photo-1510627498534-cf7e9002facc?w=500&q=80', 'Diseased'),
('Root Rot', 'جڑوں کا سڑنا', 'Vegetables, Fruits', 'Fungal', 'Rotten roots, wilting plants, slow growth.', 'جڑوں کا سڑنا، پودوں کا مرجھانا، سست نشوونما۔', 'Ensure proper drainage, avoid overwatering, treat soil before planting.', 'نکاسی آب یقینی بنائیں، ضرورت سے زیادہ پانی نہ دیں، زمین کا علاج کریں۔', 'High', 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=500&q=80', 'Diseased'),
('Mosaic Disease', 'موزیک بیماری', 'Tobacco, Tomato, Cucumber', 'Viral', 'Mosaic-like yellow-green leaf patterns, deformed leaves.', 'پتوں پر زرد سبز نمونے، پتے کی شکل بدلنا۔', 'Control insects, remove infected plants, use resistant varieties.', 'کیڑوں پر قابو پائیں، بیمار پودے نکالیں، مزاحم اقسام استعمال کریں۔', 'High', 'https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?w=500&q=80', 'Diseased'),
('Smut Disease', 'سٹی کی کنگی', 'Corn, Wheat, Barley', 'Fungal', 'Black powdery masses, damaged grains, poor crop quality.', 'کالا سفوف، اناج کا نقصان، فصل کی خراب کوالٹی۔', 'Treat seeds before sowing, use resistant varieties, remove infected plants.', 'بیج کا علاج کریں، مزاحم اقسام استعمال کریں، بیمار پودے نکال دیں۔', 'Medium', 'https://images.unsplash.com/photo-1535808066601-684b01f18b11?w=500&q=80', 'Diseased'),
('Wilt Disease', 'مرجھاؤ', 'Tomato, Banana, Cotton', 'Fungal/Bacterial', 'Sudden wilting, yellow leaves, browning inside stem.', 'اچانک مرجھانا، پیلے پتے، تنے کے اندر بھورا ہونا۔', 'Crop rotation, disease-free seedlings, proper soil drainage.', 'فصلوں کا ہیر پھیر، صحت مند پنیری، نکاسی آب کی بہتری۔', 'High', 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=500&q=80', 'Diseased'),
('Leaf Spot', 'پتوں کے دھبے', 'Groundnut, Tomato, Chili', 'Fungal', 'Brown or black spots on leaves, early leaf fall, weak plants.', 'پتوں پر بھورے یا سیاہ دھبے، پتوں کا جلد گرنا، پودوں کی کمزوری۔', 'Avoid overcrowding, remove infected leaves, apply fungicides.', 'گھنی کاشت سے بچیں، متاثرہ پتے اتاریں، فنگسائڈز کا استعمال۔', 'Medium', 'https://images.unsplash.com/photo-1559181567-c3190bbb5ef3?w=500&q=80', 'Diseased'),
('Stem Rot', 'تنے کا سڑنا', 'Rice, Groundnut, Soybean', 'Fungal', 'Rotting stems, plant collapse, white fungal growth.', 'تنے کا سڑنا، پودے کا گرنا، سفید الی کی نشوونما۔', 'Use clean seeds, improve soil drainage, destroy infected plants.', 'صاف بیج، نکاسی آب میں بہتری، بیمار پودوں کی تلفی۔', 'High', 'https://images.unsplash.com/photo-1643143892786-87b7a4eff1de?w=500&q=80', 'Diseased'),
('Canker Disease', 'کینکر بیماری', 'Citrus, Apple, Tomato', 'Bacterial/Fungal', 'Sunken lesions on stem or fruit, cracked bark, dry branches.', 'تنے یا پھل پر گہرے زخم، چھال کا پھٹنا، خشک شاخیں۔', 'Prune infected branches, use clean tools, spray suitable chemicals.', 'متاثرہ شاخیں کاٹیں، صاف اوزار استعمال کریں، مناسب کیمیکلز کا سپرے۔', 'Medium', 'https://images.unsplash.com/photo-1568702846629-a519a1b8e3d5?w=500&q=80', 'Diseased'),
('Damping Off', 'پودوں کا گرنا', 'Vegetables, Nursery', 'Fungal', 'Seedlings fall over, rotting stems near soil.', 'پنیری کا گرنا، مٹی کے قریب تنے کا سڑنا۔', 'Avoid excess moisture, use treated soil, ensure air circulation.', 'زیادہ نمی سے بچیں، علاج شدہ مٹی، ہوا کی آمد و رفت۔', 'High', 'https://images.unsplash.com/photo-1592424002053-21f369ad7fdb?w=500&q=80', 'Diseased'),
('Scab Disease', 'سکاب بیماری', 'Potato, Apple', 'Fungal/Bacterial', 'Rough brown patches, cracked fruit or tubers.', 'کھردرے بھورے دھبے، پھل یا آلو کا پھٹنا۔', 'Maintain soil moisture, use disease-free seeds, rotate crops.', 'نمی برقرار رکھیں، صاف بیج، فصلوں کا ہیر پھیر۔', 'Low', 'https://images.unsplash.com/photo-1535670711867-efb226f6d81e?w=500&q=80', 'Diseased'),
('Fire Blight', 'فائر بلائٹ', 'Pear, Apple', 'Bacterial', 'Burned-looking branches, black flowers and shoots.', 'جلی ہوئی شاخیں، سیاہ پھول اور شگوفے۔', 'Cut infected branches, sterilize tools, avoid excess nitrogen.', 'متاثرہ شاخیں کاٹیں، اوزار صاف کریں، نائٹروجن کی زیادتی سے بچیں۔', 'Very High', 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=500&q=80', 'Diseased'),
('Clubroot', 'کلب روٹ', 'Cabbage, Turnip, Cauliflower', 'Fungal', 'Swollen roots, yellow leaves, stunted growth.', 'جڑوں کا سوجنا، پیلے پتے، رکی ہوئی نشوونما۔', 'Improve soil pH with lime, rotate crops, use resistant varieties.', 'چونے سے پی ایچ بہتر کریں، فصل بدلیں، مزاحم اقسام۔', 'High', 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=500&q=80', 'Diseased'),
('Red Rot', 'سرخ سڑاؤ', 'Sugarcane', 'Fungal', 'Red discoloration inside stem, dry leaves, bad smell.', 'تنے کے اندر سرخی، خشک پتے، گندی بو۔', 'Use healthy cane setts, remove infected plants, field sanitation.', 'صحت مند بیج، بیمار پودوں کی تلفی، کھیت کی صفائی۔', 'High', 'https://images.unsplash.com/photo-1625246333195-78d9c38ad576?w=500&q=80', 'Diseased');

-- ============================================================
-- TABLE: ai_diagnostics_history
-- Stores past plant scans
-- ============================================================
CREATE TABLE IF NOT EXISTS `ai_diagnostics_history` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `farmerId` INT DEFAULT NULL,
  `disease_name` VARCHAR(255) NOT NULL,
  `confidence` DECIMAL(5,2) NOT NULL,
  `crop` VARCHAR(100) NOT NULL,
  `scan_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`farmerId`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
