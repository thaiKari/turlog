import { useEffect, useState, useMemo } from 'react'
import { createStyles, Grid, InputAdornment, makeStyles, TextField, Theme, Typography, withStyles } from '@material-ui/core';
import { useRecoilState } from 'recoil';
import Autocomplete from '@material-ui/lab/Autocomplete';
import SearchIcon from '@material-ui/icons/Search';
import { debounce } from 'lodash';
import React from 'react';
import { GeoLocation, KartverkLocationSearch, selectedLocationState } from '../../data/location';
import LocationOnIcon from '@material-ui/icons/LocationOn';


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

export const Search = () => {
    const classes = useStyles();
    const [selectedLocation, setSelectedLocation] = useRecoilState<GeoLocation | null>(selectedLocationState);
    const [inputValue, setInputValue] = useState('');
    const [options, setAdressOptions] = useState<GeoLocation[]>([])

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
            setAdressOptions([]);
        }

        fetchSearchOptions(inputValue, (results: GeoLocation[]) => {
            if (active) {

                let newOptions = [] as GeoLocation[];

                if (selectedLocation) {
                    newOptions = [selectedLocation];
                }

                if (results) {
                    newOptions = [...newOptions, ...results];
                }

                setAdressOptions(newOptions);
            }
        });


        return () => {
            active = false;
        };

    }, [selectedLocation, inputValue, fetchSearchOptions]);



    return (
        <div className={classes.root}>
            <Autocomplete
                id="fritekstsok-demo"
                options={options}
                value={selectedLocation}
                getOptionLabel={(s: GeoLocation) => `${s.name}-${s.kommune}`}
                filterOptions={(x) => x}
                className={classes.autocomplete}
                autoComplete
                includeInputInList
                filterSelectedOptions
                onChange={(_, newValue: GeoLocation | null) => {
                    setAdressOptions(newValue ? [newValue, ...options] : options);
                    setSelectedLocation(newValue);
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