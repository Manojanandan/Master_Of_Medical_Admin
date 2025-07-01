import React, { useRef, useState } from 'react'
import Titlebar from '../../comnponents/titlebar/Titlebar'
import { useNavigate } from 'react-router-dom'
import { Alert, Backdrop, Box, Button, CircularProgress, Grid, IconButton, MenuItem, Paper, Select, Snackbar, TextareaAutosize, TextField, Typography } from '@mui/material'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import CloseIcon from '@mui/icons-material/Close'
import { useDispatch, useSelector } from 'react-redux'
import { addUserData } from './AdminReducer'

// Email: basic pattern for most emails
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Password: min 8 chars, at least one letter, one number, one special char
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

const AdminEntry = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const fileInputRef = useRef()
    const [profileImg, setProfileImg] = useState(null)
      const [openSnackbar, setOpenSnackbar] = useState(false);
    const [allData, setAllData] = useState({ name: "", mobile: "", email: "", password: "", address: "", city: "", state: "", pincode: "", adminRole: "", status: "", country: "" })
    const [errorMsg, setErrorMsg] = useState({ nameError: "", mobileError: "", emailError: "", passwordError: "", addressError: "", cityError: "", stateError: "", pincodeError: "", adminRoleError: "", statusError: "", profileImgError: "", countryError: "" })

    const reducer = useSelector((state) => state.adminReducer)
    const { success, message, loader } = reducer

    const handleProfileImgChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setProfileImg(e.target.files[0])
            setErrorMsg({ ...errorMsg, profileImgError: "" })
        }
    }
    const handleRemoveProfileImg = (e) => {
        e.stopPropagation()
        setProfileImg(null)
    }

    const handleChange = (e) => {
        setAllData({ ...allData, [e.target.id]: e.target.value })
        if (e.target.id === "name") {
            setErrorMsg({ ...errorMsg, nameError: "" })
        }
        if (e.target.id === "mobile") {
            setErrorMsg({ ...errorMsg, mobileError: "" })
        }
        if (e.target.id === "email") {
            setErrorMsg({ ...errorMsg, emailError: "" })
        }
        if (e.target.id === "password") {
            setErrorMsg({ ...errorMsg, passwordError: "" })
        }
        if (e.target.id === "address") {
            setErrorMsg({ ...errorMsg, addressError: "" })
        }
        if (e.target.id === "city") {
            setErrorMsg({ ...errorMsg, cityError: "" })
        }
        if (e.target.id === "state") {
            setErrorMsg({ ...errorMsg, stateError: "" })
        }
        if (e.target.id === "pincode") {
            setErrorMsg({ ...errorMsg, pincodeError: "" })
        }
        if (e.target.id === "adminRole") {
            setErrorMsg({ ...errorMsg, adminRoleError: "" })
        }
    }

    const handleSubmit = () => {
        if (allData.name === '') {
            setErrorMsg({ ...errorMsg, nameError: "User Name is required" })
        } else if (allData.mobile === '') {
            setErrorMsg({ ...errorMsg, mobileError: "Mobile No is required" })
        } else if (allData.email === '') {
            setErrorMsg({ ...errorMsg, emailError: "Email is required" })
        } else if (!emailRegex.test(allData.email)) {
            setErrorMsg({ ...errorMsg, emailError: "Invalid email format" })
        } else if (allData.password === '') {
            setErrorMsg({ ...errorMsg, passwordError: "Password is required" })
        } else if (!passwordRegex.test(allData.password)) {
            setErrorMsg({ ...errorMsg, passwordError: "Password must be at least 8 characters long and include at least one letter, one number, and one special character" })
        } else if (allData.address === '') {
            setErrorMsg({ ...errorMsg, addressError: "Address is required" })
        } else if (allData.city === '') {
            setErrorMsg({ ...errorMsg, cityError: "City is required" })
        } else if (allData.state === '') {
            setErrorMsg({ ...errorMsg, stateError: "State is required" })
        } else if (allData.pincode === '') {
            setErrorMsg({ ...errorMsg, pincodeError: "State is required" })
        } else if (allData.adminRole === '') {
            setErrorMsg({ ...errorMsg, adminRoleError: "State is required" })
        } else if (!profileImg) {
            setErrorMsg({ ...errorMsg, profileImgError: "Profile is required" })
        } else if (allData.status === '') {
            setErrorMsg({ ...errorMsg, statusError: "Status is required" })
        } else {
            const formData = new FormData()
            formData.append("name", allData?.name)
            formData.append("email", allData?.email)
            formData.append("phone", allData?.mobile)
            formData.append("password", allData?.password)
            formData.append("address", allData?.address)
            formData.append("city", allData?.city)
            formData.append("state", allData?.state)
            formData.append("country", allData?.country)
            formData.append("postalCode", allData?.pincode)
            formData.append("role", allData?.adminRole)
            formData.append("status ", allData?.status)
            formData.append("profile ", profileImg)

            dispatch(addUserData(formData))
            if(success){
                setOpenSnackbar(true)
                navigate('/adminUser')
                setAllData({ name: "", mobile: "", email: "", password: "", address: "", city: "", state: "", pincode: "", adminRole: "", status: "", country: "" })
                setErrorMsg({ nameError: "", mobileError: "", emailError: "", passwordError: "", addressError: "", cityError: "", stateError: "", pincodeError: "", adminRoleError: "", statusError: "", profileImgError: "", countryError: "" })
                setProfileImg(null)
            }
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
            {message && <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={openSnackbar} autoHideDuration={3000} onClose={() => setOpenSnackbar(!openSnackbar)}>
                <Alert
                    onClose={() => setOpenSnackbar(!openSnackbar)}
                    severity={success ? "success" : "error"}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {message}
                </Alert>
            </Snackbar>}
            <Titlebar title={"Admin Details"} filter={false} back={true} backClick={() => navigate('/adminUser')} />
            <Paper elevation={5} sx={{ borderRadius: '10px', padding: '2% 3%', margin: '3% auto', width: '95%' }}>
                <Grid container columnSpacing={4} rowSpacing={3}>
                    <Grid item xs={6}>
                        <Typography variant='p' component='div' sx={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '1%' }}>User Name<span style={{ color: 'red', marginLeft: '5px' }}>*</span></Typography>
                        <TextField onChange={handleChange} fullWidth size='small' id='name' value={allData?.name} placeholder='Enter your user name' />
                        {errorMsg?.nameError && <Typography variant='span' sx={{ fontSize: '14px', color: 'red', fontWeight: 'bold' }}>{errorMsg?.nameError}</Typography>}
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant='p' component='div' sx={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '1%' }}>Mobile Number<span style={{ color: 'red', marginLeft: '5px' }}>*</span></Typography>
                        <TextField onChange={handleChange} fullWidth size='small' id='mobile' value={allData?.mobile} placeholder='Enter your mobile number' />
                        {errorMsg?.mobileError && <Typography variant='span' sx={{ fontSize: '14px', color: 'red', fontWeight: 'bold' }}>{errorMsg?.mobileError}</Typography>}
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant='p' component='div' sx={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '1%' }}>Email<span style={{ color: 'red', marginLeft: '5px' }}>*</span></Typography>
                        <TextField onChange={handleChange} fullWidth size='small' id='email' value={allData?.email} placeholder='Enter your email' />
                        {errorMsg?.emailError && <Typography variant='span' sx={{ fontSize: '14px', color: 'red', fontWeight: 'bold' }}>{errorMsg?.emailError}</Typography>}
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant='p' component='div' sx={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '1%' }}>Password<span style={{ color: 'red', marginLeft: '5px' }}>*</span></Typography>
                        <TextField onChange={handleChange} fullWidth size='small' id='password' value={allData?.password} placeholder='Enter your password' />
                        {errorMsg?.passwordError && <Typography variant='span' sx={{ fontSize: '14px', color: 'red', fontWeight: 'bold' }}>{errorMsg?.passwordError}</Typography>}
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant='p' component='div' sx={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '1%' }}>Address<span style={{ color: 'red', marginLeft: '5px' }}>*</span></Typography>
                        <TextareaAutosize
                            id='address'
                            value={allData?.address}
                            onChange={handleChange}
                            style={{ width: '100%', fontSize: '16px', padding: '15px 20px 0', backgroundColor: '#f8fafc' }}
                            maxRows={4}
                            minRows={3}
                        />
                        {errorMsg?.addressError && <Typography variant='span' sx={{ fontSize: '14px', color: 'red', fontWeight: 'bold' }}>{errorMsg?.addressError}</Typography>}
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant='p' component='div' sx={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '1%' }}>City<span style={{ color: 'red', marginLeft: '5px' }}>*</span></Typography>
                        <TextField onChange={handleChange} fullWidth size='small' id='city' value={allData?.city} placeholder='Enter your city' />
                        {errorMsg?.cityError && <Typography variant='span' sx={{ fontSize: '14px', color: 'red', fontWeight: 'bold' }}>{errorMsg?.cityError}</Typography>}
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant='p' component='div' sx={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '1%' }}>State<span style={{ color: 'red', marginLeft: '5px' }}>*</span></Typography>
                        <TextField onChange={handleChange} fullWidth size='small' id='state' value={allData?.state} placeholder='Enter your state' />
                        {errorMsg?.stateError && <Typography variant='span' sx={{ fontSize: '14px', color: 'red', fontWeight: 'bold' }}>{errorMsg?.statusError}</Typography>}
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant='p' component='div' sx={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '1%' }}>Postal Code<span style={{ color: 'red', marginLeft: '5px' }}>*</span></Typography>
                        <TextField onChange={handleChange} fullWidth size='small' id='pincode' value={allData?.pincode} placeholder='Enter your pincode' />
                        {errorMsg?.pincodeError && <Typography variant='span' sx={{ fontSize: '14px', color: 'red', fontWeight: 'bold' }}>{errorMsg?.pincodeError}</Typography>}
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant='p' component='div' sx={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '1%' }}>Country<span style={{ color: 'red', marginLeft: '5px' }}>*</span></Typography>
                        <TextField onChange={handleChange} fullWidth size='small' id='country' value={allData?.country} placeholder='Enter your country' />
                        {errorMsg?.countryError && <Typography variant='span' sx={{ fontSize: '14px', color: 'red', fontWeight: 'bold' }}>{errorMsg?.countryError}</Typography>}
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant='p' component='div' sx={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '1%' }}>Admin Role<span style={{ color: 'red', marginLeft: '5px' }}>*</span></Typography>
                        <TextField onChange={handleChange} fullWidth size='small' id='adminRole' value={allData?.adminRole} placeholder='Enter your admin role' />
                        {errorMsg?.adminRoleError && <Typography variant='span' sx={{ fontSize: '14px', color: 'red', fontWeight: 'bold' }}>{errorMsg?.adminRoleError}</Typography>}
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant='p' component='div' sx={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '1%' }}>Status<span style={{ color: 'red', marginLeft: '5px' }}>*</span></Typography>
                        <Select
                            id="status"
                            size='small'
                            name="status"
                            value={allData?.status}
                            onChange={(e) => { setAllData({ ...allData, status: e.target.value }), setErrorMsg({ ...errorMsg, statusError: "" }) }}
                            fullWidth
                            displayEmpty
                        >
                            <MenuItem value="" disabled>Select Status</MenuItem>
                            <MenuItem value="active">Active</MenuItem>
                            <MenuItem value="inActive">In-Active</MenuItem>
                        </Select>
                        {errorMsg?.statusError && <Typography variant='span' sx={{ fontSize: '14px', color: 'red', fontWeight: 'bold' }}>{errorMsg?.statusError}</Typography>}
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant='p' component='div' sx={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '1%' }}>Profile Image<span style={{ color: 'red', marginLeft: '5px' }}>*</span></Typography>
                        <Box
                            sx={{
                                border: '2px dashed #00bfae',
                                borderRadius: '10px',
                                padding: '32px',
                                textAlign: 'center',
                                backgroundColor: '#f8fafc',
                                position: 'relative',
                                cursor: profileImg ? 'default' : 'pointer',
                                minHeight: 120,
                            }}
                            onClick={() => {
                                if (!profileImg) fileInputRef.current.click()
                            }}
                        >
                            {!profileImg && (
                                <>
                                    <CloudUploadIcon sx={{ fontSize: 48, color: '#00bfae' }} />
                                    <Typography sx={{ mt: 1, mb: 1, fontWeight: 600, color: '#00bfae', fontSize: '20px' }}>
                                        Upload Profile
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        sx={{ backgroundColor: '#00bfae', color: '#fff', mt: 1, fontWeight: 'bold' }}
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            fileInputRef.current.click()
                                        }}
                                    >
                                        BROWSE
                                    </Button>
                                    <Typography sx={{ mt: 2, color: '#888', fontSize: 13 }}>
                                        Note: Only image files allowed. Max 5MB.
                                    </Typography>
                                    {errorMsg?.profileImgError && <Typography variant='span' sx={{ fontSize: '14px', color: 'red', fontWeight: 'bold' }}>{errorMsg?.profileImgError}</Typography>}
                                </>
                            )}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={handleProfileImgChange}
                            />
                            {profileImg && (
                                <Box sx={{ mt: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                                    <img
                                        src={URL.createObjectURL(profileImg)}
                                        alt="profile Preview"
                                        style={{ maxWidth: 120, maxHeight: 120, borderRadius: 8, marginTop: 8 }}
                                    />
                                    <Typography sx={{ fontSize: 13, mt: 1 }}>{profileImg.name}</Typography>
                                    <IconButton
                                        size="small"
                                        sx={{
                                            position: 'absolute',
                                            top: 0,
                                            right: 0,
                                            background: '#fff',
                                            border: '1px solid #ccc',
                                            '&:hover': { background: '#f8fafc' }
                                        }}
                                        onClick={handleRemoveProfileImg}
                                    >
                                        <CloseIcon fontSize="small" />
                                    </IconButton>
                                </Box>
                            )}
                        </Box>
                    </Grid>
                </Grid>
                <Box sx={{ margin: '2% 0', padding: '10px 0', textAlign: 'right' }}>
                    <Button onClick={handleSubmit} size='large' variant='contained' sx={{ fontWeight: 'bold', backgroundColor: "#00bfae" }}>Create Admin</Button>
                </Box>
            </Paper>
        </div>
    )
}

export default AdminEntry