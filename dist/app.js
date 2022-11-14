"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: '.config.env' });
const config_1 = require("./config");
//IMPORTING ROUTE
const userRoute_1 = __importDefault(require("./routes/userRoute"));
const indexRoute_1 = __importDefault(require("./routes/indexRoute"));
const app = (0, express_1.default)();
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
app.use("/register", userRoute_1.default);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server listening on http://localhoost:${PORT}`);
});
exports.default = app;
