import React from 'react'
import Link from 'next/link'
import { useState, useContext, useEffect } from 'react'
import valid from '../utils/valid'
import { DataContext } from '../store/GlobalState'
import { postData } from '../utils/fetchData';
import { useRouter } from 'next/router'
const Register = () => {
    const initialState = { name: '', email: '', password: '', cfpassword: '' }
    const [userData, setUserData] = useState(initialState);
    const { name, email, password, cfpassword } = userData;
    const router = useRouter();


    const { state, dispatch } = useContext(DataContext)
    const { auth, notify } = state;
    const handleChangeInput = (event) => {

        const { name, value } = event.target

        setUserData({
            ...userData,
            [name]: value
        });
        dispatch({
            type: 'NOTIFY',
            payload: {}
        })
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        console.log(userData);
        const error = valid(name, email, password, cfpassword)
        if (error) {
            return dispatch({
                type: 'NOTIFY',
                payload: { error: error }
            })
        }
        dispatch({
            type: 'NOTIFY',
            payload: { loading: true }
        });
        const res = await postData('auth/register', userData)
        console.log(res);
        if (res.err) return dispatch({ type: 'NOTIFY', payload: { error: 'Email đã được tạo xin nhập email khác' } });
        return dispatch({ type: 'NOTIFY', payload: { success: res.msg } })
    }
    useEffect(() => {
        if (Object.keys(auth).length !== 0) {
            router.push("/")
        }
    }, [auth])
    useEffect(() => {
        if (notify.success) {
            router.push("/signin")
        }
    }, [notify.success])
    return (
        <div>
            <form className='mx-auto my-4' style={{ maxWidth: '500px' }} onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" name='name' value={name} onChange={(event) => { handleChangeInput(event) }} />
                    <small id="name" className="form-text text-muted">Đừng bao giờ chia sẻ email của bạn với bất kỳ ai khác.</small>
                </div>
                <div className="form-group">
                    <label htmlFor="exampleInputEmail1">Email</label>
                    <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" name='email' value={email} onChange={(event) => { handleChangeInput(event) }} />
                    <small id="emailHelp" className="form-text text-muted">Đừng bao giờ chia sẻ email của bạn với bất kỳ ai khác.</small>
                </div>
                <div className="form-group">
                    <label htmlFor="exampleInputPassword1">Mật khẩu</label>
                    <input type="password" className="form-control" id="exampleInputPassword1" name='password' value={password} onChange={(event) => { handleChangeInput(event) }} />
                </div>
                <div className="form-group">
                    <label htmlFor="exampleInputPassword2">Nhập lại mật khẩu</label>
                    <input type="password" className="form-control" id="exampleInputPassword2" name='cfpassword' value={cfpassword} onChange={(event) => { handleChangeInput(event) }} />
                </div>
                <button type="submit" className="btn btn-dark w-100 neon">Đăng ký</button>
                <p className='my-2'>Bạn đã có tài khoảng? <Link href="/signin"><a style={{ color: 'crimson' }}>Đăng nhập ngay</a></Link></p>
            </form>

        </div>
    )
}

export default Register