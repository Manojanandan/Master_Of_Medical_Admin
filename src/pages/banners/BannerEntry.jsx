import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Titlebar from '../../comnponents/titlebar/Titlebar'
import { Alert, Backdrop, Box, Button, CircularProgress, Grid2, IconButton, MenuItem, Paper, Select, Snackbar, TextareaAutosize, TextField, Typography } from '@mui/material'
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close'
import { useDispatch, useSelector } from 'react-redux';
import { addBanner, editBanner, fetchOneBanner, resetMessage } from './BannerReducer';
import { Mode } from '@mui/icons-material';

const BannerEntry = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const bannerInputRef = useRef()
  const mode = sessionStorage.getItem("Mode")
  const [bannerImage, setBannerImage] = useState(null);
  const [title, setTitle] = useState("")
  const [type, setType] = useState("home-banner")
  const [ctaText, setCtaText] = useState("")
  const [ctaLink, setCtaLink] = useState("")
  const [status, setStatus] = useState("")
  const [description, setDescription] = useState("")
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [isImageChanged, setIsImageChanged] = useState(false);

  const [errorMsg, setErrorMsg] = useState({ titleError: "", typeError: "", bannerImageError: "", ctaTextError: "", descriptionError: "", ctaLinkError: "", statusError: "" })

  const reducerResponse = useSelector((state) => state.bannerReducer)
  const { loader, message, success, getOneBannerData } = reducerResponse

  useEffect(() => { dispatch(resetMessage()) }, [])

  const handleBannerImgChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setBannerImage(e.target.files[0])
      setIsImageChanged(true);
    }
    setErrorMsg({ ...errorMsg, bannerImageError: "" })
  }
  const handleRemoveBannerImg = (e) => {
    e.stopPropagation()
    setBannerImage(null)
  }

  useEffect(() => {
    if (mode !== "Add") {
      dispatch(fetchOneBanner(sessionStorage.getItem("bannerId")))
    }
  }, [])

  useEffect(() => {
    if (message) {
      setOpenSnackbar(true)

      const timer = success && setTimeout(() => {
        navigate('/banners');
        sessionStorage.removeItem("bannerId")
        sessionStorage.removeItem("Mode")
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [message, navigate]);

  useMemo(() => {
    if (getOneBannerData?.data && Mode !== "Add") {
      const resolveBannerImagePath = () => {
        if (!getOneBannerData?.data?.bannerImage) return null;

        let imagePath = getOneBannerData?.data?.bannerImage;

        if (typeof imagePath === 'object' && imagePath?.path) {
          imagePath = imagePath.path;
        } else if (Array.isArray(imagePath)) {
          imagePath = imagePath[0];
        }

        return typeof imagePath === 'string'
          ? (imagePath.startsWith('http') ? imagePath : `http://luxcycs.com:5500/${imagePath}`)
          : null;
      };
      setBannerImage(resolveBannerImagePath)
      setTitle(getOneBannerData?.data?.title)
      setType(getOneBannerData?.data?.type)
      setCtaText(getOneBannerData?.data?.ctaText)
      setCtaLink(getOneBannerData?.data?.ctaLink)
      setDescription(getOneBannerData?.data?.description)
      setStatus(getOneBannerData?.data?.status)
    }
  }, [getOneBannerData])

  const handleSubmit = () => {
    // if (title === "") {
    //   setErrorMsg({ ...errorMsg, titleError: "Banner Title is required" })
    // } else if (type === "") {
    //   setErrorMsg({ ...errorMsg, typeError: "Type is required" })
    // } else if (description === "") {
    //   setErrorMsg({ ...errorMsg, descriptionError: "Decription is required" })
    // } else if (ctaText === "") {
    //   setErrorMsg({ ...errorMsg, ctaTextError: "CTA Text is required" })
    // } else if (ctaLink === "") {
    //   setErrorMsg({ ...errorMsg, ctaLinkError: "CTA Link is required" })
    // } else 
    if (bannerImage === "" || bannerImage === null) {
      setErrorMsg({ ...errorMsg, bannerImageError: "Banner Image is required" })
    } else {
      const formData = new FormData()

      if (mode !== "Add") {
        formData.append("id", sessionStorage.getItem("bannerId"))
        formData.append("status", status)
      }

      // formData.append("title", title ?? null)
      // formData.append("ctaText", ctaText ?? null)
      // formData.append("ctaLink", ctaLink ?? null)
      // formData.append("description", description ?? null)
      formData.append("type", type ?? null)
      if (isImageChanged) {
        formData.append("bannerImage  ", bannerImage)
      }

      if (mode === "Add") {
        dispatch(addBanner(formData))
      } else {
        dispatch(editBanner((formData)))
      }
    }
  }

  const handleClose = () => {
    setOpenSnackbar(!openSnackbar)
  }

  return (
    <React.Fragment>
      <Backdrop
        sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
        open={loader}
      >
        <CircularProgress color="secondary" />
      </Backdrop>
      <Titlebar title={"Banner Entry"} filter={false} back={true} backClick={() => { navigate('/banners'), sessionStorage.removeItem("Mode"), sessionStorage.removeItem("bannerId") }} />
      {message && <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={openSnackbar} autoHideDuration={2000} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity={success ? "success" : "error"}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {message}
        </Alert>
      </Snackbar>}
      <Paper elevation={5} sx={{ width: '95%', margin: '2% auto', height: 'auto', borderRadius: '10px', padding: '2% 3%' }}>
        <Grid2 container columnSpacing={4} rowSpacing={3}>
          {/* <Grid2 size={6} >
            <Typography variant='p' sx={{ fontWeight: 'bold', }}>Banner Title <span style={{ color: 'red' }}>*</span></Typography><br />
            <TextField
              id="title"
              size="small"
              sx={{ margin: '2% 0' }}
              autoComplete='off'
              fullWidth
              placeholder='Enter Banner title'
              onChange={(e) => { setTitle(e.target.value), setErrorMsg({ ...errorMsg, titleError: "" }) }}
              value={title ?? ""}
              disabled={mode === "View" ? true : ""}
            />
            {errorMsg?.titleError && <Typography variant='span' sx={{ fontSize: '14px', color: 'red', fontWeight: 'bold' }}>{errorMsg?.titleError}</Typography>}
          </Grid2>
          <Grid2 size={6} >
            <Typography variant='p' sx={{ fontWeight: 'bold', }}>Type <span style={{ color: 'red' }}>*</span></Typography><br />
             <Select
                id="type"
                size='small'
                name='status'
                value={type}
                onChange={(e) => { setType(e.target.value), setErrorMsg({ ...errorMsg, typeError: "" }) }}
                fullWidth
                displayEmpty
              >
                <MenuItem value="" disabled>Select Status</MenuItem>
                <MenuItem value="landing">Landing</MenuItem>
                <MenuItem value="e-commerce">E-commerce</MenuItem>
              </Select>
            {errorMsg?.typeError && <Typography variant='span' sx={{ fontSize: '14px', color: 'red', fontWeight: 'bold' }}>{errorMsg?.typeError}</Typography>}
          </Grid2>
          <Grid2 size={12} >
            <Typography variant='p' sx={{ fontWeight: 'bold', }}>Description<span style={{ color: 'red' }}>*</span></Typography><br />
            <TextareaAutosize
              id='description'
              value={description}
              style={{ width: '100%', fontSize: '16px', padding: '15px 20px 0', backgroundColor: '#f8fafc' }}
              maxRows={5}
              minRows={5}
              onChange={(e) => { setDescription(e.target.value), setErrorMsg({ ...errorMsg, descriptionError: "" }) }}
            />
            {errorMsg?.descriptionError && <Typography variant='span' sx={{ fontSize: '14px', color: 'red', fontWeight: 'bold' }}>{errorMsg?.descriptionError}</Typography>}
          </Grid2>
          <Grid2 size={6} >
            <Typography variant='p' sx={{ fontWeight: 'bold', }}>CTA Text <span style={{ color: 'red' }}>*</span></Typography><br />
            <TextField
              id="ctaText"
              size="small"
              sx={{ margin: '2% 0' }}
              autoComplete='off'
              fullWidth
              placeholder='Enter CTA Text'
              onChange={(e) => { setCtaText(e.target.value), setErrorMsg({ ...errorMsg, ctaTextError: "" }) }}
              value={ctaText ?? ""}
            />
            {errorMsg?.ctaTextError && <Typography variant='span' sx={{ fontSize: '14px', color: 'red', fontWeight: 'bold' }}>{errorMsg?.ctaTextError}</Typography>}
          </Grid2>
          <Grid2 size={6} >
            <Typography variant='p' sx={{ fontWeight: 'bold', }}>CTA Link <span style={{ color: 'red' }}>*</span></Typography><br />
            <TextField
              id="ctaLink"
              size="small"
              sx={{ margin: '2% 0' }}
              autoComplete='off'
              fullWidth
              placeholder='Enter CTA Link'
              onChange={(e) => { setCtaLink(e.target.value), setErrorMsg({ ...errorMsg, ctaLinkError: "" }) }}
              value={ctaLink ?? ""}
            />
            {errorMsg?.ctaLinkError && <Typography variant='span' sx={{ fontSize: '14px', color: 'red', fontWeight: 'bold' }}>{errorMsg?.ctaLinkError}</Typography>}
          </Grid2> */}
          <Grid2 size={12} >
            <Typography variant='p' sx={{ fontWeight: 'bold', }}>Banner Image <span style={{ color: 'red' }}>*</span></Typography><br />
            <Box
              sx={{
                border: '2px dashed #00bfae',
                borderRadius: '10px',
                padding: '32px',
                textAlign: 'center',
                backgroundColor: '#f8fafc',
                position: 'relative',
                minHeight: 120,
                marginTop: 1,
              }}
              onClick={() => {
                if (!bannerImage) bannerInputRef.current.click();
              }}
            >
              {/* Upload Box */}
              {!bannerImage && (
                <>
                  <CloudUploadIcon sx={{ fontSize: 48, color: '#00bfae' }} />
                  <Typography sx={{ mt: 1, mb: 1, fontWeight: 600, color: '#00bfae', fontSize: '20px' }}>
                    Upload Banner Image
                  </Typography>
                  <Button
                    variant="contained"
                    sx={{ backgroundColor: '#00bfae', color: '#fff', mt: 1, fontWeight: 'bold' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      bannerInputRef.current.click();
                    }}
                  >
                    BROWSE
                  </Button>
                  <Typography sx={{ mt: 2, color: '#888', fontSize: 13 }}>
                    Note: Only image files allowed. Max 5MB.
                  </Typography>
                </>
              )}

              {/* File Input */}
              <input
                ref={bannerInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleBannerImgChange}
              />

              {/* Preview Box */}
              {bannerImage && (
                <Box
                  sx={{
                    mt: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    position: 'relative',
                  }}
                >
                  {/* Image Source Logic */}
                  {(() => {
                    let imageSrc = null;

                    if (typeof bannerImage === 'string' && bannerImage !== '') {
                      imageSrc = bannerImage.startsWith('http')
                        ? bannerImage
                        : `http://luxcycs.com:5500/${bannerImage}`;
                    } else if (bannerImage instanceof File) {
                      imageSrc = URL.createObjectURL(bannerImage);
                    }

                    return (
                      imageSrc && (
                        <img
                          src={imageSrc}
                          alt="Thumbnail Preview"
                          style={{
                            maxWidth: 120,
                            maxHeight: 120,
                            borderRadius: 8,
                            marginTop: 8,
                            objectFit: 'cover',
                          }}
                        />
                      )
                    );
                  })()}

                  {/* File Name */}
                  <Typography sx={{ fontSize: 13, mt: 1 }}>
                    {typeof bannerImage === 'string'
                      ? bannerImage.split('/').pop()
                      : bannerImage?.name}
                  </Typography>

                  {/* Remove Button */}
                  {mode !== 'View' && (
                    <IconButton
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        background: '#fff',
                        border: '1px solid #ccc',
                        '&:hover': { background: '#f8fafc' },
                      }}
                      onClick={handleRemoveBannerImg}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  )}
                </Box>
              )}
            </Box>
            {errorMsg?.bannerImageError && <Typography variant='span' sx={{ fontSize: '14px', color: 'red', fontWeight: 'bold' }}>{errorMsg?.bannerImageError}</Typography>}
          </Grid2>
          {mode !== "Add" &&
            <Grid2 size={6}>
              <Typography variant='p' component='div' sx={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '1%' }}>Status</Typography>
              <Select
                id="status"
                size='small'
                name='status'
                value={status}
                onChange={(e) => { setStatus(e.target.value), setErrorMsg({ ...errorMsg, statusError: "" }) }}
                fullWidth
                displayEmpty
              >
                <MenuItem value="" disabled>Select Status</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="in-active">In-Active</MenuItem>
              </Select>
            </Grid2>
          }
          {mode !== "View" &&
            <Grid2 size={12} sx={{ marginBottom: '10px', textAlign: 'right' }}>
              <Button variant='contained' sx={{ padding: '5px 20px', fontSize: '16px', backgroundColor: '#00bfae', fontWeight: 'bold' }} onClick={handleSubmit}>{mode === "Add" ? "Add Blog" : "Update Blog"}</Button>
              {/* <Button variant='contained' sx={{ marginLeft: '20px', textTransform: 'capitalize', backgroundColor: '#868787', padding: '5px 20px', fontWeight: 'bold', fontSize: '16px', }} onClick={handleClear}>Clear</Button> */}
            </Grid2>
          }

        </Grid2>
      </Paper>
    </React.Fragment>
  )
}

export default BannerEntry