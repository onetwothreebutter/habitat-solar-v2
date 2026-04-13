"use client"

import { useState, useCallback } from "react"
import { ChevronsUpDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { searchAirports, type Airport } from "@/lib/airports"

interface AirportComboboxProps {
  id?: string
  value: string
  onChange: (iata: string) => void
  placeholder?: string
}

export function AirportCombobox({ id, value, onChange, placeholder = "Search airports..." }: AirportComboboxProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")

  const results = searchAirports(query)

  const selectedLabel = value
    ? (() => {
        const match = searchAirports(value, 1).find((a) => a.iata === value.toUpperCase())
        return match ? `${match.iata} – ${match.city}` : value.toUpperCase()
      })()
    : null

  const handleSelect = useCallback(
    (airport: Airport) => {
      onChange(airport.iata)
      setQuery("")
      setOpen(false)
    },
    [onChange]
  )

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between font-normal px-3 bg-transparent hover:bg-transparent dark:bg-transparent dark:hover:bg-transparent overflow-hidden"
        >
          <span className={`min-w-0 truncate ${selectedLabel ? "text-foreground" : "text-muted-foreground"}`}>
            {selectedLabel ?? placeholder}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[320px] p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="City, airport, or code..."
            value={query}
            onValueChange={setQuery}
          />
          <CommandList>
            {query.length >= 2 ? (
              results.length > 0 ? (
                <CommandGroup>
                  {results.map((airport) => (
                    <CommandItem
                      key={airport.iata}
                      value={airport.iata}
                      onSelect={() => handleSelect(airport)}
                    >
                      <span className="font-semibold text-emerald-700 w-10 shrink-0">
                        {airport.iata}
                      </span>
                      <span className="truncate">
                        {airport.city}, {airport.country}
                        <span className="ml-1 text-xs text-muted-foreground">– {airport.name}</span>
                      </span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              ) : (
                <CommandEmpty>No airports found.</CommandEmpty>
              )
            ) : (
              <CommandEmpty className="text-xs text-muted-foreground px-3 py-2">
                Type a city, airport name, or code
              </CommandEmpty>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
