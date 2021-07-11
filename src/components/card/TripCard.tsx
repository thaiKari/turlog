import React from "react";
import { Trip } from "../../data/types";
import { Card, CardActionArea, CardContent, CardMedia, makeStyles, Typography } from '@material-ui/core';
import { useRecoilValue } from "recoil";
import { imagesBaseUrlState } from "../../data/state";
import { TripCardActions } from "./TripCardActions";
import { useHistory } from "react-router-dom";
import { TripHeader } from "../Trip/TripHeader";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
    margin: theme.spacing(2)
  },
  media: {
    height: 140,
  }
}));

interface Props {
  trip: Trip;
}

export const TripCard: React.FC<Props> = ({ trip }) => {
  const classes = useStyles();
  const imagesUrl = useRecoilValue(imagesBaseUrlState);
  const history = useHistory()

  const getImageUrl = (images: string[] | undefined): string => {
    let imageName = 'placeholder.png'
    if (images && images[0]) {
      imageName = images[0]
    }

    return `${imagesUrl}${imageName}`
  }


  return (
    <div>
      <Card className={classes.root}>
        <CardActionArea onClick={()=> history.push(`/trip/${trip.id}`)}>
          <CardMedia
            className={classes.media}
            image={getImageUrl(trip.images)}
            title="Contemplative Reptile"
          />
          <CardContent>
            <TripHeader trip={trip}/>
            <Typography variant="body2" component="p">
              {trip.description ? trip.description : ''}
            </Typography>
          </CardContent>
        </CardActionArea>
        <TripCardActions trip={trip} />
      </Card>
    </div>
  );;
};




