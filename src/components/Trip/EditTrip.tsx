import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { editingTripState, tripsState } from '../../data/state';
import { TripForm } from '../Form/TripForm';

interface Props {

}

export const EditTrip = (props: Props) => {
    const { id } = useParams<{ id: string }>();
    const trips = useRecoilValue(tripsState)
    const setEditingTrip = useSetRecoilState(editingTripState)

    useEffect(() => {
        if (!trips) return;
        if(trips.length > 0){
            setEditingTrip(trips.find(t => t.id === id));
        }
    }, [id, setEditingTrip, trips])


    return <TripForm title={'Edit Trip'} />
}
