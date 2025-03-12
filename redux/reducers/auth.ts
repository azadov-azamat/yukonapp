import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";

import {http} from "@/config/api";
import { deserializeUser } from "../../utils/deserializer";
import { authenticate, deserialize } from "../../utils/general";
import { AuthInitialProps} from "@/interface/redux/auth.interface";
import Toast from 'react-native-toast-message';
import { IUserModel } from "@/interface/redux/user.interface";
import { UserSerializer } from "@/serializers";
import AsyncStorage from "@react-native-async-storage/async-storage";
import UserModel from "@/models/user";

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

export const createUser = createAsyncThunk('auth/createUser', async (data: UserModel, { rejectWithValue }) => {
    try {
        const response = await http.post(`/users`, UserSerializer.serialize(data));
        return deserializeUser(await deserialize(response.data));
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const resetPassword = createAsyncThunk('auth/resetPassword', async (data: {phone: string, smsToken: string, password: string}, { rejectWithValue }) => {
    try {
        const response = await http.post(`/auth/reset-password`, data);
        return response.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const uniquePhone = createAsyncThunk('auth/uniquePhone', async (data: {phone: string}, { rejectWithValue }) => {
    try {
        const response = await http.get(`/users/unique/phone`, {params: data});
        return response.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const sendSmsCode = createAsyncThunk('auth/sendSmsCode', async (data: {phone: string, action: string}, { rejectWithValue }) => {
    try {
        const response = await http.post(`/auth/send-token`, data);
        return response.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

const initialState: AuthInitialProps = {
    user: null,
    auth: null,
    uniquePhoneExists: false,
    successSendSms: false,
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
        },
        logout: (state) => {
            state.user = null;
            state.auth = null;
            AsyncStorage.clear();
        }
    },
    extraReducers: (builder) => {
        // Login
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

        // Get User Me
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

        // Unique Phone
        builder.addCase(uniquePhone.fulfilled, (state, action) => {
            state.uniquePhoneExists = action.payload?.exist;
            state.loading = false;
        });
        builder.addCase(uniquePhone.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(uniquePhone.rejected, (state) => {
            state.loading = false;
        });

        // Send SMS Code
        builder.addCase(sendSmsCode.fulfilled, (state, action) => {
            state.loading = false;
            state.successSendSms = true;
        });
        builder.addCase(sendSmsCode.pending, (state) => {
            state.loading = true;
            state.successSendSms = false;
        });
        builder.addCase(sendSmsCode.rejected, (state) => {
            state.loading = false;
            state.successSendSms = false;
        });

        // Create User
        builder.addCase(createUser.fulfilled, (state, action) => {
            state.loading = false;
            console.log(action.payload);
            // state.user = action.payload;
        });
        builder.addCase(createUser.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(createUser.rejected, (state) => {
            state.loading = false;
        });

        // Reset Password
        builder.addCase(resetPassword.fulfilled, (state, action) => {
            state.loading = false;
        });
        builder.addCase(resetPassword.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(resetPassword.rejected, (state) => {
            state.loading = false;
        });
    }
})

export const { setUser, updateUserSubscriptionModal, logout } = authSlice.actions;
export default authSlice.reducer
