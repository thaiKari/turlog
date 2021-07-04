import { IconButton, makeStyles, useTheme } from '@material-ui/core';
import { Theme } from '@material-ui/core';
import React, { ReactNode, useEffect, useMemo, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { useRecoilState } from 'recoil';
import { editingTripState } from '../../data/state';
import { ImageFile, TripWithImageFiles } from '../../data/types';
import CancelIcon from '@material-ui/icons/Cancel';
import { v4 as uuidv4 } from 'uuid';

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
        async function handleNewImages() {
            let newFiles: ImageFile[] = [];

            for (let i = 0; i < acceptedFiles.length; i++) {
                const file = acceptedFiles[i];
                var fileId = uuidv4();

                let image = await resizeImage(file);
                if (!image) {
                    console.log('no image')
                    return;
                };
                let newFile = (new File([image], `${fileId}.png`, { type: 'image/png' })) as ImageFile;

                newFile.preview = URL.createObjectURL(newFile);
                newFile.dateSuggestion = new Date(file.lastModified);
                newFiles.push(newFile);
            }


            setimages([...images, ...newFiles])

        }

        handleNewImages()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [acceptedFiles])

    useEffect(() => {
        let dateSuggesion;
        if (images.length > 0) {
            dateSuggesion = images[0].dateSuggestion
        }

        setEditingTrip({
            ...editingTrip,
            images: images.map(f => f.name),
            dateSuggestion: dateSuggesion,
            imageFiles: images
        })

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
                            <IconButton onClick={() => removeImage(file.name)} aria-label="delete">
                                <CancelIcon />
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


const resizeImage = (file: File): Promise<Blob | undefined> => {
    const maxSize = 800;
    const reader = new FileReader();
    const image = new Image();
    const canvas = document.createElement('canvas');
    const dataURItoBlob = (dataURI: string) => {
        const bytes = dataURI.split(',')[0].indexOf('base64') >= 0 ?
            atob(dataURI.split(',')[1]) :
            unescape(dataURI.split(',')[1]);
        const mime = 'image/png';
        const max = bytes.length;
        const ia = new Uint8Array(max);
        for (var i = 0; i < max; i++) ia[i] = bytes.charCodeAt(i);
        return new Blob([ia], { type: mime });
    };
    const resize = () => {
        let width = image.width;
        let height = image.height;

        if (width > height) {
            if (width > maxSize) {
                height *= maxSize / width;
                width = maxSize;
            }
        } else {
            if (height > maxSize) {
                width *= maxSize / height;
                height = maxSize;
            }
        }

        canvas.width = width;
        canvas.height = height;
        let ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.drawImage(image, 0, 0, width, height);
        let dataUrl = canvas.toDataURL('image/jpeg');
        return dataURItoBlob(dataUrl);
    };

    return new Promise((ok, no) => {
        if (!file.type.match(/image.*/)) {
            no(new Error("Not an image"));
            return;
        }

        reader.onload = (readerEvent: any) => {
            image.onload = () => ok(resize());
            image.src = readerEvent.target.result;
        };
        reader.readAsDataURL(file);
    })
};