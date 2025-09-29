import{
    Entity, 
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    BeforeInsert,
    BeforeUpdate

} from 'typeorm';

@Entity('users')
export class UserEntitySchema {
  @PrimaryGeneratedColumn({name:'user-id'})
  id!: string;

  @Column({ type: "varchar", length: 100 })
  name!: string;

  @Column({ type: "varchar", length: 150, unique: true })
  email!: string;

  @Column({ type: "varchar", length: 255 })
  password!: string;

  @Column({ type: "jsonb", default: [] })
  role!: string[];

  @Column({ type: "varchar", length: 255, nullable: true })
  img?: string;
}
