"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Register = void 0;
const Register = (req, res, next) => {
    try {
        return res.status(200).json({
            message: 'Hello Express'
        });
    }
    catch (error) {
        res.status(400).json({ message: error });
    }
};
exports.Register = Register;
