export interface Activity {
    idactivitiesprojects:       number;
    projectsactivities:         string;
    LargeDescriptionactivities: string;
    Idmacroprocess:             number;
    status:                     number;
    macroprocess:               string;
}

export interface MacroProcess {
    Idmacroprocess: number;
    macroprocess:   string;
    DateCreate:     Date;
}
