"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = generateToken;
exports.verifyToken = verifyToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const envVariables_1 = __importDefault(require("../config/envVariables"));
const JWT_SECRET = envVariables_1.default.API_TOKEN_SECRET;
function generateToken(user) {
    const payload = { id: user._id }; // Add more fields if needed
    return jsonwebtoken_1.default.sign(payload, JWT_SECRET, { expiresIn: "1m" }); // Set token expiry
}
function verifyToken(token) {
    return new Promise((resolve, reject) => {
        //така се прави за да върне промис   стандартната функция
        jsonwebtoken_1.default.verify(token, JWT_SECRET, async (err, data) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(data);
        });
    });
}
//# sourceMappingURL=jwt.js.map