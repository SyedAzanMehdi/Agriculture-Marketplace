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
);

-- Create benefits table
CREATE TABLE IF NOT EXISTS benefits (
    benefit_id INT PRIMARY KEY AUTO_INCREMENT,
    scheme_id INT,
    benefit_description TEXT,
    amount_range VARCHAR(100),
    FOREIGN KEY (scheme_id) REFERENCES schemes(scheme_id)
);

-- Create eligibility table
CREATE TABLE IF NOT EXISTS eligibility (
    eligibility_id INT PRIMARY KEY AUTO_INCREMENT,
    scheme_id INT,
    criteria TEXT,
    farmer_type VARCHAR(100),
    FOREIGN KEY (scheme_id) REFERENCES schemes(scheme_id)
);

-- Create scheme_highlights table
CREATE TABLE IF NOT EXISTS scheme_highlights (
    highlight_id INT PRIMARY KEY AUTO_INCREMENT,
    scheme_id INT,
    highlight_text VARCHAR(255),
    priority_order INT,
    FOREIGN KEY (scheme_id) REFERENCES schemes(scheme_id)
);

-- Insert schemes
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

-- Insert benefits
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

-- Insert eligibility criteria
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

-- Insert highlights (Most Useful Schemes)
INSERT INTO scheme_highlights (scheme_id, highlight_text, priority_order) VALUES
(3, 'Small farmers', 1),
(1, 'Wheat growers', 2),
(2, 'Machinery buyers', 3),
(4, 'Reducing electricity costs', 4),
(8, 'Young farmers/business', 5),
(5, 'Large-scale farming', 6),
(7, 'Cotton growers', 7);
