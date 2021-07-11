import { makeStyles, Typography } from '@material-ui/core'
import React from 'react'
import { Trip } from '../../data/types'

interface Props {
    trip: Trip;
    textAlign?: 'center';

}

const useStyles = makeStyles((theme) => ({
    pos: {
        marginBottom: theme.spacing(2),
    }
}));

export const TripHeader = ({ trip, textAlign }: Props) => {
    const classes = useStyles();
    const align = textAlign ?? 'left'

    return (
        <div>
            <Typography style={{textAlign: align}} variant="h5" component="h2">
                {trip.name}
            </Typography>
            <Typography  style={{textAlign: align}} gutterBottom className={classes.pos} color="textSecondary" >
                {trip.date.toLocaleDateString()}
            </Typography>
        </div>
    )
}
