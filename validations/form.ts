import * as Yup from 'yup';

export const loginValidationSchema = Yup.object().shape({
  phone: Yup.string()
    .required("errors.enter-required"),
  password: Yup.string()
    .min(6, 'errors.password-too-short')
    .required('errors.enter-required'),
});

export const paymentValidationSchema = Yup.object().shape({
  cardNumber: Yup.string()
    .required("errors.enter-required"),
    expiry: Yup.string()
    .required('errors.enter-required'),
});

export const loadValidationSchema = Yup.object().shape({
	goods: Yup.string().required("errors.enter-required"),
	phone: Yup.string().required("errors.enter-required"),
	truckType: Yup.string().required("errors.enter-required"),
	weight: Yup.number().positive().required("errors.enter-required"),
});


export const vehicleValidationSchema = Yup.object().shape({
	goods: Yup.string().required("errors.enter-required"),
	phone: Yup.string().required("errors.enter-required"),
	truckType: Yup.string().required("errors.enter-required"),
	weight: Yup.number().positive().required("errors.enter-required"),
});

// Define Yup validation schema
export const adsValidationSchema = Yup.object().shape({
  goods: Yup.string().required('Goods are required'),
  phone: Yup.string().required('Phone is required'),
  // truckType: Yup.string().required('Truck type is required'),
  weight: Yup.number().required('Weight is required').positive('Weight must be positive'),
  originCountry: Yup.object().nullable().required('Origin country is required'),
  destinationCountry: Yup.object().nullable().required('Destination country is required'),
  originCity: Yup.object().nullable().required('Origin city is required'),
  destinationCity: Yup.object().nullable().required('Destination city is required'),
});