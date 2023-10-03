import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axios from 'axios';
import baseURL from '../../../utils/baseURL';
import { resetErrAction, resetSuccessAction } from '../globalActions/globalActions';

//initalState
const initialState = {
    brands: [],
    brand: {},
    loading: false,
    error: null,
    isAdded: false,
    isUpdated: false,
    isDelete: false,
};

//fetch brands action
export const fetchBrandsAction = createAsyncThunk('brands/fetch All', async(payload, {rejectWithValue, getState, dispatch}) => {
    try{
        const {data} = await axios.get(`${baseURL}/brands`);
        return data
    }catch(error){
        return rejectWithValue(error?.response?.data);
    }
});

//create brand action
export const createBrandAction = createAsyncThunk('brand/create', async(name, {rejectWithValue, getState, dispatch}) => {
    console.log('this is action brand');
    console.log(name);
    try{
        //Token - authenticated
        const token = getState().users?.userAuth?.userInfo?.token;
        const config = {
            headers : {
                Authorization: `Bearer ${token}`,
            }
        }
        //Images
        const {data} = await axios.post(`${baseURL}/brands`, {
            name,
        }, config);
        return data
    }catch(error){
        return rejectWithValue(error?.response?.data);
    }
});

//slice
const brandsSlice = createSlice({
    name: 'brands',
    initialState,
    extraReducers: (builder) => {
        //create
        builder.addCase(createBrandAction.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(createBrandAction.fulfilled, (state, action) => {
            state.loading = false;
            state.brand = action.payload;
            state.isAdded = true;
        });
        builder.addCase(createBrandAction.rejected, (state, action) => {
            state.loading = false;
            state.brand = null;
            state.isAdded = false;
            state.error = action.payload;
        });

        //fetch
        builder.addCase(fetchBrandsAction.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(fetchBrandsAction.fulfilled, (state, action) => {
            state.loading = false;
            state.brands = action.payload;
        });
        builder.addCase(fetchBrandsAction.rejected, (state, action) => {
            state.loading = false;
            state.brands = null;
            state.error = action.payload;
        });

        //reset error action
        builder.addCase(resetErrAction.pending, (state, action) => {
            state.isAdded = false;
            state.error = null;
        });

        //reset success action
        builder.addCase(resetSuccessAction.pending, (state, action) => {
            state.isAdded = false;
            state.error = null;
        });
    },
});

//generate the reducer
const brandsReducer = brandsSlice.reducer;

export default brandsReducer;