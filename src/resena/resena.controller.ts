// src/resena/resena.controller.ts
import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ResenaService } from './resena.service';
import { CrearResenaDTO } from './resena.dto/resena.dto';

@Controller('resena')
export class ResenaController {
  constructor(private readonly resenaService: ResenaService) {}

  @Post()
  agregarResena(@Body() dto: CrearResenaDTO) {
    return this.resenaService.agregarResena(dto);
  }

  @Get(':id')
  findClaseById(@Param('id') id: number) {
    return this.resenaService.findClaseById(id);
  }
}
