import connectDB from "../../../utils/connectDB";
import Users from '../../../models/useModel';
import valid from '../../../utils/valid';
import bcrypt from 'bcrypt'
connectDB()

export default async (req, res) => {
    switch (req.method) {
        case "POST":
            await register(req, res)
            break;
    }
}
const register = async (req, res) => {
    try {
        const { name, email, password, cfpassword } = req.body;
        const errMsg = valid(name, email, password, cfpassword);
        if (errMsg) {
            return res.status(400).json({ err: errMsg })
        }
        const user = await Users.findOne({ email })
        if (user) {

            return res.status(400).json({ err: 'Email đã được tạo xin nhập email khác' })
        }

        const passwordHash = await bcrypt.hash(password, 12)
        const newUser = new Users({

            name, email, password: passwordHash, cfpassword
        })
        console.log('123');

        await newUser.save();

        res.json({ msg: "Đăng kí thành công" });
    } catch (error) {
        return res.status(500).json({ err: error.message });
    }
}