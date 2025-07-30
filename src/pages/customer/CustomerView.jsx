import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getOneCustomer, modifyCustomer, resetMessage } from './CustomerReducer'
import { Alert, Avatar, Backdrop, Box, Button, CircularProgress, Grid2, IconButton, MenuItem, Paper, Select, Snackbar, TextareaAutosize, Typography } from '@mui/material'
import Titlebar from '../../comnponents/titlebar/Titlebar'
import { useNavigate } from 'react-router-dom'
import JpgIcon from '../../assets/JpgIcon.png'
import JpegIcon from '../../assets/JpegIcon.png'
import ExcelIcon from '../../assets/ExcelIcon.jpg'
import WordIcon from '../../assets/WordIcon.jpg'
import PngIcon from '../../assets/PngIcon.png'
import PDFIcon from '../../assets/PDFIcon.png'
import EditRoundedIcon from '@mui/icons-material/EditRounded';

const CustomerView = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [editFlag, setEditFlag] = useState(false)
  const [status, setStatus] = useState("all")
  const [remarks, setRemarks] = useState(null)
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [errMsg, setErrMsg] = useState({ status: "", remarks: "" })

  const reducer = useSelector((state) => state.customerReducer)
  const { listOneCustomer, loader, success, message } = reducer

  useEffect(() => {
    dispatch(resetMessage())
  }, [])

  useEffect(() => {
    if (sessionStorage.getItem("customerId")) {
      dispatch(getOneCustomer(sessionStorage.getItem("customerId")))
    }
  }, [sessionStorage.getItem("customerId")])

  useEffect(() => {
    if (message !== "" && message !== undefined) {
      setOpenSnackbar(true)
    }
  }, [message])

  const handleEdit = () => {
    setEditFlag(!editFlag)
    setStatus('all')
    setRemarks("")
  }
  const handleClose = () => {
    setOpenSnackbar(!openSnackbar)
    if (success) {
      sessionStorage.removeItem("customerId")
      navigate('/customer')
    }
    dispatch(resetMessage())
  }

  const updateVendor = async () => {
    if (status === "all") {
      setErrMsg({ ...errMsg, status: "Select any status" })
    } else if (status === "rejected" && remarks === "") {
      setErrMsg({ ...errMsg, remarks: "Remarks is required" })
    } else {
      const formData = new FormData()
      formData.append("id", listOneCustomer?.data?.id)
      formData.append("userName", listOneCustomer?.data?.userName)
      formData.append("name", listOneCustomer?.data?.name)
      formData.append("email", listOneCustomer?.data?.email)
      formData.append("phone", listOneCustomer?.data?.phone)
      formData.append("type", listOneCustomer?.data?.type)
      formData.append("address", listOneCustomer?.data?.address)
      formData.append("country", listOneCustomer?.data?.country)
      formData.append("state", listOneCustomer?.data?.state)
      formData.append("city", listOneCustomer?.data?.city)
      formData.append("postalCode", listOneCustomer?.data?.postalCode)
      formData.append("status", status ?? listOneCustomer?.data?.status)
      formData.append("remarks", remarks ?? listOneCustomer?.data?.remarks)
      formData.append("files", listOneCustomer?.data?.files)

      dispatch(modifyCustomer(formData))
    }
  }


  return (
    <div>
      <Backdrop
        sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
        open={loader}
      >
        <CircularProgress color="secondary" />
      </Backdrop>
      {message && <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={openSnackbar} autoHideDuration={1000} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity={success ? "success" : "error"}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {message}
        </Alert>
      </Snackbar>}
      <Titlebar title={"Customer Details"} back={true} backClick={() => { navigate('/customer'), sessionStorage.removeItem("customerId") }} />
      <Paper elevation={5} sx={{ borderRadius: '10px', padding: '2% 3%', margin: '3% auto', width: '95%' }}>
        <Box sx={{ padding: '10px', width: '100%', borderBottom: 'solid 1px #2424', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant='p' component='div' sx={{ fontSize: '20px', fontWeight: 'bold', color: '#1976d2' }}>Personal Information</Typography>
          <Avatar sx={{ backgroundColor: '#1976d2' }} onClick={handleEdit}>
            <IconButton>
              <EditRoundedIcon sx={{ color: '#fff' }} />
            </IconButton>
          </Avatar>
        </Box>
        <Box sx={{ height: 'auto', width: '100%', margin: '2% 0', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Box sx={{ width: '100%', height: '100%', padding: '0 10px' }}>
            <Grid2 container rowSpacing={3} columnSpacing={2}>
              <Grid2 item size={4}>
                <Typography variant='p' component='div' sx={{ fontSize: '15px', color: '#22442280' }}>User Name</Typography>
                <Typography variant='p' component='div' sx={{ fontSize: '18px', textTransform: 'capitalize' }}>{listOneCustomer?.data?.userName ?? "-"}</Typography>
              </Grid2>
              <Grid2 item size={4}>
                <Typography variant='p' component='div' sx={{ fontSize: '15px', color: '#22442280' }}>Name</Typography>
                <Typography variant='p' component='div' sx={{ fontSize: '18px', textTransform: 'capitalize' }}>{listOneCustomer?.data?.name ?? "-"}</Typography>
              </Grid2>
              <Grid2 item size={4}>
                <Typography variant='p' component='div' sx={{ fontSize: '15px', color: '#22442280' }}>Email</Typography>
                <Typography variant='p' component='div' sx={{ fontSize: '18px', }}>{listOneCustomer?.data?.email ?? "-"}</Typography>
              </Grid2>
              <Grid2 item size={4}>
                <Typography variant='p' component='div' sx={{ fontSize: '15px', color: '#22442280' }}>Mobile No</Typography>
                <Typography variant='p' component='div' sx={{ fontSize: '18px', }}>{listOneCustomer?.data?.phone ?? '-'}</Typography>
              </Grid2>
              <Grid2 item size={4}>
                <Typography variant='p' component='div' sx={{ fontSize: '15px', color: '#22442280' }}>User type</Typography>
                <Typography variant='p' component='div' sx={{ fontSize: '18px', textTransform: 'capitalize' }}>{listOneCustomer?.data?.type ?? "-"}</Typography>
              </Grid2>
              <Grid2 item size={4}>
                <Typography variant='p' component='div' sx={{ fontSize: '15px', color: '#22442280' }}>Address</Typography>
                <Typography variant='p' component='div' sx={{ fontSize: '18px', textTransform: 'capitalize' }}>{listOneCustomer?.data?.address ?? "-"}</Typography>
              </Grid2>
              <Grid2 item size={4}>
                <Typography variant='p' component='div' sx={{ fontSize: '15px', color: '#22442280' }}>Country</Typography>
                <Typography variant='p' component='div' sx={{ fontSize: '18px', textTransform: 'capitalize' }}>{listOneCustomer?.data?.country ?? "-"}</Typography>
              </Grid2>
              <Grid2 item size={4}>
                <Typography variant='p' component='div' sx={{ fontSize: '15px', color: '#22442280' }}>State</Typography>
                <Typography variant='p' component='div' sx={{ fontSize: '18px', textTransform: 'capitalize' }}>{listOneCustomer?.data?.state ?? "-"}</Typography>
              </Grid2>
              <Grid2 item size={4}>
                <Typography variant='p' component='div' sx={{ fontSize: '15px', color: '#22442280' }}>City</Typography>
                <Typography variant='p' component='div' sx={{ fontSize: '18px', textTransform: 'capitalize' }}>{listOneCustomer?.data?.city ?? "-"}</Typography>
              </Grid2>
              <Grid2 item size={4}>
                <Typography variant='p' component='div' sx={{ fontSize: '15px', color: '#22442280' }}>Postal Code</Typography>
                <Typography variant='p' component='div' sx={{ fontSize: '18px', textTransform: 'capitalize' }}>{listOneCustomer?.data?.postalCode ?? "-"}</Typography>
              </Grid2>
              <Grid2 item size={4}>
                <Typography variant='p' component='div' sx={{ fontSize: '15px', color: '#22442280' }}>Status</Typography>
                {/* <Typography variant='p' component='div' sx={{ fontSize: '18px', textTransform: 'capitalize', color: `${listOneCustomer?.data?.status == "active" ? "green" : "red"}`, fontWeight: 'bold' }}>{listOneCustomer?.data?.status}</Typography> */}
                {!editFlag ?
                  <Typography variant='p' component='div' sx={{ fontSize: '18px', textTransform: 'capitalize', color: `${listOneCustomer?.data?.status == "approved" ? "green" : listOneCustomer?.data?.status == "rejected" ? "red" : "orange"}`, fontWeight: 'bold' }}>{listOneCustomer?.data?.status}</Typography>
                  :
                  <>
                    <Select
                      fullWidth
                      size="small"
                      id="status"
                      value={status}
                      onChange={(e) => { setStatus(e.target.value), setErrMsg({ ...errMsg, status: "" }) }}
                      sx={{ marginTop: '5px' }}
                    >

                      <MenuItem value={"all"}>All</MenuItem>
                      <MenuItem value={"pending"}>Pending</MenuItem>
                      <MenuItem value={"approved"}>Approved</MenuItem>
                      <MenuItem value={"rejected"}>Rejected</MenuItem>
                    </Select>
                    {errMsg.status && <Typography variant='p' component='div' sx={{ fontSize: '14px', color: 'red' }} >{errMsg.status}</Typography>}
                  </>
                }
              </Grid2>
              {listOneCustomer?.data?.status === "rejected" && !editFlag &&
                <Grid2 item size={4}>
                  <Typography variant='p' component='div' sx={{ fontSize: '15px', color: '#22442280' }}>Remarks</Typography>
                  <Typography variant='p' component='div' sx={{ fontSize: '18px', textTransform: 'capitalize' }}>{listOneCustomer?.data?.remarks ?? "-"}</Typography>
                </Grid2>
              }
              <Grid2 item size={8}>
                <Typography variant='p' component='div' sx={{ fontSize: '15px', color: '#22442280' }}>Documents</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginTop: '5px' }}>
                  {listOneCustomer?.data?.files?.length > 0 ? listOneCustomer?.data?.files?.map((fileUrl, index) => {
                    const fileName = fileUrl.split('/').pop();
                    const actualFileName = fileName.replace(/^\d+-/, '');
                    const fileFormat = actualFileName.split('.')[1]
                    return (
                      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '5px' }} key={index}>
                        <img src={fileFormat === "jpg" ? JpgIcon : fileFormat === "jpeg" ? JpegIcon : fileFormat === "docx" ? WordIcon : fileFormat === "png" ? PngIcon : fileName === "pdf" ? PDFIcon : ExcelIcon} alt={JpgIcon} style={{ height: '20px', width: '20px' }} />
                        <a
                          href={fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: '#0ea398', textDecoration: 'underline', fontWeight: 'bold' }}
                        >
                          {actualFileName}
                        </a>
                      </Box>

                    )
                  }) :
                    "-"}
                </Box>
              </Grid2>
              {status === "rejected" &&
                <>
                  <Grid2 item size={8}>
                    <Typography variant='p' component='div' sx={{ fontSize: '15px', color: '#22442280' }}>Remarks</Typography>
                    <TextareaAutosize
                      id='remarks'
                      value={remarks}
                      style={{ width: '100%', fontSize: '16px', padding: '15px 20px 0', backgroundColor: '#f8fafc' }}
                      maxRows={4}
                      minRows={3}
                      onChange={(e) => { setRemarks(e.target.value), setErrMsg({ ...errMsg, remarks: "" }) }}
                    />
                    {errMsg.remarks && <Typography variant='p' component='div' sx={{ fontSize: '14px', color: 'red' }} >{errMsg.remarks}</Typography>}
                  </Grid2>
                </>
              }
              {editFlag && <Grid2 item size={12}>
                <Button onClick={updateVendor} variant='contained' sx={{ backgroundColor: "#0ea398", marginRight: '15px' }}>update</Button>
                <Button onClick={handleEdit} variant='contained' sx={{ backgroundColor: "#2424", color: 'black' }}>clear</Button>
              </Grid2>}
            </Grid2>
          </Box>
        </Box>
      </Paper>
    </div>
  )
}

export default CustomerView