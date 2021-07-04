import { FileWithPath } from "react-dropzone";

export interface Trip {
    id:           string;
    date:         Date;
    name:         string;
    description:  string;
    parking:      string;
    notes:        string[];
    participants: string[];
    images?:       string[];
}

export interface ImageFile extends FileWithPath {
    preview: string
}

export interface TripWithImageFiles extends Trip {
    imageFiles?: ImageFile[]
}