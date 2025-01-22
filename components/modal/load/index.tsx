import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react'
import DynamicModal from '../dialog';
import { LoadGridCard } from '@/components/cards';
import { useAppSelector } from '@/redux/hooks';
import { ModalItemProps } from '@/interface/components';

const LoadCardModal: React.FC<ModalItemProps> = ({ open, toggle }) => {
    const {load} = useAppSelector(state => state.load);
    
    if (!load) {
        return null;
    }
    
    return (
        <DynamicModal open={open} toggle={toggle}>
            <LoadGridCard load={load} showElement/>
        </DynamicModal>
    )
}

export default LoadCardModal