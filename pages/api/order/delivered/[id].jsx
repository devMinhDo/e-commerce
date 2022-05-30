import connectDB from "../../../../utils/connectDB";
import Orders from '../../../../models/orderModel';
import auth from "../../../../middleware/auth";

connectDB();

export default async (req, res) => {
    switch (req.method) {
        case "PATCH":
            await deliveredOrder(req, res)
            break;
    }
}
const deliveredOrder = async (req, res) => {
    try {
        const result = await auth(req, res);
        const { role } = result;
        if (role !== 'admin') return res.status(400).json({ err: 'Xác thực không hợp lệ' });
        const { id } = req.query;
        const order = await Orders.findOne({ _id: id })
        if (!order) {
            return res.status(400).json({ err: 'Đơn hàng không tồn tại' });
        }
        await Orders.findOneAndUpdate({ _id: id }, {
            delivered: true
        })
        res.json({
            msg: 'Cập nhập thành công!!',
            result: {
                updatedAt: new Date().toISOString(),
                delivered: true
            }

        })
    } catch (error) {
        return res.status(500).json({ err: error.message });
    }
}