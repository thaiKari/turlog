import { makeStyles, Typography } from '@material-ui/core'
import React from 'react'
import { LoginButtons } from './LoginButtons';

const useStyles = makeStyles((theme) => ({
    root: {
        width:'100%',
        display:'flex',
        flexDirection:'column',
        alignItems:'center',
    },
    title: {
        margin: theme.spacing(1),
    },

}));

export const LoginPage = () => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Typography className={classes.title} variant="h5" component="h2">
                Login
            </Typography>
            <LoginButtons/>            
        </div>
    )
}
