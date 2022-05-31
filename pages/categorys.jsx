
import React, { useContext, useState, useRef, useEffect } from 'react'
import { DataContext } from '../store/GlobalState';
import { postData, putData } from '../utils/fetchData'
import { updateItem } from '../store/Action';


const Categorys = () => {
    const [name, setName] = useState('');
    const { state, dispatch } = useContext(DataContext);
    const { categories, auth } = state;
    const [id, setId] = useState('');
    const ref = useRef(null);
    useEffect(() => {
        ref.current.focus();

    }, [categories])
    const createCategory = async () => {
        if (auth.user.role !== 'admin')
            return dispatch({ type: 'NOTIFY', payload: { error: 'Xác thực không hợp lệ!!' } })

        if (!name)
            return dispatch({ type: 'NOTIFY', payload: { error: 'Tên danh mục không được để trống!!' } })

        dispatch({ type: 'NOTIFY', payload: { loading: true } })
        let res;

        if (id) {
            res = await putData(`categories/${id}`, { name }, auth.token)

            if (res.err)
                return dispatch({ type: 'NOTIFY', payload: { error: res.err } });

            dispatch(updateItem(categories, id, res.category, 'ADD_CATEGORIES'))
        }
        else {
            res = await postData('categories', { name }, auth.token)
            if (res.err)
                return dispatch({ type: 'NOTIFY', payload: { error: res.err } })
            dispatch({
                type: "ADD_CATEGORIES",
                payload: [
                    ...categories,
                    res.newCategory
                ]
            })
        }
        setName('')
        setId('');
        return dispatch({ type: 'NOTIFY', payload: { success: res.msg } })

    }

    const handleEditCategory = async (category) => {
        setId(category._id);
        setName(category.name);
        ref.current.focus();
    }

    return (
        <div className='col-md-6 mx-auto my-3'>
            <div className='input-group mb-3'>
                <input type="text" className='form-control'
                    placeholder='Thêm một danh mục mới' value={name}
                    onChange={(e) => setName(e.target.value)} ref={ref} />
                <button className='btn btn-secondary ml-1' onClick={createCategory}>{id ? 'Cập nhập' : 'Tạo'}</button>
            </div>
            {
                categories.map(category => (
                    <div className='card my-2 text-capitalize' key={category ? category._id : ''}>
                        <div className='card-body d-flex justify-content-between'>
                            {
                                category ? category.name : ''
                            }
                            <div style={{ cursor: 'pointer' }}>
                                <i className='fas fa-edit mr-2 text-info'
                                    onClick={() => handleEditCategory(category)}/>

                                <i className='fas fa-trash-alt text-danger' data-toggle="modal" data-target="#exampleModal"
                                    onClick={() => {
                                        dispatch({
                                            type: 'ADD_MODAL',
                                            payload: [{ data: categories, id: category._id, title: category.name, type: 'ADD_CATEGORIES' }]
                                        })
                                    }}/>

                            </div>
                        </div>
                    </div>
                ))
            }
        </div>
    )
}
export default Categorys