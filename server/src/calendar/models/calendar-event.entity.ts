import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class CalendarEvent {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column()
  date!: Date;

  @Column()
  description!: string;
}