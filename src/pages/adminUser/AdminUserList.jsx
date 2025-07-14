import React, { useEffect, useState } from 'react'
import Titlebar from '../../comnponents/titlebar/Titlebar'
import Filter from '../../comnponents/filter/Filter'
import { Alert, Autocomplete, Backdrop, Box, CircularProgress, Grid2, InputAdornment, MenuItem, Select, Snackbar, TextField, Typography } from '@mui/material';
import CommonTable from '../../comnponents/table/CommonTable'
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAllUserData, removeAdminUser, resetMessages } from './AdminReducer';
import SearchIcon from '@mui/icons-material/Search';
import { stateList } from '../../utils/helpers'
import Modal from '../../comnponents/modal/Modal'

const AdminUserList = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [name, setName] = useState('')
    const [status, setStatus] = useState('all')
    const [role, setRole] = useState('role')
    const [state, setState] = useState(null)
    const [page, setPage] = useState(1)
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false)


    const reducer = useSelector((state) => state.adminReducer)
    const { adminData, loader, message, success } = reducer

    useEffect(() => { dispatch(resetMessages()) }, [])

    useEffect(() => {
        setPage(1);
    }, [name, role, state, status]);

    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            let query = `?page=${page}&limit=7`;
            if (name) query += `&name=${name}`;
            if (role && role !== "role") query += `&role=${role}`;
            if (state) query += `&state=${state}`;
            if (status && status !== 'all') query += `&status=${status}`;
            dispatch(getAllUserData(query))
        }, 500);

        return () => clearTimeout(debounceTimer);

    }, [name, role, state, status, dispatch]);

    useEffect(() => {
        if (message) [
            setOpenSnackbar(true)
        ]
    }, [message])

    const columns = [
        // { datakey: 'id', headerName: 'ID', size: 50, align: 'left', },
        { datakey: 'name', headerName: 'Name', size: 200, },
        { datakey: 'email', headerName: 'Email', size: 220, },
        {
            datakey: 'phone',
            headerName: 'Mobile No',
            size: 180,
        },
        {
            datakey: 'role',
            headerName: 'Role',
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

    const rows = adminData?.data?.map((item) => {
        return (
            {
                id: item?.id,
                name: item?.name,
                email: item?.email,
                phone: item?.phone,
                role: item?.role,
                state: item?.state,
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
        dispatch(removeAdminUser(sessionStorage.getItem("tempRow")))
    }

    const handleClose = () => {
        setOpenSnackbar(!openSnackbar)
        dispatch(getAllUserData(`?page=${page}&limit=7`))
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
            <Titlebar title={"Admin Users"} addBtn={true} addClick={() => { navigate('/adminuserentry'), sessionStorage.setItem("Mode", "Add") }} />
            <Filter>
                <Grid2 container columnSpacing={2} rowSpacing={3}>
                    <Grid2 item size={4}>
                        <Typography variant='p' sx={{ fontWeight: 'bold' }}>Search with Name</Typography>
                        <TextField
                            sx={{ marginTop: '10px' }}
                            id="search"
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
                    <Grid2 item size={3}>
                        <Typography variant='p' sx={{ fontWeight: 'bold' }}>User Role</Typography>
                        <Select
                            fullWidth
                            size="small"
                            id="role"
                            name="role"
                            value={role}
                            onChange={(e) => { setRole(e.target.value) }}
                            sx={{ marginTop: '10px' }}
                        >

                            <MenuItem value="role">Select Role</MenuItem>
                            <MenuItem value={"admin"}>Admin</MenuItem>
                            <MenuItem value={"support"}>Support</MenuItem>
                        </Select>
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
                            <MenuItem value={"active"}>Active</MenuItem>
                            <MenuItem value={"in-active"}>In-Active</MenuItem>
                        </Select>
                    </Grid2>
                </Grid2>
            </Filter>
            <CommonTable rows={rows} columns={columns} handlePageChange={handlePageChange} page={page} count={adminData?.pagination?.totalPages} handleView={(data) => handleView(data)} handleEdit={(data) => handleEdit(data)} handleDelete={(data) => handleDelete(data)} />
            <Modal open={dialogOpen} close={() => { setDialogOpen(!dialogOpen) }} success={deleteCustomer} content={"Are you sure you want to delete this admin user."} />
        </div>
    )
}

export default AdminUserList