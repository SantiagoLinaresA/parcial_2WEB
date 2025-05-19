import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany } from 'typeorm';
import { Reseña } from 'src/resena/resena.entity';
import { Estudiante } from 'src/estudiante/estudiante.entity';

@Entity()
export class Actividad {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  titulo: string;

  @Column()
  fecha: string;

  @Column()
  cupoMaximo: number;

  @Column()
  estado: number;

  @OneToMany(() => Reseña, reseña => reseña.actividad)
  resenas: Reseña[];

  @ManyToMany(() => Estudiante, estudiante => estudiante.actividades)
  estudiantes: Estudiante[];
}
