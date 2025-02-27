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
