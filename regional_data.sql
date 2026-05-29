-- ============================================================
-- AgriConnect – Detailed Regional Analysis Data
-- ============================================================

-- Clean existing data to avoid duplicates
TRUNCATE TABLE `regional_stats`;

INSERT INTO `regional_stats` (`region`, `crop_name`, `avg_yield`, `avg_price`, `demand_level`) VALUES
-- Mianwali Central
('Mianwali', 'Wheat', 42.5, 3950.0, 85),
('Mianwali', 'Gram', 15.2, 12500.0, 70),
('Mianwali', 'Cotton', 22.0, 8500.0, 60),

-- Piplan
('Piplan', 'Sugarcane', 820.0, 450.0, 90),
('Piplan', 'Wheat', 44.0, 4000.0, 88),
('Piplan', 'Mustard', 18.0, 9500.0, 75),

-- Isakhel
('Isakhel', 'Wheat', 38.0, 3900.0, 80),
('Isakhel', 'Chickpea', 12.0, 11000.0, 65),
('Isakhel', 'Groundnut', 25.0, 15000.0, 85),

-- Other major regions for context
('Islamabad', 'Tomato', 210.0, 120.0, 90),
('Islamabad', 'Potato', 180.0, 80.0, 80),
('Lahore', 'Rice (Basmati)', 55.0, 9500.0, 95),
('Lahore', 'Wheat', 40.0, 4100.0, 88),
('Multan', 'Mango', 180.0, 6500.0, 98),
('Multan', 'Cotton', 28.0, 8800.0, 75),
('Sargodha', 'Citrus (Kinnow)', 250.0, 2500.0, 92),
('Sargodha', 'Sugarcane', 850.0, 455.0, 85);
