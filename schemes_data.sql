-- ============================================================
-- AgriConnect – Government Schemes Data Schema
-- ============================================================

CREATE TABLE IF NOT EXISTS `govt_schemes` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT NOT NULL,
  `benefits` TEXT,
  `eligibility` TEXT,
  `link` VARCHAR(255),
  `category` VARCHAR(100),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `govt_schemes` (`title`, `description`, `benefits`, `eligibility`, `link`, `category`) VALUES
('CM Punjab Green Tractor Scheme', 'Punjab government is giving heavy subsidy on tractors for farmers.', 'Subsidy up to Rs. 5 lakh to Rs. 10 lakh; 50–85 HP tractors included; Thousands of tractors through digital balloting', 'Farmers with agricultural land in Punjab can apply', 'https://agripunjab.gov.pk/', 'Machinery'),
('Punjab Kisan Card', 'A very important scheme for small farmers providing interest-free agricultural loans and subsidies.', 'Interest-free agricultural loans; Subsidy on seeds, fertilizer, diesel, and pesticides; Direct digital payments', 'Small farmers with up to 25 acres land', 'https://pitb.gov.pk/', 'Finance'),
('Punjab Solar Tubewell Scheme', 'Farmers can convert tubewells to solar systems with huge subsidy.', 'Up to 80% subsidy; Reduced diesel/electricity cost; 10HP, 15HP, and 20HP systems available', 'Registered farmers in Punjab', 'https://agripunjab.gov.pk/', 'Energy'),
('Apna Khet Apna Rozgar Scheme', 'Special scheme for landless farmers and rural unemployed youth providing land on lease.', 'Agricultural land on lease; Financial support; Farming opportunities', 'Landless farmers; Rural unemployed youth', '', 'Livelihood'),
('Punjab Hi-Tech Farm Mechanization Financing', 'For modern farming machinery providing interest-free loans up to PKR 30 million.', 'Interest-free loans up to PKR 30 million; Support for modern agricultural equipment', 'Punjab farmers; Agriculture businesses', 'https://agripunjab.gov.pk/', 'Machinery'),
('Punjab Diesel Subsidy Scheme', 'Latest relief for wheat farmers providing Rs. 150 subsidy per litre.', 'Rs. 150 subsidy per litre; Up to Rs. 37,500 support', 'Farmers owning up to 25 acres', '', 'Relief'),
('Prime Minister Youth Business and Agriculture Loan', 'Federal loan scheme for youth and farmers across Pakistan.', 'Low-interest or interest-free loans; Agriculture business support; Livestock and dairy financing', 'Youth and farmers across Pakistan', 'https://pmyp.gov.pk/', 'Finance'),
('CM Punjab Wheat Support Program 2025', 'Major wheat relief package for small farmers.', 'Rs. 5,000 per acre support; Financial aid through Kissan Card; Free wheat storage support', 'Small farmers; Owners and tenants', 'https://agripunjab.gov.pk/', 'Relief'),
('Crop Diversification Scheme (Maize Instead of Paddy)', 'New Punjab initiative to save groundwater by encouraging maize cultivation.', 'Rs. 7,000 per acre incentive; Government cash subsidy; Better water conservation', 'Farmers shifting from rice to maize', '', 'Incentive'),
('Cotton Seed Subsidy Scheme', 'Punjab government continues subsidy on cotton seeds to increase production.', '33% subsidy on approved BT cotton seeds; Direct payment into bank accounts', 'Cotton farmers in Punjab', '', 'Seeds'),
('State Bank Risk Coverage Scheme', 'Protection for crop loans and support for dairy, livestock, and fisheries.', 'Protection for crop loans; Financial risk coverage for banks and farmers', 'Farmers with active agricultural loans', 'https://sbp.org.pk/', 'Insurance'),
('Green Pakistan Initiative', 'A national agriculture modernization project featuring smart farming and agri malls.', 'Smart farming; Agri malls; Modern irrigation; Drone farming support', 'Open to all modernizing farmers', '', 'Modernization'),
('Agricultural Farm Mechanization Project (2025–2028)', 'Modern machinery subsidy project providing 60% subsidy.', '60% subsidy on laser levelers, seeders, ploughs, and modern implements', 'Small and large scale farmers', 'https://agripunjab.gov.pk/', 'Machinery'),
('Super Seeder Subsidy Program', 'To reduce crop burning and improve wheat sowing.', '60% subsidy on Super Seeders; Better soil fertility; Saves fuel and labor', 'Wheat farmers in smog-affected areas', '', 'Environment'),
('Kissan Centres Program', 'Establishment of 100+ modern Kissan Centers for farmer guidance.', 'Farmer guidance; Soil testing; Fertilizer information; Pest control help', 'All Punjab farmers', '', 'Service'),
('Agriculture Internship Program', '2,000 agriculture graduates hired to guide farmers directly.', 'Field-level farmer assistance; Modern farming awareness; Wheat productivity focus', 'Farmers needing expert guidance', '', 'Education'),
('Wheat Policy 2026', 'New wheat policy for farmer protection and price stability.', 'Benchmark rate around Rs. 3,500 per maund; Strategic wheat storage', 'Wheat growers', '', 'Policy'),
('PRIAT Program (Climate Smart Agriculture)', 'Punjab Resilient and Inclusive Agriculture Transformation project.', 'Climate-smart farming; Flood protection; Water-saving irrigation', 'Small farmers; Women farmer participation', '', 'Climate'),
('Water Saving & Direct Seeded Rice Incentive', 'Cash incentives for water-saving rice farming techniques.', 'Cash incentives per acre; Reduced water usage; Lower labor costs', 'Rice farmers using DSR method', '', 'Incentive'),
('Model Agriculture Malls', 'One-window farmer services for seeds, fertilizer, and machinery.', 'One-window farmer services; Banking support; Quality inputs', 'All farmers', '', 'Service'),
('Integrated Farming Promotion', 'Promoting crops, dairy, and poultry together for multiple income streams.', 'Multiple income streams; Less risk; Lower farming costs', 'Small and medium farmers', '', 'Diversification'),
('Laser Land Levelling Support', 'Promoting laser leveling for efficient irrigation and better growth.', 'Saves water; Better crop growth; Reduced fertilizer waste', 'Farmers in irrigated areas', '', 'Water'),
('Bulldozer / Water Channel Improvement', 'Improving farm water systems and lined water channels.', 'Lined water channels; Watercourse improvement; Land preparation support', 'Farmers in gravity-flow areas', '', 'Water');
