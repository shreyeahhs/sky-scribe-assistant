-- Add more airlines
INSERT INTO airlines (code, name, country, logo_url, website_url) VALUES
('EK', 'Emirates', 'United Arab Emirates', 'https://logo.com/emirates.png', 'https://emirates.com'),
('SQ', 'Singapore Airlines', 'Singapore', 'https://logo.com/singapore.png', 'https://singaporeair.com'),
('QR', 'Qatar Airways', 'Qatar', 'https://logo.com/qatar.png', 'https://qatarairways.com'),
('TK', 'Turkish Airlines', 'Turkey', 'https://logo.com/turkish.png', 'https://turkishairlines.com'),
('EY', 'Etihad Airways', 'United Arab Emirates', 'https://logo.com/etihad.png', 'https://etihad.com'),
('CX', 'Cathay Pacific', 'Hong Kong', 'https://logo.com/cathay.png', 'https://cathaypacific.com'),
('JL', 'Japan Airlines', 'Japan', 'https://logo.com/jal.png', 'https://jal.com'),
('NH', 'All Nippon Airways', 'Japan', 'https://logo.com/ana.png', 'https://ana.co.jp'),
('KE', 'Korean Air', 'South Korea', 'https://logo.com/koreanair.png', 'https://koreanair.com'),
('OZ', 'Asiana Airlines', 'South Korea', 'https://logo.com/asiana.png', 'https://flyasiana.com'),
('UA', 'United Airlines', 'United States', 'https://logo.com/united.png', 'https://united.com'),
('AC', 'Air Canada', 'Canada', 'https://logo.com/aircanada.png', 'https://aircanada.com'),
('KL', 'KLM Royal Dutch', 'Netherlands', 'https://logo.com/klm.png', 'https://klm.com'),
('IB', 'Iberia', 'Spain', 'https://logo.com/iberia.png', 'https://iberia.com'),
('AZ', 'Alitalia', 'Italy', 'https://logo.com/alitalia.png', 'https://alitalia.com'),
('SK', 'SAS Scandinavian', 'Sweden', 'https://logo.com/sas.png', 'https://flysas.com'),
('LX', 'SWISS', 'Switzerland', 'https://logo.com/swiss.png', 'https://swiss.com'),
('OS', 'Austrian Airlines', 'Austria', 'https://logo.com/austrian.png', 'https://austrian.com'),
('QF', 'Qantas', 'Australia', 'https://logo.com/qantas.png', 'https://qantas.com'),
('NZ', 'Air New Zealand', 'New Zealand', 'https://logo.com/airnz.png', 'https://airnewzealand.com');

-- Add more aircraft types
INSERT INTO aircraft_types (code, manufacturer, model, capacity, range_km) VALUES
('A321', 'Airbus', 'A321neo', 244, 7400),
('A350', 'Airbus', 'A350-900', 325, 15000),
('A330', 'Airbus', 'A330-300', 277, 11750),
('B788', 'Boeing', '787-8', 242, 13530),
('B789', 'Boeing', '787-9', 290, 14140),
('B77W', 'Boeing', '777-300ER', 396, 13650),
('B738', 'Boeing', '737-800', 189, 5765),
('B748', 'Boeing', '747-8', 467, 14815),
('A339', 'Airbus', 'A330-900neo', 287, 13334),
('A359', 'Airbus', 'A350-900', 325, 15000),
('B763', 'Boeing', '767-300ER', 269, 11093),
('B772', 'Boeing', '777-200ER', 314, 14305),
('A319', 'Airbus', 'A319', 156, 6950),
('A21N', 'Airbus', 'A321neo', 244, 7400),
('B38M', 'Boeing', '737 MAX 8', 178, 6570),
('B39M', 'Boeing', '737 MAX 9', 193, 6570),
('E190', 'Embraer', 'E190', 114, 4537),
('E195', 'Embraer', 'E195', 124, 4260),
('CRJ9', 'Bombardier', 'CRJ-900', 90, 2876),
('A220', 'Airbus', 'A220-300', 160, 6297);

