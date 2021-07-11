import React from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import { Container, useScrollTrigger } from '@material-ui/core';
import HomeIcon from '@material-ui/icons/Home';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
        },
        container: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start'
        },
        appbar:{
            backgroundColor: theme.palette.common.white,
            color: theme.palette.getContrastText(theme.palette.common.white),
        },
        margin :{
            margin: theme.spacing(2)
        }
    }),
);

interface Props {
    children: React.ReactElement;
  }

export const ElevationScroll:React.FC<Props> = ({children}) => {
    const trigger = useScrollTrigger({
        disableHysteresis: true,
        threshold: 0,
      });
    
      return React.cloneElement(children, {
        elevation: trigger ? 4 : 0,
      });
}


export const NavBar:React.FC = props => {
    const classes = useStyles();
    const history = useHistory();

    return (

        <><div className={classes.root}>
            <AppBar className={classes.appbar}>
                <Toolbar>
                    <Container fixed maxWidth="md" className={classes.container}>

                        <IconButton aria-label="home" onClick={() => history.push('/')}>
                            <HomeIcon />
                        </IconButton>
                    </Container>
                </Toolbar>
            </AppBar>
        </div><Toolbar className={classes.margin} /></>
    );
}