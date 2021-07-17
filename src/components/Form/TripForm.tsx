import React, { useCallback, useEffect, useState } from 'react'
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { editingTripState, getNewTrip, imageFilesState, tripFormRedirectUrlState, updateTripsState } from '../../data/state';
import { FormControl, TextField, Grid, makeStyles, Button } from '@material-ui/core';
import { Typography } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { createOrUpdateTrip } from '../../data/data';
import { ImageUploader } from './ImageUploader';
import { LocationSelection } from '../Location/LocationSelection';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        '& .MuiFormControl-marginNormal': {
            margin: `0px !important`,
        },
        maxWidth: 800,
    },
    title: {
        marginBottom: theme.spacing(4)
    },
    formItem: {
        width: '100%'
    },
    form: {
        marginBottom: theme.spacing(4)
    },
    button: {
        marginRight: theme.spacing(2)
    }
}));

interface Props {
    title: string
}

export const TripForm = ({ title }: Props) => {
    const classes = useStyles();
    const setEditingTrip = useSetRecoilState(editingTripState)
    const forceResetTrips = useSetRecoilState(updateTripsState);
    const resetTrips = () => forceResetTrips((n) => n + 1);
    const trip = useRecoilValue(editingTripState) ?? getNewTrip();
    const history = useHistory();
    const [loading, setloading] = useState(false)
    const [imageFiles, setImageFiles] = useRecoilState(imageFilesState);
    const [tripFormRedirectUrl, settripFormRedirectUrl] = useRecoilState(tripFormRedirectUrlState)

    const handleDateChange = useCallback((date: Date | null) => {
        if (!date) return;
        setEditingTrip({ ...trip, date: date });
    }, [setEditingTrip, trip]);


    useEffect(() => {
        if (!imageFiles) return;
        if (imageFiles.length > 0) {
            const suggestion = imageFiles[0].dateSuggestion
            if (!suggestion) return;
            if (!trip.date) {
                handleDateChange(suggestion);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [handleDateChange, imageFiles])

    const redirect = () => {
        let url = (tripFormRedirectUrl ?? '/').slice();
        settripFormRedirectUrl('');
        history.push(url)
    }

    const onSubmit = async () => {
        setloading(true)
        await createOrUpdateTrip(trip, imageFiles);
        setImageFiles([])
        setloading(false)
        resetTrips()
        setEditingTrip(getNewTrip())
        redirect()
    }

    const onRemoveImage = useCallback(
        (imageName: string) => {
            setEditingTrip({
                ...trip,
                images: trip.images?.filter(n => n !== imageName)
            })
        },
        [setEditingTrip, trip],
    )

    const onCancel = () => {
        setImageFiles([])
        setEditingTrip(getNewTrip());
        redirect();
    }


    const onTextFieldChangeHandler = (fieldId: 'name' | 'description' | 'parking') => (e: any) => {

        let tripCopy = { ...trip };
        tripCopy[fieldId] = e.target.value

        setEditingTrip(tripCopy);
    }

    if (loading) {
        return <div>Saving Trip ...</div>
    }


    return (
        <div className={classes.root} >
            <Typography variant='h4' align='center' className={classes.title}>{title}</Typography>
            <Grid container spacing={2} className={classes.form}>
                <Grid item xs={12} sm={12}>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker
                            className={classes.formItem}
                            disableToolbar
                            variant="inline"
                            format="MM/dd/yyyy"
                            label="Date"
                            value={trip.date}
                            onChange={handleDateChange}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                            inputVariant="outlined"
                        />
                    </MuiPickersUtilsProvider>

                </Grid>

                <Grid item xs={12} sm={12}>
                    <FormControl style={{ width: '100%' }}>
                        <TextField
                            className={classes.formItem}
                            value={trip.name ?? ''}
                            onChange={onTextFieldChangeHandler('name')}
                            label="Trip Name"
                            variant="outlined"
                        />
                    </FormControl>
                </Grid>

                <Grid item xs={12} sm={12}>
                    <FormControl style={{ width: '100%' }}>
                        <TextField
                            className={classes.formItem}
                            value={trip.description ?? ''}
                            onChange={onTextFieldChangeHandler('description')}
                            label="Description"
                            multiline
                            maxRows={10}
                            variant="outlined"
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={12}>
                    <FormControl style={{ width: '100%' }}>
                        <TextField
                            className={classes.formItem}
                            value={trip.parking ?? ''}
                            onChange={onTextFieldChangeHandler('parking')}
                            label="Parking"
                            multiline
                            maxRows={10}
                            variant="outlined"
                        />
                    </FormControl>
                </Grid>

                <Grid item xs={12} sm={12}>
                    <FormControl style={{ width: '100%' }}>
                        <ImageUploader onRemoveImage={onRemoveImage} />
                    </FormControl>
                </Grid>

                <Grid item xs={12} sm={12}>
                    <LocationSelection />
                </Grid>

            </Grid>

            <Button className={classes.button} variant='contained' color='primary' onClick={onSubmit}>
                Save
            </Button>
            <Button className={classes.button} variant='outlined' color='primary' onClick={onCancel}>
                Cancel
            </Button>
        </div>
    )
}
