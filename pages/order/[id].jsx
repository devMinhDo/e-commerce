import { useState, useContext, useEffect } from 'react'
import { DataContext } from '../../store/GlobalState'
import { useRouter } from 'next/router'
import Link from 'next/link';
import { patchData } from '../../utils/fetchData';
import { updateItem } from '../../store/Action';
const detailOrder = () => {
    const { state, dispatch } = useContext(DataContext);
    const { orders, auth } = state;
    const router = useRouter();
    const [orderDetail, setOrderDetail] = useState([]);
    useEffect(() => {
        const newArr = orders.filter(order => order._id === router.query.id);
        setOrderDetail(newArr)
        console.log(newArr);
    }, [orders]);
    const handleDelivered = async (order) => {
        const { _id } = order
        dispatch({
            type: 'NOTIFY',
            payload: { loading: true }
        });
        await patchData(`order/delivered/${_id}`, null, auth.token).then(res => {
            if (res.err) return dispatch({
                type: 'NOTIFY',
                payload: { error: res.err }
            });

            console.log(res);
            dispatch(updateItem(orders, order._id, {
                ...order, ...res.result
            }, 'ADD_ORDERS'));
            return dispatch({
                type: 'NOTIFY',
                payload: { success: res.msg }
            });
        })

    }
    if (!auth || !auth.user) return null;
    return (
        <div className='my-3'>
            <div>
                <button className='btn btn-dark' onClick={() => router.back()}>
                    <i className='fas fa-long-arrow-alt-left' aria-hidden="true"/> Quay lại
                </button>
            </div>
            <div style={{ maxWidth: "600px", margin: '20px auto' }}>
                {

                    orderDetail.map(order => (
                        <div key={order._id} className="text-uppercase my-3">
                            <h2 className='text-break'>Mã Đặt hàng {order._id}</h2>
                            <div className='mt-4 text-secondary'>
                                <h4>Shipping</h4>
                                <p>Tên : {order.user.name ? order.user.name : order.auth.name}</p>
                                <p>Email : {order.user.email ? order.user.email : order.auth.email}</p>
                                <p>Địa chỉ : {order.address}</p>
                                <p>Số điện thoại : {order.mobile}</p>
                                <h6>Tổng tiền : ${order.total}</h6>
                                <div className={`alert ${order.delivered ? 'alert-success' : 'alert-danger'}
                                d-flex justify-content-between align-items-center`} role="alert">
                                    {
                                        order.delivered ? `Đã giao hàng vào ngày : ${new Date(order.updatedAt).toLocaleDateString()}` : 'Chưa giao hàng'
                                    }
                                    {
                                        auth.user.role === 'admin' && !order.delivered &&
                                        <button className='btn btn-dark text-uppercase' onClick={() => handleDelivered(order)}>Xác nhận đã giao hàng</button>
                                    }
                                </div>
                                <div>
                                    <h4>Các sản phẩm đã đặt hàng</h4>
                                    <table className='table my-3'>
                                        <tbody>
                                            {

                                                order.cart.map(item => (
                                                    <tr key={item._id}>
                                                        <td>
                                                            <img src={item.images[0].url} alt={item.images[0].url}
                                                                style={{ width: '200px', height: '180px', objectFit: 'cover' }} />
                                                        </td>
                                                        <td style={{ minWidth: '200px' }} className="w-50 align-middle" >
                                                            <h5 className='text-capitalize text-secondary'>
                                                                {
                                                                    auth.user.role ==='admin' ?
                                                                        <div style={{textDecoration : 'none'}}>
                                                                            {item.title}
                                                                        </div>
                                                                        : <Link href={`/product/${item._id}`} >
                                                                            <a style={{ textDecoration: 'none' }}>
                                                                                {item.title}
                                                                            </a>
                                                                        </Link>
                                                                }

                                                            </h5>
                                                            <h6 className="text-danger">
                                                                {item.price} * {item.quantity} =  ${item.quantity * item.price}
                                                            </h6>
                                                            <p className="mb-1 text-primary">
                                                                Số lượng : {item.quantity}
                                                            </p>
                                                        </td>

                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    ))


                }
            </div>
        </div>
    )
}

export default detailOrder