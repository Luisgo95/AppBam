export interface IAgentes {
    id?: number;
    nombres: string;
    apellidos: string;
    nacimiento: Date;
    direccion: string;
    telefono: string;
    tienda: string;
    concesionarioId: number;
    createdAt: Date;
}

export class Agente {
    static empty() {
        return {
            id: 0,
            nombres: '',
            apellidos: '',
            direccion: '',
            telefono: '',
            tienda: '',
            concesionarioId: 0,
            createdAt: new Date()
        } as IAgentes
    }
}
