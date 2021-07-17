import React from 'react'
import { GeoLocation } from '../../data/location'
import { Map } from './Map'
import { Search } from './Search'

export interface LocationSelectionProps {
    location: GeoLocation | undefined | null,
    handleLocationChange: (location: GeoLocation | null | undefined) => void
}

export const LocationSelection = (props: LocationSelectionProps) => {
    const { location } = props

    return (
        <div>
            <Search {...props} />
            <Map location={location} />
        </div>
    )
}
