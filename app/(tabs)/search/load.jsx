import React, { useEffect, useState, useCallback, memo } from "react";

import { View, FlatList, Keyboard, RefreshControl, TouchableOpacity } from 'react-native'
import { OPTIONS } from '@/utils/constants'
import { CustomBadgeSelector, CustomButton, CustomInput } from '@/components/custom'
import LoadRouteSelector from '@/components/load-route-selector'
import { EmptyStateCard, LoadGridCard, LoadListCard, LoadPaginationDataCard } from '@/components/cards'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { clearLoads, searchLoads, setLoad } from '@/redux/reducers/load'

import { useRouter, useLocalSearchParams } from 'expo-router';
import { getExtractCity } from '@/redux/reducers/city'
import { useTranslation } from 'react-i18next'
import { debounce } from 'lodash';
import { ContentLoaderLoadGrid, ContentLoaderLoadList } from '@/components/content-loader'
import { startLoading, stopLoading } from '@/redux/reducers/variable'
import { SubscriptionModal } from '@/components/modal'
import { updateUserSubscriptionModal } from '@/redux/reducers/auth'
import { ActivityIndicator } from "react-native-paper";
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from "@/config/ThemeContext";
import { useBottomSheet } from '@/hooks/context/bottom-sheet';
import { loadRequestParams } from '@/utils/general';

