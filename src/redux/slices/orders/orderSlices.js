import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axios from 'axios';
import baseURL from '../../../utils/baseURL';
import { resetErrAction, resetSuccessAction } from '../globalActions/globalActions';

//initalState
const initialState = {
    orders: [],
    order: null,
    loading: false,
    error: null,
    isAdded: false,
    isUpdated: false,
    stats: null,
};

//create order action
export const placeOrderAction = createAsyncThunk(
    "order/place-order",
    async (payload, { rejectWithValue, getState, dispatch }) => {
      try {
        const {orderItems, shippingAddress, totalPrice} = payload;
        //token
        const token = getState()?.users?.userAuth?.userInfo?.token;
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        //request
        const { data } = await axios.post(
          `${baseURL}/orders`,
          {orderItems, shippingAddress, totalPrice,},
          config
        );
        return window.open(data?.url)
      } catch (error) {
        return rejectWithValue(error?.response?.data);
      }
    }
);

//fetch order action
export const fetchOrderAction = createAsyncThunk('order/details', async(productId, {rejectWithValue, getState, dispatch}) => {
  try{
    const token = getState()?.usres?.userAuth?.userInfo?.token;
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const {data} = await axios.get(
      `${baseURL}/orders/${productId}`,
      config
    );
    return data;
  }catch(error){
    return rejectWithValue(error?.response?.data);
  }
})

//fetch all orders action
export const fetchOrdersAction = createAsyncThunk(
  "orders/list",
  async (payload, { rejectWithValue, getState, dispatch }) => {
    try {
      //token
      const token = getState()?.users?.userAuth?.userInfo?.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      //request
      const { data } = await axios.get(`${baseURL}/orders`,config);

      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

//Get orders states
export const OrdersStatsAction = createAsyncThunk(
  "orders/statistics",
  async (payload, { rejectWithValue, getState, dispatch }) => {
    try {
      //token
      const token = getState()?.users?.userAuth?.userInfo?.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      //request
      const { data } = await axios.get(`${baseURL}/orders/sales/stats`,config);

      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

//update order action
export const updateOrderAction = createAsyncThunk(
  "order/update-order",
  async (payload, { rejectWithValue, getState, dispatch }) => {
    try {
      const {status, id, } = payload;
      //token
      const token = getState()?.users?.userAuth?.userInfo?.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      //request
      const { data } = await axios.put(
        `${baseURL}/orders/update/${id}`,
        {status},
        config
      );
      return data
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

//slice
const orderSlice = createSlice({
    name: 'orders',
    initialState,
    extraReducers: (builder) => {
        //create
        builder.addCase(placeOrderAction.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(placeOrderAction.fulfilled, (state, action) => {
            state.loading = false;
            state.order = action.payload;
            state.isAdded = true;
        });
        builder.addCase(placeOrderAction.rejected, (state, action) => {
            state.loading = false;
            state.order = null;
            state.isAdded = false;
            state.error = action.payload;
        });

        //fetch single
        builder.addCase(fetchOrderAction.pending, (state) => {
          state.loading = true;
        });
        builder.addCase(fetchOrderAction.fulfilled, (state, action) => {
            state.loading = false;
            state.order = action.payload;
        });
        builder.addCase(fetchOrderAction.rejected, (state, action) => {
            state.loading = false;
            state.order = null;
            state.error = action.payload;
        });

        //fetch all
        builder.addCase(fetchOrdersAction.pending, (state) => {
          state.loading = true;
        });
        builder.addCase(fetchOrdersAction.fulfilled, (state, action) => {
            state.loading = false;
            state.orders = action.payload;
        });
        builder.addCase(fetchOrdersAction.rejected, (state, action) => {
            state.loading = false;
            state.orders = null;
            state.error = action.payload;
        });

        //stats
            builder.addCase(OrdersStatsAction.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(OrdersStatsAction.fulfilled, (state, action) => {
            state.loading = false;
            state.stats = action.payload;
        });
        builder.addCase(OrdersStatsAction.rejected, (state, action) => {
            state.loading = false;
            state.stats = null;
            state.error = action.payload;
        });

        //update order
        builder.addCase(updateOrderAction.pending, (state) => {
          state.loading = true;
        });
        builder.addCase(updateOrderAction.fulfilled, (state, action) => {
            state.loading = false;
            state.order = action.payload;
        });
        builder.addCase(updateOrderAction.rejected, (state, action) => {
            state.loading = false;
            state.order = null;
            state.error = action.payload;
        });

        //reset success
          builder.addCase(resetSuccessAction.pending, (state, action) => {
          state.isAdded = false;
        })
        //reset error
        builder.addCase(resetErrAction.pending, (state, action) => {
          state.error = null;
        });
    },
});

//generate the reducer
const ordersReducer = orderSlice.reducer;

export default ordersReducer;