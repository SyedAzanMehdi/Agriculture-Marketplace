-- ============================================================
-- AgriConnect Intelligence Module – Historical Data Schema
-- ============================================================

-- 1. Table for Crop Advisor (Farming History)
CREATE TABLE IF NOT EXISTS `farming_history` (
  `id`                 INT(11)      NOT NULL AUTO_INCREMENT,
  `crop_name`          VARCHAR(100) NOT NULL,
  `soil_type`          VARCHAR(50)  NOT NULL,
  `season`             VARCHAR(50)  NOT NULL,
  `water_availability` VARCHAR(50)  NOT NULL,
  `previous_crop`      VARCHAR(100),
  `yield_per_acre`     INT(11)      NOT NULL,
  `profit_margin`      DECIMAL(5,2) NOT NULL, -- Percentage
  `risk_level`         ENUM('Low', 'Medium', 'High') NOT NULL,
  `planting_tips`      TEXT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Table for Price Predictor (Price History)
CREATE TABLE IF NOT EXISTS `price_history` (
  `id`          INT(11)      NOT NULL AUTO_INCREMENT,
  `crop_name`   VARCHAR(100) NOT NULL,
  `price`       DECIMAL(10,2) NOT NULL,
  `recorded_at` DATE         NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- SEED DATA: Farming History (for Recommendations)
-- ============================================================
INSERT INTO `farming_history` (`crop_name`, `soil_type`, `season`, `water_availability`, `previous_crop`, `yield_per_acre`, `profit_margin`, `risk_level`, `planting_tips`) VALUES
('Wheat',    'Loamy',  'Winter', 'Moderate', 'Cotton',  45, 25.5, 'Low',    'Ensure early sowing for maximum yield. Use DAP fertilizer at time of sowing.'),
('Rice',     'Clayey', 'Summer', 'High',     'Wheat',   60, 35.0, 'Medium', 'Maintain 2-3 inches of standing water in the field for first 40 days.'),
('Sugarcane','Loamy',  'Summer', 'High',     'Rice',    800, 40.0, 'Low',    'Use healthy setts for planting. Ensure proper deep ploughing.'),
('Cotton',   'Sandy',  'Summer', 'Moderate', 'Wheat',   25, 15.0, 'High',   'Watch out for pink bollworm. Use pheromone traps.'),
('Maize',    'Silty',  'Spring', 'Moderate', 'Potato',  70, 20.0, 'Low',    'Apply Nitrogen in three splits for optimal growth.'),
('Mango',    'Loamy',  'Summer', 'Moderate', 'None',    150, 50.0, 'Low',    'Prune dead branches after harvest. Apply organic mulch.'),
('Tomato',   'Sandy',  'Spring', 'High',     'Onion',   200, 30.0, 'Medium', 'Use trellis for support. Ensure consistent irrigation to avoid blossom end rot.'),
('Potato',   'Loamy',  'Winter', 'Moderate', 'Maize',   250, 22.0, 'Low',    'Use certified disease-free seeds. Hilling is essential.'),
('Onion',    'Silty',  'Winter', 'Low',      'Cotton',  150, 18.0, 'Medium', 'Avoid waterlogging at the bulb development stage.'),
('Chickpea', 'Sandy',  'Winter', 'Low',      'Maize',   15, 12.0, 'Low',    'Deep sowing is recommended. Needs very little water.');

-- ============================================================
-- SEED DATA: Price History (for Predictions)
-- Last 4 weeks of data for some crops
-- ============================================================
INSERT INTO `price_history` (`crop_name`, `price`, `recorded_at`) VALUES
-- Wheat Trend: Steady Up
('Wheat', 90.00, '2026-04-10'),
('Wheat', 91.50, '2026-04-17'),
('Wheat', 93.00, '2026-04-24'),
('Wheat', 95.00, '2026-05-01'),
-- Rice Trend: Slight Down then Up
('Rice', 215.00, '2026-04-10'),
('Rice', 210.00, '2026-04-17'),
('Rice', 212.00, '2026-04-24'),
('Rice', 220.00, '2026-05-01'),
-- Tomato Trend: Volatile Up
('Tomato', 100.00, '2026-04-10'),
('Tomato', 115.00, '2026-04-17'),
('Tomato', 130.00, '2026-04-24'),
('Tomato', 140.00, '2026-05-01'),
-- Potato Trend: Down
('Potato', 75.00, '2026-04-10'),
('Potato', 72.00, '2026-04-17'),
('Potato', 68.00, '2026-04-24'),
('Potato', 60.00, '2026-05-01'),
-- Sugarcane Trend: Very Steady
('Sugarcane', 28.00, '2026-04-10'),
('Sugarcane', 28.50, '2026-04-17'),
('Sugarcane', 29.00, '2026-04-24'),
('Sugarcane', 30.00, '2026-05-01');
