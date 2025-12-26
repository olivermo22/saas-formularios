import "dotenv/config";

function required(name) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required env var: ${name}`);
  return v;
}

export const env = {
  NODE_ENV: process.env.NODE_ENV || "production",
  PORT: Number(process.env.PORT || 8080),

  APP_NAME: process.env.APP_NAME || "Saas-Formularios",
  APP_BASE_URL: process.env.APP_BASE_URL || "https://iawhats.com.mx",
  API_BASE_URL: process.env.API_BASE_URL || "https://api.iawhats.com.mx",

  // Supabase
  SUPABASE_URL: process.env.SUPABASE_URL || "",
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || ""
};

export function validateEnvForSupabase() {
  required("SUPABASE_URL");
  required("SUPABASE_SERVICE_ROLE_KEY");
}

