import React from "react";
import {
  Avatar,
  Box,
  Chip,
  IconButton,
  Pagination,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const CommonTable = ({
  rows,
  columns,
  count,
  page,
  handlePageChange,
  handleView,
  handleEdit,
  handleDelete,
  children
}) => {
  return (
    <React.Fragment>
      <Paper
        elevation={5}
        sx={{
          width: "95%",
          margin: "20px 25px 25px",
          height: "auto",
          borderRadius: "5px",
          padding: "10px 0 15px"
        }}
      >
        {children}
        {rows?.length > 0 ? (
          <>
            <Box
              sx={{
                borderBottom: "solid 1px #2424",
                display: "flex",
                alignItems: "center",
                padding: "15px 20px",
                backgroundColor: "#06a094",
                color: "#fff",
                width: '98%',
                margin: '0 auto',
                borderRight: 'solid 1px #2424',
                borderLeft: 'solid 1px #2424',
              }}
            >
              {columns?.map((col, key) => {
                return (
                  <Box sx={{ width: `${col?.size}px` }} key={key}>
                    <Typography
                      fontWeight={600}
                      sx={{ fontSize: "18px", textAlign: col?.align }}
                    >
                      {col?.headerName === "Img" ? "" : col?.headerName}
                    </Typography>
                  </Box>
                );
              })}
            </Box>

            {rows?.map((item, index) => {
              return (
                <Box
                  key={index}
                  sx={{
                    borderBottom: "solid 1px #2424",
                    display: "flex",
                    alignItems: "center",
                    padding: "10px 20px",
                    transition: "background 0.2s",
                    "&:hover": {
                      backgroundColor: "#f0f4f8",
                    },
                    width: '98%',
                    margin: '0 auto',
                    borderRight: 'solid 1px #2424',
                    borderLeft: 'solid 1px #2424',
                  }}
                >
                  {columns?.map((col, idx) => {
                    return (
                      <Box
                        sx={{
                          width: `${col?.size}px`,
                          display: "flex",
                          justifyContent: col?.align,
                          alignItems: col?.align,
                          flexWrap: "wrap",
                          overflowWrap: "break-word",
                          wordBreak: "break-word",
                          whiteSpace: "normal",
                        }}
                        key={idx}
                      >
                        {col?.headerName === "Img" ? (
                          <Avatar
                            src={item[col?.datakey]}
                            alt={item[col?.datakey]}
                          />
                        ) : col?.datakey === "actions" ? (
                          <div>
                            {(col?.view ?? true) && (
                              <IconButton
                                onClick={() => handleView(item)}
                                sx={{
                                  color: "#f09407",
                                }}
                              >
                                <VisibilityIcon />
                              </IconButton>
                            )}
                            {(col?.edit ?? true) && (
                              <IconButton
                                color="primary"
                                onClick={() => handleEdit(item)}
                              >
                                <EditIcon />
                              </IconButton>
                            )}
                            {(col?.delete ?? true) && (
                              <IconButton
                                color="error"
                                onClick={() => handleDelete(item)}
                              >
                                <DeleteIcon />
                              </IconButton>
                            )}
                          </div>
                        ) : col?.datakey === "status" ? (
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: col?.align,
                              alignItems: "center",
                              textTransform: "capitalize",
                            }}
                          >
                            {item[col?.datakey] ? (
                              <>
                                <Box
                                  sx={{
                                    height: "12px",
                                    width: "12px",
                                    border: `solid 1px ${item[col?.datakey] === "active" ||
                                        item[col?.datakey] === "approved" ||
                                        item[col?.datakey] === "resolved" ||
                                        item[col?.datakey] === "delivered"
                                        ? "green"
                                        : item[col?.datakey] === "pending"
                                          ? "orange"
                                          : item[col?.datakey] === "spam"
                                            ? "blue"
                                            : item[col?.datakey] === "shipped"
                                              ? "#0398d5"
                                              : "red"
                                      }`,
                                    borderRadius: "50%",
                                    marginRight: "10px",
                                    backgroundColor: `${item[col?.datakey] === "active" ||
                                        item[col?.datakey] === "approved" ||
                                        item[col?.datakey] === "resolved" ||
                                        item[col?.datakey] === "delivered"
                                        ? "green"
                                        : item[col?.datakey] === "pending"
                                          ? "orange"
                                          : item[col?.datakey] === "spam"
                                            ? "blue"
                                            : item[col?.datakey] === "shipped"
                                              ? "#0398d5"
                                              : "red"
                                      }`,
                                  }}
                                ></Box>
                                <Typography
                                  variant="p"
                                  component="div"
                                  sx={{
                                    fontSize: "16px",
                                    textAlign: col?.align,
                                    color: `${item[col?.datakey] === "active" ||
                                        item[col?.datakey] === "approved" ||
                                        item[col?.datakey] === "resolved" ||
                                        item[col?.datakey] === "delivered"
                                        ? "green"
                                        : item[col?.datakey] === "pending"
                                          ? "orange"
                                          : item[col?.datakey] === "spam"
                                            ? "blue"
                                            : item[col?.datakey] === "shipped"
                                              ? "#0398d5"
                                              : "red"
                                      }`,
                                    fontWeight: "bold",
                                    paddingRight: "12px",
                                  }}
                                >
                                  {item[col?.datakey]}
                                </Typography>
                              </>
                            ) : (
                              "-"
                            )}
                          </Box>
                        ) : (
                          <Typography
                            variant="p"
                            component="div"
                            sx={{
                              fontSize: "16px",
                              textAlign: col?.align,
                              paddingRight: "12px",
                            }}
                          >
                            {item[col?.datakey]}
                          </Typography>
                        )}
                      </Box>
                    );
                  })}
                </Box>
              );
            })}
          </>
        ) : (
          <Typography
            variant="p"
            component="div"
            sx={{ padding: "10px 15px", color: "#22442275", fontSize: "20px" }}
          >
            No data(s) found.
          </Typography>
        )}
      </Paper>
      {count > 0 && (
        <Stack spacing={2} sx={{ alignItems: "center" }}>
          <Pagination
            count={count ?? "5"}
            color="secondary"
            size="large"
            page={page}
            onChange={handlePageChange}
          />
        </Stack>
      )}
    </React.Fragment>
  );
};

export default CommonTable;
