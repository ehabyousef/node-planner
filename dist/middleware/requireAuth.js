"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = void 0;
const requireAuth = (req, res, next) => {
    const user = req.user;
    if (!user) {
        return res.status(401).json({ message: "Authentication required" });
    }
    next();
};
exports.requireAuth = requireAuth;
