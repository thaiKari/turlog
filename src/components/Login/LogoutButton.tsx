import { Button, MenuItem } from '@material-ui/core'
import React from 'react'

interface Props {
    buttonStyle?: 'menu'
    post_logout_redirect_uri?: string
}

export const LogoutButton = ({ buttonStyle, post_logout_redirect_uri }: Props) => {

    let content = <Button variant='contained' color='primary' >
        Log out
    </Button>

    if (buttonStyle === 'menu') {
        content = <MenuItem >Log out</MenuItem>
    }

    const logoutParams = post_logout_redirect_uri 
    ? `?post_logout_redirect_uri=${post_logout_redirect_uri}`
     : '' 

    return (
        <a style={{ textDecoration: 'none', color: 'inherit' }} href={`/.auth/logout${logoutParams}`}>
            {content}
        </a>
    )
}
