'use client'

import * as React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

const Modal = DialogPrimitive.Root
const ModalTrigger = DialogPrimitive.Trigger
const ModalClose = DialogPrimitive.Close
const ModalPortal = DialogPrimitive.Portal

interface ModalOverlayProps extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay> {}

const ModalOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  ModalOverlayProps
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      'fixed inset-0 z-50 bg-black/70 backdrop-blur-sm',
      'data-[state=open]:animate-in data-[state=closed]:animate-out',
      'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      className
    )}
    {...props}
  />
))

ModalOverlay.displayName = 'ModalOverlay'

interface ModalContentProps extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  showCloseButton?: boolean
}

const sizeClasses = {
  sm:   'max-w-sm',
  md:   'max-w-md',
  lg:   'max-w-lg',
  xl:   'max-w-2xl',
  full: 'max-w-5xl',
}

const ModalContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  ModalContentProps
>(
  (
    {
      className,
      children,
      size = 'md',
      showCloseButton = true,
      ...props
    },
    ref
  ) => (
    <ModalPortal>
      <ModalOverlay />
      <DialogPrimitive.Content ref={ref} asChild {...props}>
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.98 }}
          transition={{ duration: 0.22, ease: [0.32, 0.72, 0, 1] }}
          className={cn(
            'fixed left-[50%] top-[50%] z-50 w-full -translate-x-[50%] -translate-y-[50%]',
            'bg-bg-card border border-border rounded-2xl shadow-2xl',
            'focus:outline-none p-6',
            sizeClasses[size],
            className
          )}
        >
          {showCloseButton && (
            <DialogPrimitive.Close
              className={cn(
                'absolute right-4 top-4 rounded-lg p-1.5',
                'text-text-muted hover:text-text-primary',
                'hover:bg-bg-surface',
                'transition-colors duration-150',
                'focus:outline-none focus:ring-2 focus:ring-brand-orange/50'
              )}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </DialogPrimitive.Close>
          )}
          {children}
        </motion.div>
      </DialogPrimitive.Content>
    </ModalPortal>
  )
)

ModalContent.displayName = 'ModalContent'

interface ModalHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

function ModalHeader({ className, ...props }: ModalHeaderProps) {
  return (
    <div
      className={cn('flex flex-col gap-1.5 mb-5', className)}
      {...props}
    />
  )
}

ModalHeader.displayName = 'ModalHeader'

interface ModalTitleProps extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title> {}

const ModalTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  ModalTitleProps
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn('text-xl font-heading font-bold text-text-primary', className)}
    {...props}
  />
))

ModalTitle.displayName = 'ModalTitle'

interface ModalDescriptionProps extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description> {}

const ModalDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  ModalDescriptionProps
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn('text-sm text-text-secondary', className)}
    {...props}
  />
))

ModalDescription.displayName = 'ModalDescription'

interface ModalFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

function ModalFooter({ className, ...props }: ModalFooterProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-end gap-3 mt-6 pt-5 border-t border-border',
        className
      )}
      {...props}
    />
  )
}

ModalFooter.displayName = 'ModalFooter'

// Convenience wrapper component
interface ModalWrapperProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  size?: ModalContentProps['size']
  showCloseButton?: boolean
  footer?: React.ReactNode
  children: React.ReactNode
}

function ModalWrapper({
  open,
  onOpenChange,
  title,
  description,
  size = 'md',
  showCloseButton = true,
  footer,
  children,
}: ModalWrapperProps) {
  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <ModalContent size={size} showCloseButton={showCloseButton}>
            <ModalHeader>
              <ModalTitle>{title}</ModalTitle>
              {description && (
                <ModalDescription>{description}</ModalDescription>
              )}
            </ModalHeader>
            {children}
            {footer && <ModalFooter>{footer}</ModalFooter>}
          </ModalContent>
        )}
      </AnimatePresence>
    </Modal>
  )
}

export {
  Modal,
  ModalTrigger,
  ModalClose,
  ModalPortal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalFooter,
  ModalWrapper,
}
