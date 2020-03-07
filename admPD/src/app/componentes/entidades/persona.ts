// import { Domicilio } from './domicilio';

export class Persona{
    id: number;
    nombre: string;
    apellido: string;
    dni: number;
  

    public constructor (init?: Partial<Persona>){
        Object.assign(this, init);
    }
}

