import connectDB from "../../../utils/connectDB";
import Users from '../../../models/useModel';

import bcrypt from 'bcrypt'
import { createAccessToken, createRefreshToken } from '../../../utils/generateToken'
connectDB()

export default async (req, res) => {
    switch (req.method) {
        case "POST":
            await login(req, res)
            break;
    }
}
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await Users.findOne({ email })
        if (!email || !password) {
            return res.status(400).json({ err: "Xin hãy nhập đầy đủ dữ liệu!!" });
        }
        if (!user) {
            return res.status(400).json({ err: "Email hoặc mật khẩu không chính xác" })
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          
            return res.status(400).json({ err: "Email hoặc mật khẩu không chính xác" });
        }

        const access_token = createAccessToken({ id: user._id })
        const refresh_token = createRefreshToken({ id: user._id })

        res.json({
            msg: "Đăng nhập thành công",
            refresh_token,
            access_token,
            user: {
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
                root: user.root
            }
        });
    } catch (error) {
        return res.status(500).json({ err: error.message });
    }
}