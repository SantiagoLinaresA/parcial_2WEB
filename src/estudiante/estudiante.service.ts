// estudiante.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Estudiante } from 'src/estudiante/estudiante.entity/estudiante.entity';
import { Actividad } from 'src/actividad/actividad.entity/actividad.entity';

@Injectable()
export class EstudianteService {
  constructor(
    @InjectRepository(Estudiante)
    private estudianteRepo: Repository<Estudiante>,

    @InjectRepository(Actividad)
    private actividadRepo: Repository<Actividad>,
  ) {}

  async crearEstudiante(estudiante: Partial<Estudiante>) {
    if (!estudiante.correo.includes('@')) {
      throw new BadRequestException('Correo inválido');
    }
    if (estudiante.semestre < 1 || estudiante.semestre > 10) {
      throw new BadRequestException('Semestre fuera de rango');
    }

    return this.estudianteRepo.save(estudiante);
  }

  async findEstudianteById(id: number) {
    const estudiante = await this.estudianteRepo.findOne({ where: { id } });
    if (!estudiante) {
      throw new NotFoundException('Estudiante no encontrado');
    }
    return estudiante;
  }

  async inscribirseActividad(estudianteId: number, actividadId: number) {
    const estudiante = await this.estudianteRepo.findOne({
      where: { id: estudianteId },
      relations: ['actividades'],
    });

    const actividad = await this.actividadRepo.findOne({
      where: { id: actividadId },
      relations: ['estudiantes'],
    });

    if (!estudiante || !actividad) {
      throw new NotFoundException('Estudiante o Actividad no encontrados');
    }

    if (actividad.estado !== 0) {
      throw new BadRequestException('La actividad no está abierta');
    }

    if (actividad.estudiante.length >= actividad.cupoMaximo) {
      throw new BadRequestException('La actividad está llena');
    }

    if (actividad.estudiante.some(e => e.id === estudiante.id)) {
      throw new BadRequestException('Ya está inscrito en la actividad');
    }

    actividad.estudiante.push(estudiante);
    await this.actividadRepo.save(actividad);

    return { mensaje: 'Inscripción exitosa', estado: true };
  }
}
