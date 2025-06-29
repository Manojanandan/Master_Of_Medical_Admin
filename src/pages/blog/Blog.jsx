import React, { useEffect, useState } from 'react'
import Titlebar from '../../comnponents/titlebar/Titlebar'
import { useNavigate } from 'react-router-dom'
import Filter from '../../comnponents/filter/Filter'
import CommonTable from '../../comnponents/table/CommonTable'
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Alert, Backdrop, CircularProgress, IconButton} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDispatch, useSelector } from 'react-redux'
import { deleteBlogData, getBlogData, resetMessage } from './BlogReducer'

const Blog = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [name, setName] = useState('')
  const [status, setStatus] = useState('')
  const [accordian, setAccordian] = useState(false)
  const [page, setPage] = useState(1)
  // const [contentReceiver, setContentReceiver] = useState("");

  const reducerResponse = useSelector((state) => state.blog)
  const blogData = reducerResponse?.getAllBog?.data
  const pagination = reducerResponse?.getAllBog?.pagination
  const Load = reducerResponse?.load
  const successMsg = reducerResponse?.message

  useEffect(() => {
    dispatch(resetMessage())
    dispatch(getBlogData(page))
  }, [])


  useEffect(() => {
    if (successMsg) {
      const timer = setTimeout(() => {
        dispatch(resetMessage())
        dispatch(getBlogData())
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [successMsg, navigate]);

  const handleView = (e) => {
    navigate(`/blogentry?blogId=${e?.id}&&Mode=View`)
  }
  const handleEdit = (e) => {
    navigate(`/blogentry?blogId=${e?.id}&&Mode=Edit`)
  }
  const handleDelete = (e) => {
    dispatch(deleteBlogData(e?.id))
  }

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
    { datakey: 'id', headerName: 'ID', size: 100, align: 'center', align: 'center' },
    { datakey: 'title', headerName: 'Title', size: 250,  },
    { datakey: 'author', headerName: 'Author', size: 250,  }, 
    {
      datakey: 'actions',
      headerName: 'Actions',
      size: 200,
    },
  ];

  const rows = blogData?.map((e) => {   
    return (
      {
        id: e?.id,
        title: e?.title,
        author: e?.author,
        metaTitle: e?.metaTitle,
        metaDescription: e?.metaDescription
      }
    )
  })

  const handlePageChange = (event, value) => {
    setPage(value);
    dispatch(getBlogData(value))
  };

  return (
    <div style={{ height: '100vh' }}>
      <Backdrop
        sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
        open={Load}
      >
        <CircularProgress color="secondary" />
      </Backdrop>
      <Titlebar title={"Blog Management"} filter={true} onClick={() => setAccordian(!accordian)} addClick={() => navigate('/blogentry?Mode=Add')} />
      {successMsg &&
        <Alert variant="filled" severity="success" sx={{ margin: '15px auto', width: '95%', fontSize: '16px' }}>
          {successMsg}
        </Alert>
      }
      {accordian && <Filter handleStatus={(e) => { setStatus(e.target.value) }} handleName={(e) => { setName(e.target.value) }} nameValue={name} statusValue={status} nameOptions={nameOptions} />}
      <CommonTable rows={rows} columns={columns} handlePageChange={handlePageChange} page={page} count={pagination?.totalPages} handleView={(e)=>handleView(e)} handleEdit={(e)=>handleEdit(e)} handleDelete={(e)=>handleDelete(e)} />
    </div>
  )
}

export default Blog