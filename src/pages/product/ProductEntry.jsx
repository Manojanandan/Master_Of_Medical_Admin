import React, { useEffect, useRef, useState } from 'react'
import Titlebar from '../../comnponents/titlebar/Titlebar'
import { useNavigate } from 'react-router-dom'
import { Alert, Autocomplete, Backdrop, Box, Button, CircularProgress, Grid, IconButton, MenuItem, Paper, Select, Snackbar, TextareaAutosize, TextField, Typography } from '@mui/material'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import CloseIcon from '@mui/icons-material/Close'
import AddIcon from '@mui/icons-material/Add';
import { useDispatch, useSelector } from 'react-redux'
import { addProduct, editProduct, getOneProductList } from './ProductReducer'
import EditIcon from '@mui/icons-material/Edit';
import { getVendor } from '../vendor/VendorReducer'

const SUBCATEGORY_OPTIONS = {
  medical: [
    { value: 'bandages', label: 'Bandages' },
    { value: 'masks', label: 'Masks' },
    { value: 'syringes', label: 'Syringes' },
  ],
  surgical: [
    { value: 'gloves', label: 'Gloves' },
    { value: 'scissors', label: 'Scissors' },
    { value: 'forceps', label: 'Forceps' },
  ],
  equipment: [
    { value: 'monitor', label: 'Monitor' },
    { value: 'stethoscope', label: 'Stethoscope' },
    { value: 'thermometer', label: 'Thermometer' },
  ],
};

