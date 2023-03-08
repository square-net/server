import { Arg, Ctx, Field, Mutation, ObjectType, Query, Resolver, UseMiddleware } from "type-graphql";
import { FieldError } from "./common";
import { Post } from "../entities/Post";
import { isAuth } from "../middleware/isAuth";
import { MyContext } from "../types";
import { v4 as uuidv4 } from "uuid";
import { User } from "../entities/User";
import { getConnection } from "typeorm";

@ObjectType()
export class PostResponse {
    @Field(() => [FieldError], { nullable: true })
    errors?: FieldError[];

    @Field(() => Post, { nullable: true })
    post?: Post;

    @Field(() => String, { nullable: true })
    status?: string;
}

@Resolver(Post)
export class PostResolver {
    @Query(() => [Post])
    postFeed() {
        return Post.find({
            order: {
                createdAt: "DESC",
            },
            relations: ["author"],
        });
    }

    @Query(() => Post, { nullable: true })
    findPost(@Arg("postId", { nullable: true }) postId: string) {
        return Post.findOne({ where: { postId }, relations: ["author"] });
    }

    @Mutation(() => PostResponse)
    @UseMiddleware(isAuth)
    async createPost(
        @Arg("type") type: string,
        @Arg("content") content: string,
        @Ctx() { payload }: MyContext
    ): Promise<PostResponse> {
        let errors = [];
        let post;

        if (content === "" || content === null) {
            errors.push({
                field: "content",
                message: "You can't publish a post without content",
            });
        }

        if (type === "" || type === null) {
            errors.push({
                field: "type",
                message: "Invalid type provided",
            })
        }

        if (!payload) {
            errors.push({
                field: "content",
                message: "You are not authenticated",
            });
        } else if (errors.length === 0) {
            try {
                post = await Post.create({
                    postId: uuidv4(),
                    authorId: payload!.id,
                    type,
                    content,
                    author: await User.findOne({ where: { id: payload?.id } }),
                }).save();
            } catch (error) {
                console.log(error);
                errors.push({
                    field: "content",
                    message:
                        "An error has occurred. Please try again later to create a post",
                });
            }
        }

        return {
            post,
            errors,
        };
    }

    @Mutation(() => PostResponse)
    @UseMiddleware(isAuth)
    async updatePost(
        @Arg("type") type: string,
        @Arg("postId") postId: string,
        @Arg("content") content: string,
        @Ctx() { payload }: MyContext
    ): Promise<PostResponse> {
        let errors = [];
        let post;

        if (content === "" || content === null) {
            errors.push({
                field: "content",
                message: "You can't update a post by removing the content",
            });
        }

        if (type === "" || type === null) {
            errors.push({
                field: "type",
                message: "Invalid type provided",
            })
        }

        if (!payload) {
            errors.push({
                field: "content",
                message: "You are not authenticated",
            });
        } else if (errors.length === 0) {
            try {
                const result = await getConnection()
                    .createQueryBuilder()
                    .update(Post)
                    .set({ type, content })
                    .where("postId = :postId and authorId = :authorId", {
                        postId,
                        authorId: payload?.id,
                    })
                    .returning("*")
                    .execute();

                post = result.raw[0];
            } catch (error) {
                console.log(error);
                errors.push({
                    field: "content",
                    message:
                        "An error has occurred. Please try again later to update your post",
                });
            }
        }

        return {
            post,
            errors,
        };
    }

    @Mutation(() => Boolean)
    @UseMiddleware(isAuth)
    async deletePost(
        @Arg("postId") postId: string,
        @Ctx() { payload }: MyContext
    ) {
        if (!payload) {
            return false;
        }

        await Post.delete({ postId, authorId: payload.id }).catch((error) => {
            console.error(error);
            return false;
        });

        return true;
    }
}
