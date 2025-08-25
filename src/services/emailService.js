require('dotenv').config();
const nodemailer = require("nodemailer");

let sendSimpleEmail = async (dataSend) => {
   let transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
         user: process.env.EMAIL_APP,
         pass: process.env.EMAIL_APP_PASSWORD
      },
   });

   let info = await transporter.sendMail({
      from: '"Nguyen Quan" <nguyenminhquantth@gmail.com>',
      to: dataSend.receiverEmail,
      subject: 'Thông tin đặt lịch khám bệnh',
      // text: 'Hello world',
      html: getBodyHTMLEmail(dataSend.language, dataSend)
   });
}

let getBodyHTMLEmail = (language, dataSend) => {
   let result = '';
   if(language === 'vi') {
      result = `Xin chào ${dataSend.patientName} !<br>Thông tin đặt lịch khám bệnh của bạn:<br>
         <p>Bạn nhận được email này vì đã đặt lịch khám bệnh online thành công.</p>
         <p>Thông tin đặt lịch khám bệnh</p>
         <div><b>Thời gian: ${dataSend.time}</b></div>
         <div><b>Bác sĩ: ${dataSend.doctorName}</b></div>
         <p>Nếu các thông tin là chính xác, vui lòng click vào đường link để xác nhận hoàn tất.</p>
         <div><a href="${dataSend.redirectLink}" target="_blank">Xác nhận</a></div>
      <div>Chúc bạn sức khỏe!</div>`
   }
   if(language === 'en') {
      result = `Hello ${dataSend.patientName} !<br>Your appointment booking information:<br>
         <p>You received this email because you successfully booked an online medical appointment.</p>
         <p>Appointment information</p>
         <div><b>Time: ${dataSend.time}</b></div>
         <div><b>Doctor: ${dataSend.doctorName}</b></div>
         <p>If the information is correct, please click the link to confirm completion.</p>
         <div><a href="${dataSend.redirectLink}" target="_blank">Confirm</a></div>
      <div>Wish you good health!</div>`
   }
   return result;
}

module.exports = {
   sendSimpleEmail: sendSimpleEmail
}