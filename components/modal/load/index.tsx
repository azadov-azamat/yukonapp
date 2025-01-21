import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react'
import DynamicModal from '../dialog';
import { LoadGridCard } from '@/components/cards';
import { useAppSelector } from '@/redux/hooks';

const LoadCardModal = () => {
    const {load} = useAppSelector(state => state.load);

    const [isModalOpen, setIsModalOpen] = React.useState(false);

    const toggleModal = () => {
      setIsModalOpen(!isModalOpen);
    };
    
  return (
    <DynamicModal open={isModalOpen} toggle={toggleModal}>
      {/* <LoadGridCard {...load} /> */}
    </DynamicModal>
  )
}

export default LoadCardModal