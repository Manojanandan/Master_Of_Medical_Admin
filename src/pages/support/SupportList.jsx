import React, { useEffect, useState } from 'react'
import Titlebar from '../../comnponents/titlebar/Titlebar'
import Filter from '../../comnponents/filter/Filter'
import CommonTable from '../../comnponents/table/CommonTable'
import { useDispatch, useSelector } from 'react-redux'
import { Backdrop, CircularProgress, Grid2, MenuItem, Select, TextField, Typography, InputAdornment, Box, Autocomplete, Alert, Snackbar } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search';
import { stateList } from '../../utils/helpers'
import { useNavigate } from 'react-router-dom'
import { resetMessage, viewallSupport } from './SupportReducer'


const SupportList = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [status, setStatus] = useState('all')
    const [page, setPage] = useState(1)

    const reducer = useSelector((state) => state.supportReducer)
    const { getAllSupport, loader, message, success } = reducer
    console.log(getAllSupport);

    useEffect(() => {
        dispatch(resetMessage())
    }, [])

    useEffect(() => {
        if (success) {
            setOpenSnackbar(true)
        }
    }, [success])

    useEffect(() => {
        setPage(1)
    }, [status])

    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            let query = `?page=${page}&limit=6`;
            if (status && status !== 'all') query += `&status=${status}`;
            dispatch(viewallSupport(query));
        }, 500);
        return () => clearTimeout(debounceTimer);
    }, [status, page, dispatch]);

    const columns = [
        { datakey: 'id', headerName: 'Order ID', size: 50, align: 'left', },
        { datakey: 'name', headerName: 'Customer Name', size: 200, },
        { datakey: 'email', headerName: 'Email', size: 200, },
        {
            datakey: 'price',
            headerName: 'Price',
            size: 170,
        },
        {
            datakey: 'status',
            headerName: 'Status',
            size: 150,
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

    const rows = getAllSupport?.data?.map((e) => {
        return ({
            id: e?.id,
            name: e?.name,
            email: e?.email,
            phone: e?.phone,
            type: e?.type,
            state: e?.state,
            status: e?.status
        })
    })

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    const handlView = (e) => {
        sessionStorage.setItem("supportId", e?.id)
        navigate(`/supportview`)
    }

    const handleDelete = (e) => {
        dispatch(removeOrders(e?.id))
    }

    const handleClose = () => {
        setOpenSnackbar(!openSnackbar)
        dispatch(viewallSupport(`?page=${page}&limit=6`))
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
            {message && <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={openSnackbar} autoHideDuration={500} onClose={handleClose}>
                <Alert
                    onClose={handleClose}
                    severity={success ? "success" : "error"}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {message}
                </Alert>
            </Snackbar>}
            <Titlebar title={"Support Management"} addBtn={false} />
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
                            // onChange={(e) => { setName(e.target.value) }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                            }}
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
                            <MenuItem value={"active"}>Active</MenuItem>
                            <MenuItem value={"in-active"}>In-Active</MenuItem>
                        </Select>
                    </Grid2>
                </Grid2>
            </Filter>
            <CommonTable rows={rows} columns={columns} handlePageChange={handlePageChange} page={page} count={getAllSupport?.pagination?.totalPages} handleView={(data) => handlView(data)} handleDelete={(data) => handleDelete(data)} />
        </div>
    )
}

export default SupportList