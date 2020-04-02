import { Entity, Column, PrimaryGeneratedColumn, Index, OneToMany, ManyToOne,JoinColumn } from 'typeorm'
import { Provincias } from './provincias';
import { Distritos } from './distritos';

@Entity()
export class Municipios {

    @Index()
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    nombre: string;
    @Column()
    lat: number;
    @Column()
    lng: number;

    @ManyToOne(type => Provincias, provincia => provincia.municipios)
    @JoinColumn({
        name: 'idprovincia',
        referencedColumnName: 'id'
    })
    provincia: Provincias;

    @OneToMany(type => Distritos, distritos => distritos.municipio)
    distritos: Distritos[];

}
