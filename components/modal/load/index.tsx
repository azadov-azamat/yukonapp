import React from 'react'
import DynamicModal from '../dialog';
import { LoadGridCard } from '@/components/cards';
import { useAppSelector } from '@/redux/hooks';
import { ModalItemProps } from '@/interface/components';
import { ContentLoaderLoadGrid } from '@/components/content-loader';

const LoadCardModal: React.FC<ModalItemProps> = ({ open, toggle }) => {
    const {load} = useAppSelector(state => state.load);

    if (!load) {
        return <DynamicModal open={open} toggle={toggle}>
            <ContentLoaderLoadGrid/>
        </DynamicModal>;
    }

    return (
        <DynamicModal open={open} toggle={toggle}>
            <LoadGridCard load={load} showElement close={toggle} isUpdate/>
        </DynamicModal>
    )
}

export default LoadCardModal