import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { createCard, getVerifyToken, verifyCard, createReceipts, payReceipts } from '@/redux/reducers/card';
import { unwrapResult } from '@reduxjs/toolkit';
import { Alert, Platform } from 'react-native';
import { useTranslation } from 'react-i18next';
import { formatDate } from '@/utils/general';
import { getName } from '@/utils/general';
import Toast from 'react-native-toast-message';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';

const usePayment = () => {
    const dispatch = useAppDispatch();
    const {t} = useTranslation();
    const router = useRouter();
    const { card, receipt, verifyData } = useAppSelector(state => state.card);
    const { selectedPlan } = useAppSelector(state => state.variable);
    const [remainingSeconds, setRemainingSeconds] = useState(0);

    const handleRequestError = (error: any) => {
        const errorMessages: Record<string, string> = {
            "-31300": t("errors.card-data-incorrect"),
            "-31001": t("errors.please-try-again"),
            "-31900": t("errors.card-data-incorrect"),
            "-31103": t("errors.confirmation-code-incorrect"),
            "-31101": t("errors.confirmation-code-expired"),
            "-31630": t("errors.get-enough-amount"),
            "-31400": t("errors.confirmation-code-incorrect"),
            "-31650": t ("errors.card-no-supported")
        };

        Toast.show({
            type: 'error',
            text1: errorMessages[String(error.code)] || t("errors.unhandled-error")
        });
    };

    const startCountdown = (millis: number) => {
        const seconds = Math.floor(millis / 1000);
        setRemainingSeconds(seconds);
        const interval = setInterval(() => {
            setRemainingSeconds((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(interval);
    };

    useEffect(() => {
        if (verifyData) {
            startCountdown(verifyData.wait);
        }
    }, [verifyData]);

    const createNewCard = async (number: string, expire: string) => {
        const result = await dispatch(createCard({ number, expire })).then(unwrapResult);
        if (result.error) {
            handleRequestError(result.error.data?.code ? result.error.data : result.error);
        }        
        return result.result.card.token;
    };

    const verifyAndPay = async (code: string, planId: string) => {
        const verifyResult = await dispatch(verifyCard({ code, token: card ? card.token : '' })).then(unwrapResult);
        if (verifyResult.error) {
            handleRequestError(verifyResult.error);
        }

        const resCreateReceipts = await dispatch(createReceipts({ planId })).then(unwrapResult);
        if (resCreateReceipts.error) {
            handleRequestError(resCreateReceipts.error);
        }

        const checkId = receipt ? receipt._id : resCreateReceipts.result.receipt._id;
        const token = card ? card.token : '';
        const resPayReceipts = await dispatch(payReceipts({ checkId, token, paymentType: 'mobile' })).then(unwrapResult);
        if (resPayReceipts.error) {
            handleRequestError(resPayReceipts.error);
        }

        Toast.show({
            type: 'success',
            text1: t('success.create'),
            text2: t('success.payment-subscription', {plan: getName(selectedPlan, 'name'), endDate: formatDate(new Date(resPayReceipts.result.endDate))})
        })
        return router.push('/profile');;
    };

    const resendVerificationCode = async (token: string) => {
        if (card || token) {
            const result = await dispatch(getVerifyToken({ token: card ? card.token : token })).then(unwrapResult);
            if (result.error) {
                return handleRequestError(result.error);
            }
            Toast.show({
                type: 'success',
                text1: t('success.verify-code')
            })
        }
    };

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    return {
        createNewCard,
        verifyAndPay,
        resendVerificationCode,
        remainingSeconds,
        time: formatTime,
    };
};

export default usePayment;