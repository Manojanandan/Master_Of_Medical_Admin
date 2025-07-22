import { Alert, Avatar, Backdrop, Box, Button, CircularProgress, Grid2, IconButton, MenuItem, Paper, Select, Snackbar, TextareaAutosize, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import Titlebar from '../../comnponents/titlebar/Titlebar';
import { useDispatch, useSelector } from 'react-redux';
import JpgIcon from '../../assets/JpgIcon.png'
import JpegIcon from '../../assets/JpegIcon.png'
import ExcelIcon from '../../assets/ExcelIcon.jpg'
import WordIcon from '../../assets/WordIcon.jpg'
import PngIcon from '../../assets/PngIcon.png'
import PDFIcon from '../../assets/PDFIcon.png'
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import { useNavigate } from 'react-router-dom';
import { getOneProductList, resetMessage } from './ProductReducer';

const ProductView = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [editFlag, setEditFlag] = useState(false)
    const [status, setStatus] = useState("all")
    const [remarks, setRemarks] = useState(null)
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [errMsg, setErrMsg] = useState({ status: "", remarks: "" })

    const mode = sessionStorage.getItem("Mode")

    const reducer = useSelector((state) => state.productReducer)
    const { loader, successMsg, success, getOneData, } = reducer


    // useEffect(() => {
    //     dispatch(resetMessage())
    // }, [])

    useEffect(() => {
        if (sessionStorage.getItem("productId")) {
            dispatch(getOneProductList(sessionStorage.getItem("productId")))
        }
    }, [sessionStorage.getItem("productId")])

    useEffect(() => {
        if (successMsg !== "" && successMsg !== undefined) {
            setOpenSnackbar(true)
        }
    }, [successMsg])

    const handleEdit = () => {
        setEditFlag(!editFlag)
        setStatus('all')
        setRemarks("")
    }
    const handleClose = () => {
        setOpenSnackbar(!openSnackbar)
        navigate('/productmanagement')
        dispatch(resetMessage())
    }

    const updateVendor = async () => {
        if (status === "all") {
            setErrMsg({ ...errMsg, status: "Select any status" })
        } else if (status === "rejected" && remarks === "") {
            setErrMsg({ ...errMsg, remarks: "Remarks is required" })
        } else {
            const formData = new FormData()
            formData.append("id", getOneData?.data?.id)
            formData.append("name", getOneData?.data?.name)
            formData.append("email", getOneData?.data?.email)
            formData.append("phone", getOneData?.data?.phone)
            formData.append("type", getOneData?.data?.type)
            formData.append("address", getOneData?.data?.address)
            formData.append("country", getOneData?.data?.country)
            formData.append("state", getOneData?.data?.state)
            formData.append("city", getOneData?.data?.city)
            formData.append("postalCode", getOneData?.data?.postalCode)
            formData.append("status", status ?? getOneData?.data?.status)
            formData.append("remarks", remarks ?? getOneData?.data?.remarks)
            formData.append("files", getOneData?.data?.files)

            dispatch(modifyVendor(formData))
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
            {successMsg && <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={openSnackbar} autoHideDuration={1000} onClose={handleClose}>
                <Alert
                    onClose={handleClose}
                    severity={success ? "success" : "error"}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {successMsg}
                </Alert>
            </Snackbar>}
            <Titlebar title={"Product Details"} back={true} backClick={() => { navigate('/productmanagement'), sessionStorage.removeItem("productId") }} />
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
                                <Typography variant='p' component='div' sx={{ fontSize: '18px', textTransform: 'capitalize' }}>{getOneData?.data?.name ?? "-"}</Typography>
                            </Grid2>
                            <Grid2 item size={4}>
                                <Typography variant='p' component='div' sx={{ fontSize: '15px', color: '#22442280' }}>Email</Typography>
                                <Typography variant='p' component='div' sx={{ fontSize: '18px', }}>{getOneData?.data?.email ?? "-"}</Typography>
                            </Grid2>
                            <Grid2 item size={4}>
                                <Typography variant='p' component='div' sx={{ fontSize: '15px', color: '#22442280' }}>Mobile No</Typography>
                                <Typography variant='p' component='div' sx={{ fontSize: '18px', }}>{getOneData?.data?.phone ?? "-"}</Typography>
                            </Grid2>
                            <Grid2 item size={4}>
                                <Typography variant='p' component='div' sx={{ fontSize: '15px', color: '#22442280' }}>User type</Typography>
                                <Typography variant='p' component='div' sx={{ fontSize: '18px', textTransform: 'capitalize' }}>{getOneData?.data?.type ?? "-"}</Typography>
                            </Grid2>
                            <Grid2 item size={4}>
                                <Typography variant='p' component='div' sx={{ fontSize: '15px', color: '#22442280' }}>Address</Typography>
                                <Typography variant='p' component='div' sx={{ fontSize: '18px', textTransform: 'capitalize' }}>{getOneData?.data?.address ?? "-"}</Typography>
                            </Grid2>
                            <Grid2 item size={4}>
                                <Typography variant='p' component='div' sx={{ fontSize: '15px', color: '#22442280' }}>Country</Typography>
                                <Typography variant='p' component='div' sx={{ fontSize: '18px', textTransform: 'capitalize' }}>{getOneData?.data?.country ?? "-"}</Typography>
                            </Grid2>
                            <Grid2 item size={4}>
                                <Typography variant='p' component='div' sx={{ fontSize: '15px', color: '#22442280' }}>State</Typography>
                                <Typography variant='p' component='div' sx={{ fontSize: '18px', textTransform: 'capitalize' }}>{getOneData?.data?.state ?? "-"}</Typography>
                            </Grid2>
                            <Grid2 item size={4}>
                                <Typography variant='p' component='div' sx={{ fontSize: '15px', color: '#22442280' }}>City</Typography>
                                <Typography variant='p' component='div' sx={{ fontSize: '18px', textTransform: 'capitalize' }}>{getOneData?.data?.city ?? "-"}</Typography>
                            </Grid2>
                            <Grid2 item size={4}>
                                <Typography variant='p' component='div' sx={{ fontSize: '15px', color: '#22442280' }}>Postal Code</Typography>
                                <Typography variant='p' component='div' sx={{ fontSize: '18px', textTransform: 'capitalize' }}>{getOneData?.data?.postalCode ?? "-"}</Typography>
                            </Grid2>
                            <Grid2 item size={4}>
                                <Typography variant='p' component='div' sx={{ fontSize: '15px', color: '#22442280' }}>Status</Typography>
                                {!editFlag ?
                                    <Typography variant='p' component='div' sx={{ fontSize: '18px', textTransform: 'capitalize', color: `${getOneData?.data?.status == "approved" ? "green" : getOneData?.data?.status == "rejected" ? "red" : "orange"}`, fontWeight: 'bold' }}>{getOneData?.data?.status}</Typography>
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
                            <Grid2 item size={8}>
                                <Typography variant='p' component='div' sx={{ fontSize: '15px', color: '#22442280' }}>Documents</Typography>
                                <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginTop: '5px' }}>
                                    {getOneData?.data?.files?.length > 0 ? getOneData?.data?.files?.map((fileUrl, index) => {
                                        const fileName = fileUrl.split('/').pop();
                                        const actualFileName = fileName.replace(/^\d+-/, '');
                                        const fileFormat = actualFileName.split('.')[1]
                                        return (
                                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '5px' }} key={index}>
                                                <img src={fileFormat === "jpg" ? JpgIcon : fileFormat === "jpeg" ? JpegIcon : fileFormat === "docx" ? WordIcon : fileFormat === "png" ? PngIcon : fileFormat === "pdf" ? PDFIcon : ExcelIcon} alt={JpgIcon} style={{ height: '20px', width: '20px' }} />
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
                            {getOneData?.data?.status === "rejected" && !editFlag &&
                                <Grid2 item size={4}>
                                    <Typography variant='p' component='div' sx={{ fontSize: '15px', color: '#22442280' }}>Remarks</Typography>
                                    <Typography variant='p' component='div' sx={{ fontSize: '18px', textTransform: 'capitalize' }}>{getOneData?.data?.remarks ?? "-"}</Typography>
                                </Grid2>
                            }
                            {status === "rejected" &&
                                <>
                                    <Grid2 item size={6}>
                                        <Typography variant='p' component='div' sx={{ fontSize: '15px', color: '#22442280' }}>Remarks</Typography>
                                        {errMsg.remarks && <Typography variant='p' component='div' sx={{ fontSize: '14px', color: 'red' }} >{errMsg.remarks}</Typography>}
                                        <TextareaAutosize
                                            id='remarks'
                                            value={remarks}
                                            style={{ width: '100%', fontSize: '16px', padding: '15px 20px 0', backgroundColor: '#f8fafc' }}
                                            maxRows={4}
                                            minRows={3}
                                            onChange={(e) => { setRemarks(e.target.value), setErrMsg({ ...errMsg, remarks: "" }) }}
                                        />
                                    </Grid2>
                                </>
                            }
                            {editFlag && <Grid2 item size={12}>
                                <Button onClick={updateVendor} variant='contained' sx={{ backgroundColor: "#0ea398", marginRight: '15px' }}>update</Button>
                                <Button onClick={handleEdit} variant='contained' sx={{ backgroundColor: "#2424", color: 'black' }}>clear</Button>
                            </Grid2>}
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

export default ProductView