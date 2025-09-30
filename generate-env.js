const fs = require("fs");
const path = require("path");

const envDir = "./src/environments";
if (!fs.existsSync(envDir)) {
  fs.mkdirSync(envDir, { recursive: true });
}

// Development environment file (default values)
const devEnvContent = `export const environment = {
  production: false,
  apiUrl: '${process.env.DEV_API_URL || ""}',
  appVersion: require('../../package.json').version,
  SUPABASE_URL: '${process.env.SUPABASE_URL || ""}',
  SUPABASE_ANON_KEY: '${process.env.SUPABASE_ANON_KEY || ""}',
  appName: '${process.env.APP_NAME || ""}',
  emailSupport: '${process.env.EMAIL_SUPPORT || ""}',
  numberPhone:'${process.env.NUMBER_PHONE || ""}',
  address:'${process.env.ADDRESS || ""}',

  // SEO defaults - can be overridden by environment variables
  seoTitle: '${process.env.SEO_TITLE || "XTBH - Bảo hiểm của mọi nhà"}',
  seoDescription: '${process.env.SEO_DESCRIPTION || "XTBH cung cấp giải pháp bảo hiểm uy tín, bảo vệ sức khỏe, tài sản, doanh nghiệp và cá nhân. Đăng ký nhanh, hỗ trợ tận tâm."}',
  seoKeywords: '${process.env.SEO_KEYWORDS || "bảo hiểm, bảo hiểm sức khỏe, bảo hiểm tài sản, bảo hiểm doanh nghiệp, bảo hiểm xe máy - ô tô, XTBH"}',
  seoImage: '${process.env.SEO_IMAGE || "https://res.cloudinary.com/dblf2v0od/image/upload/v1759241314/img-seo-default_hv6z16.webp"}',
  seoUrl: '${process.env.SEO_URL || "https://xtbh.tranxuanthanhtxt.com"}',
  seoType: '${process.env.SEO_TYPE || "website"}',
  seoSiteName: '${process.env.SEO_SITE_NAME || "XTBH"}',
  seoAuthor: '${process.env.SEO_AUTHOR || "XTBH Team"}',
  seoPublishedTime: '${process.env.SEO_PUBLISHED_TIME || "2025-07-01T00:00:00.000Z"}',
  seoModifiedTime: '${process.env.SEO_MODIFIED_TIME || "2025-09-30T00:00:00.000Z"}',

};`;

// Production environment file
const prodEnvContent = `export const environment = {
  production: true,
  apiUrl: '${process.env.API_URL || ""}',
  appVersion: require('../../package.json').version,
  SUPABASE_URL: '${process.env.SUPABASE_URL || ""}',
  SUPABASE_ANON_KEY: '${process.env.SUPABASE_ANON_KEY || ""}',
  appName: '${process.env.APP_NAME || ""}',
  emailSupport: '${process.env.EMAIL_SUPPORT || ""}',
  numberPhone:'${process.env.NUMBER_PHONE || ""}',
  address:'${process.env.ADDRESS || ""}',

  // SEO defaults - can be overridden by environment variables
  seoTitle: '${process.env.SEO_TITLE || "XTBH - Bảo hiểm của mọi nhà"}',
  seoDescription: '${process.env.SEO_DESCRIPTION || "XTBH cung cấp giải pháp bảo hiểm uy tín, bảo vệ sức khỏe, tài sản, doanh nghiệp và cá nhân. Đăng ký nhanh, hỗ trợ tận tâm."}',
  seoKeywords: '${process.env.SEO_KEYWORDS || "bảo hiểm, bảo hiểm sức khỏe, bảo hiểm tài sản, bảo hiểm doanh nghiệp, bảo hiểm xe máy - ô tô, XTBH"}',
  seoImage: '${process.env.SEO_IMAGE || "https://res.cloudinary.com/dblf2v0od/image/upload/v1759241314/img-seo-default_hv6z16.webp"}',
  seoUrl: '${process.env.SEO_URL || "https://xtbh.tranxuanthanhtxt.com"}',
  seoType: '${process.env.SEO_TYPE || "website"}',
  seoSiteName: '${process.env.SEO_SITE_NAME || "XTBH"}',
  seoAuthor: '${process.env.SEO_AUTHOR || "XTBH Team"}',
  seoPublishedTime: '${process.env.SEO_PUBLISHED_TIME || "2025-07-01T00:00:00.000Z"}',
  seoModifiedTime: '${process.env.SEO_MODIFIED_TIME || "2025-09-30T00:00:00.000Z"}',

};`;

// Write both environment files
fs.writeFileSync("./src/environments/environment.ts", devEnvContent);
fs.writeFileSync("./src/environments/environment.prod.ts", prodEnvContent);
