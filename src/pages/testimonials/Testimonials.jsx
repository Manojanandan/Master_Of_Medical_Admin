import React, { useEffect, useState } from 'react'
import Titlebar from '../../comnponents/titlebar/Titlebar'
import { useNavigate } from 'react-router-dom'
import Filter from '../../comnponents/filter/Filter'
import CommonTable from '../../comnponents/table/CommonTable'
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Alert, Backdrop, CircularProgress, IconButton } from '@mui/material';
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
    navigate(`/testimonialsentry?testimonialId=${e.id}&&Mode=View`)
  }
  const handleEdit = (e) => {
    navigate(`/testimonialsentry?testimonialId=${e.id}&&Mode=Edit`)
  }
  const handleDelete = (e) => {
    dispatch(deleteTestimonialData(e.id))
  }

  const columns = [
    { field: 'id', headerName: 'ID', width: 110, align: 'center', sortable: false, headerAlign: 'center' },
    { field: 'name', headerName: 'Name', width: 220, sortable: false, },
    {
      field: 'designation',
      headerName: 'Designation',
      sortable: false,
      width: 200,
      align: 'left'
    },
    { field: 'message', headerName: 'Message', width: 320, sortable: false, },
    {
      field: 'actions',
      headerName: 'Actions',
      sortable: false,
      width: 180,
      headerAlign: 'center',
      renderCell: (params) => (
        <div style={{ textAlign: 'center' }}>
          <IconButton
            onClick={() => handleView(params.row)}
            sx={{
              color: "#f09407",
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
      <Titlebar title={"Testimonials"} filter={true} onClick={() => setAccordian(!accordian)} addClick={() => navigate('/testimonialsentry?Mode=Add')} />
      {successMsg &&
        <Alert variant="filled" severity="success" sx={{ margin: '15px auto', width: '95%', fontSize: '16px' }}>
          {successMsg}
        </Alert>
      }
      {accordian && <Filter handleStatus={(e) => { setStatus(e.target.value) }} handleName={(e) => { setName(e.target.value) }} nameValue={name} statusValue={status} nameOptions={nameOptions} />}
      <CommonTable rows={rows} columns={columns} handlePageChange={handlePageChange} page={page} count={pagination?.totalPages} />
    </div>
  )
}

export default Testimonials