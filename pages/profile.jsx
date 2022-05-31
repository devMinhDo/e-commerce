import React, { useContext, useState, useEffect } from 'react'
import { DataContext } from '../store/GlobalState'
import valid from '../utils/valid';
import { patchData } from '../utils/fetchData';
import { imageUpload } from '../utils/imageUpload';
import Link from 'next/link';
import { getData } from '../utils/fetchData'
const Profile = () => {
    const initialSate = {
        avatar: '',
        name: '',
        password: '',
        cf_password: '',
    }
    const [data, setData] = useState(initialSate);
    const { avatar, name, password, cf_password } = data
    const { state, dispatch } = useContext(DataContext);
    const { auth, notify, orders } = state;
    useEffect(() => {
        if (auth.user)
            setData({
                ...data,
                name: auth.user.name
            })
    }, [auth.user])

    useEffect(() => {
        if (auth && auth.user && auth.user.role === 'admin')
            getData('order', auth.token).then(res => {
                if (res.err) return dispatch({ type: 'NOTIFY', payload: { error: res.err } })
                if (res.orders.length !== orders.length)
                    dispatch({ type: 'ADD_ORDERS', payload: res.orders })
            })

    }, [])
    useEffect(() => {
        if (auth && auth.user && auth.user.role !== 'admin')
            getData('order', auth.token).then(res => {
                if (res.err) return dispatch({ type: 'NOTIFY', payload: { error: res.err } })

                dispatch({ type: 'ADD_ORDERS', payload: res.orders })
            })

    }, [])

    const handleInput = (event) => {
        const { name, value } = event.target

        setData({
            ...data,
            [name]: value
        });
        dispatch({
            type: 'NOTIFY',
            payload: {}
        })
    }
    const handleUpdateProfile = async (e) => {
        e.preventDefault();

        if (password && (name === auth.user.name || !avatar)) {
            const err = valid(name, auth.user.email, password, cf_password);
            if (err) return dispatch({
                type: 'NOTIFY',
                payload: { error: err }
            });
            await updatePassword()
            setData({
                ...data,
                password: '',
                cf_password: '',
            })
        }
        if ((name !== auth.user.name || avatar) && !password) await updateInfo();
        if (password && (name !== auth.user.name || avatar)) {
            const err = valid(name, auth.user.email, password, cf_password);
            if (err) return dispatch({
                type: 'NOTIFY',
                payload: { error: err }
            });
            dispatch({
                type: 'NOTIFY',
                payload: { loading: true }
            });

            const res = await patchData('user/resetPassword', { password }, auth.token)

            if (res.err) return dispatch({ type: 'NOTIFY', payload: { error: res.err } });

            let media;
            dispatch({ type: 'NOTIFY', payload: { loading: true } })
            if (avatar) media = await imageUpload([avatar]);
            await patchData('user', {
                name, avatar: avatar ? media[0].url : auth.user.avatar
            }, auth.token).then(res => {
                if (res.err) return dispatch({ type: 'NOTIFY', payload: { error: res.err } })
                dispatch({
                    type: 'AUTH',
                    payload: {
                        token: auth.token,
                        user: res.user
                    }
                })
                setData({
                    ...data,
                    password: '',
                    cf_password: '',
                })
                return dispatch({ type: 'NOTIFY', payload: { success: res.msg } })
            })
        }

    }
    const updatePassword = async () => {
        dispatch({
            type: 'NOTIFY',
            payload: { loading: true }
        });

        const res = await patchData('user/resetPassword', { password }, auth.token)

        if (res.err) return dispatch({ type: 'NOTIFY', payload: { error: res.err } });
        return dispatch({ type: 'NOTIFY', payload: { success: res.msg } })
    }
    const updateInfo = async () => {
        let media;
        dispatch({ type: 'NOTIFY', payload: { loading: true } })
        if (avatar) media = await imageUpload([avatar]);
        await patchData('user', {
            name, avatar: avatar ? media[0].url : auth.user.avatar
        }, auth.token).then(res => {
            if (res.err) return dispatch({ type: 'NOTIFY', payload: { error: res.err } })
            dispatch({
                type: 'AUTH',
                payload: {
                    token: auth.token,
                    user: res.user
                }
            })
            return dispatch({ type: 'NOTIFY', payload: { success: res.msg } })
        })
    }
    const handleAvatar = (e) => {
        const file = e.target.files[0];

        if (!file)
            return dispatch({
                type: 'NOTIFY',
                payload: { error: "Ảnh Không tồn tại!!" }
            });
        if (file.size > 1024 * 1024 * 6) return dispatch({
            type: 'NOTIFY',
            payload: { error: "Kích thước hình ảnh lớn nhất là 5mb!!" }
        });
        if (file.type !== "image/jpeg" && file.type !== "image/png") return dispatch({
            type: 'NOTIFY',
            payload: { error: "Định dạng hình ảnh không chính xác!!" }
        });
        console.log(file);
        setData({
            ...data,
            avatar: file
        });

    }
    if (!auth || !auth.user) return null;
    return (
        <div className='profile_page'>
            <section className='row text-secondary my-3'>
                <div className='col-md-4'>
                    <h3 className='text-center text-uppercase'>
                        {auth.user.role === 'user' ? 'User profile' : 'Admin profile'}
                    </h3>
                    <div className='avatar'>
                        <img src={avatar ? URL.createObjectURL(avatar) : auth.user.avatar} alt="Avatar" />
                        <span>
                            <i className='fas fa-camera'></i>
                            <p>
                                Thay đổi
                            </p>
                            <input type="file" name="file" id="file_up" accept='image/*'
                                onChange={handleAvatar} />
                        </span>
                    </div>
                    <div className="form-group">
                        <label htmlFor="name">Tên</label>
                        <input type="text" name="name" id="name" value={name} className='form-control' placeholder='Tên'
                            onChange={(event) => { handleInput(event) }} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input type="text" name="email" className='form-control' defaultValue={auth.user.email} disabled={true}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="name">Mật khẩu mới</label>
                        <input type="password" name="password" id="password" value={password} className='form-control' placeholder='Mật khẩu mới'
                            onChange={(event) => { handleInput(event) }} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="name">Nhập lại mật khẩu mới</label>
                        <input type="password" name="cf_password" id="cf_password" value={cf_password} className='form-control' placeholder='Nhập lại mật khẩu mới'
                            onChange={(event) => { handleInput(event) }} />
                    </div>
                    <button className='btn btn-info' disabled={notify.loading}
                        onClick={handleUpdateProfile}>
                        Cập nhập
                    </button>
                </div>

                <div className='col-md-8 '>
                    <h3 className='text-uppercase'>
                        Orders
                    </h3>
                    <div className='my-3 table-responsive'>
                        <table className='table-bordered table-hover w-100 text-uppercase'
                            style={{ minWidth: '600px', cursor: 'pointer' }}>
                            <thead className='bg-light font-weight-bold'>
                                <tr>
                                    <td className='p-2'>id</td>
                                    <td className='p-2'>Ngày đặt hàng</td>
                                    <td className='p-2'>Tổng đơn hàng</td>
                                    <td className='p-2'>Đã giao hàng</td>
                                    <td className='p-2'>Action</td>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    orders.map(order => (
                                        <tr key={order._id}>
                                            <td className='p-2'>{order._id}</td>
                                            <td className='p-2 text-center' >
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className='p-2 text-center'>${order.total}</td>
                                            <td className='p-2 text-center'>
                                                {
                                                    order.delivered
                                                        ? <i className='fas fa-check text-success'></i>
                                                        : <i className='fas fa-times text-danger'></i>
                                                }
                                            </td>
                                            <td className='p-2'>
                                                <Link href={`/order/${order._id}`}>
                                                    <a >Chi tiết</a>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                }

                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        </div>

    )
}

export default Profile