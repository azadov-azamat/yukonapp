// globalLoadingSlice.js
import { createSlice } from '@reduxjs/toolkit';

const variableSlice = createSlice({
  name: 'variable',
  initialState: {
    loading: false,
    activeLoaders: 0, // Nechta process ishlayotganini hisoblash uchun
  },
  reducers: {
    startLoading(state) {
    //   state.activeLoaders += 1;
      state.loading = true;
    },
    stopLoading(state) {
    //   state.activeLoaders -= 1;
    //   if (state.activeLoaders <= 0) {
    //     state.loading = false;
    //     state.activeLoaders = 0;
    //   }
      state.loading = false;
    },
  },
});

export const { startLoading, stopLoading } = variableSlice.actions;

export default variableSlice.reducer;