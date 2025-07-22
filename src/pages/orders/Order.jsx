import React, { useEffect, useState } from "react";
import Titlebar from "../../comnponents/titlebar/Titlebar";
import Filter from "../../comnponents/filter/Filter";
import CommonTable from "../../comnponents/table/CommonTable";
import { useDispatch, useSelector } from "react-redux";
import {
  Backdrop,
  CircularProgress,
  Grid2,
  MenuItem,
  Select,
  TextField,
  Typography,
  InputAdornment,
  Box,
  Autocomplete,
  Alert,
  Snackbar,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import { listOfAllOrders, removeOrders, resetMessage } from "./OrderReducer";
import { getAllCustomer } from "../customer/CustomerReducer";
import Modal from "../../comnponents/modal/Modal";

const Orders = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [status, setStatus] = useState("all");
  const [customerName, setCustomerName] = useState("");
  const [getCustomerList, setCustomerList] = useState([]);
  const [page, setPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);

  const reducer = useSelector((state) => state.orderReducer);
  const customerData = useSelector((state) => state.customerReducer);
  const { getAllOrders, loader, message, success } = reducer;
  const { listOfCustomer } = customerData;

  useEffect(() => {
    dispatch(resetMessage());
    dispatch(getAllCustomer(`?allCustomers=true`));
  }, []);

  useEffect(() => {
    // Simulate fetching and attaching unique tempId
    const processedCustomers = listOfCustomer?.rows?.map((customer, index) => ({
      ...customer,
      tempId: `${customer.name}_${index}`, // Create unique temp ID
    }));
    setCustomerList(processedCustomers);
  }, [listOfCustomer]);

  useEffect(() => {
    if (success) {
      setOpenSnackbar(true);
    }
  }, [success]);

  useEffect(() => {
    setPage(1);
  }, [status]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      let query = `?page=${page}&limit=6`;
      if (status && status !== "all") query += `&status=${status}`;
      if (customerName) query += `&customerId=${customerName?.id}`;
      dispatch(listOfAllOrders(query));
    }, 500);
    return () => clearTimeout(debounceTimer);
  }, [status, customerName, page, dispatch]);

  const columns = [
    { datakey: "id", headerName: "Order ID", size: 100, align: "left" },
    { datakey: "name", headerName: "Customer Name", size: 200 },
    { datakey: "email", headerName: "Email", size: 200 },
    {
      datakey: "totalCost",
      headerName: "Price",
      size: 170,
    },
    {
      datakey: "status",
      headerName: "Status",
      size: 150,
      align: "left",
    },
    {
      datakey: "actions",
      headerName: "Actions",
      size: 200,
      align: "center",
      edit: false,
    },
  ];

  const rows = getAllOrders?.data?.map((e) => {
    return {
      id: e?.id,
      name: e?.customerInfo?.name,
      email: e?.customerInfo?.email,
      totalCost: e?.totalCost,
      status: e?.status,
    };
  });

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handlView = (e) => {
    sessionStorage.setItem("orderId", e?.id);
    navigate(`/orderview`);
  };

  const handleDelete = (e) => {
    setDialogOpen(!dialogOpen);
    sessionStorage.setItem("tempRow", e?.id);
  };
  const deleteOrder = () => {
    setDialogOpen(!dialogOpen);
    dispatch(removeOrders(sessionStorage.getItem("tempRow")));
    setOpenSnackbar(true);
  };

  const handleClose = () => {
    setOpenSnackbar(!openSnackbar);
    dispatch(listOfAllOrders(`?page=${page}&limit=6`));
    setPage(1);
    sessionStorage.removeItem("tempRow");
  };

  return (
    <div style={{ height: "100vh" }}>
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
          autoHideDuration={500}
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
      <Titlebar title={"Order Management"} addBtn={false} />
      <Filter>
        <Grid2 container columnSpacing={2} rowSpacing={3}>
          <Grid2 item size={4}>
            <Typography variant="p" sx={{ fontWeight: "bold" }}>
              Search with Name
            </Typography>
            {/* <TextField
                            sx={{ marginTop: '10px' }}
                            id="search"
                            fullWidth
                            size="small"
                            placeholder="Search with name"
                            variant="outlined"
                            value={name}
                            // onChange={(e) => { setName(e.target.value) }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                            }}
                        /> */}
            <Autocomplete
              id="state"
              fullWidth
              size="small"
              sx={{ marginTop: "10px" }}
              options={getCustomerList}
              autoHighlight
              getOptionLabel={(option) => option?.name || ""}
              onChange={(event, value) => {
                setCustomerName(value); // This gives you "Tamil Nadu" if selected
              }}
              renderOption={(props, option) => {
                const { key, ...optionProps } = props;
                return (
                  <Box
                    key={option?.tempId}
                    component="li"
                    sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
                    {...optionProps}
                  >
                    {option?.name}
                  </Box>
                );
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  size="small"
                  autoComplete="off"
                  placeholder="Select Customer Name"
                />
              )}
            />
          </Grid2>
          <Grid2 item size={2}>
            <Typography variant="p" sx={{ fontWeight: "bold" }}>
              Status
            </Typography>
            <Select
              fullWidth
              size="small"
              id="status"
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
              }}
              sx={{ marginTop: "10px" }}
            >
              <MenuItem value={"all"}>All</MenuItem>
              <MenuItem value={"pending"}>Pending</MenuItem>
              <MenuItem value={"shipped"}>Shipped</MenuItem>
              <MenuItem value={"delivered"}>Delivered</MenuItem>
            </Select>
          </Grid2>
        </Grid2>
      </Filter>
      <CommonTable
        rows={rows}
        columns={columns}
        handlePageChange={handlePageChange}
        page={page}
        count={getAllOrders?.pagination?.totalPages}
        handleView={(data) => handlView(data)}
        handleDelete={(data) => handleDelete(data)}
      />
      <Modal
        open={dialogOpen}
        close={() => {
          setDialogOpen(!dialogOpen);
          sessionStorage.removeItem("tempRow");
        }}
        success={deleteOrder}
        content={"Are you sure you want to delete this Order details."}
      />
    </div>
  );
};

export default Orders;
