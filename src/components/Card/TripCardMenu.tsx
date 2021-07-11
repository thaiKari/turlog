import { CircularProgress, DialogActions } from '@material-ui/core';
import { Button, Dialog, DialogContent, DialogContentText, DialogTitle, makeStyles, Menu, MenuItem } from '@material-ui/core'
import { red } from '@material-ui/core/colors';
import React, { useState } from 'react'
import { useHistory } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { deleteTrip } from '../../data/data';
import { updateTripsState } from '../../data/state';
import { Trip } from '../../data/types';
import clsx from 'clsx';


const useStyles = makeStyles((theme) => ({
    actions: {
        display: 'flex',
        justifyContent: 'flex-end'
    },
    deleteButton: {
        backgroundColor: red[500],
        color: theme.palette.getContrastText(red[500]),
        '&:hover': {
            backgroundColor: red[700],
            color: theme.palette.getContrastText(red[700])
        },

    },
    wrapper: {
        margin: theme.spacing(1),
        position: 'relative',
    },
    buttonProgress: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
    }
}));

interface Props {
    trip: Trip;
    anchorEl: HTMLElement | null;
    setAnchorEl: (value: React.SetStateAction<HTMLElement | null>) => void;
}

export const TripCardMenu = ({ trip, anchorEl, setAnchorEl }: Props) => {
    const classes = useStyles();
    const history = useHistory();
    const updateTrips = useSetRecoilState(updateTripsState);
    const [dialogOpen, setdialogOpen] = useState(false);
    const [deleting, setdeleting] = useState(false)

    const onEditClick = (event: React.MouseEvent<HTMLLIElement>) => {
        history.push(`/trip/edit/${trip.id}`);
    };

    const onDeleteClick = () => {
        setdialogOpen(true);
        setAnchorEl(null);
    };

    const handleDelete = async () => {
        setdeleting(true);
        await deleteTrip(trip.id);
        updateTrips(n => n + 1);
        setdialogOpen(false);
        setdeleting(false);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleDialogClose = () => {
        setdialogOpen(false);
    };

    return (
        <>
            <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={onEditClick}>Edit</MenuItem>
                <MenuItem onClick={onDeleteClick}>Delete</MenuItem>
            </Menu>
            <Dialog
                onClose={handleDialogClose}
                open={dialogOpen}>

                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>


                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to delete the trip {trip.name} ?
                    </DialogContentText>

                    <DialogActions>
                        <Button onClick={handleDialogClose}>
                            Cancel
                        </Button>
                        <div className={classes.wrapper}>
                            <Button onClick={handleDelete}
                            className={clsx({
                                [classes.deleteButton]: !deleting,
                              })} >
                                Delete
                            </Button>
                            {deleting &&
                                <CircularProgress
                                    size={24}
                                    className={classes.buttonProgress}
                                    />}
                        </div>
                    </DialogActions>

                </DialogContent>
            </Dialog>
        </>
    )
}
