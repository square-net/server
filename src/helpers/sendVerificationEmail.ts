import ejs from "ejs";
import path from "path";
import aws from "aws-sdk";

export const sendVerificationEmail = (
    email: string,
    token: string
) => {
    const ses = new aws.SES({
        credentials: {
            accessKeyId: process.env.SES_KEY_ID!,
            secretAccessKey: process.env.SES_SECRET_KEY!,
        },
        region: "eu-south-1",
    });

    const link = `${process.env.CLIENT_ORIGIN}/verify/${token}`;

    ejs.renderFile(
        path.join(__dirname, "./templates/VerifyEmail.ejs"),
        { link: link },
        function (error, data) {
            if (error) {
                console.log(error);
            } else {
                const params: aws.SES.SendEmailRequest = {
                    Destination: {
                        ToAddresses: [email],
                    },
                    Message: {
                        Body: {
                            Html: {
                                Data: data,
                            },
                        },
                        Subject: {
                            Data: "Verify your account",
                        },
                    },
                    Source: "noreply@projectsquare.online",
                };

                ses.sendEmail(params)
                    .promise()
                    .then(() => {
                        console.log("Email sent.");
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            }
        }
    );
};
