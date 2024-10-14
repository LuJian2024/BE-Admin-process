import express from "express";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.js";
import userRouter from "./routes/user.js";
import adminRouter from "./routes/admin.js";
import { connectToDB } from "./libs/db.js";

const PORT = 3000;
const app = express();

// cookie-parser 中间件解析客户端请求中的 Cookie，并将解析后的 Cookie 数据附加到 req.cookies 对象上，以便在后续的处理程序中可以访问。也就是说，它将 HTTP 请求头中的 Cookie 字符串转换为一个 JavaScript 对象，方便后续处理和操作。
app.use(cookieParser());

app.use(express.json());
await connectToDB();

app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/admin", adminRouter);

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
