"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSalesReport = getSalesReport;
exports.saveReport = saveReport;
exports.getSavedReports = getSavedReports;
exports.loadSavedReport = loadSavedReport;
exports.getInventoryReport = getInventoryReport;
// server/src/modules/reports/report.service.ts
const prisma_1 = __importDefault(require("../../lib/prisma"));
async function getSalesReport(filters) {
    const { startDate, endDate, customerId, productId, warehouseId } = filters;
    // 1. Build WHERE clause for SalesOrder
    const orderWhere = { isDeleted: false };
    if (startDate)
        orderWhere.createdAt = { gte: startDate };
    if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59);
        orderWhere.createdAt = { ...orderWhere.createdAt, lte: end };
    }
    if (customerId)
        orderWhere.customerId = customerId;
    if (warehouseId)
        orderWhere.warehouseId = warehouseId;
    if (productId) {
        orderWhere.items = { some: { productId } };
    }
    // 2. Fetch orders with items, products, customer, and warehouse
    const orders = await prisma_1.default.salesOrder.findMany({
        where: orderWhere,
        include: {
            customer: true,
            items: {
                include: {
                    product: true,
                },
            },
            warehouse: true, // ✅ now included
        },
        orderBy: { createdAt: "desc" },
    });
    // 3. Compute summary
    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
    const totalOrders = orders.length;
    const totalItems = orders.reduce((sum, o) => sum + o.items.reduce((s, i) => s + i.quantity, 0), 0);
    const avgOrderValue = totalOrders ? totalRevenue / totalOrders : 0;
    // 4. Sales by Product Unit
    const unitSales = {};
    orders.forEach((o) => {
        o.items.forEach((item) => {
            const unit = item.product.unit || "Uncategorized";
            unitSales[unit] = (unitSales[unit] || 0) + item.total;
        });
    });
    const categoryData = Object.entries(unitSales)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value);
    // 5. Product performance
    const productTotals = {};
    const productMonthly = {};
    orders.forEach((o) => {
        const month = o.createdAt.toISOString().slice(0, 7);
        o.items.forEach((item) => {
            const pid = item.productId;
            if (!productTotals[pid]) {
                productTotals[pid] = {
                    name: item.product.name,
                    revenue: 0,
                    quantity: 0,
                    cost: 0,
                    profit: 0,
                };
                productMonthly[pid] = [];
            }
            const revenue = item.total;
            const cost = item.quantity * Number(item.product.costPrice);
            const profit = revenue - cost;
            productTotals[pid].revenue += revenue;
            productTotals[pid].quantity += item.quantity;
            productTotals[pid].cost += cost;
            productTotals[pid].profit += profit;
            productMonthly[pid].push({ month, revenue });
        });
    });
    const productArray = Object.values(productTotals);
    const topProducts = [...productArray]
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);
    const bottomProducts = [...productArray]
        .sort((a, b) => a.revenue - b.revenue)
        .slice(0, 5);
    // Fastest growing
    const growingProducts = Object.entries(productMonthly)
        .filter(([_, data]) => data.length >= 2)
        .map(([pid, data]) => {
        const sorted = data.sort((a, b) => a.month.localeCompare(b.month));
        const first = sorted[0];
        const last = sorted[sorted.length - 1];
        const growth = first.revenue ? ((last.revenue - first.revenue) / first.revenue) * 100 : 0;
        return {
            name: productTotals[Number(pid)]?.name || "Unknown",
            growth,
            revenue: last.revenue,
        };
    })
        .sort((a, b) => b.growth - a.growth)
        .slice(0, 5);
    const decliningProducts = [...growingProducts]
        .sort((a, b) => a.growth - b.growth)
        .slice(0, 5);
    // 6. Heatmap – Day of Week & Month
    const dayTotals = {};
    const monthTotals = {};
    orders.forEach((o) => {
        const day = o.createdAt.getDay();
        const month = o.createdAt.getMonth();
        if (!dayTotals[day]) {
            dayTotals[day] = {
                day: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][day],
                revenue: 0,
                orders: 0,
            };
        }
        if (!monthTotals[month]) {
            monthTotals[month] = {
                month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][month],
                revenue: 0,
                orders: 0,
            };
        }
        dayTotals[day].revenue += o.total;
        dayTotals[day].orders += 1;
        monthTotals[month].revenue += o.total;
        monthTotals[month].orders += 1;
    });
    const dayHeatmap = Object.values(dayTotals);
    const monthHeatmap = Object.values(monthTotals);
    // 7. Regional – by Warehouse
    const warehouseSales = {};
    orders.forEach((o) => {
        if (!o.warehouseId)
            return;
        const wid = o.warehouseId;
        if (!warehouseSales[wid]) {
            warehouseSales[wid] = {
                name: o.warehouse?.name || "Unknown",
                revenue: 0,
                profit: 0,
                orders: 0,
            };
        }
        warehouseSales[wid].revenue += o.total;
        warehouseSales[wid].orders += 1;
        let orderProfit = 0;
        o.items.forEach((item) => {
            const cost = item.quantity * Number(item.product.costPrice);
            orderProfit += item.total - cost;
        });
        warehouseSales[wid].profit += orderProfit;
    });
    const regionalData = Object.values(warehouseSales);
    return {
        summary: { totalRevenue, totalOrders, avgOrderValue, totalItems },
        categoryData,
        topProducts,
        bottomProducts,
        growingProducts,
        decliningProducts,
        dayHeatmap,
        monthHeatmap,
        regionalData,
        orders: orders.slice(0, 50),
    };
}
// Save / Load / List saved reports (unchanged)
async function saveReport(name, filters, userId) {
    const data = await getSalesReport(filters);
    const report = await prisma_1.default.report.create({
        data: {
            name,
            type: "sales",
            filters: filters,
            createdBy: { connect: { id: userId } },
            results: {
                create: {
                    data: data,
                    generatedAt: new Date(),
                },
            },
        },
        include: { results: true },
    });
    return report;
}
async function getSavedReports(userId) {
    return prisma_1.default.report.findMany({
        where: { createdById: userId, type: "sales" },
        orderBy: { createdAt: "desc" },
        include: { results: true },
    });
}
async function loadSavedReport(reportId, userId) {
    const report = await prisma_1.default.report.findUnique({
        where: { id: reportId },
        include: { results: true },
    });
    if (!report)
        throw new Error("Report not found.");
    if (report.createdById !== userId)
        throw new Error("Unauthorized.");
    if (report.results)
        return report.results.data;
    const filters = report.filters;
    const data = await getSalesReport(filters);
    await prisma_1.default.reportResult.create({
        data: {
            reportId: report.id,
            data: data,
            generatedAt: new Date(),
        },
    });
    return data;
}
// server/src/modules/reports/report.service.ts (add this function)
async function getInventoryReport(filters) {
    const { startDate, endDate, warehouseId } = filters;
    // -------------------------------
    // 1. Fetch all products with inventory and cost
    // -------------------------------
    const products = await prisma_1.default.product.findMany({
        where: { isDeleted: false },
        include: {
            inventories: {
                where: warehouseId ? { warehouseId } : undefined,
            },
        },
    });
    // -------------------------------
    // 2. Compute inventory metrics
    // -------------------------------
    let totalInventoryValue = 0;
    let totalAvailableStock = 0;
    let outOfStockCount = 0;
    let lowStockCount = 0;
    let productStockData = [];
    products.forEach((p) => {
        const stock = p.inventories.reduce((sum, inv) => sum + inv.quantity, 0);
        const available = p.inventories.reduce((sum, inv) => sum + inv.availableQuantity, 0);
        const value = stock * Number(p.costPrice);
        totalInventoryValue += value;
        totalAvailableStock += available;
        if (stock <= 0)
            outOfStockCount++;
        if (stock < Number(p.minimumStock) && stock > 0)
            lowStockCount++;
        productStockData.push({
            productId: p.id,
            name: p.name,
            stock,
            available,
            minimumStock: p.minimumStock,
            costPrice: p.costPrice,
            value,
        });
    });
    // -------------------------------
    // 3. Sales data for movement metrics (last 90 days from endDate)
    // -------------------------------
    const salesEnd = endDate || new Date();
    const salesStart = startDate || new Date(salesEnd.getTime() - 90 * 24 * 60 * 60 * 1000);
    const salesOrders = await prisma_1.default.salesOrder.findMany({
        where: {
            isDeleted: false,
            status: 'DELIVERED',
            createdAt: { gte: salesStart, lte: salesEnd },
        },
        include: {
            items: true,
        },
    });
    // Compute daily sales per product
    const salesQuantityByProduct = {};
    salesOrders.forEach((order) => {
        order.items.forEach((item) => {
            salesQuantityByProduct[item.productId] = (salesQuantityByProduct[item.productId] || 0) + item.quantity;
        });
    });
    const days = Math.max(1, (salesEnd.getTime() - salesStart.getTime()) / (1000 * 60 * 60 * 24));
    const avgDailySales = {};
    Object.keys(salesQuantityByProduct).forEach((pid) => {
        avgDailySales[Number(pid)] = salesQuantityByProduct[Number(pid)] / days;
    });
    // Classify products as slow / fast moving
    let slowMoving = 0;
    let fastMoving = 0;
    productStockData.forEach((p) => {
        const avg = avgDailySales[p.productId] || 0;
        if (avg < 1)
            slowMoving++;
        if (avg > 10)
            fastMoving++;
    });
    // Inventory Turnover = COGS / Average Inventory
    // COGS: sum of (sold quantity * costPrice) from sales orders
    let cogs = 0;
    salesOrders.forEach((order) => {
        order.items.forEach((item) => {
            const product = products.find(p => p.id === item.productId);
            if (product) {
                cogs += item.quantity * Number(product.costPrice);
            }
        });
    });
    const avgInventory = totalInventoryValue / 2; // Simple average – could refine
    const turnover = avgInventory > 0 ? cogs / avgInventory : 0;
    // Shrinkage (estimated): (expected stock - actual stock) / expected stock
    // We'll compute expected stock as sum of purchases - sales (simplified)
    // We'll fetch total purchased quantity
    const purchaseItems = await prisma_1.default.purchaseOrderItem.findMany({
        where: {
            purchaseOrder: {
                status: 'RECEIVED',
                isDeleted: false,
                createdAt: { lte: salesEnd },
            },
        },
    });
    const totalPurchasedQty = purchaseItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalSoldQty = Object.values(salesQuantityByProduct).reduce((a, b) => a + b, 0);
    const expectedStock = totalPurchasedQty - totalSoldQty;
    const actualStock = totalAvailableStock;
    const shrinkage = expectedStock > 0 ? (expectedStock - actualStock) / expectedStock : 0;
    // -------------------------------
    // 4. Inventory Value Trend (monthly)
    // -------------------------------
    // We'll approximate by using sales orders and purchase orders to estimate stock changes
    // For simplicity, we'll compute monthly aggregated value based on sales and purchase amounts
    const monthlyTrend = {};
    // We'll use sales and purchase amounts as proxy for inventory value changes
    // For a full implementation, we need stock snapshot per month, but we'll skip for brevity.
    // -------------------------------
    // 5. Inbound vs Outbound (monthly)
    // -------------------------------
    const inboundByMonth = {};
    const outboundByMonth = {};
    // Outbound: sales order items quantity
    salesOrders.forEach((order) => {
        const month = order.createdAt.toISOString().slice(0, 7);
        outboundByMonth[month] = (outboundByMonth[month] || 0) + order.items.reduce((sum, i) => sum + i.quantity, 0);
    });
    // Inbound: purchase order items (received)
    const purchaseOrders = await prisma_1.default.purchaseOrder.findMany({
        where: {
            status: 'RECEIVED',
            isDeleted: false,
            createdAt: { lte: salesEnd },
        },
        include: { items: true },
    });
    purchaseOrders.forEach((po) => {
        const month = po.createdAt.toISOString().slice(0, 7);
        inboundByMonth[month] = (inboundByMonth[month] || 0) + po.items.reduce((sum, i) => sum + i.quantity, 0);
    });
    const movementData = Object.keys({ ...inboundByMonth, ...outboundByMonth }).map((month) => ({
        month,
        inbound: inboundByMonth[month] || 0,
        outbound: outboundByMonth[month] || 0,
    })).sort((a, b) => a.month.localeCompare(b.month));
    // -------------------------------
    // 6. Warehouse Capacity (show stock per warehouse)
    // -------------------------------
    const warehouseStock = await prisma_1.default.warehouse.findMany({
        where: warehouseId ? { id: warehouseId } : undefined,
        include: {
            inventories: {
                include: { product: true },
            },
        },
    });
    const warehouseCapacityData = warehouseStock.map((wh) => ({
        name: wh.name,
        stock: wh.inventories.reduce((sum, inv) => sum + inv.quantity, 0),
        // capacity: we don't have a capacity field, so we'll just show stock
    }));
    // -------------------------------
    // 7. Forecast: Days of stock remaining per product
    // -------------------------------
    const forecast = productStockData.map((p) => {
        const avgDaily = avgDailySales[p.productId] || 0;
        const daysRemaining = avgDaily > 0 ? p.stock / avgDaily : Infinity;
        return {
            productId: p.productId,
            name: p.name,
            stock: p.stock,
            avgDailySales: avgDaily,
            daysRemaining: daysRemaining === Infinity ? null : daysRemaining,
            predictedStockOut: daysRemaining !== Infinity && daysRemaining < 30 ? new Date(Date.now() + daysRemaining * 24 * 60 * 60 * 1000) : null,
        };
    });
    // -------------------------------
    // 8. Supplier Performance
    // -------------------------------
    // For each supplier, compute:
    // - On-time delivery rate
    // - Price changes (avg price change)
    // - Rejected goods (from goods receipts)
    const supplierPerformance = [];
    const suppliers = await prisma_1.default.supplier.findMany({
        include: {
            purchaseOrders: {
                include: {
                    goodsReceipts: true,
                },
            },
        },
    });
    for (const supplier of suppliers) {
        const pos = supplier.purchaseOrders;
        let onTime = 0;
        let totalPOs = pos.length;
        let priceChangeSum = 0;
        let priceChangeCount = 0;
        let rejectedQty = 0;
        for (const po of pos) {
            if (po.expectedDeliveryDate && po.receivedAt && po.receivedAt <= po.expectedDeliveryDate) {
                onTime++;
            }
            // price change: compare unit costs of items across POs (we need item data)
            // For simplicity, we'll skip price change for now.
        }
        // Rejected goods: sum rejectedQuantity from goods receipts linked to this supplier
        const receipts = await prisma_1.default.goodsReceipt.findMany({
            where: { supplierId: supplier.id },
            include: { items: true },
        });
        rejectedQty = receipts.reduce((sum, gr) => sum + gr.items.reduce((s, i) => s + i.rejectedQuantity, 0), 0);
        supplierPerformance.push({
            name: supplier.name,
            onTimeDeliveryRate: totalPOs > 0 ? (onTime / totalPOs) * 100 : 0,
            rejectedQty,
            totalPOs,
        });
    }
    // -------------------------------
    // 9. Summary object
    // -------------------------------
    return {
        summary: {
            totalInventoryValue,
            totalAvailableStock,
            outOfStockCount,
            lowStockCount,
            slowMoving,
            fastMoving,
            turnover,
            shrinkage,
        },
        trend: monthlyTrend, // placeholder
        movement: movementData,
        warehouseCapacity: warehouseCapacityData,
        forecast,
        supplierPerformance,
        productStockData: productStockData.slice(0, 20), // top 20 for table
    };
}
