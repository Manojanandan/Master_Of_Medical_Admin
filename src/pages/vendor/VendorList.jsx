import React, { useEffect, useState } from 'react'
import Titlebar from '../../comnponents/titlebar/Titlebar'
import Filter from '../../comnponents/filter/Filter'
import CommonTable from '../../comnponents/table/CommonTable'
import { useDispatch, useSelector } from 'react-redux'
import { getVendor, removeVendor, resetMessage } from './VendorReducer'
import { Alert, Autocomplete, Backdrop, Box, CircularProgress, Grid2, InputAdornment, MenuItem, Select, Snackbar, TextField, Typography } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search';
import { stateList } from '../../utils/helpers'
import { useNavigate } from 'react-router-dom'
import Modal from '../../comnponents/modal/Modal'

const VendorList = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [name, setName] = useState('')
    const [status, setStatus] = useState('all')
    const [vendorType, setVendorType] = useState('')
    const [page, setPage] = useState(1)
    const [state, setState] = useState(null)
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false)

    const reducer = useSelector((state) => state.vendorReducer)
    const { listOfVendor, loader, success, message } = reducer

    useEffect(() => {
        dispatch(resetMessage())
    }, [])

    useEffect(() => {
        setPage(1)
    }, [name, status, state, vendorType])

    // Load data on filter change or page change
    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            let query = `?page=${page}&limit=7`;
            if (name) query += `&name=${name}`;
            if (vendorType) query += `&type=${vendorType}`;
            if (state) query += `&state=${state}`;
            if (status && status !== 'all') query += `&status=${status}`;
            dispatch(getVendor(query));
        }, 500);
        return () => clearTimeout(debounceTimer);
    }, [name, vendorType, state, status, page, dispatch]);

    const columns = [
        // { datakey: 'id', headerName: 'ID', size: 100, align: 'left', },
        { datakey: 'name', headerName: 'Name', size: 200, },
        { datakey: 'email', headerName: 'Email', size: 220, align: 'left' },
        {
            datakey: 'phone',
            headerName: 'Mobile No',
            size: 180,
            align: 'left'
        },
        {
            datakey: 'type',
            headerName: 'Vendor Type',
            size: 200,
        },
        {
            datakey: 'state',
            headerName: 'State',
            size: 200,
        },
        {
            datakey: 'status',
            headerName: 'Status',
            size: 160,
            align: 'left'
        },
        {
            datakey: 'actions',
            headerName: 'Actions',
            size: 200,
            align: 'center',
            edit: false
        },
    ];

    const rows = listOfVendor?.data?.map((e) => {
        return ({
            id: e?.id,
            name: e?.name,
            email: e?.email,
            phone: e?.phone,
            type: e?.type,
            state: e?.state,
            status: e?.status
        })
    }) || []

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    const handleView = (e) => {
        navigate('/vendorview')
        sessionStorage.setItem("vendorId", e?.id)
        sessionStorage.setItem("Mode", "View")
    }

    const handleDelete = (e) => {
        setDialogOpen(!dialogOpen)
        sessionStorage.setItem("tempRow", e?.id)

    }
    const deleteCustomer = () => {
        setDialogOpen(!dialogOpen)
        dispatch(removeVendor(sessionStorage.getItem("tempRow")))
        setOpenSnackbar(true)
    }

    const handleClose = () => {
        setOpenSnackbar(!openSnackbar)
        dispatch(getVendor(`?page=${page}&limit=7`))
        sessionStorage.removeItem("tempRow")
        setPage(1)
    }

    return (
        <div style={{ height: '100vh' }}>
            <Backdrop
                sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                open={loader}
            >
                <CircularProgress color="secondary" />
            </Backdrop>
            {message && <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={openSnackbar} autoHideDuration={1500} onClose={handleClose}>
                <Alert
                    onClose={handleClose}
                    severity={success ? "success" : "error"}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {message}
                </Alert>
            </Snackbar>}
            <Titlebar title={"Vendor Management"} addBtn={false} />
            <CommonTable rows={rows} columns={columns} handlePageChange={handlePageChange} page={page} count={listOfVendor?.pagination?.totalPages} handleView={(data) => handleView(data)} handleDelete={(data) => handleDelete(data)} >
                <Filter>
                    <Grid2 container columnSpacing={2} rowSpacing={3}>
                        <Grid2 item size={4}>
                            <Typography variant='p' sx={{ fontWeight: 'bold' }}>Search with Name</Typography>
                            <TextField
                                sx={{ marginTop: '10px' }}
                                id="search"
                                fullWidth
                                size="small"
                                placeholder="Search with name"
                                variant="outlined"
                                value={name}
                                onChange={(e) => { setName(e.target.value) }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid2>
                        <Grid2 item size={3}>
                            <Typography variant='p' sx={{ fontWeight: 'bold' }}>Vendor Type</Typography>
                            <TextField id='vendorType' onChange={(e) => setVendorType(e.target.value)} placeholder='Vendor type' name='vendorType' fullWidth size='small' sx={{ marginTop: '10px' }} />
                        </Grid2>
                        <Grid2 item size={3}>
                            <Typography variant='p' sx={{ fontWeight: 'bold' }}>State</Typography>
                            <Autocomplete
                                id="state"
                                fullWidth
                                size="small"
                                sx={{ marginTop: '10px' }}
                                options={stateList}
                                autoHighlight
                                getOptionLabel={(option) => option}
                                onChange={(event, value) => {
                                    setState(value); // This gives you "Tamil Nadu" if selected
                                }}
                                renderOption={(props, option) => {
                                    const { key, ...optionProps } = props;
                                    return (
                                        <Box
                                            key={key}
                                            component="li"
                                            sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
                                            {...optionProps}
                                        >
                                            {option}
                                        </Box>
                                    );
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        size="small"
                                        autoComplete="off"
                                        placeholder="Select State"
                                    />
                                )}
                            />
                        </Grid2>
                        <Grid2 item size={2}>
                            <Typography variant='p' sx={{ fontWeight: 'bold' }}>Status</Typography>
                            <Select
                                fullWidth
                                size="small"
                                id="status"
                                value={status}
                                onChange={(e) => { setStatus(e.target.value) }}
                                sx={{ marginTop: '10px' }}
                            >

                                <MenuItem value={"all"}>All</MenuItem>
                                <MenuItem value={"pending"}>Pending</MenuItem>
                                <MenuItem value={"approved"}>Approved</MenuItem>
                                <MenuItem value={"rejected"}>Rejected</MenuItem>
                            </Select>
                        </Grid2>
                    </Grid2>
                </Filter>
            </CommonTable>
            <Modal open={dialogOpen} close={() => { setDialogOpen(!dialogOpen) }} success={deleteCustomer} content={"Are you sure you want to delete this vendor."} />
        </div>
    )
}

export default VendorList