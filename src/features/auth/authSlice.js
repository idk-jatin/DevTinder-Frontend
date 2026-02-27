import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import {Signup,Login,Logout} from './authApi'

export const SignupThunk = createAsyncThunk('post/signup',Signup);
export const LoginThunk = createAsyncThunk('post/login',Login);
export const LogoutThunk = createAsyncThunk('post/logout',Logout);

const authSlice = createSlice({
    name : 'auth',
    initialState:{
        user:null,
        loading : false,
        error : null
    },
    reducers: {
        updateUser: (state, action) => {
            if (state.user) {
                state.user = { ...state.user, ...action.payload };
            } else {
                state.user = action.payload;
            }
        }
    },
    extraReducers: (builder)=>{
        builder
        .addCase(SignupThunk.pending,(state)=>{
            state.loading = true;
            state.error = null;
        })
        .addCase(SignupThunk.fulfilled,(state,action)=>{
            state.loading = false;
            state.error = null;
        })
        .addCase(SignupThunk.rejected,(state,action)=>{
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(LoginThunk.pending,(state)=>{
            state.loading = true;
            state.error = null;
        })
        .addCase(LoginThunk.fulfilled,(state,action)=>{
            state.user = action.payload.user;
            state.loading = false;
            state.error = null;
        })
        .addCase(LoginThunk.rejected,(state,action)=>{
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(LogoutThunk.pending,(state)=>{
            state.loading = true;
            state.error = null;
        })
        .addCase(LogoutThunk.fulfilled,(state)=>{
            state.user = null;
            state.loading = false;
            state.error = null;
        })
        .addCase(LogoutThunk.rejected,(state,action)=>{
            state.loading = false;
            state.error = action.payload;
        })

    }
})

export const { updateUser } = authSlice.actions;
export default authSlice.reducer;