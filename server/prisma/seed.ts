console.log("🔥 THIS IS MY SEED FILE");
import {
  PrismaClient,
  RoleName,
  PermissionAction,
} from "@prisma/client";
import bcrypt from "bcrypt";
const prisma = new PrismaClient();

const roles = [
  {
    name: RoleName.SUPER_ADMIN,
    displayName: "Super Administrator",
    description: "Full unrestricted access",
    color: "#d32f2f",
  },
  {
    name: RoleName.ADMIN,
    displayName: "Administrator",
    description: "Administrative operations",
    color: "#1976d2",
  },
  {
    name: RoleName.SALES,
    displayName: "Sales",
    description: "Sales department",
    color: "#388e3c",
  },
  {
    name: RoleName.STORE_KEEPER,
    displayName: "Store Keeper",
    description: "Inventory management",
    color: "#f57c00",
  },
  {
    name: RoleName.ACCOUNTANT,
    displayName: "Accountant",
    description: "Finance",
    color: "#7b1fa2",
  },
];

const permissions = [
  {
    name: "dashboard.view",
    module: "Dashboard",
    action: PermissionAction.READ,
},
{
    name: "goods-receipt.create",
    module: "Goods Receipt",
    action: PermissionAction.CREATE,
},
{
    name: "goods-receipt.read",
    module: "Goods Receipt",
    action: PermissionAction.READ,
},
{
    name: "goods-receipt.approve",
    module: "Goods Receipt",
    action: PermissionAction.APPROVE,
},
{
    name: "waybill.create",
    module: "Waybill",
    action: PermissionAction.CREATE,
},
{
    name: "waybill.read",
    module: "Waybill",
    action: PermissionAction.READ,
},
{
    name: "waybill.print",
    module: "Waybill",
    action: PermissionAction.PRINT,
},
  {
    name: "customer.create",
    module: "Customer",
    action: PermissionAction.CREATE,
  },
  {
    name: "customer.read",
    module: "Customer",
    action: PermissionAction.READ,
  },
  {
    name: "customer.update",
    module: "Customer",
    action: PermissionAction.UPDATE,
  },
  {
    name: "customer.delete",
    module: "Customer",
    action: PermissionAction.DELETE,
  },

  {
    name: "supplier.create",
    module: "Supplier",
    action: PermissionAction.CREATE,
  },
  {
    name: "supplier.read",
    module: "Supplier",
    action: PermissionAction.READ,
  },
  {
    name: "supplier.update",
    module: "Supplier",
    action: PermissionAction.UPDATE,
  },
  {
    name: "supplier.delete",
    module: "Supplier",
    action: PermissionAction.DELETE,
  },

  {
    name: "inventory.create",
    module: "Inventory",
    action: PermissionAction.CREATE,
  },
  {
    name: "inventory.read",
    module: "Inventory",
    action: PermissionAction.READ,
  },
  {
    name: "inventory.update",
    module: "Inventory",
    action: PermissionAction.UPDATE,
  },
  {
    name: "inventory.adjust",
    module: "Inventory",
    action: PermissionAction.UPDATE,
  },
{
  name: "warehouse.create",
  module: "Warehouse",
  action: PermissionAction.CREATE,
},
{
  name: "warehouse.read",
  module: "Warehouse",
  action: PermissionAction.READ,
},
{
  name: "warehouse.update",
  module: "Warehouse",
  action: PermissionAction.UPDATE,
},
{
  name: "warehouse.delete",
  module: "Warehouse",
  action: PermissionAction.DELETE,
},
  {
    name: "quote.create",
    module: "Quote",
    action: PermissionAction.CREATE,
  },
  {
    name: "quote.read",
    module: "Quote",
    action: PermissionAction.READ,
  },
  {
    name: "quote.approve",
    module: "Quote",
    action: PermissionAction.APPROVE,
  },
  {
    name: "quote.reject",
    module: "Quote",
    action: PermissionAction.REJECT,
  },

  {
    name: "sales-order.create",
    module: "Sales Order",
    action: PermissionAction.CREATE,
  },
  {
    name: "sales-order.read",
    module: "Sales Order",
    action: PermissionAction.READ,
  },
  {
    name: "sales-order.approve",
    module: "Sales Order",
    action: PermissionAction.APPROVE,
  },
  {
    name: "sales-order.cancel",
    module: "Sales Order",
    action: PermissionAction.CANCEL,
  },

  {
    name: "invoice.create",
    module: "Invoice",
    action: PermissionAction.CREATE,
  },
  {
    name: "invoice.read",
    module: "Invoice",
    action: PermissionAction.READ,
  },
  {
    name: "invoice.approve",
    module: "Invoice",
    action: PermissionAction.APPROVE,
  },
  {
    name: "invoice.print",
    module: "Invoice",
    action: PermissionAction.PRINT,
  },

  {
    name: "payment.create",
    module: "Payment",
    action: PermissionAction.CREATE,
  },
  {
    name: "payment.read",
    module: "Payment",
    action: PermissionAction.READ,
  },
  {
    name: "payment.approve",
    module: "Payment",
    action: PermissionAction.APPROVE,
  },
  {
    name: "payment.cancel",
    module: "Payment",
    action: PermissionAction.CANCEL,
  },

  {
    name: "refund.create",
    module: "Refund",
    action: PermissionAction.CREATE,
  },
  {
    name: "refund.read",
    module: "Refund",
    action: PermissionAction.READ,
  },
  {
    name: "refund.approve",
    module: "Refund",
    action: PermissionAction.APPROVE,
  },
  {
    name: "refund.reject",
    module: "Refund",
    action: PermissionAction.REJECT,
  },

  {
    name: "journal.create",
    module: "Accounting",
    action: PermissionAction.CREATE,
  },
  {
    name: "journal.post",
    module: "Accounting",
    action: PermissionAction.POST,
  },
  {
    name: "journal.read",
    module: "Accounting",
    action: PermissionAction.READ,
  },

  {
    name: "report.sales",
    module: "Reports",
    action: PermissionAction.READ,
  },
  {
    name: "report.inventory",
    module: "Reports",
    action: PermissionAction.READ,
  },
  {
    name: "report.financial",
    module: "Reports",
    action: PermissionAction.READ,
  },

  {
    name: "user.create",
    module: "Administration",
    action: PermissionAction.CREATE,
},
{
    name: "user.read",
    module: "Administration",
    action: PermissionAction.READ,
},
{
    name: "user.update",
    module: "Administration",
    action: PermissionAction.UPDATE,
},
{
    name: "user.delete",
    module: "Administration",
    action: PermissionAction.DELETE,
},

{
    name: "role.create",
    module: "Administration",
    action: PermissionAction.CREATE,
},
{
    name: "role.read",
    module: "Administration",
    action: PermissionAction.READ,
},
{
    name: "role.update",
    module: "Administration",
    action: PermissionAction.UPDATE,
},
{
    name: "role.delete",
    module: "Administration",
    action: PermissionAction.DELETE,
},

{
    name: "settings.read",
    module: "Settings",
    action: PermissionAction.READ,
},
{
    name: "settings.update",
    module: "Settings",
    action: PermissionAction.UPDATE,
},
  {
    name: "role.manage",
    module: "Administration",
    action: PermissionAction.UPDATE,
  },
  {
    name: "permission.manage",
    module: "Administration",
    action: PermissionAction.UPDATE,
  },
];
async function main() {
  console.log("🚀 Entered main()");
  // Seed Roles
  for (const role of roles) {
    await prisma.role.upsert({
      where: {
        name: role.name,
      },
      update: role,
      create: role,
    });
  }

  // Seed Permissions
  for (const permission of permissions) {
    await prisma.permission.upsert({
      where: {
        name: permission.name,
      },
      update: permission,
      create: permission,
    });
  }

  const allRoles = await prisma.role.findMany();
  const allPermissions =
    await prisma.permission.findMany();
      async function assignPermissions(
    roleName: RoleName,
    permissionNames: string[]
  ) {
    const role = allRoles.find(
      (r) => r.name === roleName
    );

    if (!role) return;

    for (const permissionName of permissionNames) {
      const permission = allPermissions.find(
        (p) => p.name === permissionName
      );

      if (!permission) continue;

      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: role.id,
            permissionId: permission.id,
          },
        },
        update: {},
        create: {
          roleId: role.id,
          permissionId: permission.id,
        },
      });
    }
  }

  // SUPER ADMIN
  await assignPermissions(
    RoleName.SUPER_ADMIN,
    allPermissions.map((p) => p.name)
  );

  // ADMIN
  await assignPermissions(
    RoleName.ADMIN,
    allPermissions
      .filter(
        (p) =>
          p.name !== "permission.manage"
      )
      .map((p) => p.name)
  );

  // SALES
  await assignPermissions(
    RoleName.SALES,
    [
      "customer.create",
      "customer.read",
      "customer.update",

      "quote.create",
      "quote.read",

      "sales-order.create",
      "sales-order.read",

      "invoice.create",
      "invoice.read",

      "payment.read",
    ]
  );

  // STORE KEEPER
  await assignPermissions(
    RoleName.STORE_KEEPER,
    [
      "inventory.read",
      "inventory.update",
      "inventory.adjust",

      "supplier.read",
    ]
  );

  // ACCOUNTANT
  await assignPermissions(
    RoleName.ACCOUNTANT,
    [
      "invoice.read",

      "payment.create",
      "payment.read",
      "payment.approve",

      "refund.create",
      "refund.read",
      "refund.approve",

      "journal.create",
      "journal.post",
      "journal.read",

      "report.financial",
    ]
  );
  /*
|--------------------------------------------------------------------------
| Seed Default Users
|--------------------------------------------------------------------------
*/

