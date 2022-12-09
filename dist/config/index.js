"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CLOUDINARY_API_SECRET = exports.CLOUDINARY_API_KEY = exports.CLOUDINARY_NAME = exports.APP_SECRET = exports.userSubject = exports.GMAIL_PASS = exports.GMAIL_USER = exports.fromAdminMail = exports.fromAdminPhone = exports.authToken = exports.accountSid = exports.db = void 0;
const sequelize_1 = require("sequelize");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.db = new sequelize_1.Sequelize('app', '', '', {
    storage: "./foodDB.sqlite",
    dialect: "sqlite",
    logging: false
});
exports.accountSid = process.env.ACOUNTSID;
exports.authToken = process.env.AUTHTOKEN;
exports.fromAdminPhone = process.env.FROMADMINPHONE;
exports.fromAdminMail = process.env.fromAdminMail;
exports.GMAIL_USER = process.env.GMAIL_USER;
exports.GMAIL_PASS = process.env.GMAIL_PASS;
exports.userSubject = process.env.userSubject;
exports.APP_SECRET = process.env.APP_SECRET;
exports.CLOUDINARY_NAME = process.env.CLOUDINARY_NAME;
exports.CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
exports.CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;
