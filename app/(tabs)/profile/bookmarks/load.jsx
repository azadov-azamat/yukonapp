import { Text, View, FlatList, Keyboard, RefreshControl } from 'react-native'
import React from 'react'
import { CustomBadgeSelector, CustomButton, CustomInput } from '@/components/custom'
import { EmptyStateCard, LoadGridCard, LoadListCard } from '@/components/cards'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { clearLoad, clearLoads, getBookmarks, getLoadById, searchLoads, setLoad } from '@/redux/reducers/load'
import { useRoute } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next'
import { ContentLoaderLoadGrid, ContentLoaderLoadList } from '@/components/content-loader'
import { startLoading, stopLoading } from '@/redux/reducers/variable'
import { LoadModal, SubscriptionModal } from '@/components/modal'

const BookmarksLoadScreen = () => {
    const route = useRoute();
    const dispatch = useAppDispatch();
    const {t} = useTranslation();
    const navigation = useNavigation();
    const {bookmarks, pagination, stats, loading: cargoLoad} = useAppSelector(state => state.load);
    const {user} = useAppSelector(state => state.auth)
    const { loading } = useAppSelector(state => state.variable);
    
    const [limit, setLimit] = React.useState(10);
    const [page, setPage] = React.useState(1);
    
    const [viewId, setViewId] = React.useState(null);
    const [refreshing, setRefreshing] = React.useState(false);
    const [openModal, setOpenModal] = React.useState(false);
    
    const RenderLoadItem = React.memo(({ item }) => <LoadGridCard onPress={() => toggleSetId(item)} load={item} close={toggleModal} />);
    const RenderContentLoadItem = React.memo(() => <ContentLoaderLoadGrid />);
    
    const toggleModal = () => {
      setOpenModal(!openModal)
    };
    
    const toggleSetId = (item) => {
      setViewId(item.id);
      dispatch(setLoad(item))
    }

    React.useEffect(() => {
      if (user) {
        fetchLoads()
      }
    }, [user]);

    React.useEffect(() => {
      if (!openModal) {
        setViewId(null);
      }
    }, [openModal])

    React.useEffect(() => {
      if (viewId) {
        toggleModal();
        dispatch(getLoadById(viewId));
      } else {
        // dispatch(clearLoad())
      }
    }, [viewId])
    
    const onRefresh = () => {
        setRefreshing(true);
        // dispatch(clearLoads());
        // Ma'lumotlarni yangilash
        setTimeout(() => {
          fetchLoads();
          setRefreshing(false); // Yangilashni tugatish
        }, 2000); // 2 soniyalik kechikish
    };

    const fetchLoads = async () => {
        try {
          await dispatch(getBookmarks({ids: user.bookmarkedLoadIds}));
        } catch (error) {
          console.error('Error fetching loads:', error);
        } finally {
          dispatch(stopLoading());
        }
    };

    const isLast = pagination?.totalPages === page;
    
    const handleViewMore = () => {
      if (isLast) {
        setPage(1)
        dispatch(clearLoads())
      } else {
        setPage(previus => previus + 1); 
      }
    }
    
    const toggleSubscriptionModal = (fetch = true) => {
      dispatch(updateUserSubscriptionModal())
      if (fetch) {
        toggleModal();
      }
    }
    
    return (
        <View className="flex-1 bg-gray-100">
            {loading ? (
              <FlatList
              data={[1, 2, 3, 4, 6, 7]} // Foydalanilmaydigan placeholder massiv
              keyExtractor={(item) => item.toString()}
              renderItem={() => <RenderContentLoadItem />}
            />
            ) : (
              <FlatList
                  data={bookmarks}
                  keyExtractor={(item) => item?.id?.toString()}
                  showsVerticalScrollIndicator={false}
                
                  ListFooterComponent={<View className={`mb-3 ${(!bookmarks.length || bookmarks.length < limit) && 'hidden'}`}>
                    <CustomButton 
                        title={t (isLast ? 'show-less' : 'show-more', {
                          nextIndex: page * limit,
                          count: pagination?.totalCount
                        })} 
                        buttonStyle='bg-primary'
                        onPress={handleViewMore}
                        loading={cargoLoad}
                    />
                  </View>}
                  ListEmptyComponent={<EmptyStateCard type="bookmarks-load"/>}
                  renderItem={({ item }) => <RenderLoadItem item={item} />}
                  refreshControl={ <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
              />
            )}
            <LoadModal open={openModal} toggle={toggleModal}/>
            <SubscriptionModal open={!!user?.isSubscriptionModal || false} toggle={toggleSubscriptionModal}/>
        </View>
    )
}

export default BookmarksLoadScreen;
