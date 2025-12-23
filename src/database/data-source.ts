import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { join } from 'path';

// Cargar variables de entorno del .env
config();

export default new DataSource({
  type: 'mysql',
  host: process.env.MYSQL_HOST,
  port: parseInt(process.env.MYSQL_PORT || '3306'),
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  migrations: [join(__dirname, 'migrations', '*{.ts,.js}')],

  entities: [join(__dirname, '..', '**', 'entities', '*{.ts,.js}')],
  synchronize: false,
});
