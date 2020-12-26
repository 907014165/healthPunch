const axios = require('axios');
const schedule = require('node-schedule');
const nodemailer = require('nodemailer');

const users = [
    {
        emails:['ruanshouhuan@dataknown.cn', '907014165@qq.com'],
        name:'ruanshouhuan',
    },
]

async function sendEmail(toEmailUsers) {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.qq.com",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: '508951069@qq.com', // generated ethereal user
            pass: 'tnmieiwbfmgicaid', // generated ethereal password
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '508951069@qq.com', // sender address
        to: toEmailUsers.join(','), // list of receivers
        subject: "打卡成功", // Subject line
        text: "今日打卡成功", // plain text body
        html: "<b>时刻提醒你是你今天是最优秀的！</b>", // html body
    });
}

const punch = async (name,emails) => {
    /* 先获取cookie */
    const { headers } = await axios({
        method: 'get',
        url: 'https://oawx.shinetechnology.com/oamx/questionNaire/initView'
    })
    const cookieValue = headers['set-cookie'][0].split(';')[0];
    /* 打卡信息 */
    let daka = new URLSearchParams();
    const dakaEntity = {
        userCode: name,
        state: 1,
        stateDesc: '',
        belongCity: '福州',
        contactHubei: 1,
        contactHubeiDesc: '',
        contactDisease: 1,
        contactDiseaseDesc: '',
        ifLeavrCity: 1
    }
    Object.keys(dakaEntity).forEach((key) => {
        daka.append(key, dakaEntity[key])
    })
    const res = await axios({
        method: 'post',
        headers: {
            Cookie: cookieValue,
            'Content-Type': 'application/x-www-form-urlencoded;',
        },
        url: 'https://oawx.shinetechnology.com/oamx/questionNaire/saveQuestionNaire',
        withCredentials: true,
        data: daka
    });
    await sendEmail(emails);
}

const handler = async () =>{
    await Promise.all(users.map(({name,emails}) => punch(name,emails)))
}
// 每天凌晨一点 执行一次 0 0 1 * * ?
// 每五秒执行一次 */5 * * * * ?
schedule.scheduleJob('0 0 1 * * ?', () => {
    handler();
})