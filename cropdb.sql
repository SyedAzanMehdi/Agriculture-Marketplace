-- Design for separate tables (databases) of Crop Details, Add Crop, and Marketplace

-- 1. Crop Details Table
-- Stores static information about different types of crops.
CREATE TABLE `crop_details` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `category` varchar(100) NOT NULL,
  `description` text,
  PRIMARY KEY (`id`)
);

-- 2. Add Crop (Inventory) Table
-- Stores physical inventory added by farmers.
CREATE TABLE `added_crops` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `farmerId` int(11) NOT NULL,
  `cropDetailId` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `unit` varchar(20) NOT NULL,
  `harvestDate` date,
  `addedDate` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`farmerId`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`cropDetailId`) REFERENCES `crop_details`(`id`) ON DELETE CASCADE
);

-- 3. Marketplace Table
-- Stores active listings for marketplace buyers to negotiate on.
CREATE TABLE `marketplace` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `addedCropId` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `location` varchar(255) NOT NULL,
  `status` enum('available','sold','archived') DEFAULT 'available',
  `listedDate` date NOT NULL,
  `clicks` int(11) DEFAULT 0,
  `farmer_name` varchar(255) DEFAULT NULL,
  `farmer_city` varchar(255) DEFAULT NULL,
  `farmer_phone` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`addedCropId`) REFERENCES `added_crops`(`id`) ON DELETE CASCADE
);

-- 4. Offers Table (Updated to reference the marketplace listing instead of crops directly)
CREATE TABLE `offers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `marketplaceId` int(11) NOT NULL,
  `buyerId` int(11) NOT NULL,
  `offeredPrice` decimal(10,2) NOT NULL,
  `status` enum('pending','accepted','rejected') DEFAULT 'pending',
  `date` date NOT NULL,
  `message` text,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`marketplaceId`) REFERENCES `marketplace`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`buyerId`) REFERENCES `users`(`id`) ON DELETE CASCADE
);
