import { ActivityIndicator } from 'react-native';
import React from 'react'
import DynamicModal from '../dialog';
import { LoadGridCard } from '@/components/cards';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { ModalItemProps } from '@/interface/components';

const LoadCardModal: React.FC<ModalItemProps> = ({ open, toggle }) => {
    const dispatch = useAppDispatch();
    const {load} = useAppSelector(state => state.load);

    if (!load) {
        return <DynamicModal open={open} toggle={toggle}>
            <ActivityIndicator size="large" color="#000" />
        </DynamicModal>;
    }

    // React.useEffect(() => {
    //     load.openMessageCounter=+1;
    //     dispatch(updateLoad(load))
    // }, [load]);

    return (
        <DynamicModal open={open} toggle={toggle}>
            <LoadGridCard load={load} showElement close={toggle}/>
        </DynamicModal>
    )
}

export default LoadCardModal