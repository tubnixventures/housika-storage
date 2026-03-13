import jwt from "jsonwebtoken";
export const authMiddleware = async (c, next) => {
    const authHeader = c.req.header("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return c.json({ success: false, error: "Unauthorized" }, 401);
    }
    const token = authHeader.substring(7);
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        c.set("user", decoded);
        await next();
    }
    catch (err) {
        return c.json({ success: false, error: "Invalid token" }, 401);
    }
};
