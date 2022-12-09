"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const config_1 = require("./config");
//IMPORTING ROUTE
const userRoute_1 = __importDefault(require("./routes/userRoute"));
const indexRoute_1 = __importDefault(require("./routes/indexRoute"));
// import userVerify from "./routes/userRoute"
// import loginRoute from "./routes/userRoute"
// import resendOTP from "./routes/userRoute"
// import getAllUseer from "./routes/userRoute";
// import getSingleUser from "./routes/userRoute"
// import updsteProfile from "./routes/userRoute"
//Admin rroute
const adminRoute_1 = __importDefault(require("./routes/adminRoute"));
const vendorRoute_1 = __importDefault(require("./routes/vendorRoute"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
//sequelize connection
config_1.db.sync().then(() => {
    console.log("DB connected succesfully");
}).catch(err => {
    console.log(err);
});
app.use(express_1.default.json());
if (process.env.NODE_ENV === "developmet") {
    app.use((0, morgan_1.default)("dev"));
}
app.use((0, cookie_parser_1.default)());
app.use(indexRoute_1.default);
app.use("/user", userRoute_1.default);
app.use("/admin", adminRoute_1.default);
app.use("/vendors", vendorRoute_1.default);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server listening on http://localhoost:${PORT}`);
});
exports.default = app;
