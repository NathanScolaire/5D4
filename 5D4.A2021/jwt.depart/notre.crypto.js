import crypto from 'crypto';

const block = {
    id: 1,
    transactions: [],
    miner: 'Nathan Ethier',
    nonce: 1
}

let tries = 0;
let hash = '';
do {
    block.nonce++;
    hash = crypto.createHash('sha256').update(JSON.stringify(block)).digest('hex');
    console.log(hash);
    tries++;
} while (!hash.startsWith('00000'));
console.log(tries);