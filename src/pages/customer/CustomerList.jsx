import React, { useEffect, useState } from 'react'
import Titlebar from '../../comnponents/titlebar/Titlebar'
import Filter from '../../comnponents/filter/Filter'
import CommonTable from '../../comnponents/table/CommonTable'
import { useDispatch, useSelector } from 'react-redux'
import { getAllCustomer } from './CustomerReducer'
import { Backdrop, CircularProgress } from '@mui/material'

const CustomerList = () => {
    const dispatch = useDispatch()
    const [name, setName] = useState('')
    const [status, setStatus] = useState('All')
    const [accordian, setAccordian] = useState(false)
    const [page, setPage] = useState(1)

    const reducer = useSelector((state) => state.customerReducer)
    const { listOfCustomer, loader } = reducer

    useEffect(() => {
        dispatch(getAllCustomer(page))
    }, [])

    const columns = [
        { datakey: 'id', headerName: 'ID', size: 100, align: 'left', },
        { datakey: 'name', headerName: 'Name', size: 200, },
        { datakey: 'email', headerName: 'Email', size: 200, },
        {
            datakey: 'phone',
            headerName: 'Mobile No',
            size: 200,
        },
        {
            datakey: 'isActive',
            headerName: 'Status',
            size: 150,
            align: 'center'
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
            isActive: e?.isActive
        })
    })

    const handlePageChange = (event, value) => {
        setPage(value);
        dispatch(getAllCustomer(value))
    };

    return (
        <div style={{ height: '100vh' }}>
            <Backdrop
                sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                open={loader}
            >
                <CircularProgress color="secondary" />
            </Backdrop>
            <Titlebar title={"Customer Management"} filter={true} onClick={() => setAccordian(!accordian)} addClick={() => navigate('/blogentry?Mode=Add')} />
            {accordian && <Filter handleStatus={(e) => { setStatus(e.target.value) }} handleName={(e) => { setName(e.target.value) }} nameValue={name} statusValue={status} />}
            <CommonTable rows={rows} columns={columns} handlePageChange={handlePageChange} page={page} count={listOfCustomer?.pagination?.totalPages} handleView={(data) => console.log(data)} handleEdit={(data) => console.log(data)} handleDelete={(data) => console.log(data)} />
        </div>
    )
}

export default CustomerList