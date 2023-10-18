import * as fcl from "@onflow/fcl"
import { txHandler } from "./transactions"
import { isValidFlowAddress } from "../lib/utils"

export const transferNft = async (
  address, tokenId, collectionStoragePath, collectionPublicPath,
  setTransactionInProgress,
  setTransactionStatus
) => {
  if (!isValidFlowAddress(address)) {
    return
  }

  const txFunc = async () => {
    return await doTransferNft(address, tokenId, collectionStoragePath, collectionPublicPath)
  }

  return await txHandler(txFunc, setTransactionInProgress, setTransactionStatus)
}

const doTransferNft = async (address, tokenId, collectionStoragePath, collectionPublicPath) => {
  const rawCode = await (await fetch("/transactions/collection/transfer_nft.cdc")).text()
  const code = rawCode.replace("__NFT_STORAGE_PATH__", collectionStoragePath)
    .replace("__NFT_PUBLIC_PATH__", collectionPublicPath)

  const transactionId = fcl.mutate({
    cadence: code,
    args: (arg, t) => [
      arg(address, t.Address),
      arg(tokenId, t.UInt64)
    ],
    proposer: fcl.currentUser,
    payer: fcl.currentUser,
    limit: 9999
  })

  return transactionId
}

export const bulkTransferNft = async (
  recipients, tokenIds, collectionStoragePath, collectionPublicPath,
  setTransactionInProgress,
  setTransactionStatus
) => {
  const txFunc = async () => {
    return await doBulkTransferNft(recipients, tokenIds, collectionStoragePath, collectionPublicPath)
  }

  return await txHandler(txFunc, setTransactionInProgress, setTransactionStatus)
}

const doBulkTransferNft = async (recipients, tokenIds, collectionStoragePath, collectionPublicPath) => {
  const rawCode = await (await fetch("/transactions/collection/bulk_transfer_nft.cdc")).text()
  const code = rawCode.replace("__NFT_STORAGE_PATH__", collectionStoragePath)
    .replace("__NFT_PUBLIC_PATH__", collectionPublicPath)

  const transactionId = fcl.mutate({
    cadence: code,
    args: (arg, t) => [
      arg(recipients, t.Array(t.Address)),
      arg(tokenIds, t.Array(t.UInt64))
    ],
    proposer: fcl.currentUser,
    payer: fcl.currentUser,
    limit: 9999
  })

  return transactionId
}