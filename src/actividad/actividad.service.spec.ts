import { Test, TestingModule } from '@nestjs/testing';
import { ActividadService } from './actividad.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Actividad } from './actividad.entity';
import { BadRequestException } from '@nestjs/common';

describe('ActividadService', () => {
  let service: ActividadService;
  let actividadRepo: any;

  beforeEach(async () => {
    const mockActividadRepo = {
      save: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ActividadService,
        {
          provide: getRepositoryToken(Actividad),
          useValue: mockActividadRepo,
        },
      ],
    }).compile();

    service = module.get<ActividadService>(ActividadService);
    actividadRepo = module.get(getRepositoryToken(Actividad));
  });

  describe('crearActividad', () => {
    it('crea una actividad válida (caso positivo)', async () => {
      const dto = {
        titulo: 'Concierto de música clásica',
        fecha: '2024-05-18',
        cupoMaximo: 100,
        estado: 0,
      };
      actividadRepo.save.mockResolvedValue(dto);
      const result = await service.crearActividad(dto);
      expect(result).toEqual(dto);
    });

    it('falla si el título es muy corto o con símbolos', async () => {
      const dto = {
        titulo: '¡Corto!',
        fecha: '2024-05-18',
        cupoMaximo: 100,
        estado: 0,
      };
      await expect(service.crearActividad(dto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('cambiarEstado', () => {
    const baseActividad = {
      id: 1,
      titulo: 'Actividad de prueba',
      cupoMaximo: 10,
      estudiantes: [],
      estado: 0,
    };

    it('cierra la actividad si hay al menos 80% inscritos', async () => {
      const actividad = {
        ...baseActividad,
        estudiantes: Array(8).fill({}),
      };
      actividadRepo.findOne.mockResolvedValue(actividad);
      actividadRepo.save.mockResolvedValue({ ...actividad, estado: 1 });

      const result = await service.cambiarEstado(1, 1);
      expect(result.estado).toBe(1);
    });

    it('lanza error si intenta cerrar con menos del 80% inscritos', async () => {
      const actividad = {
        ...baseActividad,
        estudiantes: Array(5).fill({}),
      };
      actividadRepo.findOne.mockResolvedValue(actividad);
      await expect(service.cambiarEstado(1, 1)).rejects.toThrow(BadRequestException);
    });

    it('finaliza la actividad si el cupo está completo', async () => {
      const actividad = {
        ...baseActividad,
        estudiantes: Array(10).fill({}),
      };
      actividadRepo.findOne.mockResolvedValue(actividad);
      actividadRepo.save.mockResolvedValue({ ...actividad, estado: 2 });

      const result = await service.cambiarEstado(1, 2);
      expect(result.estado).toBe(2);
    });

    it('lanza error si intenta finalizar sin llenar el cupo', async () => {
      const actividad = {
        ...baseActividad,
        estudiantes: Array(9).fill({}),
      };
      actividadRepo.findOne.mockResolvedValue(actividad);
      await expect(service.cambiarEstado(1, 2)).rejects.toThrow(BadRequestException);
    });

    it('lanza error si no se encuentra la actividad', async () => {
      actividadRepo.findOne.mockResolvedValue(null);
      await expect(service.cambiarEstado(999, 1)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAllActividadesByDate', () => {
    it('devuelve actividades con fecha dada', async () => {
      const actividades = [
        { titulo: 'Taller 1', fecha: '2024-05-18' },
        { titulo: 'Taller 2', fecha: '2024-05-18' },
      ];
      actividadRepo.find.mockResolvedValue(actividades);
      const result = await service.findAllActividadesByDate('2024-05-18');
      expect(result).toEqual(actividades);
    });
  });
});
