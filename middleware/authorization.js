import JWT from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const authorizeJwt = (req, res, next) => {
    try {
        // 检查是否存在JWT token
        const token = req.cookies.jwt;
        // console.log(token);
        if (!token) {
            return res
                .status(401)
                .json({ message: "Unauthorized, token missing" });
        }

        // 验证JWT token
        const decodedToken = JWT.verify(token, process.env.JWT_SECRET);

        // 如果token解码失败，返回401
        if (!decodedToken) {
            return res
                .status(401)
                .json({ message: "Unauthorized, invalid token" });
        }

        // 将解码后的用户信息存储到请求对象中
        req.user = decodedToken;
        next();
    } catch (error) {
        console.error("JWT verification error:", error);
        return res.status(401).json({ message: "Unauthorized" });
    }
};
