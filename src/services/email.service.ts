import nodemailer from "nodemailer";
import envVariables from "../config/envVariables";
import logger from "../utils/logger";

type IEmailType =
  | "error"
  | "confirmation"
  | "cancelation"
  | "rejected"
  | "notConfirmed"
  | "denied";

interface IEmail {
  booking: string;
  hotel: string;
  type: IEmailType;
}

export default class EmailService {
  public static async sendEmail({
    type,
    booking,
    hotel,
  }: IEmail): Promise<void> {
    const emailing = nodemailer.createTransport({
      host: envVariables.MAIL_HOST,
      port: Number(envVariables.MAIL_PORT),
      secure: false,
      auth: {
        user: envVariables.MAIL_USER,
        pass: envVariables.MAIL_PASS,
      },
    });

    const message = {
      from: envVariables.MAIL_USER,
      to: ["vasil@solvex.bg"],
      subject: this.getTemplate(type, booking, hotel).subject,
      html: this.getTemplate(type, booking, hotel).content,
    };

    await emailing.sendMail(message);

    logger.info(
      `Mail send subject ${this.getTemplate(type, booking, hotel).content}}`,
    );
  }
  private static getTemplate(
    type: IEmailType,
    booking: string,
    hotel: string,
  ): { subject: string; content: string } {
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
