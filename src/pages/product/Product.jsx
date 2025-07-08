import React, { useEffect, useState } from 'react'
import Titlebar from '../../comnponents/titlebar/Titlebar'
import Filter from '../../comnponents/filter/Filter'
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Autocomplete, Backdrop, Box, CircularProgress, Grid2, IconButton, InputAdornment, MenuItem, Select, TextField, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete'
import SearchIcon from '@mui/icons-material/Search';;
import CommonTable from '../../comnponents/table/CommonTable'
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProductList } from './ProductReducer';
import { stateList } from '../../utils/helpers'

const Product = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [name, setName] = useState('')
  const [userType, setUserType] = useState('')
  const [status, setStatus] = useState('all')
  const [page, setPage] = useState(1)
  const [state, setState] = useState(null)
 

  const reducer = useSelector((state) => state.productReducer)
  const { loader, getProduct } = reducer
   const [filteredData,setFilteredData]=useState(getProduct?.data)

  useEffect(() => {
    dispatch(getProductList(`?page=1&limit=7`))
  }, [])

  useEffect(()=>{
    const query = ''
    if(status || status==="all"){
      query += `&status=${status}`
    }
    setFilteredData(query)
  },[state,status])

  const columns = [
    { datakey: 'id', headerName: 'ID', size: 100, align: 'left', },
    { datakey: 'name', headerName: 'Product Name', size: 200, },
    { datakey: 'brandName', headerName: 'Brand', size: 200, align: 'left' },
    {
      datakey: 'category',
      headerName: 'Category',
      size: 200,
      align: 'left'
    },
    {
      datakey: 'status',
      headerName: 'Status',
      size: 150,
      align: 'left'
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
    dispatch(getProductList(`?page=${value}&limit=7${filteredData}`))
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
      <Titlebar title={"Products List"} addBtn={true} addClick={() => { navigate('/productmanagemententry'), sessionStorage.setItem("Mode", "Add") }} />
      <Filter>
        <Grid2 container columnSpacing={2} rowSpacing={3}>
          <Grid2 item size={4}>
            <Typography variant='p' sx={{ fontWeight: 'bold' }}>Search for (Name,Email and Mobile No)</Typography>
            <TextField
              sx={{ marginTop: '10px' }}
              id="search"
              fullWidth
              size="small"
              placeholder="Search by anything"
              variant="outlined"
              value={name}
              onChange={(e) => { setName(e.target.value) }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid2>
          <Grid2 item size={3}>
            <Typography variant='p' sx={{ fontWeight: 'bold' }}>User Type</Typography>
            <TextField id='userType' value={userType} onChange={(e) => setUserType(e.target.value)} placeholder='User type' name='userType' fullWidth size='small' sx={{ marginTop: '10px' }} />
          </Grid2>
          <Grid2 item size={3}>
            <Typography variant='p' sx={{ fontWeight: 'bold' }}>State</Typography>
            <Autocomplete
              id="state"
              fullWidth
              size="small"
              sx={{ marginTop: '10px' }}
              options={stateList}
              autoHighlight
              getOptionLabel={(option) => option}
              onChange={(event, value) => {
                setState(value); // This gives you "Tamil Nadu" if selected
              }}
              renderOption={(props, option) => {
                const { key, ...optionProps } = props;
                return (
                  <Box
                    key={key}
                    component="li"
                    sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
                    {...optionProps}
                  >
                    {option}
                  </Box>
                );
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  size="small"
                  autoComplete="off"
                  placeholder="Select State"
                />
              )}
            />
          </Grid2>
          <Grid2 item size={2}>
            <Typography variant='p' sx={{ fontWeight: 'bold' }}>Status</Typography>
            <Select
              fullWidth
              size="small"
              id="status"
              value={status}
              onChange={(e) => { setStatus(e.target.value) }}
              sx={{ marginTop: '10px' }}
            >

              <MenuItem value={"all"}>All</MenuItem>
              <MenuItem value={"pending"}>Pending</MenuItem>
              <MenuItem value={"approved"}>Approved</MenuItem>
              <MenuItem value={"rejected"}>Rejected</MenuItem>
            </Select>
          </Grid2>
        </Grid2>
      </Filter>
      <CommonTable rows={rows} columns={columns} handlePageChange={handlePageChange} page={page} count={getProduct?.pagination?.totalPages} handleView={(data) => handleView(data)} handleEdit={(data) => handleEdit(data)} handleDelete={(data) => console.log(data)} />
    </div>
  )
}

export default Product