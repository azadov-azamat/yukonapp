import { Text, View, FlatList, Keyboard, RefreshControl, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useEffect, useState, useCallback, memo } from "react";
import { OPTIONS } from '@/utils/constants'
import { CustomBadgeSelector, CustomButton, CustomInput } from '@/components/custom'
import LoadRouteSelector from '@/components/load-route-selector'
import { EmptyStateCard, LoadGridCard, LoadListCard } from '@/components/cards'
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

const SearchLoadScreen = () => {
		const router = useRouter();
    const dispatch = useAppDispatch();
    const { t } = useTranslation();
    // const navigation = useNavigation();
		const params = useLocalSearchParams();
    const { loads, pagination, stats, loading: loadsFetching } = useAppSelector(state => state.load);
		const [dataList, setDataList] = useState([]);

		// const params = useLocalSearchParams();

    const { user } = useAppSelector(state => state.auth)
    const { loading } = useAppSelector(state => state.variable);
    const { openLoadView } = useBottomSheet();

    const truckTypes = OPTIONS['truck-types'].filter(item => item.value !== 'not_specified');
    const booleanFiltersData = OPTIONS['boolean-filters'];
    const [booleanFilters, setBooleanFilters] = useState(() =>
      booleanFiltersData.reduce((acc, filter) => {
        acc[filter.value] = false; // Har bir filterni default qiymatini false qilib boshlash
        return acc;
      }, {})
    );
    const [selectedItems, setSelectedItems] = useState([]);
    const [selectedFitlers, setSelectedFilters] = useState([]);
    const [limit, setLimit] = useState(10);
    const [page, setPage] = useState(1);

    const { tab, arrival, departure } = params;

    const [searchText, setSearchText] = useState(arrival ? `${arrival} ${departure}` : '');

    const [origin, setOrigin] = useState(null);
    const [destination, setDestination] = useState(null);
    const [isGridView, setIsGridView] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const toggleView = () => {
      setIsGridView((prev) => !prev);
    };

    const toggleModal = () => {
      setOpenModal(!openModal)
    };

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
				const params = requestParams();
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
      if (arrival) {
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
      router.setParams({ arrival: undefined, departure: undefined });
      dispatch(clearLoads());
      dispatch(stopLoading());
    };

    const handleBadgeChange = (value) => {
      setSelectedItems((prevSelected) =>
        prevSelected.includes(value)
          ? prevSelected.filter((itemValue) => itemValue !== value)
          : [...prevSelected, value]
      );
      checkAndFetch();
    };

    function requestParams() {
      let query = {
        limit: limit,
        page: page,
        sort: '!createdAt',
        isArchived: false,
        isDeleted: false,
      };

      if (booleanFilters['isDagruz']) {
        query.isDagruz = booleanFilters['isDagruz'];
      }

      if (booleanFilters['hasPrepayment']) {
        query.hasPrepayment = booleanFilters['hasPrepayment'];
      }

      if (booleanFilters['isLikelyOwner']) {
        query.isLikelyOwner = booleanFilters['isLikelyOwner'];
      }

      if (booleanFilters['isWebAd']) {
        query.isWebAd = booleanFilters['isWebAd'];
      }

      if (selectedItems.length) {
        query.cargoTypes = selectedItems
          .map((item) => item)
          .join(', ');
      }

      if (origin?.country_id) {
        query.origin_city_id = origin.id;
        query.origin_country_id = origin.country_id;
      } else {
        query.origin_country_id = origin?.id;
      }

      if (destination && destination?.country_id) {
        query.destination_city_id = destination.id;
        query.destination_country_id = destination.country_id;
      } else {
        query.destination_country_id = destination?.id;
      }

      return query;
    }

    const fetchExtractCity = async () => {
      dispatch(startLoading(searchText));
      let search = arrival ? `${arrival} ${departure}` : searchText
      const cityResponse = await dispatch(getExtractCity({ search })).unwrap();
      const { origin: fetchedOrigin, destination: fetchedDestination } = cityResponse;
      if (!fetchedOrigin) {
        handleClear()
        return;
      }
      // if (getCityName(fetchedOrigin) !== arrival || getCityName(fetchedDestination) !== departure) {
      //   updateQueryParams(getCityName(fetchedOrigin), getCityName(fetchedDestination) || '');
      // }
      // setOrigin(fetchedOrigin);
      // setDestination(fetchedDestination || null);
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

    // const onChange = (value) => {
    //   setBooleanFilters((prevFilters) => ({
    //     ...prevFilters,
    //     [value]: !prevFilters[value],
    //   }));
    //   setSelectedFilters((prevSelected) =>
    //     prevSelected.includes(value)
    //       ? prevSelected.filter((itemValue) => itemValue !== value)
    //       : [...prevSelected, value]
    //   );
    //   checkAndFetch();
    // };

    const checkAndFetch =()=> {
      if (origin) {
        setPage(1);
        dispatch(clearLoads());
        debouncedFetchExtract();
      }
    }

    const isLast = pagination?.totalPages === page;

		const handleViewMore = () => {
			if (isLast) return;
			setPage(previous => previous + 1);
		}

		// const [isPastBottom, setIsPastBottom] = useState(false);

		// const loadMoreData = () => {
		// 	if (loadsFetching) return;

		// 	setTimeout(() => {
		// 		handleViewMore();
		// 	}, 1000);
		// };

		const handleScroll = (event) => {
			// const { contentOffset, layoutMeasurement, contentSize } = event.nativeEvent;
			// const isAtBottom = contentOffset.y + layoutMeasurement.height >= contentSize.height + 50; // 50px past bottom
			// if (isAtBottom && !isPastBottom) {
			// 	setIsPastBottom(true);
			// 	loadMoreData();
			// } else if (!isAtBottom) {
			// 	setIsPastBottom(false);
			// }
		};

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
          /> : <SearchInput
                searchText={searchText}
                setSearchText={setSearchText}
                debouncedFetchExtract={debouncedFetchExtract}
              />
        }

        <View className='my-1'/>
        {
					pagination && <View className="flex-row items-center justify-between p-4 mt-2 rounded-md shadow-sm bg-primary-light dark:bg-primary-dark dark:border border-border-color/20">
						<View>
							<Text className="text-sm font-bold text-primary-dark dark:text-primary-light">
								{t ('query-result-message-without-cargo', {
									count: pagination.totalCount,
									todayCounter: stats?.loads_today
									}
								)}
							</Text>
						</View>
						<CustomButton
							icon={isGridView ? 'list' : 'grid'} // Icon for toggle
							isIcon
							iconSize={18}
							onPress={toggleView}
							buttonStyle="bg-primary px-2 py-1"
						/>
					</View>
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
							onScroll={handleScroll}
							scrollEventThrottle={16}
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
        {/* <LoadModal open={openModal} toggle={toggleModal}/> */}
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
			{/* <TextInput
				mode="outlined"
				placeholder={t ('search-by-destination')}
				value={searchText}
				onChangeText={(text) => setSearchText(text)}
				className="w-full !dark:text-white overflow-auto bg-primary-white dark:bg-primary-dark/30 pl-2.5"
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
			/> */}
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
