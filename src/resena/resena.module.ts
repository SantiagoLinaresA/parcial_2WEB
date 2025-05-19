import { Module } from '@nestjs/common';
import { ResenaService } from './resena.service';
import { ResenaController } from './resena.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reseña } from './resena.entity';
import { Estudiante } from 'src/estudiante/estudiante.entity';
import { Actividad } from 'src/actividad/actividad.entity';

@Module({
  providers: [ResenaService],
  controllers: [ResenaController],
  imports: [TypeOrmModule.forFeature([Reseña, Estudiante, Actividad])],
})
export class ResenaModule {}
