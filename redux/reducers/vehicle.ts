import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { http } from "@/config/api";
import { VehicleInitialProps, IVehicleModel } from "@/interface/redux/vehicle.interface";
import { deserialize } from "@/utils/general";
import { deserializeVehicle } from "@/utils/deserializer";
import { VehicleSerializer } from "@/serializers";

// Fetch Vehicle Countries
export const getVehicleCountries = createAsyncThunk('vehicle/getVehicleCountries', async (_, { rejectWithValue }) => {
    try {
        const response = await http.get('/vehicles/countries');
        return response.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

// Fetch Vehicle Country cities
export const getVehicleCountryCities = createAsyncThunk('vehicle/getVehicleCountryCities', async (id: number, { rejectWithValue }) => {
    try {
        const response = await http.get(`/vehicles/country/${id}/cities`);
        return response.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

// Fetch Vehicle by ID
export const getVehicleById = createAsyncThunk('vehicle/getVehicleById', async (id: string, { rejectWithValue }) => {
    try {
        const response = await http.get(`/vehicles/${id}`);
        return deserializeVehicle(await deserialize(response.data));
    } catch (error) {
        return rejectWithValue(error);
    }
});

// Patch Vehicle by ID
export const updateVehicle = createAsyncThunk('vehicle/updateVehicle', async (data: Partial<IVehicleModel>, { rejectWithValue }) => {
    try {
        const response = await http.patch(`/vehicles/${data.id}`, VehicleSerializer.serialize(data));
        let vehicle = await deserialize(response.data)
        return deserializeVehicle(vehicle);
    } catch (error) {
        return rejectWithValue(error);
    }
});

// Create a New Vehicle
export const createVehicle = createAsyncThunk('vehicle/createVehicle', async (data: IVehicleModel, { rejectWithValue }) => {
    try {
        const response = await http.post('/vehicles', data);
        return deserializeVehicle(await deserialize(response.data));
    } catch (error) {
        return rejectWithValue(error);
    }
});

// Fetch Vehicles (Search)
export const searchVehicles = createAsyncThunk('vehicle/searchVehicles', async (query: any, { rejectWithValue }) => {
    try {
        const response = await http.get('/vehicles/search', { params: query });
        let deserializedData = await deserialize(response.data.data)
        deserializedData.map((item: IVehicleModel) => deserializeVehicle(item));
    
        return {
                vehicles: deserializedData, 
                pagination: response.data?.data.meta.pagination,
                stats: response.data.stats
            };
    } catch (error) {
        return rejectWithValue(error);
    }
});

const initialState: VehicleInitialProps = {
    vehicles: [],
    countries: [],
    activeCountries: [],
    activeCities: [],
    vehicle: null,
    pagination: null,
    stats: null,
    loading: false,
};

export const vehicleSlice = createSlice({
    name: 'vehicle',
    initialState,
    reducers: {
        clearVehicles: (state) => {
            state.vehicles = [];
            state.pagination = null;
            state.stats = null;
            state.loading = false;
        },
        clearVehicle: (state) => {
            state.vehicle = null;
        },
        setVehicle: (state, action) => {
            state.vehicle = deserializeVehicle(action.payload);
        }
    },
    extraReducers: (builder) => {
           // Search Loads
           builder.addCase(searchVehicles.fulfilled, (state, action) => {
            state.vehicles = action.payload?.vehicles;
            state.pagination = action.payload.pagination;
            state.stats = action.payload.stats;
            state.loading = false;
        });
        builder.addCase(searchVehicles.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(searchVehicles.rejected, (state) => {
            state.vehicles = [];
            state.pagination = null;
            state.stats = null;
            state.loading = false;
        });

        // Get Vehicle Countries
        builder.addCase(getVehicleCountries.fulfilled, (state, action) => {
			state.activeCountries = action.payload;
            state.loading = false;
        });
        builder.addCase(getVehicleCountries.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getVehicleCountries.rejected, (state) => {
            state.activeCountries = [];
            state.loading = false;
        });

        // Get Vehicle Country cities
        builder.addCase(getVehicleCountryCities.fulfilled, (state, action) => {
			state.activeCities = action.payload;
            state.loading = false;
        });
        builder.addCase(getVehicleCountryCities.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getVehicleCountryCities.rejected, (state) => {
            state.activeCities = [];
            state.loading = false;
        });

        // Get Vehicle by ID
        builder.addCase(getVehicleById.fulfilled, (state, action) => {
            state.loading = false;
            state.vehicle = action.payload;
        });
        builder.addCase(getVehicleById.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getVehicleById.rejected, (state) => {
            state.loading = false;
        });

        // Update Load
        builder.addCase(updateVehicle.fulfilled, (state, action) => {
            state.loading = false;
            // state.vehicle = action.payload;
        });
        builder.addCase(updateVehicle.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(updateVehicle.rejected, (state) => {
            state.loading = false;
        });

        // Create Load
        builder.addCase(createVehicle.fulfilled, (state, action) => {
            state.loading = false;
            state.vehicles = [...state.vehicles, action.payload];
        });
        builder.addCase(createVehicle.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(createVehicle.rejected, (state) => {
            state.loading = false;
        });
    },
});

export const { clearVehicles, clearVehicle, setVehicle } = vehicleSlice.actions;
export default vehicleSlice.reducer;
