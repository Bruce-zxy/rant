import { ApiModelProperty } from '@nestjs/swagger';
import * as moment from 'moment';
import { Field, InputType, Int, ObjectType } from "type-graphql";
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany } from "typeorm";
import { IFModeEnum, ProjectStatusEnum } from "../../core";
import { ApplyCapital } from './apply-capital.entity';
import { Base } from "./base";
import { Metadata } from "./metadata.entity";
import { Org } from './org.entity';
import { User } from "./user.entity";

@Entity()
@ObjectType()
@InputType('CapitalInput')
export class Capital extends Base {

    @Field({ nullable: true })
    @Column({ nullable: true })
    @ApiModelProperty({ nullable: true })
    title: string;

    @Field(type => Int, { nullable: true })
    @Column({ default: 0 })
    @ApiModelProperty({ nullable: true })
    views: number;

    @Field({ nullable: true })
    @Column({ nullable: true })
    @ApiModelProperty({ nullable: true })
    contact: string;

    @Field({ nullable: true })
    @Column({ nullable: true })
    @ApiModelProperty({ nullable: true })
    phone: string;

    @Field({ nullable: true })
    @Column({ nullable: true })
    @ApiModelProperty({ nullable: true })
    company: string;

    @Field({ nullable: true })
    @Column({ type: 'timestamp', nullable: true, default: moment().format('YYYY-MM-DD HH:mm:ss') })
    @ApiModelProperty({ nullable: true })
    publish_at: string;

    @Field({ nullable: true })
    @Column({ nullable: true, type: 'int' })
    @ApiModelProperty({ nullable: true })
    amount: number;

    @Field({ nullable: true })
    @Column({ nullable: true })
    @ApiModelProperty({ nullable: true })
    summary: string;

    @Field({ nullable: true })
    @Column({ type: 'text', nullable: true })
    @ApiModelProperty({ nullable: true })
    info: string;

    @Field({ nullable: true })
    @Column({ nullable: true })
    @ApiModelProperty({ nullable: true })
    return: string;

    @Field({ nullable: true })
    @Column({ nullable: true })
    @ApiModelProperty({ nullable: true })
    pledge: string;

    @Field({ nullable: true })
    @Column({ type: 'float', nullable: true })
    @ApiModelProperty({ nullable: true })
    discount: number;

    @Field(type => Int, { nullable: true })
    @Column({ nullable: true })
    @ApiModelProperty({ nullable: true })
    term: number;

    @Field({ nullable: true })
    @Column({ nullable: true })
    @ApiModelProperty({ nullable: true })
    pre_payment: string;

    @Field({ nullable: true })
    @Column({ nullable: true })
    @ApiModelProperty({ nullable: true })
    reason: string;

    @Field(type => Org, { nullable: true })
    @ManyToOne(type => Org)
    @ApiModelProperty({ nullable: true })
    org: Org;

    @Field(type => User, { nullable: true })
    @ManyToOne(type => User)
    @ApiModelProperty({ nullable: true })
    own: User;

    @Field(type => User, { nullable: true })
    @ManyToOne(type => User, target => target.capitals)
    @ApiModelProperty({ nullable: true })
    creator: User;

    @Field({ nullable: true })
    @Column({ default: ProjectStatusEnum.PENDING })
    @ApiModelProperty({ nullable: true })
    status: ProjectStatusEnum;

    @Field({ nullable: true })
    @Column({ default: IFModeEnum.EQUITY })
    @ApiModelProperty({ nullable: true })
    category: IFModeEnum;

    @Field(type => Metadata, { nullable: true })
    @ManyToMany(type => Metadata, target => target.capitals_industry)
    @JoinTable()
    @ApiModelProperty({ nullable: true })
    industry: Metadata[];

    @Field(type => Metadata, { nullable: true })
    @ManyToMany(type => Metadata, target => target.capitals_type)
    @JoinTable()
    @ApiModelProperty({ nullable: true })
    type: Metadata[];

    @Field(type => Metadata, { nullable: true })
    @ManyToOne(type => Metadata, target => target.capitals)
    @ApiModelProperty({ nullable: true })
    area: Metadata;

    @Field({ nullable: true })
    @Column({ nullable: true })
    @ApiModelProperty({ nullable: true })
    area_path: string;

    @Field(type => Metadata, { nullable: true })
    @ManyToMany(type => Metadata, target => target.capitals_invest_area)
    @JoinTable()
    @ApiModelProperty({ nullable: true })
    invest_area: Metadata[];

    @Field(type => Metadata, { nullable: true })
    @ManyToOne(type => Metadata, target => target.capitals)
    @ApiModelProperty({ nullable: true })
    risk: Metadata;

    @Field(type => Metadata, { nullable: true })
    @ManyToMany(type => Metadata, target => target.capitals_data)
    @JoinTable()
    @ApiModelProperty({ nullable: true })
    data: Metadata[];

    @Field(type => Metadata, { nullable: true })
    @ManyToOne(type => Metadata, target => target.capitals)
    @ApiModelProperty({ nullable: true })
    equity_type: Metadata;

    @Field(type => Metadata, { nullable: true })
    @ManyToMany(type => Metadata, target => target.capitals_stage)
    @JoinTable()
    @ApiModelProperty({ nullable: true })
    stage: Metadata[];

    @Field(type => Metadata, { nullable: true })
    @ManyToMany(type => Metadata, target => target.capitals_invest_type)
    @JoinTable()
    @ApiModelProperty({ nullable: true })
    invest_type: Metadata[];

    @Field(type => Metadata, { nullable: true })
    @ManyToOne(type => Metadata, target => target.capitals)
    @ApiModelProperty({ nullable: true })
    ratio: Metadata;

    @Field(type => ApplyCapital, { nullable: true })
    @OneToMany(type => ApplyCapital, target => target.capital)
    @ApiModelProperty({ nullable: true })
    applicants: ApplyCapital[];

    @Field({ nullable: true })
    @Column({ nullable: true })
    @ApiModelProperty({ nullable: true })
    hideContact: string;

    @Field({ nullable: true })
    @Column({ nullable: true })
    @ApiModelProperty({ nullable: true })
    hidePhone: string;

    @Field({ nullable: true })
    @Column({ nullable: true })
    @ApiModelProperty({ nullable: true })
    hideCompany: string;


}   