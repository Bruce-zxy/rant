import { ObjectType, Field } from "type-graphql";
import { Paginated } from "../core/types/paginated.type";
import { Product } from "../database/entities";

@ObjectType()
export class ProductPaginated extends Paginated {
    @Field(type => [Product])
    items: Product[];
}