import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm'

@Entity()
export class Variables {

    @Index()
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    nombre: string;
    @Column()
    valor: string;
}
