// import { useAppDispatch } from '@/redux/hooks';
// import { useState } from 'react';
// import { useTranslation } from 'react-i18next';
// import { Alert } from 'react-native';

// // Notifications va intl uchun zamena funksiyalar
// const notifications = {
//   error: (message: string) => Alert.alert('Error', message),
// };

// export default function usePayment() {
//     const dispatch = useAppDispatch();
//     const { t } = useTranslation();
//   const [loading, setLoading] = useState(false);
//   const [cardData, setCardData] = useState(null);
//   const [sendingData, setSendingData] = useState(null);
//   const [remainingSeconds, setRemainingSeconds] = useState(0);
//   const [receipt, setReceipt] = useState(null);

//   const sendRequest = async (url, body, method = 'POST') => {
//     try {
//       let response = await fetch(url, {
//         method,
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(body),
//       });

//       let jsonResponse = await response.json();
//       if (jsonResponse.error) {
//         handleRequestError(jsonResponse.error);
//         return null;
//       }
//       return jsonResponse.result;
//     } catch (e) {
//       console.error('Network error:', e);
//       return null;
//     }
//   };

//   const handleRequestError = (error: any) => {
//     const errorMessages = {
//       '-31300': t('errors.card-data-incorrect'),
//       '-31900': t('errors.card-data-incorrect'),
//       '-31103': t('errors.confirmation-code-incorrect'),
//       '-31101': t('errors.confirmation-code-expired'),
//       '-31630': t('errors.get-enough-amount'),
//     };
//     if (errorMessages[error.code]) {
//       notifications.error(errorMessages[error.code]);
//     } else {
//       console.error('Unhandled error:', error);
//     }
//   };

//   const extractNumbers = (input: string) => input.replace(/\D/g, '');

//   const createCard = async (cardNumber: string, expiry: string) => {
//     setLoading(true);

//     const number = extractNumbers(cardNumber); // cardNumber
//     const expire = extractNumbers(expiry); // expiry
//     const body = { number, expire };

//     dispatch(createCard(body));
//     const result = await sendRequest('cards', body);
//     if (result) {
//       setCardData(result.card);
//       await getVerifyWithToken();
//     }

//     setLoading(false);
//   };

//   const getVerifyWithToken = async () => {
//     setLoading(true);

//     if (!cardData) return;

//     const { token } = cardData;
//     const body = { token };

//     const result = await sendRequest('cards/verify-code', body);
//     if (result) {
//       setSendingData(result);
//       setRemainingSeconds(result.wait);
//       startCountdown(result.wait);
//     }

//     setLoading(false);
//   };

//   const getVerifyCode = async (code) => {
//     setLoading(true);

//     if (!cardData) return;

//     const { token } = cardData;
//     const body = { token, code };

//     const result = await sendRequest('cards/verify', body);
//     if (result) {
//       setCardData(result.card);
//       await createReceipt();
//     }

//     setLoading(false);
//   };

//   const createReceipt = async () => {
//     setLoading(true);

//     const body = { planId: 'your_plan_id_here' };

//     const result = await sendRequest('receipts', body);
//     if (result) {
//       setReceipt(result.receipt);
//       await receiptPay();
//     }

//     setLoading(false);
//   };

//   const receiptPay = async () => {
//     setLoading(true);

//     if (!cardData || !receipt) return;

//     const { token } = cardData;
//     const body = { checkId: receipt._id, token };

//     const result = await sendRequest('receipts/pay', body);
//     if (result) {
//       Alert.alert('Success', 'Payment successful!');
//       console.log('Subscription:', result);
//       // Navigate to another screen, e.g., navigation.navigate('SearchVehicle');
//     }

//     setLoading(false);
//   };

//   const startCountdown = (seconds) => {
//     setRemainingSeconds(seconds);
//     const interval = setInterval(() => {
//       setRemainingSeconds((prev) => {
//         if (prev <= 1) {
//           clearInterval(interval);
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);
//   };

//   return {
//     loading,
//     cardData,
//     sendingData,
//     remainingSeconds,
//     receipt,
//     createCard,
//     getVerifyCode,
//   };
// }
