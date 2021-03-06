import { makeStyles, useTheme } from '@material-ui/core';
import { Theme } from '@material-ui/core';
import React, { ReactNode, useEffect, useMemo } from 'react'
import { useDropzone } from 'react-dropzone'
import { useRecoilState, useRecoilValue } from 'recoil';
import { editingTripState, imageFilesState, imagesBaseUrlState } from '../../data/state';
import { ImageFile } from '../../data/types';
import { v4 as uuidv4 } from 'uuid';
import { ImagePreview } from './ImagePreview';



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
    }
}));

interface Props {
    onRemoveImage: (imageName: string) => void
}

export const ImageUploader = ({onRemoveImage}: Props) => {
    const theme = useTheme();
    const imagesUrl = useRecoilValue(imagesBaseUrlState);
    const classes = useStyles();

    const { acceptedFiles, getRootProps, getInputProps,
        isDragActive,
        isDragAccept,
        isDragReject } = useDropzone({
            accept: 'image/*'
        });

    const [images, setimages] = useRecoilState<ImageFile[]>(imageFilesState);
    const editingTrip = useRecoilValue(editingTripState);

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
                    return;
                };
                let newFile = (new File([image], `${fileId}.png`, { type: 'image/png' })) as ImageFile;

                newFile.preview = URL.createObjectURL(newFile);
                newFile.dateSuggestion = new Date(file.lastModified);
                newFiles.push(newFile);
            }

            setimages((images) => [...images, ...newFiles])

        }

        handleNewImages()

    }, [acceptedFiles, setimages])


    const preview = (): ReactNode => {
        if (!images) return undefined;
        return (
            images &&
            images.map(file => (
                <ImagePreview
                    key={file.name}
                    src={file.preview}
                    onRemove={() => setimages(images.filter(i => i.name !== file.name))}
                />
            ))
        )
    };


    const previewExistingImages = (): ReactNode => {
        
        if(!editingTrip) return;
    
        return (
            editingTrip.images &&
            editingTrip.images.map(imageName => {
                return (
                    <ImagePreview
                        key={imageName}
                        src={`${imagesUrl}${imageName}`}
                        onRemove={()=> onRemoveImage(imageName)}
                    />)

            })
        )
    };

    return (
        <section className="container">
            <div {...getRootProps({ style })}>
                <input {...getInputProps()} />
                <p>Upload Images</p>
            </div>
            <aside className={classes.thumbsContainer}>
                {preview()}
                {previewExistingImages()}
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