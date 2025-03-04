import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { http } from '@/config/api';
import { CityInitialProps, extractCityProps, ICityModel } from '@/interface/redux/variable.interface';
import { startLoading, stopLoading } from './variable';
import { deserialize } from '@/utils/general';
import { deserializeCity } from '@/utils/deserializer';

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
    return response.data.data
  } catch (error) {
    return rejectWithValue(error);  // Return the error if request fails
  }
});

export const getCityByIds = createAsyncThunk('city/getCityByIds', async ({ids}: {ids: string, vehicleId: string}, { rejectWithValue }) => {
  try {
    const response = await http.get(`cities/ids`, {
      params: {
        cityIds: ids
      }
    });
    let deserializedData = await deserialize(response.data)
    deserializedData.map((item: ICityModel) => deserializeCity(item));
    return deserializedData;
  } catch (error) {
    return rejectWithValue(error);  // Return the error if request fails
  }
});

export const getCities = createAsyncThunk('city/getCities', async (query: any, { rejectWithValue }) => {
  try {
    const response = await http.get('cities', { params: query });
    let deserializedData = await deserialize(response.data)
    deserializedData = deserializedData.map((item: ICityModel) => deserializeCity(item));

    return deserializedData;
  } catch (error) {
    return rejectWithValue(error);
  }
});


export const getCountryCities = createAsyncThunk('city/getCountryCities', async (query: any, { rejectWithValue }) => {
  try {
    const response = await http.get('cities', { params: query });
    let deserializedData = await deserialize(response.data)
    deserializedData = deserializedData.map((item: ICityModel) => deserializeCity(item));

    return deserializedData;
  } catch (error) {
    return rejectWithValue(error);
  }
});

// Initial state of the city reducer
const initialState: CityInitialProps = {
  cities: [], // To store the fetched cities
  extractCity: null,
  vehicleCities: [],
  countryCities: [],
  loading: false, // To track the loading state
};

const citySlice = createSlice({
  name: 'city',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getExtractCity.pending, (state) => {
      startLoading();
    });
    builder.addCase(getExtractCity.fulfilled, (state, action) => {
      state.extractCity = action.payload;  // Update the cities with the response data
      stopLoading();  // Set loading to false once the request completes
    });
    builder.addCase(getExtractCity.rejected, (state, action) => {
      stopLoading();  // Set loading to false on failure
    });

    builder.addCase(locationSearch.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(locationSearch.fulfilled, (state, action) => {
      state.cities = action.payload;
      state.loading = false;
    });
    builder.addCase(locationSearch.rejected, (state, action) => {
      state.loading = false;
      state.cities = [];
    });

    builder.addCase(getCityByIds.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getCityByIds.fulfilled, (state, action) => {
      state.vehicleCities[action.meta?.arg?.vehicleId as any] = action.payload;
      state.loading = false;
    });
    builder.addCase(getCityByIds.rejected, (state, action) => {
      state.loading = false;
      state.vehicleCities = [];
    });

		builder.addCase(getCities.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getCities.fulfilled, (state, action) => {
			state.cities = action.payload;
      state.loading = false;
    });
    builder.addCase(getCities.rejected, (state, action) => {
      state.loading = false;
      state.cities = [];
    });

		builder.addCase(getCountryCities.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getCountryCities.fulfilled, (state, action) => {
			state.countryCities[action.meta?.arg?.countryId as any] = action.payload;
      state.loading = false;
    });
    builder.addCase(getCountryCities.rejected, (state, action) => {
      state.loading = false;
      state.countryCities = {};
    });
  },
});

// Export the reducer to be used in the store
export default citySlice.reducer;
