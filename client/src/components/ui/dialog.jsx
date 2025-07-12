"use client"

import React, { createContext, useContext } from "react"

const DialogContext = createContext()

const Dialog = ({ open, onOpenChange, children }) => {
  return (
    <DialogContext.Provider value={{ open, onOpenChange }}>
      {children}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => onOpenChange(false)} />
          <div className="relative z-50 max-h-[90vh] overflow-auto">{children}</div>
        </div>
      )}
    </DialogContext.Provider>
  )
}

const DialogTrigger = ({ children, asChild, ...props }) => {
  const { onOpenChange } = useContext(DialogContext)

  if (asChild) {
    return React.cloneElement(children, {
      onClick: () => onOpenChange(true),
      ...props,
    })
  }

  return (
    <button onClick={() => onOpenChange(true)} {...props}>
      {children}
    </button>
  )
}

const DialogContent = React.forwardRef(({ className = "", children, ...props }, ref) => {
  const { open } = useContext(DialogContext)

  if (!open) return null

  const classes = `bg-white rounded-lg shadow-lg p-6 w-full max-w-lg mx-4 ${className}`

  return (
    <div ref={ref} className={classes} {...props}>
      {children}
    </div>
  )
})

const DialogHeader = ({ className = "", ...props }) => {
  const classes = `flex flex-col space-y-1.5 text-center sm:text-left mb-4 ${className}`

  return <div className={classes} {...props} />
}

const DialogTitle = React.forwardRef(({ className = "", ...props }, ref) => {
  const classes = `text-lg font-semibold leading-none tracking-tight ${className}`

  return <h2 ref={ref} className={classes} {...props} />
})

DialogContent.displayName = "DialogContent"
DialogTitle.displayName = "DialogTitle"

export { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle }
