import React from 'react'
import styles from './Button.module.css'

export type ButtonColor = 'primary' | 'secondary' | 'success' | 'danger'

export interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  color?: ButtonColor
  disabled?: boolean
  size?: 'small' | 'medium' | 'large'
  variant?: 'solid' | 'outline'
  className?: string
  type?: 'button' | 'submit' | 'reset'
  title?: string
  icon?: React.ReactNode
  fullWidth?: boolean
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  color = 'primary',
  disabled = false,
  size = 'medium',
  variant = 'solid',
  type = 'button',
  className,
  title,
  icon,
  fullWidth = false
}) => {
  const buttonClassName = [
    styles.button,
    styles[size],
    styles[color],
    styles[variant],
    disabled && styles.disabled,
    className,
    fullWidth && styles.fullWidth
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button
      className={buttonClassName}
      onClick={onClick}
      disabled={disabled}
      type={type}
      title={title}
    >
      {icon && <span className={styles.icon}>{icon}</span>}
      {children}
    </button>
  )
}

export default Button
