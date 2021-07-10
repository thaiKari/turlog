import React, { useState } from "react";
import { Trip } from "../../data/types";
import { Button, Card, CardActionArea, CardActions, CardContent, CardMedia, IconButton, makeStyles, Menu, MenuItem, Typography } from '@material-ui/core';
import { useRecoilValue, useSetRecoilState } from "recoil";
import { imagesBaseUrlState, updateTripsState } from "../../data/state";
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { useHistory } from "react-router-dom";
import { deleteTrip } from "../../data/data";

const useStyles = makeStyles((theme) => ({
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
  actions: {
    display: 'flex',
    justifyContent: 'space-between'
  }
}));

interface Props {
  trip: Trip;
}

export const TripCard: React.FC<Props> = ({ trip }) => {
  const classes = useStyles();
  const imagesUrl = useRecoilValue(imagesBaseUrlState);
  const updateTrips = useSetRecoilState(updateTripsState);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const history = useHistory();

  const getImageUrl = (images: string[] | undefined): string => {
    let imageName = 'placeholder.png'
    if (images && images[0]) {
      imageName = images[0]
    }

    return `${imagesUrl}${imageName}`
  }

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => { 
    setAnchorEl(event.currentTarget);
  };
  

  const onEditClick = (event: React.MouseEvent<HTMLLIElement>) => {
    history.push(`/trip/edit/${trip.id}`);
  };

  const onDeleteClick = async (event: React.MouseEvent<HTMLLIElement>) => {
    await deleteTrip(trip.id);
    updateTrips(n => n+1);
    setAnchorEl(null);
  };


  const handleMenuClose = () => {
    setAnchorEl(null);
  };


  return (
    <div>
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
              {trip.description ? trip.description : ''}
            </Typography>
          </CardContent>
        </CardActionArea>
        <CardActions className={classes.actions} >
          <Button size="small" color="primary">
            See More
          </Button>
          <IconButton size="small" onClick={handleMenuClick} >
            <MoreVertIcon fontSize="inherit" />
          </IconButton>
        </CardActions>
      </Card>
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
    </div>
  );;
};




