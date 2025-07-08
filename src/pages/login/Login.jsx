import React, { useEffect, useState } from 'react';
import {
    Alert,
    Backdrop,
    Box,
    Button,
    CircularProgress,
    Grid,
    IconButton,
    InputAdornment,
    Snackbar,
    TextField,
    Typography,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser, resetLoginState } from './LoginReducer';
import { useDispatch, useSelector } from 'react-redux';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useAuth } from '../routes/AuthContext';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { login } = useAuth();
    const { loader, message, success } = useSelector((state) => state.loginReducer);

    const [openModal, setOpenModal] = useState(false);
    const [allData, setAllData] = useState({ email: "", password: "" });
    const [errorMsg, setErrorMsg] = useState({ emailError: '', passwordError: "" });
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setAllData(prev => ({ ...prev, [id]: value }));
        if (id === "email") setErrorMsg(prev => ({ ...prev, emailError: "" }));
        if (id === "password") setErrorMsg(prev => ({ ...prev, passwordError: "" }));
    };

    const handleClose = () => setOpenModal(false);

    const validateAndLogin = () => {
        const { email, password } = allData;

        if (!email) return setErrorMsg(prev => ({ ...prev, emailError: "Email is required" }));
        if (!emailRegex.test(email)) return setErrorMsg(prev => ({ ...prev, emailError: "Invalid email format" }));
        if (!password) return setErrorMsg(prev => ({ ...prev, passwordError: "Password is required" }));
        if (!passwordRegex.test(password)) {
            return setErrorMsg(prev => ({
                ...prev,
                passwordError: "Password must be at least 8 characters, with one letter, one number, and one special character"
            }));
        }

        dispatch(loginUser({ email, password }));
    };

    useEffect(() => {
        if (success && message?.accessToken) {
            login(message.accessToken)
            setOpenModal(true);

            setTimeout(() => {
                setOpenModal(false);
                dispatch(resetLoginState());
                navigate("/dashboard");
            }, 3000);
        }
    }, [success, message, navigate, dispatch]);

    return (
        <Box sx={{ height: '100vh', backgroundColor: '#f2f3f5', padding: '4% 0' }}>
            <Backdrop sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }} open={loader}>
                <CircularProgress color="secondary" />
            </Backdrop>

            {message && (
                <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={openModal} autoHideDuration={3000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity={success ? "success" : "error"} variant="filled" sx={{ width: '100%' }}>
                        {message}
                    </Alert>
                </Snackbar>
            )}

            <Box sx={{ backgroundColor: '#fff', borderRadius: '15px', width: '35%', margin: '4% auto', padding: '2rem' }}>
                <Typography align="center" fontSize="1.8rem" gutterBottom>Welcome to Admin Portal</Typography>
                <Typography align="center" fontSize="14px" gutterBottom>To access your admin portal login</Typography>

                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Typography>Email<span style={{ color: 'red' }}>*</span></Typography>
                        {errorMsg.emailError && <Typography color="error" fontSize="14px">{errorMsg.emailError}</Typography>}
                        <TextField fullWidth id="email" size="small" value={allData.email} onChange={handleChange} />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography>Password<span style={{ color: 'red' }}>*</span></Typography>
                        {errorMsg.passwordError && <Typography color="error" fontSize="14px">{errorMsg.passwordError}</Typography>}
                        <TextField
                            fullWidth
                            id="password"
                            size="small"
                            type={showPassword ? "text" : "password"}
                            value={allData.password}
                            onChange={handleChange}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={togglePasswordVisibility}>
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Link to="/forgotpassword" style={{ color: '#009e92', textDecoration: 'none', fontWeight: 'bold' }}>
                            Forgot password?
                        </Link>
                    </Grid>

                    <Grid item xs={12} textAlign="center">
                        <Button
                            variant="contained"
                            onClick={validateAndLogin}
                            sx={{
                                textTransform: 'capitalize',
                                fontSize: '16px',
                                fontWeight: 'bold',
                                padding: '0.5rem 2rem',
                                backgroundColor: '#069e92',
                            }}
                        >
                            Login
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};

export default Login;
