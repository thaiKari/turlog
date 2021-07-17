import { useEffect, useState, useMemo } from 'react'
import { createStyles, Grid, InputAdornment, makeStyles, TextField, Theme, Typography, withStyles } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import SearchIcon from '@material-ui/icons/Search';
import { debounce } from 'lodash';
import React from 'react';
import { GeoLocation, KartverkLocationSearch } from '../../data/location';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import { LocationSelectionProps } from './LocationSelection';


const CustomTextField = withStyles((theme: Theme) => ({
    root: {
        borderRadius: 10,
        '& .MuiInputBase-root': {
            paddingRight: `${theme.spacing(2)}px !important`,
        },
        '& .MuiAutocomplete-inputRoot': {
            padding: `${theme.spacing(1)}px !important`,
        },
    },
}))(TextField);

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width:'100%'
        },
        autocomplete: {
            width:'100%'
        },
        searchIcon: {
            opacity: 0.5
        },
        icon: {
            color: theme.palette.text.secondary,
            marginRight: theme.spacing(2),
          },
    }),
);

export const Search = ({location, handleLocationChange}: LocationSelectionProps) => {
    const classes = useStyles();
    const [inputValue, setInputValue] = useState('');
    const [options, setOptions] = useState<GeoLocation[]>([])

    const fetchSearchOptions = useMemo(
        () =>
            debounce(async (input: string, callback: (results: GeoLocation[]) => void) => {
                if (input) {
                    var results  = await KartverkLocationSearch(input)
                    callback(results)
                }
            }, 150),
        [],
    );


    useEffect(() => {
        let active = true;

        if (inputValue === '') {
            setOptions([]);
        }

        fetchSearchOptions(inputValue, (results: GeoLocation[]) => {
            if (active) {

                let newOptions = [] as GeoLocation[];

                if (location) {
                    newOptions = [location];
                }

                if (results) {
                    newOptions = [...newOptions, ...results];
                }

                setOptions(newOptions);
            }
        });


        return () => {
            active = false;
        };

    }, [location, inputValue, fetchSearchOptions]);

    return (
        <div className={classes.root}>
            <Autocomplete
                id="fritekstsok-demo"
                options={options}
                value={location ?? null}
                getOptionLabel={(s: GeoLocation) => `${s.name}-${s.kommune}`}
                filterOptions={(x) => x}
                className={classes.autocomplete}
                autoComplete
                includeInputInList
                filterSelectedOptions
                onChange={(_, newValue: GeoLocation | null ) => {
                    setOptions(newValue ? [newValue, ...options] : options);
                    handleLocationChange(newValue );
                }}
                onInputChange={(_, newInputValue) => {
                    setInputValue(newInputValue);
                }}
                renderInput={(params: any) =>
                    <CustomTextField
                        {...params}
                        id="standard-basic"
                        variant="outlined"
                        label="Location"
                        InputProps={{
                            ...params.InputProps,
                            endAdornment:
                                <InputAdornment position="end">
                                    <SearchIcon className={classes.searchIcon} />
                                </InputAdornment>
                        }}
                    />}
                    renderOption={(option) => {

                
                        return (
                          <Grid container alignItems="center">
                            <Grid item>
                              <LocationOnIcon className={classes.icon} />
                            </Grid>
                            <Grid item xs>                             
                                <Typography>
                                  {option.name}
                                </Typography>
                            
                              <Typography variant="caption" color="textSecondary">
                                {`${option.type} - ${option.kommune}, ${option.fylke}`}
                              </Typography>
                            </Grid>
                          </Grid>
                        );
                      }}
            />
        </div>

    )
}