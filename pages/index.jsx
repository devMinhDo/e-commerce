import { getData } from '../utils/fetchData';
import { useState, useContext, useEffect } from 'react';
import ProductItem from '../Components/product/ProductItem';
import { DataContext } from '../store/GlobalState';
import filterSearch from '../utils/filterSearch';
import { useRouter } from 'next/router';
import Filter from '../Components/Filter';
const Home = (props) => {
  const [products, setProducts] = useState(props.productProps);
  const [isCheck, setIsCheck] = useState(false)
  const [page, setPage] = useState(1)
  const router = useRouter();

  const { state, dispatch } = useContext(DataContext);
  const { auth } = state;
  console.log(`props.result${props.result}`)

  const handleCheck = (id) => {
    products.forEach(product => {
      if (product._id === id) product.checked = !product.checked
    })
    setProducts([...products]);
  }
  const handleCheckAll = () => {
    products.forEach(product => {
      product.checked = !isCheck
    })
    setProducts([...products]);
    setIsCheck(!isCheck)
  }
  useEffect(() => {
    setProducts(props.productProps)
  }, [props.productProps])
  useEffect(() => {
    setProducts(props.productProps)
  }, [props.productProps])
  useEffect(() => {
    if (Object.keys(router.query).length === 0) setPage(1)
  }, [router.query])

  const handleDeleteAll = () => {
    let deleteArr = [];
    products.forEach(product => {
      if (product.checked) {
        deleteArr.push({
          data: '',
          id: product._id,
          title: 'tất cả các sản phẩm ?',
          type: 'DELETE_PRODUCT'
        })
      }
    })
    dispatch({ type: 'ADD_MODAL', payload: deleteArr })
  }
  const handleLoadmore = () => {
    setPage(page + 1);
    filterSearch({ router, page: page + 1 });

  }
  return (
    <div className='home_page'>
      <Filter state={state} />
      {
        auth && auth.user && auth.user.role === 'admin' &&
        <div className='delete_all btn btn-danger mt-2' style={{ marginBottom: '-10px' }}>
          <input type="checkbox" checked={isCheck} onChange={handleCheckAll}
            style={{ width: '25px', height: '25px', transform: 'translateY(8px)' }} />
          <button className='btn btn-danger ml-2' data-toggle="modal" data-target="#exampleModal"
            onClick={handleDeleteAll} >
            DELETE ALL
          </button>
        </div>
      }
      <div className='products'>

        {
          products.length === 0 ?
            <h2>Không có sản phẩm nào !!!</h2>
            : products.map((product) => (
              <ProductItem key={product._id} product={product} handleCheck={handleCheck} />
            ))
        }
      </div>
      {
        props.result < page * 6 ? ""
          : <button className='btn btn-ouline-info d-block mx-auto mb-4'
            onClick={handleLoadmore}>Load more</button>
      }
    </div>

  )
}
export async function getServerSideProps({ query }) {
  const page = query.page || 1;
  const category = query.category || 'all';
  const sort = query.sort || '';
  const search = query.search || 'all';

  const res = await getData(`product?limit=${page * 6}&category=${category}&sort=${sort}&title=${search}`)

  return {
    props: {
      productProps: res.products,
      result: res.result
    }, // will be passed to the page component as props
  }
}
export default Home