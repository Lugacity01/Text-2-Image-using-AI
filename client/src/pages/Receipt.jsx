import React from 'react'
import ReceiptPayment from '../components/ReceiptPayment'

export const Receipt = () => {

    
  const transactionData = {
    reference: "386936197",
    trans: "4912973106",
    status: "success",
    credits: 24300,
    message: "Approved",
    transaction: "4912973106",
    trxref: "386936197",
  }

  return (
    <div>
        <ReceiptPayment data={transactionData} />
    </div>
  )
}
