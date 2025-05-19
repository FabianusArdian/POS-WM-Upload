"use client"

import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

interface POSHeaderProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
}

export default function POSHeader({ searchQuery, setSearchQuery }: POSHeaderProps) {
  return (
    <div>
      <div className="mb-6">
        <p className="text-muted-foreground">View and manage orders</p>
      </div>

      {/* Search and filter */}
      <div className="mb-6 flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
    </div>
  )
}
