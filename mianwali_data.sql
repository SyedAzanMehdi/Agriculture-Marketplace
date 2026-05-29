-- ============================================================
-- AgriConnect – Mianwali-Specific Regional Data
-- ============================================================

TRUNCATE TABLE `regional_stats`;

INSERT INTO `regional_stats` (`region`, `crop_name`, `avg_yield`, `avg_price`, `demand_level`) VALUES
-- Mianwali Tehsil
('Mianwali Tehsil', 'Wheat', 42.0, 4000.0, 90),
('Mianwali Tehsil', 'Cotton', 20.0, 8500.0, 65),
('Mianwali Tehsil', 'Gram', 15.0, 12000.0, 75),

-- Isa Khel Tehsil
('Isa Khel Tehsil', 'Wheat', 38.5, 3950.0, 85),
('Isa Khel Tehsil', 'Chickpea', 12.5, 11500.0, 70),
('Isa Khel Tehsil', 'Groundnut', 22.0, 14500.0, 88),

-- Piplan Tehsil
('Piplan Tehsil', 'Sugarcane', 850.0, 455.0, 95),
('Piplan Tehsil', 'Wheat', 45.0, 4050.0, 92),
('Piplan Tehsil', 'Mustard', 18.5, 9800.0, 80),

-- Kalabagh
('Kalabagh', 'Wheat', 35.0, 4000.0, 75),
('Kalabagh', 'Citrus', 180.0, 2200.0, 60),

-- Makerwal
('Makerwal', 'Wheat', 32.0, 3900.0, 70),
('Makerwal', 'Chickpea', 14.0, 11000.0, 65),

-- Daud Khel
('Daud Khel', 'Wheat', 40.0, 3950.0, 82),
('Daud Khel', 'Cotton', 21.0, 8600.0, 70),

-- Namal Valley
('Namal Valley', 'Wheat', 30.0, 4100.0, 85),
('Namal Valley', 'Olives', 15.0, 25000.0, 95);
