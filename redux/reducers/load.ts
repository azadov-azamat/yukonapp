import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { http } from "@/config/api";
import { LoadInitialProps, ILoadModel } from "@/interface/redux/load.interface";
import { deserialize } from "@/utils/general";
import { deserializeLoad } from "@/utils/deserializer";
import { LoadSerializer } from "@/serializers";
import { UrlParamsDataProps } from "@/interface/search/search.interface";
import LoadModel from "@/models/load";

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

// Fetch stats
export const getLoadStats = createAsyncThunk('load/getLoadStats', async (_, { rejectWithValue }) => {
    try {
        const response = await http.get('/loads/stats');
        return response.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

// Fetch Loads (Search)
export const searchLoads = createAsyncThunk('load/searchLoads', async (query: any, { rejectWithValue }) => {
    try {
        const response = await http.get('/loads/search', { 
            params: query,
            headers: {
                'X-Track': '1',
                'X-Track-Event': 'load_search',
                'X-Track-Meta': JSON.stringify(query)
            } 
        });
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

// Fetch Loads (Search)
export const searchNearbyLoads = createAsyncThunk('load/searchNearbyLoads', async (query: any, { rejectWithValue }) => {
    try {
        const response = await http.get('/loads/search', { 
            params: query,
            headers: {
                'X-Track': '1',
                'X-Track-Event': 'load_search',
                'X-Track-Meta': JSON.stringify(query)
            }
        });
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

export const fetchLatestLoads = createAsyncThunk('load/latestLoads', async (_, { rejectWithValue }) => {
	try {
			const query = {
				limit: 10,
				sort: '!createdAt',
				isArchived: false,
				isDeleted: false,
			}
			const response = await http.get('/loads', { params: query });
			let deserializedData = await deserialize(response.data)
			deserializedData.map((item: ILoadModel) => deserializeLoad(item));

			return deserializedData;
	} catch (error) {
			return rejectWithValue(error);
	}
});

// Fetch Load by ID
export const getLoadById = createAsyncThunk('load/getLoadById', async (id: string, { rejectWithValue }) => {
    try {
        const response = await http.get(`/loads/${id}`, {
            headers: {
                'X-Track': '1',
                'X-Track-Event': 'page_view',
                'X-Track-Meta': JSON.stringify({type: 'load', recordId: id})
            }
        });
        return deserializeLoad(await deserialize(response.data));
    } catch (error) {
        return rejectWithValue(error);
    }
});

// Patch Load by ID
export const updateLoad = createAsyncThunk('load/updateLoad', async ({id, data}: {id: string, data: LoadModel}, { rejectWithValue }) => {
    try {
        const response = await http.patch(`/loads/${id}`, LoadSerializer.serialize(data));
        return deserializeLoad(await deserialize(response.data));
    } catch (error) {
        return rejectWithValue(error);
    }
});

// Create a New Load
export const createLoad = createAsyncThunk('load/createLoad', async (data: ILoadModel, { rejectWithValue }) => {
    try {
        const response = await http.post('/loads', data, {
            headers: {
                'X-Track': '1',
                'X-Track-Event': 'create_new_load',
                'X-Track-Meta': JSON.stringify(data)
            }
        });
        return deserializeLoad(await deserialize(response.data));
    } catch (error) {
        return rejectWithValue(error);
    }
});

const initialState: LoadInitialProps = {
    loads: [],
	latestLoads: [],
    bookmarks: [],
    load: null,
    topSearches: [],
    nearbyLoads: [],
    pagination: null,
    stats: null,
    dashboardStats: null,
    loading: false,
    loadingTopSearches: false,
    loadingSearchLoads: false,
    loadingLoadById: false,
		loadingLatestLoads: false,
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
            state.load = new LoadModel(action.payload);
        }
    },
    extraReducers: (builder) => {
        // Top Searches
        builder.addCase(getTopSearches.fulfilled, (state, action) => {
            state.loading = false;
            state.loadingTopSearches = false;
            state.topSearches = action.payload;
        });
        builder.addCase(getTopSearches.pending, (state) => {
            state.loading = true;
            state.loadingTopSearches = true;
        });
        builder.addCase(getTopSearches.rejected, (state) => {
            state.loading = false;
            state.loadingTopSearches = false;
            state.topSearches = [];
        });

        // Stats Loads
        builder.addCase(getLoadStats.fulfilled, (state, action) => {
            state.dashboardStats = action.payload;
        });

        // Bookmarks
        builder.addCase(getBookmarks.fulfilled, (state, action) => {
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

        // Search Loads
        builder.addCase(searchLoads.fulfilled, (state, action) => {
            state.loads = [...state.loads, ...action.payload?.loads];
            state.pagination = action.payload.pagination;
            state.stats = action.payload.stats;
            state.loading = false;
            state.loadingSearchLoads = false;
        });
        builder.addCase(searchLoads.pending, (state) => {
            state.loading = true;
            state.loadingSearchLoads = true;
        });
        builder.addCase(searchLoads.rejected, (state) => {
            state.loads = [];
            state.pagination = null;
            state.stats = null;
            state.loading = false;
            state.loadingSearchLoads = false;
        });

          // Search Nearby Loads
        builder.addCase(searchNearbyLoads.fulfilled, (state, action) => {
            state.nearbyLoads = action.payload?.loads;
            state.pagination = action.payload.pagination;
            state.stats = action.payload.stats;
            state.loading = false;
            state.loadingSearchLoads = false;
        });
        builder.addCase(searchNearbyLoads.pending, (state) => {
            state.loading = true;
            state.loadingSearchLoads = true;
        });
        builder.addCase(searchNearbyLoads.rejected, (state) => {
            state.nearbyLoads = [];
            state.pagination = null;
            state.stats = null;
            state.loading = false;
            state.loadingSearchLoads = false;
        });

				// Latest Loads
				builder.addCase(fetchLatestLoads.fulfilled, (state, action) => {
					state.latestLoads = action.payload;
					state.loadingLatestLoads = false;
				});
				builder.addCase(fetchLatestLoads.pending, (state) => {
					state.loading = true;
					state.loadingLatestLoads = true;
				});
				builder.addCase(fetchLatestLoads.rejected, (state) => {
					state.loading = false;
					state.loadingLatestLoads = false;
					state.latestLoads = [];
				});

        // Get Load by ID
        builder.addCase(getLoadById.fulfilled, (state, action) => {
            state.loading = false;
            state.loadingLoadById = false;
            state.load = action.payload;
        });
        builder.addCase(getLoadById.pending, (state) => {
            state.loading = true;
            state.loadingLoadById = true;
        });
        builder.addCase(getLoadById.rejected, (state) => {
            state.loading = false;
            state.loadingLoadById = false;
        });

        // Update Load
        builder.addCase(updateLoad.fulfilled, (state, action) => {
            const load = new LoadModel({
                ...action.payload,
                phone: state.load?.phone,
                telegram: state.load?.telegram,
                url: state.load?.url
            })
            state.load = load;
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
