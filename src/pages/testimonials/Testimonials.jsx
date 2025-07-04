import React, { useEffect, useState } from 'react'
import Titlebar from '../../comnponents/titlebar/Titlebar'
import { useNavigate } from 'react-router-dom'
import Filter from '../../comnponents/filter/Filter'
import CommonTable from '../../comnponents/table/CommonTable'
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Alert, Backdrop, CircularProgress, IconButton, Snackbar } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { deleteTestimonialData, getDataTestimonial, resetMessage } from './TestimonialReducer'
import { useDispatch, useSelector } from 'react-redux'

const Testimonials = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [name, setName] = useState('')
  const [status, setStatus] = useState('')
  const [accordian, setAccordian] = useState(false)
  const [page, setPage] = useState(1)
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const nameOptions = [
    {
      label: "Select Name",
      value: "Select Name"
    },
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

  const reducerResponse = useSelector((state) => state.testimonial)


  const tableData = reducerResponse?.getTestimonialData?.data
  const pagination = reducerResponse?.getTestimonialData?.pagination
  const Load = reducerResponse?.loader
  const successMsg = reducerResponse?.message
  const success = reducerResponse?.success


  useEffect(() => {
    dispatch(getDataTestimonial(page))
    dispatch(resetMessage())
    setName(nameOptions[0].value)
  }, [])

  useEffect(() => {
    if (successMsg) {
      const timer = setTimeout(() => {
        dispatch(resetMessage())
        dispatch(getDataTestimonial())
      }, 1000);

      return () => clearTimeout(timer); // cleanup
    }
  }, [successMsg, navigate]);

  const handleView = (e) => {
    navigate(`/testimonialsentry`)
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
    { datakey: 'id', headerName: 'ID', size: 100, align: 'center', align: 'center' },
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
  })

  const handlePageChange = (event, value) => {
    setPage(value);
    dispatch(getDataTestimonial(value))
  };

  return (
    <div style={{ height: '93vh' }}>
      <Backdrop
        sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
        open={Load}
      >
        <CircularProgress color="secondary" />
      </Backdrop>
      <Titlebar title={"Testimonials"} filter={true} onClick={() => setAccordian(!accordian)} addClick={() => { navigate('/testimonialsentry'), sessionStorage.setItem("Mode", "Add") }} />
      {successMsg && <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={openSnackbar} autoHideDuration={3000} onClose={() => setOpenSnackbar(!openSnackbar)}>
        <Alert
          onClose={() => setOpenSnackbar(!openSnackbar)}
          severity={success ? "success" : "error"}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {successMsg}
        </Alert>
      </Snackbar>}
      {accordian && <Filter handleStatus={(e) => { setStatus(e.target.value) }} handleName={(e) => { setName(e.target.value) }} nameValue={name} statusValue={status} nameOptions={nameOptions} />}
      <CommonTable rows={rows} columns={columns} handlePageChange={handlePageChange} page={page} count={pagination?.totalPages} handleView={(e) => handleView(e)} handleEdit={(e) => handleEdit(e)} handleDelete={(e) => handleDelete(e)} />
    </div>
  )
}

export default Testimonials