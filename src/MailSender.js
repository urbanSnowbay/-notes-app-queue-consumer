// berkas ini digunakan untuk menuliskan fungsi dalam mengirim pesan melalui email.
const nodemailer = require('nodemailer');

class MailSender {
    constructor() {
        this._transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.MAIL_ADDRESS,
                pass: process.env.MAIL_PASSWORD,
            },
        });
    }

    // Parameter targetEmail merupakan alamat email tujuan, di mana nanti kita akan mendapatkannya dari pesan yang ada di queue. Kemudian, parameter content merupakan data notes yang didapat dari fungsi getNotes di NotesService. Kita akan mengirimkan data notes (content) dalam bentuk attachment berkas JSON pada email.
    sendEmail(targetEmail, content) {
        const message = {
            from: 'Notes Apps',
            to: targetEmail,
            subject: 'Ekspor Catatan',
            text: 'Terlampir hasil dari ekspor catatan',
            attachments: [
                {
                    filename: 'notes.json',
                    content,
                },
            ],
        };

        // Fungsi sendMail akan mengembalikan promise yang membawa status pengiriman email. Kita bisa manfaatkan itu sebagai nilai return. Tujuannya, agar kita bisa menggunakan async/await ketika menggunakan fungsi sendEmail untuk mendapatkan status pengirimannya.
        return this._transporter.sendMail(message);
    }
}

module.exports = MailSender;