// RPC地址
const RPC_NODE = 'https://avalanche-mainnet.infura.io/v3/345678904b4c48f2ac2c5bc0f9a5b0f0'
// 主钱包私钥
const PRIVATE_KEY = '123456b9462790e20d08840932291804314b0e48635ac12965f4e32f9847c1bf'

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

// 交易手续费, 单位gwei
const GAS_PRICE = 100
// 交易手续费上限
const GAS_LIMIT = 30000

export default {
    RPC_NODE,
    PRIVATE_KEY,
    WALLET_COUNT,
    WALLET_PATH,
    TRANSFER_AMOUNT,
    GAS_PRICE,
    GAS_LIMIT,
    MINT_MEMO,
    MINT_TRANSFER_AMOUNT,
    MINT_TIMES,
    MINT_WAIT
}