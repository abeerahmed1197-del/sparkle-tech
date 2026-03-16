
-- Seed sample products with images across multiple categories and brands

-- MOBILES
INSERT INTO products (name, slug, description, short_description, price, discount_price, stock, sku, category_id, brand_id, is_featured, is_new, is_best_seller, rating, review_count, specifications) VALUES
('iPhone 15 Pro Max', 'iphone-15-pro-max', 'The most powerful iPhone ever with A17 Pro chip, titanium design, and 48MP camera system.', 'A17 Pro chip, 48MP camera, titanium design', 1199, 1099, 25, 'APL-IP15PM', '6e832d18-6f75-4bbe-b2a4-872798a577de', 'ca312174-6ce9-4db6-8ce8-0c83b8a27256', true, true, true, 4.8, 124, '{"Display": "6.7\" Super Retina XDR", "Chip": "A17 Pro", "Camera": "48MP + 12MP + 12MP", "Battery": "4422 mAh", "Storage": "256GB"}'),
('Samsung Galaxy S24 Ultra', 'samsung-galaxy-s24-ultra', 'Galaxy AI powered flagship with S Pen, 200MP camera, and titanium frame.', 'Galaxy AI, 200MP camera, S Pen included', 1299, 1199, 18, 'SAM-S24U', '6e832d18-6f75-4bbe-b2a4-872798a577de', 'a8524120-b7df-43be-9482-19863b91103b', true, true, true, 4.7, 98, '{"Display": "6.8\" Dynamic AMOLED 2X", "Chip": "Snapdragon 8 Gen 3", "Camera": "200MP + 12MP + 50MP + 10MP", "Battery": "5000 mAh", "Storage": "256GB"}'),
('Nothing Phone (2)', 'nothing-phone-2', 'Unique Glyph Interface with powerful Snapdragon 8+ Gen 1 and clean Nothing OS.', 'Glyph Interface, clean design, powerful chip', 599, 549, 30, 'NTH-PH2', '6e832d18-6f75-4bbe-b2a4-872798a577de', 'caf334b9-a8bd-4524-afd3-9952cc6d2183', true, true, false, 4.5, 67, '{"Display": "6.7\" OLED 120Hz", "Chip": "Snapdragon 8+ Gen 1", "Camera": "50MP + 50MP", "Battery": "4700 mAh", "Storage": "128GB"}'),
('Xiaomi 14 Ultra', 'xiaomi-14-ultra', 'Leica optics with variable aperture, flagship Snapdragon 8 Gen 3.', 'Leica camera, variable aperture, flagship chip', 899, NULL, 15, 'XIA-14U', '6e832d18-6f75-4bbe-b2a4-872798a577de', 'c4c01313-80e7-4b7b-a600-917729887bf6', true, false, false, 4.6, 45, '{"Display": "6.73\" AMOLED 120Hz", "Chip": "Snapdragon 8 Gen 3", "Camera": "50MP Leica Quad", "Battery": "5000 mAh", "Storage": "256GB"}'),
('Realme GT 5 Pro', 'realme-gt5-pro', 'Performance beast with Snapdragon 8 Gen 3 at an incredible price.', 'Flagship killer, 144Hz display, fast charging', 449, 399, 40, 'RLM-GT5P', '6e832d18-6f75-4bbe-b2a4-872798a577de', 'd272518b-f28a-40b2-a19f-2ebb1812a3d3', false, true, false, 4.4, 33, '{"Display": "6.78\" AMOLED 144Hz", "Chip": "Snapdragon 8 Gen 3", "Camera": "50MP + 8MP + 2MP", "Battery": "5400 mAh", "Storage": "256GB"}'),
('Sony Xperia 1 VI', 'sony-xperia-1vi', 'Professional-grade 4K display and cinema-quality video recording.', 'Pro photography, 4K display, cinematic video', 1399, NULL, 10, 'SNY-X1VI', '6e832d18-6f75-4bbe-b2a4-872798a577de', 'fc29d43d-0bc6-4e89-b26f-8b0cf4db8856', false, true, false, 4.3, 22, '{"Display": "6.5\" 4K OLED 120Hz", "Chip": "Snapdragon 8 Gen 3", "Camera": "48MP Exmor T", "Battery": "5000 mAh", "Storage": "256GB"}'),

