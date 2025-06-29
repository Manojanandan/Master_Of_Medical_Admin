import React from 'react'
import { Box, Button, FormControl, InputAdornment, MenuItem, Paper, Select, TextField, Typography } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search';


const Filter = ({ handleName, handleStatus, statusValue, nameValue, onClick }) => {

  return (
    <React.Fragment>
      <Paper elevation={4} sx={{ width: '95%', margin: '25px' }}>
        <Box sx={{ display: 'flex', margin: '10px', padding: '20px 10px' }}>
          <FormControl variant="outlined" sx={{ m: 1, minWidth: 300 }} size='small'>
            <Typography variant='p' sx={{ fontWeight: 'bold', marginBottom: '10px' }}>Search with name</Typography>
            <TextField
              id="search"
              size="small"
              placeholder="Search by ID or Name"
              variant="outlined"
              value={nameValue}
              onChange={handleName}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </FormControl>
          <FormControl variant="outlined" sx={{ m: 1, minWidth: 150, ml: 4, }} size='small'>
            <Typography variant='p' sx={{ fontWeight: 'bold', marginBottom: '10px' }}>Search with status</Typography>
            <Select
              id="status"
              value={statusValue}
              onChange={handleStatus}
            >
             
              <MenuItem value={"All"}>All</MenuItem>
              <MenuItem value={"Active"}>Active</MenuItem>
              <MenuItem value={"In-Active"}>In-Active</MenuItem>
            </Select>
          </FormControl>
          <Button variant="contained" sx={{ margin: '2.5rem 1.5rem 1rem', height: '33px',backgroundColor:"#009e92",fontWeight:'bold',padding:'20px 25px' }} onClick={onClick}>SEARCH</Button>
        </Box>
      </Paper>
    </React.Fragment>
  )
}

export default React.memo(Filter)