-- Add more airports
INSERT INTO airports (code, name, city, country, latitude, longitude, timezone, terminal_count, runway_count, description) VALUES
('LAX', 'Los Angeles International', 'Los Angeles', 'United States', 33.9416, -118.4085, 'America/Los_Angeles', 9, 4, 'Major gateway to Asia and Pacific'),
('ORD', 'O''Hare International', 'Chicago', 'United States', 41.9786, -87.9048, 'America/Chicago', 4, 8, 'One of the busiest airports in the world'),
('HND', 'Haneda Airport', 'Tokyo', 'Japan', 35.5494, 139.7798, 'Asia/Tokyo', 3, 4, 'Tokyo''s primary domestic airport'),
('NRT', 'Narita International', 'Tokyo', 'Japan', 35.7720, 140.3929, 'Asia/Tokyo', 3, 2, 'Tokyo''s primary international airport'),
('PEK', 'Beijing Capital', 'Beijing', 'China', 40.0799, 116.6031, 'Asia/Shanghai', 3, 3, 'Main international airport serving Beijing'),
('ICN', 'Incheon International', 'Seoul', 'South Korea', 37.4602, 126.4407, 'Asia/Seoul', 2, 3, 'Award-winning airport serving Seoul'),
('SIN', 'Changi Airport', 'Singapore', 'Singapore', 1.3644, 103.9915, 'Asia/Singapore', 4, 2, 'Features indoor waterfall and butterfly garden'),
('SYD', 'Sydney Airport', 'Sydney', 'Australia', -33.9399, 151.1753, 'Australia/Sydney', 3, 3, 'Main gateway to Australia'),
('AKL', 'Auckland Airport', 'Auckland', 'New Zealand', -37.0082, 174.7850, 'Pacific/Auckland', 2, 2, 'New Zealand''s largest airport'),
('DEL', 'Indira Gandhi International', 'Delhi', 'India', 28.5562, 77.1000, 'Asia/Kolkata', 3, 3, 'India''s busiest airport'),
('BOM', 'Chhatrapati Shivaji', 'Mumbai', 'India', 19.0896, 72.8656, 'Asia/Kolkata', 2, 2, 'Second busiest airport in India'),
('IST', 'Istanbul Airport', 'Istanbul', 'Turkey', 41.2753, 28.7519, 'Europe/Istanbul', 1, 5, 'World''s largest airport terminal under one roof'),
('DOH', 'Hamad International', 'Doha', 'Qatar', 25.2609, 51.6138, 'Asia/Qatar', 1, 2, 'Features giant teddy bear sculpture'),
('MAD', 'Adolfo Suárez Madrid–Barajas', 'Madrid', 'Spain', 40.4983, -3.5676, 'Europe/Madrid', 4, 4, 'Spain''s largest airport'),
('FCO', 'Leonardo da Vinci', 'Rome', 'Italy', 41.8045, 12.2506, 'Europe/Rome', 4, 4, 'Italy''s largest airport'),
('MUC', 'Munich Airport', 'Munich', 'Germany', 48.3537, 11.7750, 'Europe/Berlin', 2, 2, 'Features its own brewery'),
('AMS', 'Amsterdam Airport Schiphol', 'Amsterdam', 'Netherlands', 52.3105, 4.7683, 'Europe/Amsterdam', 1, 6, 'Below sea level airport'),
('CPH', 'Copenhagen Airport', 'Copenhagen', 'Denmark', 55.6180, 12.6508, 'Europe/Copenhagen', 3, 3, 'Oldest operating airport in Europe'),
('ZRH', 'Zurich Airport', 'Zurich', 'Switzerland', 47.4647, 8.5492, 'Europe/Zurich', 3, 3, 'Switzerland''s largest airport'),
('VIE', 'Vienna International', 'Vienna', 'Austria', 48.1102, 16.5697, 'Europe/Vienna', 3, 2, 'Hub for central and eastern Europe');

