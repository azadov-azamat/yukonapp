import { ActivityIndicator } from 'react-native';
import React from 'react'
import DynamicModal from '../dialog';
import { LoadGridCard } from '@/components/cards';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { ModalItemProps } from '@/interface/components';


const SubscriptionModal: React.FC<ModalItemProps> = ({ open, toggle }) => {
    const dispatch = useAppDispatch();

    return (
        <DynamicModal open={open} toggle={toggle}>
            Subsciption modal
        </DynamicModal>
    )
}

export default SubscriptionModal