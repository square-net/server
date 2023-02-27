import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class FieldError {
    @Field({ nullable: true })
    field?: string;

    @Field()
    message: string;
}
