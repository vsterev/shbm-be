/* tslint:disable */
/* eslint-disable */
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import type { TsoaRoute } from '@tsoa/runtime';
import {  fetchMiddlewares, ExpressTemplateService } from '@tsoa/runtime';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { AuthController } from './../src/controllers/user.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { ParserController } from './../src/controllers/parser.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { InterlookController } from './../src/controllers/interlook.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { HotelController } from './../src/controllers/hotel.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { BookingController } from './../src/controllers/booking.controller';
import { expressAuthentication } from './../src/middlewares/auth-passport.middleware';
// @ts-ignore - no great way to install types from subpackage
import type { Request as ExRequest, Response as ExResponse, RequestHandler, Router } from 'express';

const expressAuthenticationRecasted = expressAuthentication as (req: ExRequest, securityName: string, scopes?: string[], res?: ExResponse) => Promise<any>;


// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

const models: TsoaRoute.Models = {
    "IUserToken": {
        "dataType": "refObject",
        "properties": {
            "_id": {"dataType":"string","required":true},
            "email": {"dataType":"string","required":true},
            "name": {"dataType":"string","required":true},
            "isAdmin": {"dataType":"boolean","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IUser": {
        "dataType": "refObject",
        "properties": {
            "_id": {"dataType":"string","required":true},
            "email": {"dataType":"string","required":true},
            "name": {"dataType":"string","required":true},
            "password": {"dataType":"string","required":true},
            "isAdmin": {"dataType":"boolean","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IParsingHotelResponse": {
        "dataType": "refObject",
        "properties": {
            "Hotel": {"dataType":"string","required":true},
            "HotelID": {"dataType":"double","required":true},
            "HotelServer": {"dataType":"string","required":true},
            "PMS_ServerID": {"dataType":"double","required":true},
            "ServerName": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IMessage": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "sender": {"dataType":"string"},
            "isRead": {"dataType":"boolean","required":true},
            "text": {"dataType":"string","required":true},
            "isOutgoing": {"dataType":"boolean","required":true},
            "dateCreate": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IParserBooking": {
        "dataType": "refObject",
        "properties": {
            "Hotel": {"dataType":"string","required":true},
            "RoomType": {"dataType":"string","required":true},
            "CheckIn": {"dataType":"string","required":true},
            "CheckOut": {"dataType":"string","required":true},
            "Booked": {"dataType":"string","required":true},
            "Voucher": {"dataType":"string","required":true},
            "Board": {"dataType":"string","required":true},
            "Market": {"dataType":"string","required":true},
            "Remark": {"dataType":"string"},
            "Status": {"dataType":"string","required":true},
            "Comments": {"dataType":"string"},
            "Flight_Arr": {"dataType":"string"},
            "Flight_Arr_Time": {"dataType":"string"},
            "Flight_Dep": {"dataType":"string"},
            "Flight_Dep_Time": {"dataType":"string"},
            "Names": {"dataType":"array","array":{"dataType":"nestedObjectLiteral","nestedProperties":{"birthDate":{"dataType":"string"},"name":{"dataType":"string","required":true}}},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IParserBookingResponse": {
        "dataType": "refObject",
        "properties": {
            "Adults": {"dataType":"double","required":true},
            "Age1": {"dataType":"double","required":true},
            "Age2": {"dataType":"double"},
            "Age3": {"dataType":"double"},
            "Age4": {"dataType":"double"},
            "Age5": {"dataType":"double"},
            "Age6": {"dataType":"double"},
            "Age7": {"dataType":"double"},
            "Board": {"dataType":"string","required":true},
            "CheckIn": {"dataType":"string","required":true},
            "CheckOut": {"dataType":"string","required":true},
            "Children": {"dataType":"double","required":true},
            "ConfirmationNo": {"dataType":"string","required":true},
            "Hotel": {"dataType":"string","required":true},
            "Name1": {"dataType":"string","required":true},
            "Name2": {"dataType":"string"},
            "Name3": {"dataType":"string"},
            "Name4": {"dataType":"string"},
            "Name5": {"dataType":"string"},
            "Name6": {"dataType":"string"},
            "Name7": {"dataType":"string"},
            "PriceAmount": {"dataType":"double","required":true},
            "PriceCurrency": {"dataType":"string","required":true},
            "ResponseText": {"dataType":"string","required":true},
            "ResvID": {"dataType":"double","required":true},
            "RoomType": {"dataType":"string","required":true},
            "Vocher": {"dataType":"string","required":true},
            "isCancelled": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ITourist": {
        "dataType": "refObject",
        "properties": {
            "name": {"dataType":"string","required":true},
            "birthDate": {"dataType":"string"},
            "sex": {"dataType":"string"},
            "hotelServiceId": {"dataType":"double"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IHotelServiceBooking": {
        "dataType": "refObject",
        "properties": {
            "serviceId": {"dataType":"double","required":true},
            "serviceName": {"dataType":"string","required":true},
            "bookingCode": {"dataType":"string","required":true},
            "hotelId": {"dataType":"double","required":true},
            "hotel": {"dataType":"string","required":true},
            "pansionId": {"dataType":"double","required":true},
            "pansion": {"dataType":"string","required":true},
            "roomTypeId": {"dataType":"double","required":true},
            "roomType": {"dataType":"string","required":true},
            "roomMapCode": {"dataType":"string","required":true},
            "roomAccommodationId": {"dataType":"double","required":true},
            "roomAccommodation": {"dataType":"string","required":true},
            "roomCategoryId": {"dataType":"double","required":true},
            "roomCategory": {"dataType":"string","required":true},
            "confirmationNumber": {"dataType":"string","required":true},
            "checkIn": {"dataType":"string","required":true},
            "checkOut": {"dataType":"string","required":true},
            "status": {"dataType":"string","required":true},
            "note": {"dataType":"string","required":true},
            "tourists": {"dataType":"array","array":{"dataType":"refObject","ref":"ITourist"},"required":true},
            "priceRemark": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IFlight": {
        "dataType": "refObject",
        "properties": {
            "flightArr": {"dataType":"string","required":true},
            "flightDep": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IBooking": {
        "dataType": "refObject",
        "properties": {
            "_id": {"dataType":"string"},
            "bookingName": {"dataType":"string","required":true},
            "bookingId": {"dataType":"double","required":true},
            "action": {"dataType":"string","required":true},
            "creationDate": {"dataType":"string"},
            "cancelDate": {"dataType":"string"},
            "changeDate": {"dataType":"string"},
            "marketId": {"dataType":"double","required":true},
            "marketName": {"dataType":"string","required":true},
            "messages": {"dataType":"array","array":{"dataType":"refObject","ref":"IMessage"},"required":true},
            "parser": {"dataType":"nestedObjectLiteral","nestedProperties":{"manual":{"dataType":"nestedObjectLiteral","nestedProperties":{},"additionalProperties":{"dataType":"nestedObjectLiteral","nestedProperties":{"message":{"dataType":"string","required":true},"booking":{"dataType":"string","required":true}}},"required":true},"response":{"ref":"IParserBookingResponse","required":true},"send":{"ref":"IParserBooking","required":true}}},
            "hotelService": {"ref":"IHotelServiceBooking"},
            "hotelServices": {"dataType":"array","array":{"dataType":"refObject","ref":"IHotelServiceBooking"},"required":true},
            "flightInfo": {"ref":"IFlight"},
            "dateInputed": {"dataType":"datetime"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IBoard": {
        "dataType": "refObject",
        "properties": {
            "boardId": {"dataType":"double","required":true},
            "boardName": {"dataType":"string","required":true},
            "parserCode": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IRoom": {
        "dataType": "refObject",
        "properties": {
            "roomTypeId": {"dataType":"double","required":true},
            "roomTypeName": {"dataType":"string","required":true},
            "roomCategoryId": {"dataType":"double","required":true},
            "roomCategoryName": {"dataType":"string","required":true},
            "parserCode": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IHotelMap": {
        "dataType": "refObject",
        "properties": {
            "_id": {"dataType":"double","required":true},
            "hotelId": {"dataType":"double","required":true},
            "hotelName": {"dataType":"string","required":true},
            "hotelCode": {"dataType":"string"},
            "cityId": {"dataType":"double","required":true},
            "cityName": {"dataType":"string","required":true},
            "boards": {"dataType":"nestedObjectLiteral","nestedProperties":{},"additionalProperties":{"ref":"IBoard"},"required":true},
            "rooms": {"dataType":"nestedObjectLiteral","nestedProperties":{},"additionalProperties":{"ref":"IRoom"},"required":true},
            "parserCode": {"dataType":"double"},
            "parserName": {"dataType":"string"},
            "parserHotelServer": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IHotel": {
        "dataType": "refObject",
        "properties": {
            "_id": {"dataType":"double","required":true},
            "name": {"dataType":"string","required":true},
            "resort": {"dataType":"string","required":true},
            "code": {"dataType":"string","required":true},
            "category": {"dataType":"string","required":true},
            "regionId": {"dataType":"double","required":true},
            "resortId": {"dataType":"double","required":true},
            "parserCode": {"dataType":"double"},
            "parserName": {"dataType":"string"},
            "parserHotelServer": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
};
const templateService = new ExpressTemplateService(models, {"noImplicitAdditionalProperties":"throw-on-extras","bodyCoercion":true});

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa




export function RegisterRoutes(app: Router) {

    // ###########################################################################################################
    //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
    //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
    // ###########################################################################################################


    
        app.post('/api/v1/user/login',
            ...(fetchMiddlewares<RequestHandler>(AuthController)),
            ...(fetchMiddlewares<RequestHandler>(AuthController.prototype.login)),

            async function AuthController_login(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    body: {"in":"body","name":"body","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"password":{"dataType":"string","required":true},"email":{"dataType":"string","required":true}}},
                    notFoundUser: {"in":"res","name":"401","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"error":{"dataType":"string","required":true}}},
                    loginFailed: {"in":"res","name":"422","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"error":{"dataType":"string","required":true}}},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new AuthController();

              await templateService.apiHandler({
                methodName: 'login',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/v1/user/verify',
            authenticateMiddleware([{"jwt-passport":[]}]),
            ...(fetchMiddlewares<RequestHandler>(AuthController)),
            ...(fetchMiddlewares<RequestHandler>(AuthController.prototype.verifyLogin)),

            async function AuthController_verifyLogin(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    notVerifiedToken: {"in":"res","name":"422","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"error":{"dataType":"string","required":true}}},
                    notFoundUser: {"in":"res","name":"404","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"error":{"dataType":"string","required":true}}},
                    req: {"in":"request","name":"req","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new AuthController();

              await templateService.apiHandler({
                methodName: 'verifyLogin',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/v1/user/users',
            authenticateMiddleware([{"jwt-passport":[]}]),
            ...(fetchMiddlewares<RequestHandler>(AuthController)),
            ...(fetchMiddlewares<RequestHandler>(AuthController.prototype.getAllUsers)),

            async function AuthController_getAllUsers(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    fetchError: {"in":"res","name":"422","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"error":{"dataType":"string","required":true}}},
                    notRightAccess: {"in":"res","name":"403","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"error":{"dataType":"string","required":true}}},
                    req: {"in":"request","name":"req","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new AuthController();

              await templateService.apiHandler({
                methodName: 'getAllUsers',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/api/v1/user',
            authenticateMiddleware([{"jwt-passport":[]}]),
            ...(fetchMiddlewares<RequestHandler>(AuthController)),
            ...(fetchMiddlewares<RequestHandler>(AuthController.prototype.register)),

            async function AuthController_register(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    body: {"in":"body","name":"body","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"isAdmin":{"dataType":"boolean","required":true},"password":{"dataType":"string","required":true},"name":{"dataType":"string","required":true},"email":{"dataType":"string","required":true}}},
                    registrationFailed: {"in":"res","name":"422","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"error":{"dataType":"string","required":true}}},
                    notRightAccess: {"in":"res","name":"403","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"error":{"dataType":"string","required":true}}},
                    req: {"in":"request","name":"req","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new AuthController();

              await templateService.apiHandler({
                methodName: 'register',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.delete('/api/v1/user',
            authenticateMiddleware([{"jwt-passport":[]}]),
            ...(fetchMiddlewares<RequestHandler>(AuthController)),
            ...(fetchMiddlewares<RequestHandler>(AuthController.prototype.deleteUser)),

            async function AuthController_deleteUser(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    body: {"in":"body","name":"body","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"_id":{"dataType":"string","required":true}}},
                    deletionFailed: {"in":"res","name":"422","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"error":{"dataType":"string","required":true}}},
                    notRightAccess: {"in":"res","name":"403","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"error":{"dataType":"string","required":true}}},
                    req: {"in":"request","name":"req","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new AuthController();

              await templateService.apiHandler({
                methodName: 'deleteUser',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.patch('/api/v1/user',
            authenticateMiddleware([{"jwt-passport":[]}]),
            ...(fetchMiddlewares<RequestHandler>(AuthController)),
            ...(fetchMiddlewares<RequestHandler>(AuthController.prototype.editUser)),

            async function AuthController_editUser(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    body: {"in":"body","name":"body","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"isAdmin":{"dataType":"boolean"},"password":{"dataType":"string"},"name":{"dataType":"string"},"email":{"dataType":"string","required":true},"_id":{"dataType":"string","required":true}}},
                    editFailed: {"in":"res","name":"422","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"error":{"dataType":"string","required":true}}},
                    notRightAccess: {"in":"res","name":"403","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"error":{"dataType":"string","required":true}}},
                    req: {"in":"request","name":"req","required":true,"dataType":"object"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new AuthController();

              await templateService.apiHandler({
                methodName: 'editUser',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/v1/parser/hotels-compare',
            authenticateMiddleware([{"jwt-passport":[]}]),
            ...(fetchMiddlewares<RequestHandler>(ParserController)),
            ...(fetchMiddlewares<RequestHandler>(ParserController.prototype.hotelCompare)),

            async function ParserController_hotelCompare(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new ParserController();

              await templateService.apiHandler({
                methodName: 'hotelCompare',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/api/v1/parser/hotel-props',
            authenticateMiddleware([{"jwt-passport":[]}]),
            ...(fetchMiddlewares<RequestHandler>(ParserController)),
            ...(fetchMiddlewares<RequestHandler>(ParserController.prototype.getHotelProps)),

            async function ParserController_getHotelProps(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    body: {"in":"body","name":"body","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"parserCode":{"dataType":"double","required":true}}},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new ParserController();

              await templateService.apiHandler({
                methodName: 'getHotelProps',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/api/v1/parser/reports',
            authenticateMiddleware([{"jwt-passport":[]}]),
            ...(fetchMiddlewares<RequestHandler>(ParserController)),
            ...(fetchMiddlewares<RequestHandler>(ParserController.prototype.getReports)),

            async function ParserController_getReports(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    body: {"in":"body","name":"body","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"limit":{"dataType":"double"},"skip":{"dataType":"double"}}},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new ParserController();

              await templateService.apiHandler({
                methodName: 'getReports',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/v1/il/get-cities',
            authenticateMiddleware([{"jwt-passport":[]}]),
            ...(fetchMiddlewares<RequestHandler>(InterlookController)),
            ...(fetchMiddlewares<RequestHandler>(InterlookController.prototype.getCities)),

            async function InterlookController_getCities(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new InterlookController();

              await templateService.apiHandler({
                methodName: 'getCities',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/api/v1/il/get-bookings',
            authenticateMiddleware([{"jwt-passport":[]}]),
            ...(fetchMiddlewares<RequestHandler>(InterlookController)),
            ...(fetchMiddlewares<RequestHandler>(InterlookController.prototype.getBookings)),

            async function InterlookController_getBookings(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    body: {"in":"body","name":"body","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"next":{"dataType":"boolean","required":true},"action":{"dataType":"union","subSchemas":[{"dataType":"enum","enums":["new"]},{"dataType":"enum","enums":["change"]},{"dataType":"enum","enums":["cancel"]}],"required":true}}},
                    syncFailed: {"in":"res","name":"422","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"error":{"dataType":"string","required":true}}},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new InterlookController();

              await templateService.apiHandler({
                methodName: 'getBookings',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/api/v1/il/send-bookings',
            authenticateMiddleware([{"jwt-passport":[]}]),
            ...(fetchMiddlewares<RequestHandler>(InterlookController)),
            ...(fetchMiddlewares<RequestHandler>(InterlookController.prototype.sendBookings)),

            async function InterlookController_sendBookings(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    body: {"in":"body","name":"body","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"bookings":{"dataType":"array","array":{"dataType":"refObject","ref":"IBooking"},"required":true}}},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new InterlookController();

              await templateService.apiHandler({
                methodName: 'sendBookings',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/v1/hotels/mapping-variants',
            authenticateMiddleware([{"jwt-passport":[]}]),
            ...(fetchMiddlewares<RequestHandler>(HotelController)),
            ...(fetchMiddlewares<RequestHandler>(HotelController.prototype.getVariants)),

            async function HotelController_getVariants(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    query: {"in":"queries","name":"query","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"ilCode":{"dataType":"double","required":true},"parserCode":{"dataType":"double"}}},
                    notFoundRes: {"in":"res","name":"404","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"error":{"dataType":"string","required":true}}},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new HotelController();

              await templateService.apiHandler({
                methodName: 'getVariants',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/v1/hotels/mapped',
            authenticateMiddleware([{"jwt-passport":[]}]),
            ...(fetchMiddlewares<RequestHandler>(HotelController)),
            ...(fetchMiddlewares<RequestHandler>(HotelController.prototype.getAllMapped)),

            async function HotelController_getAllMapped(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new HotelController();

              await templateService.apiHandler({
                methodName: 'getAllMapped',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/api/v1/hotels/mapping-variants',
            authenticateMiddleware([{"jwt-passport":[]}]),
            ...(fetchMiddlewares<RequestHandler>(HotelController)),
            ...(fetchMiddlewares<RequestHandler>(HotelController.prototype.createHotelVariant)),

            async function HotelController_createHotelVariant(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    body: {"in":"body","name":"body","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"checkOut":{"dataType":"string","required":true},"checkIn":{"dataType":"string","required":true},"ilCode":{"dataType":"double","required":true}}},
                    notFoundRes: {"in":"res","name":"404","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"error":{"dataType":"string","required":true}}},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new HotelController();

              await templateService.apiHandler({
                methodName: 'createHotelVariant',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/v1/hotels',
            authenticateMiddleware([{"jwt-passport":[]}]),
            ...(fetchMiddlewares<RequestHandler>(HotelController)),
            ...(fetchMiddlewares<RequestHandler>(HotelController.prototype.findHotelByname)),

            async function HotelController_findHotelByname(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    hotelName: {"in":"query","name":"hotelName","required":true,"dataType":"string"},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new HotelController();

              await templateService.apiHandler({
                methodName: 'findHotelByname',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.patch('/api/v1/hotels',
            authenticateMiddleware([{"jwt-passport":[]}]),
            ...(fetchMiddlewares<RequestHandler>(HotelController)),
            ...(fetchMiddlewares<RequestHandler>(HotelController.prototype.hotelMap)),

            async function HotelController_hotelMap(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    body: {"in":"body","name":"body","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"hotelId":{"dataType":"double","required":true},"parserCode":{"dataType":"double","required":true}}},
                    notFoundRes: {"in":"res","name":"404","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"error":{"dataType":"string","required":true}}},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new HotelController();

              await templateService.apiHandler({
                methodName: 'hotelMap',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.patch('/api/v1/hotels/mapping-variants',
            authenticateMiddleware([{"jwt-passport":[]}]),
            ...(fetchMiddlewares<RequestHandler>(HotelController)),
            ...(fetchMiddlewares<RequestHandler>(HotelController.prototype.hotelMapProperties)),

            async function HotelController_hotelMapProperties(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    body: {"in":"body","name":"body","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"hotelId":{"dataType":"double","required":true},"rooms":{"dataType":"any","required":true},"boards":{"dataType":"any","required":true}}},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new HotelController();

              await templateService.apiHandler({
                methodName: 'hotelMapProperties',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.delete('/api/v1/hotels/mapping-variants',
            authenticateMiddleware([{"jwt-passport":[]}]),
            ...(fetchMiddlewares<RequestHandler>(HotelController)),
            ...(fetchMiddlewares<RequestHandler>(HotelController.prototype.deleteHotelMap)),

            async function HotelController_deleteHotelMap(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    body: {"in":"body","name":"body","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"hotelId":{"dataType":"double","required":true}}},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new HotelController();

              await templateService.apiHandler({
                methodName: 'deleteHotelMap',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/v1/bookings',
            authenticateMiddleware([{"jwt-passport":[]}]),
            ...(fetchMiddlewares<RequestHandler>(BookingController)),
            ...(fetchMiddlewares<RequestHandler>(BookingController.prototype.getAllBooking)),

            async function BookingController_getAllBooking(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    query: {"in":"queries","name":"query","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"skip":{"dataType":"double","required":true},"limit":{"dataType":"double","required":true},"isByDate":{"dataType":"union","subSchemas":[{"dataType":"enum","enums":["yes"]},{"dataType":"enum","enums":["no"]}],"required":true},"booking":{"dataType":"string","required":true},"dateTo":{"dataType":"string","required":true},"dateFrom":{"dataType":"string","required":true}}},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new BookingController();

              await templateService.apiHandler({
                methodName: 'getAllBooking',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.get('/api/v1/bookings/length',
            authenticateMiddleware([{"jwt-passport":[]}]),
            ...(fetchMiddlewares<RequestHandler>(BookingController)),
            ...(fetchMiddlewares<RequestHandler>(BookingController.prototype.getLength)),

            async function BookingController_getLength(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    query: {"in":"queries","name":"query","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"skip":{"dataType":"double"},"limit":{"dataType":"double"},"isByDate":{"dataType":"union","subSchemas":[{"dataType":"enum","enums":["yes"]},{"dataType":"enum","enums":["no"]}],"required":true},"booking":{"dataType":"string","required":true},"dateTo":{"dataType":"string","required":true},"dateFrom":{"dataType":"string","required":true}}},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new BookingController();

              await templateService.apiHandler({
                methodName: 'getLength',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/api/v1/bookings/confirm',
            ...(fetchMiddlewares<RequestHandler>(BookingController)),
            ...(fetchMiddlewares<RequestHandler>(BookingController.prototype.confirmBooking)),

            async function BookingController_confirmBooking(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    body: {"in":"body","name":"body","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"message":{"dataType":"string","required":true},"confirmationNumber":{"dataType":"string","required":true},"booking":{"dataType":"string","required":true}}},
                    notFoundRes: {"in":"res","name":"404","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"error":{"dataType":"string","required":true}}},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new BookingController();

              await templateService.apiHandler({
                methodName: 'confirmBooking',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        app.post('/api/v1/bookings/deny',
            ...(fetchMiddlewares<RequestHandler>(BookingController)),
            ...(fetchMiddlewares<RequestHandler>(BookingController.prototype.denyBooking)),

            async function BookingController_denyBooking(request: ExRequest, response: ExResponse, next: any) {
            const args: Record<string, TsoaRoute.ParameterSchema> = {
                    body: {"in":"body","name":"body","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"message":{"dataType":"string","required":true},"booking":{"dataType":"string","required":true}}},
                    notFoundRes: {"in":"res","name":"404","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"error":{"dataType":"string","required":true}}},
            };

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args, request, response });

                const controller = new BookingController();

              await templateService.apiHandler({
                methodName: 'denyBooking',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa


    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    function authenticateMiddleware(security: TsoaRoute.Security[] = []) {
        return async function runAuthenticationMiddleware(request: any, response: any, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            // keep track of failed auth attempts so we can hand back the most
            // recent one.  This behavior was previously existing so preserving it
            // here
            const failedAttempts: any[] = [];
            const pushAndRethrow = (error: any) => {
                failedAttempts.push(error);
                throw error;
            };

            const secMethodOrPromises: Promise<any>[] = [];
            for (const secMethod of security) {
                if (Object.keys(secMethod).length > 1) {
                    const secMethodAndPromises: Promise<any>[] = [];

                    for (const name in secMethod) {
                        secMethodAndPromises.push(
                            expressAuthenticationRecasted(request, name, secMethod[name], response)
                                .catch(pushAndRethrow)
                        );
                    }

                    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

                    secMethodOrPromises.push(Promise.all(secMethodAndPromises)
                        .then(users => { return users[0]; }));
                } else {
                    for (const name in secMethod) {
                        secMethodOrPromises.push(
                            expressAuthenticationRecasted(request, name, secMethod[name], response)
                                .catch(pushAndRethrow)
                        );
                    }
                }
            }

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            try {
                request['user'] = await Promise.any(secMethodOrPromises);

                // Response was sent in middleware, abort
                if (response.writableEnded) {
                    return;
                }

                next();
            }
            catch(err) {
                // Show most recent error as response
                const error = failedAttempts.pop();
                error.status = error.status || 401;

                // Response was sent in middleware, abort
                if (response.writableEnded) {
                    return;
                }
                next(error);
            }

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        }
    }

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
}

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
