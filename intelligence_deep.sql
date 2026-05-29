-- ============================================================
-- AgriConnect Intelligence Module – Deep Implementation Data
-- ============================================================

-- 1. Enhancing farming_history with more data points
ALTER TABLE `farming_history` 
ADD COLUMN `soil_ph` DECIMAL(3,1) DEFAULT 6.5,
ADD COLUMN `growth_duration_days` INT(11) DEFAULT 120,
ADD COLUMN `market_demand` ENUM('Very Low', 'Low', 'Moderate', 'High', 'Very High') DEFAULT 'Moderate';

-- 2. Update existing records with realistic pH and duration
UPDATE `farming_history` SET `soil_ph` = 7.0, `growth_duration_days` = 150, `market_demand` = 'High' WHERE `crop_name` = 'Wheat';
UPDATE `farming_history` SET `soil_ph` = 6.2, `growth_duration_days` = 120, `market_demand` = 'Very High' WHERE `crop_name` = 'Rice';
UPDATE `farming_history` SET `soil_ph` = 6.8, `growth_duration_days` = 300, `market_demand` = 'Moderate' WHERE `crop_name` = 'Sugarcane';
UPDATE `farming_history` SET `soil_ph` = 5.8, `growth_duration_days` = 160, `market_demand` = 'High' WHERE `crop_name` = 'Cotton';
UPDATE `farming_history` SET `soil_ph` = 6.5, `growth_duration_days` = 110, `market_demand` = 'Moderate' WHERE `crop_name` = 'Maize';
UPDATE `farming_history` SET `soil_ph` = 7.2, `growth_duration_days` = 90, `market_demand` = 'High' WHERE `crop_name` = 'Tomato';

-- 3. Add more diverse Buyer analytics (Simulated via more offers)
-- We need to ensure we have enough history to make "Best Buyers" interesting
INSERT INTO `offers` (`marketplaceId`, `buyerId`, `offeredPrice`, `status`, `date`, `message`) VALUES
(1, 2, 92.00, 'accepted', '2026-03-10', 'Bulk purchase for retail chain.'),
(2, 2, 215.00, 'accepted', '2026-03-12', 'Urgent need for basmati.'),
(6, 2, 175.00, 'accepted', '2026-03-15', 'Export order.'),
(1, 2, 88.00, 'rejected', '2026-03-05', 'Negotiation test.');

-- Add a new buyer for variety
INSERT INTO `users` (`name`, `email`, `password`, `role`, `phone`, `location`) VALUES
('Hassan Superstore', 'hassan@buyer.pk', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'buyer', '0300-1112223', 'Mianwali');

-- New buyer offers
INSERT INTO `offers` (`marketplaceId`, `buyerId`, `offeredPrice`, `status`, `date`, `message`) VALUES
(1, 5, 96.00, 'pending', '2026-05-09', 'I want the best quality wheat from Mianwali.'),
(8, 5, 145.00, 'accepted', '2026-04-20', 'Fresh tomatoes for my store.');
