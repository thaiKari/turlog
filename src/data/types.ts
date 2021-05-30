
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


