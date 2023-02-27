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

    @Field(() => String, { nullable: true })
    @Column({ nullable: true })
    field: string;
}

@ObjectType()
@Entity("users")
export class User extends BaseEntity {
    @Field(() => Int)
    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @Column()
    firstName: string;

    @Field()
    @Column()
    lastName: string;

    @Field()
    @Column({ unique: true })
    username: string;

    @Field()
    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Field()
    @Column()
    title: string;

    @Field()
    @Column()
    gender: string;

    @Field(() => String)
    @CreateDateColumn()
    birthDate: Date;

    @Field()
    @Column()
    verified: boolean;

    @Field(() => Profile, { nullable: true })
    @Column(() => Profile)
    profile: Profile;

    @Column("int", { default: 0 })
    tokenVersion: number;
}
