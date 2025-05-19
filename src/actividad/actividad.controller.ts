// src/actividad/actividad.controller.ts
import { Controller, Post, Body, Param, Put, Get } from '@nestjs/common';
import { ActividadService } from './actividad.service';
import { ActividadDTO } from './actividad.dto/actividad.dto';

@Controller('actividades')
export class ActividadController {
  constructor(private readonly actividadService: ActividadService) {}

  @Post()
  crearActividad(@Body() dto: ActividadDTO) {
    return this.actividadService.crearActividad(dto);
  }

  @Put(':id/estado')
  cambiarEstado(@Param('id') id: number, @Body() dto: ActividadDTO) {
    return this.actividadService.cambiarEstado(id, dto.estado);
  }

  @Get('fecha/:fecha')
  findAllActividadesByDate(@Param('fecha') fecha: string) {
    return this.actividadService.findAllActividadesByDate(fecha);
  }
}
