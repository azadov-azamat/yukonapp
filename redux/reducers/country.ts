import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { http } from '@/config/api';
import { CountryInitialProps, ICountryModel } from '@/interface/redux/variable.interface';
import { deserialize } from '@/utils/general';
import { deserializeCountry } from '@/utils/deserializer';

export const getCountryByIds = createAsyncThunk('country/getCountryByIds', async ({ids}: { ids: string }, { rejectWithValue }) => {
  try {
    const response = await http.get(`countries/ids`, {
      params: {
        countryIds: ids
      }
    });
    let deserializedData = await deserialize(response.data)
    deserializedData.map((item: ICountryModel) => deserializeCountry(item));
    return deserializedData;
  } catch (error) {
    return rejectWithValue(error);  // Return the error if request fails
  }
}
);

export const fetchCountries = createAsyncThunk('countries/fetchCountries', async (_, { rejectWithValue }) => {
    try {
      const response = await http.get('/');
      let deserializedData = await deserialize(response.data)
			deserializedData.map((item: ICountryModel) => deserializeCountry(item));
			return deserializedData;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Initial state of the city reducer
const initialState: CountryInitialProps = {
  countries: [],
  allCountries: [],
	loading: false,
};

const citySlice = createSlice({
  name: 'country',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
		builder
      .addCase(fetchCountries.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCountries.fulfilled, (state, action) => {
        state.loading = false;
        state.allCountries = action.payload;
      })
      .addCase(fetchCountries.rejected, (state, action) => {
        state.loading = false;
        state.allCountries = [];
      })
    	.addCase(getCountryByIds.pending, (state) => {
      	state.loading = true;
    	})
    	.addCase(getCountryByIds.fulfilled, (state, action) => {
				state.countries = action.payload;
				state.loading = false;
    	})
    	.addCase(getCountryByIds.rejected, (state, action) => {
				state.loading = false;
				state.countries = [];
    	});
  },
});

// Export the reducer to be used in the store
export default citySlice.reducer;
