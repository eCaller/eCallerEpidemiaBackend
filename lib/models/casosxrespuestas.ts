import { Entity, Column, PrimaryGeneratedColumn, Index, JoinColumn, ManyToOne } from 'typeorm'
import { Casos } from './casos';
import { Respuestas } from './respuestas';

@Entity()
export class Casosxrespuestas {

    @Index()
    @PrimaryGeneratedColumn()
    id: number;
    @ManyToOne(type => Casos)
    @JoinColumn({
        name: 'idcaso',
        referencedColumnName: 'id'
    })
    casos: Casos;

    @ManyToOne(type => Respuestas)
    @JoinColumn({
        name: 'idrespuesta',
        referencedColumnName: 'id'
    })
    respuestas: Respuestas;

}