import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import React from 'react'
import CancelIcon from '@mui/icons-material/Cancel';

const Modal = ({content,open,close,success}) => {
    return (
        <Dialog
            open={open}
        // onClose={() => setDialogOpen(!dialogOpen)}
        >
            <DialogTitle sx={{ color: 'red', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
                <CancelIcon sx={{ fontSize: '2rem' }} /> Warning
            </DialogTitle>
            <DialogContent>
                <DialogContentText sx={{ color: 'black', fontSize: '18px' }}>
                    {content}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button variant='contained' onClick={close} sx={{ backgroundColor: '#2424', fontWeight: 'bold', textTransform: 'capitalize', color: '#fffff', fontSize: '17px', mr: 1 }}>No</Button>
                <Button variant='contained' onClick={success} autoFocus sx={{ backgroundColor: '#06a094', fontWeight: 'bold', textTransform: 'capitalize', color: '#ffffff', fontSize: '17px', mx: 2, }}>
                    Yes
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default Modal