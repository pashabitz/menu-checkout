"use client"

import { useState } from "react"
import { Minus, Plus } from "lucide-react"

type NumberSelectorProps = {
  initialValue?: number
  min?: number
  max?: number
  onChange?: (value: number) => void
}

export function NumberSelector({ initialValue = 0, min = 0, max = 100, onChange }: NumberSelectorProps) {
  const [value, setValue] = useState(initialValue)

  const increment = () => {
    const newValue = Math.min(value + 1, max)
    setValue(newValue)
    if (onChange) onChange(newValue)
  }

  const decrement = () => {
    const newValue = Math.max(value - 1, min)
    setValue(newValue)
    if (onChange) onChange(newValue)
  }

  return (
    <div className="flex items-center justify-center">
    <button onClick={decrement} disabled={value <= min} aria-label="Decrease value" className="bg-blue-500 text-white p-2 rounded">
      <Minus className="h-4 w-4" />
    </button>
    <div className="w-8 text-center text-xl font-semibold">{value}</div>
    <button onClick={increment} disabled={value >= max} aria-label="Increase value" className="bg-blue-500 text-white p-2 rounded">
      <Plus className="h-4 w-4" />
    </button>
    </div>
  )
}