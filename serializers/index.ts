// serializers.ts for React Native

import { Serializer } from 'jsonapi-serializer';

// User Serializer
export const UserSerializer = new Serializer('users', {
  attributes: [
    'firstName',
    'lastName',
    'phone',
    'searchFilters',
    'telegramId',
    'telegramUsername',
    'isRegistered',
    'vehicleSearchLimit',
    'loadSearchLimit',
    'role',
    'bookmarkedLoadIds',
    'bookmarkedVehicleIds',
    'newLoadsNotifierEnabled',
    'hasPassword',
    'markedInvalidVehicles',
    'markedExpiredLoads',
  ],
});

// Load Serializer
export const LoadSerializer = new Serializer('load', {
  attributes: [
    'originCityName',
    'destinationCityName',
    'originCity',
    'destinationCity',
    'originCountry',
    'destinationCountry',
    'loadReadyDate',
    'openMessageCounter',
    'phoneViewCounter',
    'goods',
    'price',
    'weight',
    'description',
    'cargoType',
    'cargoType2',
    'requiredTrucksCount',
    'url',
    'paymentType',
    'createdAt',
    'updatedAt',
    'publishedDate',
    'hasPrepayment',
    'prepaymentAmount',
    'isArchived',
    'distance',
    'distanceSeconds',
    'telegramUserId',
    'telegramMessageId',
    'isWebAd',
    'isDagruz',
  ],
  relationships: {
    owner: {
      ref: 'id',
      attributes: [],
    },
    originCity: {
      ref: 'id',
      attributes: [],
    },
    originCountry: {
      ref: 'id',
      attributes: [],
    },
    destinationCity: {
      ref: 'id',
      attributes: [],
    },
    destinationCountry: {
      ref: 'id',
      attributes: [],
    },
  },
});

// City Serializer
export const CitySerializer = new Serializer('city', {
  attributes: [
    'nameUz',
    'nameEn',
    'nameRu',
    'names',
    'country',
  ],
  relationships: {
    country: {
      ref: 'id',
      attributes: [],
    },
  },
});

// Country Serializer
export const CountrySerializer = new Serializer('country', {
  attributes: ['nameUz', 'nameRu', 'nameEn', 'names', 'icon'],
});

// Plan Serializer
export const PlanSerializer = new Serializer('plan', {
  attributes: [
    'nameUz',
    'nameCyrl',
    'nameRu',
    'descriptionUz',
    'descriptionCyrl',
    'descriptionRu',
    'price',
    'planType',
  ],
});
