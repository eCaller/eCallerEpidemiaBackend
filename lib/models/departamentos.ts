import { Entity, Column, PrimaryGeneratedColumn, Index, OneToMany } from 'typeorm'
import { Provincias } from './provincias';

@Entity()
export class Departamentos {

    @Index()
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    nombre: string;
    @Column()
    lat: number;
    @Column()
    lng: number;

    @OneToMany(type => Provincias, provincias => provincias.departamento)
    provincias: Provincias[];

}
