import React, { useEffect, useState } from 'react'
import Titlebar from '../../comnponents/titlebar/Titlebar'
import Filter from '../../comnponents/filter/Filter'
import { Alert, Autocomplete, Backdrop, Box, CircularProgress, Grid2, InputAdornment, MenuItem, Select, Snackbar, TextField, Typography } from '@mui/material';
import CommonTable from '../../comnponents/table/CommonTable'
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import SearchIcon from '@mui/icons-material/Search';
import { stateList } from '../../utils/helpers'
import Modal from '../../comnponents/modal/Modal'
import { fetchAllBrand, resetMessage } from './BrandReducer';

const BrandList = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [status, setStatus] = useState('all')
    const [name, setName] = useState("")
    const [brandImage,setBrandImage] = useState(null)
    const [page, setPage] = useState(1)
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false)


    const reducer = useSelector((state) => state.brandReducer)
    const { loader, message, success, getAllBrandData } = reducer

    useEffect(() => { dispatch(resetMessage()) }, [])

    useEffect(() => {
        setPage(1);
    }, [status]);

    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            let query = `?page=${page}&limit=7`;
            if (name) query += `&name=${type}`;
            if (status && status !== 'all') query += `&status=${status}`;
            dispatch(fetchAllBrand(query))
        }, 500);

        return () => clearTimeout(debounceTimer);

    }, [status, dispatch]);

    useEffect(() => {
        if (message) [
            setOpenSnackbar(true)
        ]
    }, [message])

    const columns = [
        // { datakey: 'id', headerName: 'ID', size: 50, align: 'left', },
        { datakey: 'name', headerName: 'Name', size: 200, },

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
        },
    ];

    const rows = getAllBrandData?.data?.map((item) => {
        return (
            {
                id: item?.id,
                name: item?.name,
                status: item?.status
            }
        )
    }) || []

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    const handleView = (e) => {
        sessionStorage.setItem("adminId", e?.id)
        sessionStorage.setItem("Mode", "View")
        navigate('/viewAdmin')
    }
    const handleEdit = (e) => {
        sessionStorage.setItem("adminId", e?.id)
        sessionStorage.setItem("Mode", "Edit")
        navigate('/adminuserentry')
    }

    const handleDelete = (e) => {
        setDialogOpen(!dialogOpen)
        sessionStorage.setItem("tempRow", e?.id)
    }
    const deleteCustomer = () => {
        setDialogOpen(!dialogOpen)
        // dispatch(removeAdminUser(sessionStorage.getItem("tempRow")))
    }

    const handleClose = () => {
        setOpenSnackbar(!openSnackbar)
        dispatch(fetchAllBrand(`?page=${page}&limit=7`))
    }

    return (
        <div style={{ height: 'auto' }}>
            <Backdrop
                sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                open={loader}
            >
                <CircularProgress color="secondary" />
            </Backdrop>
            {message && <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={openSnackbar} autoHideDuration={1000} onClose={handleClose}>
                <Alert
                    onClose={handleClose}
                    severity={success ? "success" : "error"}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {message}
                </Alert>
            </Snackbar>}
            <Titlebar title={"Brand Details"} addBtn={true} addClick={() => { navigate('/brandEntry'), sessionStorage.setItem("Mode", "Add") }} />
            <CommonTable rows={rows} columns={columns} handlePageChange={handlePageChange} page={page} count={getAllBrandData?.pagination?.totalPages} handleView={(data) => handleView(data)} handleEdit={(data) => handleEdit(data)} handleDelete={(data) => handleDelete(data)} >
                <Filter>
                    <Grid2 container columnSpacing={2} rowSpacing={3}>
                        <Grid2 item size={4}>
                            <Typography variant='p' sx={{ fontWeight: 'bold' }}>Search with Name</Typography>
                            <TextField
                                sx={{ marginTop: '10px' }}
                                id="name"
                                fullWidth
                                size="small"
                                placeholder="Search with Name"
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
            </CommonTable>
            <Modal open={dialogOpen} close={() => { setDialogOpen(!dialogOpen) }} success={deleteCustomer} content={"Are you sure you want to delete this admin user."} />
        </div>
    )
}

export default BrandList