import React from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import { Container, Tooltip } from '@material-ui/core';
import HomeIcon from '@material-ui/icons/Home';
import { useHistory, useLocation } from 'react-router-dom';
import AddIcon from '@material-ui/icons/Add';
import { ContributorOnly } from '../Login/ContributorOnly';
import { LoginNavButton } from '../Login/LoginNavButton';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
        },
        container: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
        },
        appbar: {
            backgroundColor: theme.palette.common.white,
            color: theme.palette.getContrastText(theme.palette.common.white),
        },
        margin: {
            margin: theme.spacing(2)
        },
        section:{
            display: 'flex',
            flexBasis:'column',
            justifyContent: 'center',
            alignItems: 'center'
        }
    }),
);



export const NavBar: React.FC = () => {
    const classes = useStyles();
    const history = useHistory();
    const location = useLocation();

    const isHome = location.pathname === '/'

    return (
        <>
            <div className={classes.root}>
                <AppBar className={classes.appbar}>
                    <Toolbar>
                        <Container className={classes.container}>
                            <IconButton aria-label="home" onClick={() => history.push('/')}>
                                <HomeIcon />
                            </IconButton>

                            <div className={classes.section}>
                                <ContributorOnly>
                                    {isHome &&
                                        <Tooltip title='Add Trip'>
                                            <IconButton aria-label="home" onClick={() => history.push('/trip/new')}>
                                                <AddIcon />
                                            </IconButton>
                                        </Tooltip>
                                    }
                                </ContributorOnly>
                                <LoginNavButton />
                            </div>

                        </Container>
                    </Toolbar>
                </AppBar>
            </div>
            <Toolbar className={classes.margin} />
        </>
    );
}