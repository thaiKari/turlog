import { Button, makeStyles } from '@material-ui/core'
import MicrosoftButton from './icons/signInMicrosoft.png'
import GoogleButton from './icons/signInGoogle.png'
import FacebookButton from './icons/signInFacebook.png'
import React from 'react'
import { useHistory } from 'react-router-dom'

const useStyles = makeStyles((theme) => ({
    buttonImage: {
        height: 40
    }
}));


export const LoginButtons = () => {
    const classes = useStyles();
    const history = useHistory();


    return (
        <>
            <Button
                onClick={() => history.push('/.auth/login/facebook')}
            >
                <img className={classes.buttonImage} alt='Sign in with Facebook' src={FacebookButton} />
            </Button>

            <Button
                onClick={() => history.push('/.auth/login/google')}
            >
                <img className={classes.buttonImage} alt='Sign in with Google' src={GoogleButton} />
            </Button>
            <Button
                onClick={() => history.push('/.auth/login/aad')}
            >
                <img className={classes.buttonImage} alt='Sign in with Microsoft' src={MicrosoftButton} />
            </Button>
        </>
    )
}
