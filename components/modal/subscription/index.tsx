import React from 'react'
import DynamicModal from '../dialog';
import { useAppDispatch } from '@/redux/hooks';
import { ModalItemProps } from '@/interface/components';
import { Text } from 'react-native';

const SubscriptionModal: React.FC<ModalItemProps> = ({ open, toggle }) => {
    const dispatch = useAppDispatch();
console.log(open);
    return (
        <DynamicModal open={open} toggle={toggle}>
            <Text>Subsciption modal</Text>
        </DynamicModal>
    )
}

export default SubscriptionModal