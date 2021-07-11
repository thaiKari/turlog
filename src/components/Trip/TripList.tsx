import { Grid, makeStyles } from "@material-ui/core";
import React from "react";
import { useRecoilValue } from "recoil";
import { tripsState } from "../../data/state";
import { AddTripButton } from "./AddTripButton";
import { TripCard } from "../Card/TripCard";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    height: 140,
    width: 100,
  },
  control: {
    padding: theme.spacing(2),
  },
}));


export const TripList = () => {
  const classes = useStyles();
  const trips = useRecoilValue(tripsState);

  return (
    <>
      <AddTripButton />
      <Grid container className={classes.root} spacing={2}>

        {trips && trips.map((t) => (
          <Grid key={t.id} item xs={12} sm={4}>
            <TripCard trip={t} />
          </Grid>
        ))}
      </Grid>
    </>

  );
};

