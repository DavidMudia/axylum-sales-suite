// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";

export function generateInvoicePDF(invoice: any) {
  // TODO: Install jspdf and jspdf-autotable packages to enable PDF generation
  console.log("PDF generation not implemented", invoice);
  // const doc = new jsPDF();

  // doc.setFontSize(22);
  // doc.text("INVOICE", 14, 18);

  // doc.setFontSize(11);

  // doc.text(
  //   `Invoice #: ${invoice.invoiceNumber}`,
  //   14,
  //   30
  // );

  // doc.text(
  //   `Customer: ${invoice.customer?.name}`,
  //   14,
  //   38
  // );

  // doc.text(
  //   `Status: ${invoice.status}`,
  //   14,
  //   46
  // );

  // autoTable(doc, {
  //   startY: 58,

  //   head: [
  //     [
  //       "Product",
  //       "Qty",
  //       "Price",
  //       "Total",
  //     ],
  //   ],

  //   body: invoice.items.map((item: any) => [
  //     item.product.name,
  //     item.quantity,
  //     `₦${item.unitPrice.toLocaleString()}`,
  //     `₦${item.total.toLocaleString()}`,
  //   ]),
  // });

  // const y = (doc as any).lastAutoTable.finalY + 15;

  // doc.text(
  //   `Subtotal: ₦${invoice.subtotal.toLocaleString()}`,
  //   14,
  //   y
  // );

  // doc.text(
  //   `Tax: ₦${invoice.tax.toLocaleString()}`,
  //   14,
  //   y + 8
  // );

  // doc.text(
  //   `Discount: ₦${invoice.discount.toLocaleString()}`,
  //   14,
  //   y + 16
  // );

  // doc.setFontSize(16);

  // doc.text(
  //   `TOTAL: ₦${invoice.total.toLocaleString()}`,
  //   14,
  //   y + 30
  // );

}