-- WATCHES
('Apple Watch Ultra 2', 'apple-watch-ultra-2', 'The most rugged and capable Apple Watch with precision GPS and 36hr battery.', 'Titanium, precision GPS, 36hr battery', 799, 749, 20, 'APL-AWU2', '5e4ebdb7-2315-4b5c-92da-fdf2586c7dc1', 'ca312174-6ce9-4db6-8ce8-0c83b8a27256', true, false, true, 4.9, 89, '{"Display": "49mm Always-On", "Chip": "S9 SiP", "Battery": "36 hours", "Water Resistance": "100m", "GPS": "Precision dual-frequency"}'),
('Samsung Galaxy Watch 6 Classic', 'samsung-galaxy-watch-6-classic', 'Rotating bezel, sapphire crystal, and comprehensive health tracking.', 'Rotating bezel, health tracking, Wear OS', 399, 349, 35, 'SAM-GW6C', '5e4ebdb7-2315-4b5c-92da-fdf2586c7dc1', 'a8524120-b7df-43be-9482-19863b91103b', false, false, true, 4.5, 56, '{"Display": "1.47\" Super AMOLED", "Chip": "Exynos W930", "Battery": "425 mAh", "OS": "Wear OS 4", "Connectivity": "BT, WiFi, LTE"}'),
('Amazfit T-Rex Ultra', 'amazfit-t-rex-ultra', 'Military-grade outdoor watch with dual-band GPS and 20-day battery.', 'Rugged, 20-day battery, dual-band GPS', 299, NULL, 22, 'AMZ-TRU', '5e4ebdb7-2315-4b5c-92da-fdf2586c7dc1', '154c4103-da68-4968-9f51-bcb6b5527954', false, true, false, 4.4, 41, '{"Display": "1.39\" AMOLED", "Battery": "20 days", "Water Resistance": "100m", "GPS": "Dual-band", "Material": "Titanium alloy"}'),

-- EARBUDS
('Apple AirPods Pro 2', 'airpods-pro-2', 'Adaptive Audio, USB-C, and the best ANC in any earbuds.', 'Adaptive Audio, USB-C, best-in-class ANC', 249, 229, 50, 'APL-APP2', '94afcf14-6fd5-4d9e-8c05-d456ed55ed7b', 'ca312174-6ce9-4db6-8ce8-0c83b8a27256', true, false, true, 4.8, 203, '{"Driver": "Custom Apple", "ANC": "Adaptive Transparency", "Battery": "6h + 30h case", "Connectivity": "Bluetooth 5.3", "Charging": "USB-C, MagSafe, Qi"}'),
('Samsung Galaxy Buds3 Pro', 'samsung-galaxy-buds3-pro', 'AI-powered ANC with 360 Audio and blade-style design.', 'AI noise control, 360 Audio, blade design', 229, 199, 35, 'SAM-GB3P', '94afcf14-6fd5-4d9e-8c05-d456ed55ed7b', 'a8524120-b7df-43be-9482-19863b91103b', false, true, false, 4.4, 67, '{"Driver": "Dual driver", "ANC": "AI-powered", "Battery": "7h + 30h case", "Connectivity": "Bluetooth 5.4", "Codec": "SSC HiFi"}'),
('Nothing Ear (2)', 'nothing-ear-2', 'Hi-Res certified with personalized ANC and transparent design.', 'Hi-Res Audio, personalized ANC, clear design', 129, 99, 45, 'NTH-EAR2', '94afcf14-6fd5-4d9e-8c05-d456ed55ed7b', 'caf334b9-a8bd-4524-afd3-9952cc6d2183', false, false, true, 4.3, 89, '{"Driver": "11.6mm custom", "ANC": "Personalized", "Battery": "6.3h + 36h case", "Connectivity": "Bluetooth 5.3", "Codec": "LHDC 5.0"}'),
('JBL Tour Pro 2', 'jbl-tour-pro-2', 'Smart charging case with touchscreen and Adaptive ANC.', 'Smart case display, Adaptive ANC, JBL sound', 249, 199, 25, 'JBL-TP2', '94afcf14-6fd5-4d9e-8c05-d456ed55ed7b', '1d14f4d2-bd3d-47e4-ae02-4c2db6c0049a', false, false, false, 4.5, 55, '{"Driver": "10mm", "ANC": "Adaptive + Smart Ambient", "Battery": "10h + 40h case", "Case": "Touchscreen display", "Codec": "AAC, SBC, LDAC"}'),
('Soundpeats Air4 Pro', 'soundpeats-air4-pro', 'Budget ANC earbuds with aptX Lossless and 26hr battery.', 'aptX Lossless, ANC, incredible value', 59, 49, 60, 'SPT-A4P', '94afcf14-6fd5-4d9e-8c05-d456ed55ed7b', '6746be23-3845-4867-abf5-447bf50854f9', false, true, false, 4.2, 112, '{"Driver": "13mm", "ANC": "Active", "Battery": "7h + 26h case", "Connectivity": "Bluetooth 5.3", "Codec": "aptX Lossless"}'),

