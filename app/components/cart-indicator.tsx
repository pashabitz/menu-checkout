import { ShoppingCart } from "lucide-react"

interface CartIndicatorProps {
  count: number
}

export default function CartIndicator({ count }: CartIndicatorProps) {
  return (
    <div className="relative inline-flex items-center p-2">
      <ShoppingCart className="h-6 w-6 text-gray-700" />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </div>
  )
}