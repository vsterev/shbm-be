"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const tsoa_1 = require("tsoa");
const user_1 = __importDefault(require("../models/user"));
const logger_1 = __importDefault(require("../utils/logger"));
const jwt_1 = require("../utils/jwt");
let AuthController = class AuthController extends tsoa_1.Controller {
    async login(body, notFoundUser, loginFailed) {
        try {
            const user = await user_1.default.findOne({ email: body.email });
            if (!user) {
                return notFoundUser(401, {
                    error: `User with email: ${body.email} not found`,
                });
            }
            const passwordMatch = await user.comparePassword(body.password);
            if (!passwordMatch) {
                return notFoundUser(401, {
                    error: `Password mismatch!`,
                });
            }
            const token = (0, jwt_1.generateToken)(user);
            return { token, userData: user };
        }
        catch (error) {
            logger_1.default.error(error);
            return loginFailed(422, { error: error.message });
        }
    }
    async verifyLogin(notVerifiedToken, notFoundUser, req) {
        try {
            console.log("verify-user", req.user);
            if (!req.user) {
                throw notFoundUser(404, { error: "User not found" });
            }
            return req.user;
        }
        catch (error) {
            throw notVerifiedToken(422, { error: "Token is not verified" });
        }
    }
    async getAllUsers(fetchError, notRightAccess, req) {
        const user = req.user;
        if (!user || !user.isAdmin) {
            throw notRightAccess(403, { error: "Do not have access" });
        }
        try {
            return await user_1.default.find().select("-__v");
        }
        catch (error) {
            logger_1.default.error(error);
            return fetchError(422, { error: error.message });
        }
    }
    async register(body, registrationFailed, notRightAccess, req) {
        const user = req.user;
        if (!user || !user.isAdmin) {
            throw notRightAccess(403, { error: "Do not have access" });
        }
        try {
            const newUser = new user_1.default(body);
            await newUser.save();
            return newUser;
        }
        catch (error) {
            logger_1.default.error(error);
            return registrationFailed(422, { error: error.message });
        }
    }
    async deleteUser(body, deletionFailed, notRightAccess, req) {
        const user = req.user;
        if (!user || !user.isAdmin) {
            throw notRightAccess(403, { error: "Do not have access" });
        }
        try {
            await user_1.default.findByIdAndDelete(body._id);
            return { message: "User deleted" };
        }
        catch (error) {
            logger_1.default.error(error);
            return deletionFailed(422, { error: error.message });
        }
    }
    async editUser(body, editFailed, notRightAccess, req) {
        const user = req.user;
        if (!user || !user.isAdmin) {
            throw notRightAccess(403, { error: "Do not have access" });
        }
        try {
            const editUser = await user_1.default.findByIdAndUpdate(body._id, body, {
                new: true,
            });
            if (!editUser) {
                return editFailed(422, { error: "User not found" });
            }
            return editUser;
        }
        catch (error) {
            logger_1.default.error(error);
            return editFailed(422, { error: error.message });
        }
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, tsoa_1.Post)("login"),
    __param(0, (0, tsoa_1.Body)()),
    __param(1, (0, tsoa_1.Res)()),
    __param(2, (0, tsoa_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Function, Function]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, tsoa_1.Get)("verify-login"),
    (0, tsoa_1.Security)("jwt-passport"),
    __param(0, (0, tsoa_1.Res)()),
    __param(1, (0, tsoa_1.Res)()),
    __param(2, (0, tsoa_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function, Function, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyLogin", null);
__decorate([
    (0, tsoa_1.Get)("all"),
    (0, tsoa_1.Security)("jwt-passport"),
    __param(0, (0, tsoa_1.Res)()),
    __param(1, (0, tsoa_1.Res)()),
    __param(2, (0, tsoa_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function, Function, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getAllUsers", null);
__decorate([
    (0, tsoa_1.Post)("register"),
    (0, tsoa_1.Security)("jwt-passport"),
    __param(0, (0, tsoa_1.Body)()),
    __param(1, (0, tsoa_1.Res)()),
    __param(2, (0, tsoa_1.Res)()),
    __param(3, (0, tsoa_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Function, Function, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, tsoa_1.Delete)("delete"),
    (0, tsoa_1.Security)("jwt-passport"),
    __param(0, (0, tsoa_1.Body)()),
    __param(1, (0, tsoa_1.Res)()),
    __param(2, (0, tsoa_1.Res)()),
    __param(3, (0, tsoa_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Function, Function, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "deleteUser", null);
__decorate([
    (0, tsoa_1.Patch)("edit"),
    (0, tsoa_1.Security)("jwt-passport"),
    __param(0, (0, tsoa_1.Body)()),
    __param(1, (0, tsoa_1.Res)()),
    __param(2, (0, tsoa_1.Res)()),
    __param(3, (0, tsoa_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Function, Function, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "editUser", null);
exports.AuthController = AuthController = __decorate([
    (0, tsoa_1.Route)("user"),
    (0, tsoa_1.Tags)("user")
], AuthController);
//# sourceMappingURL=user.controller.js.map