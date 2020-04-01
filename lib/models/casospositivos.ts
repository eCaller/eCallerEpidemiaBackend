import { Entity, Column, PrimaryGeneratedColumn, Index, ManyToMany, JoinTable } from 'typeorm'
import { Respuestas } from './respuestas';

@Entity()
export class Casospositivos {

    @Index()
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToMany(type => Respuestas, respuestas => respuestas.casospositivos)
    @JoinTable({
        name: "casospositivosxrespuestas",
        joinColumn: {
            name: "idcasopositivo",
            referencedColumnName: "id"
        },
        inverseJoinColumn: {
            name: "idrespuesta",
            referencedColumnName: "id"
        }
    })
    respuestas: Respuestas[];
}
