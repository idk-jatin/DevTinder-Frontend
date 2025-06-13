import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice'
import feedReducer from '../features/feed/feedSlice'
import profileReducer from '../features/profile/profleSlice'
const store = configureStore({
    reducer: {
       auth: authReducer,
       feed : feedReducer,
       profile: profileReducer
    },
});

export default store;