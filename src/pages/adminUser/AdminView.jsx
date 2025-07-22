import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getOneUserData } from './AdminReducer'
import Titlebar from '../../comnponents/titlebar/Titlebar'
import { Avatar, Backdrop, Box, CircularProgress, Grid2, Paper, Typography } from '@mui/material'

const AdminView = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const reducer = useSelector((state) => state.adminReducer)
    const { adminOneData, loader } = reducer

    useEffect(() => {
        if (sessionStorage.getItem("adminId")) {
            dispatch(getOneUserData(sessionStorage.getItem("adminId")))
        }

    }, [sessionStorage.getItem("adminId")])


    return (
        <div>
            <Backdrop
                sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                open={loader}
            >
                <CircularProgress color="secondary" />
            </Backdrop>
            <Titlebar title={"Admin Details"} back={true} backClick={() => { navigate('/adminUser'), sessionStorage.removeItem("adminId"), sessionStorage.removeItem("Mode") }} />
            <Paper elevation={5} sx={{ borderRadius: '10px', padding: '2% 3%', margin: '3% auto', width: '95%' }}>
                <Box sx={{ padding: '10px', width: '100%', borderBottom: 'solid 1px #2424' }}>
                    <Typography variant='p' component='div' sx={{ fontSize: '20px', fontWeight: 'bold', color: '#1976d2' }}>Personal Information</Typography>
                </Box>
                <Box sx={{ height: 'auto', width: '100%', margin: '2% 0', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Box sx={{ width: '70%', height: '100%', padding: '0 10px' }}>
                        <Grid2 container rowSpacing={3} columnSpacing={2}>
                            <Grid2 item size={6}>
                                <Typography variant='p' component='div' sx={{ fontSize: '15px', color: '#22442280' }}>User Name</Typography>
                                <Typography variant='p' component='div' sx={{ fontSize: '18px', textTransform: 'capitalize' }}>{adminOneData?.data?.name}</Typography>
                            </Grid2>
                            <Grid2 item size={6}>
                                <Typography variant='p' component='div' sx={{ fontSize: '15px', color: '#22442280' }}>Email</Typography>
                                <Typography variant='p' component='div' sx={{ fontSize: '18px', }}>{adminOneData?.data?.email}</Typography>
                            </Grid2>
                            <Grid2 item size={6}>
                                <Typography variant='p' component='div' sx={{ fontSize: '15px', color: '#22442280' }}>Mobile No</Typography>
                                <Typography variant='p' component='div' sx={{ fontSize: '18px', }}>{adminOneData?.data?.phone}</Typography>
                            </Grid2>
                            <Grid2 item size={6}>
                                <Typography variant='p' component='div' sx={{ fontSize: '15px', color: '#22442280' }}>Role</Typography>
                                <Typography variant='p' component='div' sx={{ fontSize: '18px', textTransform: 'capitalize' }}>{adminOneData?.data?.role}</Typography>
                            </Grid2>
                            <Grid2 item size={6}>
                                <Typography variant='p' component='div' sx={{ fontSize: '15px', color: '#22442280' }}>Address</Typography>
                                <Typography variant='p' component='div' sx={{ fontSize: '18px', textTransform: 'capitalize' }}>{adminOneData?.data?.address}</Typography>
                            </Grid2>
                            <Grid2 item size={6}>
                                <Typography variant='p' component='div' sx={{ fontSize: '15px', color: '#22442280' }}>Country</Typography>
                                <Typography variant='p' component='div' sx={{ fontSize: '18px', textTransform: 'capitalize' }}>{adminOneData?.data?.country}</Typography>
                            </Grid2>
                            <Grid2 item size={6}>
                                <Typography variant='p' component='div' sx={{ fontSize: '15px', color: '#22442280' }}>State</Typography>
                                <Typography variant='p' component='div' sx={{ fontSize: '18px', textTransform: 'capitalize' }}>{adminOneData?.data?.state}</Typography>
                            </Grid2>
                            <Grid2 item size={6}>
                                <Typography variant='p' component='div' sx={{ fontSize: '15px', color: '#22442280' }}>City</Typography>
                                <Typography variant='p' component='div' sx={{ fontSize: '18px', textTransform: 'capitalize' }}>{adminOneData?.data?.city}</Typography>
                            </Grid2>
                            <Grid2 item size={6}>
                                <Typography variant='p' component='div' sx={{ fontSize: '15px', color: '#22442280' }}>Postal Code</Typography>
                                <Typography variant='p' component='div' sx={{ fontSize: '18px', textTransform: 'capitalize' }}>{adminOneData?.data?.postalCode}</Typography>
                            </Grid2>
                            <Grid2 item size={6}>
                                <Typography variant='p' component='div' sx={{ fontSize: '15px', color: '#22442280' }}>Status</Typography>
                                <Typography variant='p' component='div' sx={{ fontSize: '18px', textTransform: 'capitalize', color: `${adminOneData?.data?.status == "active" ? "green" : "red"}`, fontWeight: 'bold' }}>{adminOneData?.data?.status}</Typography>
                            </Grid2>
                        </Grid2>
                    </Box>
                    <Box sx={{ width: '30%', height: '100%', }}>
                        <Typography variant='p' component='div' sx={{ fontSize: '20px', fontWeight: 'bold', textAlign: 'center', margin: '10px 0' }}>Your Profile</Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <Avatar
                                alt="Admin profile"
                                src={adminOneData?.data?.profile}
                                sx={{ width: 200, height: 200 }}
                            />
                        </Box>
                    </Box>
                </Box>
            </Paper>
        </div>
    )
}

export default AdminView