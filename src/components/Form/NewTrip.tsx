import React, { useEffect } from 'react'
import { useSetRecoilState } from 'recoil';
import { editingTripState, getNewTrip } from '../../data/state';
import { TripForm } from './TripForm';

export const NewTrip = () => {
    const setEditingTrip = useSetRecoilState(editingTripState)
    
    useEffect(() => {
        setEditingTrip(getNewTrip());
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
   
    return <TripForm title={'New Trip'}/>
}
