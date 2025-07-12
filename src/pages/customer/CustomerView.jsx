import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getOneCustomer } from './CustomerReducer'
import { Backdrop, Box, CircularProgress, Grid2, Paper, Typography } from '@mui/material'
import Titlebar from '../../comnponents/titlebar/Titlebar'
import { useNavigate } from 'react-router-dom'
import JpgIcon from '../../assets/JpgIcon.png'
import JpegIcon from '../../assets/JpegIcon.png'
import ExcelIcon from '../../assets/ExcelIcon.jpg'
import WordIcon from '../../assets/WordIcon.jpg'
import PngIcon from '../../assets/PngIcon.png'
import PDFIcon from '../../assets/PDFIcon.png'

const CustomerView = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const reducer = useSelector((state) => state.customerReducer)
  const { listOneCustomer, loader } = reducer

  useEffect(() => {
    if (sessionStorage.getItem("customerId")) {
      dispatch(getOneCustomer(sessionStorage.getItem("customerId")))
    }
  }, [sessionStorage.getItem("customerId")])
  console.log(listOneCustomer);

  return (
    <div>
      <Backdrop
        sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
        open={loader}
      >
        <CircularProgress color="secondary" />
      </Backdrop>
      <Titlebar title={"Customer Details"} back={true} backClick={() => { navigate('/customer'), sessionStorage.removeItem("customerId") }} />
      <Paper elevation={5} sx={{ borderRadius: '10px', padding: '2% 3%', margin: '3% auto', width: '95%' }}>
        <Box sx={{ padding: '10px', width: '100%', borderBottom: 'solid 1px #2424' }}>
          <Typography variant='p' component='div' sx={{ fontSize: '20px', fontWeight: 'bold', color: '#1976d2' }}>Personal Information</Typography>
        </Box>
        <Box sx={{ height: 'auto', width: '100%', margin: '2% 0', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Box sx={{ width: '100%', height: '100%', padding: '0 10px' }}>
            <Grid2 container rowSpacing={3} columnSpacing={2}>
              <Grid2 item size={4}>
                <Typography variant='p' component='div' sx={{ fontSize: '15px', color: '#22442280' }}>User Name</Typography>
                <Typography variant='p' component='div' sx={{ fontSize: '18px', textTransform: 'capitalize' }}>{listOneCustomer?.data?.name}</Typography>
              </Grid2>
              <Grid2 item size={4}>
                <Typography variant='p' component='div' sx={{ fontSize: '15px', color: '#22442280' }}>Email</Typography>
                <Typography variant='p' component='div' sx={{ fontSize: '18px', }}>{listOneCustomer?.data?.email}</Typography>
              </Grid2>
              <Grid2 item size={4}>
                <Typography variant='p' component='div' sx={{ fontSize: '15px', color: '#22442280' }}>Mobile No</Typography>
                <Typography variant='p' component='div' sx={{ fontSize: '18px', }}>{listOneCustomer?.data?.phone}</Typography>
              </Grid2>
              <Grid2 item size={4}>
                <Typography variant='p' component='div' sx={{ fontSize: '15px', color: '#22442280' }}>User type</Typography>
                <Typography variant='p' component='div' sx={{ fontSize: '18px', textTransform: 'capitalize' }}>{listOneCustomer?.data?.type}</Typography>
              </Grid2>
              <Grid2 item size={4}>
                <Typography variant='p' component='div' sx={{ fontSize: '15px', color: '#22442280' }}>Address</Typography>
                <Typography variant='p' component='div' sx={{ fontSize: '18px', textTransform: 'capitalize' }}>{listOneCustomer?.data?.address}</Typography>
              </Grid2>
              <Grid2 item size={4}>
                <Typography variant='p' component='div' sx={{ fontSize: '15px', color: '#22442280' }}>Country</Typography>
                <Typography variant='p' component='div' sx={{ fontSize: '18px', textTransform: 'capitalize' }}>{listOneCustomer?.data?.country}</Typography>
              </Grid2>
              <Grid2 item size={4}>
                <Typography variant='p' component='div' sx={{ fontSize: '15px', color: '#22442280' }}>State</Typography>
                <Typography variant='p' component='div' sx={{ fontSize: '18px', textTransform: 'capitalize' }}>{listOneCustomer?.data?.state}</Typography>
              </Grid2>
              <Grid2 item size={4}>
                <Typography variant='p' component='div' sx={{ fontSize: '15px', color: '#22442280' }}>City</Typography>
                <Typography variant='p' component='div' sx={{ fontSize: '18px', textTransform: 'capitalize' }}>{listOneCustomer?.data?.city}</Typography>
              </Grid2>
              <Grid2 item size={4}>
                <Typography variant='p' component='div' sx={{ fontSize: '15px', color: '#22442280' }}>Postal Code</Typography>
                <Typography variant='p' component='div' sx={{ fontSize: '18px', textTransform: 'capitalize' }}>{listOneCustomer?.data?.postalCode}</Typography>
              </Grid2>
              <Grid2 item size={4}>
                <Typography variant='p' component='div' sx={{ fontSize: '15px', color: '#22442280' }}>Status</Typography>
                <Typography variant='p' component='div' sx={{ fontSize: '18px', textTransform: 'capitalize', color: `${listOneCustomer?.data?.status == "active" ? "green" : "red"}`, fontWeight: 'bold' }}>{listOneCustomer?.data?.status}</Typography>
              </Grid2>
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
            </Grid2>
          </Box>
          {/* <Box sx={{ width: '30%', height: '100%', }}>
            <Typography variant='p' component='div' sx={{ fontSize: '20px', fontWeight: 'bold', textAlign: 'center', margin: '10px 0' }}>Your Profile</Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Avatar
                alt="Admin profile"
                src={listOneCustomer?.data?.profile}
                sx={{ width: 200, height: 200 }}
              />
            </Box>
          </Box> */}
        </Box>
      </Paper>
    </div>
  )
}

export default CustomerView