import React from 'react'
import { GeoLocation } from '../../data/location'
import { Search } from './Search'

export interface LocationSelectionProps {
    location: GeoLocation | undefined | null,
    handleLocationChange: (location: GeoLocation | null | undefined) => void
}

export const LocationSelection = (props: LocationSelectionProps) => {
    return (
        <div>
            <Search {...props}/>
        </div>
    )
}
