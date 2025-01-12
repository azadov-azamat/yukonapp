import * as Yup from 'yup';

export const loginValidationSchema = Yup.object().shape({
  phone: Yup.string()
    .matches(/^\+998\d{9}$/, "Telefon raqami '+998' bilan boshlanishi va 9 raqamdan iborat bo'lishi kerak.")
    .required("Telefon raqami majburiy"),
  password: Yup.string()
    .min(6, 'Parol kamida 6 ta belgidan iborat bo‘lishi kerak')
    .required('Parolni kiriting'),
});

