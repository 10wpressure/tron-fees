
// 1. short: MM-DD-YYYY
// 2. long:  DD-MM-YYYY
export const stringToTimestamp = (x: string) => {
    //  let d: any = new Date(x);
    // return  d * 1

    const myDate = x.split("-");
    const newDate = new Date( Number(myDate[2]), Number(myDate[1]) - 1, Number(myDate[0]));
    return newDate.getTime();
}

export function timeConverter(UNIX_timestamp: number): string {
    const a = new Date(UNIX_timestamp * 1000);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const year = a.getFullYear();
    const month = months[a.getMonth()];
    const date = a.getDate();
    const hour = a.getHours();
    const min = a.getMinutes();
    const sec = a.getSeconds();
    return date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec;
}
//
// console.log(new Date('2021/07/22').getTime());
//
// stringToTimestamp('01-01-2022')

const TronWeb = require('tronweb');
const tronWeb = new TronWeb(
    'http://162.55.216.128:8090',
    'http://162.55.216.128:8091',
    'https://api.trongrid.io',
);


// const addressInHexFormat = '414450cf8c8b6a8229b7f628e36b3a658e84441b6f';
// const addressInBase58 = tronWeb.address.fromHex(addressInHexFormat);
// const hotWallet = 'TT2YwaJ8DXsrpycgBGDWEei1FUQm6YT85T';
// const subWallet = 'TVNdyXbcJ5ZwwFsjnScrNXSv9d435guynT';
// const addressInHex = tronWeb.address.toHex(subWallet);
// console.log(addressInHex)

// console.log(stringToTimestamp('7-12-2021'));