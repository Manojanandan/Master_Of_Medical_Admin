import React, { useEffect, useState } from 'react';
import Titlebar from '../../comnponents/titlebar/Titlebar';
import Filter from '../../comnponents/filter/Filter';
import { Alert, Autocomplete, Backdrop, Box, CircularProgress, Grid2, InputAdornment, MenuItem, Select, Snackbar, TextField, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CommonTable from '../../comnponents/table/CommonTable';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getCategory, getProductList, getSubCategory, removeProduct, resetMessage } from './ProductReducer';
import Modal from "../../comnponents/modal/Modal"

const Product = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [name, setName] = useState('');
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [status, setStatus] = useState('all');
  const [page, setPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false)
  const [openSnackbar, setOpenSnackbar] = useState(false);


  const reducer = useSelector((state) => state.productReducer);
  const { loader, getProduct, categoryData, subCategoryData, success, successMsg } = reducer;


  useEffect(() => {
    dispatch(getCategory());
  }, [])
  useEffect(() => {
    if (category !== "") {
      dispatch(getSubCategory(category));
    }
  }, [category]);

  useEffect(() => {
    if (success) {
      alert(success)
      setOpenSnackbar(!openSnackbar)
    }
  }, [success])

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [name, subCategory, status]);

  // Load data on filter change or page change
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      let query = `?page=${page}&limit=7`;
      if (name) query += `&name=${name}`;
      if (subCategory !== "" && subCategory?.length > 0) query += `&subCategory=${subCategory}`;
      if (status && status !== 'all') query += `&status=${status}`;
      dispatch(getProductList(query));
    }, 500);
    return () => clearTimeout(debounceTimer);
  }, [name, subCategory, status, page, dispatch]);


  const columns = [
    { datakey: 'thumbnailImage', headerName: 'Img', size: 100, align: 'left' },
    { datakey: 'name', headerName: 'Product Name', size: 200 },
    { datakey: 'price', headerName: 'Price', size: 200, align: 'center' },
    { datakey: 'category', headerName: 'Category', size: 200, align: 'left' },
    { datakey: 'status', headerName: 'Status', size: 150, align: 'left' },
    { datakey: 'actions', headerName: 'Actions', size: 200, align: 'center' },
  ];


  const rows = getProduct?.data?.map((e) => ({
    id: e?.id,
    thumbnailImage: e?.thumbnailImage,
    name: e?.name,
    category: e?.category,
    price: e?.price,
    status: e?.status,
  })) || [];

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleView = (e) => {
    sessionStorage.setItem("productId", e?.id);
    sessionStorage.setItem("Mode", "View");
    navigate('/productview');
  };

  const handleEdit = (e) => {
    sessionStorage.setItem("productId", e?.id);
    sessionStorage.setItem("Mode", "Edit");
    navigate('/productmanagemententry');
  };


  const handleDelete = (e) => {
    setDialogOpen(!dialogOpen)
    sessionStorage.setItem("tempRow", e?.id)
  }
  const deleteProduct = () => {
    setDialogOpen(!dialogOpen)
    dispatch(removeProduct(sessionStorage.getItem("tempRow")))
  }
  const handleClose = () => {
    setOpenSnackbar(!openSnackbar)
    sessionStorage.removeItem("tempRow")
    dispatch(getProductList(`?page=${page}&limit=7`));
    setPage(1)
  }
  const handleDropDownChange = (e) => {
    setCategory(e.target.value)
    setSubCategory([])
    if (e.target.value === "") {
      setSubCategory([])
    }
  }

  return (
    <div style={{ height: 'auto' }}>
      <Backdrop
        sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
        open={loader}
      >
        <CircularProgress color="secondary" />
      </Backdrop>
      {successMsg && <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={openSnackbar} autoHideDuration={500} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity={success ? "success" : "error"}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {successMsg}
        </Alert>
      </Snackbar>}

      <Titlebar
        title={"Products List"}
        addBtn={true}
        addClick={() => {
          sessionStorage.setItem("Mode", "Add");
          navigate('/productmanagemententry');
        }}
      />

      <CommonTable
        rows={rows}
        columns={columns}
        handlePageChange={handlePageChange}
        page={page}
        count={getProduct?.pagination?.totalPages || 1}
        handleView={(data) => handleView(data)}
        handleEdit={handleEdit}
        handleDelete={(data) => handleDelete(data)}
      >
        <Filter>
          <Grid2 container columnSpacing={2} rowSpacing={3}>
            <Grid2 item size={4}>
              <Typography variant='p' sx={{ fontWeight: 'bold' }}>
                Search with Name
              </Typography>
              <TextField
                sx={{ marginTop: '10px' }}
                id="search"
                fullWidth
                size="small"
                placeholder="Search with name"
                variant="outlined"
                value={name}
                onChange={(e) => setName(e.target.value)}
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
              <Typography variant='p' sx={{ fontWeight: 'bold' }}>Category</Typography>
              <Select
                sx={{ marginTop: '10px' }}
                id="category"
                size='small'
                name="category"
                value={category}
                onChange={handleDropDownChange}
                fullWidth
                displayEmpty
              >
                <MenuItem value="">Select Category</MenuItem>
                {categoryData?.data?.map((e, key) => {
                  return (<MenuItem key={key} value={e?.id}>{e?.name}</MenuItem>)
                })}
              </Select>
            </Grid2>

            <Grid2 item size={3}>
              <Typography variant='p' sx={{ fontWeight: 'bold' }}>Sub Category</Typography>
              <Select
                sx={{ marginTop: '10px' }}
                id="subCategory"
                size='small'
                name='subCategory'
                value={subCategory}
                onChange={(e) => setSubCategory(e.target.value)}
                fullWidth
                disabled={category === "" || category?.length == 0 ? true : false}
                displayEmpty
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 300,
                      overflowY: 'auto',
                      maxWidth: 200
                    },
                  },
                }}
              >
                <MenuItem value="" disabled>Select Subcategory</MenuItem>
                {subCategoryData?.data?.map((opt, key) => {
                  return (<MenuItem key={key} value={opt.id} >{opt.name}</MenuItem>)
                })}
              </Select>
            </Grid2>

            <Grid2 item size={2}>
              <Typography variant='p' sx={{ fontWeight: 'bold' }}>Status</Typography>
              <Select
                fullWidth
                size="small"
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
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
      </CommonTable>
      <Modal open={dialogOpen} close={() => { setDialogOpen(!dialogOpen) }} success={deleteProduct} content={"Are you sure you want to delete this product."} />
    </div>
  );
};

export default Product;
