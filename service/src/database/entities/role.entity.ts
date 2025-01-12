import { ApiModelProperty } from '@nestjs/swagger';
import { Field, InputType, Int, ObjectType } from "type-graphql";
import { Column, Entity, OneToMany } from "typeorm";
import { JsonScalar } from '../../core';
import { Base } from "./base";
import { User } from './user.entity';

@Entity()
@ObjectType()
@InputType('RoleInput')
export class Role extends Base {

    @Field({ nullable: true })
    @Column({ unique: true, nullable: true })
    @ApiModelProperty({ nullable: true })
    name: string;

    @Field(type => Int, { nullable: true })
    @Column({ default: 0 })
    @ApiModelProperty({ nullable: true })
    sort: number;

    @Field(type => JsonScalar, { nullable: true })
    @Column({ type: 'simple-json', nullable: true })
    @ApiModelProperty({ nullable: true })
    grants: any;

    @Field(type => [User], { nullable: true })
    @OneToMany(type => User, target => target.role)
    @ApiModelProperty({ nullable: true })
    users: User[];

}   