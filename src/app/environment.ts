export const isDevelopment = () => process.env.NODE_ENV === 'development';

export const ENVIRONMENT = {
  PORT: process.env.API_PORT || process.env.PORT || 9000,
  NODE_ENV: process.env.NODE_ENV,
  MONGODB_URI: process.env.MONGODB_URI,
};
