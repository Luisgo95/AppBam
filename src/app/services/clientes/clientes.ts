export interface IClientes {
    id?: number;
    nombres: string;
    apellidos: string;
    direccion: string;
    telefono: string;
    email: string;
    estadoCivil: string;
    nivelAcademico: string;
    profesion: string;
    tienda: string;
    concesionarioId: number;
    createdAt: Date;
}

export class Cliente {
    static empty() {
        return {
            id: 0,
            nombres: '',
            apellidos: '',
            direccion: '',
            telefono: '',
            email: '',
            estadoCivil: '',
            nivelAcademico: '',
            profesion: '',
            concesionarioId: 0,
            tienda: '',
            createdAt: new Date()
        } as IClientes
    }
}
