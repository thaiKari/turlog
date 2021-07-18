import { makeStyles, Typography } from '@material-ui/core'
import React from 'react'
import { useRecoilValue } from 'recoil';
import { isLoggedInState } from '../../data/user';
import { LoginButtons } from './LoginButtons';
import { LogoutButton } from './LogoutButton';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',        
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
                <LogoutButton post_logout_redirect_uri={'/login'}/>                
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
