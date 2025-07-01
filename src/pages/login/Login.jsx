import React, { useEffect, useState } from 'react'
import { Alert, Backdrop, Box, Button, Checkbox, CircularProgress, Container, FormControlLabel, Grid, IconButton, InputAdornment, Snackbar, Stack, TextField, Typography } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'
import { loginUser } from './LoginReducer';
import { useDispatch, useSelector } from 'react-redux';
import WestIcon from '@mui/icons-material/West';
import { Visibility, VisibilityOff } from '@mui/icons-material';

// Email: basic pattern for most emails
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Password: min 8 chars, at least one letter, one number, one special char
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

const Login = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const type = sessionStorage.getItem("userType")

    const { loader, message, success } = useSelector((state) => state.loginReducer)

    const [openModal, setOpenModal] = useState(false);
    const [allDtata, setAllData] = useState({
        email: "", password: ""
    })
    const [errorMsg, setErrorMsg] = useState({ emailError: '', passwordError: "" })
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    }
    const handleChange = (e) => {
        setAllData({
            ...allDtata,
            [e.target.id]: e.target.value
        })
        if (e.target.id === "email") {
            setErrorMsg({ ...errorMsg, emailError: "" });
        }
        if (e.target.id === "password") {
            setErrorMsg({ ...errorMsg, passwordError: "" });
        }
    }

    useEffect(() => {
        if (success) {
            setOpenModal(true);
            setTimeout(() => {
                navigate("/dashboard");
            }, 1000);
        } else if (message) {
            setOpenModal(true);
        }
    }, [success, message, navigate, type]);

    const createLogin = () => {
        if (allDtata.email === "") {
            setErrorMsg({ ...errorMsg, emailError: "Email is required" })
        } else if (!emailRegex.test(allDtata.email)) {
            setErrorMsg({ ...errorMsg, emailError: "Invalid email format" })
        } else if (allDtata.password === "") {
            setErrorMsg({ ...errorMsg, passwordError: "Password is required" })
        } else if (!passwordRegex.test(allDtata.password)) {
            setErrorMsg({ ...errorMsg, passwordError: "Password must be at least 8 characters long and include at least one letter, one number, and one special character" })
        }
        else {
            setErrorMsg({ passwordError: "", emailError: "" })
            const payload = {
                email: allDtata.email,
                password: allDtata.password,
            }

            dispatch(loginUser({ data: payload, type }))
            setOpenModal(true)
            if (sessionStorage.getItem("jwt")) {
                navigate("/dashboard")
            }
            setAllData({ password: "", email: "" })

        }
    }

    const handleClose = () => {
        setOpenModal(false);
    }
    console.log(message);

    return (
        <Box sx={{ height: '100vh', width: '100%', backgroundColor: '#f2f3f5', padding: '4% 0' }}>
            <Backdrop
                sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                open={loader}
            >
                <CircularProgress color="secondary" />
            </Backdrop>
            {message && <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={openModal} autoHideDuration={3000} onClose={handleClose}>
                <Alert
                    onClose={handleClose}
                    severity={success ? "success" : "error"}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {message}
                </Alert>
            </Snackbar>}
            <Box sx={{ border: 'solid 1.5px #fff', height: 'auto', margin: '4% auto', backgroundColor: '#fff', borderRadius: '15px', width: '35%' }}>
                <Box sx={{ margin: '7% auto 5%', width: 'auto', textAlign: 'center' }}>
                    <Typography variant='p' sx={{ margin: '5% auto 0', fontSize: '1.8rem', }}>Welcome to Admin Portal</Typography><br />
                    <Typography variant='p' sx={{ fontSize: '14px',  }}>To access your admin portal login? </Typography>
                </Box>
                <Grid container>
                    <Grid item xs={12} sx={{margin:'3% 5% 0 7%'}}>
                        <Typography sx={{ fontSize: '18px', fontWeight: 'bold' }}>Email<span style={{ color: 'red', marginLeft: '5px' }}>*</span></Typography>
                        {errorMsg.emailError && <Typography variant='span' sx={{ color: 'red', fontSize: '14px' }}>{errorMsg.emailError}</Typography>}
                        <TextField fullWidth id="email" size="small" value={allDtata.email} onChange={handleChange} />
                    </Grid>
                    <Grid item xs={12} sx={{margin:'3% 5% 0 7%'}}>
                        <Typography sx={{ fontSize: '18px', fontWeight: 'bold' }}>Password<span style={{ color: 'red', marginLeft: '5px' }}>*</span></Typography>
                        {errorMsg.passwordError && <Typography variant='span' sx={{ color: 'red', fontSize: '14px' }}>{errorMsg.passwordError}</Typography>}
                        <TextField fullWidth id="password" size="small" value={allDtata.password} onChange={handleChange} type={showPassword ? 'text' : 'password'} InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={togglePasswordVisibility} edge="end">
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }} />
                    </Grid>
                    <Grid item size={12} sx={{ margin: '2% 7%', fontWeight: 'bold' }}>
                        <Link to='/forgotpassword' style={{ textDecoration: 'none', borderBottom: 'solid 1.5px #009e92', color: '#009e92' }}>Forgot password</Link>
                    </Grid>

                </Grid>
                <Button onClick={createLogin} variant='contained' sx={{ textTransform: 'capitalize', fontSize: '16px', fontWeight: 'bold', padding: '1% 8%', margin: '7% 37% 10%' }}>Login</Button>

            </Box>
        </Box>
    )
}

export default Login