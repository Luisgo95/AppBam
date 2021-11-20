export interface ICotizaciones {
    id?: number;
    cliente_id: number;
    vehiculo_id: number;
    agente_id: number;
    concesionario_id: number;
    nombres: string;
    apellidos: string;
    marca: string;
    linea: string;
    modelo: string;
    precio: number;
    cantidad: number;
    total: number;
    createdAt: Date;
}

export interface ICotizacion {
    id?: number;
    cliente_id: number;
    vehiculo_id?: number;
    agente_id?: number;
    concesionario_id: number;
    cantidad: number;
    total: number;
    createdAt: Date;
}

export class Cotizacion {
    static empty() {
        return {
            id: 0,
            cliente_id: 0,
            vehiculo_id: 0,
            agente_id: 0,
            concesionario_id: 0,
            cantidad: 0,
            total: 0,
            createdAt: new Date()
        } as ICotizacion
    }
}