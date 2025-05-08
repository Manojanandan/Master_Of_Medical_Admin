import React, { useEffect, useMemo, useState } from 'react'
import Titlebar from '../../comnponents/titlebar/Titlebar'
import { Alert, Backdrop, Box, Button, CircularProgress, Grid2, TextareaAutosize, TextField, Typography } from '@mui/material'
import { styled } from '@mui/material/styles';

import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useLocation, useNavigate, } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getOneDataTestimonial, postTestimonial, putTestimonial, resetMessage } from './TestimonialReducer';

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});


const TestimonialsEntry = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const useQuery = new URLSearchParams(useLocation().search)
    const testimonialId = useQuery.get("testimonialId")
    const mode = useQuery.get("Mode")

    const [name, setName] = useState('')
    const [message, setMessage] = useState('')
    const [designation, setDesignation] = useState('')
    const [imageFile, setImageFile] = useState(null)
    const [image, setImage] = useState(null);

    const reducerResponse = useSelector((state) => state.testimonial)

    const successMsg = reducerResponse?.message
    const Load = reducerResponse?.loader
    const getData = reducerResponse?.getOneData?.data


    useEffect(() => {
        dispatch(resetMessage())
        if (mode !== "Add") {
            dispatch(getOneDataTestimonial(testimonialId))
        }
    }, [])

    useMemo(async () => {
        setName(getData?.name)
        setMessage(getData?.message)
        setDesignation(getData?.designation)
        setImageFile(getData?.image)
        setImage(getData?.image)
    }, [getData]);

    useEffect(() => {
        if (successMsg) {
            const timer = setTimeout(() => {
                navigate('/testimonials');
            }, 1000);

            return () => clearTimeout(timer);
        }
    }, [successMsg, navigate]);

    // iamge file selection
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file && (file.type === 'image/png' || file.type === 'image/jpeg')) {
            const previewUrl = URL.createObjectURL(file);
            setImage(previewUrl);
            setImageFile(file)

        } else {
            alert('Please select a PNG or JPEG image.');
            setImage(null);
            setImageFile(null);
        }
    };

    const handleSubmit = () => {
        const formData = new FormData();
        if (mode === "Edit") {
            formData.append("id", testimonialId)
        }
        formData.append('name', name);
        formData.append('message', message);
        formData.append('designation', designation);
        formData.append('image', imageFile);

        if (getData) {
            dispatch(putTestimonial(formData))
        } else {
            dispatch(postTestimonial(formData))
        }
    }

    const handleClear = () => {
        if (mode === "Add") {
            setName("")
            setMessage("")
            setDesignation("")
            setImage(null)
            setImageFile(null)
        } else {
            dispatch(getOneDataTestimonial(testimonialId))
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
            <Titlebar title={"Testimonial Details"} filter={false} back={true} backClick={() => navigate('/testimonials')} />
            {successMsg &&
                <Alert variant="filled" severity="success" sx={{ margin: '15px auto', width: '95%', fontSize: '16px' }}>
                    {successMsg}
                </Alert>
            }
            <Box sx={{ height: '80vh', width: '92%', margin: '2% auto', }}>
                <Grid2 container>
                    <Grid2 size={{ xs: 2, sm: 4, md: 8 }} sx={{ marginBottom: '10px' }}>
                        <Typography variant='p' sx={{ fontWeight: 'bold', }}>Message <span style={{ color: 'red' }}>*</span></Typography><br />
                        <TextareaAutosize
                            aria-label="minimum height"
                            minRows={4}
                            style={{ margin: '2% 0',width:'500px',padding:'20px 12px 5px',outline:'none',backgroundColor:'transparent',borderRadius:'5px',fontFamily:'sans-serif',fontSize: '16px' }}
                            autoComplete='off'
                            fullWidth
                            placeholder='Enter Message'
                            value={message ?? ""}
                            disabled={mode === "View" && true}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                    </Grid2>
                    <Grid2 size={{ xs: 2, sm: 4, md: 8 }} sx={{ marginBottom: '10px' }}>
                        <Typography variant='p' sx={{ fontWeight: 'bold', }}>Image <span style={{ color: 'red' }}>*</span></Typography><br />
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Button
                                sx={{ margin: '10px 0', textTransform: 'capitalize', fontSize: '16px', backgroundColor: '#02998e' }}
                                component="label"
                                variant="contained"
                                tabIndex={-1}
                                startIcon={<CloudUploadIcon />}
                                disabled={mode === "View" && true}
                            >
                                Upload
                                <VisuallyHiddenInput
                                    type="file"
                                    accept="image/png, image/jpeg" // Restrict file types to PNG and JPEG
                                    onChange={handleFileChange}
                                />
                            </Button>
                            {image && (
                                <div style={{ marginLeft: '10%' }}>
                                    <img
                                        src={image}
                                        alt="Preview"
                                        style={{
                                            width: '200px',
                                            height: 'auto',
                                        }}
                                    />
                                </div>
                            )}
                        </Box>
                    </Grid2>

                    <Grid2 size={{ xs: 2, sm: 4, md: 8 }} sx={{ marginBottom: '10px' }}>
                        <Typography variant='p' sx={{ fontWeight: 'bold', }}>Name <span style={{ color: 'red' }}>*</span></Typography><br />
                        <TextField
                            id="name"
                            size="small"
                            sx={{ margin: '2% 0' }}
                            autoComplete='off'
                            fullWidth
                            placeholder='Enter Name'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            disabled={mode === "View" && true}
                        />
                    </Grid2>
                    <Grid2 size={{ xs: 2, sm: 4, md: 8 }} sx={{ marginBottom: '10px' }}>
                        <Typography variant='p' sx={{ fontWeight: 'bold', }}>Destination <span style={{ color: 'red' }}>*</span></Typography><br />
                        <TextField
                            id="name"
                            size="small"
                            sx={{ margin: '2% 0' }}
                            autoComplete='off'
                            fullWidth
                            placeholder='Enter Destination'
                            onChange={(e) => setDesignation(e.target.value)}
                            value={designation}
                            disabled={mode === "View" && true}
                        />
                    </Grid2>
                    {mode !== "View" &&
                        <Grid2 size={{ xs: 2, sm: 4, md: 6 }} sx={{ marginBottom: '10px', }}>
                            <Button variant='contained' sx={{ textTransform: 'capitalize', padding: '5px 20px', fontSize: '16px', backgroundColor: '#9b2f7d', fontWeight: 'bold' }} onClick={handleSubmit}>Submit</Button>
                            <Button variant='contained' sx={{ marginLeft: '20px', textTransform: 'capitalize', backgroundColor: '#868787', padding: '5px 20px', fontWeight: 'bold', fontSize: '16px', }} onClick={handleClear}>Clear</Button>
                        </Grid2>
                    }

                </Grid2>
            </Box>
        </React.Fragment>
    )
}

export default TestimonialsEntry