import { Button, ClickAwayListener, createStyles, Grow, makeStyles, MenuList, Paper, Popper, Theme, Typography } from '@material-ui/core'
import React, { Suspense } from 'react'
import { useRecoilValue } from 'recoil'
import { isLoggedInState, userState } from '../../data/user'
import PersonIcon from '@material-ui/icons/Person';
import { LogoutButton } from './LogoutButton';
import { LoginButtons } from './LoginButtons';

const useStyle = makeStyles((theme: Theme) =>
    createStyles({
        paper: {
            padding: theme.spacing(1),
        },
        menuHeader: {
            marginLeft: theme.spacing(2)
        },
        button: {
            color: theme.palette.text.secondary
        }
    }),
);

interface ButtonWithMenuProps {
    menuButton:  JSX.Element,
    menuContent:  JSX.Element
}

const ButtonWithMenu = ({ menuButton, menuContent }: ButtonWithMenuProps) => {
    const classes = useStyle();
    const [open, setOpen] = React.useState(false);
    const anchorRef = React.useRef<HTMLButtonElement>(null);


    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event: React.MouseEvent<EventTarget>) => {
        if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
            return;
        }

        setOpen(false);
    };

    const prevOpen = React.useRef(open);
    React.useEffect(() => {
        if (prevOpen.current === true && open === false) {
            anchorRef.current!.focus();
        }

        prevOpen.current = open;
    }, [open]);

    return (
        <div>
            <Button
                ref={anchorRef}
                aria-controls={open ? 'menu-list-grow' : undefined}
                aria-haspopup="true"
                onClick={handleToggle}
                className={classes.button}
            >
                {menuButton}
            </Button>
            <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
                {({ TransitionProps, placement }) => (
                    <Grow
                        {...TransitionProps}
                        style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
                    >
                        <Paper className={classes.paper}>
                            <ClickAwayListener onClickAway={handleClose}>
                                <MenuList autoFocusItem={open} id="menu-list-grow" >
                                {menuContent}
                                </MenuList>
                            </ClickAwayListener>
                        </Paper>
                    </Grow>
                )}
            </Popper>
        </div>
    )
}

const Login = () => {
    const menuButton = <div>Log In</div>
    const menuContent = <LoginButtons/>
    
    return (
        <ButtonWithMenu
            menuButton={menuButton}
            menuContent={menuContent}
        />
    )
}

const LoggedIn = () => {
    const classes = useStyle();
    const user = useRecoilValue(userState)

    const menuButton = <PersonIcon />
    const menuContent = <div>
        <Typography className={classes.menuHeader} color='textSecondary' paragraph>
            {user.clientPrincipal?.userDetails}
        </Typography>
        <LogoutButton buttonStyle={'menu'} />
    </div>


    return (
        <ButtonWithMenu
            menuButton={menuButton}
            menuContent={menuContent}
        />
    )
}


export const LoginNavButtonContent = () => {
    const isLoggedIn = useRecoilValue(isLoggedInState)


    if (isLoggedIn) return <LoggedIn />

    return <Login />
}


export const LoginNavButton = () => {
    return (
        <Suspense fallback={<></>}>
            <LoginNavButtonContent />
        </Suspense>)
}
