import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Transaction, TransactionRepository } from 'typeorm';
import { BaseService, ProjectStatusEnum, SmsTypeEnum, UserTypeEnum } from '../core';
import { Customer, User, Metadata } from '../database';
import { VerificationService } from '../verification';
import { range, shuffle, take } from 'lodash';

@Injectable()
export class CustomerService extends BaseService<Customer> {

    constructor(
        @InjectRepository(Customer)
        protected readonly repo: Repository<Customer>,
        @InjectRepository(Metadata)
        protected readonly metadataRepo: Repository<Metadata>,
        protected readonly verificationService: VerificationService,
    ) {
        super(repo);
    }


    @Transaction()
    async approval(
        customer: Customer,
        @TransactionRepository(User) userRepo?: Repository<User>,
        @TransactionRepository(Customer) customerRepo?: Repository<Customer>,
    ) {
        const target = await customerRepo.findOne({
            where: { id: customer.id },
            relations: ['area']
        });
        target.status = customer.status;

        if (ProjectStatusEnum.CHECKED === target.status) {

            // 注册新用户
            const exist = await userRepo.createQueryBuilder("t")
            .leftJoinAndSelect("t.area","area")
            .where("t.account = :account", {account: target.phone})
            .orWhere("t.phone = :phone", {phone: target.phone})
            .orWhere("t.company = :company", {company: target.company})
            .getOne();

            const password = take(shuffle(range(0, 10)), 8).join('');
            if (!exist) {
                const user = new User();
                user.account = target.phone;
                user.phone = target.phone;
                user.realname = target.realname;
                user.company = target.company;
                user.area = target.area;
                user.type = UserTypeEnum.ENTERPRISE;
                user.password = password;

                await userRepo.save(user);

                await this.verificationService.sendSms(target.phone, SmsTypeEnum.CUSTOMER, password);
            } else {
                await this.verificationService.sendSms(target.phone, SmsTypeEnum.USER, password);
            }

        }

        await customerRepo.save(target);
        return true;
    }

    async importData(data: any) {

        const list = [];

        for (let item of data) {

            const customer = new Customer();
            customer.org_type = item['机构类别'];
            customer.company = item['企业全称'].trim();
            customer.source = '2019投融资促进会';

            if (!item['地区']) throw new BadRequestException('参数[地区]缺失');
            const areaList = item['地区'].split(' ');

            let area = null;

            const root = await this.metadataRepo.findOne({ where: { title: '地区' } });

            for (let i = 0; i < areaList.length; i++) {
                const builder = this.metadataRepo.createQueryBuilder('t');

                builder
                    .leftJoinAndSelect('t.parent', 'parent')
                    .where('t.title = :title', { title: areaList[i] })
                    .andWhere('parent.id = :pid', { pid: !area ? root.id : area.id });

                area = await builder.getOne();
            }

            customer.area = area;

            const participants = [];

            if (!item['参会人姓名(主)']) throw new BadRequestException('主要参会人信息缺失');

            if (item['参会人姓名(主)']) {
                customer.realname = item['参会人姓名(主)'].trim();
                customer.phone = item['参会人电话(主)'].trim();
                participants.push({ realname: item['参会人姓名(主)'], phone: item['参会人电话(主)'] })
            }

            if (item['参会人姓名(陪)']) {
                participants.push({ realname: item['参会人姓名(陪)'].trim(), phone: item['参会人电话(陪)'].trim() })
            }

            const board_and_lodging = [];

            if (item['7日晚餐']) {
                board_and_lodging.push('dinner5');
            }

            if (item['7日住宿（含早餐）']) {
                board_and_lodging.push('stay5');
            }

            if (item['8日午餐']) {
                board_and_lodging.push('lunch6');
            }

            customer.ex_info = {
                board_and_lodging,
                participants
            };

            list.push(customer);
        }

        return await this.repo.save(list);
    }
}
