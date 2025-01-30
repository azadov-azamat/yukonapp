import { http } from '@/config/api';
import { CardInitialProps } from '@/interface/redux/card.interface';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Toast from 'react-native-toast-message';

// API: cards.create
export const createCard = createAsyncThunk('variable/createCard', async (data:{ number: string, expire: string }, { rejectWithValue }) => {
    try {
      const response = await http.post('/cards', data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// API: cards.get_verify_code
export const getVerifyToken = createAsyncThunk('variable/getVerifyToken', async (data:{token: string}, { rejectWithValue }) => {
    try {
      const response = await http.post('/cards/verify-code', data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// API: cards.verify
export const verifyCard = createAsyncThunk('variable/verifyCard', async (data: { token: string, code: string }, { rejectWithValue }) => {
    try {
      const response = await http.post('/cards/verify', data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// API: cards.check
export const checkCard = createAsyncThunk('variable/checkCard', async (data:{ token: string }, { rejectWithValue }) => {
    try {
      const response = await http.post('/cards/check', data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// API: cards.remove
export const removeCard = createAsyncThunk('variable/removeCard', async (data: { token: string }, { rejectWithValue }) => {
    try {
        const response = await http.post('/cards/remove', data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Slice initial state
const initialState: CardInitialProps = {
  card: null,
  verifyData: null,
  loading: false,
};

// Redux slice
const variableSlice = createSlice({
  name: 'variable',
  initialState,
  reducers: {
    resetState(state) {
      state.card = null;
      state.verifyData = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    // createCard
    builder.addCase(createCard.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createCard.fulfilled, (state, action) => {
      state.loading = false;
      state.card = action.payload?.result?.card;
    });
    builder.addCase(createCard.rejected, (state, action) => {
      state.loading = false;
      Toast.show({
        type: 'error',
        text1: `${action.payload}`,
      });
    //   state.error = action.payload;
    });

    // getVerifyCode
    builder.addCase(getVerifyToken.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getVerifyToken.fulfilled, (state, action) => {
      state.loading = false;
      state.verifyData = action.payload?.result;
    });
    builder.addCase(getVerifyToken.rejected, (state, action) => {
      state.loading = false;
      Toast.show({
        type: 'error',
        text1: `${action.payload}`,
      });
    });

    // verifyCard
    builder.addCase(verifyCard.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(verifyCard.fulfilled, (state, action) => {
      state.loading = false;
      state.card = action.payload;
    });
    builder.addCase(verifyCard.rejected, (state, action) => {
      state.loading = false;
      Toast.show({
        type: 'error',
        text1: `${action.payload}`,
      });
    //   state.error = action.payload;
    });

    // checkCard
    builder.addCase(checkCard.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(checkCard.fulfilled, (state, action) => {
      state.loading = false;
    });
    builder.addCase(checkCard.rejected, (state, action) => {
      state.loading = false;
      Toast.show({
        type: 'error',
        text1: `${action.payload}`,
      });
    //   state.error = action.payload;
    });

    // removeCard
    builder.addCase(removeCard.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(removeCard.fulfilled, (state) => {
      state.loading = false;
      state.card = null;
    });
    builder.addCase(removeCard.rejected, (state, action) => {
      state.loading = false;
      Toast.show({
        type: 'error',
        text1: `${action.payload}`,
      });
    //   state.error = action.payload;
    });
  },
});

export const { resetState } = variableSlice.actions;

export default variableSlice.reducer;
