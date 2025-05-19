import { Module } from '@nestjs/common';
import { ActividadService } from './actividad.service';
import { ActividadController } from './actividad.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Actividad } from './actividad.entity';
import { Estudiante } from 'src/estudiante/estudiante.entity';

@Module({
  providers: [ActividadService],
  controllers: [ActividadController],
  imports: [TypeOrmModule.forFeature([Actividad, Estudiante])],
})
export class ActividadModule {}
