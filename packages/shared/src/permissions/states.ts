export const permissionTypes = [
  'camera',
  'location',
  'notifications',
  'photos',
  'bluetooth',
  'contacts',
] as const

export type PermissionType = (typeof permissionTypes)[number]

export const permissionStates = [
  'not_determined',
  'granted',
  'denied',
  'blocked',
  'limited',
  'restricted',
  'skipped',
] as const

export type PermissionState = (typeof permissionStates)[number]

export type PermissionRecord = {
  type: PermissionType
  state: PermissionState
  updatedAt: string
}

export function canRequestAgain(state: PermissionState): boolean {
  return state === 'not_determined' || state === 'denied' || state === 'skipped'
}

export function needsSettings(state: PermissionState): boolean {
  return state === 'blocked' || state === 'restricted'
}

export function isUsable(state: PermissionState): boolean {
  return state === 'granted' || state === 'limited'
}

export function nextStateAfterOsResult(
  current: PermissionState,
  osResult: 'granted' | 'denied' | 'blocked' | 'limited' | 'restricted',
): PermissionState {
  if (current === 'restricted') return 'restricted'
  return osResult
}
