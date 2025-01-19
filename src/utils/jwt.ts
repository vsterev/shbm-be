import jwt from "jsonwebtoken";
import envVariables from "../config/envVariables";

const JWT_SECRET = envVariables.API_TOKEN_SECRET;

function generateToken(_id: string): string {
  const payload = { _id }; // Add more fields if needed
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" }); // Set token expiry
}
// function verifyToken(token: string): Promise<IUser> {
//   return new Promise((resolve, reject) => {
//     //така се прави за да върне промис   стандартната функция
//     jwt.verify(token, JWT_SECRET, async (err, data) => {
//       if (err) {
//         reject(err);
//         return;
//       }
//       resolve(data as IUser);
//     });
//   });
// }
export { generateToken };
