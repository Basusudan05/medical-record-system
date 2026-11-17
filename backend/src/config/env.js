import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',

  // Supabase — populated in Phase 2
  supabaseUrl: process.env.SUPABASE_URL || '',
  supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',

  // AI — populated in Phase 5
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  googleCloudCredentials: process.env.GOOGLE_APPLICATION_CREDENTIALS || '',
};