-- HEADPHONES
('Sony WH-1000XM5', 'sony-wh-1000xm5', 'Industry-leading noise cancellation with exceptional sound quality.', 'Best-in-class ANC, 30hr battery, premium sound', 399, 349, 20, 'SNY-XM5', '03fc8637-07ac-4e6c-a5cd-4d9e733ebaf8', 'fc29d43d-0bc6-4e89-b26f-8b0cf4db8856', true, false, true, 4.8, 178, '{"Driver": "30mm", "ANC": "Multi Noise Sensor", "Battery": "30 hours", "Connectivity": "Bluetooth 5.2", "Weight": "250g"}'),
('Beats Studio Pro', 'beats-studio-pro', 'Premium wireless headphones with Spatial Audio and USB-C.', 'Spatial Audio, 40hr battery, USB-C lossless', 349, 299, 15, 'BTS-STP', '03fc8637-07ac-4e6c-a5cd-4d9e733ebaf8', 'd35f0900-4fe4-4cc6-88f3-9f8103e542f1', false, true, false, 4.4, 78, '{"Driver": "40mm custom", "ANC": "Adaptive", "Battery": "40 hours", "Audio": "Spatial Audio, Lossless USB-C", "Codec": "AAC, USB Audio"}'),
('Marshall Major IV', 'marshall-major-iv', 'Iconic design with 80+ hours battery and wireless charging.', '80hr battery, wireless charging, iconic look', 149, 129, 30, 'MRS-MJ4', '03fc8637-07ac-4e6c-a5cd-4d9e733ebaf8', '639a9014-42d8-4900-bdc7-1d89a6d82807', false, false, true, 4.5, 145, '{"Driver": "40mm custom", "Battery": "80+ hours", "Connectivity": "Bluetooth 5.0", "Charging": "USB-C + Wireless", "Weight": "165g"}'),

-- POWER BANKS
('Anker PowerCore 26800mAh', 'anker-powercore-26800', 'Massive capacity power bank with dual USB and fast charging.', '26800mAh, dual USB, PowerIQ', 59, 49, 40, 'ANK-PC268', '6cb22c68-b9e3-49d6-a140-69a413ffefdc', '726d02c9-2c00-481a-ab0d-9666817af1b5', false, false, true, 4.6, 234, '{"Capacity": "26800mAh", "Output": "Dual USB 3A", "Input": "Micro-USB + USB-C", "Weight": "495g", "Charging": "PowerIQ 2.0"}'),
('Baseus 65W Power Bank', 'baseus-65w-power-bank', 'Laptop-ready power bank with 65W USB-C PD output.', '65W PD output, 20000mAh, charges laptops', 69, NULL, 25, 'BAS-65W', '6cb22c68-b9e3-49d6-a140-69a413ffefdc', 'e58a9008-4323-40d9-85ed-47b3ede42aec', false, true, false, 4.5, 67, '{"Capacity": "20000mAh", "Output": "65W USB-C PD", "Ports": "2x USB-C + 1x USB-A", "Weight": "420g", "Display": "LED percentage"}'),

