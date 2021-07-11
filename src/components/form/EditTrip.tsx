import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { getTrip } from '../../data/data';
import { editingTripState } from '../../data/state';
import { TripForm } from './TripForm';

interface Props {

}

export const EditTrip = (props: Props) => {
    const { id } = useParams<{ id: string }>();
    const setEditingTrip = useSetRecoilState(editingTripState)

    useEffect(() => {
        const fetchTrip = async () => {
            const trip = await getTrip(id)
            setEditingTrip(trip)
        }
        fetchTrip();
    }, [id, setEditingTrip])

    return <TripForm title={'Edit Trip'} />
}
