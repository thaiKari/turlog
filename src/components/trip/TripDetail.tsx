import { Box, Divider, IconButton, makeStyles, Tooltip, Typography } from '@material-ui/core';
import React, { useEffect, useState } from 'react'
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { getTrip } from '../../data/data';
import { Trip } from '../../data/types';
import EditIcon from '@material-ui/icons/Edit';
import { useSetRecoilState } from 'recoil';
import { tripFormRedirectUrlState } from '../../data/state';
import { TripHeader } from './TripHeader';

const useStyles = makeStyles((theme) => ({
    gutterBottom: {
        marginBottom: theme.spacing(2),
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between'
    }
}));

export const TripDetail = () => {
    const history = useHistory();
    const location = useLocation();
    const classes = useStyles();
    const { id } = useParams<{ id: string }>();
    const [trip, settrip] = useState<Trip | null>(null);
    const setTripFormRedirectUrl = useSetRecoilState(tripFormRedirectUrlState)

    useEffect(() => {
        const fetchTrip = async () => {
            const trip = await getTrip(id)
            settrip(trip)
        }
        fetchTrip();
    }, [id])

    const onEditClick = () => {
        if(!trip) return;
        setTripFormRedirectUrl(location.pathname)
        history.push(`/trip/edit/${trip.id}`)
    }

    if (!trip) {
        return (<div>Loading...</div>)
    }

    return (
        <div>
            {/* Photo Section */}
            <div className={classes.header}>
                <div />
                <TripHeader trip={trip} />
                <Tooltip title='Edit Trip'>
                    <IconButton onClick={onEditClick} color='primary'>
                        <EditIcon />
                    </IconButton>
                </Tooltip>
            </div>

            <Divider className={classes.gutterBottom} />

            {trip.description &&
                <>
                    <Typography variant="body2" className={classes.gutterBottom}>
                        {trip.description}
                    </Typography>
                    <Divider className={classes.gutterBottom} />
                </>}

            {trip.parking &&
                <>
                    <Typography variant="body1">
                        <Box fontWeight="fontWeightBold">
                            Parking
                        </Box>
                    </Typography><Typography variant="body2" component="p">
                        {trip.parking}
                    </Typography>
                </>
            }

        </div>
    )
}
