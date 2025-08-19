import React from 'react'
import styles from './Button.module.css'

export type ButtonColor =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'danger'
  | 'warning'
  | 'info'
  | 'gray'

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
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  color = 'primary',
  disabled = false,
  size = 'medium',
  variant = 'solid',
  className = '',
  type = 'button',
  title
}) => {
  const buttonClassName = [
    styles.button,
    styles[color],
    styles[size],
    styles[variant],
    disabled && styles.disabled,
    className
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
      {children}
    </button>
  )
}

export default Button
