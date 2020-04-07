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
import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm'

@Entity()
export class Usuarios {

    @Index()
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    username: string;
    @Column()
    password: string;
    @Column()
    nombre: string;
    @Column()
    activo: boolean;
    @Column()
    imagen: string;
    @Column()
    rol: string;

}