import * as Yup from 'yup';

export const loginValidationSchema = Yup.object().shape({
  phone: Yup.string()
    .required("errors.enter-required"),
  password: Yup.string()
    .min(6, 'errors.password-too-short')
    .required('errors.enter-required'),
});

  