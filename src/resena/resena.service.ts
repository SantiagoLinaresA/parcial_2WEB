// resena.service.ts
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reseña } from './resena.entity/resena.entity';
import { Estudiante } from 'src/estudiante/estudiante.entity/estudiante.entity';
import { Actividad } from 'src/actividad/actividad.entity/actividad.entity';

@Injectable()
export class ResenaService {
  constructor(
    @InjectRepository(Reseña)
    private resenaRepo: Repository<Reseña>,

    @InjectRepository(Estudiante)
    private estudianteRepo: Repository<Estudiante>,

    @InjectRepository(Actividad)
    private actividadRepo: Repository<Actividad>,
  ) {}

  async agregarResena(data: {
    comentario: string;
    calificacion: number;
    fecha: string;
    estudianteId: number;
    actividadId: number;
  }) {
    const estudiante = await this.estudianteRepo.findOne({
      where: { id: data.estudianteId },
      relations: ['actividades'],
    });

    const actividad = await this.actividadRepo.findOne({
      where: { id: data.actividadId },
      relations: ['estudiantes'],
    });

    if (!estudiante || !actividad) {
      throw new NotFoundException('Datos no válidos');
    }

    if (actividad.estado !== 2) {
      throw new BadRequestException('La actividad no ha finalizado');
    }

    const inscrito = actividad.estudiante.some(e => e.id === estudiante.id);
    if (!inscrito) {
      throw new BadRequestException('Estudiante no inscrito en la actividad');
    }

    const nueva = this.resenaRepo.create({
      comentario: data.comentario,
      calificacion: data.calificacion,
      fecha: data.fecha,
      estudiante,
      actividad,
    });

    return this.resenaRepo.save(nueva);
  }

  async findClaseById(id: number) {
    return this.resenaRepo.findOne({ where: { id } });
  }
}
