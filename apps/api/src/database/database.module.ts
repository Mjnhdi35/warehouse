import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.getOrThrow<string>('DB_URL'),
        autoLoadEntities: true,
        synchronize: true,
        logging: true,
        entities: [__dirname + '/../**/*.entity.{js,ts}'],
        migrations: [__dirname + '/../migrations/*.{js,ts}'],
        migrationsRun: true,
        migrationsTableName: 'migrations',
        migrationsTransactionMode: 'all',
        migrationsTransactionRun: true,
        migrationsTransactionSkipSync: true,
      }),
    }),
  ],
})
export class DatabaseModule {}
