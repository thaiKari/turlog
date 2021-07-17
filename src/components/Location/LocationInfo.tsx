import { Typography } from '@material-ui/core'
import React from 'react'
import { MapProps } from './Map'

interface Props extends  MapProps {
    align?: 'left' | 'center' | 'right'
}

export const LocationInfo = ({ location, align }: Props) => {
    const textAlign = align ?? 'center';
    
    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Typography align={textAlign} >{location?.name} - {location?.kommune},</Typography>
            <Typography align={textAlign} variant='caption'>{location?.coordinates.lat},{location?.coordinates.lng}</Typography>
            <Typography align={textAlign} variant='caption'> {location?.fylke} </Typography>
        </div>
    )
}
