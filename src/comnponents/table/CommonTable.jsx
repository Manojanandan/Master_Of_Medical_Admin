import React from 'react'
import { Box, Chip, IconButton, Pagination, Paper, Stack, Typography } from '@mui/material'
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const CommonTable = ({ rows, columns, count, page, handlePageChange, handleView, handleEdit, handleDelete }) => {
  return (
    <React.Fragment>
      <Paper elevation={5} sx={{ width: '95%', margin: '25px', height: "auto", borderRadius: '5px' }}>

        <Box sx={{ borderBottom: 'solid 1px #2424', display: 'flex', alignItems: 'center', padding: '15px 20px', }}>
          {columns?.map((col, key) => {
            return (
              <Box sx={{ width: col?.size }} key={key}>
                <Typography fontWeight={600} sx={{ fontSize: '18px', textAlign: col?.align, }}>{col?.headerName}</Typography>
              </Box>
            )
          })
          }
        </Box>

        {rows?.map((item, index) => {
          return (
            <Box key={index} sx={{
              borderBottom: 'solid 1px #2424', display: 'flex', alignItems: 'center', padding: '10px 20px', transition: 'background 0.2s', '&:hover': {
                backgroundColor: '#f0f4f8',
              },
            }}>
              {columns?.map((col, idx) => {
                return (
                  <Box sx={{ width: col?.size }} key={idx}>
                    {col?.datakey === "actions" ?
                      <div style={{ textAlign: col?.align }}>
                        <IconButton
                          onClick={() => handleView(item)}
                          sx={{
                            color: "#f09407",
                          }}
                        >
                          <VisibilityIcon />
                        </IconButton>
                        <IconButton color="primary" onClick={() => handleEdit(item)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton color="error" onClick={() => handleDelete(item)}>
                          <DeleteIcon />
                        </IconButton>
                      </div>
                      :
                      col?.datakey === "status" ? 
                      <Box sx={{display:'flex',justifyContent:col?.align,alignItems:'center',textTransform:'capitalize'}}>
                        {item[col?.datakey] ? 
                        <>
                          <Box sx={{height:'12px',width:'12px',border:`solid 1px ${item[col?.datakey] === "active" ? "green" : "red"}`,borderRadius:'50%',marginRight:'10px',backgroundColor: `${item[col?.datakey] === "active" ? "green" : "red"}`}}></Box>
                          <Typography variant='p' component='div' sx={{ fontSize: '16px', textAlign: col?.align,color:`${item[col?.datakey] === "active" ? "green" : "red"}`,fontWeight:'bold' }}>{item[col?.datakey]}</Typography>
                        </> : '-' }
                      </Box>
                        :
                        <Typography variant='p' component='div' sx={{ fontSize: '16px', textAlign: col?.align,}}>{item[col?.datakey]}</Typography>
                    }
                  </Box>
                )
              })}
            </Box>
          )
        })}

      </Paper>
      <Stack spacing={2} sx={{ alignItems: 'center', }}>
        <Pagination count={count ?? "5"} color="secondary" size='large' page={page} onChange={handlePageChange} />
      </Stack>
    </React.Fragment>
  )
}

export default CommonTable