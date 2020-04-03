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
