import connectDB from "../../../utils/connectDB";
import Products from "../../../models/productModel";
import auth from "../../../middleware/auth";
connectDB();

export default async (req, res) => {
  switch (req.method) {
    case "GET":
      await getProduct(req, res);
      break;
    case "PUT":
      await UpdateProduct(req, res);
      break;
    case "DELETE":
      await deleteProduct(req, res);
      break;
  }
};
const UpdateProduct = async (req, res) => {
  try {
    const result = await auth(req, res);
    if (result.role !== "admin")
      return res.status(400).json({ err: "Xác thực không hợp lệ!!" });
    const { id } = req.query;

    const { title, price, inStock, description, content, category, images } =
      req.body;

    if (
      !title ||
      !price ||
      !inStock ||
      !description ||
      !content ||
      category === "all" ||
      images.length === 0
    )
      return res
        .status(400)
        .json({ err: "Vui lòng thêm tất cả các trường dữ liệu!!" });

    await Products.findOneAndUpdate(
      { _id: id },
      {
        title: title.toLowerCase(),
        price,
        inStock,
        description,
        content,
        category,
        images,
      }
    );
    res.json({
      msg: "Cập nhập sản phẩm thành công!!",
    });
  } catch (error) {
    return res.status(500).json({ err: error.message });
  }
};
const getProduct = async (req, res) => {
  try {
    const id = req.query.id;
    const product = await Products.findById(id);
    if (!product)
      return res.status(400).json({ err: "Sản phẩm không tồn tại!!" });
    res.json({
      product,
    });
  } catch (error) {
    return res.status(500).json({ err: error.message });
  }
};
const deleteProduct = async (req, res) => {
  try {
    const result = await auth(req, res);
    if (result.role !== "admin")
      return res.status(400).json({ err: "Xác thực không hợp lệ!!" });
    const { id } = req.query;
    if (!id) return res.status(400).json({ err: "id Không được để trống!!" });
    const product = await Products.findOne({ _id: id });
    if (!product)
      return res.status(400).json({ err: "Sản phẩm này hiện không tồn tại!!" });
    await Products.findByIdAndDelete(id);
    res.json({
      msg: "Xóa sản phẩm thành công!!",
    });
  } catch (error) {
    return res.status(500).json({ err: error.message });
  }
};
