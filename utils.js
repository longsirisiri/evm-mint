import { ethers } from 'ethers'

async function waitTransaction(wallet, txHash, timeout = 15) {
    const end = Date.now() + timeout * 1000
    while (Date.now() < end) {
        const receipt = await wallet.provider.getTransactionReceipt(txHash)
        console.log(`${wallet.address} ${txHash} receipt: ${receipt}`)
        if (receipt) {
            return true
        }

        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    return false
}

export async function sendAndWatchTransaction(wallet, txData, fnGasPrice, timeout = 15) {
    let done = false
    let round = 0
    let txHash = null
    while (!done) {
        try {
            const gasPrice = await fnGasPrice(txData, round++)
            if (!gasPrice) {
                console.log(`${wallet.address} ${txData.nonce} gas price is null`)
                break;
            }

            const txNew = { ...txData, gasPrice: gasPrice }
            console.log(`${wallet.address} sending tx with nonce ${txNew.nonce} and gas price ${ethers.formatUnits(gasPrice.toString(), 'gwei')}`)
            const tx = await wallet.sendTransaction(txNew)
            txHash = tx.hash
            console.log(`${wallet.address} sent: ${txHash} with nonce ${txNew.nonce} and gas price ${ethers.formatUnits(gasPrice.toString(), 'gwei')}`)
            done = await waitTransaction(wallet, tx.hash, timeout)
        } catch (e) {
            const msg = e.message
            if (msg.includes('nonce too low')) {
                done = true
            } else {
                console.log(`${wallet.address} ${txData.nonce} error: ${msg}`)
            }
        }
    }

    console.log(`${wallet.address} ${txHash} ${txData.nonce} DONE!`)
}

export async function cancelPendingTransactions(wallet) {
    const pendingCount = await wallet.provider.getTransactionCount(wallet.address, 'pending')
    const latestCount = await wallet.provider.getTransactionCount(wallet.address, 'latest')
    console.log(`Pending: ${pendingCount} Latest: ${latestCount}`)
    for (let i = latestCount; i < pendingCount; i++) {
        console.log(`Canceling tx ${i}`)
        const txData = {
            to: wallet.address,
            value: 0,
            nonce: i,
            gasLimit: 21000
        }
        await sendAndWatchTransaction(wallet, txData, async (tx, round) => {
            const feeData = await wallet.provider.getFeeData()
            const gasPrice = feeData.gasPrice * (100n + round * 20n) / 100n
            return ethers.parseUnits(gasPrice.toString(), 'gwei')
        })
    }
}