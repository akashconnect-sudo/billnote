'use client'

import { Tip } from '@billnote/ui'
import { getHelp, permissionTypes, type PermissionType } from '@billnote/shared'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { api } from '../../../lib/api'
import { getAccessToken } from '../../../lib/session'

const helpIdByType: Record<PermissionType, `permission.${PermissionType}`> = {
  camera: 'permission.camera',
  location: 'permission.location',
  notifications: 'permission.notifications',
  photos: 'permission.photos',
  bluetooth: 'permission.bluetooth',
  contacts: 'permission.contacts',
}

const labels: Record<PermissionType, string> = {
  camera: 'Camera',
  location: 'Location',
  notifications: 'Notifications',
  photos: 'Photos & files',
  bluetooth: 'Bluetooth',
  contacts: 'Contacts',
}

export default function PermissionsOnboardingPage() {
  const router = useRouter()
  const [done, setDone] = useState<Record<string, string>>({})

  async function save(type: PermissionType, state: 'granted' | 'skipped' | 'denied') {
    const token = getAccessToken()
    if (!token) return
    await api('/api/v1/settings/permissions-status', {
      method: 'PUT',
      token,
      body: JSON.stringify({ type, state }),
    })
    setDone((prev) => ({ ...prev, [type]: state }))
  }

  return (
    <main className="bn-auth-main" style={{ minHeight: '100vh' }}>
      <div className="bn-auth-card" style={{ width: 'min(100%, 560px)' }}>
        <Tip id="onboarding.permissions">
          <h1 className="bn-title">Permissions</h1>
        </Tip>
        <p className="bn-subtitle">Allow only what you need. Skipping never blocks the app.</p>

        <div className="bn-stack">
          {permissionTypes.map((type) => (
            <Tip key={type} id={helpIdByType[type]} showInfoIcon className="bn-tip-block">
              <article
                style={{
                  border: '1px solid var(--bn-line)',
                  borderRadius: 14,
                  padding: 14,
                  background: 'var(--bn-card)',
                  width: '100%',
                }}
              >
                <strong>{labels[type]}</strong>
                <p style={{ margin: '6px 0 12px', fontSize: 14, color: 'var(--bn-ink-soft)' }}>
                  {getHelp(helpIdByType[type])}
                </p>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                  <button
                    type="button"
                    className="bn-btn bn-btn-primary"
                    onClick={() => void save(type, 'granted')}
                  >
                    Allow
                  </button>
                  <button
                    type="button"
                    className="bn-btn bn-btn-secondary"
                    onClick={() => void save(type, 'skipped')}
                  >
                    Skip for now
                  </button>
                  {done[type] ? (
                    <span style={{ fontSize: 13, color: 'var(--bn-good)' }}>Saved: {done[type]}</span>
                  ) : null}
                </div>
              </article>
            </Tip>
          ))}
        </div>

        <button
          type="button"
          className="bn-btn bn-btn-primary bn-btn-block"
          style={{ marginTop: 20 }}
          onClick={() => router.push('/app')}
        >
          Go to dashboard
        </button>
      </div>
    </main>
  )
}
