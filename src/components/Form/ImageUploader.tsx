import { IconButton, makeStyles, useTheme } from '@material-ui/core';
import { Theme } from '@material-ui/core';
import React, { ReactNode, useEffect, useMemo, useState } from 'react'
import { useDropzone, FileWithPath } from 'react-dropzone'
import { useRecoilState } from 'recoil';
import { editingTripState } from '../../data/state';
import { ImageFile, TripWithImageFiles } from '../../data/types';
import { createCopy } from '../../data/util';
import CancelIcon from '@material-ui/icons/Cancel';

interface Props {

}

const baseStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    borderWidth: 2,
    borderRadius: 2,
    borderColor: '#eeeeee',
    borderStyle: 'dashed',
    backgroundColor: '#fafafa',
    color: '#bdbdbd',
    outline: 'none',
    transition: 'border .24s ease-in-out'
};
const activeStyle = (theme: Theme) => ({
    borderColor: theme.palette.action.active
});

const acceptStyle = (theme: Theme) => ({
    borderColor: theme.palette.action.active
});

const rejectStyle = {
    borderColor: 'red'
};

const useStyles = makeStyles((theme) => ({
    thumbsContainer: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 16
    },
    thumb:{
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
    thumbInner:  {
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



export const ImageUploader = (props: Props) => {
    const classes = useStyles();
    const theme = useTheme()
    const { acceptedFiles, getRootProps, getInputProps,
        isDragActive,
        isDragAccept,
        isDragReject } = useDropzone({
            accept: 'image/*'
        });

    const [images, setimages] = useState<ImageFile[]>([]);
    const [editingTrip, setEditingTrip] = useRecoilState<TripWithImageFiles>(editingTripState);

    const style = useMemo(() => ({
        ...baseStyle,
        ...(isDragActive ? activeStyle(theme) : {}),
        ...(isDragAccept ? acceptStyle(theme) : {}),
        ...(isDragReject ? rejectStyle : {})
    } as React.CSSProperties), [isDragActive, theme, isDragAccept, isDragReject]);

    useEffect(() => {
        let imagesCopy: ImageFile[] = createCopy(images)
        acceptedFiles.forEach((file: FileWithPath) => {
            if (imagesCopy.filter(f => f.path === file.path).length === 0) {
                let myFile = file as ImageFile;
                myFile.preview = URL.createObjectURL(file);
                imagesCopy.push(myFile);
            }
        });

        setimages(imagesCopy)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [acceptedFiles])

    useEffect(() => {
        let tripCopy: TripWithImageFiles = createCopy(editingTrip)
        tripCopy.imageFiles = images;
        tripCopy.images = images.map(i => i.name)
        setEditingTrip(tripCopy)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [images])

    const removeImage = (name: string): void => {
        setimages(images.filter(i => i.name !== name))
    }


    const preview = (files: ImageFile[]): ReactNode => {
        return (files &&
            files.map(file => (
                <div className={classes.thumb} key={file.name}>
                    <div className={classes.thumbInner}>
                        <img
                            src={file.preview}
                            className={classes.img}
                            alt={file.name}
                        />
                        <div className={classes.deleteParent}>
                        <IconButton onClick={()=> removeImage(file.name)} aria-label="delete">
                            <CancelIcon/>
                        </IconButton>
                        </div>

                    </div>
                </div>
            ))
        )
    };


    return (
        <section className="container">
            <div {...getRootProps({ style })}>
                <input {...getInputProps()} />
                <p>Upload Images</p>
            </div>
            <aside className={classes.thumbsContainer}>
                {preview(images)}
            </aside>
        </section>
    );
}


