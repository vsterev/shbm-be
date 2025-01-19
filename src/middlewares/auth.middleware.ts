import { Request, Response, NextFunction } from "express";
import envVariables from "../config/envVariables";
import jwt from "jsonwebtoken";
// import { Request, Response, NextFunction } from "express";
// import passport from "../config/passport.config";

// export const jwtAuthMiddleware = (
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ) => {
//   if (
//     req.path === "/api/v1/auth/login" ||
//     req.path === "/api/v1/auth/logout" ||
//     req.path === "/api/v1/auth/refresh-session"
//   ) {
//     return next();
//   }
//   return passport.authenticate("jwt", { session: false })(req, res, next);
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
