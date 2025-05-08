import React from 'react'
import Titlebar from '../../comnponents/titlebar/Titlebar'
import { useNavigate } from 'react-router-dom'
import { Box, TextField, Typography } from '@mui/material'

const ProductEntry = () => {
    const navigate = useNavigate()
  return (
    <div>
        <Titlebar title={"Product Details"} filter={false} back={true} backClick={()=>navigate('/productmanagement')} />
        <Box
          component="form"
          sx={{ '& .MuiTextField-root': { m: 2, width: '35ch' }, margin: '4%' }}
          noValidate
          autoComplete="off"
        >
          <div>
            <TextField
              sx={{paddingRight: '2%'}}
              id="productName"
              label="Product Name"
              variant="outlined"
            />
           <TextField
              sx={{paddingRight: '2%'}}
              id="productBrand"
              label="Product Brand"
              variant="outlined"
            />
           <TextField
              sx={{paddingRight: '2%'}}
              id="productBrand"
              label="Product Brand"
              variant="outlined"
            />
           <TextField
              sx={{paddingRight: '2%'}}
              id="productBrand"
              label="Product Brand"
              variant="outlined"
            />
          </div>
      </Box>
    </div>
  )
}

export default ProductEntry