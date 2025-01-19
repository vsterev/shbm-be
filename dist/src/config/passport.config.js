"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_jwt_1 = __importDefault(require("passport-jwt"));
const envVariables_1 = __importDefault(require("./envVariables"));
const user_1 = __importDefault(require("../models/user"));
const ExtractJwt = passport_jwt_1.default.ExtractJwt;
const JwtStrategy = passport_jwt_1.default.Strategy;
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("Bearer"),
    secretOrKey: envVariables_1.default.API_TOKEN_SECRET,
};
const strategy = new JwtStrategy(jwtOptions, async function (jwt_payload, done) {
    try {
        const user = await user_1.default.findById(jwt_payload.id);
        if (user) {
            return done(null, user);
        }
        else {
            return done(null, false);
        }
    }
    catch (error) {
        return done(error, false);
    }
});
passport_1.default.use("jwt-passport", strategy);
exports.default = passport_1.default;
//# sourceMappingURL=passport.config.js.map