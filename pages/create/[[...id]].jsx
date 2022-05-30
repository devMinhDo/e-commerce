import { useState, useContext, useEffect } from "react"
import { DataContext } from "../../store/GlobalState"
import { useRouter } from 'next/router'
import { imageUpload } from '../../utils/imageUpload';
import { postData, getData, putData } from "../../utils/fetchData";
const ProductsManager = () => {
    const initialState = {
        title: '',
        price: 0,
        inStock: 0,
        description: '',
        content: '',
        category: ''
    }
    const [product, setProduct] = useState(initialState);
    const [tab, setTap] = useState(0);
    const { title, price, inStock, description, content, category } = product;

    const [images, setImages] = useState([]);
    const [onEdit, setOnEdit] = useState(false)

    const router = useRouter();
    const { id } = router.query;


    const { state, dispatch } = useContext(DataContext);
    const { categories, auth } = state
    const isActive = (index) => {
        if (tab === index) return "active";
    }
    const handleChangeInput = (e) => {
        const { name, value } = e.target;
        setProduct({
            ...product,
            [name]: value
        })
        dispatch({ type: 'NOTIFY', payload: {} })
    }
    const handleUploadInput = (e) => {
        dispatch({ type: 'NOTIFY', payload: {} })
        let newImages = [];
        let num = 0;
        let err = '';
        const files = [...e.target.files]

        if (files.length === 0) return dispatch({ type: 'NOTIFY', payload: { error: 'Tệp tin không tồn tại!!' } });
        files.forEach(file => {
            if (file.size > 1024 * 1024)
                return err = 'Tệp tin vượt quá 1mb!!'
            if (file.type !== 'image/jpeg' && file.type !== 'image/png')
                return err = 'Định dạng hình ảnh không chính xác!!'

            num += 1;
            if (num <= 5)
                newImages.push(file);
            return newImages;
        })
        if (err)
            dispatch({ type: 'NOTIFY', payload: { error: err } });
        const imgCount = images.length;
        console.log(imgCount);
        if (imgCount + newImages.length > 5)
            return dispatch({ type: 'NOTIFY', payload: { error: 'Chỉ chọn tối đa được 5 hình ảnh!!' } });
        setImages([...images, ...newImages])
    }
    const DeleteImage = (index) => {
        const newArr = [...images]
        newArr.splice(index, 1)
        setImages(newArr)

    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (auth.user.role !== 'admin')
            return dispatch({ type: 'NOTIFY', payload: { error: 'Xác thực không hợp lệ!!' } });
        if (!title || !price || !inStock || !description || !content || category === 'all' || images.length === 0)
            return dispatch({ type: 'NOTIFY', payload: { error: 'Vui lòng thêm tất cả các trường dữ liệu!!' } });

        dispatch({ type: 'NOTIFY', payload: { loading: true } })
        let media = []
        const imgNewURL = images.filter(img => !img.url)
        const imgOldURL = images.filter(img => img.url)
        if (imgNewURL.length > 0) media = await imageUpload(imgNewURL);

        let res;
        if (onEdit) {
            res = await putData(`product/${id}`, {
                ...product,
                images: [
                    ...imgOldURL,
                    ...media
                ]
            }, auth.token)

            if (res.err) return dispatch({ type: 'NOTIFY', payload: { error: res.err } });
            dispatch({ type: 'NOTIFY', payload: { success: res.msg } });
            return router.push('/');
        } else {
            res = await postData('product', {
                ...product,
                images: [
                    ...imgOldURL,
                    ...media
                ]
            }, auth.token)
            if (res.err) return dispatch({ type: 'NOTIFY', payload: { error: res.err } });
            setProduct({
                title: '',
                price: 0,
                inStock: 0,
                description: '',
                content: '',
                category: ''
            })
            return dispatch({ type: 'NOTIFY', payload: { success: res.msg } });
        }
    }
    useEffect(() => {
        if (id) {
            setOnEdit(true);
            getData(`product/${id}`).then(res => {
                setProduct(res.product);
                setImages(res.product.images)
            })
        }
        else {
            setOnEdit(false);
            setProduct(initialState);
            setImages([]);
        }
    }, [id])
    useEffect(() => {
        if (auth && auth.user && auth.user.role !== 'admin') {
            return router.push('/');
        }
    }, [auth])


    return (

        <div className="products_manager">
            {auth && auth.user && auth.user.role === 'admin' ?
                <>
                    <form className="row" onSubmit={handleSubmit}>
                        <div className="col-md-6">


                            <input type="text" name="title"
                                value={title} placeholder="Title" className="d-block my-4 w-100 p-2"
                                onChange={(e) => { handleChangeInput(e) }} />

                            <div className="row">
                                <div className="col-md-6">
                                    <label htmlFor="price">price</label>
                                    <input type="number" name="price"
                                        value={price} placeholder="Price" className="d-block my-4 w-100 p-2"
                                        onChange={(e) => { handleChangeInput(e) }} />

                                </div>
                                <div className="col-md-6">
                                    <label htmlFor="price">InStock</label><label htmlFor="price">price</label>
                                    <input type="number" name="inStock"
                                        value={inStock} placeholder="InStock" className="d-block my-4 w-100 p-2"
                                        onChange={(e) => { handleChangeInput(e) }} />
                                </div>

                            </div>
                            <textarea name="description" id="description" cols="30" rows="4"
                                className="d-block my-4 w-100 p-2"
                                placeholder="Description" value={description} onChange={(e) => { handleChangeInput(e) }} />

                            <textarea name="content" id="content" cols="30" rows="6"
                                className="d-block my-4 w-100 p-2" value={content}
                                placeholder="content" onChange={(e) => { handleChangeInput(e) }} />

                            <div className="input-group-prepend px-0 my-2">
                                <select name="category" id="category" value={category} className="custom-select text-cap"
                                    onChange={(e) => { handleChangeInput(e) }}>
                                    <option value="all">All Products</option>
                                    {
                                        categories.map(category => (
                                            <option value={category._id}>{category.name}</option>
                                        ))
                                    }
                                </select>
                            </div>
                            <button type="submit" className="btn btn-info my-2 px-4">{onEdit ? 'Cập nhập' : 'Tạo'}</button>

                        </div>


                        <div className="col-md-6 my-4">
                            <div className="input-group mb-3">
                                <div className="input-group-prepend">
                                    <span className="input-group-text">Upload</span>
                                </div>
                                <div className="custom-file border rounded">
                                    <input type="file" className="custom-file-input"
                                        onChange={(e) => { handleUploadInput(e) }} multiple accept="image/*" />
                                </div>
                            </div>
                            <div className="row img-up mx-0">
                                {
                                    images && images.map((image, index) => (
                                        <div key={index} className="file_img my-2">
                                            <img src={image.url ? image.url : URL.createObjectURL(image)} alt=""
                                                className={`img-thumbnail rounded ${isActive(index)}`} />
                                            <span onClick={() => DeleteImage(index)}>X</span>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>

                    </form>
                </>
                :
                <></>
            }
        </div>



    )
}
export default ProductsManager