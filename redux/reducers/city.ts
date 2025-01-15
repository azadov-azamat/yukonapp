import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { http } from '@/config/api';
import { CityInitialProps, extractCityProps } from '@/interface/redux/variable.interface';

// Define the action to fetch city data from the API based on search text.
export const getExtractCity = createAsyncThunk('city/extractCity', async (data: any, { rejectWithValue }) => {
    try {
      const response = await http.get(`cities/extract`, {
        params: data
      });
      return response.data;  // Return the data to be used in the reducer
    } catch (error) {
      return rejectWithValue(error);  // Return the error if request fails
    }
  }
);

// Define the action to fetch city data from the API based on search text.
export const locationSearch = createAsyncThunk('city/locationSearch', async (text: string, { rejectWithValue }) => {
    try {
      const response = await http.get(`cities/location-search/${text}`);
      return response.data;  // Return the data to be used in the reducer
    } catch (error) {
      return rejectWithValue(error);  // Return the error if request fails
    }
  }
);

// Initial state of the city reducer
const initialState: CityInitialProps = {
  cities: [], // To store the fetched cities
  extractCity: null,
  loading: false, // To track the loading state
};

const citySlice = createSlice({
  name: 'city',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getExtractCity.pending, (state) => {
      state.loading = true;  // Set loading to true when request starts
    });
    builder.addCase(getExtractCity.fulfilled, (state, action) => {
      state.extractCity = action.payload;  // Update the cities with the response data
      state.loading = false;  // Set loading to false once the request completes
    });
    builder.addCase(getExtractCity.rejected, (state, action) => {
      state.loading = false;  // Set loading to false on failure
    });
  },
});

// Export the reducer to be used in the store
export default citySlice.reducer;
