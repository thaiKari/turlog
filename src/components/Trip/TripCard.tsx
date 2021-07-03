import React from "react";
import { Trip } from "../../data/types";
import {Button, Card, CardActionArea, CardActions, CardContent, CardMedia, makeStyles, Typography} from '@material-ui/core';
import { useRecoilValue } from "recoil";
import { imagesBaseUrlState } from "../../data/state";

const useStyles = makeStyles((theme) =>({
  root: {
    maxWidth: 345,
    margin: theme.spacing(2)
  },
  media: {
    height: 140,
  },
  pos: {
    marginBottom: 12,
  },
}));

interface Props {
  trip: Trip;
}

export const TripCard: React.FC<Props> = ({ trip }) => {
  const classes = useStyles();
  const imagesUrl = useRecoilValue(imagesBaseUrlState);
  
  const getImageUrl = (images: string[] | undefined) : string => {
    let imageName = 'placeholder.png'    
    if(images && images[0]){
      imageName = images[0]
    }  

    return `${imagesUrl}${imageName}`
  }


  return  (
    <Card className={classes.root}>
      <CardActionArea>
        <CardMedia
          className={classes.media}
          image={getImageUrl(trip.images)}
          title="Contemplative Reptile"
        />
        <CardContent>
        
          <Typography variant="h5" component="h2">
            {trip.name}
          </Typography> 
          <Typography gutterBottom className={classes.pos} color="textSecondary" >
            {trip.date.toLocaleDateString()}
          </Typography>         
          <Typography variant="body2" component="p">
            {trip.description ? trip.description: ''}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button size="small" color="primary">
          See More
        </Button>
      </CardActions>
    </Card>
  );;
};




