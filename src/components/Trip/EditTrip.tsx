import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { editingTripState, selectedTripIdState, selectedTripState } from '../../data/state';
import { TripForm } from '../Form/TripForm';

interface Props {

}

export const EditTrip = (props: Props) => {
    const { id } = useParams<{ id: string }>();
    const setSelectedTripId = useSetRecoilState(selectedTripIdState)
    const selectedTrip = useRecoilValue(selectedTripState)
    const setEditingTrip = useSetRecoilState(editingTripState)

    useEffect(() => {
        setSelectedTripId(id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        setEditingTrip(selectedTrip);
    }, [selectedTrip, setEditingTrip])

    return <TripForm title={'Edit Trip'} />
}
