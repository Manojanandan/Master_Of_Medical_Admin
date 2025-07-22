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
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import { useNavigate } from "react-router-dom";
import { resetMessage, updateSupport, viewOneSupport } from "./SupportReducer";

const SupportView = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [editFlag, setEditFlag] = useState(false);
  const [status, setStatus] = useState("all");
  const [remarks, setRemarks] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [errMsg, setErrMsg] = useState({ status: "", remarks: "" });

  const mode = sessionStorage.getItem("Mode");

  const reducer = useSelector((state) => state.supportReducer);
  const { loader, getOneSupport, message, success } = reducer;

  useEffect(() => {
    dispatch(resetMessage());
  }, []);
  useEffect(() => {
    if (sessionStorage.getItem("supportId")) {
      dispatch(viewOneSupport(sessionStorage.getItem("supportId")));
    }
  }, [sessionStorage.getItem("supportId")]);

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
    navigate("/support");
    dispatch(resetMessage());
  };

  const modifySupport = async () => {
    if (status === "all") {
      setErrMsg({ ...errMsg, status: "Select any status" });
    } else if (status === "rejected" && remarks === "") {
      setErrMsg({ ...errMsg, remarks: "Remarks is required" });
    } else {
      const payload = {
        id: getOneSupport?.data?.id,
        name: getOneSupport?.data?.name,
        email: getOneSupport?.data?.email,
        message: getOneSupport?.data?.message,
        status: status ?? getOneSupport?.data?.status,
        remarks: remarks ?? getOneSupport?.data?.remarks,
      };
      dispatch(updateSupport(payload));
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
        title={"Support Details"}
        back={true}
        backClick={() => {
          navigate("/support"), sessionStorage.removeItem("supportId");
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
            Feedback Information
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
                  User Name
                </Typography>
                <Typography
                  variant="p"
                  component="div"
                  sx={{ fontSize: "18px", textTransform: "capitalize" }}
                >
                  {getOneSupport?.data?.name ?? "-"}
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
                  {getOneSupport?.data?.email ?? "-"}
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
                  {getOneSupport?.data?.phone ?? "-"}
                </Typography>
              </Grid2>
              <Grid2 item size={4}>
                <Typography
                  variant="p"
                  component="div"
                  sx={{ fontSize: "15px", color: "#22442280" }}
                >
                  Message
                </Typography>
                <Typography
                  variant="p"
                  component="div"
                  sx={{ fontSize: "18px", textTransform: "capitalize" }}
                >
                  {getOneSupport?.data?.message ?? "-"}
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
                      color: `${
                        getOneSupport?.data?.status == "resolved"
                          ? "green"
                          : getOneSupport?.data?.status == "rejected"
                          ? "red"
                          : getOneSupport?.data?.status === "spam"
                          ? "blue"
                          : "orange"
                      }`,
                      fontWeight: "bold",
                    }}
                  >
                    {getOneSupport?.data?.status}
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
                      <MenuItem value={"resolved"}>Resolved</MenuItem>
                      <MenuItem value={"rejected"}>Rejected</MenuItem>
                      <MenuItem value={"spam"}>Spam</MenuItem>
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
              {getOneSupport?.data?.status === "rejected" && !editFlag && (
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
                    {getOneSupport?.data?.remarks ?? "-"}
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
                    onClick={modifySupport}
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

export default SupportView;
