import React, { useEffect, useState } from 'react'
import Titlebar from '../../comnponents/titlebar/Titlebar'
import Filter from '../../comnponents/filter/Filter'
import CommonTable from '../../comnponents/table/CommonTable'
import { useDispatch, useSelector } from 'react-redux'
import { getAllCustomer } from './CustomerReducer'
import { Backdrop, CircularProgress, Grid2, MenuItem, Select, TextField, Typography, InputAdornment, Box, Autocomplete } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search';
import { stateList } from '../../utils/helpers'

const CustomerList = () => {
    const dispatch = useDispatch()
    const [name, setName] = useState('')
    const [status, setStatus] = useState('all')
    const [state, setState] = useState(null)
    // const [accordian, setAccordian] = useState(true)
    const [page, setPage] = useState(1)

    const reducer = useSelector((state) => state.customerReducer)
    const { listOfCustomer, loader } = reducer

    useEffect(() => {
        dispatch(getAllCustomer(page))
    }, [])

    const columns = [
        // { datakey: 'id', headerName: 'ID', size: 50, align: 'left', },
        { datakey: 'name', headerName: 'Name', size: 200, },
        { datakey: 'email', headerName: 'Email', size: 200, },
        {
            datakey: 'phone',
            headerName: 'Mobile No',
            size: 170,
        },
        {
            datakey: 'type',
            headerName: 'User Type',
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

    const rows = listOfCustomer?.data?.map((e) => {
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
        dispatch(getAllCustomer(value))
    };
    console.log(state);


    return (
        <div style={{ height: '100vh' }}>
            <Backdrop
                sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                open={loader}
            >
                <CircularProgress color="secondary" />
            </Backdrop>
            <Titlebar title={"Customer Management"} addBtn={false} />
            <Filter>
                <Grid2 container columnSpacing={2} rowSpacing={3}>
                    <Grid2 item size={4}>
                        <Typography variant='p' sx={{ fontWeight: 'bold' }}>Search for (Name,Email and Mobile No)</Typography>
                        <TextField
                            sx={{ marginTop: '10px' }}
                            id="search"
                            fullWidth
                            size="small"
                            placeholder="Search by anything"
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
                        <Typography variant='p' sx={{ fontWeight: 'bold' }}>User Type</Typography>
                        <TextField id='userType' placeholder='User type' name='userType' fullWidth size='small' sx={{ marginTop: '10px' }} />
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
            <CommonTable rows={rows} columns={columns} handlePageChange={handlePageChange} page={page} count={listOfCustomer?.pagination?.totalPages} handleView={(data) => console.log(data)} handleEdit={(data) => console.log(data)} handleDelete={(data) => console.log(data)} />
        </div>
    )
}

export default CustomerList