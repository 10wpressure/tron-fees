export interface ITxTrx {
    "ret": [
        {
            "contractRet": "SUCCESS" | string,
            "fee": number
        }
    ],
    "signature": string[],
    "txID": string,
    "net_usage": number, // bandwidth?
    "raw_data_hex": string,
    "net_fee": number, // bandwidth
    "energy_usage": number, // energy
    "blockNumber": number, // height
    "block_timestamp": number, // use it to cycle through dates
    "energy_fee": number,
    "energy_usage_total": number,
    "raw_data": {
        "contract": [
            {
                "parameter": {
                    "value": {
                        "amount": number,
                        "owner_address": string,
                        "to_address": string
                    },
                    "type_url": string // "type.googleapis.com/protocol.TransferContract"
                },
                "type": "TransferContract" | string
            }
        ],
        "ref_block_bytes": "631c",
        "ref_block_hash": "4ed8fa45ec34c90f",
        "expiration": number, // timestamp
        "timestamp": number, // timestamp
    },
    "internal_transactions": []
}


export interface ITxTRC20 {
    transaction_id: string;
    token_info: ITokenInfo;
    block_timestamp: number;
    from: string;
    to: string;
    type: string;
    value: string;
}

export interface ITokenInfo {
    symbol: string;
    address: string;
    decimals: number;
    name: string;
}

export interface IDepositAddress {
    "__uuid": string,
    "__load_date": string,
    "__update_date": string,
    "__create_date": string,
    "id": string,
    "blockchain_name": 'BSC' | 'ETH' | 'TRON',
    "address": string,
    "memo": null,
    "account_number": number,
    "last_accessed": null,
    "is_used": null,
    "created_at": string,
    "updated_at": string,
    "index": number,
    "account_id": string
}

export interface IAddress {
    blockchain: 'BSC' | 'ETH' | 'TRON',
    provider?: 'ERC20' | 'BSC_TOKEN' | 'TRC20',
    address: string,
}

export interface IAPIConcurrent {
    i: number,
    base_url: string,
    baseRpc: string,
    token: string,
    address: string,
    blockNum: number
    apiKey?: string
}

export interface IApiRequest {
    i: number,
    base_url: string,
    baseRpc: string,
    token: string,
    address: string,
    blockNum: number,
    apiKey: string
}

export interface IWriteToCSV {
    i: number,
    blockchain: string,
    contractAddress: string,
    address: string,
    blockNum: number,
    balance: number
}

export interface AddressList {
    address: string;
    cursor?: string;
    memo?: string[];
}

export interface ITxFee {
    num: number,
    asset: 'TRX' | 'TRC10' | 'TRC20',
    txId: string,
    date: number | string,
    fee: number,
    totalSun: number,
    totalTrx: number,
}

export interface IFeesResult {
    txReport: ITxFee[],
    feesTotal: number,
    nextTimestamp?: number,
}

/**
 * Interface for stellar-like systems where you can get tx directly from blockchain,
 * so you can get only incoming or outcoming, or just both of them
 */
export enum TransactionDirection {
    input = 'input',
    output = 'output',
    any = 'any',
}

/**
 * For XLM-like currencies we need to keep cursor for every address, so in this case we will send array of AddressCursor
 */
export interface CursorTxReceipt {
    cursor?: string;
    receipts: [];
    cursors?: [];
}