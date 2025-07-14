import React, { useEffect, useRef, useState } from 'react'
import Titlebar from '../../comnponents/titlebar/Titlebar'
import { Alert, Backdrop, Box, Button, CircularProgress, Grid2, IconButton, Paper, Snackbar, TextareaAutosize, TextField, Typography } from '@mui/material'
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import CloseIcon from '@mui/icons-material/Close'
import { useNavigate, } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getOneDataTestimonial, postTestimonial, putTestimonial, resetMessage } from './TestimonialReducer';



const TestimonialsEntry = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const fileInputRef = useRef()
    const testimonialId = sessionStorage.getItem("testimonialId")
    const mode = sessionStorage.getItem("Mode")

    const [name, setName] = useState("")
    const [message, setMessage] = useState("")
    const [designation, setDesignation] = useState("")
    const [image, setImage] = useState(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [errorMsg, setErrorMsg] = useState({ name: "", designation: "", message: "", image: "" })


    const reducerResponse = useSelector((state) => state.testimonial)

    const successMsg = reducerResponse?.message
    const success = reducerResponse?.success
    const Load = reducerResponse?.loader
    const getData = reducerResponse?.getOneData?.data

    useEffect(() => {
        dispatch(resetMessage())
        if (mode !== "Add") {
            dispatch(getOneDataTestimonial(testimonialId))
        }
    }, [])

    const resolveImagePath = () => {
        if (!getData?.image) {
            console.log('No image found in getData');
            return null;
        }

        let imagePath = getData.image;
        console.log('Raw imagePath:', imagePath); // ✅ check what exactly it contains

        if (Array.isArray(imagePath) && imagePath.length > 0) {
            imagePath = imagePath[0];
            console.log('First image from array:', imagePath);
        } else if (typeof imagePath === 'object' && imagePath?.path) {
            imagePath = imagePath.path;
            console.log('Extracted path from object:', imagePath);
        }

        if (typeof imagePath === 'string') {
            const fullPath = imagePath.startsWith('http') ? imagePath : `http://luxcycs.com:5500/${imagePath}`;
            console.log('Final image path:', fullPath);
            return fullPath;
        }

        console.log('Image path is not a string:', imagePath);
        return null;
    };

    useEffect(() => {
        if (getData !== undefined) {
            setName(getData?.name)
            setMessage(getData?.message)
            setDesignation(getData?.designation)
            if (getData?.image) {
                setImage(resolveImagePath());
            }
        }
    }, [getData]);

    useEffect(() => {
        if (successMsg) {
            const timer = setTimeout(() => {
                navigate('/testimonials');
            }, 1000);

            return () => clearTimeout(timer);
        }
    }, [successMsg, navigate]);


    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setImage(e.target.files[0])
        }
        setErrorMsg({ ...errorMsg, image: "" })
    }
    const handleRemoveImage = (e) => {
        e.stopPropagation()
        setImage(null)
    }

    const handleSubmit = () => {
        if (name === "") {
            setErrorMsg({ ...errorMsg, name: "Name is required" })
        } else if (designation === "") {
            setErrorMsg({ ...errorMsg, designation: "Designation is required" })
        } else if (message === "") {
            setErrorMsg({ ...errorMsg, message: "Message is required" })
        } else if (image === null) {
            setErrorMsg({ ...errorMsg, image: "Image is required" })
        } else {
            const formData = new FormData();
            if (mode === "Edit") {
                formData.append("id", testimonialId)
            }
            formData.append('name', name);
            formData.append('message', message);
            formData.append('designation', designation);
            formData.append('image', image);

            if (getData) {
                dispatch(putTestimonial(formData))
                setOpenSnackbar(true)
            } else {
                dispatch(postTestimonial(formData))
                setOpenSnackbar(true)
            }
        }
    }


    return (
        <React.Fragment>
            <Backdrop
                sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                open={Load}
            >
                <CircularProgress color="secondary" />
            </Backdrop>
            <Titlebar title={"Testimonial Details"} filter={false} back={true} backClick={() => { navigate('/testimonials'), sessionStorage.removeItem("testimonialId"), sessionStorage.removeItem("Mode") }} />
            {successMsg && <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={openSnackbar} autoHideDuration={3000} onClose={() => { setOpenSnackbar(!openSnackbar), sessionStorage.removeItem("testimonialId"), sessionStorage.removeItem("Mode") }}>
                <Alert
                    onClose={() => { setOpenSnackbar(!openSnackbar), sessionStorage.removeItem("testimonialId"), sessionStorage.removeItem("Mode") }}
                    severity={success ? "success" : "error"}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {successMsg}
                </Alert>
            </Snackbar>}
            <Paper elevation={5} sx={{ width: '95%', margin: '2% auto', height: 'auto', borderRadius: '10px', padding: '2% 3%' }}>
                <Grid2 container columnSpacing={4} rowSpacing={2}>
                    <Grid2 size={6} >
                        <Typography variant='p' sx={{ fontWeight: 'bold', }}>Name <span style={{ color: 'red' }}>*</span></Typography>
                        <TextField
                            id="name"
                            size="small"
                            sx={{ margin: '2% 0' }}
                            autoComplete='off'
                            fullWidth
                            placeholder='Enter Name'
                            value={name ?? ""}
                            onChange={(e) => { setName(e.target.value), setErrorMsg({ ...errorMsg, name: "" }) }}
                            disabled={mode === "View" && true}
                        />
                        {errorMsg?.name && <Typography variant='span' sx={{ fontSize: '14px', color: 'red', fontWeight: 'bold' }}>{errorMsg?.name}</Typography>}
                    </Grid2>
                    <Grid2 size={6} >
                        <Typography variant='p' sx={{ fontWeight: 'bold', }}>Destination <span style={{ color: 'red' }}>*</span></Typography>
                        <TextField
                            id="name"
                            size="small"
                            sx={{ margin: '2% 0' }}
                            autoComplete='off'
                            fullWidth
                            placeholder='Enter Destination'
                            onChange={(e) => { setDesignation(e.target.value), setErrorMsg({ ...errorMsg, designation: "" }) }}
                            value={designation ?? ""}
                            disabled={mode === "View" && true}
                        />
                        {errorMsg?.designation && <Typography variant='span' sx={{ fontSize: '14px', color: 'red', fontWeight: 'bold' }}>{errorMsg?.designation}</Typography>}
                    </Grid2>
                    <Grid2 size={12} >
                        <Typography variant='p' sx={{ fontWeight: 'bold', }}>Message <span style={{ color: 'red' }}>*</span></Typography>
                        <TextareaAutosize
                            aria-label="minimum height"
                            minRows={4}
                            style={{ margin: '1% 0 0', width: '100%', padding: '20px 12px 5px', outline: 'none', backgroundColor: '#f8fafc', borderRadius: '5px', fontFamily: 'sans-serif', fontSize: '16px' }}
                            autoComplete='off'
                            fullWidth
                            placeholder='Enter Message'
                            value={message ?? ""}
                            disabled={mode === "View" && true}
                            onChange={(e) => { setMessage(e.target.value), setErrorMsg({ ...errorMsg, message: "" }) }}
                        />
                        {errorMsg?.message && <Typography variant='span' sx={{ fontSize: '14px', color: 'red', fontWeight: 'bold' }}>{errorMsg?.message}</Typography>}
                    </Grid2>
                    <Grid2 size={12} >
                        <Typography variant='p' sx={{ fontWeight: 'bold', }}>Image <span style={{ color: 'red' }}>*</span></Typography><br />
                        <Box
                            sx={{
                                border: '2px dashed #00bfae',
                                borderRadius: '10px',
                                padding: '32px',
                                textAlign: 'center',
                                backgroundColor: '#f8fafc',
                                position: 'relative',
                                cursor: image ? 'default' : 'pointer',
                                minHeight: 120,
                                marginTop: 1
                            }}
                            onClick={() => {
                                if (!image) fileInputRef.current.click();
                            }}
                        >
                            {!image && (
                                <>
                                    <CloudUploadIcon sx={{ fontSize: 48, color: '#00bfae' }} />
                                    <Typography
                                        sx={{
                                            mt: 1,
                                            mb: 1,
                                            fontWeight: 600,
                                            color: '#00bfae',
                                            fontSize: '20px'
                                        }}
                                    >
                                        Upload Image
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        sx={{
                                            backgroundColor: '#00bfae',
                                            color: '#fff',
                                            mt: 1,
                                            fontWeight: 'bold'
                                        }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            fileInputRef.current.click();
                                        }}
                                        disabled={mode === 'View'}
                                    >
                                        BROWSE
                                    </Button>
                                    <Typography sx={{ mt: 2, color: '#888', fontSize: 13 }}>
                                        Note: Only image files allowed. Max 5MB.
                                    </Typography>
                                    {/* Optional error message */}
                                    {/* {errorMsg?.thumbNailErrorMsg && (
        <Typography
          variant="span"
          sx={{ fontSize: '14px', color: 'red', fontWeight: 'bold' }}
        >
          {errorMsg?.thumbNailErrorMsg}
        </Typography>
      )} */}
                                </>
                            )}

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={handleFileChange}
                            />

                            {image && (
                                <Box
                                    sx={{
                                        mt: 0,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        position: 'relative'
                                    }}
                                >
                                    <img
                                        src={
                                            typeof image === 'string'
                                                ? image // ✅ use full URL as-is
                                                : URL.createObjectURL(image)
                                        }
                                        alt="Thumbnail Preview"
                                        style={{
                                            maxWidth: 120,
                                            maxHeight: 120,
                                            borderRadius: 8,
                                            marginTop: 8
                                        }}
                                    />
                                    <Typography sx={{ fontSize: 13, mt: 1 }}>
                                        {typeof image === 'string' ? image.split('/').pop() : image.name}
                                    </Typography>
                                    {mode !== 'View' && (
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
                                            onClick={handleRemoveImage}
                                        >
                                            <CloseIcon fontSize="small" />
                                        </IconButton>
                                    )}
                                </Box>
                            )}
                        </Box>
                        {errorMsg?.image && <Typography variant='span' sx={{ fontSize: '14px', color: 'red', fontWeight: 'bold' }}>{errorMsg?.image}</Typography>}
                    </Grid2>
                    {mode !== "View" &&
                        <Grid2 size={12} sx={{ textAlign: 'right', margin: '10px 0' }}>
                            <Button variant='contained' sx={{ padding: '5px 20px', fontSize: '16px', backgroundColor: '#00bfae', fontWeight: 'bold' }} onClick={handleSubmit}>{mode === "Add" ? "Add testimonial" : "Update Testimonial"}</Button>
                            {/* <Button variant='contained' sx={{ marginLeft: '20px', textTransform: 'capitalize', backgroundColor: '#868787', padding: '5px 20px', fontWeight: 'bold', fontSize: '16px', }} onClick={handleClear}>Clear</Button> */}
                        </Grid2>
                    }

                </Grid2>
            </Paper>
        </React.Fragment>
    )
}

export default TestimonialsEntry