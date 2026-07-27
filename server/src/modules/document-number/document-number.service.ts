import { DocumentType } from "@prisma/client";

import * as repository from "./document-number.repository";

/*
|--------------------------------------------------------------------------
| Prefixes
|--------------------------------------------------------------------------
*/

const prefixes: Record<DocumentType, string> = {
  CUSTOMER: "CUS",
  PRODUCT: "PRD",
  QUOTE: "QT",
  SALES_ORDER: "SO",
  INVOICE: "INV",
  PAYMENT: "PAY",
  REFUND: "RFD",
  PURCHASE_ORDER: "PO",
  GOODS_RECEIPT: "GRN",
  WAYBILL: "WB",
};

/*
|--------------------------------------------------------------------------
| Generate Document Number
|--------------------------------------------------------------------------
*/

export async function generateDocumentNumber(
  type: DocumentType
): Promise<string> {

  const year = new Date().getFullYear();

  let sequence =
    await repository.findSequence(
      type,
      year
    );

  if (!sequence) {
    sequence =
      await repository.createSequence(
        type,
        year
      );
  } else {
    sequence =
      await repository.incrementSequence(
        sequence.id
      );
  }

  const number =
    sequence.currentNumber
      .toString()
      .padStart(6, "0");

  return `${prefixes[type]}-${year}-${number}`;
}