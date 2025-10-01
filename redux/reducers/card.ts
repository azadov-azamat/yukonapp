import { http } from '@/config/api';
import { CardInitialProps } from '@/interface/redux/card.interface';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

// API: cards.create
export const createCard = createAsyncThunk('card/createCard', async (data:{ number: string, expire: string }, { rejectWithValue }) => {
    try {
      const response = await http.post('/cards', data, {
        headers: {
                'X-Track': '1',
                'X-Track-Event': 'create_card',
                'X-Track-Message': 'Api Create card',
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// API: cards.get_verify_code
export const getVerifyToken = createAsyncThunk('card/getVerifyToken', async (data:{token: string}, { rejectWithValue }) => {
    try {
      const response = await http.post('/cards/verify-code', data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// API: cards.verify
export const verifyCard = createAsyncThunk('card/verifyCard', async (data: { token: string, code: string }, { rejectWithValue }) => {
    try {
      const response = await http.post('/cards/verify', data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// API: cards.check
export const checkCard = createAsyncThunk('card/checkCard', async (data:{ token: string }, { rejectWithValue }) => {
    try {
      const response = await http.post('/cards/check', data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// API: cards.remove
export const removeCard = createAsyncThunk('card/removeCard', async (data: { token: string }, { rejectWithValue }) => {
    try {
        const response = await http.post('/cards/remove', data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// API: cards.create_receipt
export const createReceipts = createAsyncThunk('card/createReceipts', async (data: { planId: string }, { rejectWithValue }) => {
    try {
        const response = await http.post('/receipts', data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// API: cards.pay_receipt
export const payReceipts = createAsyncThunk('card/payReceipts', async (data: { checkId: string; token: string; paymentType: string }, { rejectWithValue }) => {
    try {
        const response = await http.post('/receipts/pay', data);
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
  receipt: null,
  loading: false,
};

// Redux slice
const cardSlice = createSlice({
  name: 'card',
  initialState,
  reducers: {
    resetState(state) {
      state.card = null;
      state.verifyData = null;
      state.receipt = null;
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
    });

    // verifyCard
    builder.addCase(verifyCard.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(verifyCard.fulfilled, (state, action) => {
      state.loading = false;
      if (action.payload?.result?.card) {
        state.card = action.payload?.result?.card;
      }
    });
    builder.addCase(verifyCard.rejected, (state, action) => {
      state.loading = false;
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
    });

    // createReceipts
    builder.addCase(createReceipts.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createReceipts.fulfilled, (state, action) => {
      state.loading = false;
      state.receipt = action.payload?.result?.receipt;
    });
    builder.addCase(createReceipts.rejected, (state, action) => {
      state.loading = false;
      state.receipt = null;
    });

    // payReceipts
    builder.addCase(payReceipts.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(payReceipts.fulfilled, (state) => {
      state.loading = false;
      // state.card = null;
    });
    builder.addCase(payReceipts.rejected, (state, action) => {
      state.loading = false;
    });
  },
});

export const { resetState } = cardSlice.actions;

export default cardSlice.reducer;
