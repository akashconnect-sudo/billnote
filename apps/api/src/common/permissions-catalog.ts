import { cashierPermissions, permissionKeys, type PermissionKey } from '@billnote/shared'

const all = [...permissionKeys]

const managerDeny = new Set<PermissionKey>(['role.manage'])

export function permissionsForRole(roleKey: string): PermissionKey[] {
  switch (roleKey) {
    case 'owner':
      return all
    case 'manager':
      return all.filter((key) => !managerDeny.has(key))
    case 'cashier':
      return [...cashierPermissions]
    case 'accountant':
      return [
        'invoice.read',
        'payment.read',
        'product.read',
        'party.read',
        'purchase.create',
        'purchase.read',
        'expense.create',
        'expense.read',
        'report.view',
        'report.export',
        'accounting.view',
        'accounting.lock',
      ]
    case 'staff':
      return ['invoice.read', 'product.read', 'party.read']
    default:
      return []
  }
}
