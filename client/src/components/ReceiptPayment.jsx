// "use client"

// import { useState, useEffect, useRef } from "react"

// export default function ReceiptModal({isOpen, setIsOpen}) {
//   // const [isOpen, setIsOpen] = useState(false)
//   const [copied, setCopied] = useState(false)
//   const modalRef = useRef<HTMLDivElement>(null)

//   const receiptData = {
//     reference: "386936197",
//     trans: "4912973106",
//     status: "success",
//     credits: 24300,
//     message: "Approved",
//     transaction: "4912973106",
//     trxref: "386936197",
//   }

//   const copyToClipboard = () => {
//     navigator.clipboard.writeText(receiptData.reference)
//     setCopied(true)
//     setTimeout(() => setCopied(false), 2000)
//   }

//   const formatCredits = (credits) => {
//     return new Intl.NumberFormat().format(credits)
//   }

//   // Close modal when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (modalRef.current && !modalRef.current.contains(event.target)) {
//         setIsOpen(false)
//       }
//     }

//     if (isOpen) {
//       document.addEventListener("mousedown", handleClickOutside)
//     }

//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside)
//     }
//   }, [isOpen])

//   // Prevent scrolling when modal is open
//   useEffect(() => {
//     if (isOpen) {
//       document.body.style.overflow = "hidden"
//     } else {
//       document.body.style.overflow = "auto"
//     }

//     return () => {
//       document.body.style.overflow = "auto"
//     }
//   }, [isOpen])

//   return (
//     <div className="flex items-center justify-center p-4">
//       {/* Modal Trigger Button */}
//       <button
//         onClick={() => setIsOpen(true)}
//         className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
//       >
//         View Receipt
//       </button>

//       {/* Modal Backdrop */}
//       {isOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           {/* Modal Content */}
//           <div ref={modalRef} className="bg-white rounded-lg shadow-xl w-full max-w-md mx-auto animate-fade-in">
//             {/* Modal Header */}
//             <div className="p-4 text-center border-b">
//               <h2 className="text-xl font-semibold">Transaction Receipt</h2>
//               <p className="text-sm text-gray-500">Transaction details for your records</p>
//             </div>

//             <div className="p-6">
//               {/* Status Badge */}
//               <div className="flex justify-center mb-4">
//                 <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium inline-flex items-center">
//                   <svg
//                     className="w-4 h-4 mr-1"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                     xmlns="http://www.w3.org/2000/svg"
//                   >
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                   </svg>
//                   {receiptData.status.toUpperCase()}
//                 </div>
//               </div>

//               {/* Credits - The Priority */}
//               <div className="text-center mb-6">
//                 <h3 className="text-sm font-medium text-gray-500 mb-1">CREDITS</h3>
//                 <div className="text-4xl font-bold">{formatCredits(receiptData.credits)}</div>
//                 <p className="text-green-600 font-medium mt-1">{receiptData.message}</p>
//               </div>

//               {/* Separator */}
//               <div className="h-px bg-gray-200 my-4"></div>

//               {/* Transaction Details */}
//               <div className="space-y-3">
//                 <div className="flex justify-between items-center">
//                   <span className="text-sm text-gray-500">Reference</span>
//                   <div className="flex items-center">
//                     <span className="font-medium mr-2">{receiptData.reference}</span>
//                     <button
//                       onClick={copyToClipboard}
//                       className="text-gray-400 hover:text-gray-600 focus:outline-none"
//                       aria-label="Copy reference number"
//                     >
//                       {copied ? (
//                         <svg
//                           className="w-4 h-4 text-green-500"
//                           fill="none"
//                           stroke="currentColor"
//                           viewBox="0 0 24 24"
//                           xmlns="http://www.w3.org/2000/svg"
//                         >
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                         </svg>
//                       ) : (
//                         <svg
//                           className="w-4 h-4"
//                           fill="none"
//                           stroke="currentColor"
//                           viewBox="0 0 24 24"
//                           xmlns="http://www.w3.org/2000/svg"
//                         >
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth={2}
//                             d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
//                           />
//                         </svg>
//                       )}
//                     </button>
//                   </div>
//                 </div>

//                 <div className="flex justify-between">
//                   <span className="text-sm text-gray-500">Transaction ID</span>
//                   <span className="font-medium">{receiptData.transaction}</span>
//                 </div>

//                 <div className="flex justify-between">
//                   <span className="text-sm text-gray-500">TRX Reference</span>
//                   <span className="font-medium">{receiptData.trxref}</span>
//                 </div>
//               </div>

//               {/* Separator */}
//               <div className="h-px bg-gray-200 my-4"></div>

//               {/* Footer */}
//               <div className="flex justify-center mt-4">
//                 <button
//                   onClick={() => setIsOpen(false)}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }


















import { CheckCircle2 } from "lucide-react";

  // const receiptData = {
  //   reference: "386936197",
  //   trans: "4912973106",
  //   status: "success",
  //   credits: 24300,
  //   message: "Approved",
  //   transaction: "4912973106",
  //   trxref: "386936197",
  // }

export default function ReceiptPayment({ data}) {
  
  const formatCredits = (amount) => {
    return new Intl.NumberFormat().format(amount);
  };

  return (
    <div className="w-full max-w-md bg-white rounded-xl shadow-md overflow-hidden">
      {/* Receipt Header */}
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-semibold text-gray-800">
          Transaction Receipt
        </h2>
        <p className="text-sm text-gray-500">Thank you for your transaction</p>
      </div>

      {/* Credits Section (Priority) */}
      <div className="p-6 bg-green-50 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Credits Added</p>
            <p className="text-3xl font-bold text-gray-900">
              {formatCredits(data.credits)}
            </p>
          </div>
          <div className="bg-green-100 p-3 rounded-full">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
        </div>
      </div>

      {/* Status Section */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center space-x-2">
          <div
            className={`h-3 w-3 rounded-full ${
              data.status === "success" ? "bg-green-500" : "bg-red-500"
            }`}
          ></div>
          <p
            className={`text-sm font-medium ${
              data.status === "success" ? "text-green-600" : "text-red-600"
            }`}
          >
            {data.status.charAt(0).toUpperCase() + data.status.slice(1)} -{" "}
            {data.message}
          </p>
        </div>
      </div>

      {/* Transaction Details */}
      <div className="p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500">Reference</p>
            <p className="text-sm font-medium text-gray-800">
              {data.reference}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Transaction ID</p>
            <p className="text-sm font-medium text-gray-800">
              {data.transaction}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">TRX Reference</p>
            <p className="text-sm font-medium text-gray-800">{data.trxref}</p>
          </div>
        </div>
      </div>

      {/* Receipt Footer */}
      <div className="p-6 bg-gray-50 border-t border-gray-100">
        <p className="text-xs text-center text-gray-500">
          This is an electronic receipt for your transaction.
          <br />
          Please keep it for your records.
        </p>
      </div>
    </div>
  );
}
