// printUtils.ts
export const printContent = (selector = '.print-area') => {
  // Create and apply print-specific styles
  const printStylesheet = document.createElement('style')
  printStylesheet.id = 'temp-print-style'
  printStylesheet.innerHTML = `
        @media print {
          /* First hide everything */
          body * {
            visibility: hidden;
          }

          /* Then make the print area and its children visible */
          ${selector},
          ${selector} * {
            visibility: visible !important;
          }

          /* Position the print area */
          ${selector} {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }

          /* Override display properties to ensure correct rendering */
          .v-card {
            display: block !important;
            page-break-inside: avoid !important;
            margin-bottom: 20px !important;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1) !important;
            border: 1px solid #ddd !important;
          }

          /* Hide all non-printable elements */
          .non-printable {
            display: none !important;
          }

          .print-area {
            margin-top: -80px !important;
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            padding: 20px !important;
          }
        }
      `

  // Add the stylesheet to the document
  document.head.appendChild(printStylesheet)

  // Print the document
  window.print()

  // Remove the stylesheet after printing
  setTimeout(() => {
    document.head.removeChild(printStylesheet)
  }, 1000)
}
