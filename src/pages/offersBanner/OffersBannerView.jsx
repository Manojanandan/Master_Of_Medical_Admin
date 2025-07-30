import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
  Typography,
} from "@mui/material";
import Titlebar from "../../comnponents/titlebar/Titlebar";
import { useNavigate } from "react-router-dom";
import JpgIcon from "../../assets/JpgIcon.png";
import JpegIcon from "../../assets/JpegIcon.png";
import ExcelIcon from "../../assets/ExcelIcon.jpg";
import WordIcon from "../../assets/WordIcon.jpg";
import PngIcon from "../../assets/PngIcon.png";
import PDFIcon from "../../assets/PDFIcon.png";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import { editOfferBanner, fetchOneOfferBanner, resetMessage } from "./OffersBannerReducer";

const OffersBannerView = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [editFlag, setEditFlag] = useState(false);
  const [status, setStatus] = useState("all");
  // const [remarks, setRemarks] = useState(null)
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [errMsg, setErrMsg] = useState({ status: "", remarks: "" });

  const reducer = useSelector((state) => state.offerBannerReducer);
  const { loader, message, success, getOfferOneBannerData } = reducer;

  useEffect(() => {
    dispatch(resetMessage());
  }, []);

  useEffect(() => {
    if (sessionStorage.getItem("offerId")) {
      dispatch(fetchOneOfferBanner(sessionStorage.getItem("offerId")));
    }
  }, [sessionStorage.getItem("offerId")]);

  useEffect(() => {
    if (message !== "" && message !== undefined) {
      setOpenSnackbar(true);
    }
  }, [message]);

  const handleEdit = () => {
    setEditFlag(!editFlag);
    setStatus("all");
    // setRemarks("")
  };
  const handleClose = () => {
    setOpenSnackbar(!openSnackbar);
    if (success) {
      sessionStorage.removeItem("offerId");
      navigate("/offerBanners");
    }
    dispatch(resetMessage());
  };

  const updateBanner = async () => {
    if (status === "all") {
      setErrMsg({ ...errMsg, status: "Select any status" });
    }
    // else if (status === "rejected" && remarks === "") {
    //   setErrMsg({ ...errMsg, remarks: "Remarks is required" })
    // }
    else {
      const formData = new FormData();
      formData.append("id", getOfferOneBannerData?.data?.id);
      // formData.append("title", getOfferOneBannerData?.data?.title)
      formData.append("ctaText", getOfferOneBannerData?.data?.ctaText);
      formData.append("ctaLink", getOfferOneBannerData?.data?.ctaLink);
      // formData.append("description", getOfferOneBannerData?.data?.descriptionl)
      // formData.append("type", type ?? null)
      formData.append("bannerImage", getOfferOneBannerData?.data?.bannerImage);
      formData.append("status", status ?? getOfferOneBannerData?.data?.status);
      // formData.append("remarks", remarks ?? getOfferOneBannerData?.data?.remarks)

      dispatch(editOfferBanner(formData));
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
      {message && (
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
            {message}
          </Alert>
        </Snackbar>
      )}
      <Titlebar
        title={"Offer Banner Details"}
        back={true}
        backClick={() => {
          navigate("/offerBanners"),
            sessionStorage.removeItem("offerId"),
            sessionStorage.removeItem("Mode"),
            sessionStorage.removeItem("tempRow");
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
            Personal Information
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
              {/* <Grid2 item size={4}>
                <Typography
                  variant="p"
                  component="div"
                  sx={{ fontSize: "15px", color: "#22442280" }}
                >
                  Title
                </Typography>
                <Typography
                  variant="p"
                  component="div"
                  sx={{ fontSize: "18px", textTransform: "capitalize" }}
                >
                  {getOfferOneBannerData?.data?.title ?? "-"}
                </Typography>
              </Grid2> */}
              <Grid2 item size={4}>
                <Typography
                  variant="p"
                  component="div"
                  sx={{ fontSize: "15px", color: "#22442280" }}
                >
                  CTA Text
                </Typography>
                <Typography
                  variant="p"
                  component="div"
                  sx={{ fontSize: "18px" }}
                >
                  {getOfferOneBannerData?.data?.ctaText ?? "-"}
                </Typography>
              </Grid2>
              <Grid2 item size={4}>
                <Typography
                  variant="p"
                  component="div"
                  sx={{ fontSize: "15px", color: "#22442280" }}
                >
                  CTA Link
                </Typography>
                <Typography
                  variant="p"
                  component="div"
                  sx={{ fontSize: "18px" }}
                >
                  {getOfferOneBannerData?.data?.ctaLink ?? "-"}
                </Typography>
              </Grid2>
              {/* <Grid2 item size={4}>
                <Typography
                  variant="p"
                  component="div"
                  sx={{ fontSize: "15px", color: "#22442280" }}
                >
                  Type
                </Typography>
                <Typography
                  variant="p"
                  component="div"
                  sx={{ fontSize: "18px", textTransform: "capitalize" }}
                >
                  {getOfferOneBannerData?.data?.type ?? "-"}
                </Typography>
              </Grid2> */}
              {/* <Grid2 item size={4}>
                <Typography
                  variant="p"
                  component="div"
                  sx={{ fontSize: "15px", color: "#22442280" }}
                >
                  Description
                </Typography>
                <Typography
                  variant="p"
                  component="div"
                  sx={{ fontSize: "18px", textTransform: "capitalize" }}
                >
                  {getOfferOneBannerData?.data?.description ?? "-"}
                </Typography>
              </Grid2> */}
              <Grid2 item size={4}>
                <Typography
                  variant="p"
                  component="div"
                  sx={{ fontSize: "15px", color: "#22442280" }}
                >
                  Status
                </Typography>
                {!editFlag ? (
                  <Typography
                    variant="p"
                    component="div"
                    sx={{
                      fontSize: "18px",
                      textTransform: "capitalize",
                      color: `${
                        getOfferOneBannerData?.data?.status == "active"
                          ? "green"
                          : getOfferOneBannerData?.data?.status == "in-active"
                          ? "red"
                          : "orange"
                      }`,
                      fontWeight: "bold",
                    }}
                  >
                    {getOfferOneBannerData?.data?.status}
                  </Typography>
                ) : (
                  <>
                    <Select
                      fullWidth
                      size="small"
                      id="status"
                      value={status}
                      onChange={(e) => {
                        setStatus(e.target.value),
                          setErrMsg({ ...errMsg, status: "" });
                      }}
                      sx={{ marginTop: "5px" }}
                    >
                      <MenuItem value={"all"}>All</MenuItem>
                      <MenuItem value={"active"}>Active</MenuItem>
                      <MenuItem value={"in-active"}>In-Active</MenuItem>
                    </Select>
                    {errMsg.status && (
                      <Typography
                        variant="p"
                        component="div"
                        sx={{ fontSize: "14px", color: "red" }}
                      >
                        {errMsg.status}
                      </Typography>
                    )}
                  </>
                )}
              </Grid2>
              {/* {getOfferOneBannerData?.data?.status === "rejected" && !editFlag &&
                <Grid2 item size={4}>
                  <Typography variant='p' component='div' sx={{ fontSize: '15px', color: '#22442280' }}>Remarks</Typography>
                  <Typography variant='p' component='div' sx={{ fontSize: '18px', textTransform: 'capitalize' }}>{getOfferOneBannerData?.data?.remarks ?? "-"}</Typography>
                </Grid2>
              } */}
              <Grid2 item size={8}>
                <Typography
                  variant="p"
                  component="div"
                  sx={{ fontSize: "15px", color: "#22442280" }}
                >
                  Documents
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
                  {getOfferOneBannerData?.data?.bannerImage
                    ? (() => {
                        const bannerImageArray = Array.isArray(
                          getOfferOneBannerData.data.bannerImage
                        )
                          ? getOfferOneBannerData.data.bannerImage
                          : [getOfferOneBannerData.data.bannerImage];

                        return bannerImageArray.map((fileUrl, index) => {
                          const fileName = fileUrl.split("/").pop();
                          const actualFileName = fileName.replace(/^\d+-/, "");
                          const fileFormat = actualFileName
                            .split(".")
                            .pop()
                            .toLowerCase();

                          const icon =
                            fileFormat === "jpg"
                              ? JpgIcon
                              : fileFormat === "jpeg"
                              ? JpegIcon
                              : fileFormat === "png"
                              ? PngIcon
                              : fileFormat === "pdf"
                              ? PDFIcon
                              : fileFormat === "docx"
                              ? WordIcon
                              : ExcelIcon;

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
                                src={icon}
                                alt={fileFormat}
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
                        });
                      })()
                    : "-"}
                </Box>
              </Grid2>
              {/* {status === "rejected" &&
                <>
                  <Grid2 item size={8}>
                    <Typography variant='p' component='div' sx={{ fontSize: '15px', color: '#22442280' }}>Remarks</Typography>
                    <TextareaAutosize
                      id='remarks'
                      value={remarks}
                      style={{ width: '100%', fontSize: '16px', padding: '15px 20px 0', backgroundColor: '#f8fafc' }}
                      maxRows={4}
                      minRows={3}
                      onChange={(e) => { setRemarks(e.target.value), setErrMsg({ ...errMsg, remarks: "" }) }}
                    />
                    {errMsg.remarks && <Typography variant='p' component='div' sx={{ fontSize: '14px', color: 'red' }} >{errMsg.remarks}</Typography>}
                  </Grid2>
                </>
              } */}
              {editFlag && (
                <Grid2 item size={12}>
                  <Button
                    onClick={updateBanner}
                    variant="contained"
                    sx={{ backgroundColor: "#0ea398", marginRight: "15px" }}
                  >
                    update
                  </Button>
                  <Button
                    onClick={handleEdit}
                    variant="contained"
                    sx={{ backgroundColor: "#2424", color: "black" }}
                  >
                    clear
                  </Button>
                </Grid2>
              )}
            </Grid2>
          </Box>
        </Box>
      </Paper>
    </div>
  );
};

export default OffersBannerView;
