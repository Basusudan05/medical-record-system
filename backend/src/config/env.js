import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port:          process.env.PORT          || 5000,
  nodeEnv:       process.env.NODE_ENV      || 'development',
  frontendUrl:   process.env.FRONTEND_URL  || 'http://localhost:5173',

  // Supabase — service-role key for backend-only privileged access
  supabaseUrl:        process.env.SUPABASE_URL              || '',
  supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',

  // OCR.space
  ocrSpaceApiKey: process.env.OCR_SPACE_API_KEY || '',

  // Future AI phases
  geminiApiKey:             process.env.GEMINI_API_KEY                || '',
  googleCloudCredentials:   process.env.GOOGLE_APPLICATION_CREDENTIALS || '',
};
