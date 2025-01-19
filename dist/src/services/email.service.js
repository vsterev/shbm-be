"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const envVariables_1 = __importDefault(require("../config/envVariables"));
const logger_1 = __importDefault(require("../utils/logger"));
class EmailService {
    static async sendEmail({ type, booking, hotel, }) {
        const emailing = nodemailer_1.default.createTransport({
            host: envVariables_1.default.MAIL_HOST,
            port: Number(envVariables_1.default.MAIL_PORT),
            secure: false,
            auth: {
                user: envVariables_1.default.MAIL_USER,
                pass: envVariables_1.default.MAIL_PASS,
            },
        });
        const message = {
            from: envVariables_1.default.MAIL_USER,
            to: ["vasil@solvex.bg"],
            subject: this.getTemplate(type, booking, hotel).subject,
            html: this.getTemplate(type, booking, hotel).content,
        };
        await emailing.sendMail(message);
        logger_1.default.info(`Mail send subject ${this.getTemplate(type, booking, hotel).content}}`);
    }
    static getTemplate(type, booking, hotel) {
        let subjectStr = "";
        let contentStr = "";
        switch (type) {
            case "error":
                subjectStr = `HBS - error mapping booking ${booking}`;
                contentStr = `Mapping error -> accommodation and boards are not mapped to hotel <b>${hotel}</b> in booking <b>${booking}</b>.
         <br>The reservations can not to be sent to "Hotel Parser" system, please check and correct the mappings of hotel <b>${hotel}</b> !<br>Hotel Booking System !`;
                break;
            case "cancelation":
                subjectStr = `HBS - booking CANCELATION ${booking}`;
                contentStr = `The Booking <b>${booking}</b> ${!!hotel && `for hotel ${hotel} are`} are <b>CANCELED</b> from Hotel Parser System!<br> Hotel Booking System !`;
                break;
            case "rejected":
                subjectStr = `HBS - booking NOT CONFIRMED ${booking}`;
                contentStr = `The Booking <b>${booking}</b> ${!!hotel && `for hotel ${hotel} are`} are <b>NOT CONFIRMED</b> from Hotel Parser System!<br> Hotel Booking System. Status in IL will not be change !`;
                break;
            case "notConfirmed":
                subjectStr = `HBS - booking Not Confirmes${booking}`;
                contentStr = `The Booking <b>${booking}</b> ${!!hotel && `for hotel ${hotel} are`} are <b>DENIED</b> from Hotel Parser System!<br> Hotel Booking System. Status in IL will be change to "Not Confirmed" !`;
                break;
            case "denied":
                subjectStr = `HBS - booking DENIED${booking}`;
                contentStr = `The Booking <b>${booking}</b> ${!!hotel && `for hotel ${hotel} are`} are <b>DENIED</b> from Hotel Parser System!<br> Hotel Booking System. Status in IL will be change to "Wait !`;
                break;
        }
        return { subject: subjectStr, content: contentStr };
    }
}
exports.default = EmailService;
//# sourceMappingURL=email.service.js.map