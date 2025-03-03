import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { http } from '@/config/api';
import { NotificationInitialProps } from '@/interface/redux/notification.interface';
import { deserialize } from '@/utils/general';
import { INotificationModel } from '@/interface/redux/notification.interface';
import NotificationModel from '@/models/notification';

export const getNotifications = createAsyncThunk('notification/getNotifications', async (query: any, { rejectWithValue }) => {
  try {
    const response = await http.get('notifications', { params: query });
    let deserializedData = await deserialize(response.data)
    deserializedData = deserializedData.map((item: INotificationModel) => new NotificationModel(item));

    return deserializedData;
  } catch (error) {
    return rejectWithValue(error);
  }
});

const initialState: NotificationInitialProps = {
  notifications: [],
  loading: false,
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
		builder.addCase(getNotifications.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getNotifications.fulfilled, (state, action) => {
			state.notifications = action.payload;
      state.loading = false;
    });
    builder.addCase(getNotifications.rejected, (state, action) => {
      state.loading = false;
      state.notifications = [];
    });
  },
});

export default notificationSlice.reducer;
