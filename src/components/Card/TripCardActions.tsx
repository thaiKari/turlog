import { CardActions, Button, IconButton, makeStyles } from '@material-ui/core'
import React, { useState } from 'react'
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { Trip } from '../../data/types';
import { TripCardMenu } from './TripCardMenu';
import { useHistory } from 'react-router-dom';
import {  ContributorOnly } from '../Login/ContributorOnly';

const useStyles = makeStyles((theme) => ({
    actions: {
        display: 'flex',
        justifyContent: 'space-between'
    }
}));


interface Props {
    trip: Trip;
}


export const TripCardActions: React.FC<Props> = ({ trip }) => {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const history = useHistory();

    const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    return (
        <>
            <CardActions className={classes.actions} >
                <Button onClick={() => history.push(`/trip/${trip.id}`)} size="small" color="primary">
                    See More
                </Button>

                <ContributorOnly>
                    <IconButton size="small" onClick={handleMenuClick} >
                        <MoreVertIcon fontSize="inherit" />
                    </IconButton>
                </ContributorOnly>

            </CardActions>
            <ContributorOnly>
                <TripCardMenu
                    trip={trip}
                    anchorEl={anchorEl}
                    setAnchorEl={setAnchorEl}
                />
            </ContributorOnly>

        </>
    )
}
