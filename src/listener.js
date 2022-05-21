// berkas ini digunakan untuk menuliskan fungsi callback yang akan dijalankan setiap kali consumer menerima pesan. Fungsi listener ini membutuhkan NotesService dan MailSender untuk mendapatkan catatan dan mengirimnya melalui email.

class Listener {
    constructor(notesService, mailSender) {
        this._notesService = notesService;
        this._mailSender = mailSender;

        this.listen = this.listen.bind(this);
    }

    async listen(message) {
        try {
            // Saat ini untuk message bertipe ConsumeMessage, guna mendapatkan konten aslinya kita bisa memakai fungsi message.content.toString() serta mengubah string menjadi objek menggunakan JSON.parse.
            const { userId, targetEmail } = JSON.parse(message.content.toString());

            const notes = await this._notesService.getNotes(userId);
            // Fungsi sendEmail hanya menerima content dalam bentuk string, itulah alasan mengapa kita menggunakan JSON.stringify pada pengiriman notes.
            const result = await this._mailSender.sendEmail(targetEmail, JSON.stringify(notes));
            console.log(result);
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = Listener;