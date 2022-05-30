import connectDB from "../../../utils/connectDB";
import Categories from '../../../models/categoriesModel'
import auth from "../../../middleware/auth";

connectDB();

export default async (req, res) => {
    switch (req.method) {
        case "POST":
            await createCategory(req, res)
            break;
        case "GET":
            await getCategory(req, res)
            break;
    }
}

const createCategory = async (req, res) => {
    try {
        const result = await auth(req, res);
        const { role } = result;
        if (role !== 'admin') return res.status(400).json({ err: "Xác thực không hợp lệ" });
        const { name } = req.body;
        if (!name) return res.status(400).json({ err: "Tên danh mục không được để trống!" });

        const newCategory = new Categories({ name });
        await newCategory.save();   
        res.json({
            msg: 'Tạo mới thành công 1 danh mục',
            newCategory
        })


    } catch (error) {
        return res.status(500).json({ err: error.message });
    }
}
const getCategory = async (req, res) => {
    try {

        const categories = await Categories.find();
        if (!categories) return res.status(500).json({ err: 'Hiện chưa có danh mục nào' });
        res.json({
            categories
        })
    } catch (error) {
        return res.status(500).json({ err: error.message });
    }
}