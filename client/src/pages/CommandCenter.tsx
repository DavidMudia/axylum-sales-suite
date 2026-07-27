import { useState } from "react";

import Layout from "../components/layout/Layout";

import AlertsCard from "../components/command-center/AlertsCard";
import QuickActions from "../components/command-center/QuickActions";
import ApprovalQueue from "../components/command-center/ApprovalQueue";
import LowStock from "../components/command-center/LowStock";
import RecentActivity from "../components/command-center/RecentActivity";
import RecentlyCreated from "../components/command-center/RecentlyCreated";

import CustomerDrawer from "../components/customers/CustomerDrawer";
import ProductDrawer from "../components/products/ProductDrawer";
import QuoteDrawer from "../components/quotes/QuoteDrawer";
import InvoiceDrawer from "../components/invoices/InvoiceDrawer";
import PaymentDrawer from "../components/payments/PaymentDrawer";

import { useCommandCenter } from "../hooks/useCommandCenter";

import {
  useApproveQuote,
  useRejectQuote,
  useConvertQuote,
} from "../hooks/useQuotes";

import { useValidatePayment } from "../hooks/usePayments";

export default function CommandCenter() {
  const { data, isLoading } = useCommandCenter();

  const approveQuote = useApproveQuote();
  const rejectQuote = useRejectQuote();
  const convertQuote = useConvertQuote();
  const validatePayment = useValidatePayment();

  const [customerOpen, setCustomerOpen] =
    useState(false);

  const [productOpen, setProductOpen] =
    useState(false);

  const [quoteOpen, setQuoteOpen] =
    useState(false);

  const [selectedQuote, setSelectedQuote] =
    useState<number | null>(null);

  const [invoiceOpen, setInvoiceOpen] =
    useState(false);

  const [selectedInvoice, setSelectedInvoice] =
    useState<number | null>(null);

  const [paymentOpen, setPaymentOpen] =
    useState(false);

  const [selectedPayment, setSelectedPayment] =
    useState<number | null>(null);

  if (isLoading) {
    return (
      <Layout>
        Loading...
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">

        <h1 className="text-3xl font-bold">
          Command Center
        </h1>

        <AlertsCard alerts={data.alerts} />

        <QuickActions
          onCustomer={() => setCustomerOpen(true)}
          onProduct={() => setProductOpen(true)}
          onQuote={() => {
            setSelectedQuote(null);
            setQuoteOpen(true);
          }}
          onInvoice={() => {
            setSelectedInvoice(null);
            setInvoiceOpen(true);
          }}
          onPayment={() => {
            setSelectedPayment(null);
            setPaymentOpen(true);
          }}
        />

        <div className="grid gap-6 lg:grid-cols-2">

          <ApprovalQueue
            quotes={data.recentQuotes}
            payments={data.recentPayments}

            onApproveQuote={(id) =>
              approveQuote.mutate(id)
            }

            onRejectQuote={(id) =>
              rejectQuote.mutate(id)
            }

            onConvertQuote={(id) =>
              convertQuote.mutate(id)
            }

            onOpenQuote={(id) => {
              setSelectedQuote(id);
              setQuoteOpen(true);
            }}

            onValidatePayment={(id) =>
              validatePayment.mutate(id)
            }

            onOpenPayment={(id) => {
              setSelectedPayment(id);
              setPaymentOpen(true);
            }}
          />

          <LowStock
            products={data.lowStockProducts}
          />

        </div>

        <div className="grid gap-6 lg:grid-cols-2">

          <RecentlyCreated
            customers={data.recentCustomers}
            quotes={data.recentQuotes}
            invoices={data.recentInvoices}
          />

          <RecentActivity
            invoices={data.recentInvoices}
            payments={data.recentPayments}
          />

        </div>

      </div>

      <CustomerDrawer
        open={customerOpen}
        customerId={null}
        onClose={() =>
          setCustomerOpen(false)
        }
      />

      <ProductDrawer
        open={productOpen}
        productId={null}
        onClose={() =>
          setProductOpen(false)
        }
      />

      <QuoteDrawer
        open={quoteOpen}
        id={selectedQuote}
        onClose={() =>
          setQuoteOpen(false)
        }
      />

      <InvoiceDrawer
        open={invoiceOpen}
        invoiceId={selectedInvoice}
        onClose={() =>
          setInvoiceOpen(false)
        }
      />

      <PaymentDrawer
        open={paymentOpen}
        paymentId={selectedPayment}
        onClose={() =>
          setPaymentOpen(false)
        }
      />

    </Layout>
  );
}