// berkas ini digunakan untuk menuliskan program consumer queue.

// Karena berkas ini merupakan entry point atau berkas pertama yang akan dijalankan oleh node, jadi langkah pertama yang perlu kita lakukan adalah mengonfigurasi environment variable menggunakan dotenv.
require('dotenv').config();
const amqp = require('amqplib');
const MailSender = require('./MailSender');
const NotesService = require('./NotesService');
const Listener = require('./listener');

const init = async() => {
    const notesService = new NotesService();
    const mailSender = new MailSender();
    const listener = new Listener(notesService, mailSender);

    const connection = await amqp.connect(process.env.RABBITMQ_SERVER);
    const channel = await connection.createChannel();

    // pastikan queue dengan nama export:notes telah terbuat menggunakan fungsi channel.assertQueue.
    await channel.assertQueue('export:notes', {
        durable: true,
    });

    // consume queue export:notes dengan menetapkan listener.listen sebagai fungsi callback-nya.
    channel.consume('export:notes', listener.listen, { noAck: true });

};

init();