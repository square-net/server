import { Field, Int, ObjectType } from "type-graphql";
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    BaseEntity,
    ManyToOne,
    OneToMany,
} from "typeorm";
import { Post } from "./Post";

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

    @Field(() => Profile, { nullable: true })
    @Column(() => Profile)
    profile: Profile;

    @Column("int", { default: 0 })
    tokenVersion: number;

    @Field(() => [Session], { nullable: true, defaultValue: [] })
    @OneToMany(() => Session, (session) => session.user, { nullable: true })
    sessions: Session[];

    @Field(() => [Post], { nullable: true, defaultValue: [] })
    @OneToMany(() => Post, (post) => post.author, { nullable: true })
    posts: Post[];
}

@ObjectType()
@Entity("sessions")
export class Session extends BaseEntity {
    @Field(() => Int)
    @PrimaryGeneratedColumn()
    id: number;

    @Field(() => User)
    @ManyToOne(() => User, (user) => user.sessions)
    user: User;

    @Field(() => String, { nullable: false })
    @Column({ type: "uuid", unique: true, nullable: false })
    sessionId: string;

    @Field(() => String, { nullable: false })
    @Column({ nullable: false })
    clientOS: string;

    @Field(() => String, { nullable: false })
    @Column({ nullable: false })
    clientName: string;

    @Field(() => String, { nullable: false })
    @Column({ nullable: false })
    deviceLocation: string;

    @Field(() => String, { nullable: false })
    @CreateDateColumn({ nullable: false })
    creationDate: Date;
}
