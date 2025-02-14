import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: null,
  freelancer: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.token = action.payload.token;
      state.freelancer = action.payload.freelancer;
      sessionStorage.setItem("token", action.payload.token);
    },
    logout: (state) => {
      state.token = null;
      state.freelancer = null;
      sessionStorage.removeItem("token");
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentToken = (state) => state.auth.token;
export const selectCurrentFreelancer = (state) => state.auth.freelancer;
