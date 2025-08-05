export const OPTIONS = {
    'payment-type': [
      { label: 'payment-type.any', value: 'not_specified' },
      { label: 'payment-type.cash', value: 'cash' },
      { label: 'payment-type.transfer', value: 'transfer' },
      { label: 'payment-type.by_card', value: 'by_card' },
      { label: 'payment-type.cash_or_by_card', value: 'cash_or_by_card' },
      { label: 'payment-type.combo', value: 'combo' },
    ],
    'truck-types': [
      { label: 'truck-type.any', value: 'not_specified' },
      { label: 'truck-type.isuzu', value: 'isuzu' },
      { label: 'truck-type.big_isuzu', value: 'big_isuzu' },
      { label: 'truck-type.small_isuzu', value: 'small_isuzu' },
      { label: 'truck-type.labo', value: 'labo' },
      { label: 'truck-type.man', value: 'man' },
      { label: 'truck-type.chakman', value: 'chakman' },
      { label: 'truck-type.kamaz', value: 'kamaz' },
      { label: 'truck-type.flatbed', value: 'flatbed' },
      { label: 'truck-type.barge', value: 'barge' },
      { label: 'truck-type.lowboy', value: 'lowboy' },
      { label: 'truck-type.tented', value: 'tented' },
      { label: 'truck-type.containership', value: 'containership' },
      { label: 'truck-type.locomotive', value: 'locomotive' },
      { label: 'truck-type.reefer', value: 'reefer' },
      // { label: 'truck-type.reefer-18', value: 'reefer-18' },
      { label: 'truck-type.reefer-mode', value: 'reefer-mode' },
      { label: 'truck-type.mega', value: 'mega' },
      { label: 'truck-type.gazel', value: 'gazel' },
      { label: 'truck-type.sprinter', value: 'sprinter' },
      { label: 'truck-type.avtovoz', value: 'avtovoz' },
      { label: 'truck-type.isotherm', value: 'isotherm' },
      { label: 'truck-type.kia_bongo', value: 'kia_bongo' },
      { label: 'truck-type.faw', value: 'faw' },
      { label: 'truck-type.dump', value: 'dump' },
    ],
    'user-roles': ['driver', 'dispatcher', 'load_owner'],
    'boolean-filters' : [
        { value: 'isLikelyOwner', label: 'is-likely-owner' },
        { value: 'isWebAd', label: 'is-web-ad' },
        { value: 'isDagruz', label: 'dagruz' },
        { value: 'hasPrepayment', label: 'has-prepayment' }
    ],
    'currencies': [
      {label: 'UZS', value: 'UZS'},
      {label: 'USD', value: 'USD'},
      {label: 'RUB', value: 'RUB'},
    ],
    'radius': [
      {label: '10', value: '10'},
      {label: '20', value: '20'},
      {label: '30', value: '30'},
      {label: '40', value: '40'},
      {label: '50', value: '50'}
    ]
  };
    