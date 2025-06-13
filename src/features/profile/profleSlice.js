import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import {ProfileView,ProfileEdit,ProfileUpload,ProfilePasswordUpdate,ProfileDelete} from './profileApi'

export const ProfileViewThunk = createAsyncThunk('get/profile/view',ProfileView);
export const ProfileUploadThunk = createAsyncThunk('put/profile/edit/upload',ProfileUpload);
export const ProfileEditThunk = createAsyncThunk('patch/profile/edit',ProfileEdit);
export const ProfilePasswordUpdateThunk = createAsyncThunk('patch/profile/edit/password',ProfilePasswordUpdate);
export const ProfileDeleteThunk = createAsyncThunk('delete/profile/delete',ProfileDelete);

const profileSlice = createSlice({
  name: "profile",
  initialState: {
    user: null,
    loading: false,
    error: null,
    message: null,
  },
  reducers:{},
  extraReducers: (builder) => {
    builder
      .addCase(ProfileViewThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(ProfileViewThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.profile;
        state.error = null;
      })
      .addCase(ProfileViewThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(ProfileEditThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(ProfileEditThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        state.error = null;
      })
      .addCase(ProfileEditThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(ProfileUploadThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(ProfileUploadThunk.fulfilled, (state, action) => {
        state.loading = false;
        if (state.user) {
          state.user.photoUrl = action.payload.image.url;
        }
        state.message = action.payload.message;
        state.error = null;
      })
      .addCase(ProfileUploadThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })


      .addCase(ProfilePasswordUpdateThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(ProfilePasswordUpdateThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        state.error = null;
      })
      .addCase(ProfilePasswordUpdateThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(ProfileDeleteThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(ProfileDeleteThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = null;
        state.message = action.payload.message;
        state.error = null;
      })
      .addCase(ProfileDeleteThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});
export default profileSlice.reducer;