import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Backdrop, Box, CircularProgress, Grid2, Paper, Typography } from '@mui/material'
import Titlebar from '../../comnponents/titlebar/Titlebar'
import { useNavigate } from 'react-router-dom'
import JpgIcon from '../../assets/JpgIcon.png'
import JpegIcon from '../../assets/JpegIcon.png'
import ExcelIcon from '../../assets/ExcelIcon.jpg'
import WordIcon from '../../assets/WordIcon.jpg'
import PngIcon from '../../assets/PngIcon.png'
import PDFIcon from '../../assets/PDFIcon.png'
import { getOneDataTestimonial } from './TestimonialReducer'

const TestimonialView = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const reducer = useSelector((state) => state.testimonial)
    const { getOneData, loader } = reducer

    useEffect(() => {
        if (sessionStorage.getItem("testimonialId")) {
            dispatch(getOneDataTestimonial(sessionStorage.getItem("testimonialId")))
        }
    }, [sessionStorage.getItem("testimonialId")])

    return (
        <div>
            <Backdrop
                sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                open={loader}
            >
                <CircularProgress color="secondary" />
            </Backdrop>
            <Titlebar title={"Testimonial Details"} back={true} backClick={() => { navigate('/testimonials'), sessionStorage.removeItem("testimonialId") }} />
            <Paper elevation={5} sx={{ borderRadius: '10px', padding: '2% 3%', margin: '3% auto', width: '95%' }}>
                <Box sx={{ padding: '10px', width: '100%', borderBottom: 'solid 1px #2424' }}>
                    <Typography variant='p' component='div' sx={{ fontSize: '20px', fontWeight: 'bold', color: '#1976d2' }}>Personal Information</Typography>
                </Box>
                <Box sx={{ height: 'auto', width: '100%', margin: '2% 0', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Box sx={{ width: '100%', height: '100%', padding: '0 10px' }}>
                        <Grid2 container rowSpacing={3} columnSpacing={2}>
                            <Grid2 item size={4}>
                                <Typography variant='p' component='div' sx={{ fontSize: '15px', color: '#22442280' }}>Name</Typography>
                                <Typography variant='p' component='div' sx={{ fontSize: '18px', textTransform: 'capitalize' }}>{getOneData?.data?.name}</Typography>
                            </Grid2>
                            <Grid2 item size={6}>
                                <Typography variant='p' component='div' sx={{ fontSize: '15px', color: '#22442280' }}>Message</Typography>
                                <Typography variant='p' component='div' sx={{ fontSize: '18px', }}>{getOneData?.data?.message}</Typography>
                            </Grid2>
                            <Grid2 item size={4}>
                                <Typography variant='p' component='div' sx={{ fontSize: '15px', color: '#22442280' }}>Designation</Typography>
                                <Typography variant='p' component='div' sx={{ fontSize: '18px', }}>{getOneData?.data?.designation}</Typography>
                            </Grid2>
                            <Grid2 item size={8}>
                                <Typography variant='p' component='div' sx={{ fontSize: '15px', color: '#22442280' }}>Documents</Typography>
                                <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginTop: '5px' }}>
                                    {getOneData?.data?.image?.length > 0 ? getOneData?.data?.image?.map((fileUrl, index) => {
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
                src={getOneData?.data?.profile}
                sx={{ width: 200, height: 200 }}
              />
            </Box>
          </Box> */}
                </Box>
            </Paper>
        </div>
    )
}

export default TestimonialView