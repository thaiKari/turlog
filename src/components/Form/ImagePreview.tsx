import { IconButton, makeStyles } from '@material-ui/core';
import CancelIcon from '@material-ui/icons/Cancel';
import React from 'react';

const useStyles = makeStyles((theme) => ({
    thumbsContainer: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 16
    },
    thumb: {
        display: 'inline-flex',
        borderRadius: 2,
        border: '1px solid #eaeaea',
        marginBottom: 8,
        marginRight: 8,
        width: 100,
        height: 100,
        padding: 4,
        boxSizing: 'border-box'
    },
    thumbInner: {
        display: 'flex',
        minWidth: 0,
        overflow: 'hidden'
    },
    img: {
        display: 'block',
        width: 'auto',
        height: '100%'
    },
    deleteParent: {
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        width: 100,
        position: 'absolute',
        marginTop: -10
    }
}));


interface Props {
    src: string,
    onRemove: () => void
}

export const ImagePreview = ({  src, onRemove }: Props) => {
    const classes = useStyles();
    
    return (
        <div className={classes.thumb}>
            <div className={classes.thumbInner}>
                <img
                    src={src}
                    className={classes.img}
                    alt={'preview'}
                />
                <div className={classes.deleteParent}>
                    <IconButton onClick={onRemove} aria-label="delete">
                        <CancelIcon />
                    </IconButton>
                </div>
            </div>
        </div>
    )
}
