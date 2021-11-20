export interface IConcesionarios {
    id?: number;
    nombre: string;
    razon: string;
    email: string;
    departamento: string;
    telefono: string;
    municipio: string;
    createdAt: Date;
}

export class Concesionario {
    static empty() {
        return {
            id: 0,
            nombre: '',
            razon: '',
            departamento: '',
            municipio: '',
            telefono: '',
            email: '',
            createdAt: new Date()
        } as IConcesionarios
    }
}
