import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'
import { Link, type LinkProps } from 'react-router-dom'
import type { LucideIcon } from 'lucide-react'

import { cn } from '@/lib/cn'

export type ButtonVariant = 'primary' | 'ghost' | 'quiet'
export type ButtonSize = 'md' | 'lg'

const VARIANT_CLASS: Record<ButtonVariant, string> = {
  primary: 'btn-primary',
  ghost: 'btn-ghost',
  quiet: 'btn-quiet',
}

const SIZE_CLASS: Record<ButtonSize, string> = {
  md: '',
  lg: 'px-6 py-3 text-[0.95rem] sm:px-7 sm:py-3.5',
}

export function buttonClass(variant: ButtonVariant = 'primary', size: ButtonSize = 'md', className?: string) {
  return cn('btn group/btn', VARIANT_CLASS[variant], SIZE_CLASS[size], className)
}

type ContentProps = {
  children: ReactNode
  icon?: LucideIcon
  iconPosition?: 'left' | 'right'
}

function Content({ children, icon: Icon, iconPosition = 'right' }: ContentProps) {
  return (
    <>
      {Icon && iconPosition === 'left' ? (
        <Icon className="size-4 shrink-0" aria-hidden="true" />
      ) : null}
      <span>{children}</span>
      {Icon && iconPosition === 'right' ? (
        <Icon
          className="size-4 shrink-0 transition-transform duration-300 ease-out group-hover/btn:translate-x-0.5"
          aria-hidden="true"
        />
      ) : null}
    </>
  )
}

export type ButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> &
  ContentProps & {
    variant?: ButtonVariant
    size?: ButtonSize
  }

export function Button({ variant = 'primary', size = 'md', className, children, icon, iconPosition, ...rest }: ButtonProps) {
  return (
    <button type="button" className={buttonClass(variant, size, className)} {...rest}>
      <Content icon={icon} iconPosition={iconPosition}>
        {children}
      </Content>
    </button>
  )
}

export type ButtonAnchorProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'children' | 'href'> &
  ContentProps & {
    href: string
    variant?: ButtonVariant
    size?: ButtonSize
  }

/** External or non-router link (opens in a new tab, with rel safety). */
export function ButtonAnchor({ href, variant = 'ghost', size = 'md', className, children, icon, iconPosition, ...rest }: ButtonAnchorProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className={buttonClass(variant, size, className)}
      {...rest}
    >
      <Content icon={icon} iconPosition={iconPosition}>
        {children}
      </Content>
    </a>
  )
}

export type ButtonRouteProps = Omit<LinkProps, 'children' | 'className'> &
  ContentProps & {
    variant?: ButtonVariant
    size?: ButtonSize
    className?: string
  }

/** Internal navigation link rendered as a button. */
export function ButtonRoute({ to, variant = 'primary', size = 'md', className, children, icon, iconPosition, ...rest }: ButtonRouteProps) {
  return (
    <Link to={to} className={buttonClass(variant, size, className)} {...rest}>
      <Content icon={icon} iconPosition={iconPosition}>
        {children}
      </Content>
    </Link>
  )
}
