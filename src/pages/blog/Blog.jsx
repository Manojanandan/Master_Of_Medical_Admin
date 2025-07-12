import React, { useEffect, useState } from 'react'
import Titlebar from '../../comnponents/titlebar/Titlebar'
import { useNavigate } from 'react-router-dom'
import Filter from '../../comnponents/filter/Filter'
import CommonTable from '../../comnponents/table/CommonTable'
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Alert, Backdrop, CircularProgress, Grid2, IconButton, InputAdornment, Snackbar, TextField, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDispatch, useSelector } from 'react-redux'
import { deleteBlogData, getBlogData, resetMessage } from './BlogReducer'
import SearchIcon from '@mui/icons-material/Search';
import { stripHtmlTags } from '../../utils/helpers'

const Blog = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [page, setPage] = useState(1)
  const [openSnackbar, setOpenSnackbar] = useState(false);
  // const [contentReceiver, setContentReceiver] = useState("");

  const reducerResponse = useSelector((state) => state.blog)
  const blogData = reducerResponse?.getAllBog?.data
  const pagination = reducerResponse?.getAllBog?.pagination
  const Load = reducerResponse?.load
  const successMsg = reducerResponse?.message
  const success = reducerResponse?.success

  useEffect(() => {
    dispatch(resetMessage())
    // dispatch(getBlogData(page))
  }, [])

  useEffect(() => {
    setPage(1)
  }, [title, author,])
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      let query = `?page=${page}&limit=6`;
      if (title) query += `&title=${title}`;
      if (author) query += `&type=${author}`;
      dispatch(getBlogData(query));
    }, 500);
    return () => clearTimeout(debounceTimer);
  }, [author, title, page, dispatch]);


  useEffect(() => {
    if (successMsg) {
      const timer = setTimeout(() => {
        dispatch(resetMessage())
        dispatch(getBlogData(`?page=1&limit=6`))
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [successMsg, navigate]);

  const handleView = (e) => {
    navigate(`/blogview`)
    sessionStorage.setItem("blogId", e?.id)
    sessionStorage.setItem("Mode", "View")
  }
  const handleEdit = (e) => {
    navigate(`/blogentry?blogId=${e?.id}&&Mode=Edit`)
  }
  const handleDelete = (e) => {
    dispatch(deleteBlogData(e?.id))
    setOpenSnackbar(true)
    setPage(1)
  }


  const columns = [
    { datakey: 'id', headerName: 'ID', size: 100, align: 'left' },
    { datakey: 'title', headerName: 'Title', size: 250, },
    { datakey: 'author', headerName: 'Author', size: 200, },
    { datakey: 'content', headerName: 'Blog Content', size: 350, },
    {
      datakey: 'actions',
      headerName: 'Actions',
      size: 200,
      align: 'center'
    },
  ];

  const rows = blogData?.map((e) => {
    return (
      {
        id: e?.id,
        title: e?.title,
        author: e?.author,
        content: stripHtmlTags(e?.content),
      }
    )
  }) || []

  const handlePageChange = (event, value) => {
    setPage(value);
    // dispatch(getBlogData(value))
  };

  const handleClose = () => {
    setOpenSnackbar(!openSnackbar)
    dispatch(getBlogData(`?page=${page}&limit=6`))
    setPage(1)
  }

  return (
    <div style={{ height: '100vh' }}>
      <Backdrop
        sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
        open={Load}
      >
        <CircularProgress color="secondary" />
      </Backdrop>
      <Titlebar title={"Blog Management"} addBtn={true} addClick={() => navigate('/blogentry?Mode=Add')} />
      {successMsg && <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={openSnackbar} autoHideDuration={2000} onClose={handleClose}>
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
            <Typography variant='p' sx={{ fontWeight: 'bold' }}>Search with Title</Typography>
            <TextField
              sx={{ marginTop: '10px' }}
              id="search"
              fullWidth
              size="small"
              placeholder="Search with title"
              variant="outlined"
              value={title}
              onChange={(e) => { setTitle(e.target.value) }}
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
            <Typography variant='p' sx={{ fontWeight: 'bold' }}>Author</Typography>
            <TextField
              sx={{ marginTop: '10px' }}
              id="search"
              fullWidth
              size="small"
              placeholder="Search with author"
              variant="outlined"
              value={author}
              onChange={(e) => { setAuthor(e.target.value) }}
            />
          </Grid2>
        </Grid2>
      </Filter>
      <CommonTable rows={rows} columns={columns} handlePageChange={handlePageChange} page={page} count={pagination?.totalPages} handleView={(e) => handleView(e)} handleEdit={(e) => handleEdit(e)} handleDelete={(e) => handleDelete(e)} />
    </div>
  )
}

export default Blog