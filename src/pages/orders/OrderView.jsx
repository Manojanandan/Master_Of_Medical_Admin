import {
  Alert,
  Avatar,
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
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
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import { useNavigate } from "react-router-dom";
import { getOrders, modifyOrders, resetMessage } from "./OrderReducer";
import CommonTable from "../../comnponents/table/CommonTable";
import { getOneVendor } from "../vendor/VendorReducer";
import CancelIcon from "@mui/icons-material/Cancel";

const OrderView = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [editFlag, setEditFlag] = useState(false);
  const [status, setStatus] = useState("all");
  const [remarks, setRemarks] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [errMsg, setErrMsg] = useState({ status: "", remarks: "" });
  const [dialogOpen, setDialogOpen] = useState(false);

  const mode = sessionStorage.getItem("Mode");

  const reducer = useSelector((state) => state.orderReducer);
  const vendorDetails = useSelector((state) => state.vendorReducer);
  const { vendorOneData } = vendorDetails;
  const { loader, getOneOrders, message, success } = reducer;

  useEffect(() => {
    dispatch(getOneVendor(sessionStorage.getItem("tempRow")));
  }, [dialogOpen]);

  useEffect(() => {
    dispatch(resetMessage());
  }, []);
  useEffect(() => {
    if (sessionStorage.getItem("orderId")) {
      dispatch(getOrders(sessionStorage.getItem("orderId")));
    }
  }, [sessionStorage.getItem("orderId")]);

  useEffect(() => {
    if (message !== "" && message !== undefined) {
      setOpenSnackbar(true);
    }
  }, [message]);

  const handleEdit = () => {
    setEditFlag(!editFlag);
    setStatus("all");
    setRemarks("");
  };
  const handleClose = () => {
    setOpenSnackbar(!openSnackbar);
    navigate("/orders");
    dispatch(resetMessage());
    sessionStorage.removeItem("orderId");
  };

  const handleView = (e) => {
    sessionStorage.setItem("tempRow", e?.vendorId);
    setDialogOpen(!dialogOpen);
  };

  const vendorColumns = [
    { datakey: "vendorId", headerName: "Ven_ID", size: 100, align: "left" },
    { datakey: "name", headerName: "Product Name", size: 280 },
    { datakey: "quantity", headerName: "Quantity", size: 120, align: "center" },
    {
      datakey: "total",
      headerName: "Total Amount",
      size: 200,
      align: "left",
    },
    {
      datakey: "status",
      headerName: "Status",
      size: 150,
      align: "left",
    },
    {
      datakey: "actions",
      headerName: "Action",
      size: 200,
      align: "center",
      edit: false,
      delete: false,
    },
  ];
  const vendorRows = getOneOrders?.vendors?.map((e) => {
    return {
      vendorId: e?.vendorId ?? "-",
      name: e?.productInfo?.name ?? "-",
      quantity: e?.productInfo?.quantity ?? "-",
      total: "₹" + e?.productInfo?.total?.toFixed(2) ?? "-",
      status: e?.status ?? "-",
    };
  });
  const columns = [
    { datakey: "productId", headerName: "Prod_ID", size: 100, align: "left" },
    { datakey: "name", headerName: "Product Name", size: 250 },
    { datakey: "quantity", headerName: "Quantity", size: 120, align: "center" },
    {
      datakey: "price",
      headerName: "Price",
      size: 170,
      align: "center",
    },
    {
      datakey: "gst",
      headerName: "GST Amount",
      size: 150,
      align: "right",
    },
    {
      datakey: "total",
      headerName: "Total Amount",
      size: 200,
      align: "right",
    },
  ];

  const rows = getOneOrders?.data?.productInfo?.map((e) => {
    return {
      productId: e?.productId ?? "-",
      name: e?.name ?? "-",
      quantity: e?.quantity ?? "-",
      price: "₹" + e?.price?.toFixed(2) ?? "-",
      gst: "₹" + e?.gst?.toFixed(2) ?? "-",
      total: "₹" + e?.total?.toFixed(2) ?? "-",
    };
  });

  const updateOrder = async () => {
    if (status === "all") {
      setErrMsg({ ...errMsg, status: "Select any status" });
    } else if (status === "rejected" && remarks === "") {
      setErrMsg({ ...errMsg, remarks: "Remarks is required" });
    } else {
      const payload = {
        id: getOneOrders?.data?.id,
        remark: remarks ?? getOneOrders?.data?.remark,
        status: status ?? getOneOrders?.data?.status,
      };

      dispatch(modifyOrders(payload));
    }
  };

  const isoDate = getOneOrders?.data?.createdAt;
  const date = new Date(isoDate);

  const formattedDate = date.toLocaleDateString("en-GB"); // Output: "31/07/2025"
  console.log(formattedDate);

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
        title={"Order Details"}
        back={true}
        backClick={() => {
          navigate("/orders"),
            sessionStorage.removeItem("orderId"),
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
            Customer Information
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
                  Order Id
                </Typography>
                <Typography
                  variant="p"
                  component="div"
                  sx={{ fontSize: "18px", textTransform: "capitalize" }}
                >
                  {sessionStorage.getItem("orderId") ?? "-"}
                </Typography>
              </Grid2>
              <Grid2 item size={4}>
                <Typography
                  variant="p"
                  component="div"
                  sx={{ fontSize: "15px", color: "#22442280" }}
                >
                  Order Date
                </Typography>
                <Typography
                  variant="p"
                  component="div"
                  sx={{ fontSize: "18px", textTransform: "capitalize" }}
                >
                  {formattedDate ?? "-"}
                </Typography>
              </Grid2>
              <Grid2 item size={4}>
                <Typography
                  variant="p"
                  component="div"
                  sx={{ fontSize: "15px", color: "#22442280" }}
                >
                  Customer Name
                </Typography>
                <Typography
                  variant="p"
                  component="div"
                  sx={{ fontSize: "18px", textTransform: "capitalize" }}
                >
                  {getOneOrders?.data?.customerInfo?.name ?? "-"}
                </Typography>
              </Grid2>
              <Grid2 item size={4}>
                <Typography
                  variant="p"
                  component="div"
                  sx={{ fontSize: "15px", color: "#22442280" }}
                >
                  Email
                </Typography>
                <Typography
                  variant="p"
                  component="div"
                  sx={{ fontSize: "18px" }}
                >
                  {getOneOrders?.data?.customerInfo?.email ?? "-"}
                </Typography>
              </Grid2>
              <Grid2 item size={4}>
                <Typography
                  variant="p"
                  component="div"
                  sx={{ fontSize: "15px", color: "#22442280" }}
                >
                  Mobile No
                </Typography>
                <Typography
                  variant="p"
                  component="div"
                  sx={{ fontSize: "18px" }}
                >
                  {getOneOrders?.data?.customerInfo?.phone ?? "-"}
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
                  sx={{ fontSize: "18px" }}
                >
                  {getOneOrders?.data?.customerInfo?.address?.country ?? "-"}
                </Typography>
              </Grid2>
              {/* <Grid2 item size={4}>
                <Typography
                  variant="p"
                  component="div"
                  sx={{ fontSize: "15px", color: "#22442280" }}
                >
                  State
                </Typography>
                <Typography
                  variant="p"
                  component="div"
                  sx={{ fontSize: "18px" }}
                >
                  {getOneOrders?.data?.customerInfo?.address?.state ?? "-"}
                </Typography>
              </Grid2>
              <Grid2 item size={4}>
                <Typography
                  variant="p"
                  component="div"
                  sx={{ fontSize: "15px", color: "#22442280" }}
                >
                  City
                </Typography>
                <Typography
                  variant="p"
                  component="div"
                  sx={{ fontSize: "18px" }}
                >
                  {getOneOrders?.data?.customerInfo?.address?.city ?? "-"}
                </Typography>
              </Grid2> */}
              <Grid2 item size={8}>
                <Typography
                  variant="p"
                  component="div"
                  sx={{ fontSize: "15px", color: "#22442280" }}
                >
                  Delivery Address
                </Typography>
                <Typography
                  variant="p"
                  component="div"
                  sx={{ fontSize: "18px" }}
                >
                  {getOneOrders?.data?.customerInfo?.address?.address + "," + getOneOrders?.data?.customerInfo?.address?.city + "," + getOneOrders?.data?.customerInfo?.address?.state + "," + getOneOrders?.data?.customerInfo?.address?.postalCode + "." ?? "-"}
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
                {!editFlag ? (
                  <Typography
                    variant="p"
                    component="div"
                    sx={{
                      fontSize: "18px",
                      textTransform: "capitalize",
                      color: `${getOneOrders?.data?.status == "approved"
                        ? "green"
                        : getOneOrders?.data?.status == "rejected"
                          ? "red"
                          : "orange"
                        }`,
                      fontWeight: "bold",
                    }}
                  >
                    {getOneOrders?.data?.status}
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
                      <MenuItem value={"pending"}>Pending</MenuItem>
                      <MenuItem value={"shipped"}>Shipped</MenuItem>
                      <MenuItem value={"delivered"}>Delivered</MenuItem>
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
              {getOneOrders?.data?.status === "rejected" && !editFlag && (
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
                    {getOneOrders?.data?.remark ?? "-"}
                  </Typography>
                </Grid2>
              )}
              {status === "rejected" && (
                <>
                  <Grid2 item size={6}>
                    <Typography
                      variant="p"
                      component="div"
                      sx={{ fontSize: "15px", color: "#22442280" }}
                    >
                      Remarks
                    </Typography>
                    {errMsg.remarks && (
                      <Typography
                        variant="p"
                        component="div"
                        sx={{ fontSize: "14px", color: "red" }}
                      >
                        {errMsg.remarks}
                      </Typography>
                    )}
                    <TextareaAutosize
                      id="remarks"
                      value={remarks}
                      style={{
                        width: "100%",
                        fontSize: "16px",
                        padding: "15px 20px 0",
                        backgroundColor: "#f8fafc",
                      }}
                      maxRows={4}
                      minRows={3}
                      onChange={(e) => {
                        setRemarks(e.target.value),
                          setErrMsg({ ...errMsg, remarks: "" });
                      }}
                    />
                  </Grid2>
                </>
              )}
              {editFlag && (
                <Grid2 item size={12}>
                  <Button
                    onClick={updateOrder}
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
      <Paper
        elevation={5}
        sx={{
          borderRadius: "10px",
          padding: "2% 0%",
          margin: "3% auto",
          width: "95%",
        }}
      >
        <Box
          sx={{
            padding: "10px",
            margin: "0 2.5%",
            width: "95%",
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
        </Box>
        <CommonTable rows={rows} columns={columns} />
      </Paper>
      <Paper
        elevation={5}
        sx={{
          borderRadius: "10px",
          padding: "2% 0%",
          margin: "3% auto",
          width: "95%",
        }}
      >
        <Box
          sx={{
            padding: "10px",
            margin: "0 2.5%",
            width: "95%",
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
            Vendor Information
          </Typography>
        </Box>
        <CommonTable
          rows={vendorRows}
          columns={vendorColumns}
          handleView={(e) => handleView(e)}
        />
      </Paper>
      <Dialog
        open={dialogOpen}
      // onClose={() => setDialogOpen(!dialogOpen)}
      >
        <DialogTitle
          sx={{
            fontWeight: "bold",
            display: "flex",
            justifyContent: "flex-end",
            gap: 1,
            color: "gray",
          }}
        >
          <CancelIcon
            sx={{ fontSize: "1.8rem", cursor: "pointer" }}
            onClick={() => {
              setDialogOpen(!dialogOpen);
              sessionStorage.removeItem("tempRow");
            }}
          />
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Typography
              sx={{ color: "black", fontSize: "18px" }}
              variant="p"
              component="div"
            >
              Kindly Contact the Respective Vendor
            </Typography>
            <Grid container rowSpacing={1} sx={{ marginTop: "1px" }}>
              <Grid item xs={12}>
                {/* <Typography sx={{ color: "gray", fontSize: "15px" }}>Name</Typography> */}
                <Typography
                  sx={{ color: "black", fontSize: "16px" }}
                  variant="span"
                  component="div"
                >
                  <span style={{ color: "gray" }}>Name : </span>{" "}
                  {vendorOneData?.data?.name}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                {/* <Typography sx={{ color: "gray", fontSize: "15px" }}>Name</Typography> */}
                <Typography
                  sx={{ color: "black", fontSize: "16px" }}
                  variant="span"
                  component="div"
                >
                  <span style={{ color: "gray" }}>Mobile No : </span>{" "}
                  {vendorOneData?.data?.phone}
                </Typography>
              </Grid>
            </Grid>
          </DialogContentText>
        </DialogContent>
        <DialogActions></DialogActions>
      </Dialog>
    </div>
  );
};

export default OrderView;
