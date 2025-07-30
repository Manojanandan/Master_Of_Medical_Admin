import {
  Alert,
  Avatar,
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Grid2,
  IconButton,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  TextareaAutosize,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import Titlebar from "../../comnponents/titlebar/Titlebar";
import { useDispatch, useSelector } from "react-redux";
import JpgIcon from "../../assets/JpgIcon.png";
import JpegIcon from "../../assets/JpegIcon.png";
import ExcelIcon from "../../assets/ExcelIcon.jpg";
import WordIcon from "../../assets/WordIcon.jpg";
import PngIcon from "../../assets/PngIcon.png";
import PDFIcon from "../../assets/PDFIcon.png";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import { useNavigate } from "react-router-dom";
import {
  getCategory,
  getOneProductList,
  getSubCategory,
  resetMessage,
} from "./ProductReducer";
import { getVendor } from "../vendor/VendorReducer";

const ProductView = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [vendors, setVendors] = useState([]);

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
    dispatch(getVendor(`?allVendors=true`));
  }, []);
  useEffect(() => {
    setVendors(listOfVendor);
  }, [listOfVendor]);

  let additionalData = "-";
  try {
    const raw = getOneData?.data?.additionalInformation;
    additionalData = raw ? JSON.parse(raw) : "-";
  } catch (e) {
    console.error("Invalid JSON in additionalInformation:", e);
  }

  useEffect(() => {
    if (sessionStorage.getItem("productId")) {
      dispatch(getOneProductList(sessionStorage.getItem("productId")));
    }
  }, [sessionStorage.getItem("productId")]);

  useEffect(() => {
    dispatch(getCategory());
  }, []);

  useEffect(() => {
    dispatch(getSubCategory(additionalData?.category));
  }, [additionalData?.category]);

  useEffect(() => {
    if (successMsg !== "" && successMsg !== undefined) {
      setOpenSnackbar(true);
    }
  }, [successMsg]);

  const handleEdit = () => {
    navigate("/productmanagemententry");
    sessionStorage.setItem("Mode", "Edit");
  };
  const handleClose = () => {
    setOpenSnackbar(!openSnackbar);
    navigate("/productmanagement");
    dispatch(resetMessage());
  };

  const fileName = getOneData?.data?.thumbnailImage
    ? getOneData?.data?.thumbnailImage.split("/").pop()
    : "-";
  const actualFileName = fileName.replace(/^\d+-/, "");
  const fileFormat = actualFileName.split(".")[1];
  return (
    <div>
      <Backdrop
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={loader}
      >
        <CircularProgress color="secondary" />
      </Backdrop>
      {successMsg && (
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={openSnackbar}
          autoHideDuration={1000}
          onClose={handleClose}
        >
          <Alert
            onClose={handleClose}
            severity={success ? "success" : "error"}
            variant="filled"
            sx={{ width: "100%" }}
          >
            {successMsg}
          </Alert>
        </Snackbar>
      )}
      <Titlebar
        title={"Product Details"}
        back={true}
        backClick={() => {
          navigate("/productmanagement"),
            sessionStorage.removeItem("productId");
        }}
      />
      <Paper
        elevation={5}
        sx={{
          borderRadius: "10px",
          padding: "2% 3%",
          margin: "3% auto",
          width: "95%",
        }}
      >
        <Box
          sx={{
            padding: "10px",
            width: "100%",
            borderBottom: "solid 1px #2424",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            variant="p"
            component="div"
            sx={{ fontSize: "20px", fontWeight: "bold", color: "#1976d2" }}
          >
            Product Information
          </Typography>
          <Avatar sx={{ backgroundColor: "#1976d2" }} onClick={handleEdit}>
            <IconButton>
              <EditRoundedIcon sx={{ color: "#fff" }} />
            </IconButton>
          </Avatar>
        </Box>
        <Box
          sx={{
            height: "auto",
            width: "100%",
            margin: "2% 0",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box sx={{ width: "100%", height: "100%", padding: "0 10px" }}>
            <Grid2 container rowSpacing={3} columnSpacing={2}>
              <Grid2 item size={4}>
                <Typography
                  variant="p"
                  component="div"
                  sx={{ fontSize: "15px", color: "#22442280" }}
                >
                  Category
                </Typography>
                <Typography
                  variant="p"
                  component="div"
                  sx={{ fontSize: "18px" }}
                >
                  {categoryData?.data?.find(
                    (cat) => cat.id === additionalData?.category
                  )?.name ?? "-"}
                </Typography>
              </Grid2>
              <Grid2 item size={4}>
                <Typography
                  variant="p"
                  component="div"
                  sx={{ fontSize: "15px", color: "#22442280" }}
                >
                  Sub Category
                </Typography>
                <Typography
                  variant="p"
                  component="div"
                  sx={{ fontSize: "18px" }}
                >
                  {subCategoryData?.data?.find(
                    (cat) => cat.id === getOneData?.data?.subCategoryId
                  )?.name ?? "-"}
                </Typography>
              </Grid2>
              <Grid2 item size={4}>
                <Typography
                  variant="p"
                  component="div"
                  sx={{ fontSize: "15px", color: "#22442280" }}
                >
                  Posted By
                </Typography>
                <Typography
                  variant="p"
                  component="div"
                  sx={{ fontSize: "18px" }}
                >
                  {vendors?.rows?.find(
                    (cat) => cat.id === getOneData?.data?.postedBy
                  )?.name ?? "-"}
                </Typography>
              </Grid2>
              <Grid2 item size={4}>
                <Typography
                  variant="p"
                  component="div"
                  sx={{ fontSize: "15px", color: "#22442280" }}
                >
                  Product Name
                </Typography>
                <Typography
                  variant="p"
                  component="div"
                  sx={{ fontSize: "18px", textTransform: "capitalize" }}
                >
                  {getOneData?.data?.name ?? "-"}
                </Typography>
              </Grid2>
              <Grid2 item size={8}>
                <Typography
                  variant="p"
                  component="div"
                  sx={{ fontSize: "15px", color: "#22442280" }}
                >
                  Product Description
                </Typography>
                <Typography
                  variant="p"
                  component="div"
                  sx={{ fontSize: "18px", textTransform: "capitalize" }}
                >
                  {getOneData?.data?.description ?? "-"}
                </Typography>
              </Grid2>
              <Grid2 item size={4}>
                <Typography
                  variant="p"
                  component="div"
                  sx={{ fontSize: "15px", color: "#22442280" }}
                >
                  Brand Name
                </Typography>
                <Typography
                  variant="p"
                  component="div"
                  sx={{ fontSize: "18px", textTransform: "capitalize" }}
                >
                  {getOneData?.data?.brandName ?? "-"}
                </Typography>
              </Grid2>
              <Grid2 item size={4}>
                <Typography
                  variant="p"
                  component="div"
                  sx={{ fontSize: "15px", color: "#22442280" }}
                >
                  Country
                </Typography>
                <Typography
                  variant="p"
                  component="div"
                  sx={{ fontSize: "18px", textTransform: "capitalize" }}
                >
                  {additionalData?.country ?? "-"}
                </Typography>
              </Grid2>
              <Grid2 item size={4}>
                <Typography
                  variant="p"
                  component="div"
                  sx={{ fontSize: "15px", color: "#22442280" }}
                >
                  Price
                </Typography>
                <Typography
                  variant="p"
                  component="div"
                  sx={{ fontSize: "18px", textTransform: "capitalize" }}
                >
                  {getOneData?.data?.price ?? "-"}
                </Typography>
              </Grid2>
              <Grid2 item size={4}>
                <Typography
                  variant="p"
                  component="div"
                  sx={{ fontSize: "15px", color: "#22442280" }}
                >
                  GST
                </Typography>
                <Typography
                  variant="p"
                  component="div"
                  sx={{ fontSize: "18px", textTransform: "capitalize" }}
                >
                  {getOneData?.data?.gst ?? "-"}
                </Typography>
              </Grid2>
              <Grid2 item size={4}>
                <Typography
                  variant="p"
                  component="div"
                  sx={{ fontSize: "15px", color: "#22442280" }}
                >
                  HSN Code
                </Typography>
                <Typography
                  variant="p"
                  component="div"
                  sx={{ fontSize: "18px", textTransform: "capitalize" }}
                >
                  {getOneData?.data?.hsnCode ?? "-"}
                </Typography>
              </Grid2>
              <Grid2 item size={4}>
                <Typography
                  variant="p"
                  component="div"
                  sx={{ fontSize: "15px", color: "#22442280" }}
                >
                  Shelf Life
                </Typography>
                <Typography
                  variant="p"
                  component="div"
                  sx={{ fontSize: "18px", textTransform: "capitalize" }}
                >
                  {additionalData?.shelfLife ?? "-"}
                </Typography>
              </Grid2>
              <Grid2 item size={4}>
                <Typography
                  variant="p"
                  component="div"
                  sx={{ fontSize: "15px", color: "#22442280" }}
                >
                  Expires On or After
                </Typography>
                <Typography
                  variant="p"
                  component="div"
                  sx={{ fontSize: "18px", textTransform: "capitalize" }}
                >
                  {getOneData?.data?.expiresOn ?? "-"}
                </Typography>
              </Grid2>
              <Grid2 item size={4}>
                <Typography
                  variant="p"
                  component="div"
                  sx={{ fontSize: "15px", color: "#22442280" }}
                >
                  Manufacturer Details
                </Typography>
                <Typography
                  variant="p"
                  component="div"
                  sx={{ fontSize: "18px", textTransform: "capitalize" }}
                >
                  {additionalData?.manufacturer ?? "-"}
                </Typography>
              </Grid2>
              <Grid2 item size={4}>
                <Typography
                  variant="p"
                  component="div"
                  sx={{ fontSize: "15px", color: "#22442280" }}
                >
                  Mediguard Essentials
                </Typography>
                <Typography
                  variant="p"
                  component="div"
                  sx={{ fontSize: "18px", textTransform: "capitalize" }}
                >
                  {additionalData?.mediguardDetails ?? "-"}
                </Typography>
              </Grid2>
              <Grid2 item size={4}>
                <Typography
                  variant="p"
                  component="div"
                  sx={{ fontSize: "15px", color: "#22442280" }}
                >
                  Status
                </Typography>
                <Typography
                  variant="p"
                  component="div"
                  sx={{
                    fontSize: "18px",
                    textTransform: "capitalize",
                    color: `${
                      getOneData?.data?.status == "approved"
                        ? "green"
                        : getOneData?.data?.status == "rejected"
                        ? "red"
                        : "orange"
                    }`,
                    fontWeight: "bold",
                  }}
                >
                  {getOneData?.data?.status}
                </Typography>
              </Grid2>
              {getOneData?.data?.status === "rejected" && (
                <Grid2 item size={4}>
                  <Typography
                    variant="p"
                    component="div"
                    sx={{ fontSize: "15px", color: "#22442280" }}
                  >
                    Remarks
                  </Typography>
                  <Typography
                    variant="p"
                    component="div"
                    sx={{ fontSize: "18px", textTransform: "capitalize" }}
                  >
                    {getOneData?.data?.remarks ?? "-"}
                  </Typography>
                </Grid2>
              )}
              <Grid2 item size={4}>
                <Typography
                  variant="p"
                  component="div"
                  sx={{ fontSize: "15px", color: "#22442280" }}
                >
                  Product Thumnail
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "12px",
                    marginTop: "5px",
                  }}
                >
                  {getOneData?.data?.thumbnailImage ? (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "5px",
                      }}
                    >
                      <img
                        src={
                          fileFormat === "jpg"
                            ? JpgIcon
                            : fileFormat === "jpeg"
                            ? JpegIcon
                            : fileFormat === "docx"
                            ? WordIcon
                            : fileFormat === "png"
                            ? PngIcon
                            : fileFormat === "pdf"
                            ? PDFIcon
                            : ExcelIcon
                        }
                        alt={JpgIcon}
                        style={{ height: "20px", width: "20px" }}
                      />
                      <a
                        href={getOneData?.data?.thumbnailImage}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: "#0ea398",
                          textDecoration: "underline",
                          fontWeight: "bold",
                        }}
                      >
                        {actualFileName}
                      </a>
                    </Box>
                  ) : (
                    "-"
                  )}
                </Box>
              </Grid2>
              <Grid2 item size={8}>
                <Typography
                  variant="p"
                  component="div"
                  sx={{ fontSize: "15px", color: "#22442280" }}
                >
                  Product Image
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "12px",
                    marginTop: "5px",
                  }}
                >
                  {getOneData?.data?.galleryImage?.length > 0
                    ? getOneData?.data?.galleryImage?.map((fileUrl, index) => {
                        const fileName = fileUrl.split("/").pop();
                        const actualFileName = fileName.replace(/^\d+-/, "");
                        const fileFormat = actualFileName.split(".")[1];
                        return (
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              gap: "5px",
                            }}
                            key={index}
                          >
                            <img
                              src={
                                fileFormat === "jpg"
                                  ? JpgIcon
                                  : fileFormat === "jpeg"
                                  ? JpegIcon
                                  : fileFormat === "docx"
                                  ? WordIcon
                                  : fileFormat === "png"
                                  ? PngIcon
                                  : fileFormat === "pdf"
                                  ? PDFIcon
                                  : ExcelIcon
                              }
                              alt={JpgIcon}
                              style={{ height: "20px", width: "20px" }}
                            />
                            <a
                              href={fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                color: "#0ea398",
                                textDecoration: "underline",
                                fontWeight: "bold",
                              }}
                            >
                              {actualFileName}
                            </a>
                          </Box>
                        );
                      })
                    : "-"}
                </Box>
              </Grid2>
            </Grid2>
          </Box>
        </Box>
      </Paper>
    </div>
  );
};

export default ProductView;