-- BLUETOOTH SPEAKERS
('JBL Charge 5', 'jbl-charge-5', 'Portable speaker with powerful JBL sound and built-in powerbank.', 'IP67, 20hr battery, built-in powerbank', 179, 149, 30, 'JBL-CH5', 'e133fc68-873b-4cb9-9876-05df1c393532', '1d14f4d2-bd3d-47e4-ae02-4c2db6c0049a', true, false, true, 4.7, 189, '{"Driver": "52mm woofer + tweeter", "Battery": "20 hours", "Waterproof": "IP67", "Power": "Built-in powerbank", "Connectivity": "Bluetooth 5.1"}'),
('Marshall Emberton II', 'marshall-emberton-ii', 'Compact portable speaker with iconic Marshall sound.', 'True Stereophonic, 30hr battery, IP67', 149, 129, 20, 'MRS-EMB2', 'e133fc68-873b-4cb9-9876-05df1c393532', '639a9014-42d8-4900-bdc7-1d89a6d82807', false, false, false, 4.5, 98, '{"Driver": "Full-range", "Battery": "30 hours", "Waterproof": "IP67", "Sound": "True Stereophonic", "Weight": "700g"}'),

-- MOBILE ACCESSORIES
('Mcdodo 100W USB-C Cable', 'mcdodo-100w-usb-c-cable', 'Premium braided USB-C cable with 100W PD fast charging.', '100W PD, braided nylon, 1.2m', 14.99, 11.99, 100, 'MCD-100W', 'ac913880-f288-4d23-ae50-d53d3ef41ed2', '9d3e2811-7cbc-4dfe-b4ee-f92336466104', false, false, true, 4.3, 312, '{"Length": "1.2m", "Power": "100W PD", "Material": "Braided Nylon", "Connector": "USB-C to USB-C", "Data": "480Mbps"}'),
('Torras MagSafe Case iPhone 15 Pro', 'torras-magsafe-case-iphone15', 'Slim MagSafe-compatible case with military-grade drop protection.', 'MagSafe, military-grade, ultra-slim', 39.99, 29.99, 55, 'TOR-MS15P', 'ac913880-f288-4d23-ae50-d53d3ef41ed2', 'd6e7122a-f8bb-48c1-8f2d-b81b183e8f43', false, true, false, 4.6, 87, '{"Compatibility": "iPhone 15 Pro", "MagSafe": "Yes", "Protection": "MIL-STD-810G", "Material": "Polycarbonate + TPU", "Weight": "35g"}'),
('UGreen 100W GaN Charger', 'ugreen-100w-gan-charger', '4-port GaN charger with 100W total output for all devices.', '100W GaN, 4 ports, universal charger', 59.99, 49.99, 35, 'UGR-100W', 'ac913880-f288-4d23-ae50-d53d3ef41ed2', '5057d2b1-52e2-4755-a54f-6415b8cb2a62', true, false, false, 4.7, 156, '{"Power": "100W total", "Ports": "3x USB-C + 1x USB-A", "Technology": "GaN III", "Input": "100-240V", "Weight": "200g"}'),
('Pitaka MagEZ Case 4', 'pitaka-magez-case-4', 'Ultra-thin aramid fiber case with MagSafe compatibility.', 'Aramid fiber, 0.95mm thin, MagSafe', 69.99, NULL, 20, 'PTK-MEC4', 'ac913880-f288-4d23-ae50-d53d3ef41ed2', '73c9e8f5-269d-4667-9562-df6a54ff8a99', false, false, false, 4.8, 45, '{"Material": "600D Aramid Fiber", "Thickness": "0.95mm", "Weight": "16g", "MagSafe": "Yes", "Compatibility": "iPhone 15 Pro"}'),

-- TABLETS
('Apple iPad Pro M4', 'apple-ipad-pro-m4', 'The thinnest Apple product ever with M4 chip and tandem OLED display.', 'M4 chip, OLED display, ultra-thin', 1099, 999, 12, 'APL-IPDM4', 'ec19a6db-7a62-409e-aadd-9a1c18aa6c62', 'ca312174-6ce9-4db6-8ce8-0c83b8a27256', true, true, false, 4.9, 56, '{"Display": "11\" Tandem OLED", "Chip": "Apple M4", "Storage": "256GB", "Battery": "10 hours", "Connectivity": "WiFi 6E + 5G"}'),
('Samsung Galaxy Tab S9 Ultra', 'samsung-galaxy-tab-s9-ultra', 'Massive 14.6-inch AMOLED display with S Pen and DeX mode.', '14.6\" AMOLED, S Pen included, DeX mode', 1199, 1049, 8, 'SAM-TS9U', 'ec19a6db-7a62-409e-aadd-9a1c18aa6c62', 'a8524120-b7df-43be-9482-19863b91103b', false, false, true, 4.6, 34, '{"Display": "14.6\" Dynamic AMOLED 2X", "Chip": "Snapdragon 8 Gen 2", "Storage": "256GB", "Battery": "11200 mAh", "S Pen": "Included"}'),

