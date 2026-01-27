"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorhandler = exports.notFound = void 0;
const notFound = (req, res, next) => {
    const error = new Error(`not found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};
exports.notFound = notFound;
const errorhandler = (err, req, res) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({ message: err.message });
};
exports.errorhandler = errorhandler;
