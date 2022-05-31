import React, { useContext, useState, useEffect } from 'react';
import { DataContext } from '../store/GlobalState';
import CartItem from '../Components/CartItem';
import Link from 'next/link'
import { getData } from '../utils/fetchData';
import { postData } from '../utils/fetchData';
import { useRouter } from 'next/router';


const Cart = () => {
  const { state, dispatch } = useContext(DataContext)
  const { cart, auth, orders } = state
  const [total, setTotal] = useState(0);
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [callback, setCallback] = useState(false)
  const router = useRouter()
  useEffect(() => {
    const getTotal = cart.reduce((prev, item) => {
      return prev + (item.quantity * item.price)
    }, 0)

    setTotal(getTotal);
  }, [cart])
  useEffect(() => {
    const cartLocal = JSON.parse(localStorage.getItem('__next__cart01'))
    if (cartLocal && cartLocal.length > 0) {
      let newArr = [];
      const updateCart = async () => {
        for (const item of cartLocal) {
          const res = await getData(`product/${item._id}`)
          const { _id, title, images, price, inStock, sold } = res.product
          if (inStock > 0) {
            newArr.push({
              _id, title, images, price, inStock, sold,
              quantity: item.quantity > inStock ? 1 : item.quantity
            })
          }
        }
        dispatch({ type: 'ADD_CART', payload: newArr });
      }
      updateCart();
    }
  }, [callback])
  const handleOder = async () => {
    if (!address || !phone) {
      return dispatch({ type: 'NOTIFY', payload: { error: 'Xin hãy nhập địa chỉ và số điện thoại!!' } })
    }
    let newArr = [];
    for (const item of cart) {
      const res = await getData(`product/${item._id}`);
      if (res.product.inStock - item.quantity >= 0) {
        newArr.push(item)
      }
    }
    if (newArr.length < cart.length) {
      setCallback(!callback);
      return dispatch({ type: 'NOTIFY', payload: { error: 'Sản phẩm mua vượt quá số lượng!!' } })
    }
    dispatch({
      type: 'NOTIFY',
      payload: { loading: true }
    });

    const res = await postData('order', { address, phone, cart, total }, auth.token)

    if (res.err) return dispatch({ type: 'NOTIFY', payload: { error: res.err } })
    dispatch({ type: 'ADD_CART', payload: [] })
    const newOrder = {
      ...res.newOrder,
      auth: auth.user
    }
    dispatch({
      type: 'ADD_ORDERS',
      payload: [...orders, newOrder]
    });
    dispatch({ type: 'NOTIFY', payload: { success: res.msg } })
    return router.push(`/order/${newOrder._id}`)
  }
  if (cart.length === 0) return <h2>Giỏ hàng chưa có sản phẩm nào</h2>

  return (
    <div className='row mx-auto'>

      <div className='col-md-8 text-secondary table-responsive my-3'>
        <h2 className='text-uppercase'>Shopping Cart</h2>
        <table className='table my-3'>
          <tbody>
            {
              cart.map((item) => (
                <CartItem key={item._id} item={item} dispatch={dispatch} cart={cart} />
              ))
            }
          </tbody>
        </table>
      </div>
      <div className='col-md-4 my-3 text-right text-uppercase text-secondary'>
        <form action="">
          <h2>Shipping</h2>
          <label htmlFor="adress">Địa chỉ</label>
          <input type="text" name="address" id="address" value={address}
            className='form-control mb-2' onChange={(event) => setAddress(event.target.value)} />

          <label htmlFor="phone">Số điện thoại</label>
          <input type="text" name="phone" id="phone" value={phone}
            className='form-control mb-2' onChange={(event) => setPhone(event.target.value)} />
        </form>
        <h3>Tổng tiền: <span className='text-info'>${total}</span></h3>
        <Link href={auth.user ? '#' : '/signin'}>
          <a className='btn btn-dark my-2' onClick={handleOder}>Thực hiện đặt hàng</a>
        </Link>
      </div>
    </div>
  )
}

export default Cart