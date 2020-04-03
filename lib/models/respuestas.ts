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
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, ManyToMany, Index, JoinColumn } from 'typeorm'
import { Preguntas } from './preguntas';
import { Casospositivos } from './casospositivos';
import { Casos } from './casos';

@Entity()
export class Respuestas {

    @Index()
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    codigo: string;
    @Column()
    respuesta: string;
    @Column()
    orden: number;
    @ManyToOne(type => Preguntas, pregunta => pregunta.respuestas)
    @JoinColumn({
        name: 'idpregunta',
        referencedColumnName: 'id'
    })
    pregunta: Preguntas;

    @ManyToMany(type => Casospositivos, casospositivo => casospositivo.respuestas)
    casospositivos: Casospositivos[];

    @ManyToMany(type => Casos, caso => caso.respuestas)
    casos: Casos[];
    
    valor: boolean;
}
