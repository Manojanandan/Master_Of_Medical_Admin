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
import { fetchAllBanner, removeBanner, resetMessage } from './BannerReducer';

const BannerList = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [title, setTitle] = useState('')
    const [status, setStatus] = useState('all')
    const [description, setDescription] = useState('role')
    const [ctaText, setCtaText] = useState("")
    const [ctaLink, setCtaLink] = useState("")
    const [type, setType] = useState("all")
    const [bannerImage,setBannerImage] = useState(null)
    const [page, setPage] = useState(1)
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false)


    const reducer = useSelector((state) => state.bannerReducer)
    const { loader, message, success, getAllBannerData } = reducer

    useEffect(() => { dispatch(resetMessage()) }, [])

    useEffect(() => {
        setPage(1);
    }, [title, type, status]);

    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            let query = `?page=${page}&limit=7`;
            if (title) query += `&title=${title}`;
            if (type & type !== "all") query += `&type=${type}`;
            if (status && status !== 'all') query += `&status=${status}`;
            dispatch(fetchAllBanner(query))
        }, 500);

        return () => clearTimeout(debounceTimer);

    }, [title, type, status, dispatch]);

    useEffect(() => {
        if (message) [
            setOpenSnackbar(true)
        ]
    }, [message])

     const columns = [
        { datakey: 'bannerImage', headerName: 'Img', size: 100, },
        // { datakey: 'title', headerName: 'Title', size: 220, },
        // {
        //     datakey: 'ctaText',
        //     headerName: 'CTA Text',
        //     size: 180,
        // },
        {
            datakey: 'type',
            headerName: 'Type',
            size: 350,
        },
        {
            datakey: 'status',
            headerName: 'Status',
            size: 250,
            align: 'left'
        },
        {
            datakey: 'actions',
            headerName: 'Actions',
            size: 200,
            align: 'center',
        },
    ];
    const rows = getAllBannerData?.data?.map((item) => {
        return (
            {
                bannerImage: item?.bannerImage,
                ctaText: item?.ctaText,
                title: item?.title,
                id: item?.id,
                type: item?.type,
                status: item?.status
            }
        )
    }) || []

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    const handleView = (e) => {
        sessionStorage.setItem("bannerId", e?.id)
        sessionStorage.setItem("Mode", "View")
        navigate('/bannerView')
    }
    const handleEdit = (e) => {
        sessionStorage.setItem("bannerId", e?.id)
        sessionStorage.setItem("Mode", "Edit")
        navigate('/bannerEntry')
    }

    const handleDelete = (e) => {
        setDialogOpen(!dialogOpen)
        sessionStorage.setItem("tempRow", e?.id)
    }
    const deleteCustomer = () => {
        setDialogOpen(!dialogOpen)
        dispatch(removeBanner(sessionStorage.getItem("tempRow")))
    }

    const handleClose = () => {
        setOpenSnackbar(!openSnackbar)
        dispatch(fetchAllBanner(`?page=${page}&limit=7`))
        sessionStorage.removeItem("tempRow ")
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
            <Titlebar title={"Banner Details"} addBtn={true} addClick={() => { navigate('/bannerEntry'), sessionStorage.setItem("Mode", "Add") }} />
            <CommonTable rows={rows} columns={columns} handlePageChange={handlePageChange} page={page} count={getAllBannerData?.pagination?.totalPages} handleView={(data) => handleView(data)} handleEdit={(data) => handleEdit(data)} handleDelete={(data) => handleDelete(data)} >
                <Filter>
                    <Grid2 container columnSpacing={2} rowSpacing={3}>
                        <Grid2 item size={4}>
                            <Typography variant='p' sx={{ fontWeight: 'bold' }}>Search with Title</Typography>
                            <TextField
                                sx={{ marginTop: '10px' }}
                                id="title"
                                fullWidth
                                size="small"
                                placeholder="Search with Title"
                                variant="outlined"
                                value={title}
                                onChange={(e) => { setTitle(e.target.value) }}
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
                            <Typography variant='p' sx={{ fontWeight: 'bold' }}>Type</Typography>
                            <Select
                                fullWidth
                                size="small"
                                id="type"
                                name="type"
                                value={type}
                                onChange={(e) => { setType(e.target.value) }}
                                sx={{ marginTop: '10px' }}
                            >

                                <MenuItem value="all">Select Type</MenuItem>
                                <MenuItem value={"landing"}>Landing</MenuItem>
                                <MenuItem value={"e-commerce"}>E-commerce</MenuItem>
                            </Select>
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

export default BannerList