import passport from "passport";
import passportJWT, {
  Strategy,
  StrategyOptionsWithoutRequest,
} from "passport-jwt";
import { Strategy as BearerStrategy } from "passport-http-bearer";
import envVariables from "./envVariables";
import userModel from "../models/user";
import { IUserToken } from "../interfaces/user.interface";

const ExtractJwt = passportJWT.ExtractJwt;

const jwtOptions: StrategyOptionsWithoutRequest = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("Bearer"),
  secretOrKey: envVariables.API_TOKEN_SECRET,
};

const jwtStrategy = new Strategy(jwtOptions, async function (
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

// Bearer Token Strategy
const bearerStrategy = new BearerStrategy(async (token, done) => {
  try {
    if (token === envVariables.API_TOKEN) {
      return done(null, "api");
    } else {
      return done(null, false);
    }
  } catch (error) {
    return done(error, false);
  }
});

passport.use("jwt-passport", jwtStrategy);
passport.use("api-token", bearerStrategy);

export default passport;
