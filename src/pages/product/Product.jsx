import React, { useEffect, useState } from 'react';
import Titlebar from '../../comnponents/titlebar/Titlebar';
import Filter from '../../comnponents/filter/Filter';
import { Autocomplete, Backdrop, Box, CircularProgress, Grid2, InputAdornment, MenuItem, Select, TextField, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CommonTable from '../../comnponents/table/CommonTable';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProductList } from './ProductReducer';
import { categoryList, subCategoryList } from '../../utils/helpers';

const Product = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [name, setName] = useState('');
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [status, setStatus] = useState('all');
  const [page, setPage] = useState(1);

  const reducer = useSelector((state) => state.productReducer);
  const { loader, getProduct } = reducer;

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [name, subCategory, status]);

  // Load data on filter change or page change
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      let query = `?page=${page}&limit=7`;
      if (name) query += `&name=${name}`;
      if (subCategory?.length > 0) query += `&subCategory=${subCategory}`;
      if (status && status !== 'all') query += `&status=${status}`;
      dispatch(getProductList(query));
    }, 500);
    return () => clearTimeout(debounceTimer);
  }, [name, subCategory, status, page, dispatch]);


  const columns = [
    { datakey: 'thumbnailImage', headerName: 'Img', size: 100, align: 'left' },
    { datakey: 'name', headerName: 'Product Name', size: 200 },
    { datakey: 'price', headerName: 'Price', size: 200, align: 'left' },
    { datakey: 'category', headerName: 'Category', size: 200, align: 'left' },
    { datakey: 'status', headerName: 'Status', size: 150, align: 'left' },
    { datakey: 'actions', headerName: 'Actions', size: 200, align: 'center' },
  ];


  const rows = getProduct?.data?.map((e) => ({
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
    navigate('/productmanagemententry');
  };

  const handleEdit = (e) => {
    sessionStorage.setItem("productId", e?.id);
    sessionStorage.setItem("Mode", "Edit");
    navigate('/productmanagemententry');
  };

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

      <Titlebar
        title={"Products List"}
        addBtn={true}
        addClick={() => {
          sessionStorage.setItem("Mode", "Add");
          navigate('/productmanagemententry');
        }}
      />

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
              {categoryList?.map((e, key) => {
                return (<MenuItem key={key} value={e?.value}>{e?.label}</MenuItem>)
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
              {category && subCategoryList[category]?.map((opt, key) => {
                return (<MenuItem key={key} value={opt.value} >{opt.label}</MenuItem>)
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

      <CommonTable
        rows={rows}
        columns={columns}
        handlePageChange={handlePageChange}
        page={page}
        count={getProduct?.pagination?.totalPages || 1}
        handleView={handleView}
        handleEdit={handleEdit}
        handleDelete={(data) => console.log(data)}
      />
    </div>
  );
};

export default Product;
