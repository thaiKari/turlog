import React, { useEffect } from 'react'
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { editingTripState, getNewTrip } from '../../data/state';
import { Trip } from '../../data/types';
import { createCopy } from '../../data/util';
import { FormControl, TextField, Grid, makeStyles } from '@material-ui/core';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        '& .MuiFormControl-marginNormal': {
            margin: `0px !important`,
        },
        maxWidth: 800,
    },
    title:{
        marginBottom: theme.spacing(4)
    },
    formItem: {
        width: '100%'
    }
}));

interface Props {

}

export const NewTrip = (props: Props) => {
    const classes = useStyles();
    const setEditingTrip = useSetRecoilState(editingTripState)
    const trip = useRecoilValue(editingTripState)

    useEffect(() => {
        setEditingTrip(getNewTrip());
    }, [setEditingTrip])

    const onSubmit = async (trip: Trip) => {
        // const submitted = await createNewTrip(Trip);
        // setEditingTrip(getNewTrip());        

        // return submitted;

        console.log('submit ', trip)
    }

    const onCancel = async (trip: Trip) => {
        setEditingTrip(getNewTrip());
    }


    const handleDateChange = (date: Date | null) => {
        let tripCopy = createCopy(trip);
        tripCopy.date = date
        setEditingTrip(tripCopy);
    };

    const onTextFieldChangeHandler = (fieldId: 'name' | 'description') => (e: any) => {

        let tripCopy = createCopy(trip);
        tripCopy[fieldId] = e.target.value

        setEditingTrip(tripCopy);
    }

    return (
        <div className={classes.root} >
        <Typography variant='h4' align='center' className={classes.title}>New Trip</Typography>
        <Grid container spacing={2}>
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
                <FormControl style={{width:'100%'}}>
                    <TextField
                        className={classes.formItem}
                        value={trip.name}
                        onChange={onTextFieldChangeHandler('name')}
                        label="Trip Name"
                        variant="outlined"
                    />
                </FormControl>
            </Grid>

            <Grid item xs={12} sm={12}>
                <FormControl style={{width:'100%'}}>
                    <TextField
                        className={classes.formItem}
                        value={trip.description}
                        onChange={onTextFieldChangeHandler('description')}
                        label="Description"
                        multiline
                        rowsMax={10}
                        variant="outlined"
                    />
                </FormControl>
            </Grid>

        </Grid>
        </div>
    )
}
