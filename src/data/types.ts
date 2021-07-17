import { FileWithPath } from "react-dropzone";
import { GeoLocation } from "./location";

export interface Trip {
    id:           string;
    date:         Date;
    name:         string;
    description:  string;
    parking:      string;
    notes:        string[];
    participants: string[];
    images?:      string[];
    location?:    GeoLocation
}

export interface ImageFile extends FileWithPath {
    dateSuggestion?: Date;
    preview: string
}