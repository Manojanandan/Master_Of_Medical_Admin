import React, { useEffect, useState } from 'react'
import Titlebar from '../../comnponents/titlebar/Titlebar'
import Filter from '../../comnponents/filter/Filter'
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Backdrop, CircularProgress, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CommonTable from '../../comnponents/table/CommonTable'
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAllUserData } from './AdminReducer';

const AdminUserList = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [name, setName] = useState('')
    const [status, setStatus] = useState('All')
    const [accordian, setAccordian] = useState(false)
    const [page, setPage] = useState(1)

    useEffect(() => {
        dispatch(getAllUserData())
    }, [])

    const reducer = useSelector((state) => state.adminReducer)
    const { adminData, loader } = reducer

    console.log(adminData);


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
            datakey: 'status',
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

    const rows = adminData?.data?.map((item) => {
        return (
            {
                id: item?.id,
                name: item?.name,
                email: item?.email,
                phone: item?.phone,
                status: item?.status
            }
        )
    })

    const handlePageChange = (event, value) => {
        setPage(value);
        dispatch(getAllUserData(value))
    };
    return (
        <div style={{ height: 'auto' }}>
            <Backdrop
                sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                open={loader}
            >
                <CircularProgress color="secondary" />
            </Backdrop>
            <Titlebar title={"Admin Users"} filter={true} onClick={() => setAccordian(!accordian)} addClick={() => navigate('/adminuserentry')} />
            {accordian && <Filter handleStatus={(e) => { setStatus(e.target.value) }} handleName={(e) => { setName(e.target.value) }} nameValue={name} statusValue={status} />}
            <CommonTable rows={rows} columns={columns} handlePageChange={handlePageChange} page={page} count={adminData?.pagination?.totalPages} handleView={(data) => console.log(data)} handleEdit={(data) => console.log(data)} handleDelete={(data) => console.log(data)} />
        </div>
    )
}

export default AdminUserList