import {stringToTimestamp, timeConverter} from "./funcs/utils";
import {getTrxFeesByHeight} from "./funcs";
import {ITxFee} from "./interfaces";
import {sleep, timeout} from "./funcs/async-utils";
import * as fs from 'fs';
const BigNumber = require('bignumber.js');
import csvAppend from "csv-append";

const start = stringToTimestamp('01-03-2022')
const finish = stringToTimestamp('14-03-2022')
// const date = new Date();
// date.setDate(date.getDate() - 2);
// console.log(date, start, finish);
// const start = date.getTime();
// const finish = Date.now();
console.log(start)
console.log(finish)

const hotWallet = 'TT2YwaJ8DXsrpycgBGDWEei1FUQm6YT85T';
const hexHotWallet = '41bb1c07fe4b04a06227f65530155566cde3fee65e'
const subWallet = 'TVNdyXbcJ5ZwwFsjnScrNXSv9d435guynT';
const hexSubWallet = '41d4d8cdce80b0628621109add8174bcd57c41312e';
const wallets = [
    hotWallet,
    subWallet
]

const hex = {
    trx: {
        sub: hexHotWallet,
        hot: subWallet
    }
}

const main = async (wallet: string, minT: number, maxT: number, fee: number, i: number, isSubsidy: boolean, fileName: string) => {
    const path = `db/${fileName}.csv`;
    const {append} = csvAppend(path, true);
    try {
        let start = minT;
        const finish = maxT;
        const completeTxReport: ITxFee[] = [];
        let completeFees: number = 0;

        while (start !== 0) {

            const response = await getTrxFeesByHeight(wallet, hexSubWallet, hexHotWallet, start, finish, completeFees, i, 0, isSubsidy)
            // console.log(`${i}. nextTimestamp: ${timeConverter(response.nextTimestamp! / 1000)}`)
            if (!!response.nextTimestamp) {
                start = response.nextTimestamp;
                i = response.txReport[response.txReport.length - 1].num + 1;
                completeFees += response.feesTotal;
                completeTxReport.push(...response.txReport);
                console.log(completeFees);
                await append(response.txReport);
                await sleep(1000)
            } else {
                i = response.txReport[response.txReport.length - 1].num + 1;
                completeFees += response.feesTotal;
                completeTxReport.push(...response.txReport);
                console.log(completeFees);
                await append(response.txReport);
                await sleep(1000)
                start = 0;
            }
        }
        return {completeTxReport, completeFees}
    } catch (e) {console.log(e)}
}
// let x: any = undefined;
// let y = new BigNumber(x);

// console.log(y.isNaN());


main(subWallet, start, finish, 0, 0, true, 'subsidy_march_2022')
    // .then((res) => process.exit(0))
    .catch((error) => {
        console.error(error);
    });
// main(hotWallet, start, finish, 0, 0, false, 'hot_march_2022')
//     .then((res) => process.exit(0))
//     .catch((error) => {
//         console.error(error);
//     });


