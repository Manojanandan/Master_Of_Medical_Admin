import { Button, Typography } from '@mui/material'
import React from 'react'
import TuneIcon from '@mui/icons-material/Tune';
import AddIcon from '@mui/icons-material/Add';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';

const Titlebar = ({title,addClick,back,backClick,addBtn}) => {
  return (
    <div style={{display:'flex',justifyContent:'space-between',padding:'3% 2% 0%'}}>
        <Typography component='div' variant='h5' sx={{fontWeight:"bold"}} >
            {title}
        </Typography>
        <div>
          {addBtn &&
          <>
            {/* <Button variant='outlined'  startIcon={<TuneIcon />} sx={{color:"#fff",backgroundColor:"#9b2f7d",fontWeight:'bold',mr:2}} onClick={onClick}>
              Filter
            </Button> */}
            <Button variant='outlined'  startIcon={<AddIcon />} sx={{color:"#fff",backgroundColor:"#9b2f7d",fontWeight:'bold'}} onClick={addClick}>
              Add New
            </Button>
          </>
          }
          {back &&
          <>
            <Button variant='text'  startIcon={<KeyboardBackspaceIcon />} sx={{color:"#000000",fontWeight:'bold',mr:2}} onClick={backClick}>
              Back to list
            </Button>
          </>
          }
        </div>
    </div>
  )
}

export default Titlebar