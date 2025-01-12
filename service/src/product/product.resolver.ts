import { Inject } from '@nestjs/common';
import { CONTEXT, Resolver } from '@nestjs/graphql';
import { ObjectType } from 'type-graphql';
import { BasePaginate, BaseResolver } from '../core';
import { Product } from '../database';

@ObjectType()
export class ProductPaginate extends BasePaginate(Product) { }

@Resolver(of => Product)
export class ProductResolver extends BaseResolver(Product, ProductPaginate) {
    constructor(@Inject(CONTEXT) context) { super(context, 'product'); }
}