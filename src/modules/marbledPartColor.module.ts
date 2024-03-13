
import { Module } from '@nestjs/common';
import { MarbledPartColorsController } from 'src/controllers/marbledPartColor.controller';
import { MarbledPartColorsService } from 'src/services/marbledPartColor.service';
import { marbledPartColorsProviders } from 'src/providers/marbledPartColor.providers';
import { DatabaseModule } from 'src/modules/database.module';

@Module({
imports: [DatabaseModule],
controllers: [MarbledPartColorsController],
providers: [MarbledPartColorsService, ...marbledPartColorsProviders],
})
export class MarbledPartColorModule {}
