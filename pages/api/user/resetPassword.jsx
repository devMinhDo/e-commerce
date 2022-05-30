import connectDB from "../../../utils/connectDB";
import Users from '../../../models/useModel';
import auth from "../../../middleware/auth";
import bcrypt from 'bcrypt'

connectDB();

export default async (req, res) => {
    switch (req.method) {
        case "PATCH":
            await resetPassword(req, res)
            break;
    }
}
const resetPassword = async (req, res) => {
    try {
        const result = await auth(req, res);
        const { password } = req.body;

        const { id } = result;
        const passwordHash = await bcrypt.hash(password, 12)
        await Users.findOneAndUpdate({ _id: id }, {
            password: passwordHash
        }, {
            new: true
        })
        res.json({ msg: "Cập nhập thành công!!" });
    } catch (error) {

        return res.status(500).json({ err: error.message });
    }
}