import { Entity, Column, PrimaryGeneratedColumn, Index, OneToMany, ManyToOne, JoinColumn } from 'typeorm'
import { Municipios } from './municipios';
import { Departamentos } from './departamentos';

@Entity()
export class Provincias {

    @Index()
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    nombre: string;
    @Column()
    lat: number;
    @Column()
    lng: number;

    @ManyToOne(type => Departamentos, departamentos => departamentos.provincias)
    @JoinColumn({
        name: 'iddepartamento',
        referencedColumnName: 'id'
    })
    departamento: Departamentos;

    @OneToMany(type => Municipios, municipios => municipios.provincia)
    municipios: Municipios[];

}
