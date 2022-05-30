import React from 'react'
import { useContext, useState, useEffect } from 'react';
import { DataContext } from '../../store/GlobalState';
import { useRouter } from 'next/router'
import { patchData } from '../../utils/fetchData';
import { updateItem } from '../../store/action';
const EditUser = () => {
    const { state, dispatch } = useContext(DataContext);
    const { auth, users } = state;
    const [editUser, setEditUser] = useState([]);
    const [checkAdmin, setCheckAdmin] = useState(false)
    const router = useRouter();
    const [num, setNum] = useState(0);
    const { id } = router.query

    useEffect(() => {
        users.forEach(user => {
            if (user._id === id) {
                setEditUser(user);
                setCheckAdmin(user.role === 'admin' ? true : false)
            }
        });
    }, [users])

    const handleCheck = () => {
        setCheckAdmin(!checkAdmin)
        setNum(num + 1);
    }
    const handleSubmit = async () => {
        let role = checkAdmin ? 'admin' : 'user';
        if (num % 2 !== 0) {
            dispatch({ type: 'NOTIFY', payload: { loading: true } })
            await patchData(`user/${editUser._id}`, { role }, auth.token).then(res => {
                if (res.err) return dispatch({ type: 'NOTIFY', payload: { error: res.err } });
                dispatch(updateItem(users, editUser._id, {
                    ...editUser, role
                }, 'ADD_USERS'))
                return dispatch({ type: 'NOTIFY', payload: { success: res.msg } })

            });
            router.push('/users')
        }
    }
    return (
        <div className='edit_user my-3 w-100'>
            <div>
                <button className='btn btn-dark' onClick={() => router.back()}>
                    <i className='fas fa-long-arrow-alt-left' aria-hidden="true"></i> Quay lại
                </button>
            </div>
            <div className='col-md-4 mx-auto my-4'>
                <h2 className='text-uppercase text-secondary'>Edit User</h2>
                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input type="text" className="form-control" id="name" name='name' value={editUser && editUser.name ? editUser.name : ''} />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" className="form-control" id="email" name='email' value={editUser && editUser.email ? editUser.email : ''} />
                </div>
                <div className="form-group">
                    <input type="checkbox" id='isAdmin' checked={checkAdmin} style={{ width: '20px', height: '20px' }} onClick={() => handleCheck()} />
                    <label htmlFor="isAdmin" style={{ transform: 'translete(4px,-3px)' }}> Admin</label>
                </div>
                <button className="btn btn-dark" onClick={() => handleSubmit()}>Cập nhập</button>
            </div>
        </div>
    )
}
export default EditUser