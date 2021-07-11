import { makeStyles, Typography } from '@material-ui/core'
import React from 'react'
import { Trip } from '../../data/types'

interface Props {
    trip: Trip;
}

const useStyles = makeStyles((theme) => ({
    pos: {
        marginBottom: theme.spacing(2),
    }
}));

export const TripHeader = ({ trip }: Props) => {
    const classes = useStyles();

    return (
        <div>
            <Typography variant="h5" component="h2">
                {trip.name}
            </Typography>
            <Typography gutterBottom className={classes.pos} color="textSecondary" >
                {trip.date.toLocaleDateString()}
            </Typography>
        </div>
    )
}
