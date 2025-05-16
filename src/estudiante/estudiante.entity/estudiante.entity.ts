import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Reseña } from 'src/resena/resena.entity/resena.entity';
import { Actividad } from 'src/actividad/actividad.entity/actividad.entity';

@Entity()
export class Estudiante {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  cedula: number;

  @Column()
  nombre: string;

  @Column()
  correo: string;

  @Column()
  programa: string;

  @Column()
  semestre: number;

  @OneToMany(() => Reseña, reseña => reseña.estudiante)
  resenas: Reseña[];

  @OneToMany(() => Actividad, actividad => actividad.estudiante)
  actividades: Actividad[];
}
