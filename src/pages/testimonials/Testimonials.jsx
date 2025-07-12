import React, { useEffect, useState } from 'react'
import Titlebar from '../../comnponents/titlebar/Titlebar'
import { useNavigate } from 'react-router-dom'
import Filter from '../../comnponents/filter/Filter'
import CommonTable from '../../comnponents/table/CommonTable'
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Alert, Backdrop, CircularProgress, Grid2, IconButton, InputAdornment, Snackbar, TextField, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { deleteTestimonialData, getDataTestimonial, resetMessage } from './TestimonialReducer'
import { useDispatch, useSelector } from 'react-redux';
import SearchIcon from '@mui/icons-material/Search';

const Testimonials = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [name, setName] = useState('')
  const [designation, setDesignation] = useState('')
  const [page, setPage] = useState(1)
  const [openSnackbar, setOpenSnackbar] = useState(false);


  const reducerResponse = useSelector((state) => state.testimonial)


  const tableData = reducerResponse?.getTestimonialData?.data
  const pagination = reducerResponse?.getTestimonialData?.pagination
  const Load = reducerResponse?.loader
  const successMsg = reducerResponse?.message
  const success = reducerResponse?.success


  useEffect(() => {
    // dispatch(getDataTestimonial(page))
    dispatch(resetMessage())
  }, [])

  useEffect(() => {
    setPage(1)
  }, [designation, name,])

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      let query = `?page=${page}&limit=6`;
      if (name) query += `&name=${name}`;
      if (designation) query += `&type=${designation}`;
      dispatch(getDataTestimonial(query));
    }, 500);
    return () => clearTimeout(debounceTimer);
  }, [designation, name, page, dispatch]);

  useEffect(() => {
    if (successMsg) {
      const timer = setTimeout(() => {
        dispatch(resetMessage())
        dispatch(getDataTestimonial(`?page=1&limit=6`))
      }, 1000);

      return () => clearTimeout(timer); // cleanup
    }
  }, [successMsg, navigate]);

  const handleView = (e) => {
    navigate(`/testimonialview`)
    sessionStorage.setItem("testimonialId", e.id)
    sessionStorage.setItem("Mode", "View")
  }
  const handleEdit = (e) => {
    navigate(`/testimonialsentry`)
    sessionStorage.setItem("testimonialId", e.id)
    sessionStorage.setItem("Mode", "Edit")
  }
  const handleDelete = (e) => {
    dispatch(deleteTestimonialData(e.id))
    setOpenSnackbar(true)
  }

  const columns = [
    { datakey: 'id', headerName: 'ID', size: 100, align: 'left' },
    { datakey: 'name', headerName: 'Name', size: 250, },
    {
      datakey: 'designation',
      headerName: 'Designation',
      size: 250,
      align: 'left'
    },
    { datakey: 'message', headerName: 'Message', size: 350 },
    {
      datakey: 'actions',
      headerName: 'Actions',
      size: 180,
      align: 'center',
    },
  ];

  const rows = tableData?.map((e) => {
    return ({
      id: e.id,
      name: e.name,
      message: e.message,
      designation: e.designation
    })
  }) || []

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleClose = () => {
    setOpenSnackbar(!openSnackbar)
    dispatch(getDataTestimonial(`?page=${page}&limit=6`))
    setPage(1)
  }

  return (
    <div style={{ height: '93vh' }}>
      <Backdrop
        sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
        open={Load}
      >
        <CircularProgress color="secondary" />
      </Backdrop>
      <Titlebar title={"Testimonials"} addBtn={true} addClick={() => { navigate('/testimonialsentry'), sessionStorage.setItem("Mode", "Add") }} />
      {successMsg && <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={openSnackbar} autoHideDuration={3000} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity={success ? "success" : "error"}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {successMsg}
        </Alert>
      </Snackbar>}
      <Filter>
        <Grid2 container columnSpacing={2} rowSpacing={3}>
          <Grid2 item size={4}>
            <Typography variant='p' sx={{ fontWeight: 'bold' }}>Search with Name</Typography>
            <TextField
              sx={{ marginTop: '10px' }}
              id="search"
              fullWidth
              size="small"
              placeholder="Search with name"
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
          <Grid2 item size={4}>
            <Typography variant='p' sx={{ fontWeight: 'bold' }}>Designation</Typography>
            <TextField
              sx={{ marginTop: '10px' }}
              id="search"
              fullWidth
              size="small"
              placeholder="Search with designation"
              variant="outlined"
              value={designation}
              onChange={(e) => { setDesignation(e.target.value) }}
            />
          </Grid2>
        </Grid2>
      </Filter>
      <CommonTable rows={rows} columns={columns} handlePageChange={handlePageChange} page={page} count={pagination?.totalPages} handleView={(e) => handleView(e)} handleEdit={(e) => handleEdit(e)} handleDelete={(e) => handleDelete(e)} />
    </div>
  )
}

export default Testimonials