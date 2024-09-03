export const TRANSACTION = {
    ACCEPTED: 1,
    SADJ_DECREASE: 2,
    SADJ_INCREASE: 3,
    SOLD: 4,
    WIDTHDRAW: 5,
    ADDED_FROM_CM: 7,
    TRANSFER: 6,
    DATA_UPDATE: 8
};

export const TRANSACTION_LABEL = {
    1: 'Accepted',
    2: 'Decrease From SADJ',
    3: 'Increase From SADJ',
    4: 'Sold',
    5: 'Withdraw',
    7: 'Added From CM',
    6: 'Transfer',
    8: 'Data Update',
}

export const STAKE_CHANNEL = "stake-channel";
export const STAKE_BARCODE_SCAN_EVENT = "stake-barcode-scan-event";
