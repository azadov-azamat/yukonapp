import { IPlanModel, VariableInitialProps } from './../../interface/redux/variable.interface';
// globalLoadingSlice.js
import { http } from '@/config/api';
import { deserialize, deserializePlan } from '@/utils/general';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export const getPlans = createAsyncThunk('variable/getPlans', async (_, {rejectWithValue}) => {
    try {
        const response = await http.get(`/plans`)
        if (response.data === null) return rejectWithValue(response?.data)
        return response.data;
    } catch (error) {
        return rejectWithValue(error)
    }
});

export const getPlanById = createAsyncThunk('variable/getPlanById', async (id: number, { rejectWithValue }) => {
    try {
        const response = await http.get(`/plans/${id}`);
        return deserializePlan(await deserialize(response.data));
    } catch (error) {
        return rejectWithValue(error);
    }
});

const initialState: VariableInitialProps = {
    plans: [], // Barcha rejalar ro'yxati
    selectedPlan: null, // Tanlangan reja
    loading: false,
    phoneLoading: false,
    activeLoaders: 0, // Nechta process ishlayotganini hisoblash uchun
}

const variableSlice = createSlice({
  name: 'variable',
  initialState,
  reducers: {
    startLoading(state) {
      state.loading = true;
    },
    stopLoading(state) {
      state.loading = false;
    },
    phoneLoad(state) {
        state.phoneLoading = !state.phoneLoading
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getPlans.pending, (state) => {
        state.loading = true;
    });
    builder.addCase(getPlans.fulfilled, (state, action) => {
        state.plans = action.payload;
        state.loading = false;
    });
    builder.addCase(getPlans.rejected, (state, action) => {
        state.loading = false;
    });

    // ID bo'yicha rejani yuklash uchun case'lar
    builder.addCase(getPlanById.pending, (state) => {
        state.loading = true;
    });
    builder.addCase(getPlanById.fulfilled, (state, action) => {
        state.selectedPlan = action.payload;
        state.loading = false;
    });
    builder.addCase(getPlanById.rejected, (state, action) => {
        state.loading = false;
    });
  }
});

export const { startLoading, stopLoading, phoneLoad } = variableSlice.actions;

export default variableSlice.reducer;