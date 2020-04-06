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
 */
export class Listados<T> {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
    next_page_url: string;
    prev_page_url: string;
    from: number;
    to: number;
    data: Array<T>;

    // get total(): number {
    //   return this._total;
    // }
    // set total(new: number) {
    //   this._total = new;
    // }
    //
    // get per_page(): number {
    //   return this._per_page;
    // }
    // set per_page(new: number) {
    //   this._per_page = new;
    // }
    //
    // get current_page(): number {
    //   return this._current_page;
    // }
    // set current_page(new: number) {
    //   this._current_page = new;
    // }
    //
    // get last_page(): number {
    //   return this._last_page;
    // }
    // set last_page(new: number) {
    //   this._last_page = new;
    // }
    //
    // get next_page_url(): string {
    //   return this._next_page_url;
    // }
    // set next_page_url(new: string) {
    //   this._next_page_url = new;
    // }
    //
    // get prev_page_url(): string {
    //   return this._prev_page_url;
    // }
    // set prev_page_url(new: string) {
    //   this._prev_page_url = new;
    // }
    //
    // get from(): number {
    //   return this._from;
    // }
    // set from(new: number) {
    //   this._from = new;
    // }
    //
    // get to(): number {
    //   return this._to;
    // }
    // set to(new: number) {
    //   this._to = new;
    // }
    //
    // get data(): Array(T) {
    //   return this._data;
    // }
    // set data(new: Array(T)) {
    //   this._data = new;
    // }

}
