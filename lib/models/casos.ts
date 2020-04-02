import { Entity, Column, PrimaryGeneratedColumn, Index, OneToMany, ManyToMany } from 'typeorm'
import { Casosxestados } from './casosxestados';
import { Respuestas } from './respuestas';

@Entity()
export class Casos {

    @Index()
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    fecha: Date;
    @Column()
    nombre: string;
    @Column()
    edad: number;
    @Column()
    telefono: string;
    @Column()
    dni: string;
    @Index()
    @Column()
    codigo: string;
    @Column()
    email: string;
    @Column()
    direccion: string;
    @Column()
    lat: number;
    @Column()
    lng: number;
    @Column()
    observaciones: string;
    @Column()
    estado: string;
    @Column()
    resultadotest: string;
    @Column()
    resultado: string;

    @OneToMany(type => Casosxestados, casosxestado => casosxestado.caso)
    casosxestados: Casosxestados[];

    @ManyToMany(type => Respuestas, respuesta => respuesta.casos)
    respuestas: Respuestas[];

}
