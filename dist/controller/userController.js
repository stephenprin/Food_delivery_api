"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserProfile = exports.getSingleUser = exports.getAllUser = exports.resendOTP = exports.Login = exports.VerifyUser = exports.Register = void 0;
const utility_1 = require("../utils/utility");
const notification_1 = require("../utils/notification");
const userModel_1 = require("../models/userModel");
const uuid_1 = require("uuid");
const config_1 = require("../config");
const Register = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, phone, password, confirm_passwoord } = req.body;
        const iduuid = (0, uuid_1.v4)();
        //console.log(iduuid)
        const validateResult = utility_1.registerSchema.validate(req.body, utility_1.option);
        if (validateResult.error) {
            return res.status(400).json({
                Error: validateResult.error.details[0].message,
            });
        }
        //generate salt
        const salt = yield (0, utility_1.GenerateSalt)();
        const userPassword = yield (0, utility_1.GeneratePassword)(password, salt);
        //Generate otp and expiry
        const { otp, expiry } = (0, notification_1.GenerateOtp)();
        //check if user exit
        const User = yield userModel_1.UserInstance.findOne({ where: { email: email } });
        if (!User) {
            //creeate a user
            yield userModel_1.UserInstance.create({
                id: iduuid,
                email,
                password: userPassword,
                firstName: "",
                lastName: "",
                salt,
                address: "",
                phone,
                otp,
                otp_expiry: expiry,
                lng: 0,
                lat: 0,
                verified: false,
                role: ""
            });
            //send OTP to user
            yield (0, notification_1.onRequestOTP)(otp, phone);
            // send email
            const html = (0, notification_1.emailHtml)(otp);
            yield (0, notification_1.sendMail)(config_1.fromAdminMail, email, config_1.userSubject, html);
            // check if user is created
            const User = (yield userModel_1.UserInstance.findOne({
                where: { email: email },
            }));
            // //Generate Signature
            let signature = yield (0, utility_1.GenerateSignature)({
                id: User.id,
                email: User.email,
                verified: User.verified,
            });
            return res.status(201).json({
                message: "user created sucessfully",
                signature,
                verified: User.verified,
            });
        }
        return res.status(401).json({
            message: "User already created",
        });
    }
    catch (error) {
        res.status(500).json({
            Error: "Internal server error",
            route: "/user/register",
        });
    }
});
exports.Register = Register;
/**==================Verify user============================= */
const VerifyUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.params.signature;
        const decode = yield (0, utility_1.verifySignature)(token);
        //check if the user is a registereed user
        const User = (yield userModel_1.UserInstance.findOne({
            where: { email: decode.email },
        }));
        if (User) {
            const { otp } = req.body;
            if (User.otp === parseInt(otp) && User.otp_expiry >= new Date()) {
                const updatedUser = (yield userModel_1.UserInstance.update({
                    verified: true,
                }, { where: { email: decode.email } }));
                //ReGeneerate a new siignature
                let signature = yield (0, utility_1.GenerateSignature)({
                    id: updatedUser.id,
                    email: updatedUser.email,
                    verified: updatedUser.verified,
                });
                return res.status(200).json({
                    message: "You have suucessfully verified your account",
                    signature,
                    verified: User.verified,
                });
            }
        }
        return res.status(400).json({
            Error: "Token already expire",
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            Error: "Internal server Error",
            route: "/users/verify",
        });
    }
});
exports.VerifyUser = VerifyUser;
/**==================login user============================= */
const Login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const validateResult = utility_1.loginSchema.validate(req.body, utility_1.option);
        if (validateResult.error) {
            return res.status(400).json({
                Error: validateResult.error.details[0].message,
            });
        }
        //check if the user exits
        const User = (yield userModel_1.UserInstance.findOne({
            where: { email: email },
        }));
        if (User.verified === true) {
            const validation = yield (0, utility_1.validatePassword)(password, User.password, User.salt);
            if (validation) {
                //Geneerate a new siignature
                let signature = yield (0, utility_1.GenerateSignature)({
                    id: User.id,
                    email: User.email,
                    verified: User.verified,
                });
                return res.status(200).json({
                    message: "You have suucessfully logged in",
                    signature,
                    email: User.email,
                    verified: User.verified,
                    role: User.role
                });
            }
        }
        res.status(400).json({
            Error: "Wrong username or password oor not a verfied user",
        });
    }
    catch (error) {
        res.status(500).json({
            Error: "Internal server error",
            route: "/user/login",
        });
    }
});
exports.Login = Login;
/**==================Resend otp============================= */
const resendOTP = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.body.signature;
        const decode = yield (0, utility_1.verifySignature)(token);
        const User = (yield userModel_1.UserInstance.findOne({
            where: { email: decode.email },
        }));
        if (User) {
            //Generate otp and expiry
            const { otp, expiry } = (0, notification_1.GenerateOtp)();
            const updatedUser = (yield userModel_1.UserInstance.update({
                otp,
                otp_expiry: expiry,
            }, { where: { email: decode.email } }));
            if (updatedUser) {
                //send OTP to user
                yield (0, notification_1.onRequestOTP)(otp, updatedUser.phone);
                // send email
                const html = (0, notification_1.emailHtml)(otp);
                yield (0, notification_1.sendMail)(config_1.fromAdminMail, updatedUser.email, config_1.userSubject, html);
                return res.status(200).json({
                    message: "OTP resend tp phoone number and email",
                });
            }
        }
        return res.status(400).json({
            Error: "Error sending OTP"
        });
    }
    catch (error) {
        res.status(500).json({
            Error: "Internal server error",
            route: "/user/resend-otp/:signature",
        });
    }
});
exports.resendOTP = resendOTP;
/**==================USER ALLPROOFILE============================= */
const getAllUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const limit = req.query.limit;
        const users = yield userModel_1.UserInstance.findAndCountAll({
            limit: limit
        });
        return res.status(200).json({
            message: "You have successfully retrieved all users",
            Count: users.count,
            Users: users.rows
        });
    }
    catch (error) {
        res.status(500).json({
            Error: "Internal server Error",
            route: "/user/get-all-users"
        });
    }
});
exports.getAllUser = getAllUser;
/**==================SINGLE USER PROFILE============================= */
const getSingleUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.user.id;
        //find user by id
        const User = (yield userModel_1.UserInstance.findOne({
            where: { id: id },
        }));
        if (User) {
            return res.status(200).json({
                message: "You have successfully retrieved one user",
                User: User
            });
        }
    }
    catch (error) {
        res.status(500).json({
            Error: "Internal server Error",
            route: "/user/get-single-user"
        });
    }
});
exports.getSingleUser = getSingleUser;
/**==================UPDATE PROFILE============================= */
const updateUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.user.id;
        const { firstName, lastName, address, password, phone } = req.body;
        const validateResult = utility_1.updateSchema.validate(req.body, utility_1.option);
        if (validateResult.error) {
            return res.status(400).json({
                Error: validateResult.error.details[0].message,
            });
        }
        //check if the user exits
        const User = (yield userModel_1.UserInstance.findOne({
            where: { id: id },
        }));
        if (User) {
            return res.status(400).json({
                Error: "You are not authorize to update your profile"
            });
        }
        const updatedUser = (yield userModel_1.UserInstance.update({
            firstName,
            lastName,
            address,
            password,
            phone
        }, { where: { id: id } }));
        if (updatedUser) {
            const User = (yield userModel_1.UserInstance.findOne({
                where: { id: id },
            }));
            return res.status(200).json({
                message: "You have succesfully updated your profile",
                User
            });
        }
        return res.status(400).json({
            Error: "Error occured"
        });
    }
    catch (error) {
        return res.status(500).json({
            Error: "Internal server Error",
            route: "/users/update-profile"
        });
    }
});
exports.updateUserProfile = updateUserProfile;
/**==================FORGOT PASSWORD============================= */ 
