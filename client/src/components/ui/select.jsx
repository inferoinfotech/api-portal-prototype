"use client"

import React, { createContext, useContext, useState } from "react"

const SelectContext = createContext()

const Select = ({ value, onValueChange, children, ...props }) => {
  const [internalValue, setInternalValue] = useState(value || "")
  const [isOpen, setIsOpen] = useState(false)

  const currentValue = value !== undefined ? value : internalValue

  const handleValueChange = (newValue) => {
    if (value === undefined) {
      setInternalValue(newValue)
    }
    onValueChange?.(newValue)
    setIsOpen(false)
  }

  return (
    <SelectContext.Provider
      value={{
        value: currentValue,
        onValueChange: handleValueChange,
        isOpen,
        setIsOpen,
      }}
    >
      <div className="relative" {...props}>
        {children}
      </div>
    </SelectContext.Provider>
  )
}

const SelectTrigger = React.forwardRef(({ className = "", children, ...props }, ref) => {
  const { isOpen, setIsOpen } = useContext(SelectContext)

  const classes = `flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`

  return (
    <button ref={ref} className={classes} onClick={() => setIsOpen(!isOpen)} {...props}>
      {children}
      <svg className="h-4 w-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  )
})

const SelectValue = ({ placeholder }) => {
  const { value } = useContext(SelectContext)

  return <span className={value ? "" : "text-gray-500"}>{value || placeholder}</span>
}

const SelectContent = React.forwardRef(({ className = "", children, ...props }, ref) => {
  const { isOpen } = useContext(SelectContext)

  if (!isOpen) return null

  const classes = `absolute top-full left-0 z-50 w-full min-w-[8rem] overflow-hidden rounded-md border border-gray-200 bg-white text-gray-950 shadow-md animate-in fade-in-0 zoom-in-95 ${className}`

  return (
    <div ref={ref} className={classes} {...props}>
      <div className="p-1">{children}</div>
    </div>
  )
})

const SelectItem = React.forwardRef(({ className = "", children, value, ...props }, ref) => {
  const { onValueChange } = useContext(SelectContext)

  const classes = `relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-gray-100 focus:bg-gray-100 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 ${className}`

  return (
    <div ref={ref} className={classes} onClick={() => onValueChange(value)} {...props}>
      {children}
    </div>
  )
})

SelectTrigger.displayName = "SelectTrigger"
SelectValue.displayName = "SelectValue"
SelectContent.displayName = "SelectContent"
SelectItem.displayName = "SelectItem"

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem }