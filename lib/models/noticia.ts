import { Entity, PrimaryColumn, Column } from 'typeorm'

@Entity()
export class Noticia {
    @PrimaryColumn()
    id: number;
    @Column()
    titular: string;
    @Column()
    cuerpo: string;
}