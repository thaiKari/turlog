import { Button, makeStyles } from '@material-ui/core'
import MicrosoftButton from './icons/signInMicrosoft.png'
import GoogleButton from './icons/signInGoogle.png'
import FacebookButton from './icons/signInFacebook.png'
import React from 'react'

const useStyles = makeStyles((theme) => ({
    buttonImage: {
        height: 40
    }
}));


export const LoginButtons = () => {
    const classes = useStyles();

    return (
        <>
            <Button>
                <a href='/.auth/login/facebook'>
                    <img className={classes.buttonImage} alt='Sign in with Facebook' src={FacebookButton} />
                </a>
            </Button>

            <Button>
                <a href='/.auth/login/google'>
                    <img className={classes.buttonImage} alt='Sign in with Google' src={GoogleButton} />
                </a>
            </Button>
            <Button>
                <a href='/.auth/login/aad'>
                    <img className={classes.buttonImage} alt='Sign in with Microsoft' src={MicrosoftButton} />
                </a>
            </Button>
        </>
    )
}
