import { Test, TestingModule } from '@nestjs/testing';
import { ResenaService } from './resena.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Reseña } from './resena.entity';
import { Estudiante } from 'src/estudiante/estudiante.entity';
import { Actividad } from 'src/actividad/actividad.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('ResenaService', () => {
  let service: ResenaService;
  let resenaRepo: any;
  let estudianteRepo: any;
  let actividadRepo: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ResenaService,
        {
          provide: getRepositoryToken(Reseña),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Estudiante),
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Actividad),
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ResenaService>(ResenaService);
    resenaRepo = module.get(getRepositoryToken(Reseña));
    estudianteRepo = module.get(getRepositoryToken(Estudiante));
    actividadRepo = module.get(getRepositoryToken(Actividad));
  });

  describe('agregarResena', () => {
    const data = {
      comentario: 'Muy buena actividad',
      calificacion: 5,
      fecha: '2024-05-18',
      estudianteId: 1,
      actividadId: 10,
    };

    const estudianteMock = { id: 1, actividades: [] };
    const actividadMock = { id: 10, estado: 2, estudiantes: [{ id: 1 }] };

    it('crea una reseña correctamente (caso positivo)', async () => {
      estudianteRepo.findOne.mockResolvedValue(estudianteMock);
      actividadRepo.findOne.mockResolvedValue(actividadMock);
      resenaRepo.create.mockReturnValue({ ...data, estudiante: estudianteMock, actividad: actividadMock });
      resenaRepo.save.mockResolvedValue({ id: 1, ...data });

      const result = await service.agregarResena(data);
      expect(result).toHaveProperty('id');
    });

    it('falla si la actividad no está finalizada', async () => {
      estudianteRepo.findOne.mockResolvedValue(estudianteMock);
      actividadRepo.findOne.mockResolvedValue({ ...actividadMock, estado: 0 });
      await expect(service.agregarResena(data)).rejects.toThrow(BadRequestException);
    });

    it('falla si el estudiante no está inscrito', async () => {
      estudianteRepo.findOne.mockResolvedValue(estudianteMock);
      actividadRepo.findOne.mockResolvedValue({ ...actividadMock, estudiantes: [{ id: 999 }] });
      await expect(service.agregarResena(data)).rejects.toThrow(BadRequestException);
    });

    it('falla si no encuentra estudiante o actividad', async () => {
      estudianteRepo.findOne.mockResolvedValue(null);
      actividadRepo.findOne.mockResolvedValue(null);
      await expect(service.agregarResena(data)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findClaseById', () => {
    it('devuelve la reseña si existe', async () => {
      const reseña = { id: 1, comentario: 'Excelente' };
      resenaRepo.findOne.mockResolvedValue(reseña);
      const result = await service.findClaseById(1);
      expect(result).toEqual(reseña);
    });

    it('devuelve null si no existe', async () => {
      resenaRepo.findOne.mockResolvedValue(null);
      const result = await service.findClaseById(999);
      expect(result).toBeNull();
    });
  });
});
