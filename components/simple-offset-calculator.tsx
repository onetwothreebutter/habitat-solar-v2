"use client"

import { useMemo, useState } from "react"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const PRICE_PER_KG = 0.22

function formatCurrency(n: number) {
  return new Intl.NumberFormat(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(
    isFinite(n) ? n : 0
  )
}

export default function SimpleOffsetCalculator() {
  const [kg, setKg] = useState<string>("")

  const donation = useMemo(() => {
    const sanitized = kg.replace(/,/g, "")
    const parsed = Number.parseFloat(sanitized)
    const exact = isFinite(parsed) && parsed > 0 ? parsed * PRICE_PER_KG : 0
    return Math.ceil(exact)
  }, [kg])

  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="simple-kg" className="text-sm font-medium">
            Your flight emissions (kg CO2)
          </Label>
          <div className="flex gap-2">
            <Input
              id="simple-kg"
              inputMode="decimal"
              placeholder="e.g., 307"
              value={kg}
              onChange={(e) => setKg(e.target.value)}
              className="flex-1"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Don&apos;t know your emissions?{" "}
            <a
              href="https://www.icao.int/environmental-protection/CarbonOffset"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-foreground"
            >
              Use the ICAO calculator
            </a>
          </p>
        </div>

        {donation > 0 && (
          <div className="rounded-lg bg-emerald-50 p-4">
            <div className="text-sm text-muted-foreground">Suggested donation</div>
            <div className="text-2xl font-bold text-emerald-700">{formatCurrency(donation)}</div>
          </div>
        )}

        <Button className="w-full" disabled={donation === 0} asChild={donation > 0}>
          {donation > 0 ? (
            <a href="https://build.iowavalleyhabitat.org/checkout/5390" target="_blank" rel="noopener noreferrer">
              Donate {formatCurrency(donation)}
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
            </a>
          ) : (
            <span>Enter emissions to calculate</span>
          )}
        </Button>
      </div>
    </div>
  )
}
