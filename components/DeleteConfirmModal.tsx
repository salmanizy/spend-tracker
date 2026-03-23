'use client'

interface Props {
  onConfirm: () => void
  onCancel: () => void
  loading?: boolean
}

export function DeleteConfirmModal({ onConfirm, onCancel, loading }: Props) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
      <div onClick={onCancel} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }} />
      <div style={{
        position: 'relative', zIndex: 10, width: '100%', maxWidth: 480,
        background: '#1c1c1c', borderRadius: '28px 28px 0 0', padding: '24px 20px 40px',
        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif",
      }}>
        <h3 style={{ color: '#fff', fontWeight: 600, textAlign: 'center', fontSize: 16, marginBottom: 8 }}>Delete Expense</h3>
        <p style={{ color: '#888', fontSize: 14, textAlign: 'center', marginBottom: 24 }}>
          Are you sure? This action cannot be undone.
        </p>
        <div style={{ display: 'flex', gap: 12 }}>
          <button
            onClick={onCancel}
            style={{ flex: 1, padding: '14px', borderRadius: 20, border: 'none', background: '#2a2a2a', color: '#fff', fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            style={{ flex: 1, padding: '14px', borderRadius: 20, border: 'none', background: '#c0392b', color: '#fff', fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', opacity: loading ? 0.5 : 1 }}
          >
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  )
}