-- LAPTOPS
('Apple MacBook Air M3', 'macbook-air-m3', 'Supercharged by M3, incredibly thin and light with all-day battery.', 'M3 chip, 18hr battery, Liquid Retina', 1099, NULL, 15, 'APL-MBA-M3', '84c0de8b-3d95-4741-a16d-4d4cc45d9471', 'ca312174-6ce9-4db6-8ce8-0c83b8a27256', true, true, true, 4.9, 167, '{"Display": "13.6\" Liquid Retina", "Chip": "Apple M3", "RAM": "8GB", "Storage": "256GB SSD", "Battery": "18 hours"}'),

-- ACTION CAMERAS
('GoPro HERO12 Black', 'gopro-hero12-black', 'Waterproof action camera with 5.3K60 video and HyperSmooth 6.0.', '5.3K60, HyperSmooth 6.0, waterproof', 399, 349, 18, 'GPR-H12B', '36f58bb2-0ef2-4784-9a7b-1e20adb9b62f', '717fdd6c-c036-4065-ade4-33580da5304d', false, true, true, 4.6, 89, '{"Video": "5.3K60 / 4K120", "Stabilization": "HyperSmooth 6.0", "Waterproof": "10m", "Battery": "1720 mAh", "Display": "Front + Rear LCD"}'),
('DJI Osmo Action 4', 'dji-osmo-action-4', 'Premium action camera with 1/1.3\" sensor and 4K120fps.', '1/1.3\" sensor, 4K120, magnetic mount', 349, 299, 12, 'DJI-OA4', '36f58bb2-0ef2-4784-9a7b-1e20adb9b62f', '95b65130-3eac-4cb1-a05f-fe28c1a73175', false, false, false, 4.5, 56, '{"Video": "4K120fps", "Sensor": "1/1.3\"", "Waterproof": "18m", "Battery": "1770 mAh", "Mount": "Magnetic quick-release"}'),

-- NECKBANDS
('JBL Tune Flex', 'jbl-tune-flex', 'Versatile neckband with open or closed ear tips and JBL Pure Bass.', 'JBL Pure Bass, 32hr battery, dual tips', 79, 59, 40, 'JBL-TF', '3f205bf5-f941-428f-9b7c-42d6ea3257b1', '1d14f4d2-bd3d-47e4-ae02-4c2db6c0049a', false, false, true, 4.3, 98, '{"Driver": "12.4mm", "Battery": "32 hours", "ANC": "Active", "Connectivity": "Bluetooth 5.3", "Weight": "22g"}'),
('Oraimo Necklace 4', 'oraimo-necklace-4', 'Affordable wireless neckband with deep bass and 50hr battery.', '50hr battery, deep bass, magnetic earbuds', 19.99, 14.99, 80, 'ORM-NL4', '3f205bf5-f941-428f-9b7c-42d6ea3257b1', 'd6f325e4-494b-47ba-8266-0fef889f62cc', false, false, false, 4.1, 234, '{"Driver": "10mm", "Battery": "50 hours", "Connectivity": "Bluetooth 5.3", "Weight": "30g", "Feature": "Magnetic earbuds"}');

