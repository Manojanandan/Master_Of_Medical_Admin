import React, { useEffect, useState } from 'react'
import Titlebar from '../../comnponents/titlebar/Titlebar'
import Filter from '../../comnponents/filter/Filter'
import VisibilityIcon from '@mui/icons-material/Visibility';
import { IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CommonTable from '../../comnponents/table/CommonTable'
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProductList } from './ProductReducer';

const Product = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [name,setName]=useState('')
    const [status,setStatus]=useState('All')
    const [accordian,setAccordian] = useState(false)

    const reducer = useSelector((state)=>state.productReducer)
    const { loader, getProduct} = reducer
console.log(getProduct);

    useEffect(()=>{
      dispatch(getProductList())
    },[])

    const columns = [
        { datakey: 'id', headerName: 'ID', size: 100,align:'left',},
        { datakey: 'productName', headerName: 'Product Name', size: 200, },
        { datakey: 'brand', headerName: 'Brand', size: 200, },
        {
          datakey: 'description',
          headerName: 'Description',
          size: 200,
        },
        {
          datakey: 'price',
          headerName: 'Price',
          size: 150,
          align:'center'
        },
        {
          datakey: 'actions',
          headerName: 'Actions',
          size: 200,
          align:'center',
        },
      ];
      
      const rows = [
        { id: 1, productName: 'Snow', brand: 'Jon', description: 'yhigygiugi',price:'700' },
        { id: 2, productName: 'Snow', brand: 'Jon', description: 'yhigygiugi',price:'700' },
        { id: 3, productName: 'Snow', brand: 'Jon', description: 'yhigygiugi',price:'700' },
        { id: 4, productName: 'Snow', brand: 'Jon', description: 'yhigygiugi',price:'700' },
        { id: 5, productName: 'Snow', brand: 'Jon', description: 'yhigygiugi',price:'700' },
        { id: 6, productName: 'Snow', brand: 'Jon', description: 'yhigygiugi',price:'700' },
        { id: 7, productName: 'Snow', brand: 'Jon', description: 'yhigygiugi',price:'700' },
       
      ];
      const paginationModel = { page: 0, pageSize: 7 };
  return (
    <div style={{height:'auto'}}>
        <Titlebar title={"Products List"} filter={true} onClick={()=>setAccordian(!accordian)} addClick={()=>navigate('/productmanagemententry')} />
        {accordian && <Filter handleStatus={(e)=>{setStatus(e.target.value)}} handleName={(e)=>{setName(e.target.value)}} nameValue={name} statusValue={status}  />}
        <CommonTable rows={rows} columns={columns} paginationModel={paginationModel} handleView={(data)=>console.log(data)} handleEdit={(data)=>console.log(data)} handleDelete={(data)=>console.log(data)} />
    </div>
  )
}

export default Product