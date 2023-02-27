import { Field, Int, ObjectType } from "type-graphql";
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    BaseEntity,
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
}
