import { getData } from '../utils/fetchData'
import React, { useContext, useEffect } from 'react'
import { DataContext } from '../store/GlobalState'
import Link from 'next/link'
const users = () => {
    const { state, dispatch } = useContext(DataContext);
    const { users, auth, modal } = state;
    useEffect(() => {
        if (auth && auth.user && auth.user.role === 'admin')
            getData('user', auth.token).then(res => {
                if (res.err) return dispatch({ type: 'NOTIFY', payload: { error: res.err } })

                dispatch({ type: 'ADD_USERS', payload: res.users })
            })

    }, [])
    if (!auth || !auth.user) return null;
    return (
        <div className='table-responsive'>
            <table className='table w-100'>
                <thead>
                    <tr>
                        <th></th>
                        <th>ID</th>
                        <th>Avatar</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Admin</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        users.map((user, index) => (
                            auth.user.root ?
                                <tr key={user._id} style={{ cursor: 'pointer' }}>
                                    <td>{index}</td>
                                    <td>{user._id}</td>
                                    <td>
                                        <img src={user.avatar} alt={user.avatar} style={{ width: '30px', height: '30px', overflow: 'hidden', objectFit: 'cover' }} />
                                    </td>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        {
                                            user.role === 'admin'
                                                ? user.root
                                                    ? <i className='fas fa-check text-success'>Root</i>
                                                    : <i className='fas fa-check text-success'></i>
                                                : <i className='fas fa-times text-danger'></i>
                                        }
                                    </td>
                                    <td>
                                        <Link href={
                                            auth.user.root && auth.user.email !== user.email ? `edit_user/${user._id}` : '#!'
                                        }>
                                            {
                                                auth.user.root && auth.user.email !== user.email
                                                    ? <a ><i className='fas fa-edit text-info mr-2' title='Edit'></i></a>
                                                    : <a></a>
                                            }

                                        </Link>
                                        {
                                            auth.user.root && auth.user.email !== user.email
                                                ? <i className='fas fa-trash-alt text-danger ml-2' title='Delete'
                                                    data-toggle="modal" data-target="#exampleModal" onClick={() => {
                                                        dispatch({
                                                            type: 'ADD_MODAL',
                                                            payload: [{ data: users, id: user._id, title: user.name, type: 'ADD_USERS' }]
                                                        })

                                                    }}>

                                                </i>
                                                : <></>
                                        }
                                    </td>
                                </tr>
                                :
                                !auth.user.root && auth.user.role === 'admin' && user.role === 'user' &&
                                <tr key={user._id} style={{ cursor: 'pointer' }}>
                                    <td>{index}</td>
                                    <td>{user._id}</td>
                                    <td>
                                        <img src={user.avatar} alt={user.avatar} style={{ width: '30px', height: '30px', overflow: 'hidden', objectFit: 'cover' }} />
                                    </td>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        {
                                            user.role === 'admin'
                                                ? user.root
                                                    ? <i className='fas fa-check text-success'>Root</i>
                                                    : <i className='fas fa-check text-success'></i>
                                                : <i className='fas fa-times text-danger'></i>
                                        }
                                    </td>
                                    <td>

                                        {
                                            auth.user.email !== user.email
                                                ? <i className='fas fa-trash-alt text-danger ml-2' title='Delete'
                                                    data-toggle="modal" data-target="#exampleModal" onClick={() => {
                                                        dispatch({
                                                            type: 'ADD_MODAL',
                                                            payload: [{ data: users, id: user._id, title: user.name, type: 'ADD_USERS' }]
                                                        })
                                                    }}></i>
                                                : <></>
                                        }
                                    </td>
                                </tr>

                        ))
                    }
                </tbody>
            </table>
        </div >
    )
}

export default users