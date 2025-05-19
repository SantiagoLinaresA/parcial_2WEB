import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { EstudianteService } from './estudiante.service';
import { CrearEstudianteDTO } from './crear-estudiante.dto/crear-estudiante.dto';

@Controller('estudiante')
export class EstudianteController {
  constructor(private readonly estudianteService: EstudianteService) {}

  @Post()
  crearEstudiante(@Body() dto: CrearEstudianteDTO) {
    return this.estudianteService.crearEstudiante(dto);
  }

  @Get(':id')
  findEstudianteById(@Param('id') id: number) {
    return this.estudianteService.findEstudianteById(id);
  }

  @Post(':estudianteId/actividad/:actividadId')
  inscribir(@Param('estudianteId') estudianteId: number, @Param('actividadId') actividadId: number) {
    return this.estudianteService.inscribirseActividad(estudianteId, actividadId);
  }
}
