// RPC地址
// const RPC_NODE = 'https://api.avax.network/ext/bc/C/rpc'
const RPC_NODE = 'https://avalanche-mainnet.infura.io/v3/f9fb09e1be264ec7944a07085a0f3418'
// 主钱包私钥
const PRIVATE_KEY = ''

// 钱包存储路径
const WALLET_PATH = './wallets.json'
// 钱包生成数量
const WALLET_COUNT = 10

// 铭文memo
const MINT_MEMO = 'data:,{"p":"injrc-20","op":"mint","tick":"INJS","amt":"1000"}'
// 自转数量
const MINT_TRANSFER_AMOUNT = 0.0001
// Mint次数
const MINT_TIMES = 1
// Mint后等待时间, 单位毫秒
const MINT_WAIT = 1000

// 发送原生代币数量
const TRANSFER_AMOUNT = 0.001

// 交易手续费倍数
const GAS_PRICE_MULTIPLY = 1.5
// 交易手续费上限
const GAS_LIMIT = 50000

export default {
    RPC_NODE,
    PRIVATE_KEY,
    WALLET_COUNT,
    WALLET_PATH,
    TRANSFER_AMOUNT,
    GAS_PRICE_MULTIPLY,
    GAS_LIMIT,
    MINT_MEMO,
    MINT_TRANSFER_AMOUNT,
    MINT_TIMES,
    MINT_WAIT
}