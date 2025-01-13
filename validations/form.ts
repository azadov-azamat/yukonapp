import * as Yup from 'yup';

export const loginValidationSchema = Yup.object().shape({
  phone: Yup.string()
    .required("Telefon raqami majburiy"),
  password: Yup.string()
    .min(6, 'Parol kamida 6 ta belgidan iborat bo‘lishi kerak')
    .required('Parolni kiriting'),
});

  