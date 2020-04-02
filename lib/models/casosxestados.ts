import { Entity, Column, PrimaryGeneratedColumn, Index, JoinColumn, ManyToOne } from 'typeorm'
import { Casos } from './casos';

@Entity()
export class Casosxestados {
    
    @Index()
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    fecha: Date;
    @Column()
    estado: string;
    @ManyToOne(type => Casos, caso => caso.casosxestados)
    @JoinColumn({
        name: 'idcaso',
        referencedColumnName: 'id'
    })
    caso: Casos;
    
}