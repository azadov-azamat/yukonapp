import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";

import {http} from "@/config/api";
import {authenticate, deserialize} from "../../utils/general";
import { AuthInitialProps} from "@/interface/redux/auth.interface";
import { UrlParamsDataProps } from "@/interface/search/search.interface";

export const getTopSearches = createAsyncThunk('load/getTopSearches', async (data: UrlParamsDataProps, {rejectWithValue}) => {
    try {
        const response = await http.get(`/loads/top-searches`, {
            params: data
        })
        if (response.data === null) return rejectWithValue(response?.data)
        return await deserialize(response.data)
    } catch (error) {
        return rejectWithValue(error)
    }
});

export const login = createAsyncThunk('auth/login', async (data: {phone: string, password: string}, {rejectWithValue}) => {
    try {
        const response = await http.post(`/auth/login`, data)
        if (response.data === null) return rejectWithValue(response?.data)
        return response.data
    } catch (error) {
        return rejectWithValue(error)
    }
});

const initialState: AuthInitialProps = {
    user: null,
    auth: null,
    loading: false
}

const reducers = {}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: reducers,
    extraReducers: (builder) => {
        builder.addCase(login.fulfilled, (state: AuthInitialProps, action) => {
            state.loading = false;
            state.auth = action.payload;
            authenticate(action.payload);
        })
        builder.addCase(login.pending, (state: AuthInitialProps) => {
            state.loading = true;
        })
        builder.addCase(login.rejected, (state: AuthInitialProps, action) => {
            state.loading = false;
            console.error(action);
        })
        builder.addCase(getUserMe.fulfilled, (state: AuthInitialProps, action) => {
            state.loading = false
            state.user = action.payload
        })
        builder.addCase(getUserMe.rejected, (state: AuthInitialProps, action) => {
            state.loading = false
            console.error(action.payload)
        })
    }
})

export const {} = authSlice.actions;
export default authSlice.reducer