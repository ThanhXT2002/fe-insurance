const fs = require('fs');
const path = require('path');

const envDir = './src/environments';
if (!fs.existsSync(envDir)) {
  fs.mkdirSync(envDir, { recursive: true });
}

// Development environment file (default values)
const devEnvContent = `export const environment = {
  production: false,
  apiUrl: '${process.env.DEV_API_URL || ''}',
  appVersion: require('../../package.json').version,
  SUPABASE_URL: '${process.env.SUPABASE_URL || ''}',
  SUPABASE_ANON_KEY: '${process.env.SUPABASE_ANON_KEY || ''}',
  appName: '${process.env.APP_NAME || ''}',
  emailSupport: '${process.env.EMAIL_SUPPORT || ''}',
  numberPhone:'${process.env.NUMBER_PHONE || ''}',
  address:'${process.env.ADDRESS || ''}',

};`;

// Production environment file
const prodEnvContent = `export const environment = {
  production: true,
  apiUrl: '${process.env.API_URL || ''}',
  appVersion: require('../../package.json').version,
  SUPABASE_URL: '${process.env.SUPABASE_URL || ''}',
  SUPABASE_ANON_KEY: '${process.env.SUPABASE_ANON_KEY || ''}',
  appName: '${process.env.APP_NAME || ''}',
  emailSupport: '${process.env.EMAIL_SUPPORT || ''}',
  numberPhone:'${process.env.NUMBER_PHONE || ''}',
  address:'${process.env.ADDRESS || ''}',

};`;

// Write both environment files
fs.writeFileSync('./src/environments/environment.ts', devEnvContent);
fs.writeFileSync('./src/environments/environment.prod.ts', prodEnvContent);
