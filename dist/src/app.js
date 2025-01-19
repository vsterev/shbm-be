"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importStar(require("express"));
const routes_1 = require("../build/routes");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const path_1 = __importDefault(require("path"));
const error_middleware_1 = __importDefault(require("./middlewares/error.middleware"));
const envVariables_1 = __importDefault(require("./config/envVariables"));
const logger_1 = __importDefault(require("./utils/logger"));
const db_1 = __importDefault(require("./config/db"));
exports.app = (0, express_1.default)();
const mongoose_1 = __importDefault(require("mongoose"));
const cron_1 = __importDefault(require("./config/cron"));
// import { expressAuthentication } from "./middlewares/auth-passport.middleware";
const passport_1 = __importDefault(require("passport"));
const morgan_1 = __importDefault(require("morgan"));
// Use body parser to read sent json payloads
exports.app.use((0, express_1.urlencoded)({
    extended: true,
}));
exports.app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Custom-Header, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
    next();
});
exports.app.use((0, morgan_1.default)("common"));
exports.app.use(express_1.default.json());
exports.app.use(passport_1.default.initialize());
if (envVariables_1.default.NODE_ENV !== "PROD") {
    exports.app.use("/docs", swagger_ui_express_1.default.serve, async (_req, res) => {
        const swaggerDocument = await Promise.resolve(`${path_1.default.resolve(__dirname, "../build/swagger.json")}`).then(s => __importStar(require(s)));
        res.send(swagger_ui_express_1.default.generateHTML(swaggerDocument));
    });
}
// app.use(expressAuthentication);
(0, routes_1.RegisterRoutes)(exports.app);
exports.app.use((err, req, res, next) => {
    (0, error_middleware_1.default)(err, req, res, next);
});
let startedServer = null;
const server = exports.app.listen(envVariables_1.default.APP_PORT, () => {
    (0, db_1.default)()
        .then(() => {
        logger_1.default.info(`⚡️[server]: HBS Server is running at ${envVariables_1.default.APP_PORT}`);
        startedServer = server;
    })
        .catch((e) => logger_1.default.error(e));
});
const mongooseExit = () => {
    mongoose_1.default.connection.close(() => {
        console.log("Mongoose connection is disconnected due to application termination");
        process.exit(0);
    });
};
(0, cron_1.default)();
const stopServer = async () => {
    if (startedServer?.listening) {
        logger_1.default.info("Attempting to stop Express server");
        await new Promise((resolve) => startedServer &&
            startedServer.close((error) => {
                error === undefined
                    ? logger_1.default.info("Successfully stopped Express server")
                    : logger_1.default.error("Error stopping Express server", error.stack);
                startedServer = null;
                resolve();
            }));
    }
    mongooseExit();
};
["exit", "SIGINT", "SIGTERM", "SIGUSR1", "SIGUSR2"].forEach((event) => {
    process.on(event, stopServer);
});
//# sourceMappingURL=app.js.map