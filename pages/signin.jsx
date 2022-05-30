import React from 'react'
import Link from 'next/link'
import { useState, useContext, useEffect } from 'react'
import { DataContext } from '../store/GlobalState'
import { postData } from '../utils/fetchData';
import Cookie from 'js-cookie';
import { useRouter } from 'next/router';
// import { Head } from 'next/head'
const signin = () => {
    const initialState = { email: '', password: '' }
    const [userData, setUserData] = useState(initialState);
    const { email, password } = userData;

    const { state, dispatch } = useContext(DataContext)
    const { auth, cart } = state
    const router = useRouter()
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

        dispatch({
            type: 'NOTIFY',
            payload: { loading: true }
        });
        const res = await postData('auth/login', userData)
        console.log(res);
        if (res.err) return dispatch({ type: 'NOTIFY', payload: { error: res.err } });
        dispatch({ type: 'NOTIFY', payload: { success: res.msg } });
        dispatch({
            type: 'AUTH', payload: {
                token: res.access_token,
                user: res.user
            }
        })
        Cookie.set('refreshtoken', res.refresh_token, {
            path: 'api/auth/accessToken',
            expires: 7
        })
        localStorage.setItem('firstLogin', true)
    }
    useEffect(() => {

        if (Object.keys(auth).length !== 0 && Object.keys(cart).length !== 0) {
            router.push("/cart")
        }
    }, [auth])
    useEffect(() => {
        if (Object.keys(auth).length !== 0 && Object.keys(cart).length === 0) {
            router.push("/")
        }
    }, [auth])
    return (
        <div>
            {/* <Head>
                <title>Signin Page</title>
            </Head> */}
            <form className='mx-auto my-4' style={{ maxWidth: '500px' }} onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="exampleInputEmail1">Email</label>
                    <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" name='email' value={email} onChange={(event) => { handleChangeInput(event) }} />
                    <small id="emailHelp" className="form-text text-muted">Đừng bao giờ chia sẻ email của bạn với bất kỳ ai khác.</small>
                </div>
                <div className="form-group">
                    <label htmlFor="exampleInputPassword1">Password</label>
                    <input type="password" className="form-control" id="exampleInputPassword1" placeholder="Password" name='password' value={password} onChange={(event) => { handleChangeInput(event) }} />
                </div>

                <button type="submit" className="btn btn-dark w-100 neon">Đăng nhập</button>
                <p className='my-2'>Bạn không có tài khoảng ? <Link href="/register"><a style={{ color: 'crimson' }}>Đăng ký</a></Link></p>
            </form>
        </div>
    )
}

export default signin