const SearchLoadScreen = () => {
		const router = useRouter();
    const dispatch = useAppDispatch();
    const { t } = useTranslation();
    
		const params = useLocalSearchParams();
    const { loads, pagination, stats, loading: loadsFetching } = useAppSelector(state => state.load);
		const [dataList, setDataList] = useState([]);

    const { user } = useAppSelector(state => state.auth)
    const { loading } = useAppSelector(state => state.variable);
    const { openLoadView, openLoadFilter } = useBottomSheet();

    const truckTypes = OPTIONS['truck-types'].filter(item => item.value !== 'not_specified');
    const booleanFiltersData = OPTIONS['boolean-filters'];
    const [booleanFilters, setBooleanFilters] = useState(() =>
      booleanFiltersData.reduce((acc, filter) => {
        acc[filter.value] = false; // Har bir filterni default qiymatini false qilib boshlash
        return acc;
      }, {})
    );
    const [selectedItems, setSelectedItems] = useState([]);
    // const [selectedFitlers, setSelectedFilters] = useState([]);
    const [limit, setLimit] = useState(10);
    const [page, setPage] = useState(1);

    const { tab, arrival, departure } = params;

    const [searchText, setSearchText] = useState(arrival ? `${arrival} ${departure}` : '');

    const [origin, setOrigin] = useState(null);
    const [destination, setDestination] = useState(null);
    const [isGridView, setIsGridView] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const toggleView = () => setIsGridView((prev) => !prev);
    const toggleModal = () => setOpenModal(!openModal)

    const toggleSetId = useCallback((item) => {
      openLoadView();
      dispatch(setLoad(item));
    }, [dispatch]);

    const debouncedFetchExtract = useCallback(
      debounce(() => {
				dispatch(clearLoads());
        fetchExtractCity();
      }, 300),
    )

		const fetchLoads = async () => {
			try {
				const params = loadRequestParams({page, limit, booleanFilters, origin, destination, selectedItems});
				await dispatch(searchLoads(params));
			} catch (error) {
				console.error('Error fetching loads:', error);
			} finally {
				dispatch(stopLoading());
			}
    };

    const debouncedFetchLoads = useCallback(
			debounce(() => {
				if (tab === 'load' || tab === undefined) {
					setPage(1);
					setDataList([]);
					dispatch(clearLoads());
					fetchLoads();
				}
			}, 300),
			[dispatch, fetchLoads]
		);

    useEffect(() => {
      if (arrival && dataList.length <= 0) {
        setSearchText(`${arrival || ''} ${departure || ''}`);
        debouncedFetchExtract();
      } else {
        handleClear();
      }
    }, [arrival, departure]);

    useEffect(() => {
			dispatch(startLoading());
			debouncedFetchLoads();
    }, [origin, destination]);

    useEffect(() => {
			if (page !== 1) {
				fetchLoads();
			}
		}, [page]);

    useEffect(()=> {
			if (tab === 'vehicle') {
				setPage(1);
			}

      return () => {
				handleClear();
			};
    }, [tab]);

    const onRefresh = () => {
			setRefreshing(true);

			setTimeout(() => {
				if(arrival) {
					debouncedFetchExtract();
				} else {
					debouncedFetchLoads();
				}
				setRefreshing(false);
			}, 2000);
    };

    const handleSwapCities = () => {
      setOrigin((prevOrigin) => {
        const prevDestination = destination;
        setDestination(prevOrigin);
        return prevDestination;
      });
      dispatch(startLoading());
      setPage(1);
      dispatch(clearLoads());
    };

    const handleClear = () => {
      setOrigin(null);
      setDestination(null);
      setSearchText('');
      setLimit(10);
      setBooleanFilters([])
      setSelectedItems([])
      router.setParams({ arrival: undefined, departure: undefined });
      dispatch(clearLoads());
      dispatch(stopLoading());
    };

    const handleBadgeChange = (value) => {
      console.log(value)
      setSelectedItems((prevSelected) =>
        prevSelected.includes(value)
          ? prevSelected.filter((itemValue) => itemValue !== value)
          : [...prevSelected, value]
      );
      checkAndFetch();
    };
    
    const fetchExtractCity = async () => {
      dispatch(startLoading(searchText));
      let search = arrival ? `${arrival} ${departure}` : searchText
      const cityResponse = await dispatch(getExtractCity({ search })).unwrap();
      const { origin: fetchedOrigin, destination: fetchedDestination } = cityResponse;
      if (!fetchedOrigin) {
        handleClear()
        return;
      }

      setOrigin(fetchedOrigin);
      setDestination(fetchedDestination || null);
    }

		useEffect(() => {
			if (tab === 'load' || tab === undefined) {
				if (page === 1) {
					// On refresh, replace dataList
					setDataList(loads);
				} else {
					// On load more, append new loads from Redux to existing dataList
					setDataList(prev => {
						// Avoid duplicate entries (optional)
						const ids = new Set(prev.map(item => item.id)); // Assuming `id` uniquely identifies a load
						const newLoads = loads.filter(item => !ids.has(item.id));
						return [...prev, ...newLoads];
					});
				}
			}
		}, [loads, page]);

    const onChange = (value) => {
      setBooleanFilters((prevFilters) => ({
        ...prevFilters,
        [value]: !prevFilters[value],
      }));
      checkAndFetch();
    };

    const checkAndFetch =()=> {
      if (origin) {
        setPage(1);
        debouncedFetchExtract();
        // debouncedFetchLoads()
      }
    }

    const isLast = pagination?.totalPages === page;

		const handleViewMore = () => {
			if (isLast) return;
      setTimeout(() => {
				setPage(previous => previous + 1);
			}, 800);
		}

    const toggleSubscriptionModal = (fetch = true) => {
      dispatch(updateUserSubscriptionModal())
      if (fetch) {
        toggleModal();
      }
    }

    const MemoizedLoadListCard = memo(isGridView ? LoadListCard : LoadGridCard);
    const MemoizedContentLoadItem = memo(isGridView ? ContentLoaderLoadList : ContentLoaderLoadGrid);

    const renderLoadItem = useCallback(({ item }) => (
      <MemoizedLoadListCard
        changes={true} onPress={() => toggleSetId(item)} load={item}
      />
    ), [toggleSetId, toggleModal]);

    const renderContentLoadItem = useCallback(() => (
      <MemoizedContentLoadItem />
    ), []);

    return (
      <View className="flex-1">
        {origin ?
          <LoadRouteSelector
            origin={origin}
            destination={destination}
            onClear={handleClear}
            onSwapCities={handleSwapCities}
            openLoadFilter={() => openLoadFilter(booleanFilters, onChange)}
          /> : <SearchInput
                searchText={searchText}
                setSearchText={setSearchText}
                debouncedFetchExtract={debouncedFetchExtract}
              />
        }

        <View className='my-1'/>
        
        {
					pagination && <LoadPaginationDataCard 
                          totalCount={pagination.totalCount} 
                          loadsToday={stats?.loads_today} 
                          isGridView={isGridView} 
                          toggleView={toggleView} 
                        />
				}

        <View className='my-1'/>
				{
					loading ? (
            <FlatList
              data={[1, 2, 3, 4, 6, 7]} // Foydalanilmaydigan placeholder massiv
              keyExtractor={(item) => item.toString()}
              renderItem={renderContentLoadItem}
            />
					) : (
						<FlatList
							data={dataList}
							keyExtractor={(item) => item?.id?.toString()}
							showsVerticalScrollIndicator={false}
							// onScroll={handleScroll}
							scrollEventThrottle={25}
							ListHeaderComponent={
								<View>
									{/* <CustomBadgeSelector
									items={booleanFiltersData}
									selectedItems={selectedFitlers}
									onChange={onChange}
								/> */}
									<CustomBadgeSelector
                    items={truckTypes}
                    selectedItems={selectedItems}
                    onChange={handleBadgeChange}
								/>
								</View>
							}
							ListFooterComponent={(
								<View style={{ padding: 10, alignItems: 'center' }} className={`mb-3 ${(loadsFetching && dataList.length > 0) ? 'hidden' : ''}`}>
									<ActivityIndicator size={20} color="#623bff" />
								</View>
							)}
							ListEmptyComponent={<EmptyStateCard type="load"/>}
							onEndReached={() => {
								if (!loadsFetching && !isLast) {
									handleViewMore();
								}
							}}
							onEndReachedThreshold={0.1}
							renderItem={renderLoadItem}
							refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
						/>
					)
				}
        <SubscriptionModal open={!!user?.isSubscriptionModal || false} toggle={toggleSubscriptionModal}/>
      </View>
    )
}


function SearchInput({searchText, setSearchText, debouncedFetchExtract}) {
  const {t} = useTranslation();
  const {theme} = useTheme();

  return (
    <View className='relative justify-center w-full'>
      <CustomInput
        // mode="outlined"
				placeholder={t ('search-by-destination')}
				value={searchText}
				onChangeText={(text) => setSearchText(text)}
				returnKeyType="search" // Changes the keyboard button to "Search"
				theme={{
					roundness: 25,
					colors: {
						outline: '#623bff', // Outline color
					},
				}}
				onSubmitEditing={() => { // Triggered when Enter is pressed
					Keyboard.dismiss();
					debouncedFetchExtract();
				}}
      />
			<TouchableOpacity
				className="absolute items-center justify-center transform translate-y-[-12] rounded-full right-4 top-4 w-9"
				onPress={() => {
					Keyboard.dismiss();
					debouncedFetchExtract();
				}}>
				<Ionicons name="search" size={24} color={theme.colors.primary} />
			</TouchableOpacity>
		</View>
  )
}

export default SearchLoadScreen
