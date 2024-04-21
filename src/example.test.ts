import { ManyToOne } from '@mikro-orm/core';
import { Entity, MikroORM, PrimaryKey } from '@mikro-orm/mysql';
import { Migrator } from '@mikro-orm/migrations';

@Entity()
class User {
  @PrimaryKey({ autoincrement: false, unsigned: false })
  id!: number;
}

@Entity()
class Message {
  @PrimaryKey()
  id!: number;

  @ManyToOne(() => User)
	user!: User;
}

let orm: MikroORM;

beforeAll(async () => {
  orm = await MikroORM.init({
    dbName: 'mikro_orm_test_migrations',
    entities: [User, Message],
    allowGlobalContext: true, // only for testing
    extensions: [Migrator],
  });
  await orm.schema.ensureDatabase();
});
beforeEach(() => orm.config.resetServiceCache());
afterAll(async () => {
  await orm.schema.dropDatabase();
  await orm.close(true);
});

test('generate schema migration and migration up fails', async () => {
  const migrator = new Migrator(orm.em);
  await migrator.createMigration();
  await migrator.up(); // throws error
  // ...
});

