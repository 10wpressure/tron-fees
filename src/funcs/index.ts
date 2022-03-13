import axios from "axios";
import {runUncritical} from "./async-utils";
import {IFeesResult, ITxFee, ITxTrx} from "../interfaces";
import {timeConverter} from "./utils";
import {isNumber} from "util";

const debug = true;

const postRequest = async (endpoint: string, data?: any) => {
    try {
        const result = await runUncritical(axios, axios.post, endpoint, data);

        if (result.status === 200) {
            return result.data;
        } else {
            throw new Error(`Unexpected response status: ${result}`);
        }
    } catch (e: any) {
        throw new Error(e);
    }
};

const getRequest = async (endpoint: string) => {
    try {
        const result = await runUncritical(axios, axios.get, endpoint);

        if (result.status === 200) {
            return result;
        } else {
            throw new Error(`Unexpected response status: ${result}`);
        }
    } catch (e: any) {
        throw new Error(e);
    }
};

let feesTotal: number = 0;
export const getTrxFeesByHeight = async (address: string, hexSubsidy: string, hexHot: string, minTimestamp: number, maxTimestamp: number, fee: number, i: number, j: number, isSubsidyTx: boolean): Promise<IFeesResult> => {
    try {
        // const contractAddress = 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t'; // USDT
        // Make sure its 13 digits - ms are needed in request

        const fees: ITxFee[] = [];
        let nextTimestamp = 0;

        // functions is recursive, it receives either starting timestamp or the timestamp of the last tx as an argument
        // to traverse the blockchain from the minTimestamp to the Date.now()
        // 1. we get 200 transactions on our account from the min timestamp
        // 2. if have fingerprint in meta of the response we replace timestamp with last tx block_timestamp + 1000
        // 3. recursively calls itself until there's no fingerprint in meta - it means we reached Date.now()
        // TODO: Do we need to memorize Date.now() as a maxTimestamp? otherwise we might go beyond it, might affect calculations
        const maxT = maxTimestamp.toString().length === 13
            ? maxTimestamp
            : maxTimestamp * 1000;

        const minT = minTimestamp.toString().length === 13
            ? minTimestamp
            : minTimestamp * 1000;

        const baseUrl = `https://api.trongrid.io/v1/accounts`;
        const middlePartUrl = `transactions?only_confirmed=true&limit=200&order_by=block_timestamp,asc`;
        const txByTime = `${baseUrl}/${address}/${middlePartUrl}&min_timestamp=${minT}&max_timestamp=${maxT}`;
        // const middlePartUrl = `transactions/trc20?only_confirmed=true&limit=200&order_by=block_timestamp,asc`;
        // const endPartUrl = `contract_address=${contractAddress}`;
        // const txByTime = `${baseTronGridUrl}/${address}/${middlePartUrl}&min_timestamp=${minT}&max_timestamp=${maxT}&${endPartUrl}`;


        const {data: response} = await getRequest(txByTime);
        console.log(response)

        if (!response.data) {
            if (debug) {
                console.log(`${i}. No tx were found for ${address}`);
            }
            return {
                txReport: fees,
                feesTotal: feesTotal
            };
        }
        const transactions: ITxTrx[] = response.data;
        if (debug) {
            console.log(`${i}. transactions length: ${transactions.length} `)
        }
        // console.log(!!response.meta, response.meta.fingerprint)

        if (debug) {
            console.log(`${i}. Beginning of transactions.forEach: ${address}`);
        }
        transactions.forEach((tx, key, arr) => {
            let currentTxFee = 0;

            if (isSubsidyTx && tx.raw_data.contract[0].parameter.value.owner_address === hexSubsidy &&
                tx.raw_data.contract[0].parameter.value.to_address !== hexHot &&
                !isNaN(tx.raw_data.contract[0].parameter.value.amount)) {
                currentTxFee += tx.raw_data.contract[0].parameter.value.amount;
            }
            if (!!tx.ret && tx.ret[0] && tx.ret[0].fee && !isNaN(tx.ret[0].fee)) {
                currentTxFee += tx.ret[0].fee;
            }
            // console.log(`${i}. tx.raw_data.contract[0].parameter.value.owner_address ${tx.raw_data.contract[0].parameter.value.owner_address}`);
            // console.log(`${i}. tx.raw_data.contract[0].parameter.value.to_address ${tx.raw_data.contract[0].parameter.value.to_address}`);
            // console.log(currentTxFee);
            feesTotal += currentTxFee;
            fees.push({
                num: i,
                asset: 'TRX',
                txId: tx.txID,
                date: timeConverter(tx.block_timestamp / 1000),
                fee: currentTxFee,
                totalSun: feesTotal,
                totalTrx: feesTotal / 1000000
            })

            if (debug) {
                console.log(`${i}. [${fees[key].asset}] ${fees[key].date}: ${fees[key].txId}, ${fees[key].fee}`)
            }
            i++;
            if (key === arr.length - 1) {
                // if there were a lot of transactions (if we have fingerprint -> more than 200tx)- call the func recursively?
                if (!!response.meta && response.meta.fingerprint) {
                    // ++j;
                    nextTimestamp = tx.block_timestamp + 1000
                    // console.log(nextTimestamp)
                    return {
                        txReport: fees,
                        feesTotal,
                        nextTimestamp,
                    };
                    // if (debug) {
                    //     console.log(`${i}. ${j} level, ${minT}, ${nextTimestamp}`)
                    // }
                    // getTrxFeesByHeight(address, nextTimestamp, maxT, feesTotal, i, j)
                    //     .catch(e => {throw new Error(e)})
                } else {
                    console.log(nextTimestamp)
                    return {
                        txReport: fees,
                        feesTotal: feesTotal,
                        nextTimestamp,
                    };
                }
            }
        });
        // if (debug) {
        //     console.log(`${i}. [${fees[i].asset}] ${fees[i].date}: ${fees[i].txId}, ${fees[i].fee}`)
        // }
        // console.log(`${i}. ${address}, ${minTimestamp}: fees = ${feesTotal}`)

        return {
            txReport: fees,
            feesTotal: feesTotal,
            nextTimestamp,
        };

    } catch (error) {
        console.log(error);
        throw new Error(`Problem while getting fees (${minTimestamp} till ${maxTimestamp}) to for address ${address}`);
    }
};

// getRequest('https://api.trongrid.io/v1/accounts/TT2YwaJ8DXsrpycgBGDWEei1FUQm6YT85T/transactions?only_confirmed=true&limit=200&order_by=block_timestamp,asc&min_timestamp=1626901200000&max_timestamp=1640984400000')
//     .then(res => console.log(res))
// .catch(error => console.log(error))