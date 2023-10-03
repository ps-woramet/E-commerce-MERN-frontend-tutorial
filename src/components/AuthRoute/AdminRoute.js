import React, { useEffect } from 'react'
import { getUserProfileAction } from '../../redux/slices/users/usersSlice';
import { useDispatch, useSelector } from 'react-redux';
import AdminOnly from '../NotAuthorised/AdminOnly.js'

const AdminRoute = ({children}) => {
    //dispatch
    const dispatch = useDispatch();
    useEffect(()=>{
        dispatch(getUserProfileAction())
    }, [dispatch])
    //get user from store
    const {userAuth} = useSelector((state) => state?.users);
    console.log(userAuth);
    const isAdmin = userAuth.userInfo?.userFound?.isAdmin ? true : false
    console.log(isAdmin);
    if(!isAdmin){
        return <AdminOnly/>
    }
    return (
        <>{children}</>
    )
}

export default AdminRoute;