import React, { ReactNode, useEffect } from 'react'
import styles from './Modal.module.css'

interface ModalProps {
  children: ReactNode
  isOpen: boolean
  onClose: () => void
  title?: string
  icon?: string
  headerActions?: ReactNode
  footer?: ReactNode
  size?: 'small' | 'medium' | 'large' | 'full'
  closeOnOverlayClick?: boolean
  closeOnEscape?: boolean
}

const Modal: React.FC<ModalProps> = ({
  children,
  isOpen,
  onClose,
  title,
  icon,
  headerActions,
  footer,
  size = 'medium',
  closeOnOverlayClick = true,
  closeOnEscape = true
}) => {
  useEffect(() => {
    if (!isOpen) return

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && closeOnEscape) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose, closeOnEscape])

  const handleOverlayClick = (event: React.MouseEvent) => {
    if (closeOnOverlayClick && event.target === event.currentTarget) {
      onClose()
    }
  }

  if (!isOpen) return null

  const modalClassName = `${styles.modal} ${styles[size]}`.trim()

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={modalClassName} onClick={(e) => e.stopPropagation()}>
        {(title || headerActions) && (
          <div className={styles.modalHeader}>
            <div className={styles.headerContent}>
              {title && (
                <div className={styles.modalTitle}>
                  {icon && <span className={styles.modalIcon}>{icon}</span>}
                  <h2 className={styles.modalTitleText}>{title}</h2>
                </div>
              )}
            </div>
            {headerActions && <div className={styles.headerActions}>{headerActions}</div>}
            <button className={styles.closeButton} onClick={onClose} title="Close">
              ×
            </button>
          </div>
        )}
        <div className={styles.modalContent}>{children}</div>
        {footer && <div className={styles.modalFooter}>{footer}</div>}
      </div>
    </div>
  )
}

export default Modal
