import { readFile } from 'fs/promises'
import { compile } from 'handlebars'
import path from 'path'
import nodemailer from 'nodemailer'
import { User } from '@prisma/client'

const sendMail = async (to: string, subject: string, text: string, html: string, link: string, user: User) => {
    
    const htmlFilePath = await readFile(
        path.join(__dirname, '..', 'public', 'html', html),
        'utf-8'
    );

    const template = compile(htmlFilePath);

    const htmlToSend = template({ link, name: user.name });

    const transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.ADMIN,
            pass: process.env.EMAIL_PASSWORD
        }
    })

    const mailOptions = {
        from: `Pixis 📧 ${process.env.ADMIN}`,
        to: to,
        subject: subject,
        text: text,
        html: htmlToSend
    }

    await transport.sendMail(mailOptions)
    
}

export default sendMail;