-- Add sample flights (current date + future dates)
INSERT INTO flights (flight_number, airline_id, departure_airport_id, arrival_airport_id, departure_time, arrival_time, duration, aircraft_type_id, status, gate, terminal, price)
SELECT 
    CONCAT(a.code, LPAD(CAST(ROW_NUMBER() OVER (PARTITION BY a.id ORDER BY random()) AS TEXT), 3, '0')),
    a.id,
    dep.id,
    arr.id,
    CURRENT_TIMESTAMP + (random() * interval '30 days') + (random() * interval '24 hours'),
    CURRENT_TIMESTAMP + (random() * interval '30 days') + (random() * interval '24 hours') + (interval '2 hours'),
    120 + (random() * 800)::integer,
    act.id,
    'scheduled'::flight_status,
    CONCAT(CHR(65 + (random() * 26)::integer), (random() * 99 + 1)::integer),
    (random() * 5 + 1)::integer,
    (random() * 1000 + 200)::numeric(10,2)
FROM 
    airlines a
    CROSS JOIN LATERAL (
        SELECT id FROM airports ORDER BY random() LIMIT 1
    ) dep
    CROSS JOIN LATERAL (
        SELECT id FROM airports WHERE id != dep.id ORDER BY random() LIMIT 1
    ) arr
    CROSS JOIN LATERAL (
        SELECT id FROM aircraft_types ORDER BY random() LIMIT 1
    ) act
WHERE a.id <= 25
LIMIT 25;

-- Add sample users
INSERT INTO users (email, hashed_password, full_name, role) VALUES
('user1@airscribe.com', '$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'John Smith', 'user'),
('user2@airscribe.com', '$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'Emma Johnson', 'user'),
('user3@airscribe.com', '$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'Michael Brown', 'user'),
('user4@airscribe.com', '$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'Sarah Wilson', 'user'),
('user5@airscribe.com', '$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'David Lee', 'user'),
('manager1@airscribe.com', '$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'Robert Taylor', 'admin'),
('manager2@airscribe.com', '$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'Lisa Anderson', 'admin'),
('support1@airscribe.com', '$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'James Martin', 'user'),
('support2@airscribe.com', '$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'Patricia White', 'user'),
('analyst@airscribe.com', '$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'Kevin Chen', 'admin');

-- Add sample search history
INSERT INTO search_history (user_id, query, generated_sql, result_count)
SELECT 
    u.id,
    q.query,
    q.sql,
    (random() * 50 + 1)::integer
FROM users u
CROSS JOIN (
    VALUES 
    ('Show me all flights from New York to London tomorrow', 'SELECT * FROM flights f JOIN airports a1 ON f.departure_airport_id = a1.id JOIN airports a2 ON f.arrival_airport_id = a2.id WHERE a1.city = ''New York'' AND a2.city = ''London'' AND DATE(f.departure_time) = CURRENT_DATE + 1'),
    ('Find cheapest flights to Paris next week', 'SELECT * FROM flights f JOIN airports a ON f.arrival_airport_id = a.id WHERE a.city = ''Paris'' AND f.departure_time BETWEEN CURRENT_DATE AND CURRENT_DATE + 7 ORDER BY f.price ASC'),
    ('Show all Emirates flights', 'SELECT * FROM flights f JOIN airlines a ON f.airline_id = a.id WHERE a.code = ''EK'''),
    ('List all airports in Japan', 'SELECT * FROM airports WHERE country = ''Japan'''),
    ('Find flights with Boeing 787', 'SELECT * FROM flights f JOIN aircraft_types at ON f.aircraft_type_id = at.id WHERE at.model LIKE ''%787%'''),
    ('Show me morning flights to Dubai', 'SELECT * FROM flights f JOIN airports a ON f.arrival_airport_id = a.id WHERE a.city = ''Dubai'' AND EXTRACT(HOUR FROM f.departure_time) BETWEEN 6 AND 12'),
    ('Find all delayed flights', 'SELECT * FROM flights WHERE status = ''delayed'''),
    ('List all airlines from United States', 'SELECT * FROM airlines WHERE country = ''United States'''),
    ('Show flights under $500', 'SELECT * FROM flights WHERE price < 500'),
    ('Find direct flights between Tokyo and Seoul', 'SELECT * FROM flights f JOIN airports a1 ON f.departure_airport_id = a1.id JOIN airports a2 ON f.arrival_airport_id = a2.id WHERE (a1.city = ''Tokyo'' AND a2.city = ''Seoul'') OR (a1.city = ''Seoul'' AND a2.city = ''Tokyo'')')
    ) AS q(query, sql)
WHERE u.id <= 10
LIMIT 25; 