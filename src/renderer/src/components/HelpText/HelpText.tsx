import React, { ReactNode } from 'react'
import styles from './HelpText.module.css'

interface HelpTextProps {
  children: ReactNode
  className?: string
  variant?: 'info' | 'warning' | 'success' | 'error'
  icon?: string
}

const HelpText: React.FC<HelpTextProps> = ({
  children,
  className = '',
  variant = 'info',
  icon
}) => {
  const helpTextClassName = `${styles.helpText} ${styles[variant]} ${className}`.trim()
  
  return (
    <div className={helpTextClassName}>
      {icon && <span className={styles.helpIcon}>{icon}</span>}
      <span className={styles.helpContent}>{children}</span>
    </div>
  )
}

export default HelpText
