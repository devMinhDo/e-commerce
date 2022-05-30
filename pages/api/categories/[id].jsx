import connectDB from "../../../utils/connectDB";
import Categories from "../../../models/categoriesModel";
import auth from "../../../middleware/auth";
import Products from "../../../models/productModel";
connectDB();

export default async (req, res) => {
  switch (req.method) {
    case "PUT":
      await editCategory(req, res);
      break;
    case "DELETE":
      await deleteCategory(req, res);
      break;
  }
};
const editCategory = async (req, res) => {
  try {
    const result = await auth(req, res);
    const { role } = result;
    if (role !== "admin")
      return res.status(400).json({ err: "Xác thực không hợp lệ!!" });
    const { id } = req.query;
    const { name } = req.body;
    if (!name)
      return res
        .status(400)
        .json({ err: "Tên danh mục không được để trống!!" });
    const newCategory = await Categories.findOneAndUpdate(
      { _id: id },
      { name }
    );
    res.json({
      msg: "Cập nhập danh mục thành công!!",
      category: {
        ...newCategory._doc,
        name,
      },
    });
  } catch (error) {
    return res.status(500).json({ err: error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const result = await auth(req, res);
    const { role } = result;
    if (role !== "admin")
      return res.status(400).json({ err: "Xác thực không hợp lệ" });
    const { id } = req.query;
    if (!id) return res.status(400).json({ err: "Id bị lỗi !!!" });
    const products = await Products.find({ category: id });
    console.log(products);
    return res
      .status(400)
      .json({ err: "Vui lòng xóa tất cả sản phẩm có trong danh mục này!!" });
    await Categories.findByIdAndDelete({ _id: id });
    res.json({
      msg: "Xóa danh mục thành công!!",
    });
  } catch (error) {
    return res.status(500).json({ err: error.message });
  }
};
