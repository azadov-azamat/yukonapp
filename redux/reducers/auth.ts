import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";

import {http} from "@/config/api";
import {authenticate, deserialize, deserializeUser} from "../../utils/general";
import { AuthInitialProps} from "@/interface/redux/auth.interface";
import Toast from 'react-native-toast-message';
import { IUserModel } from "@/interface/redux/user.interface";
import { UserSerializer } from "@/serializers";
import UserModel from "@/models/user";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const getUserMe = createAsyncThunk('auth/getUserMe', async (id: number, {rejectWithValue}) => {
    try {
        const response = await http.get(`/users/${id}`)
        if (response.data === null) return rejectWithValue(response?.data)
        return deserializeUser(await deserialize(response.data))
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

export const updateUser = createAsyncThunk('auth/updateUser', async (data: Partial<IUserModel>, { rejectWithValue }) => {
    try {
        const response = await http.patch(`/users/${data.id}`, UserSerializer.serialize(data));
        return deserializeUser(await deserialize(response.data));
    } catch (error) {
        return rejectWithValue(error);
    }
});

const initialState: AuthInitialProps = {
    user: null,
    auth: null,
    loading: false
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action) => {            
            state.user = action.payload
        },
        updateUserSubscriptionModal: (state) => {
            if (state.user) {
                state.user.isSubscriptionModal = !state.user.isSubscriptionModal;
            }
            console.log("state.user", state.user); 
        },
        logout: (state) => {
            state.user = null;
            state.auth = null;
            AsyncStorage.clear();
        }
    },
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
            Toast.show({
                type: 'error',
                text1: 'Tizimda nosozlik!',
                text2: `${action.payload}`,
            });
        })
        builder.addCase(getUserMe.fulfilled, (state: AuthInitialProps, action) => {
            state.loading = false
            state.user = action.payload
        })
        builder.addCase(getUserMe.rejected, (state: AuthInitialProps, action) => {
            state.loading = false
            console.error(action.payload)
        })

          // Update User
        builder.addCase(updateUser.fulfilled, (state, action) => {
            state.user = action.payload;
            state.loading = false;
        });
        builder.addCase(updateUser.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(updateUser.rejected, (state) => {
            state.loading = false;
        });

    }
})

export const { setUser, updateUserSubscriptionModal, logout } = authSlice.actions;
export default authSlice.reducer