"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFinancialReport = getFinancialReport;
// server/src/modules/reports/financial.service.ts
const prisma_1 = __importDefault(require("../../lib/prisma"));
const date_fns_1 = require("date-fns");
async function getFinancialReport(filters) {
    const { startDate, endDate, branchId } = filters;
    const now = new Date();
    const start = startDate || (0, date_fns_1.startOfMonth)(now);
    const end = endDate || now;
    // ---------- 1. Revenue & Expenses ----------
    const invoices = await prisma_1.default.invoice.findMany({
        where: {
            isDeleted: false,
            createdAt: { gte: start, lte: end },
        },
        include: { items: true, payments: true },
    });
    // Filter invoices by branch if provided (via sales orders)
    let filteredInvoices = invoices;
    if (branchId) {
        const orderIds = await prisma_1.default.salesOrder.findMany({
            where: { warehouseId: branchId },
            select: { id: true },
        });
        const orderIdSet = new Set(orderIds.map((o) => o.id));
        filteredInvoices = invoices.filter((inv) => inv.salesOrderId && orderIdSet.has(inv.salesOrderId));
    }
    const revenue = filteredInvoices.reduce((sum, inv) => sum + (inv.subtotal || 0), 0);
    const tax = filteredInvoices.reduce((sum, inv) => sum + (inv.tax || 0), 0);
    // COGS: from delivered sales orders
    const salesOrders = await prisma_1.default.salesOrder.findMany({
        where: {
            isDeleted: false,
            status: "DELIVERED",
            createdAt: { gte: start, lte: end },
            ...(branchId && { warehouseId: branchId }),
        },
        include: {
            items: { include: { product: true } },
            customer: true,
            warehouse: true,
        },
    });
    let cogs = 0;
    salesOrders.forEach((order) => {
        order.items.forEach((item) => {
            cogs += item.quantity * Number(item.product.costPrice);
        });
    });
    // ✅ Commented out – Expense model not yet in schema
    // const expensesData = await prisma.expense.findMany({
    //   where: { date: { gte: start, lte: end } },
    // });
    // const totalExpenses = expensesData.reduce((sum: number, e: any) => sum + e.amount, 0);
    // Placeholder for expenses
    const expensesData = [];
    const totalExpenses = 0;
    const grossProfit = revenue - cogs;
    const operatingProfit = grossProfit - totalExpenses;
    const netProfit = operatingProfit - tax;
    // ---------- 2. Cash Flow ----------
    const payments = await prisma_1.default.payment.findMany({
        where: {
            status: "COMPLETED",
            createdAt: { gte: start, lte: end },
        },
    });
    const cashIn = payments.reduce((sum, p) => sum + p.amount, 0);
    const purchaseOrders = await prisma_1.default.purchaseOrder.findMany({
        where: {
            status: "RECEIVED",
            createdAt: { gte: start, lte: end },
        },
        include: { items: true },
    });
    const cashOut = purchaseOrders.reduce((sum, po) => sum + po.total, 0);
    const operatingCashFlow = cashIn - cashOut;
    const investingCashFlow = 0;
    const financingCashFlow = 0;
    const netCashFlow = operatingCashFlow + investingCashFlow + financingCashFlow;
    const bankBalance = netCashFlow;
    // ---------- 3. Balance Sheet ----------
    const totalReceivables = filteredInvoices
        .filter((inv) => inv.balance > 0)
        .reduce((sum, inv) => sum + inv.balance, 0);
    const inventoryItems = await prisma_1.default.inventory.findMany({
        where: branchId ? { warehouseId: branchId } : {},
        include: { product: true },
    });
    const inventoryValue = inventoryItems.reduce((sum, inv) => sum + inv.quantity * Number(inv.product.costPrice), 0);
    const payablesAgg = await prisma_1.default.purchaseOrder.aggregate({
        where: {
            status: { in: ["APPROVED", "PARTIALLY_RECEIVED"] },
            isDeleted: false,
            ...(branchId && { warehouseId: branchId }),
        },
        _sum: { total: true },
    });
    const totalPayables = payablesAgg._sum.total || 0;
    const totalAssets = bankBalance + totalReceivables + inventoryValue;
    const totalLiabilities = totalPayables + tax;
    const equity = totalAssets - totalLiabilities;
    // ---------- 4. Receivables Aging ----------
    const agingBrackets = [
        { label: "0-30", min: 0, max: 30 },
        { label: "31-60", min: 31, max: 60 },
        { label: "61-90", min: 61, max: 90 },
        { label: "90+", min: 91, max: Infinity },
    ];
    const receivablesAging = agingBrackets.map((bracket) => {
        const amount = filteredInvoices
            .filter((inv) => {
            const days = (0, date_fns_1.differenceInDays)(now, inv.createdAt);
            return inv.balance > 0 && days >= bracket.min && days <= bracket.max;
        })
            .reduce((sum, inv) => sum + inv.balance, 0);
        return { label: bracket.label, amount };
    });
    const highRisk = receivablesAging.find((b) => b.label === "90+")?.amount || 0;
    const riskScore = totalReceivables > 0 ? (highRisk / totalReceivables) * 100 : 0;
    // ---------- 5. Payables Aging ----------
    const payablesAging = agingBrackets.map((bracket) => {
        const amount = purchaseOrders
            .filter((po) => {
            const days = (0, date_fns_1.differenceInDays)(now, po.createdAt);
            return days >= bracket.min && days <= bracket.max;
        })
            .reduce((sum, po) => sum + po.total, 0);
        return { label: bracket.label, amount };
    });
    const cashNeeded = payablesAging.find((b) => b.label === "0-30")?.amount || 0;
    // ---------- 6. Profit Analysis ----------
    const productProfit = {};
    salesOrders.forEach((order) => {
        order.items.forEach((item) => {
            const name = item.product.name;
            if (!productProfit[name])
                productProfit[name] = { revenue: 0, cogs: 0, profit: 0 };
            productProfit[name].revenue += item.total;
            productProfit[name].cogs += item.quantity * Number(item.product.costPrice);
            productProfit[name].profit += item.total - item.quantity * Number(item.product.costPrice);
        });
    });
    const productProfitArray = Object.entries(productProfit).map(([name, data]) => ({ name, ...data }));
    const customerProfit = {};
    salesOrders.forEach((order) => {
        const name = order.customer.name;
        if (!customerProfit[name])
            customerProfit[name] = { revenue: 0, profit: 0 };
        let orderProfit = 0;
        order.items.forEach((item) => {
            orderProfit += item.total - item.quantity * Number(item.product.costPrice);
        });
        customerProfit[name].revenue += order.total;
        customerProfit[name].profit += orderProfit;
    });
    const customerProfitArray = Object.entries(customerProfit).map(([name, data]) => ({ name, ...data }));
    const branchProfit = {};
    const branchSales = await prisma_1.default.salesOrder.findMany({
        where: {
            isDeleted: false,
            status: "DELIVERED",
            createdAt: { gte: start, lte: end },
            warehouseId: { not: null },
        },
        include: { warehouse: true, items: { include: { product: true } } },
    });
    branchSales.forEach((order) => {
        const name = order.warehouse?.name || "Unknown";
        if (!branchProfit[name])
            branchProfit[name] = { revenue: 0, profit: 0 };
        let orderProfit = 0;
        order.items.forEach((item) => {
            orderProfit += item.total - item.quantity * Number(item.product.costPrice);
        });
        branchProfit[name].revenue += order.total;
        branchProfit[name].profit += orderProfit;
    });
    const branchProfitArray = Object.entries(branchProfit).map(([name, data]) => ({ name, ...data }));
    const salespersonProfit = [];
    // ---------- 7. Budget vs Actual ----------
    // ✅ Commented out – Budget model not yet in schema
    // const budgets = await prisma.budget.findMany({
    //   where: {
    //     year: start.getFullYear(),
    //     month: { gte: start.getMonth() + 1, lte: end.getMonth() + 1 },
    //   },
    // });
    // const budgetMap = budgets.reduce((acc: Record<string, any>, b: any) => {
    //   acc[`${b.month}-${b.year}`] = b;
    //   return acc;
    // }, {});
    const budgetMap = {};
    const actualsByMonth = {};
    salesOrders.forEach((order) => {
        const key = `${order.createdAt.getMonth() + 1}-${order.createdAt.getFullYear()}`;
        if (!actualsByMonth[key])
            actualsByMonth[key] = { revenue: 0, expenses: 0, profit: 0 };
        actualsByMonth[key].revenue += order.total;
    });
    expensesData.forEach((exp) => {
        const key = `${exp.date.getMonth() + 1}-${exp.date.getFullYear()}`;
        if (!actualsByMonth[key])
            actualsByMonth[key] = { revenue: 0, expenses: 0, profit: 0 };
        actualsByMonth[key].expenses += exp.amount;
        actualsByMonth[key].profit = actualsByMonth[key].revenue - actualsByMonth[key].expenses;
    });
    const budgetVsActual = Object.keys(actualsByMonth).map((key) => {
        const [month, year] = key.split("-").map(Number);
        const budget = budgetMap[`${month}-${year}`];
        const actual = actualsByMonth[key];
        return {
            month: `${year}-${String(month).padStart(2, "0")}`,
            budgetRevenue: budget?.revenue || 0,
            actualRevenue: actual.revenue,
            budgetExpenses: budget?.expenses || 0,
            actualExpenses: actual.expenses,
            budgetProfit: budget?.profit || 0,
            actualProfit: actual.profit,
        };
    }).sort((a, b) => a.month.localeCompare(b.month));
    // ---------- 8. Break-even ----------
    const fixedCosts = totalExpenses;
    const avgGrossMargin = revenue > 0 ? grossProfit / revenue : 0;
    const breakEvenRevenue = avgGrossMargin > 0 ? fixedCosts / avgGrossMargin : 0;
    // ---------- 9. Cash Forecast ----------
    const daysDiff = Math.max(1, (0, date_fns_1.differenceInDays)(end, start));
    const avgDailySales = revenue > 0 ? revenue / daysDiff : 0;
    const cashForecast = {
        "7 days": avgDailySales * 7,
        "30 days": avgDailySales * 30,
        "90 days": avgDailySales * 90,
    };
    // ---------- 10. Ratios ----------
    const grossMargin = revenue > 0 ? grossProfit / revenue : 0;
    const netMargin = revenue > 0 ? netProfit / revenue : 0;
    const currentRatio = totalLiabilities > 0 ? totalAssets / totalLiabilities : 0;
    const quickRatio = totalLiabilities > 0 ? (bankBalance + totalReceivables) / totalLiabilities : 0;
    const debtRatio = totalAssets > 0 ? totalLiabilities / totalAssets : 0;
    const inventoryTurnover = inventoryValue > 0 ? cogs / inventoryValue : 0;
    const assetTurnover = totalAssets > 0 ? revenue / totalAssets : 0;
    const roa = totalAssets > 0 ? netProfit / totalAssets : 0;
    const roe = equity > 0 ? netProfit / equity : 0;
    // ---------- 11. Expense by Category ----------
    const expenseByCategory = expensesData.reduce((acc, exp) => {
        acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
        return acc;
    }, {});
    const expenseCategoryData = Object.entries(expenseByCategory).map(([name, value]) => ({ name, value }));
    // ---------- 12. Taxes ----------
    const totalTax = tax;
    // ---------- Return ----------
    return {
        kpis: {
            revenue,
            expenses: totalExpenses,
            grossProfit,
            operatingProfit,
            netProfit,
            cashFlow: operatingCashFlow,
            bankBalance,
            receivables: totalReceivables,
            payables: totalPayables,
            tax: totalTax,
            workingCapital: totalAssets - totalLiabilities,
        },
        profitAndLoss: {
            revenue,
            cogs,
            grossProfit,
            expenses: totalExpenses,
            operatingProfit,
            tax,
            netProfit,
        },
        balanceSheet: {
            assets: { cash: bankBalance, receivables: totalReceivables, inventory: inventoryValue, total: totalAssets },
            liabilities: { payables: totalPayables, tax, total: totalLiabilities },
            equity,
        },
        cashFlow: {
            operating: operatingCashFlow,
            investing: investingCashFlow,
            financing: financingCashFlow,
            net: netCashFlow,
        },
        expenseAnalysis: expenseCategoryData,
        receivables: { aging: receivablesAging, total: totalReceivables, riskScore },
        payables: { aging: payablesAging, total: totalPayables, cashNeeded },
        profitAnalysis: {
            byProduct: productProfitArray,
            byCustomer: customerProfitArray,
            byBranch: branchProfitArray,
            bySalesperson: salespersonProfit,
        },
        budgetVsActual,
        breakEven: {
            breakEvenRevenue,
            requiredSales: breakEvenRevenue,
            margin: avgGrossMargin,
        },
        cashForecast,
        ratios: {
            grossMargin,
            netMargin,
            currentRatio,
            quickRatio,
            debtRatio,
            inventoryTurnover,
            assetTurnover,
            roa,
            roe,
        },
    };
}
