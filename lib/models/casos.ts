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
import { Entity, Column, PrimaryGeneratedColumn, Index, OneToMany, ManyToMany, JoinTable } from 'typeorm'
import { Casosxestados } from './casosxestados';
import { Respuestas } from './respuestas';

@Entity()
export class Casos {

    @Index()
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    fecha: Date;
    @Column()
    nombre: string;
    @Column()
    edad: number;
    @Column()
    telefono: string;
    @Column()
    dni: string;
    @Column()
    codigo: string;
    @Column()
    email: string;
    @Column()
    direccion: string;
    @Column()
    lat: number;
    @Column()
    lng: number;
    @Column()
    observaciones: string;
    @Column()
    estado: string;
    @Column()
    resultadotest: string;
    @Column()
    resultado: string;

    @OneToMany(type => Casosxestados, casosxestado => casosxestado.caso)
    casosxestados: Casosxestados[];

    @ManyToMany(type => Respuestas, respuesta => respuesta.casos)
    // @JoinTable({
    //   name: "casosxrespuestas",
    //   joinColumns: [{ name: "idcaso" }],
    //   inverseJoinColumns: [{ name: "idrespuesta" }]
    // })
    respuestas: Respuestas[];

}
