import { useState, useEffect, useCallback } from 'react'

/**
 * Toast notification hook
 * Usage: const { toast, showToast } = useToast()
 *        showToast('Message', 'success' | 'error' | 'info')
 */
export function useToast() {
  const [toast, setToast] = useState({ msg: '', type: 'success', visible: false })

  const showToast = useCallback((msg, type = 'success') => {
    setToast({ msg, type, visible: true })
  }, [])

  useEffect(() => {
    if (!toast.visible) return
    const t = setTimeout(() => setToast(p => ({ ...p, visible: false })), 3600)
    return () => clearTimeout(t)
  }, [toast.visible, toast.msg])

  return { toast, showToast }
}