-- Add placeholder images for all products
INSERT INTO product_images (product_id, url, sort_order)
SELECT id, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=800&fit=crop', 0 FROM products WHERE slug = 'iphone-15-pro-max'
UNION ALL SELECT id, 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&h=800&fit=crop', 0 FROM products WHERE slug = 'samsung-galaxy-s24-ultra'
UNION ALL SELECT id, 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&h=800&fit=crop', 0 FROM products WHERE slug = 'nothing-phone-2'
UNION ALL SELECT id, 'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=800&h=800&fit=crop', 0 FROM products WHERE slug = 'xiaomi-14-ultra'
UNION ALL SELECT id, 'https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=800&h=800&fit=crop', 0 FROM products WHERE slug = 'realme-gt5-pro'
UNION ALL SELECT id, 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800&h=800&fit=crop', 0 FROM products WHERE slug = 'sony-xperia-1vi'
UNION ALL SELECT id, 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=800&h=800&fit=crop', 0 FROM products WHERE slug = 'apple-watch-ultra-2'
UNION ALL SELECT id, 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&h=800&fit=crop', 0 FROM products WHERE slug = 'samsung-galaxy-watch-6-classic'
UNION ALL SELECT id, 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&h=800&fit=crop', 0 FROM products WHERE slug = 'amazfit-t-rex-ultra'
UNION ALL SELECT id, 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=800&h=800&fit=crop', 0 FROM products WHERE slug = 'airpods-pro-2'
UNION ALL SELECT id, 'https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=800&h=800&fit=crop', 0 FROM products WHERE slug = 'samsung-galaxy-buds3-pro'
UNION ALL SELECT id, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop', 0 FROM products WHERE slug = 'nothing-ear-2'
UNION ALL SELECT id, 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&h=800&fit=crop', 0 FROM products WHERE slug = 'jbl-tour-pro-2'
UNION ALL SELECT id, 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&h=800&fit=crop', 0 FROM products WHERE slug = 'soundpeats-air4-pro'
UNION ALL SELECT id, 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&h=800&fit=crop', 0 FROM products WHERE slug = 'sony-wh-1000xm5'
UNION ALL SELECT id, 'https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?w=800&h=800&fit=crop', 0 FROM products WHERE slug = 'beats-studio-pro'
UNION ALL SELECT id, 'https://images.unsplash.com/photo-1545127398-14699f92334b?w=800&h=800&fit=crop', 0 FROM products WHERE slug = 'marshall-major-iv'
UNION ALL SELECT id, 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800&h=800&fit=crop', 0 FROM products WHERE slug = 'anker-powercore-26800'
UNION ALL SELECT id, 'https://images.unsplash.com/photo-1585338107529-13afc25806f9?w=800&h=800&fit=crop', 0 FROM products WHERE slug = 'baseus-65w-power-bank'
UNION ALL SELECT id, 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&h=800&fit=crop', 0 FROM products WHERE slug = 'jbl-charge-5'
UNION ALL SELECT id, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=800&fit=crop', 0 FROM products WHERE slug = 'marshall-emberton-ii'
UNION ALL SELECT id, 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&h=800&fit=crop', 0 FROM products WHERE slug = 'mcdodo-100w-usb-c-cable'
UNION ALL SELECT id, 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800&h=800&fit=crop', 0 FROM products WHERE slug = 'torras-magsafe-case-iphone15'
UNION ALL SELECT id, 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&h=800&fit=crop', 0 FROM products WHERE slug = 'ugreen-100w-gan-charger'
UNION ALL SELECT id, 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800&h=800&fit=crop', 0 FROM products WHERE slug = 'pitaka-magez-case-4'
UNION ALL SELECT id, 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&h=800&fit=crop', 0 FROM products WHERE slug = 'apple-ipad-pro-m4'
UNION ALL SELECT id, 'https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=800&h=800&fit=crop', 0 FROM products WHERE slug = 'samsung-galaxy-tab-s9-ultra'
UNION ALL SELECT id, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=800&fit=crop', 0 FROM products WHERE slug = 'macbook-air-m3'
UNION ALL SELECT id, 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&h=800&fit=crop', 0 FROM products WHERE slug = 'gopro-hero12-black'
UNION ALL SELECT id, 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&h=800&fit=crop', 0 FROM products WHERE slug = 'dji-osmo-action-4'
UNION ALL SELECT id, 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&h=800&fit=crop', 0 FROM products WHERE slug = 'jbl-tune-flex'
UNION ALL SELECT id, 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&h=800&fit=crop', 0 FROM products WHERE slug = 'oraimo-necklace-4';

-- Also add shipping methods if not present
INSERT INTO shipping_methods (name, description, estimated_days, price, is_active)
SELECT 'Standard Shipping', 'Delivered in 5-7 business days', '5-7 days', 5.99, true
WHERE NOT EXISTS (SELECT 1 FROM shipping_methods WHERE name = 'Standard Shipping')
UNION ALL
SELECT 'Express Shipping', 'Delivered in 2-3 business days', '2-3 days', 14.99, true
WHERE NOT EXISTS (SELECT 1 FROM shipping_methods WHERE name = 'Express Shipping')
UNION ALL
SELECT 'Overnight Shipping', 'Next business day delivery', '1 day', 29.99, true
WHERE NOT EXISTS (SELECT 1 FROM shipping_methods WHERE name = 'Overnight Shipping');
