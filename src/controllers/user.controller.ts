import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Request,
  Res,
  Route,
  Security,
  Tags,
  TsoaResponse,
} from "tsoa";
import userModel from "../models/user";
import logger from "../utils/logger";
import { generateToken } from "../utils/jwt";
import { IUser, IUserToken } from "../interfaces/user.interface";
import { Request as ExpressRequest } from "express";

@Route("user")
@Tags("user")
export class AuthController extends Controller {
  @Post("login")
  public async login(
    @Body()
    body: {
      email: string;
      password: string;
    },
    @Res() notFoundUser: TsoaResponse<401, { error: string }>,
    @Res() loginFailed: TsoaResponse<422, { error: string }>,
  ): Promise<{ token: string; userData: IUserToken }> {
    try {
      const user = await userModel.findOne({ email: body.email });
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

      const token = generateToken(user._id);
      return {
        token,
        userData: {
          name: user.name,
          email: user.email,
          _id: user._id,
          isAdmin: user.isAdmin,
        },
      };
    } catch (error) {
      logger.error(error);
      return loginFailed(422, { error: (error as Error).message });
    }
  }

  @Get("verify")
  @Security("jwt-passport")
  public async verifyLogin(
    // @Header("Authorization") token: string,
    @Res() notVerifiedToken: TsoaResponse<422, { error: string }>,
    @Res() notFoundUser: TsoaResponse<404, { error: string }>,
    @Request() req: ExpressRequest,
  ): Promise<IUserToken> {
    try {
      if (!req.user) {
        throw notFoundUser(404, { error: "User not found" });
      }
      return req.user as IUserToken;
    } catch (error) {
      logger.error(error);
      throw notVerifiedToken(422, { error: "Token is not verified" });
    }
  }

  @Get("users")
  @Security("jwt-passport")
  public async getAllUsers(
    @Res() fetchError: TsoaResponse<422, { error: string }>,
    @Res() notRightAccess: TsoaResponse<403, { error: string }>,
    @Request() req: ExpressRequest,
  ): Promise<IUser[]> {
    const user = req.user as IUser;
    if (!user || !user.isAdmin) {
      throw notRightAccess(403, { error: "Do not have access" });
    }
    try {
      return await userModel.find().select("-__v");
    } catch (error) {
      logger.error(error);
      return fetchError(422, { error: (error as Error).message });
    }
  }

  @Post()
  @Security("jwt-passport")
  public async register(
    @Body()
    body: {
      email: string;
      name: string;
      password: string;
      isAdmin: boolean;
    },
    @Res() registrationFailed: TsoaResponse<422, { error: string }>,
    @Res() notRightAccess: TsoaResponse<403, { error: string }>,
    @Request() req: ExpressRequest,
  ) {
    const user = req.user as IUser;
    if (!user || !user.isAdmin) {
      throw notRightAccess(403, { error: "Do not have access" });
    }
    try {
      const newUser = new userModel(body);
      await newUser.save();
      return newUser;
    } catch (error) {
      logger.error(error);
      return registrationFailed(422, { error: (error as Error).message });
    }
  }

  @Delete()
  @Security("jwt-passport")
  public async deleteUser(
    @Body()
    body: {
      _id: string;
    },
    @Res() deletionFailed: TsoaResponse<422, { error: string }>,
    @Res() notRightAccess: TsoaResponse<403, { error: string }>,
    @Request() req: ExpressRequest,
  ) {
    const user = req.user as IUser;
    if (!user || !user.isAdmin) {
      throw notRightAccess(403, { error: "Do not have access" });
    }
    try {
      await userModel.findByIdAndDelete(body._id);
      return { message: "User deleted" };
    } catch (error) {
      logger.error(error);
      return deletionFailed(422, { error: (error as Error).message });
    }
  }

  @Patch()
  @Security("jwt-passport")
  public async editUser(
    @Body()
    body: {
      _id: string;
      email: string;
      name?: string;
      password?: string;
      isAdmin?: boolean;
    },
    @Res() editFailed: TsoaResponse<422, { error: string }>,
    @Res() notRightAccess: TsoaResponse<403, { error: string }>,
    @Request() req: ExpressRequest,
  ) {
    const user = req.user as IUser;
    if (!user || !user.isAdmin) {
      throw notRightAccess(403, { error: "Do not have access" });
    }
    try {
      const editUser = await userModel.findByIdAndUpdate(body._id, body, {
        new: true,
      });
      if (!editUser) {
        return editFailed(422, { error: "User not found" });
      }
      return editUser;
    } catch (error) {
      logger.error(error);
      return editFailed(422, { error: (error as Error).message });
    }
  }
}
