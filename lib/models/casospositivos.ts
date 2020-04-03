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
import { Entity, Column, PrimaryGeneratedColumn, Index, ManyToMany, JoinTable } from 'typeorm'
import { Respuestas } from './respuestas';

@Entity()
export class Casospositivos {

    @Index()
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToMany(type => Respuestas, respuestas => respuestas.casospositivos)
    @JoinTable({
        name: "casospositivosxrespuestas",
        joinColumn: {
            name: "idcasopositivo",
            referencedColumnName: "id"
        },
        inverseJoinColumn: {
            name: "idrespuesta",
            referencedColumnName: "id"
        }
    })
    respuestas: Respuestas[];
}
