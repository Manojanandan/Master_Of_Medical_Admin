import React, { useEffect, useState } from 'react'
import Titlebar from '../../comnponents/titlebar/Titlebar'
import Filter from '../../comnponents/filter/Filter'
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Backdrop, CircularProgress, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CommonTable from '../../comnponents/table/CommonTable'
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProductList } from './ProductReducer';

const Product = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [name, setName] = useState('')
  const [status, setStatus] = useState('All')
  const [accordian, setAccordian] = useState(false)
  const [page, setPage] = useState(1)

  const reducer = useSelector((state) => state.productReducer)
  const { loader, getProduct } = reducer
  console.log(getProduct);

  useEffect(() => {
    dispatch(getProductList())
  }, [])

  const columns = [
    { datakey: 'id', headerName: 'ID', size: 100, align: 'left', },
    { datakey: 'name', headerName: 'Product Name', size: 200, },
    { datakey: 'brandName', headerName: 'Brand', size: 200, align: 'center' },
    {
      datakey: 'category',
      headerName: 'Category',
      size: 200,
      align: 'center'
    },
    {
      datakey: 'status',
      headerName: 'Status',
      size: 150,
      align: 'center'
    },
    {
      datakey: 'actions',
      headerName: 'Actions',
      size: 200,
      align: 'center',
    },
  ];

  const rows = getProduct?.data?.map((e) => {
    return (
      {
        id: e?.id,
        name: e?.name,
        category: e?.category,
        brandName: e?.brandName,
        status: e?.status
      }
    )
  })

  const handlePageChange = (event, value) => {
    setPage(value);
    dispatch(getProductList(value))
  };

  const handleView = (e) => {
    sessionStorage.setItem("productId", e?.id)
    sessionStorage.setItem("Mode", "View")
    navigate('/productmanagemententry')
  }
  const handleEdit = (e) => {
    sessionStorage.setItem("productId", e?.id)
    sessionStorage.setItem("Mode", "Edit")
    navigate('/productmanagemententry')
  }
  return (
    <div style={{ height: 'auto' }}>
      <Backdrop
        sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
        open={loader}
      >
        <CircularProgress color="secondary" />
      </Backdrop>
      <Titlebar title={"Products List"} filter={true} onClick={() => setAccordian(!accordian)} addClick={() => { navigate('/productmanagemententry'), sessionStorage.setItem("Mode", "Add") }} />
      {accordian && <Filter handleStatus={(e) => { setStatus(e.target.value) }} handleName={(e) => { setName(e.target.value) }} nameValue={name} statusValue={status} />}
      <CommonTable rows={rows} columns={columns} handlePageChange={handlePageChange} page={page} count={getProduct?.pagination?.totalPages} handleView={(data) => handleView(data)} handleEdit={(data) => handleEdit(data)} handleDelete={(data) => console.log(data)} />
    </div>
  )
}

export default Product