import connectDB from "../../../utils/connectDB";
import Users from '../../../models/useModel';
import auth from "../../../middleware/auth";

connectDB();

export default async (req, res) => {
    switch (req.method) {
        case "PATCH":
            await updateRole(req, res)
            break;
        case "DELETE":
            await DeleteUser(req, res)
            break;
            case "GET":
                await getUser(req, res)
                break;

    }
}

const DeleteUser = async (req, res) => {
    try {
        const result = await auth(req, res);
        const { id } = req.query;
        console.log(id);
        if (result.role === 'admin' && !result.root) {
            console.log('hrhr');
            const user = await Users.findOne({ _id: id });
            const { role } = user

            if (role === 'user') {
                await Users.findByIdAndDelete({ _id: id })
                return res.json({
                    msg: 'Xóa thành công!!'
                })
            }
            else {

                return res.status(400).json({ err: 'Xác thực không hợp lệ' })
            }
        }
        if (result.role !== 'admin' || !result.root) return res.status(400).json({ err: 'Xác thực không hợp lệ' })

        await Users.findByIdAndDelete({ _id: id })
        res.json({
            msg: 'Xóa thành công!!'
        })

    } catch (error) {
        return res.status(500).json({ err: error.message })
    }
}
const updateRole = async (req, res) => {
    try {
        const result = await auth(req, res);

        if (result.role !== 'admin' || !result.root) return res.status(400).json({ err: 'Xác thực không hợp lệ' })
        const { id } = req.query;
        const { role } = req.body;
        await Users.findOneAndUpdate({ _id: id }, { role })
        res.json({
            msg: 'Cập nhập thành công!!'
        })

    } catch (error) {
        return res.status(500).json({ err: error.message })
    }
}