const passwordHashes = {
  superAdmin: await bcrypt.hash("Admin@123", 12),
  admin: await bcrypt.hash("Admin@123", 12),
  sales: await bcrypt.hash("Sales@123", 12),
  store: await bcrypt.hash("Store@123", 12),
  accountant: await bcrypt.hash("Account@123", 12),
};

const users = [
  {
    employeeNumber: "EMP001",
    firstName: "Super",
    lastName: "Admin",
    email: "superadmin@axylum.com",
    password: passwordHashes.superAdmin,
    role: RoleName.SUPER_ADMIN,
  },

  {
    employeeNumber: "EMP002",
    firstName: "System",
    lastName: "Administrator",
    email: "admin@axylum.com",
    password: passwordHashes.admin,
    role: RoleName.ADMIN,
  },

  {
    employeeNumber: "EMP003",
    firstName: "Sales",
    lastName: "Officer",
    email: "sales@axylum.com",
    password: passwordHashes.sales,
    role: RoleName.SALES,
  },

  {
    employeeNumber: "EMP004",
    firstName: "Store",
    lastName: "Keeper",
    email: "store@axylum.com",
    password: passwordHashes.store,
    role: RoleName.STORE_KEEPER,
  },

  {
    employeeNumber: "EMP005",
    firstName: "Chief",
    lastName: "Accountant",
    email: "accountant@axylum.com",
    password: passwordHashes.accountant,
    role: RoleName.ACCOUNTANT,
  },
];

for (const user of users) {
  const role = allRoles.find(
    (r) => r.name === user.role
  );

  if (!role) continue;

  await prisma.user.upsert({
    where: {
      email: user.email,
    },

    update: {
  firstName: user.firstName,
  lastName: user.lastName,
  employeeNumber: user.employeeNumber,
  password: user.password,
  roleId: role.id,
  emailVerified: true,
  mustChangePassword: true,
  isActive: true,
},

    create: {
      employeeNumber: user.employeeNumber,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: user.password,
      roleId: role.id,

      emailVerified: true,
      mustChangePassword: true,
      isActive: true,
    },
  });
}

  console.log("✅ Roles seeded");
console.log("✅ Permissions seeded");
console.log("✅ Role permissions assigned");
console.log("✅ Default users created");
console.log("🎉 Database successfully seeded.");
}

console.log("Before calling main");

main()
  .then(() => {
    console.log("Main finished");
  })
  .catch((error) => {
    console.error("MAIN ERROR:", error);
    process.exit(1);
  })
  .finally(async () => {
    console.log("Disconnecting Prisma");
    await prisma.$disconnect();
  });

console.log("After calling main");