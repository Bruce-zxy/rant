import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets } from 'typeorm';
import { BaseService, IdentityEnum, UserStatusEnum } from '../core';
import { User } from '../database/entities';
import { UpdateUserInput } from './update-user.input';


@Injectable()
export class UserService extends BaseService<User> {

    constructor(@InjectRepository(User) repo) {
        super(repo);
    }

    // async query(args: UserQueryArgs) {
    //     const qb = this.repo.createQueryBuilder('t');

    //     if (!args.page || args.page < 1) {
    //         args.page = 1;
    //     }

    //     if (!args.pageSize) {
    //         args.pageSize = 5;
    //     }

    //     if (args.identity) {
    //         qb.andWhere('t.identity = :identity', { identity: args.identity });
    //     }

    //     if (args.keyword) {
    //         qb.andWhere(new Brackets(qb => {
    //             qb.where(`t.account LIKE '%${args.keyword}%'`)
    //                 .orWhere(`t.realName LIKE '%${args.keyword}%'`)
    //                 .orWhere(`t.phone LIKE '%${args.keyword}%'`)
    //                 .orWhere(`t.company LIKE '%${args.keyword}%'`)
    //         }));
    //     }

    //     if (args.status && args.status >= 0) {
    //         qb.andWhere('t.status = :status', { status: args.status });
    //     }

    //     // args.order = args.order || 'DESC';

    //     // if (!!args.sort) {
    //     //     qb.addOrderBy(`t.${args.sort}`, args.order);
    //     // } else {
    //     //     qb.addOrderBy('t.update_at', args.order);
    //     // }

    //     qb.skip((args.page - 1) * args.pageSize);
    //     qb.take(args.pageSize);

    //     const [items, total] = await qb.getManyAndCount();

    //     return this.createPaginated(items, total, args);
    // }

    // async statistics() {
    //     const qb = this.repo.createQueryBuilder('t');

    //     const all = qb.getCount();
    //     const users = qb.where('t.identity = :identify', { identify: IdentityEnum.USER }).getCount();
    //     const investors = qb.where('t.identity = :identify', { identify: IdentityEnum.INVESTOR }).getCount();
    //     const financers = qb.where('t.identity = :identify', { identify: IdentityEnum.FINANCER }).getCount();
    //     const providers = qb.where('t.identity = :identify', { identify: IdentityEnum.PROVIDER }).getCount();
    //     const tourists = qb.where('t.identity = :identify', { identify: IdentityEnum.TOURIST }).getCount();
    //     const pendingCount = qb.where('t.status = :status', { status: UserStatusEnum.PENDING }).getCount();
    //     const rejectCount = qb.where('t.status = :status', { status: UserStatusEnum.REJECT }).getCount();

    //     return { all, users, investors, financers, providers, tourists, pendingCount, rejectCount };
    // }

    // async update(data: UpdateUserInput) {
    //     const res = await this.repo.createQueryBuilder()
    //         .update().set(data.payload as any).where('id = :id', { id: data.id })
    //         .execute();
    //     return !!res;
    // }
}
