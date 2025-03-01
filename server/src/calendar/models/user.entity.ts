import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { CalendarEvent } from "./calendar-event.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @OneToMany(() => CalendarEvent, (event) => event.user)
  calendarEvents!: CalendarEvent[];
}