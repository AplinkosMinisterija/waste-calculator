export interface WasteI {
    type: string;
    name: string;
    company: string;
    pollutionNumber: string;
    companyCode: string;
    companyName: string;
    year?: number;
    notDangerous?: {
        streamCode?: {
            id: string | number;
            RCoefficient: number;
            DCoefficient: number;
            type: string;
        };
        wasteCode?: {
            streamId: string | number;
            id: string | number;
            type: string;
        };
        quantity?: string;
        code?: string;
    }[];
    dangerous?: {
        streamCode?: {
            id: string | number;
            RCoefficient: number;
            DCoefficient: number;
            type: string;
        };
        wasteCode?: {
            streamId: string | number;
            id: string | number;
            type: string;
        };
        quantity?: string;
        code?: string;
    }[];
    dumpNotDangerous?: {
        quantity?: string;
        setAside?: string;
    }[];
    dumpDangerous?: {
        quantity?: string;
        setAside?: string;
    }[];
    dumpInert?: {
        quantity?: string;
        setAside?: string;
    }[];
    phosphogypsum?: {
        quantity?: string;
    }[];
}