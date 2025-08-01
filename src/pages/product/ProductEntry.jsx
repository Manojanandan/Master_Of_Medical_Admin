import React, { useEffect, useRef, useState } from "react";
import Titlebar from "../../comnponents/titlebar/Titlebar";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Autocomplete,
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  MenuItem,
  Paper,
  Rating,
  Select,
  Snackbar,
  TextareaAutosize,
  TextField,
  Typography,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import { useDispatch, useSelector } from "react-redux";
import {
  addProduct,
  editProduct,
  getCategory,
  getOneProductList,
  getSubCategory,
  resetMessage,
} from "./ProductReducer";
import EditIcon from "@mui/icons-material/Edit";
import { getVendor } from "../vendor/VendorReducer";

const ProductEntry = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [removedImages, setRemovedImages] = useState(false);
  const [thumbnail, setThumbnail] = useState(null);
  const [productImages, setProductImages] = useState([]);
  const fileInputRef = useRef();
  const productImagesInputRef = useRef();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [isImgChanged, setIsImgChanged] = useState(false);
  const [vendors, setVendors] = useState([]);
  const [allData, setAllData] = useState({
    category: "",
    subCategory: "",
    productName: "",
    price: "",
    priceLabel: "",
    postedBy: "",
    productDescription: "",
    shelfLife: "",
    brandName: "",
    expireAfter: "",
    country: "India",
    uses: "",
    benefits: "",
    sideEffects: "",
    manufacturerDetails: "",
    status: "pending",
    bulkDiscount: "",
    rejectedReason: "",
    mrpPrice: "",
    sellingPrice: "",
    mediguardDetails: "",
    gst: "",
    hsnCode: "",
  });
  const [errorMsg, setErrorMsg] = useState({
    categoryError: "",
    subCategoryError: "",
    productNameError: "",
    priceError: "",
    postedByError: "",
    priceLabelError: "",
    productDescriptionError: "",
    shelfLifeError: "",
    brandNameError: "",
    expireAfterError: "",
    countryError: "",
    usesError: "",
    benefitsError: "",
    sideEffectsError: "",
    manufacturerDetailsError: "",
    thumbNailErrorMsg: "",
    productImageErrorMsg: "",
    mrpPriceError: "",
    sellingPriceError: "",
    mediguardDetailsError: "",
    rejectedReasonError: "",
    gstError: "",
    hsnCodeError: "",
  });
  const mode = sessionStorage.getItem("Mode");

  const reducer = useSelector((state) => state.productReducer);
  const vendorReducer = useSelector((state) => state.vendorReducer);
  const { listOfVendor } = vendorReducer;
  const {
    loader,
    successMsg,
    success,
    getOneData,
    categoryData,
    subCategoryData,
  } = reducer;

  useEffect(() => {
    dispatch(resetMessage());
  }, []);
  useEffect(() => {
    setVendors(listOfVendor);
  }, [listOfVendor]);

  useEffect(() => {
    dispatch(getCategory());
  }, []);
  useEffect(() => {
    if (category !== "" && mode === "Add") {
      dispatch(getSubCategory(allData?.category));
    } else {
      if (allData?.category !=="") {
        dispatch(getSubCategory(allData?.category));
      }
    }
  }, [allData?.category]);

  useEffect(() => {
    dispatch(getVendor(`?allVendors=true`));
  }, []);

  useEffect(() => {
    if (getOneData?.data && mode !== "Add") {
      const data = getOneData?.data;
      let additional = "-";
      try {
        const raw = getOneData?.data?.additionalInformation;
        additional = raw ? JSON.parse(raw) : "-";
      } catch (e) {
        console.error("Invalid JSON in additionalInformation:", e);
      }

      setAllData({
        ...errorMsg,
        category: additional?.category,
        subCategory: data?.subCategoryId,
        productName: data?.name,
        price: data?.price,
        priceLabel: data?.priceLable,
        postedBy: data?.postedBy,
        productDescription: data?.description,
        shelfLife: additional?.shelfLife,
        brandName: data?.brandName,
        expireAfter: data?.expiresOn,
        country: additional?.country,
        uses: additional?.howToUse,
        benefits: data?.benefits,
        sideEffects: additional?.sideEffects,
        manufacturerDetails: additional?.manufacturer,
        status: data?.status,
        mrpPrice: additional?.mrpPrice,
        mediguardDetails: additional?.mediguardDetails,
        rejectedReason: data?.remarks == "null" ? '' : data?.remarks,
        gst: data?.gst,
        hsnCode: data?.hsnCode,
      });
      setThumbnail(data?.thumbnailImage);
      setProductImages(data?.galleryImage);
    }
  }, [getOneData]);

  useEffect(() => {
    if (sessionStorage.getItem("productId")) {
      dispatch(getOneProductList(sessionStorage.getItem("productId")));
    }
  }, [sessionStorage.getItem("productId")]);

  useEffect(() => {
    setOpenSnackbar(true);
    if (successMsg) {
      setAllData({
        ...allData,
        category: "",
        subCategory: "",
        productName: "",
        price: "",
        priceLabel: "",
        postedBy: "",
        productDescription: "",
        shelfLife: "",
        brandName: "",
        expireAfter: "",
        country: "",
        uses: "",
        benefits: "",
        sideEffects: "",
        manufacturerDetails: "",
        status: "pending",
        gst: "",
        hsnCode: "",
      });
      setErrorMsg({
        ...errorMsg,
        categoryError: "",
        subCategoryError: "",
        productNameError: "",
        priceError: "",
        postedByError: "",
        priceLabelError: "",
        productDescriptionError: "",
        shelfLifeError: "",
        brandNameError: "",
        expireAfterError: "",
        countryError: "",
        usesError: "",
        benefitsError: "",
        sideEffectsError: "",
        manufacturerDetailsError: "",
        thumbNailErrorMsg: "",
        productImageErrorMsg: "",
        gstError: "",
        hsnCodeError: "",
      });
      setThumbnail(null);
      setProductImages([]);
      sessionStorage.removeItem("productId");
      sessionStorage.removeItem("Mode");
      navigate("/productmanagement");
    }
  }, [success]);

  const handleProductImagesChange = (e) => {
    const files = Array.from(e.target.files);
    setIsImgChanged(true);
    setProductImages((prev) => {
      // Combine previous and new, filter images and pdfs, max 5, max 5MB each
      const all = [...prev, ...files];
      const valid = all
        ?.filter((file, idx, arr) => {
          // If file is a string (URL from API), keep it
          if (typeof file === "string")
            return arr.findIndex((f) => f === file) === idx;
          // If file is a File object, check type and size
          return (
            file &&
            ((file.type && file.type?.startsWith("image/")) ||
              file.type === "application/pdf") &&
            file.size <= 5 * 1024 * 1024 &&
            arr.findIndex(
              (f) => f.name === file.name && f.size === file.size
            ) === idx
          );
        })
        .slice(0, 5);
      return valid;
    });
    setErrorMsg({ ...errorMsg, productImageErrorMsg: "" });
  };

  const handleRemoveProductImage = (index) => {
    setRemovedImages(true);
    setProductImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Drag and drop handlers
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const files = Array.from(e.dataTransfer.files);
    setProductImages((prev) => {
      const all = [...prev, ...files];
      const valid = all
        ?.filter(
          (file, idx, arr) =>
            (file.type.startsWith("image/") ||
              file.type === "application/pdf") &&
            file.size <= 5 * 1024 * 1024 &&
            arr.findIndex(
              (f) => f.name === file.name && f.size === file.size
            ) === idx
        )
        .slice(0, 5);
      return valid;
    });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleThumbnailChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setThumbnail(e.target.files[0]);
      setErrorMsg({ ...errorMsg, thumbNailErrorMsg: "" });
    }
  };
  const handleRemoveThumbnail = (e) => {
    e.stopPropagation();
    setThumbnail(null);
  };

  const handleChange = (e) => {
    setAllData({ ...allData, [e.target.id]: e.target.value });
    if (e.target.id === "productName") {
      setErrorMsg({ ...errorMsg, productNameError: "" });
    }
    if (e.target.id === "postedBy") {
      setErrorMsg({ ...errorMsg, postedByError: "" });
    }
    if (e.target.id === "price") {
      setErrorMsg({ ...errorMsg, priceError: "" });
    }
    if (e.target.id === "priceLabel") {
      setErrorMsg({ ...errorMsg, priceLabelError: "" });
    }
    if (e.target.id === "productDescription") {
      setErrorMsg({ ...errorMsg, productDescriptionError: "" });
    }
    if (e.target.id === "shelfLife") {
      setErrorMsg({ ...errorMsg, shelfLifeError: "" });
    }
    if (e.target.id === "brandName") {
      setErrorMsg({ ...errorMsg, brandNameError: "" });
    }
    if (e.target.id === "expireAfter") {
      setErrorMsg({ ...errorMsg, expireAfterError: "" });
    }
    if (e.target.id === "country") {
      setErrorMsg({ ...errorMsg, countryError: "" });
    }
    if (e.target.id === "uses") {
      setErrorMsg({ ...errorMsg, usesError: "" });
    }
    if (e.target.id === "benefits") {
      setErrorMsg({ ...errorMsg, benefitsError: "" });
    }
    if (e.target.id === "sideEffects") {
      setErrorMsg({ ...errorMsg, sideEffectsError: "" });
    }
    if (e.target.id === "manufacturerDetails") {
      setErrorMsg({ ...errorMsg, manufacturerDetailsError: "" });
    }
    if (e.target.id === "mediguardDetails") {
      setErrorMsg({ ...errorMsg, mediguardDetailsError: "" });
    }
    if (e.target.id === "hsnCode") {
      setErrorMsg({ ...errorMsg, hsnCodeError: "" });
    }
  };
  const handleDropDownChange = (e) => {
    setAllData({ ...allData, [e.target.name]: e.target.value });

    if (e.target.value === "") {
      setAllData({ ...allData, subCategory: "" });
    }
    if (e.target.name === "category") {
      setErrorMsg({ ...errorMsg, categoryError: "" });
    }
    if (e.target.name === "subCategory") {
      setErrorMsg({ ...errorMsg, subCategoryError: "" });
    }
    if (e.target.name === "postedBy") {
      setErrorMsg({ ...errorMsg, postedByError: "" });
    }
    if (e.target.name === "gst") {
      setErrorMsg({ ...errorMsg, gstError: "" });
    }
  };
  const handlePostedByChange = (fieldName, value) => {
    setAllData({ ...allData, [fieldName]: value?.id });
    if (fieldName === "postedBy") {
      setErrorMsg({ ...errorMsg, postedByError: "" });
    }
  };

  const handleSubmit = () => {
    if (allData?.category === "") {
      setErrorMsg({ ...errorMsg, categoryError: "Category is required" });
    } else if (allData?.subCategory === "") {
      setErrorMsg({
        ...errorMsg,
        subCategoryError: "Sub Category is required",
      });
    } else if (allData?.productName === "") {
      setErrorMsg({
        ...errorMsg,
        productNameError: "Product Name is required",
      });
    } else if (!allData?.postedBy) {
      setErrorMsg({ ...errorMsg, postedByError: "Vendor Id is required" });
    } else if (allData?.price === "") {
      setErrorMsg({ ...errorMsg, priceError: "Price is required" });
    } else if (allData?.priceLabel === "") {
      setErrorMsg({ ...errorMsg, priceLabelError: "Price Label is required" });
    } else if (allData?.productDescription === "") {
      setErrorMsg({
        ...errorMsg,
        productDescriptionError: "Description is required",
      });
    } else if (allData?.shelfLife === "") {
      setErrorMsg({ ...errorMsg, shelfLifeError: "Shelf Life is required" });
    } else if (allData?.brandName === "") {
      setErrorMsg({ ...errorMsg, brandNameError: "Brand Name is required" });
    } else if (allData?.expireAfter === "") {
      setErrorMsg({
        ...errorMsg,
        expireAfterError: "Expires After is required",
      });
    } else if (allData?.country === "") {
      setErrorMsg({ ...errorMsg, countryError: "Country is required" });
    } else if (allData?.manufacturerDetails === "") {
      setErrorMsg({
        ...errorMsg,
        manufacturerDetailsError: "Manufacturer details is required",
      });
    } else if (allData?.mediguardDetails === "") {
      setErrorMsg({
        ...errorMsg,
        mediguardDetailsError: "Mediguard details is required",
      });
    } else if (allData?.gst === "") {
      setErrorMsg({
        ...errorMsg,
        gstError: "GST is required",
      });
    } else if (allData?.hsnCode === "") {
      setErrorMsg({
        ...errorMsg,
        hsnCodeError: "HSN Code is required",
      });
    } else if (
      allData?.status === "rejected" &&
      allData?.rejectedReason === ""
    ) {
      setErrorMsg({
        ...errorMsg,
        rejectedReasonError: "Rejected Reason is required",
      });
    } else if (!thumbnail) {
      setErrorMsg({ ...errorMsg, thumbNailErrorMsg: "Thumnail is required" });
    } else if (productImages?.length === 0) {
      setErrorMsg({
        ...errorMsg,
        productImageErrorMsg: "Product images is required",
      });
    } else {
      const productData = {
        shelfLife: allData?.shelfLife,
        country: allData?.country,
        howToUse: allData?.uses,
        sideEffects: allData?.sideEffects,
        manufacturer: allData?.manufacturerDetails,
        category: allData?.category,
        mediguardDetails: allData?.mediguardDetails,
        bulkDiscount: allData?.bulkDiscount,
        mrpPrice: allData?.mrpPrice,
      };
      const formData = new FormData();

      formData.append("name", allData?.productName);
      formData.append("description", allData?.productDescription);
      formData.append("subCategoryId", allData?.subCategory);
      formData.append("postedBy", allData.postedBy);
      formData.append("price", allData.price);
      formData.append("priceLable", allData.priceLabel);
      formData.append("brandName", allData.brandName);
      formData.append("benefits", allData.benefits ?? "-");
      formData.append("expiresOn", allData.expireAfter);
      formData.append("gst", allData.gst);
      formData.append("hsnCode", allData.hsnCode);
      if (productImages?.length > 0 || removedImages) {
        const oldImg = productImages?.filter((el) => typeof el === "string");
        formData.append("oldGalleryImage", JSON.stringify(oldImg));
      }
      if (mode === "Edit") {
        formData.append("id", getOneData?.data?.id);
        formData.append("status", allData.status);
        formData.append("remarks", allData.rejectedReason);
      }

      formData.append("additionalInformation", JSON.stringify(productData));
      // Handle files
      if (thumbnail) {
        formData.append("thumbnailImage", thumbnail);
      }
      if (isImgChanged) {
        if (productImages && productImages?.length > 0) {
          // All files as gallery
          const newImg = productImages?.filter((el) => typeof el !== "string");

          if (newImg !== undefined) {
            for (let i = 0; i < newImg?.length; i++) {
              formData.append("galleryImage", newImg[i]);
            }
          }
        }
      }

      if (mode === "Add") {
        dispatch(addProduct(formData));
      } else {
        dispatch(editProduct(formData));
      }
    }
  };

  return (
    <div>
      <Backdrop
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={loader}
      >
        <CircularProgress color="secondary" />
      </Backdrop>
      <Titlebar
        title={"Product Details"}
        back={true}
        backClick={() => {
          navigate("/productmanagement"),
            sessionStorage.removeItem("productId"),
            sessionStorage.removeItem("Mode");
        }}
      />
      {successMsg && (
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={openSnackbar}
          autoHideDuration={1000}
          onClose={() => {
            setOpenSnackbar(!openSnackbar);
          }}
        >
          <Alert
            onClose={() => {
              setOpenSnackbar(!openSnackbar);
            }}
            severity={success ? "success" : "error"}
            variant="filled"
            sx={{ width: "100%" }}
          >
            {successMsg}
          </Alert>
        </Snackbar>
      )}
      <Paper
        elevation={5}
        sx={{
          width: "95%",
          margin: "2% auto",
          height: "auto",
          borderRadius: "10px",
          padding: "2% 3%",
        }}
      >
        <Grid container rowSpacing={2} columnSpacing={3}>
          <Grid item xs={6}>
            <Typography
              variant="p"
              component="div"
              sx={{ fontSize: "18px", fontWeight: "bold", marginBottom: "1%" }}
            >
              Category<span style={{ color: "red", marginLeft: "5px" }}>*</span>
            </Typography>
            <Select
              id="category"
              size="small"
              name="category"
              value={allData?.category}
              onChange={handleDropDownChange}
              fullWidth
              displayEmpty
              disabled={mode == "View" ? true : false}
            >
              <MenuItem value="">Select Category</MenuItem>
              {categoryData?.data?.map((e, key) => {
                return (
                  <MenuItem key={key} value={e?.id}>
                    {e?.name}
                  </MenuItem>
                );
              })}
            </Select>
            {errorMsg?.categoryError && (
              <Typography
                variant="span"
                sx={{ fontSize: "14px", color: "red", fontWeight: "bold" }}
              >
                {errorMsg?.categoryError}
              </Typography>
            )}
          </Grid>
          <Grid item xs={6}>
            <Typography
              variant="p"
              component="div"
              sx={{ fontSize: "18px", fontWeight: "bold", marginBottom: "1%" }}
            >
              Sub Category
              <span style={{ color: "red", marginLeft: "5px" }}>*</span>
            </Typography>
            <Select
              id="subCategory"
              size="small"
              name="subCategory"
              value={String(allData?.subCategory)}
              onChange={handleDropDownChange}
              fullWidth
              disabled={!allData?.category || mode === "View"}
              displayEmpty
            >
              <MenuItem value="" disabled>
                Select Subcategory
              </MenuItem>
              {subCategoryData?.data?.map((opt, key) => (
                <MenuItem key={key} value={String(opt.id)}>
                  {opt.name}
                </MenuItem>
              ))}
            </Select>
            {errorMsg?.subCategoryError && (
              <Typography
                variant="span"
                sx={{ fontSize: "14px", color: "red", fontWeight: "bold" }}
              >
                {errorMsg?.subCategoryError}
              </Typography>
            )}
          </Grid>
          <Grid item xs={6}>
            <Typography
              variant="p"
              component="div"
              sx={{ fontSize: "18px", fontWeight: "bold", marginBottom: "1%" }}
            >
              Posted By{" "}
              <span style={{ color: "red", marginLeft: "5px" }}>*</span>
            </Typography>

            <Autocomplete
              id="postedBy"
              fullWidth
              size="small"
              sx={{ marginTop: "10px" }}
              options={vendors?.rows || []}
              autoHighlight
              getOptionLabel={(option) => option?.name || ""}
              value={
                vendors?.rows?.find(
                  (v) => v.id === getOneData?.data?.postedBy
                ) || null
              }
              disabled={mode === "View"}
              onChange={(event, value) => {
                handlePostedByChange("postedBy", value);
              }}
              renderOption={(props, option) => (
                <Box
                  key={option.id}
                  component="li"
                  sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
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

            {errorMsg?.postedByError && (
              <Typography
                variant="span"
                sx={{ fontSize: "14px", color: "red", fontWeight: "bold" }}
              >
                {errorMsg?.postedByError}
              </Typography>
            )}
          </Grid>

          <Grid item xs={6}>
            <Typography
              variant="p"
              component="div"
              sx={{ fontSize: "18px", fontWeight: "bold", marginBottom: "1%" }}
            >
              Product Name
              <span style={{ color: "red", marginLeft: "5px" }}>*</span>
            </Typography>
            <TextField
              disabled={mode == "View" ? true : false}
              onChange={handleChange}
              fullWidth
              size="small"
              id="productName"
              value={allData?.productName}
              placeholder="Enter your product name"
            />
            {errorMsg?.productNameError && (
              <Typography
                variant="span"
                sx={{ fontSize: "14px", color: "red", fontWeight: "bold" }}
              >
                {errorMsg?.productNameError}
              </Typography>
            )}
          </Grid>
          <Grid item xs={6}>
            <Typography
              variant="p"
              component="div"
              sx={{ fontSize: "18px", fontWeight: "bold", marginBottom: "1%" }}
            >
              MRP price
            </Typography>
            <TextField
              disabled={mode == "View" ? true : false}
              onChange={handleChange}
              fullWidth
              size="small"
              id="mrpPrice"
              value={allData?.mrpPrice}
              placeholder="MRP Price"
            />
          </Grid>
          <Grid item xs={6}>
            <Typography
              variant="p"
              component="div"
              sx={{ fontSize: "18px", fontWeight: "bold", marginBottom: "1%" }}
            >
              Price<span style={{ color: "red", marginLeft: "5px" }}>*</span>
            </Typography>
            <TextField
              disabled={mode == "View" ? true : false}
              onChange={handleChange}
              fullWidth
              size="small"
              id="price"
              value={allData?.price}
              placeholder="Enter your price"
            />
            {errorMsg?.priceError && (
              <Typography
                variant="span"
                sx={{ fontSize: "14px", color: "red", fontWeight: "bold" }}
              >
                {errorMsg?.priceError}
              </Typography>
            )}
          </Grid>
          <Grid item xs={6}>
            <Typography
              variant="p"
              component="div"
              sx={{ fontSize: "18px", fontWeight: "bold", marginBottom: "1%" }}
            >
              Price Label
              <span style={{ color: "red", marginLeft: "5px" }}>*</span>
            </Typography>
            <TextField
              disabled={mode == "View" ? true : false}
              onChange={handleChange}
              fullWidth
              size="small"
              id="priceLabel"
              value={allData?.priceLabel}
              placeholder="Enter your price label"
            />
            {errorMsg?.priceLabelError && (
              <Typography
                variant="span"
                sx={{ fontSize: "14px", color: "red", fontWeight: "bold" }}
              >
                {errorMsg?.priceLabelError}
              </Typography>
            )}
          </Grid>
          <Grid item xs={6}>
            <Typography
              variant="p"
              component="div"
              sx={{ fontSize: "18px", fontWeight: "bold", marginBottom: "1%" }}
            >
              Bulk Discount
            </Typography>
            <TextField
              disabled={mode == "View" ? true : false}
              onChange={handleChange}
              fullWidth
              size="small"
              id="bulkDiscount"
              value={allData?.bulkDiscount}
              placeholder="Discount Offers"
            />
          </Grid>
          <Grid item xs={12}>
            <Typography
              variant="p"
              component="div"
              sx={{ fontSize: "18px", fontWeight: "bold", marginBottom: "1%" }}
            >
              Product Description
              <span style={{ color: "red", marginLeft: "5px" }}>*</span>
            </Typography>
            <TextareaAutosize
              id="productDescription"
              value={allData?.productDescription}
              style={{
                width: "100%",
                fontSize: "16px",
                padding: "15px 20px 0",
                backgroundColor: "#f8fafc",
              }}
              maxRows={4}
              minRows={3}
              onChange={handleChange}
              disabled={mode == "View" ? true : false}
            />
            {errorMsg?.productDescriptionError && (
              <Typography
                variant="span"
                sx={{ fontSize: "14px", color: "red", fontWeight: "bold" }}
              >
                {errorMsg?.productDescriptionError}
              </Typography>
            )}
          </Grid>
          <Grid item xs={4}>
            <Typography
              variant="p"
              component="div"
              sx={{ fontSize: "18px", fontWeight: "bold", marginBottom: "1%" }}
            >
              Shelf Life
              <span style={{ color: "red", marginLeft: "5px" }}>*</span>
            </Typography>
            <TextField
              disabled={mode == "View" ? true : false}
              onChange={handleChange}
              fullWidth
              size="small"
              id="shelfLife"
              value={allData?.shelfLife}
              placeholder="Shelf Life"
            />
            {errorMsg?.shelfLifeError && (
              <Typography
                variant="span"
                sx={{ fontSize: "14px", color: "red", fontWeight: "bold" }}
              >
                {errorMsg?.shelfLifeError}
              </Typography>
            )}
          </Grid>
          <Grid item xs={4}>
            <Typography
              variant="p"
              component="div"
              sx={{ fontSize: "18px", fontWeight: "bold", marginBottom: "1%" }}
            >
              Brand Name
              <span style={{ color: "red", marginLeft: "5px" }}>*</span>
            </Typography>
            <TextField
              disabled={mode == "View" ? true : false}
              onChange={handleChange}
              fullWidth
              size="small"
              id="brandName"
              value={allData?.brandName}
              placeholder="Brand Nmae"
            />
            {errorMsg?.brandNameError && (
              <Typography
                variant="span"
                sx={{ fontSize: "14px", color: "red", fontWeight: "bold" }}
              >
                {errorMsg?.brandNameError}
              </Typography>
            )}
          </Grid>
          <Grid item xs={4}>
            <Typography
              variant="p"
              component="div"
              sx={{ fontSize: "18px", fontWeight: "bold", marginBottom: "1%" }}
            >
              Expires On or After
              <span style={{ color: "red", marginLeft: "5px" }}>*</span>
            </Typography>
            <TextField
              disabled={mode == "View" ? true : false}
              onChange={handleChange}
              fullWidth
              size="small"
              id="expireAfter"
              value={allData?.expireAfter}
              placeholder="Expire On or After"
            />
            {errorMsg?.expireAfterError && (
              <Typography
                variant="span"
                sx={{ fontSize: "14px", color: "red", fontWeight: "bold" }}
              >
                {errorMsg?.expireAfterError}
              </Typography>
            )}
          </Grid>
          {/*   <Grid item xs={4}>
            <Typography variant='p' component='div' sx={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '1%' }}>Selling Price<span style={{ color: 'red', marginLeft: '5px' }}>*</span></Typography>
            <TextField disabled={mode == "View" ? true : false} onChange={handleChange} fullWidth size='small' id='sellingPrice' value={allData?.sellingPrice} placeholder='Selling Price' />
            {errorMsg?.sellingPriceError && <Typography variant='span' sx={{ fontSize: '14px', color: 'red', fontWeight: 'bold' }}>{errorMsg?.sellingPriceError}</Typography>}
          </Grid> */}
          {/* <Grid item xs={4}>
            <Typography variant='p' component='div' sx={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '1%' }}>Rating<span style={{ color: 'red', marginLeft: '5px' }}>*</span></Typography>
            <Rating size='large' name="rating" defaultValue={2.5} precision={0.5} sx={{ marginTop: '5px' }} />
          </Grid> */}
          <Grid item xs={12}>
            <Typography
              variant="p"
              component="div"
              sx={{ fontSize: "18px", fontWeight: "bold", marginBottom: "1%" }}
            >
              How to Use
            </Typography>
            <TextareaAutosize
              id="uses"
              value={allData?.uses}
              style={{
                width: "100%",
                fontSize: "16px",
                padding: "15px 20px 0",
                backgroundColor: "#f8fafc",
              }}
              maxRows={4}
              minRows={3}
              onChange={handleChange}
              disabled={mode == "View" ? true : false}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography
              variant="p"
              component="div"
              sx={{ fontSize: "18px", fontWeight: "bold", marginBottom: "1%" }}
            >
              Benefits<span style={{ color: "red", marginLeft: "5px" }}>*</span>
            </Typography>
            <TextareaAutosize
              id="benefits"
              value={allData?.benefits}
              style={{
                width: "100%",
                fontSize: "16px",
                padding: "15px 20px 0",
                backgroundColor: "#f8fafc",
              }}
              maxRows={4}
              minRows={3}
              onChange={handleChange}
              disabled={mode == "View" ? true : false}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography
              variant="p"
              component="div"
              sx={{ fontSize: "18px", fontWeight: "bold", marginBottom: "1%" }}
            >
              Side Effects
            </Typography>
            <TextareaAutosize
              id="sideEffects"
              value={allData?.sideEffects}
              style={{
                width: "100%",
                fontSize: "16px",
                padding: "15px 20px 0",
                backgroundColor: "#f8fafc",
              }}
              maxRows={4}
              minRows={3}
              onChange={handleChange}
              disabled={mode == "View" ? true : false}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography
              variant="p"
              component="div"
              sx={{ fontSize: "18px", fontWeight: "bold", marginBottom: "1%" }}
            >
              Mediguard Essentials
              <span style={{ color: "red", marginLeft: "5px" }}>*</span>
            </Typography>
            <TextareaAutosize
              id="mediguardDetails"
              value={allData?.mediguardDetails}
              style={{
                width: "100%",
                fontSize: "16px",
                padding: "15px 20px 0",
                backgroundColor: "#f8fafc",
              }}
              maxRows={4}
              minRows={3}
              onChange={handleChange}
              disabled={mode == "View" ? true : false}
            />
            {errorMsg?.mediguardDetailsError && (
              <Typography
                variant="span"
                sx={{ fontSize: "14px", color: "red", fontWeight: "bold" }}
              >
                {errorMsg?.mediguardDetailsError}
              </Typography>
            )}
          </Grid>
          <Grid item xs={12}>
            <Typography
              variant="p"
              component="div"
              sx={{ fontSize: "18px", fontWeight: "bold", marginBottom: "1%" }}
            >
              Manufacturer Details
              <span style={{ color: "red", marginLeft: "5px" }}>*</span>
            </Typography>
            <TextareaAutosize
              id="manufacturerDetails"
              value={allData?.manufacturerDetails}
              style={{
                width: "100%",
                fontSize: "16px",
                padding: "15px 20px 0",
                backgroundColor: "#f8fafc",
              }}
              maxRows={4}
              minRows={3}
              onChange={handleChange}
              disabled={mode == "View" ? true : false}
            />
            {errorMsg?.manufacturerDetailsError && (
              <Typography
                variant="span"
                sx={{ fontSize: "14px", color: "red", fontWeight: "bold" }}
              >
                {errorMsg?.manufacturerDetailsError}
              </Typography>
            )}
          </Grid>
          <Grid item xs={mode === "Edit" ? 4 : 6}>
            <Typography
              variant="p"
              component="div"
              sx={{ fontSize: "18px", fontWeight: "bold", marginBottom: "1%" }}
            >
              Country or Origin
              <span style={{ color: "red", marginLeft: "5px" }}>*</span>
            </Typography>
            <TextField
              disabled
              onChange={handleChange}
              fullWidth
              size="small"
              id="country"
              value={allData?.country}
              placeholder="Country of Origin"
            />
            {errorMsg?.countryError && (
              <Typography
                variant="span"
                sx={{ fontSize: "14px", color: "red", fontWeight: "bold" }}
              >
                {errorMsg?.countryError}
              </Typography>
            )}
          </Grid>
          {mode === "Edit" && (
            <Grid item xs={4}>
              <Typography
                variant="p"
                component="div"
                sx={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  marginBottom: "1%",
                }}
              >
                Status
              </Typography>
              <Select
                id="status"
                size="small"
                name="status"
                value={allData?.status}
                onChange={handleDropDownChange}
                fullWidth
                disabled={mode == "View"}
                displayEmpty
              >
                <MenuItem value="" disabled>
                  Select Status
                </MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="approved">Approved</MenuItem>
                <MenuItem value="rejected">Rejected</MenuItem>
              </Select>
            </Grid>
          )}
          <Grid item xs={6}>
            <Typography
              variant="p"
              component="div"
              sx={{ fontSize: "18px", fontWeight: "bold", marginBottom: "1%" }}
            >
              GST<span style={{ color: "red", marginLeft: "5px" }}>*</span>
            </Typography>
            <Select
              id="gst"
              size="small"
              name="gst"
              value={allData?.gst}
              onChange={handleDropDownChange}
              fullWidth
              displayEmpty
              disabled={mode == "View" ? true : false}
            >
              <MenuItem value="">Select GST</MenuItem>
              <MenuItem value="5%">5%</MenuItem>
              <MenuItem value="6%">6%</MenuItem>
              <MenuItem value="12%">12%</MenuItem>
              <MenuItem value="18%">18%</MenuItem>
              <MenuItem value="28%">28%</MenuItem>
            </Select>
            {errorMsg?.gstError && (
              <Typography
                variant="span"
                sx={{ fontSize: "14px", color: "red", fontWeight: "bold" }}
              >
                {errorMsg?.gstError}
              </Typography>
            )}
          </Grid>
          <Grid item xs={mode === "Edit" ? 4 : 6}>
            <Typography
              variant="p"
              component="div"
              sx={{ fontSize: "18px", fontWeight: "bold", marginBottom: "1%" }}
            >
              HSN Code
              <span style={{ color: "red", marginLeft: "5px" }}>*</span>
            </Typography>
            <TextField
              onChange={handleChange}
              fullWidth
              size="small"
              id="hsnCode"
              value={allData?.hsnCode}
              placeholder="HSN Code"
            />
            {errorMsg?.hsnCodeError && (
              <Typography
                variant="span"
                sx={{ fontSize: "14px", color: "red", fontWeight: "bold" }}
              >
                {errorMsg?.hsnCodeError}
              </Typography>
            )}
          </Grid>
          {allData?.status === "rejected" && (
            <Grid item xs={12}>
              <Typography
                variant="p"
                component="div"
                sx={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  marginBottom: "1%",
                }}
              >
                Rejected Reason
                <span style={{ color: "red", marginLeft: "5px" }}>*</span>
              </Typography>
              <TextareaAutosize
                id="rejectedReason"
                value={allData?.rejectedReason}
                style={{
                  width: "100%",
                  fontSize: "16px",
                  padding: "15px 20px 0",
                  backgroundColor: "#f8fafc",
                }}
                maxRows={4}
                minRows={3}
                onChange={handleChange}
                disabled={mode == "View" ? true : false}
              />
              {errorMsg?.rejectedReasonError && (
                <Typography
                  variant="span"
                  sx={{ fontSize: "14px", color: "red", fontWeight: "bold" }}
                >
                  {errorMsg?.rejectedReasonError}
                </Typography>
              )}
            </Grid>
          )}
          <Grid item xs={12}>
            <Typography
              variant="p"
              component="div"
              sx={{ fontSize: "18px", fontWeight: "bold", marginBottom: "1%" }}
            >
              Product Thumbnail
              <span style={{ color: "red", marginLeft: "5px" }}>*</span>
            </Typography>
            <Box
              sx={{
                border: "2px dashed #00bfae",
                borderRadius: "10px",
                padding: "32px",
                textAlign: "center",
                backgroundColor: "#f8fafc",
                position: "relative",
                cursor: thumbnail ? "default" : "pointer",
                minHeight: 120,
              }}
              onClick={() => {
                if (!thumbnail) fileInputRef.current.click();
              }}
            >
              {!thumbnail && (
                <>
                  <CloudUploadIcon sx={{ fontSize: 48, color: "#00bfae" }} />
                  <Typography
                    sx={{
                      mt: 1,
                      mb: 1,
                      fontWeight: 600,
                      color: "#00bfae",
                      fontSize: "20px",
                    }}
                  >
                    Upload Thumbnail
                  </Typography>
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: "#00bfae",
                      color: "#fff",
                      mt: 1,
                      fontWeight: "bold",
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current.click();
                    }}
                    disabled={mode == "View" ? true : false}
                  >
                    BROWSE
                  </Button>
                  <Typography sx={{ mt: 2, color: "#888", fontSize: 13 }}>
                    Note: Only image files allowed. Max 5MB.
                  </Typography>
                  {errorMsg?.thumbNailErrorMsg && (
                    <Typography
                      variant="span"
                      sx={{
                        fontSize: "14px",
                        color: "red",
                        fontWeight: "bold",
                      }}
                    >
                      {errorMsg?.thumbNailErrorMsg}
                    </Typography>
                  )}
                </>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleThumbnailChange}
              />
              {thumbnail && (
                <Box
                  sx={{
                    mt: 0,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    position: "relative",
                  }}
                >
                  <img
                    src={
                      typeof thumbnail === "string"
                        ? thumbnail.startsWith("http")
                          ? thumbnail
                          : `http://luxcycs.com:5500/${thumbnail}`
                        : URL.createObjectURL(thumbnail)
                    }
                    alt="Thumbnail Preview"
                    style={{
                      maxWidth: 120,
                      maxHeight: 120,
                      borderRadius: 8,
                      marginTop: 8,
                    }}
                  />
                  <Typography sx={{ fontSize: 13, mt: 1 }}>
                    {typeof thumbnail === "string"
                      ? thumbnail.split("/").pop()
                      : thumbnail.name}
                  </Typography>
                  {mode !== "View" && (
                    <IconButton
                      size="small"
                      sx={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        background: "#fff",
                        border: "1px solid #ccc",
                        "&:hover": { background: "#f8fafc" },
                      }}
                      onClick={handleRemoveThumbnail}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  )}
                </Box>
              )}
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Typography
              variant="p"
              component="div"
              sx={{ fontSize: "18px", fontWeight: "bold", marginBottom: "1%" }}
            >
              Product Image
              <span style={{ color: "red", marginLeft: "5px" }}>*</span>
            </Typography>
            <Box
              sx={{
                border: "2px dashed #00bfae",
                borderRadius: "10px",
                padding: "32px",
                textAlign: "center",
                backgroundColor: "#f8fafc",
                position: "relative",
                minHeight: 120,
              }}
              onClick={() => {
                if (productImages.length < 5)
                  productImagesInputRef.current.click();
              }}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              {productImages.length === 0 && (
                <>
                  <CloudUploadIcon sx={{ fontSize: 48, color: "#00bfae" }} />
                  <Typography
                    sx={{
                      mt: 1,
                      mb: 1,
                      fontWeight: 600,
                      color: "#00bfae",
                      fontSize: "20px",
                    }}
                  >
                    Drag and Drop files here
                  </Typography>
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: "#00bfae",
                      color: "#fff",
                      mt: 1,
                      fontWeight: "bold",
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      productImagesInputRef.current.click();
                    }}
                    disabled={mode == "View" ? true : false}
                  >
                    BROWSE
                  </Button>
                  <Typography sx={{ mt: 2, color: "#888", fontSize: 13 }}>
                    Note: Image dimensions should be 600 x 600. Max 5 files, 5MB
                    each.
                  </Typography>
                  {errorMsg?.productImageErrorMsg && (
                    <Typography
                      variant="span"
                      sx={{
                        fontSize: "14px",
                        color: "red",
                        fontWeight: "bold",
                      }}
                    >
                      {errorMsg?.productImageErrorMsg}
                    </Typography>
                  )}
                </>
              )}
              <input
                ref={productImagesInputRef}
                type="file"
                accept="application/pdf,image/jpeg,image/png,image/jpg"
                multiple
                style={{ display: "none" }}
                onChange={handleProductImagesChange}
              />
              {productImages.length > 0 && (
                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    flexWrap: "wrap",
                    justifyContent: "center",
                  }}
                >
                  {productImages.map((file, idx) => {
                    // file can be a string (URL) or a File object

                    const isUrl = typeof file === "string";
                    const url = isUrl
                      ? encodeURI(file)
                      : URL.createObjectURL(file);
                    const isPdf =
                      url.toLowerCase().endsWith(".pdf") ||
                      (file.type && file.type === "application/pdf");
                    return (
                      <Box
                        key={idx}
                        sx={{
                          position: "relative",
                          display: "inline-block",
                          m: 1,
                          width: 100,
                        }}
                      >
                        {isPdf ? (
                          <Box
                            sx={{
                              width: 100,
                              height: 100,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              borderRadius: 8,
                              border: "1px solid #ccc",
                              background: "#fff",
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
                            style={{
                              width: 100,
                              height: 100,
                              objectFit: "cover",
                              borderRadius: 8,
                              border: "1px solid #ccc",
                            }}
                          />
                        )}
                        {mode !== "View" && (
                          <IconButton
                            size="small"
                            sx={{
                              position: "absolute",
                              top: 0,
                              right: 0,
                              background: "#fff",
                              border: "1px solid #ccc",
                              "&:hover": { background: "#f8fafc" },
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveProductImage(idx);
                            }}
                          >
                            <CloseIcon fontSize="small" />
                          </IconButton>
                        )}
                        <Typography
                          sx={{
                            fontSize: 12,
                            mt: 1,
                            textAlign: "center",
                            maxWidth: 100,
                            wordBreak: "break-all",
                          }}
                        >
                          {isUrl ? url.split("/").pop() : file.name}
                        </Typography>
                      </Box>
                    );
                  })}
                  {productImages.length < 5 && (
                    <Button
                      variant="outlined"
                      sx={{
                        height: 100,
                        width: 100,
                        m: 1,
                        border: "1px dashed #00bfae",
                        color: "#00bfae",
                      }}
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
        <Box sx={{ margin: "2% 0", padding: "10px 0", textAlign: "right" }}>
          {mode !== "View" && (
            <Button
              onClick={handleSubmit}
              size="large"
              startIcon={mode === "Edit" ? <EditIcon /> : <AddIcon />}
              variant="contained"
              sx={{ fontWeight: "bold", backgroundColor: "#00bfae" }}
            >
              {mode === "Edit" ? "Update Product" : "Add Product"}
            </Button>
          )}
        </Box>
      </Paper>
    </div>
  );
};

export default ProductEntry;
