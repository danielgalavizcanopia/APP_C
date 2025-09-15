export interface Users {
    IDUser:       number;
    Name:         string;
    Email:        string;
    Password:     string;
    id_positions: number;
    PositionName: string;
    DateCreate:   Date;
    DateModify:   Date;
}

export interface Positions {
    idpositions:      number;
    ShortDescription: string;
    LargeDescription: string;
    Status:           number;
    DateCreate:       null;
    IDUserCreate:     number;
    DateModify:       null;
    IDUserModify:     number;
}
