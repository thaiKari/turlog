import { Button, makeStyles, Typography } from '@material-ui/core'
import React from 'react'
import { useRecoilValue } from 'recoil';
import { isLoggedInState } from '../../data/user';
import { LoginButtons } from './LoginButtons';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        '& a':{
            textDecoration: 'none'
        }
    },
    title: {
        margin: theme.spacing(1),
    },

}));

export const LoginPage = () => {
    const classes = useStyles();
    const isLoggedIn = useRecoilValue(isLoggedInState);


    if (isLoggedIn) {
        return (
            <div className={classes.root}>
                <Typography paragraph>
                    You are already logged in.
                </Typography>
                <a href='/.auth/logout?post_logout_redirect_uri=/'>
                    <Button variant='contained' color='primary'>
                        Log out
                    </Button>
                </a>
            </div>
        )
    }

    return (
        <div className={classes.root}>
            <Typography className={classes.title} variant="h5" component="h2">
                Log in
            </Typography>
            <LoginButtons />
        </div>
    )
}
