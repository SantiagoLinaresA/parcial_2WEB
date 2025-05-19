import { Test, TestingModule } from '@nestjs/testing';
import { EstudianteService } from './estudiante.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Estudiante } from './estudiante.entity';
import { Actividad } from 'src/actividad/actividad.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('EstudianteService', () => {
  let service: EstudianteService;
  let estudianteRepo: any;
  let actividadRepo: any;

  beforeEach(async () => {
    const mockEstudianteRepo = {
      save: jest.fn(),
      findOne: jest.fn(),
    };

    const mockActividadRepo = {
      findOne: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EstudianteService,
        { provide: getRepositoryToken(Estudiante), useValue: mockEstudianteRepo },
        { provide: getRepositoryToken(Actividad), useValue: mockActividadRepo },
      ],
    }).compile();

    service = module.get<EstudianteService>(EstudianteService);
    estudianteRepo = module.get(getRepositoryToken(Estudiante));
    actividadRepo = module.get(getRepositoryToken(Actividad));
  });

  describe('crearEstudiante', () => {
    it('crea un estudiante válido (caso positivo)', async () => {
      const dto = {
        cedula: 123,
        nombre: 'Ana',
        correo: 'ana@uni.edu.co',
        programa: 'Ingeniería',
        semestre: 4,
      };
      estudianteRepo.save.mockResolvedValue(dto);
      const result = await service.crearEstudiante(dto);
      expect(result).toEqual(dto);
    });

    it('lanza error por correo inválido', async () => {
      const dto = {
        cedula: 123,
        nombre: 'Ana',
        correo: 'correo-invalido',
        programa: 'Ingeniería',
        semestre: 4,
      };
      await expect(service.crearEstudiante(dto)).rejects.toThrow(BadRequestException);
    });

    it('lanza error por semestre fuera de rango', async () => {
      const dto = {
        cedula: 123,
        nombre: 'Ana',
        correo: 'ana@uni.edu.co',
        programa: 'Ingeniería',
        semestre: 15,
      };
      await expect(service.crearEstudiante(dto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findEstudianteById', () => {
    it('devuelve el estudiante si existe', async () => {
      const estudiante = { id: 1, nombre: 'Juan' };
      estudianteRepo.findOne.mockResolvedValue(estudiante);
      const result = await service.findEstudianteById(1);
      expect(result).toEqual(estudiante);
    });

    it('lanza error si no encuentra el estudiante', async () => {
      estudianteRepo.findOne.mockResolvedValue(null);
      await expect(service.findEstudianteById(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('inscribirseActividad', () => {
    const estudiante = { id: 1, nombre: 'Juan', actividades: [] };
    const actividad = {
      id: 1,
      estado: 0,
      cupoMaximo: 2,
      estudiantes: [],
    };

    it('inscribe correctamente (caso positivo)', async () => {
      estudianteRepo.findOne.mockResolvedValue(estudiante);
      actividadRepo.findOne.mockResolvedValue({ ...actividad, estudiantes: [] });

      actividadRepo.save.mockResolvedValue(true);

      const result = await service.inscribirseActividad(1, 1);
      expect(result).toEqual({ mensaje: 'Inscripción exitosa', estado: true });
    });

    it('lanza error si actividad está cerrada', async () => {
      estudianteRepo.findOne.mockResolvedValue(estudiante);
      actividadRepo.findOne.mockResolvedValue({ ...actividad, estado: 1 });
      await expect(service.inscribirseActividad(1, 1)).rejects.toThrow(BadRequestException);
    });

    it('lanza error si la actividad está llena', async () => {
      estudianteRepo.findOne.mockResolvedValue(estudiante);
      actividadRepo.findOne.mockResolvedValue({ ...actividad, estudiantes: [{ id: 2 }, { id: 3 }] });
      await expect(service.inscribirseActividad(1, 1)).rejects.toThrow(BadRequestException);
    });

    it('lanza error si el estudiante ya está inscrito', async () => {
      estudianteRepo.findOne.mockResolvedValue(estudiante);
      actividadRepo.findOne.mockResolvedValue({ ...actividad, estudiantes: [{ id: 1 }] });
      await expect(service.inscribirseActividad(1, 1)).rejects.toThrow(BadRequestException);
    });
  });
});
