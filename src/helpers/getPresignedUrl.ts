import aws from "aws-sdk";

const storageHelper = new aws.S3({
    credentials: {
        accessKeyId: process.env.STORAGE_KEY_ID!,
        secretAccessKey: process.env.STORAGE_SECRET_KEY!,
    },
    region: "eu-south-1",
});

export async function getPresignedUrl(key: string) {
    const url = storageHelper
        .getSignedUrlPromise("putObject", {
            Bucket: process.env.STORAGE_BUCKET_NAME!,
            Key: key,
            ContentType: "image/*",
            Expires: 300,
        });
    return url;
}