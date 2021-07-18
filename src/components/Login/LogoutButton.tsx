import { Button, MenuItem } from '@material-ui/core'
import React from 'react'

interface Props {
    buttonStyle?: 'menu'
}

export const LogoutButton = ({ buttonStyle: style }: Props) => {

    let content = <Button variant='contained' color='primary' >
        Log out
    </Button>

    if (style === 'menu') {
        content = <MenuItem >Log out</MenuItem>
    }

    return (
        <a style={{ textDecoration: 'none', color: 'inherit' }} href='/.auth/logout?post_logout_redirect_uri=/'>
            {content}
        </a>
    )
}
