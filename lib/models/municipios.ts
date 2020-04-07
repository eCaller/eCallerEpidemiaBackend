/**
 * Copyright 2020, Ingenia, S.A.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * @author jamartin@ingenia.es
 */
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
    @Column({type: "decimal", precision: 3, scale: 10})
    lat: number;
    @Column({type: "decimal", precision: 3, scale: 10})
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
