import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Titlebar from '../../comnponents/titlebar/Titlebar'
import { Alert, Backdrop, Box, Button, CircularProgress, Grid2, IconButton, MenuItem, Paper, Select, Snackbar, TextareaAutosize, TextField, Typography } from '@mui/material'
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close'
import { useDispatch, useSelector } from 'react-redux';
import { addOfferBanner } from './OffersBannerReducer';

const OffersBannerEntry = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const bannerInputRef = useRef()
  const bannerId = sessionStorage.getItem("bannerId")
  const mode = sessionStorage.getItem("Mode")
  const [bannerImage, setBannerImage] = useState(null);
  const [ctaText, setCtaText] = useState("")
  const [ctaLink, setCtaLink] = useState("")
  const [status, setStatus] = useState("")
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const [errorMsg, setErrorMsg] = useState({ bannerImageError: "", ctaTextError: "", ctaLinkError: "", statusError: "" })


  const reducerResponse = useSelector((state) => state.offerBannerReducer)
  const { loader, message, success } = reducerResponse

  const handleBannerImgChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setBannerImage(e.target.files[0])
    }
    setErrorMsg({ ...errorMsg, bannerImageError: "" })
  }
  const handleRemoveBannerImg = (e) => {
    e.stopPropagation()
    setBannerImage(null)
  }

  useEffect(() => {
    if (mode !== "Add") {
      dispatch(fetchOneBanner(bannerId))
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

  // useMemo(() => {
  //   if (getOneData) {
  //     const resolveImagePath = () => {
  //       if (!getOneData?.featuredImage) return null;

  //       let imagePath = getOneData.featuredImage;

  //       if (typeof imagePath === 'object' && imagePath?.path) {
  //         imagePath = imagePath.path;
  //       } else if (Array.isArray(imagePath)) {
  //         imagePath = imagePath[0];
  //       }

  //       return typeof imagePath === 'string'
  //         ? (imagePath.startsWith('http') ? imagePath : `http://luxcycs.com:5500/${imagePath}`)
  //         : null;
  //     };
  //     const resolveBannerImagePath = () => {
  //       if (!getOneData?.bannerImage) return null;

  //       let imagePath = getOneData.bannerImage;

  //       if (typeof imagePath === 'object' && imagePath?.path) {
  //         imagePath = imagePath.path;
  //       } else if (Array.isArray(imagePath)) {
  //         imagePath = imagePath[0];
  //       }

  //       return typeof imagePath === 'string'
  //         ? (imagePath.startsWith('http') ? imagePath : `http://luxcycs.com:5500/${imagePath}`)
  //         : null;
  //     };
  //     setFeatureImage(resolveImagePath);
  //     setBannerImage(resolveBannerImagePath)
  //     setTitle(getOneData?.title)
  //     settype(getOneData?.type)
  //     setctaText(getOneData?.ctaText)
  //     setdescription(getOneData?.description)
  //     if (getOneData?.content) {
  //       const contentBlock = htmlToDraft(getOneData?.content);
  //       if (contentBlock) {
  //         const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
  //         const newEditorState = EditorState.createWithContent(contentState);
  //         setEditorState(newEditorState);
  //       }
  //     }
  //   }
  // }, [getOneData])

  const handleSubmit = () => {
    if (ctaText === "") {
      setErrorMsg({ ...errorMsg, ctaTextError: "CTA Text is required" })
    } else if (ctaLink === "") {
      setErrorMsg({ ...errorMsg, ctaLinkError: "CTA Link is required" })
    } else if (bannerImage === "" || bannerImage === null) {
      setErrorMsg({ ...errorMsg, bannerImageError: "Banner Image is required" })
    } else {
      const formData = new FormData()

      if (mode !== "Add") {
        formData.append("id", bannerId)
        formData.append("status", status)
      }

      formData.append("ctaText", ctaText ?? null)
      formData.append("ctaLink", ctaLink ?? null)
      formData.append("bannerImage  ", bannerImage)

      if (mode === "Add") {
        dispatch(addOfferBanner(formData))
      } else {
        dispatch(putBlogData((formData)))
      }
    }
  }

  const handleClose = () => {
    setOpenSnackbar(!openSnackbar)
    // sessionStorage.removeItem("bannerId")
    // sessionStorage.removeItem("Mode")
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
          </Grid2>
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
              <Button variant='contained' sx={{ padding: '5px 20px', fontSize: '16px', backgroundColor: '#00bfae', fontWeight: 'bold' }} onClick={handleSubmit}>{mode === "Add" ? "Add Banner" : "Update Banner"}</Button>
              {/* <Button variant='contained' sx={{ marginLeft: '20px', textTransform: 'capitalize', backgroundColor: '#868787', padding: '5px 20px', fontWeight: 'bold', fontSize: '16px', }} onClick={handleClear}>Clear</Button> */}
            </Grid2>
          }

        </Grid2>
      </Paper>
    </React.Fragment>
  )
}

export default OffersBannerEntry