-- Insert sample profiles for different stakeholders
INSERT INTO public.profiles (user_id, full_name, email, role, organization, location, phone) VALUES
('11111111-1111-1111-1111-111111111111', 'John Farmer', 'john@greenfarm.com', 'farmer', 'Green Valley Farm', 'Punjab, India', '+91-9876543210'),
('22222222-2222-2222-2222-222222222222', 'Maria Distributor', 'maria@fastlogistics.com', 'distributor', 'Fast Logistics Ltd', 'Delhi, India', '+91-9876543211'),
('33333333-3333-3333-3333-333333333333', 'Bob Retailer', 'bob@freshmarket.com', 'retailer', 'Fresh Market Chain', 'Mumbai, India', '+91-9876543212'),
('44444444-4444-4444-4444-444444444444', 'Sarah Consumer', 'sarah@email.com', 'consumer', NULL, 'Mumbai, India', '+91-9876543213');

-- Insert sample products
INSERT INTO public.products (
  id, farmer_id, product_name, batch_id, qr_code, quantity, unit, 
  harvest_date, farm_location, quality_grade, variety, status,
  blockchain_hash, certifications
) VALUES
(
  '10000000-0000-0000-0000-000000000001',
  '11111111-1111-1111-1111-111111111111',
  'Organic Basmati Rice',
  'RICE-2024-001',
  'QR-RICE-2024-001',
  1000,
  'kg',
  '2024-09-01',
  'Green Valley Farm, Punjab',
  'Premium A+',
  'Basmati 1121',
  'at_retailer',
  '0xa1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456',
  '["Organic Certified", "Fair Trade", "Non-GMO"]'::jsonb
),
(
  '10000000-0000-0000-0000-000000000002',
  '11111111-1111-1111-1111-111111111111',
  'Fresh Mangoes',
  'MANGO-2024-002',
  'QR-MANGO-2024-002',
  500,
  'kg',
  '2024-09-10',
  'Green Valley Farm, Punjab',
  'Grade A',
  'Alphonso',
  'in_transit',
  '0xb2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123457',
  '["Pesticide Free", "Fresh Harvest"]'::jsonb
),
(
  '10000000-0000-0000-0000-000000000003',
  '11111111-1111-1111-1111-111111111111',
  'Organic Wheat',
  'WHEAT-2024-003',
  'QR-WHEAT-2024-003',
  2000,
  'kg',
  '2024-08-25',
  'Green Valley Farm, Punjab',
  'Premium',
  'Durum Wheat',
  'harvested',
  '0xc3d4e5f6789012345678901234567890abcdef1234567890abcdef123458',
  '["Organic Certified"]'::jsonb
);

-- Insert sample supply chain transactions
INSERT INTO public.supply_chain_transactions (
  product_id, transaction_type, from_stakeholder_id, to_stakeholder_id,
  location, temperature, humidity, quality_notes, verified, blockchain_hash,
  storage_conditions
) VALUES
-- Rice journey
(
  '10000000-0000-0000-0000-000000000001',
  'harvest',
  NULL,
  '11111111-1111-1111-1111-111111111111',
  'Green Valley Farm, Punjab',
  25.5,
  65.0,
  'Freshly harvested premium basmati rice. Excellent grain quality.',
  true,
  '0xa1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456',
  'Proper ventilation, dry storage'
),
(
  '10000000-0000-0000-0000-000000000001',
  'transport',
  '11111111-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222222',
  'Delhi Distribution Center',
  24.0,
  60.0,
  'Transported in climate-controlled vehicle. No damage observed.',
  true,
  '0xa1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123457',
  'Temperature controlled transport'
),
(
  '10000000-0000-0000-0000-000000000001',
  'transfer',
  '22222222-2222-2222-2222-222222222222',
  '33333333-3333-3333-3333-333333333333',
  'Fresh Market Chain, Mumbai',
  23.0,
  55.0,
  'Quality inspection passed. Ready for retail sale.',
  true,
  '0xa1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123458',
  'Retail storage conditions'
),

-- Mango journey
(
  '10000000-0000-0000-0000-000000000002',
  'harvest',
  NULL,
  '11111111-1111-1111-1111-111111111111',
  'Green Valley Farm, Punjab',
  28.0,
  70.0,
  'Fresh Alphonso mangoes harvested at perfect ripeness.',
  true,
  '0xb2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456',
  'Cool, ventilated storage'
),
(
  '10000000-0000-0000-0000-000000000002',
  'transport',
  '11111111-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222222',
  'Highway to Delhi',
  18.0,
  65.0,
  'Currently in refrigerated transport to maintain freshness.',
  true,
  '0xb2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123457',
  'Refrigerated transport at 18°C'
),

-- Wheat journey
(
  '10000000-0000-0000-0000-000000000003',
  'harvest',
  NULL,
  '11111111-1111-1111-1111-111111111111',
  'Green Valley Farm, Punjab',
  26.0,
  45.0,
  'High quality organic durum wheat. Excellent protein content.',
  true,
  '0xc3d4e5f6789012345678901234567890abcdef1234567890abcdef123458',
  'Dry storage in silos'
);