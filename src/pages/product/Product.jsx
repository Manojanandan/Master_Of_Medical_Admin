import React, { useState } from 'react'
import Titlebar from '../../comnponents/titlebar/Titlebar'
import Filter from '../../comnponents/filter/Filter'
import VisibilityIcon from '@mui/icons-material/Visibility';
import { IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CommonTable from '../../comnponents/table/CommonTable'
import { useNavigate } from 'react-router-dom';

const Product = () => {
    const navigate = useNavigate()
    const [name,setName]=useState('')
    const [status,setStatus]=useState('')
    const [accordian,setAccordian] = useState(false)

  const nameOptions = [
    {
      label: "Manoj",
      value: "Manoj"
    },
    {
      label: "Sanjay",
      value: "Sanjay"
    },
    {
      label: "Dhanush",
      value: "Dhanush"
    },
    {
      label: "Naveen",
      value: "Naveen"
    },
  ]


    const columns = [
        { field: 'id', headerName: 'ID', width: 70,align:'center', sortable: false, headerAlign: 'center'},
        { field: 'productName', headerName: 'Product Name', width: 200, sortable: false, },
        { field: 'brand', headerName: 'Brand', width: 200, sortable: false, },
        {
          field: 'description',
          headerName: 'Description',
          sortable: false,
          width: 250,
          align:'left'
        },
        {
          field: 'price',
          headerName: 'Price',
          sortable: false,
          width: 160,
        },
        {
          field: 'actions',
          headerName: 'Actions',
          sortable: false,
          width: 160,
          renderCell: (params) => (
            <div>
              <IconButton
                onClick={() => handleView(params.row)}
                sx={{
                  color:"#f09407",
                }}
              >
                <VisibilityIcon />
              </IconButton>
              <IconButton color="primary" onClick={() => handleEdit(params.row)}>
              <EditIcon />
            </IconButton>
            <IconButton color="error" onClick={() => handleDelete(params.row)}>
              <DeleteIcon />
            </IconButton>
            </div>
          )
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
      
      const paginationModel = { page: 0, pageSize: 10 };
  return (
    <div style={{height:'93vh'}}>
        <Titlebar title={"Product Management"} filter={true} onClick={()=>setAccordian(!accordian)} addClick={()=>navigate('/productmanagemententry')} />
        {accordian && <Filter handleStatus={(e)=>{setStatus(e.target.value)}} handleName={(e)=>{setName(e.target.value)}} nameValue={name} statusValue={status} nameOptions={nameOptions}  />}
        <CommonTable rows={rows} columns={columns} paginationModel={paginationModel} />
    </div>
  )
}

export default Product