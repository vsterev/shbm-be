import * as dotenv from "dotenv";
import * as fs from "fs";

if (!fs.existsSync(".env")) {
  console.error(".env not found!");
  process.exit(1);
}
dotenv.config();
if (
  !process.env.PARSER_URL ||
  !process.env.PARSER_USER ||
  !process.env.PARSER_PASSWORD ||
  !process.env.HOTEL_SERVICE_URL ||
  !process.env.HOTEL_SERVICE_USER ||
  !process.env.HOTEL_SERVICE_PASSWORD ||
  !process.env.INTERLOOK_URL ||
  !process.env.INTERLOOK_USER ||
  !process.env.INTERLOOK_PASSWORD ||
  !process.env.API_TOKEN_SECRET
) {
  console.error(".env not fully set up!");
  process.exit(1);
}

export default {
  NODE_ENV: process.env.NODE_ENV || "DEV",
  APP_PORT: Number(process.env.APP_PORT) || 3000,
  MONGO_URL: process.env.MONGO_URL,
  DEBUG_MODE: process.env.DEBUG_MODE || "false",
  REDIS_HOST: process.env.REDIS_HOST || "localhost",
  REDIS_PORT: Number(process.env.REDIS_PORT) || 6379,
  REDIS_PASSWORD: process.env.REDIS_PASSWORD,
  REDIS_DB: Number(process.env.REDIS_DB) || 0,
  PARSER_URL: process.env.PARSER_URL,
  PARSER_USER: process.env.PARSER_USER,
  PARSER_PASSWORD: process.env.PARSER_PASSWORD,
  HOTEL_SERVICE_URL: process.env.HOTEL_SERVICE_URL,
  HOTEL_SERVICE_USER: process.env.HOTEL_SERVICE_USER,
  HOTEL_SERVICE_PASSWORD: process.env.HOTEL_SERVICE_PASSWORD,
  MAIL_USER: process.env.MAIL_ADDRES,
  MAIL_PASS: process.env.MAIL_PASS,
  MAIL_HOST: process.env.MAIL_HOST,
  MAIL_PORT: process.env.MAIL_PORT,
  MAIL_RECIEPENTS: process.env.MAIL_RECIEPENTS,
  INTERLOOK_URL: process.env.INTERLOOK_URL,
  INTERLOOK_USER: process.env.INTERLOOK_USER,
  INTERLOOK_PASSWORD: process.env.INTERLOOK_PASSWORD,
  API_TOKEN_SECRET: process.env.API_TOKEN_SECRET,
};
