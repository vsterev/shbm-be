import passport from "passport";
import passportJWT, { StrategyOptionsWithoutRequest } from "passport-jwt";
import envVariables from "./envVariables";
import userModel from "../models/user";
import { IUserToken } from "../interfaces/user.interface";

const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;

const jwtOptions: StrategyOptionsWithoutRequest = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("Bearer"),
  secretOrKey: envVariables.API_TOKEN_SECRET,
};

const strategy = new JwtStrategy(jwtOptions, async function (
  jwt_payload,
  done,
) {
  try {
    const user = (await userModel
      .findById(jwt_payload._id)
      .select("-password")) as IUserToken;

    if (user) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  } catch (error) {
    return done(error, false);
  }
});

passport.use("jwt-passport", strategy);

export default passport;
