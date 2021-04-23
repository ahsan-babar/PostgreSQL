import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';

export default class MigrateJSONColumnIdToIntegerIdColumn implements Seeder {
  public async run(factory: Factory, connection: Connection) {
    await connection.query(`
    BEGIN;
    UPDATE routing_entity
    SET rowid = CAST (data#>> '{id}' AS INTEGER)
    WHERE data#>> '{id}' IS NOT NULL;
    SELECT SETVAL('routing_entity_rowid_seq', (SELECT MAX(rowid) FROM routing_entity) + 1, false);
    UPDATE routing_entity
    SET rowid = NEXTVAL('routing_entity_rowid_seq')
    WHERE data#>> '{id}' IS NULL;
    SELECT SETVAL('routing_entity_rowid_seq', (SELECT MAX(rowid) FROM routing_entity) + 1, false);
    COMMIT;`);
  }
}