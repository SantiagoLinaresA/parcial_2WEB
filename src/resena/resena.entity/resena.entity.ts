// resena.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Estudiante } from 'src/estudiante/estudiante.entity/estudiante.entity';
import { Actividad } from 'src/actividad/actividad.entity/actividad.entity';

@Entity()
export class Reseña {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  comentario: string;

  @Column()
  calificacion: number;

  @Column()
  fecha: string;

  @ManyToOne(() => Estudiante, estudiante => estudiante.resenas)
  estudiante: Estudiante;

  @ManyToOne(() => Actividad, actividad => actividad.resenas)
  actividad: Actividad;
}
