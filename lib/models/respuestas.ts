import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, ManyToMany, Index, JoinColumn } from 'typeorm'
import { Preguntas } from './preguntas';
import { Casospositivos } from './casospositivos';
import { Casos } from './casos';

@Entity()
export class Respuestas {

    @Index()
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    codigo: string;
    @Column()
    respuesta: string;
    @Column()
    orden: number;
    @ManyToOne(type => Preguntas, pregunta => pregunta.respuestas)
    @JoinColumn({
        name: 'idpregunta',
        referencedColumnName: 'id'
    })
    pregunta: Preguntas;

    @ManyToMany(type => Casospositivos, casospositivo => casospositivo.respuestas)
    casospositivos: Casospositivos[];

    @ManyToMany(type => Casos, caso => caso.respuestas)
    casos: Casos[];
    
    valor: boolean;
}
