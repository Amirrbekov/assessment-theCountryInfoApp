import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

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

  @ManyToOne(() => User, (user) => user.calendarEvents)
  user!: User;
}