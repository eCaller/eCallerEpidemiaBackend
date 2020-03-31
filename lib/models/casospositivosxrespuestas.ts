import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, Index, JoinColumn } from 'typeorm'
import { Casospositivos } from './casospositivos';
import { Respuestas } from './respuestas';

@Entity()
export class Casospositivosxrespuestas {

    @Index()
    @PrimaryGeneratedColumn()
    id: number;
    @ManyToOne(type => Casospositivos)
    @JoinColumn({
        name: 'idcasopositivo',
        referencedColumnName: 'id'
    })
    casospositivos: Casospositivos;

    @ManyToOne(type => Respuestas)
    @JoinColumn({
        name: 'idrespuesta',
        referencedColumnName: 'id'
    })
    respuestas: Respuestas;
}
