import React from 'react'
import { Box, Button, FormControl, InputBase, InputLabel, MenuItem, Paper, Select, Typography } from '@mui/material'



const Filter = ({handleName,handleStatus,statusValue,nameValue,nameOptions,onClick}) => {
  
  return (
    <React.Fragment>
          <Paper  elevation={4} sx={{ width: '95%',margin:'25px' }}>
            <Box sx={{display:'flex',margin:'10px',padding:'20px 10px'}}>
              <FormControl variant="outlined" sx={{ m: 1, minWidth: 220 }} size='small'>
                <Typography variant='p' sx={{fontWeight:'bold',marginBottom:'10px'}}>Search with name</Typography>
                <Select
                  id="name"
                  value={nameValue}
                  onChange={handleName}
                 
                >
                    {nameOptions?.map((e,i)=>{
                        return (<MenuItem value={e.value} key={i}>{e.label}</MenuItem>)
                    })}
                </Select>
              </FormControl>
              <FormControl variant="outlined" sx={{ m: 1, minWidth: 220, ml: 4, }} size='small'>
              <Typography variant='p' sx={{fontWeight:'bold',marginBottom:'10px'}}>Search with status</Typography>
                <Select
                  id="status"
                  value={statusValue}
                  onChange={handleStatus}
                >
                  {/* <MenuItem value="">
                    <em>Select Status</em>
                  </MenuItem> */}
                  <MenuItem value={"Active"}>Active</MenuItem>
                  <MenuItem value={"In-Active"}>In-Active</MenuItem>
                </Select>
              </FormControl>
              <Button color="secondary" variant="outlined" sx={{margin:'2.8rem 1.5rem 1rem',height:'33px'}} onClick={onClick}>SEARCH</Button>
            </Box>
          </Paper>
    </React.Fragment>
  )
}

export default React.memo(Filter)
