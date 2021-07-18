import { Divider, Grid, IconButton, makeStyles, Tooltip, Typography } from '@material-ui/core';
import React, { useEffect, useState } from 'react'
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { getTrip } from '../../data/data';
import { Trip } from '../../data/types';
import EditIcon from '@material-ui/icons/Edit';
import { useSetRecoilState } from 'recoil';
import { tripFormRedirectUrlState } from '../../data/state';
import { TripHeader } from './TripHeader';
import { TripPhotos } from './TripPhotos';
import { LocationInfo } from '../Location/LocationInfo';
import { Map } from '../Location/Map'
import { ContributorOnly } from '../Login/ContributorOnly';

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
        if (!trip) return;
        setTripFormRedirectUrl(location.pathname)
        history.push(`/trip/edit/${trip.id}`)
    }

    if (!trip) {
        return (<div>Loading...</div>)
    }

    return (
        <div>

            <div className={classes.header}>
                <div />
                <TripHeader textAlign='center' trip={trip} />
                <ContributorOnly>
                <Tooltip title='Edit Trip'>
                    <IconButton onClick={onEditClick} color='primary'>
                        <EditIcon />
                    </IconButton>
                </Tooltip>
                </ContributorOnly>
            </div>

            <Divider className={classes.gutterBottom} />

            {trip.images && <TripPhotos images={trip.images} />}

            {trip.description &&
                <>
                    <Typography variant="body2" className={classes.gutterBottom}>
                        {trip.description}
                    </Typography>
                    <Divider className={classes.gutterBottom} />
                </>}

            {trip.location &&

                    <Grid container spacing={0}className={classes.gutterBottom}>
                        <Grid item xs={12} sm={3} className={classes.gutterBottom}>
                            <Typography variant="body1">
                                <span style={{fontWeight:'bold'}}>
                                    Location
                                </span>
                            </Typography>
                            <LocationInfo align='left' location={trip.location} />
                        </Grid>
                        <Grid item xs={12} sm={9}>
                            <Map location={trip.location} />
                        </Grid>

                    </Grid>
            }
            
            <Divider className={classes.gutterBottom} />

            {trip.parking &&
                <>
                    <Typography variant="body1">
                        <span style={{fontWeight:'bold'}}>
                            Parking
                        </span>
                    </Typography><Typography variant="body2" component="p">
                        {trip.parking}
                    </Typography>
                </>
            }

        </div>
    )
}
