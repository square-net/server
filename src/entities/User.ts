import { Field, Int, ObjectType } from "type-graphql";
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    BaseEntity,
    ManyToOne,
    OneToMany,
    UpdateDateColumn,
} from "typeorm";

@ObjectType()
export class Profile {
    @Field(() => String, { nullable: true })
    @Column({ nullable: true })
    profilePicture: string;

    @Field(() => String, { nullable: true })
    @Column({ nullable: true })
    profileBanner: string;

    @Field(() => String, { nullable: true })
    @Column({ nullable: true })
    bio: string;

    @Field(() => String, { nullable: true })
    @Column({ nullable: true })
    website: string;
}

@ObjectType()
export class Session {
    @Field(() => User)
    @ManyToOne(() => User, (user) => user.sessions, { onDelete: "CASCADE" })
    user: User;

    @Field(() => String, { nullable: false })
    @Column({ type: "uuid", unique: true, nullable: false })
    sessionId: string;

    @Field(() => String, { nullable: false })
    @Column({ nullable: false })
    deviceName: string;

    @Field(() => String, { nullable: false })
    @Column({ nullable: false })
    deviceLocation: string;

    @Field(() => String, { nullable: false })
    @CreateDateColumn({ nullable: false })
    creationDate: Date;

    @Field(() => String, { nullable: false })
    @UpdateDateColumn({ nullable: false })
    lastAccessDate: Date;
}

@ObjectType()
@Entity("users")
export class User extends BaseEntity {
    @Field(() => Int)
    @PrimaryGeneratedColumn()
    id: number;

    @Field(() => String, { nullable: false })
    @Column({ nullable: false })
    firstName: string;

    @Field(() => String, { nullable: false })
    @Column({ nullable: false })
    lastName: string;

    @Field(() => String, { nullable: false })
    @Column({ unique: true, nullable: false })
    username: string;

    @Field(() => String, { nullable: false })
    @Column({ unique: true, nullable: false })
    email: string;

    @Column({ nullable: false })
    password: string;

    @Field(() => String, { nullable: false })
    @Column({ nullable: false })
    gender: string;

    @Field(() => String, { nullable: false })
    @CreateDateColumn({ nullable: false })
    birthDate: Date;

    @Field(() => Boolean)
    @Column()
    emailVerified: boolean;

    @Field(() => Profile)
    @Column(() => Profile)
    profile: Profile;

    @Column("int", { default: 0 })
    tokenVersion: number;

    @Field(() => [Session], { nullable: true, defaultValue: [] })
    @OneToMany(() => Session, (session) => session.user, { nullable: true })
    sessions: Session[];
}
