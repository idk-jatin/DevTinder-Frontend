import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import {Feed} from './feedApi'

export const FeedThunk = createAsyncThunk('get/feed',Feed);

const feedSlice = createSlice({
    name : 'feed',
    initialState:{
        users:[],
        loading : false,
        error : null
    },
    reducers: {},
    extraReducers: (builder)=>{
        builder
        .addCase(FeedThunk.pending,(state)=>{
            state.loading = true;
            state.error = null;
        })
        .addCase(FeedThunk.fulfilled,(state,action)=>{
            state.users = action.payload.Feed
            state.loading = false;
            state.error = null;
        })
        .addCase(FeedThunk.rejected,(state,action)=>{
            state.loading = false;
            state.error = action.payload;
        })
      
    }
})

export default feedSlice.reducer;