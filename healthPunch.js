const axios = require('axios');
const schedule = require('node-schedule');
const handler = async () => {
    /* 先获取cookie */
    const { headers } = await axios({
        method:'get',
        url:'https://oawx.shinetechnology.com/oamx/questionNaire/initView'
    })
    const cookieValue = headers['set-cookie'][0].split(';')[0];
    /* 打卡信息 */
    let daka = new URLSearchParams();
    const dakaEntity = {
        userCode:'ruanshouhuan',
        state:1,
        stateDesc:'',
        belongCity:'福州',
        contactHubei:1,
        contactHubeiDesc:'',
        contactDisease:1,
        contactDiseaseDesc:'',
        ifLeavrCity:1
    }
    Object.keys(dakaEntity).forEach((key)=>{
        daka.append(key,dakaEntity[key])
    })
    const res = await axios({
        method:'post',
        headers:{
            Cookie:cookieValue,
            'Content-Type':'application/x-www-form-urlencoded;',
        },
        url:'https://oawx.shinetechnology.com/oamx/questionNaire/saveQuestionNaire',
        withCredentials:true,
        data:daka
    });
}
// 每天凌晨一点 执行一次 0 0 1 * * ?
// 每五秒执行一次 */5 * * * * ?
schedule.scheduleJob('0 0 1 * * ?',()=>{
    handler();
})