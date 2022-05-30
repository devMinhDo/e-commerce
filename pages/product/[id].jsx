import React from 'react'
import { useState } from 'react'
import { getData } from '../../utils/fetchData'
import { useContext } from 'react';
import { DataContext } from '../../store/GlobalState';
import { addToCart } from '../../store/action';

const DetailProduct = ({ product }) => {
    const [DetailProduct] = useState(product);
    const [tab, setTap] = useState(0);
    const { state, dispatch } = useContext(DataContext)
    const { cart } = state;
    const addCart = addToCart(product, cart);
    const isActive = (index) => {
        if (tab == index) return "active";
    }
    // useEffect(() => {
    //     const images = imgRef.current.children;
    //     console.log(images);
    //     for (let i = 0; i < images.length; i++) {
    //         images[i].className = images[i].className.replace("active", "img-thumbnail rounded");
    //     }
    //     images[tab].className = "img-thumbnail rounded active";
    // }, [tab])
    return (
        <div className='row mx-auto'>
            <div className="row detail_page">
                <div className="col-md-6">
                    <img src={DetailProduct.images[tab].url} alt={DetailProduct.images[tab].url}
                        className="d-block img-thumbnail rounded mt-4 w-100" style={{ minHeight: '350px' }} />
                    <div className="row mx-0" style={{ cursor: 'pointer' }} >
                        {DetailProduct.images.map((image, index) => (
                            <img src={image.url} alt={image.url} key={index}
                                className={`img-thumbnail rounded ${isActive(index)}`}
                                style={{ height: '80px', width: '20%' }} onClick={() => setTap(index)} />
                        ))}
                    </div>
                </div>

                <div className="col-md-6 mt-3">
                    <h2 className='text-uppercase'>{DetailProduct.title}</h2>
                    <h5 className='text-danger'>${DetailProduct.price}</h5>
                    <div className="row mx-0 d-flex justify-content-between">
                        {
                            DetailProduct.inStock > 0 ? <h6 className='text-primary'>Số lượng còn : {DetailProduct.inStock} </h6>
                                : <h6 className='text-danger'>Sản phẩm hiện tại đã hết hàng!!</h6>
                        }
                        <h6 className='text-primary'>Đã bán : {DetailProduct.sold}</h6>
                    </div>
                    <div className="my-2">{DetailProduct.description}</div>
                    <div className="my-2">{DetailProduct.content}</div>
                    <button type='button' className='btn btn-dark d-block my-3 px-5' onClick={() => {
                        dispatch(addCart);
                        if (addCart.type === 'ADD_CART')
                            dispatch({ type: 'NOTIFY', payload: { success: "Đã thêm sản phẩm vào giỏ hàng!!" } });
                    }}>Mua</button>
                </div>

            </div>
        </div>
    )
}
export async function getServerSideProps({ params: { id } }) {
    console.log(id);
    const res = await getData(`product/${id}`)
    console.log('Check', res);
    return {
        props: {
            product: res.product,

        },
    }
}
export default DetailProduct