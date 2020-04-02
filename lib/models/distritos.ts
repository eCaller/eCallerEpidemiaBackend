import { Entity, Column, PrimaryGeneratedColumn, Index, ManyToOne,JoinColumn } from 'typeorm'
import { Municipios } from './municipios';

@Entity()
export class Distritos {

    @Index()
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    nombre: string;
    @Column()
    lat: number;
    @Column()
    lng: number;

    @ManyToOne(type => Municipios, municipio => municipio.distritos)
    @JoinColumn({
        name: 'idmunicipio',
        referencedColumnName: 'id'
    })
    municipio: Municipios;

}
