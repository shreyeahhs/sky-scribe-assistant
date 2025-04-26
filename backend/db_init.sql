-- Drop existing tables if they exist
DROP TABLE IF EXISTS search_history CASCADE;
DROP TABLE IF EXISTS flights CASCADE;
DROP TABLE IF EXISTS aircraft_types CASCADE;
DROP TABLE IF EXISTS airlines CASCADE;
DROP TABLE IF EXISTS airports CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Drop existing types if they exist
DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS flight_status CASCADE;

-- Create enum types
CREATE TYPE user_role AS ENUM ('admin', 'user');
CREATE TYPE flight_status AS ENUM ('scheduled', 'delayed', 'cancelled', 'boarding', 'departed', 'arrived');

-- Create tables
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    role user_role DEFAULT 'user',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE airports (
    id SERIAL PRIMARY KEY,
    code CHAR(3) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    country VARCHAR(255) NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    timezone VARCHAR(50) NOT NULL,
    terminal_count INTEGER,
    runway_count INTEGER,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE airlines (
    id SERIAL PRIMARY KEY,
    code CHAR(2) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    country VARCHAR(255) NOT NULL,
    logo_url VARCHAR(255),
    website_url VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE aircraft_types (
    id SERIAL PRIMARY KEY,
    code VARCHAR(10) UNIQUE NOT NULL,
    manufacturer VARCHAR(255) NOT NULL,
    model VARCHAR(255) NOT NULL,
    capacity INTEGER NOT NULL,
    range_km INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE flights (
    id SERIAL PRIMARY KEY,
    flight_number VARCHAR(10) NOT NULL,
    airline_id INTEGER REFERENCES airlines(id),
    departure_airport_id INTEGER REFERENCES airports(id),
    arrival_airport_id INTEGER REFERENCES airports(id),
    departure_time TIMESTAMP WITH TIME ZONE NOT NULL,
    arrival_time TIMESTAMP WITH TIME ZONE NOT NULL,
    duration INTEGER, -- in minutes
    aircraft_type_id INTEGER REFERENCES aircraft_types(id),
    status flight_status DEFAULT 'scheduled',
    gate VARCHAR(10),
    terminal VARCHAR(10),
    price DECIMAL(10, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE search_history (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    query TEXT NOT NULL,
    generated_sql TEXT NOT NULL,
    result_count INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_airports_code ON airports(code);
CREATE INDEX idx_airports_city ON airports(city);
CREATE INDEX idx_airports_country ON airports(country);
CREATE INDEX idx_flights_departure_time ON flights(departure_time);
CREATE INDEX idx_flights_arrival_time ON flights(arrival_time);
CREATE INDEX idx_flights_airline_id ON flights(airline_id);
CREATE INDEX idx_flights_departure_airport_id ON flights(departure_airport_id);
CREATE INDEX idx_flights_arrival_airport_id ON flights(arrival_airport_id);
CREATE INDEX idx_search_history_user_id ON search_history(user_id);
CREATE INDEX idx_search_history_created_at ON search_history(created_at);

-- Insert sample data
INSERT INTO airlines (code, name, country) VALUES
('AA', 'American Airlines', 'United States'),
('DL', 'Delta Air Lines', 'United States'),
('BA', 'British Airways', 'United Kingdom'),
('LH', 'Lufthansa', 'Germany'),
('AF', 'Air France', 'France');

INSERT INTO aircraft_types (code, manufacturer, model, capacity, range_km) VALUES
('B737', 'Boeing', '737-800', 189, 5765),
('A320', 'Airbus', 'A320', 180, 6100),
('B777', 'Boeing', '777-300ER', 396, 13650),
('A380', 'Airbus', 'A380', 853, 15700),
('B787', 'Boeing', '787-9', 290, 14140);

INSERT INTO airports (code, name, city, country, latitude, longitude, timezone, terminal_count, runway_count) VALUES
('JFK', 'John F. Kennedy International Airport', 'New York', 'United States', 40.6413, -73.7781, 'America/New_York', 6, 4),
('LHR', 'Heathrow Airport', 'London', 'United Kingdom', 51.4700, -0.4543, 'Europe/London', 5, 2),
('CDG', 'Charles de Gaulle Airport', 'Paris', 'France', 49.0097, 2.5478, 'Europe/Paris', 3, 4),
('FRA', 'Frankfurt Airport', 'Frankfurt', 'Germany', 50.0379, 8.5622, 'Europe/Berlin', 2, 4),
('DXB', 'Dubai International Airport', 'Dubai', 'United Arab Emirates', 25.2528, 55.3644, 'Asia/Dubai', 3, 2);

-- Create a default admin user (password: admin123)
INSERT INTO users (email, hashed_password, full_name, role) VALUES
('admin@airscribe.com', '$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'Admin User', 'admin');

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_airports_updated_at
    BEFORE UPDATE ON airports
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_airlines_updated_at
    BEFORE UPDATE ON airlines
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_aircraft_types_updated_at
    BEFORE UPDATE ON aircraft_types
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_flights_updated_at
    BEFORE UPDATE ON flights
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 