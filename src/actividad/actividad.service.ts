// actividad.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Actividad } from './actividad.entity/actividad.entity';

@Injectable()
export class ActividadService {
  constructor(
    @InjectRepository(Actividad)
    private actividadRepo: Repository<Actividad>,
  ) {}

  async crearActividad(actividad: Partial<Actividad>) {
    const regex = /^[a-zA-Z0-9\s]+$/;
    if (actividad.titulo.length < 15 || !regex.test(actividad.titulo)) {
      throw new BadRequestException('Título inválido (mínimo 15 caracteres sin símbolos)');
    }

    actividad.estado = 0; // abierta por defecto
    return this.actividadRepo.save(actividad);
  }

  async cambiarEstado(id: number, nuevoEstado: number) {
    const actividad = await this.actividadRepo.findOne({
      where: { id },
      relations: ['estudiantes'],
    });

    if (!actividad) throw new BadRequestException('Actividad no encontrada');

    const inscritos = actividad.estudiante?.length || 0;

    if (nuevoEstado === 1 && inscritos < Math.ceil(actividad.cupoMaximo * 0.8)) {
      throw new BadRequestException('No se puede cerrar, cupo insuficiente');
    }

    if (nuevoEstado === 2 && inscritos < actividad.cupoMaximo) {
      throw new BadRequestException('Solo puede finalizarse si está llena');
    }

    actividad.estado = nuevoEstado;
    return this.actividadRepo.save(actividad);
  }

  async findAllActividadesByDate(fecha: string) {
    return this.actividadRepo.find({ where: { fecha } });
  }
}
