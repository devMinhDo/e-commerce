import React from 'react'
import Link from 'next/link'
import { useContext } from 'react';
import { DataContext } from '../../store/GlobalState';
import { addToCart } from '../../store/action';
const ProductItem = ({ key, product, handleCheck }) => {
    const { state, dispatch } = useContext(DataContext)
    const { cart, auth } = state;
    const addCart = addToCart(product, cart);


    const userLink = () => {
        return (
            <>
                <Link href={`/product/${product._id}`}>
                    <a className="btn btn-info" style={{ marginRight: '5px', flex: 1 }}>Chi tiết</a>
                </Link>
                <button className="btn btn-success" style={{ marginRight: '5px', flex: 1 }} disabled={product.inStock === 0 ? true : false}
                    onClick={() => {
                        dispatch(addCart);
                        if (addCart.type === 'ADD_CART')
                            dispatch({ type: 'NOTIFY', payload: { success: "Đã thêm sản phẩm vào giỏ hàng!!" } });
                    }}>
                    Mua
                </button>
            </>
        )

    }
    const adminLink = () => {
        return (
            <>
                <Link href={`/create/${product._id}`}>
                    <a className="btn btn-info" style={{ marginRight: '5px', flex: 1 }}>Edit</a>
                </Link>
                <button className="btn btn-danger" style={{ marginRight: '5px', flex: 1 }} disabled={product.inStock === 0 ? true : false}
                    data-toggle="modal" data-target="#exampleModal"
                    onClick={() => dispatch({
                        type: 'ADD_MODAL',
                        payload: [{
                            data: '',
                            id: product._id,
                            title: product.title,
                            type: 'DELETE_PRODUCT'
                        }]
                    })}>
                    Delete
                </button>
            </>
        )
    }
    return (
        <div className="card" style={{ width: '18rem' }} key={key}>
            {
                auth && auth.user && auth.user.role === 'admin' &&
                <input type="checkbox" checked={product.checked}
                    className="position-absolute"
                    style={{ height: '30px', width: '30px' }}
                    onClick={() => handleCheck(product._id)} />
            }
            {
                auth && auth.user && auth.user.role === 'admin' ?
                    <Link href={`/create/${product._id}`} >
                        <img className="card-img-top" src={product.images[0].url} alt={product.title} style={{ cursor: 'pointer' }} />
                    </Link>
                    : <Link href={`/product/${product._id}`} >
                        <img className="card-img-top" src={product.images[0].url} alt={product.title} style={{ cursor: 'pointer' }} />
                    </Link>
            }

            <div className="card-body">
                <h5 className="card-title text-capitalize" title={product.title}>{product.title}</h5>
                <div className="row justify-content-between mx-0">
                    <h6 className='text-danger'> Giá : $ {product.price}</h6>
                    {
                        product.inStock > 0 ?
                            <h6 className='text-primary'>
                                Số lượng còn : {product.inStock}
                            </h6>
                            : <h6 className='text-danger'>
                                Đã hết hàng
                            </h6>
                    }
                </div>

                <p className="card-text" title={product.content}>{product.content}</p>
                <div className='row justify-content-between mx-0'>
                    {
                        auth && auth.user && auth.user.role === 'admin' ? adminLink() : userLink()
                    }
                </div>
            </div>

        </div >



    )
}

export default ProductItem