import React, { ReactNode } from 'react'
import styles from './Card.module.css'

interface CardProps {
  children: ReactNode
  isCollapsible?: boolean
  isCollapsed?: boolean
  onToggleCollapse?: () => void
  title?: string
  icon?: string
  headerActions?: ReactNode
  footer?: ReactNode
  spacing?: 'regular' | 'tight' | 'compact'
  variant?: 'default' | 'item'
}

const Card: React.FC<CardProps> = ({
  children,
  isCollapsible = false,
  isCollapsed = false,
  onToggleCollapse,
  title,
  icon,
  headerActions,
  footer,
  spacing = 'regular',
  variant = 'default'
}) => {
  const handleHeaderClick = () => {
    if (isCollapsible && onToggleCollapse) {
      onToggleCollapse()
    }
  }

  const cardClassName =
    `${styles.card} ${styles[spacing]} ${variant === 'default' ? '' : styles[variant]} ${!footer ? styles.noFooter : ''}`.trim()
  const headerClassName = `${styles.cardHeader} ${isCollapsible ? styles.collapsible : ''}`.trim()

  return (
    <div className={cardClassName}>
      {(title || headerActions) && (
        <div className={headerClassName} onClick={isCollapsible ? handleHeaderClick : undefined}>
          <div className={styles.headerContent}>
            {title && (
              <div className={styles.cardTitle}>
                {icon && <span className={styles.cardIcon}>{icon}</span>}
                <h2 className={styles.cardTitleText}>{title}</h2>
              </div>
            )}
          </div>
          {headerActions && <div className={styles.headerActions}>{headerActions}</div>}
        </div>
      )}

      {(!isCollapsible || !isCollapsed) && <div className={styles.cardContent}>{children}</div>}
      {footer && <div className={styles.cardFooter}>{footer}</div>}
    </div>
  )
}

export default Card
