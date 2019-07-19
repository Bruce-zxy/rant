import { Connection } from "typeorm";
import { Factory, Seeder } from "typeorm-seeding";
import { User } from "../entities";

export default class CreateUsers implements Seeder {
    public async run(factory: Factory, connection: Connection): Promise<any> {

        const superAdmin = new User();
        superAdmin.account = "SuperAdmin";

        await connection.getRepository(User).save(superAdmin);
    }
}