const ProductEntry = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [thumbnail, setThumbnail] = useState(null)
  const [productImages, setProductImages] = useState([])
  const fileInputRef = useRef()
  const productImagesInputRef = useRef()
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [vendors, setVendors] = useState([]);
  const [allData, setAllData] = useState({ category: "", subCategory: "", productName: "", price: "", priceLabel: "", postedBy: "", productDescription: "", shelfLife: "", brandName: "", expireAfter: "", country: "India", uses: "", benefits: "", sideEffects: "", manufacturerDetails: "", status: "pending", bulkDiscount: "", rejectedReason: "" })
  const [errorMsg, setErrorMsg] = useState({ categoryError: "", subCategoryError: "", productNameError: "", priceError: "", postedByError: "", priceLabelError: "", productDescriptionError: "", shelfLifeError: "", brandNameError: "", expireAfterError: "", countryError: "", usesError: "", benefitsError: "", sideEffectsError: "", manufacturerDetailsError: "", thumbNailErrorMsg: "", productImageErrorMsg: "" })
  const mode = sessionStorage.getItem("Mode")

  const reducer = useSelector((state) => state.productReducer)
  const vendorReducer = useSelector((state) => state.vendorReducer)
  const { listOfVendor } = vendorReducer
  const { loader, successMsg, success, getOneData } = reducer

  useEffect(() => {
    // Simulate fetching and attaching unique tempId
    const processedVendors = listOfVendor?.data?.map((vendor, index) => ({
      ...vendor,
      tempId: `${vendor.name}_${index}` // Create unique temp ID
    }));
    setVendors(processedVendors);
  }, [listOfVendor]);


  useEffect(() => {
    dispatch(getVendor())
  }, [])

  useEffect(() => {
    if (getOneData?.data && mode !== "Add") {
      const data = getOneData?.data
      const additional = JSON.parse(getOneData?.data?.additionalInformation)
      console.log(additional);

      setAllData({
        ...errorMsg,
        category: data?.category, subCategory: data?.subCategory, productName: data?.name, price: data?.price, priceLabel: data?.priceLable, postedBy: data?.postedBy, productDescription: data?.description, shelfLife: additional?.shelfLife, brandName: data?.brandName, expireAfter: data?.expiresOn, country: additional?.country, uses: additional?.howToUse, benefits: data?.benefits, sideEffects: additional?.sideEffects, manufacturerDetails: additional?.manufacturer, status: allData?.status
      })
      setThumbnail(data?.thumbnailImage)
      setProductImages(data?.galleryImage)
    }
  }, [getOneData])


  useEffect(() => {
    if (sessionStorage.getItem("productId")) {
      dispatch(getOneProductList(sessionStorage.getItem("productId")))
    }

  }, [sessionStorage.getItem("productId")])

  const handleProductImagesChange = (e) => {
    const files = Array.from(e.target.files);
    setProductImages((prev) => {
      // Combine previous and new, filter images and pdfs, max 5, max 5MB each
      const all = [...prev, ...files];
      const valid = all.filter((file, idx, arr) => {
        // If file is a string (URL from API), keep it
        if (typeof file === 'string') return arr.findIndex(f => f === file) === idx;
        // If file is a File object, check type and size
        return (
          file &&
          ((file.type && file.type.startsWith('image/')) || file.type === 'application/pdf') &&
          file.size <= 5 * 1024 * 1024 &&
          arr.findIndex(f => f.name === file.name && f.size === file.size) === idx
        );
      }).slice(0, 5);
      return valid;
    });
    setErrorMsg({ ...errorMsg, productImageErrorMsg: "" });
  };

  const handleRemoveProductImage = (index) => {
    setProductImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Drag and drop handlers
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const files = Array.from(e.dataTransfer.files);
    setProductImages((prev) => {
      const all = [...prev, ...files];
      const valid = all.filter(
        (file, idx, arr) =>
          (file.type.startsWith('image/') || file.type === 'application/pdf') &&
          file.size <= 5 * 1024 * 1024 &&
          arr.findIndex(f => f.name === file.name && f.size === file.size) === idx
      ).slice(0, 5);
      return valid;
    });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleThumbnailChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setThumbnail(e.target.files[0])
      setErrorMsg({ ...errorMsg, thumbNailErrorMsg: "" })
    }
  }
  const handleRemoveThumbnail = (e) => {
    e.stopPropagation()
    setThumbnail(null)
  }

  const handleChange = (e) => {
    setAllData({ ...allData, [e.target.id]: e.target.value })
    if (e.target.id === "productName") {
      setErrorMsg({ ...errorMsg, productNameError: "" })
    }
    if (e.target.id === "postedBy") {
      setErrorMsg({ ...errorMsg, postedByError: "" })
    }
    if (e.target.id === "price") {
      setErrorMsg({ ...errorMsg, priceError: "" })
    }
    if (e.target.id === "priceLabel") {
      setErrorMsg({ ...errorMsg, priceLabelError: "" })
    }
    if (e.target.id === "shelfLife") {
      setErrorMsg({ ...errorMsg, shelfLifeError: "" })
    }
    if (e.target.id === "brandName") {
      setErrorMsg({ ...errorMsg, brandNameError: "" })
    }
    if (e.target.id === "expiresAfter") {
      setErrorMsg({ ...errorMsg, expireAfterError: "" })
    }
    if (e.target.id === "country") {
      setErrorMsg({ ...errorMsg, countryError: "" })
    }
    if (e.target.id === "uses") {
      setErrorMsg({ ...errorMsg, usesError: "" })
    }
    if (e.target.id === "benefits") {
      setErrorMsg({ ...errorMsg, benefitsError: "" })
    }
    if (e.target.id === "sideEffects") {
      setErrorMsg({ ...errorMsg, sideEffectsError: "" })
    }
    if (e.target.id === "manufacturerDetails") {
      setErrorMsg({ ...errorMsg, manufacturerDetailsError: "" })
    }
  }
  const handleDropDownChange = (e) => {
    setAllData({ ...allData, [e.target.name]: e.target.value })
    if (e.target.name === "category") {
      setErrorMsg({ ...errorMsg, categoryError: "" })
    }
    if (e.target.name === "subCategory") {
      setErrorMsg({ ...errorMsg, subCategoryError: "" })
    }
    if (e.target.name === "postedBy") {
      setErrorMsg({ ...errorMsg, postedByError: "" })
    }
  }
  const handlePostedByChange = (fieldName, value) => {
    setAllData({ ...allData, [fieldName]: value?.name })
    if (fieldName === "postedBy") {
      setErrorMsg({ ...errorMsg, postedByError: "" })
    }
  }

  const handleSubmit = () => {
    if (allData?.category === "") {
      setErrorMsg({ ...errorMsg, categoryError: "Category is required" })
    } else if (allData?.subCategory === "") {
      setErrorMsg({ ...errorMsg, subCategoryError: "Sub Category is required" })
    } else if (allData?.productName === "") {
      setErrorMsg({ ...errorMsg, productNameError: "Product Name is required" })
    } else if (allData?.postedBy === "") {
      setErrorMsg({ ...errorMsg, postedByError: "Vendor Id is required" })
    } else if (allData?.price === "") {
      setErrorMsg({ ...errorMsg, priceError: "Price is required" })
    } else if (allData?.priceLabel === "") {
      setErrorMsg({ ...errorMsg, priceLabelError: "Price Label is required" })
    } else if (allData?.shelfLife === "") {
      setErrorMsg({ ...errorMsg, shelfLifeError: "Shelf Life is required" })
    } else if (allData?.brandName === "") {
      setErrorMsg({ ...errorMsg, brandNameError: "Brand Name is required" })
    } else if (allData?.expireAfter === "") {
      setErrorMsg({ ...errorMsg, expireAfterError: "Expires After is required" })
    } else if (allData?.country === "") {
      setErrorMsg({ ...errorMsg, countryError: "Country is required" })
    } else if (allData?.manufacturerDetails === "") {
      setErrorMsg({ ...errorMsg, manufacturerDetailsError: "Manufacturer details is required" })
    } else if (!thumbnail) {
      setErrorMsg({ ...errorMsg, thumbNailErrorMsg: "Thumnail is required" })
    } else if (productImages?.length === 0) {
      setErrorMsg({ ...errorMsg, productImageErrorMsg: "Product images is required" })
    } else {

      const productData = {
        shelfLife: allData?.shelfLife,
        country: allData?.country,
        howToUse: allData?.uses,
        sideEffects: allData?.sideEffects,
        manufacturer: allData?.manufacturerDetails,
      };
      const formData = new FormData()
      formData.append('name', allData?.productName);
      formData.append('description', allData?.productDescription);
      formData.append('category', allData?.category);
      formData.append('subCategory', allData?.subCategory);
      formData.append('postedBy', allData.postedBy);
      formData.append('price', allData.price);
      formData.append('priceLable', allData.priceLabel);
      formData.append('brandName', allData.brandName);
      formData.append('benefits', allData.benefits);
      formData.append('expiresOn', allData.expireAfter);
      formData.append('status', allData.status);

      formData.append('additionalInformation', JSON.stringify(productData));
      // Handle files
      if (thumbnail) {
        formData.append('thumbnailImage', thumbnail);
      }
      if (productImages && productImages?.length > 0) {
        // All files as gallery
        for (let i = 0; i < productImages?.length; i++) {
          formData.append('galleryImage', productImages[i]);
        }
      }

      if (mode === "Add") {
        dispatch(addProduct(formData))
      } else {
        dispatch(editProduct(formData))
      }

      if (success) {
        setOpenSnackbar(true)
        navigate('/productmanagement')
        setAllData({ ...allData, category: "", subCategory: "", productName: "", price: "", priceLabel: "", postedBy: "", productDescription: "", shelfLife: "", brandName: "", expireAfter: "", country: "", uses: "", benefits: "", sideEffects: "", manufacturerDetails: "", status: "pending" })
        setErrorMsg({ ...errorMsg, categoryError: "", subCategoryError: "", productNameError: "", priceError: "", postedByError: "", priceLabelError: "", productDescriptionError: "", shelfLifeError: "", brandNameError: "", expireAfterError: "", countryError: "", usesError: "", benefitsError: "", sideEffectsError: "", manufacturerDetailsError: "", thumbNailErrorMsg: "", productImageErrorMsg: "" })
        setThumbnail(null)
        setProductImages([])
        sessionStorage.removeItem("productId")
        sessionStorage.removeItem("Mode")
      }

    }
  }
  console.log(allData.postedBy);

  return (
    <div>
      <Backdrop
        sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
        open={loader}
      >
        <CircularProgress color="secondary" />
      </Backdrop>
      <Titlebar title={"Product Details"} back={true} backClick={() => { navigate('/productmanagement'), sessionStorage.removeItem("productId"), sessionStorage.removeItem("Mode") }} />
      {successMsg && <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={openSnackbar} autoHideDuration={3000} onClose={() => setOpenSnackbar(!openSnackbar)}>
        <Alert
          onClose={() => setOpenSnackbar(!openSnackbar)}
          severity={success ? "success" : "error"}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {successMsg}
        </Alert>
      </Snackbar>}
      <Paper elevation={5} sx={{ width: '95%', margin: '2% auto', height: 'auto', borderRadius: '10px', padding: '2% 3%' }}>
        <Grid container rowSpacing={2} columnSpacing={3}>
          <Grid item xs={6}>
            <Typography variant='p' component='div' sx={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '1%' }}>Category<span style={{ color: 'red', marginLeft: '5px' }}>*</span></Typography>
            <Select
              id="category"
              size='small'
              name="category"
              value={allData?.category}
              onChange={handleDropDownChange}
              fullWidth
              displayEmpty
              disabled={mode == "View" ? true : false}
            >
              <MenuItem value="" disabled>Select Category</MenuItem>
              <MenuItem value="medical">Medical</MenuItem>
              <MenuItem value="surgical">Surgical</MenuItem>
              <MenuItem value="equipment">Equipment</MenuItem>
            </Select>
            {errorMsg?.categoryError && <Typography variant='span' sx={{ fontSize: '14px', color: 'red', fontWeight: 'bold' }}>{errorMsg?.categoryError}</Typography>}
          </Grid>
          <Grid item xs={6}>
            <Typography variant='p' component='div' sx={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '1%' }}>Sub Category<span style={{ color: 'red', marginLeft: '5px' }}>*</span></Typography>
            <Select
              id="subCategory"
              size='small'
              name='subCategory'
              value={allData?.subCategory}
              onChange={handleDropDownChange}
              fullWidth
              disabled={!allData?.category || mode == "View"}
              displayEmpty
            >
              <MenuItem value="" disabled>Select Subcategory</MenuItem>
              {allData?.category && SUBCATEGORY_OPTIONS[allData?.category].map(opt => (
                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
              ))}
            </Select>
            {errorMsg?.subCategoryError && <Typography variant='span' sx={{ fontSize: '14px', color: 'red', fontWeight: 'bold' }}>{errorMsg?.subCategoryError}</Typography>}
          </Grid>
          <Grid item xs={6}>
            <Typography variant='p' component='div' sx={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '1%' }}>Product Name<span style={{ color: 'red', marginLeft: '5px' }}>*</span></Typography>
            <TextField disabled={mode == "View" ? true : false} onChange={handleChange} fullWidth size='small' id='productName' value={allData?.productName} placeholder='Enter your product name' />
            {errorMsg?.productNameError && <Typography variant='span' sx={{ fontSize: '14px', color: 'red', fontWeight: 'bold' }}>{errorMsg?.productNameError}</Typography>}
          </Grid>
          <Grid item xs={6}>
            <Typography variant='p' component='div' sx={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '1%' }}>Posted By <span style={{ color: 'red', marginLeft: '5px' }}>*</span></Typography>
            {/* <TextField disabled={mode == "View" ? true : false} onChange={handleChange} fullWidth size='small' id='postedBy' value={allData?.postedBy} placeholder='Enter your vendo' /> */}
            <Autocomplete
              id="postedBy"
              fullWidth
              size="small"
              sx={{ marginTop: '10px' }}
              options={vendors}
              autoHighlight
              getOptionLabel={(option) => option?.name || ''}
              onChange={(event, value) => {
                handlePostedByChange("postedBy", value);
              }}
              renderOption={(props, option) => (
                <Box
                  key={option.tempId}
                  component="li"
                  sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
                  {...props}
                >
                  {option?.name}
                </Box>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  size="small"
                  autoComplete="off"
                  placeholder="Select Vendor Name"
                />
              )}
            />
            {errorMsg?.postedByError && <Typography variant='span' sx={{ fontSize: '14px', color: 'red', fontWeight: 'bold' }}>{errorMsg?.postedByError}</Typography>}
          </Grid>
          <Grid item xs={6}>
            <Typography variant='p' component='div' sx={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '1%' }}>Price<span style={{ color: 'red', marginLeft: '5px' }}>*</span></Typography>
            <TextField disabled={mode == "View" ? true : false} onChange={handleChange} fullWidth size='small' id='price' value={allData?.price} placeholder='Enter your price' />
            {errorMsg?.priceError && <Typography variant='span' sx={{ fontSize: '14px', color: 'red', fontWeight: 'bold' }}>{errorMsg?.priceError}</Typography>}

          </Grid>
          <Grid item xs={6}>
            <Typography variant='p' component='div' sx={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '1%' }}>Price Label<span style={{ color: 'red', marginLeft: '5px' }}>*</span></Typography>
            <TextField disabled={mode == "View" ? true : false} onChange={handleChange} fullWidth size='small' id='priceLabel' value={allData?.priceLabel} placeholder='Enter your price label' />
            {errorMsg?.priceLabelError && <Typography variant='span' sx={{ fontSize: '14px', color: 'red', fontWeight: 'bold' }}>{errorMsg?.priceLabelError}</Typography>}

          </Grid>
          <Grid item xs={12}>
            <Typography variant='p' component='div' sx={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '1%' }}>Product Description</Typography>
            <TextareaAutosize
              id='productDescription'
              value={allData?.productDescription}
              style={{ width: '100%', fontSize: '16px', padding: '15px 20px 0', backgroundColor: '#f8fafc' }}
              maxRows={4}
              minRows={3}
              onChange={handleChange}
              disabled={mode == "View" ? true : false}
            />
          </Grid>
          <Grid item xs={4}>
            <Typography variant='p' component='div' sx={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '1%' }}>Shelf Life<span style={{ color: 'red', marginLeft: '5px' }}>*</span></Typography>
            <TextField disabled={mode == "View" ? true : false} onChange={handleChange} fullWidth size='small' id='shelfLife' value={allData?.shelfLife} placeholder='Shelf Life' />
            {errorMsg?.shelfLifeError && <Typography variant='span' sx={{ fontSize: '14px', color: 'red', fontWeight: 'bold' }}>{errorMsg?.shelfLifeError}</Typography>}

          </Grid>
          <Grid item xs={4}>
            <Typography variant='p' component='div' sx={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '1%' }}>Brand Name<span style={{ color: 'red', marginLeft: '5px' }}>*</span></Typography>
            <TextField disabled={mode == "View" ? true : false} onChange={handleChange} fullWidth size='small' id='brandName' value={allData?.brandName} placeholder='Brand Nmae' />
            {errorMsg?.brandNameError && <Typography variant='span' sx={{ fontSize: '14px', color: 'red', fontWeight: 'bold' }}>{errorMsg?.brandNameError}</Typography>}

          </Grid>
          <Grid item xs={4}>
            <Typography variant='p' component='div' sx={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '1%' }}>Expires On or After<span style={{ color: 'red', marginLeft: '5px' }}>*</span></Typography>
            <TextField disabled={mode == "View" ? true : false} onChange={handleChange} fullWidth size='small' id='expireAfter' value={allData?.expireAfter} placeholder='Expire On or After' />
            {errorMsg?.expireAfterError && <Typography variant='span' sx={{ fontSize: '14px', color: 'red', fontWeight: 'bold' }}>{errorMsg?.expireAfterError}</Typography>}

          </Grid>
          <Grid item xs={4}>
            <Typography variant='p' component='div' sx={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '1%' }}>Country of Origin<span style={{ color: 'red', marginLeft: '5px' }}>*</span></Typography>
            <TextField disabled={mode == "View" ? true : false} onChange={handleChange} fullWidth size='small' id='country' value={allData?.country} placeholder='Country of Origin' disabled />
            {errorMsg?.countryError && <Typography variant='span' sx={{ fontSize: '14px', color: 'red', fontWeight: 'bold' }}>{errorMsg?.countryError}</Typography>}
          </Grid>
          <Grid item xs={4}>
            <Typography variant='p' component='div' sx={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '1%' }}>Status</Typography>
            <Select
              id="status"
              size='small'
              name='status'
              value={allData?.status}
              onChange={handleDropDownChange}
              fullWidth
              disabled={mode == "View"}
              displayEmpty
            >
              <MenuItem value="" disabled>Select Status</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="approved">Approved</MenuItem>
              <MenuItem value="rejected">Rejected</MenuItem>
            </Select>
          </Grid>
          <Grid item xs={4}>
            <Typography variant='p' component='div' sx={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '1%' }}>Bulk Discount<span style={{ color: 'red', marginLeft: '5px' }}>*</span></Typography>
            <TextField disabled={mode == "View" ? true : false} onChange={handleChange} fullWidth size='small' id='bulkDiscount' value={allData?.bulkDiscount} placeholder='Discount Offers' />
          </Grid>
          {allData?.status === "rejected" &&
            <Grid item xs={12}>
              <Typography variant='p' component='div' sx={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '1%' }}>Rejected Reason<span style={{ color: 'red', marginLeft: '5px' }}>*</span></Typography>
              <TextareaAutosize
                id='rejectedReason'
                value={allData?.rejectedReason}
                style={{ width: '100%', fontSize: '16px', padding: '15px 20px 0', backgroundColor: '#f8fafc' }}
                maxRows={4}
                minRows={3}
                onChange={handleChange}
                disabled={mode == "View" ? true : false}
              />
            </Grid>
          }
          <Grid item xs={12}>
            <Typography variant='p' component='div' sx={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '1%' }}>How to Use<span style={{ color: 'red', marginLeft: '5px' }}>*</span></Typography>
            <TextareaAutosize
              id='uses'
              value={allData?.uses}
              style={{ width: '100%', fontSize: '16px', padding: '15px 20px 0', backgroundColor: '#f8fafc' }}
              maxRows={4}
              minRows={3}
              onChange={handleChange}
              disabled={mode == "View" ? true : false}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant='p' component='div' sx={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '1%' }}>Benefits<span style={{ color: 'red', marginLeft: '5px' }}>*</span></Typography>
            <TextareaAutosize
              id='benefits'
              value={allData?.benefits}
              style={{ width: '100%', fontSize: '16px', padding: '15px 20px 0', backgroundColor: '#f8fafc' }}
              maxRows={4}
              minRows={3}
              onChange={handleChange}
              disabled={mode == "View" ? true : false}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant='p' component='div' sx={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '1%' }}>Side Effects<span style={{ color: 'red', marginLeft: '5px' }}>*</span></Typography>
            <TextareaAutosize
              id='sideEffects'
              value={allData?.sideEffects}
              style={{ width: '100%', fontSize: '16px', padding: '15px 20px 0', backgroundColor: '#f8fafc' }}
              maxRows={4}
              minRows={3}
              onChange={handleChange} disabled={mode == "View" ? true : false}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant='p' component='div' sx={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '1%' }}>Manufacturer Details<span style={{ color: 'red', marginLeft: '5px' }}>*</span></Typography>
            <TextareaAutosize
              id='manufacturerDetails'
              value={allData?.manufacturerDetails}
              style={{ width: '100%', fontSize: '16px', padding: '15px 20px 0', backgroundColor: '#f8fafc' }}
              maxRows={4}
              minRows={3}
              onChange={handleChange}
              disabled={mode == "View" ? true : false}
            />
            {errorMsg?.manufacturerDetailsError && <Typography variant='span' sx={{ fontSize: '14px', color: 'red', fontWeight: 'bold' }}>{errorMsg?.manufacturerDetailsError}</Typography>}
          </Grid>
          <Grid item xs={12}>
            <Typography variant='p' component='div' sx={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '1%' }}>Mediguard Essentials<span style={{ color: 'red', marginLeft: '5px' }}>*</span></Typography>
            <TextareaAutosize
              id='manufacturerDetails'
              value={allData?.manufacturerDetails}
              style={{ width: '100%', fontSize: '16px', padding: '15px 20px 0', backgroundColor: '#f8fafc' }}
              maxRows={4}
              minRows={3}
              onChange={handleChange}
              disabled={mode == "View" ? true : false}
            />
            {errorMsg?.manufacturerDetailsError && <Typography variant='span' sx={{ fontSize: '14px', color: 'red', fontWeight: 'bold' }}>{errorMsg?.manufacturerDetailsError}</Typography>}
          </Grid>
          <Grid item xs={12}>
            <Typography variant='p' component='div' sx={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '1%' }}>Product Thumbnail<span style={{ color: 'red', marginLeft: '5px' }}>*</span></Typography>
            <Box
              sx={{
                border: '2px dashed #00bfae',
                borderRadius: '10px',
                padding: '32px',
                textAlign: 'center',
                backgroundColor: '#f8fafc',
                position: 'relative',
                cursor: thumbnail ? 'default' : 'pointer',
                minHeight: 120,
              }}
              onClick={() => {
                if (!thumbnail) fileInputRef.current.click()
              }}

            >
              {!thumbnail && (
                <>
                  <CloudUploadIcon sx={{ fontSize: 48, color: '#00bfae' }} />
                  <Typography sx={{ mt: 1, mb: 1, fontWeight: 600, color: '#00bfae', fontSize: '20px' }}>
                    Upload Thumbnail
                  </Typography>
                  <Button
                    variant="contained"
                    sx={{ backgroundColor: '#00bfae', color: '#fff', mt: 1, fontWeight: 'bold' }}
                    onClick={(e) => {
                      e.stopPropagation()
                      fileInputRef.current.click()
                    }}
                    disabled={mode == "View" ? true : false}
                  >
                    BROWSE
                  </Button>
                  <Typography sx={{ mt: 2, color: '#888', fontSize: 13 }}>
                    Note: Only image files allowed. Max 5MB.
                  </Typography>
                  {errorMsg?.thumbNailErrorMsg && <Typography variant='span' sx={{ fontSize: '14px', color: 'red', fontWeight: 'bold' }}>{errorMsg?.thumbNailErrorMsg}</Typography>}
                </>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleThumbnailChange}
              />
              {thumbnail && (
                <Box sx={{ mt: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                  <img
                    src={
                      typeof thumbnail === 'string'
                        ? (thumbnail.startsWith('http') ? thumbnail : `http://luxcycs.com:5500/${thumbnail}`)
                        : URL.createObjectURL(thumbnail)
                    }
                    alt="Thumbnail Preview"
                    style={{ maxWidth: 120, maxHeight: 120, borderRadius: 8, marginTop: 8 }}
                  />
                  <Typography sx={{ fontSize: 13, mt: 1 }}>
                    {typeof thumbnail === 'string' ? thumbnail.split('/').pop() : thumbnail.name}
                  </Typography>
                  {mode !== "View" &&
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
                      onClick={handleRemoveThumbnail}
                    >

                      <CloseIcon fontSize="small" />
                    </IconButton>
                  }
                </Box>
              )}
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Typography variant='p' component='div' sx={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '1%' }}>Product Image<span style={{ color: 'red', marginLeft: '5px' }}>*</span></Typography>
            <Box
              sx={{
                border: '2px dashed #00bfae',
                borderRadius: '10px',
                padding: '32px',
                textAlign: 'center',
                backgroundColor: '#f8fafc',
                position: 'relative',
                minHeight: 120,
              }}
              // onClick={() => {
              //   if (productImages.length < 5) productImagesInputRef.current.click();
              // }}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              {productImages.length === 0 && (
                <>
                  <CloudUploadIcon sx={{ fontSize: 48, color: '#00bfae' }} />
                  <Typography sx={{ mt: 1, mb: 1, fontWeight: 600, color: '#00bfae', fontSize: '20px' }}>
                    Drag and Drop files here
                  </Typography>
                  <Button
                    variant="contained"
                    sx={{ backgroundColor: '#00bfae', color: '#fff', mt: 1, fontWeight: 'bold' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      productImagesInputRef.current.click();
                    }}
                    disabled={mode == "View" ? true : false}
                  >
                    BROWSE
                  </Button>
                  <Typography sx={{ mt: 2, color: '#888', fontSize: 13 }}>
                    Note: Image dimensions should be 600 x 600. Max 5 files, 5MB each.
                  </Typography>
                  {errorMsg?.productImageErrorMsg && <Typography variant='span' sx={{ fontSize: '14px', color: 'red', fontWeight: 'bold' }}>{errorMsg?.productImageErrorMsg}</Typography>}

                </>
              )}
              <input
                ref={productImagesInputRef}
                type="file"
                accept="application/pdf,image/jpeg,image/png,image/jpg"
                multiple
                style={{ display: 'none' }}
                onChange={handleProductImagesChange}
              />
              {productImages.length > 0 && (
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
                  {productImages.map((file, idx) => {
                    // file can be a string (URL) or a File object
                    const isUrl = typeof file === 'string';
                    const url = isUrl ? file : URL.createObjectURL(file);
                    const isPdf = url.toLowerCase().endsWith('.pdf') || (file.type && file.type === 'application/pdf');
                    return (
                      <Box key={idx} sx={{ position: 'relative', display: 'inline-block', m: 1, width: 100 }}>
                        {isPdf ? (
                          <Box
                            sx={{
                              width: 100,
                              height: 100,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              borderRadius: 8,
                              border: '1px solid #ccc',
                              background: '#fff'
                            }}
                          >
                            <img
                              src="https://cdn.jsdelivr.net/gh/edent/SuperTinyIcons/images/svg/pdf.svg"
                              alt="PDF"
                              style={{ width: 40, height: 40 }}
                            />
                          </Box>
                        ) : (
                          <img
                            src={url}
                            alt={`Product ${idx + 1}`}
                            style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 8, border: '1px solid #ccc' }}
                          />
                        )}
                        {mode !== "View" &&
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
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveProductImage(idx);
                            }}
                          >
                            <CloseIcon fontSize="small" />
                          </IconButton>
                        }
                        <Typography sx={{ fontSize: 12, mt: 1, textAlign: 'center', maxWidth: 100, wordBreak: 'break-all' }}>
                          {isUrl ? url.split('/').pop() : file.name}
                        </Typography>
                      </Box>
                    );
                  })}
                  {productImages.length < 5 && (
                    <Button
                      variant="outlined"
                      sx={{ height: 100, width: 100, m: 1, border: '1px dashed #00bfae', color: '#00bfae' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        productImagesInputRef.current.click();
                      }}
                      disabled={mode == "View" ? true : false}
                    >
                      +
                    </Button>
                  )}
                </Box>
              )}
            </Box>
          </Grid>
        </Grid>
        <Box sx={{ margin: '2% 0', padding: '10px 0', textAlign: 'right' }}>
          {mode !== "View" &&
            <Button onClick={handleSubmit} size='large' startIcon={mode === "Edit" ? <EditIcon /> : <AddIcon />} variant='contained' sx={{ fontWeight: 'bold', backgroundColor: "#00bfae" }}>{mode === "Edit" ? "Update Product" : "Add Product"}</Button>
          }
        </Box>
      </Paper>
    </div>
  )
}

export default ProductEntry