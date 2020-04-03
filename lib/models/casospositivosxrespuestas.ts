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
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, Index, JoinColumn } from 'typeorm'
import { Casospositivos } from './casospositivos';
import { Respuestas } from './respuestas';

@Entity()
export class Casospositivosxrespuestas {

    @Index()
    @PrimaryGeneratedColumn()
    id: number;
    @ManyToOne(type => Casospositivos)
    @JoinColumn({
        name: 'idcasopositivo',
        referencedColumnName: 'id'
    })
    casospositivos: Casospositivos;

    @ManyToOne(type => Respuestas)
    @JoinColumn({
        name: 'idrespuesta',
        referencedColumnName: 'id'
    })
    respuestas: Respuestas;
}
