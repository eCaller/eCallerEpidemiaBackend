import { Entity, Column, PrimaryGeneratedColumn, Index, OneToMany } from 'typeorm'
import { Respuestas } from './respuestas';

@Entity()
export class Preguntas {
    
    @Index()
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    codigo: string;    
    @Column()
    pregunta: string;
    @Column()
    tipo: string;
    @Column()
    orden: number;
    @OneToMany(type => Respuestas, respuesta => respuesta.pregunta)
    respuestas: Respuestas[];

    value: number;

}