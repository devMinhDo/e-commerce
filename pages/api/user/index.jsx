import connectDB from "../../../utils/connectDB";
import Users from '../../../models/useModel';
import auth from "../../../middleware/auth";

connectDB();

export default async (req, res) => {
    switch (req.method) {
        case "PATCH":
            await uploadInfor(req, res)
            break;
        case "GET":
            await getUsers(req, res)
            break;
    }
}
const getUsers = async (req, res) => {
    try {
        const result = await auth(req, res)

        if (result.role !== 'admin') return res.status(400).json({ err: "Xác thực không hợp lệ" });
        const users = await Users.find().select('-password');
        res.json({ users })
    } catch (error) {
        return res.status(500).json({ err: error.message })
    }
}
const uploadInfor = async (req, res) => {
    try {
        const result = await auth(req, res);
        const { id } = result
        const { name, avatar } = req.body;

        const updateUser = await Users.findOneAndUpdate({ _id: id }, {
            name, avatar
        })
        res.json({
            msg: "Cập nhập thành công",
            user: { name, email: updateUser.email, avatar, role: updateUser.role }
        })
    } catch (error) {
        return res.status(500).json({ err: error.message })
    }
}
