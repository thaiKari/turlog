import { makeStyles, Theme, createStyles, ImageList, ImageListItem, Button, Collapse, Paper } from '@material-ui/core';
import React, { useState } from 'react'
import { useRecoilValue } from 'recoil';
import { imagesBaseUrlState, isMobileState } from '../../data/state';


interface Props {
    images: string[]
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-around',
            overflow: 'hidden',
            backgroundColor: theme.palette.background.paper,
            marginBottom: theme.spacing(2)
        },
        seeMore: {
            width: '100%',
            marginTop: theme.spacing(0.3),
        }

    }),
);

export const TripPhotos = ({ images }: Props) => {
    const classes = useStyles();
    const imagesUrl = useRecoilValue(imagesBaseUrlState);
    const isMobile = useRecoilValue(isMobileState)
    const [seeMore, setseeMore] = useState(false)

    let cols = isMobile ? 2 : 3
    if(images.length < cols){
        cols = images.length
    }
    const src = (imageName: string) => `${imagesUrl}${imageName}`
    const rowHeight = (images.length === 1 || (images.length === 2 && !isMobile)) ? 320 : 160;
    const numRows = 2;
    const collapsedSize = rowHeight * numRows;
    const maxNumImagesCollapsed = numRows * cols;
    const collapsable = images.length > maxNumImagesCollapsed;

    const ImageListComponent = () => {
        return (
            <>
                <ImageList rowHeight={rowHeight} style={{ overflow: 'hidden' }} cols={cols}>
                    {images.map((image) => (
                        <ImageListItem key={image} cols={1}>
                            <img src={src(image)} alt={'trip'} />
                        </ImageListItem>
                    ))}
                </ImageList>
            </>
        )
    }

    if(!collapsable){
        return <div className={classes.root}>{ImageListComponent()}</div>
    }

    return (
        <Paper className={classes.root}>
            <Collapse in={seeMore} collapsedSize={collapsedSize}>
                {ImageListComponent()}
            </Collapse>
            {collapsable && <Button className={classes.seeMore} onClick={() => setseeMore(!seeMore)}>
                {seeMore ? 'See Less' : 'See More'}
            </Button>}
        </Paper>
    )
}
