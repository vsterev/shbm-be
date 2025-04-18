import { Request } from "express";
import passport from "../config/passport.config";
import { IUser, IUserToken } from "../interfaces/user.interface";

// export const jwtPassportMiddleware = (
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ) => {
//   passport.authenticate(
//     "jwt-passport",
//     { session: false },
//     (err: Error, user: any) => {
//       if (err || !user) {
//         console.log("tuk");
//         return res.status(401).json({ message: "Unauthorized111" });
//       }
//       req.user = user; // Attach authenticated user to the request
//       next();
//     },
//   )(req, res, next);

export function expressAuthentication(
  request: Request,
  securityName: string,
): Promise<IUserToken | void> {
  if (securityName === "jwt-passport") {
    return new Promise((resolve, reject) => {
      passport.authenticate(
        "jwt-passport",
        { session: false },
        (err: Error, user: IUser) => {
          if (err || !user) {
            reject(err || new Error("User not authenticated"));
          } else {
            resolve(user);
            request.user = user;
          }
        },
      )(request);
    });
  }
  if (securityName === "api-token") {
    return new Promise<void>((resolve, reject) => {
      passport.authenticate(
        "api-token",
        { session: false },
        (err: Error) => {
          if (err) {
            reject(err || new Error(" Not authenticated"));
          } else {
            resolve();
          }
        },
      )(request);
    });
  }
  return Promise.reject(new Error("Unknown security name"));
}

// if (
//   req.path === "/api/v1/auth/login" ||
//   req.path === "/api/v1/auth/logout" ||
//   req.path === "/api/v1/auth/refresh-session"
// ) {
//   return next();
// }
// return passport.authenticate("jwt", { session: false })(req, res, next);
// };
// export async function expressAuthentication(
//   request: Request,
//   securityName: string,
// ): Promise<any> {
//   if (securityName === "jwt") {
//     const token = request.headers["authorization"]?.split(" ")[1];
//     return new Promise((resolve, reject) => {
//       if (!token) {
//         const error = new Error("No token provided");
//         reject(error);
//         return;
//       }
//       jwt.verify(
//         token,
//         envVariables.API_TOKEN_SECRET,
//         async function (err: any, decoded: any) {
//           if (err) {
//             if (err instanceof jwt.TokenExpiredError) {
//               const error = new Error("Token expired");
//               reject(error);
//               return;
//             }
//             console.log(err);
//             reject(err);
//             return;
//           } else {
//             resolve(decoded);
//           }
//         },
//       );
//     });
//   }
// }
