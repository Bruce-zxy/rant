import * as Faker from 'faker';
import { define } from "typeorm-seeding";
import { ProjectStatusEnum } from '../../core';
import { Metadata, Provider, ProviderCategory, User } from '../entities';

interface IProviderSetting {
    name?: string;
    slogan?: string;
    summary?: string;
    logo?: string;
    introduction?: string;
    category: ProviderCategory;
    creator: User;
    area: Metadata;
    status: ProjectStatusEnum;
}

define(Provider, (faker: typeof Faker, settings: IProviderSetting) => {
    const instance = new Provider();
    instance.name = settings.name || faker.company.companyName();
    instance.slogan = settings.slogan || faker.lorem.sentence();
    instance.summary = settings.summary || '';
    instance.logo = settings.logo || faker.image.imageUrl(148, 62.31);
    instance.introduction = settings.introduction || faker.lorem.text();
    instance.category = settings.category;
    instance.creator = settings.creator;
    instance.area = settings.area;
    instance.status = settings.status || ProjectStatusEnum.CHECKED;

    return instance;
})