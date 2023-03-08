import { Field, Int, ObjectType } from "type-graphql";
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    BaseEntity,
    ManyToOne,
    UpdateDateColumn,
} from "typeorm";
import { User } from "./User";

@ObjectType()
export class Media {
    @Field(() => [String], { nullable: true })
    @Column({ type: "text", array: true, nullable: true })
    images: string[];

    @Field(() => [String], { nullable: true })
    @Column({ type: "text", array: true, nullable: true })
    videos: string[];
}

@ObjectType()
@Entity("posts")
export class Post extends BaseEntity {
    @Field(() => Int)
    @PrimaryGeneratedColumn()
    id: number;

    @Field(() => String, { nullable: false })
    @Column({ type: "uuid", unique: true, nullable: false })
    postId: string;

    @Field(() => Number, { nullable: false })
    @Column({ nullable: false })
    authorId: number;

    @Field(() => User, { nullable: false })
    @ManyToOne(() => User, (user) => user.posts, { nullable: false })
    author: User;

    @Field(() => String, { nullable: false })
    @Column({ nullable: false })
    type: string;

    @Field(() => String, { nullable: false })
    @Column({ nullable: false })
    content: string;

    @Field(() => String, { nullable: false })
    @CreateDateColumn({ nullable: false })
    createdAt: Date;

    @Field(() => String, { nullable: false })
    @UpdateDateColumn({ nullable: false })
    updatedAt: Date;

    @Field(() => Media, { nullable: true })
    @Column(() => Media)
    media: Media;
}