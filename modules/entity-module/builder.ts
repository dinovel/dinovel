import { Entity } from './base.ts';

export type EntityBuilder<T extends Entity, E extends Partial<T>> = (value: E) => T;

export type EntityRecipe<T extends Entity> = () => T;
