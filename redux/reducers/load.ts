import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { http } from "@/config/api";
import { LoadInitialProps, ILoadModel } from "@/interface/redux/load.interface";
import { deserialize } from "@/utils/general";
import { deserializeLoad } from "@/utils/deserializer";
import { LoadSerializer } from "@/serializers";
import { UrlParamsDataProps } from "@/interface/search/search.interface";

// Fetch Bookmarks Searches
export const getBookmarks = createAsyncThunk('load/getBookmarks', async (data, { rejectWithValue }) => {
    try {
        const response = await http.get('/loads', {
            params: data
        });
        let deserializedData = await deserialize(response.data)
        deserializedData.map((item: ILoadModel) => deserializeLoad(item));
        

        return {
                loads: deserializedData, 
                pagination: response.data?.meta.pagination,
                stats: response.data.stats
            };
    } catch (error) {
        return rejectWithValue(error);
    }
});

// Fetch Top Searches
export const getTopSearches = createAsyncThunk('load/getTopSearches', async (_, { rejectWithValue }) => {
    try {
        const response = await http.get('/loads/top-searches');
        return response.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

// Fetch Latest Ads
export const getLatestAds = createAsyncThunk('load/getLatestAds', async (_, { rejectWithValue }) => {
    try {
        const response = await http.get('/loads/latest-ads');
        return await deserialize(response.data);
    } catch (error) {
        return rejectWithValue(error);
    }
});

// Fetch Loads (Search)
export const searchLoads = createAsyncThunk('load/searchLoads', async (query: any, { rejectWithValue }) => {
    try {
        const response = await http.get('/loads/search', { params: query });
        let deserializedData = await deserialize(response.data.data)
        deserializedData.map((item: ILoadModel) => deserializeLoad(item));
    
        return {
                loads: deserializedData, 
                pagination: response.data?.data.meta.pagination,
                stats: response.data.stats
            };
    } catch (error) {
        return rejectWithValue(error);
    }
});

// Fetch Load by ID
export const getLoadById = createAsyncThunk('load/getLoadById', async (id: string, { rejectWithValue }) => {
    try {
        const response = await http.get(`/loads/${id}`);
        return deserializeLoad(await deserialize(response.data));
    } catch (error) {
        return rejectWithValue(error);
    }
});

// Patch Load by ID
export const updateLoad = createAsyncThunk('load/updateLoad', async (data: Partial<ILoadModel>, { rejectWithValue }) => {
    try {
        const response = await http.patch(`/loads/${data.id}`, LoadSerializer.serialize(data));
        let load = await deserialize(response.data)        
        return deserializeLoad(load);
    } catch (error) {
        return rejectWithValue(error);
    }
});

// Create a New Load
export const createLoad = createAsyncThunk('load/createLoad', async (data: ILoadModel, { rejectWithValue }) => {
    try {
        const response = await http.post('/loads', data);
        return deserializeLoad(await deserialize(response.data));
    } catch (error) {
        return rejectWithValue(error);
    }
});

const initialState: LoadInitialProps = {
    loads: [],
    bookmarks: [],
    load: null,
    topSearches: [],
    latestAds: [],
    pagination: null,
    stats: null,
    loading: false,
};

export const loadSlice = createSlice({
    name: 'load',
    initialState,
    reducers: {
        clearLoads: (state) => {
            state.loads = [];
            state.pagination = null;
            state.stats = null;
            state.loading = false;
        },
        clearLoad: (state) => {
            state.load = null;
        },
        setLoad: (state, action) => {
            state.load = deserializeLoad(action.payload);
        }
    },
    extraReducers: (builder) => {
        // Top Searches
        builder.addCase(getTopSearches.fulfilled, (state, action) => {
            state.loading = false;
            state.topSearches = action.payload;
        });
        builder.addCase(getTopSearches.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getTopSearches.rejected, (state) => {
            state.loading = false;
        });
    
        // Bookmarks
        builder.addCase(getBookmarks.fulfilled, (state, action) => {
            console.log(action.payload?.loads);
            
            state.bookmarks = action.payload?.loads;
            state.pagination = action.payload.pagination;
            state.stats = action.payload.stats;
            state.loading = false;
        });
        builder.addCase(getBookmarks.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getBookmarks.rejected, (state) => {
            state.loading = false;
            state.bookmarks = [];
            state.pagination = null;
            state.stats = null;
        });

        // Latest Ads
        builder.addCase(getLatestAds.fulfilled, (state, action) => {
            state.loading = false;
            state.latestAdsLoading = false;
            state.latestAds = action.payload;
        });
        builder.addCase(getLatestAds.pending, (state) => {
            if (action.meta.arg?.showLoading) {
                state.latestAdsLoading = true;
            }
            state.loading = true;
        });
        builder.addCase(getLatestAds.rejected, (state) => {
            state.loading = false;
            state.latestAdsLoading = false;
        });

        // Search Loads
        builder.addCase(searchLoads.fulfilled, (state, action) => {
            state.loads = [...state.loads, ...action.payload?.loads];
            state.pagination = action.payload.pagination;
            state.stats = action.payload.stats;
            state.loading = false;
        });
        builder.addCase(searchLoads.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(searchLoads.rejected, (state) => {
            state.loads = [];
            state.pagination = null;
            state.stats = null;
            state.loading = false;
        });

        // Get Load by ID
        builder.addCase(getLoadById.fulfilled, (state, action) => {
            state.loading = false;
            state.load = action.payload;
        });
        builder.addCase(getLoadById.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getLoadById.rejected, (state) => {
            state.loading = false;
        });

        // Update Load
        builder.addCase(updateLoad.fulfilled, (state, action) => {
            state.loading = false;
            // state.load = action.payload;
        });
        builder.addCase(updateLoad.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(updateLoad.rejected, (state) => {
            state.loading = false;
        });

        // Create Load
        builder.addCase(createLoad.fulfilled, (state, action) => {
            state.loading = false;
            state.loads = [...state.loads, action.payload];
        });
        builder.addCase(createLoad.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(createLoad.rejected, (state) => {
            state.loading = false;
        });
    },
});

export const { clearLoads, clearLoad, setLoad } = loadSlice.actions;
export default loadSlice.reducer;
