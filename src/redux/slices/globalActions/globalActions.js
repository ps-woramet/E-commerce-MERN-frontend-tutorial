const {createAsyncThunk} = require('@reduxjs/toolkit');

//reset error action
export const resetErrAction = createAsyncThunk('resetErr-Action', ()=>{
    //sent {} to payload
    return {};
});

//reset success action
export const resetSuccessAction = createAsyncThunk('resetSuccess-Action', ()=>{
    //sent {} to payload
    return {};
});