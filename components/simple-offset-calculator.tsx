"use client"

import { useMemo, useState } from "react"
import { ArrowRight, Plane, Loader2 } from "lucide-react"

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
  const [mode, setMode] = useState<"manual" | "flight">("flight")
  const [kg, setKg] = useState<string>("")
  const [origin, setOrigin] = useState<string>("")
  const [destination, setDestination] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const donation = useMemo(() => {
    const sanitized = kg.replace(/,/g, "")
    const parsed = Number.parseFloat(sanitized)
    const exact = isFinite(parsed) && parsed > 0 ? parsed * PRICE_PER_KG : 0
    return Math.ceil(exact)
  }, [kg])

  const lookupFlight = async () => {
    if (!origin || !destination) return

    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/flight-emissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ origin, destination }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Failed to look up flight emissions")
        return
      }

      setKg(Math.round(data.emissionsKg).toString())
    } catch {
      setError("Failed to connect to emissions service")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <div className="space-y-4">
        {/* Mode toggle */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setMode("flight")}
            className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              mode === "flight"
                ? "bg-emerald-100 text-emerald-800"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            <Plane className="mr-1.5 inline-block h-4 w-4" />
            Look up flight
          </button>
          <button
            type="button"
            onClick={() => setMode("manual")}
            className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              mode === "manual"
                ? "bg-emerald-100 text-emerald-800"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            Enter manually
          </button>
        </div>

        {mode === "flight" ? (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1.5">
                <Label htmlFor="origin" className="text-sm font-medium">
                  From
                </Label>
                <Input
                  id="origin"
                  placeholder="ORD"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value.toUpperCase())}
                  maxLength={3}
                  className="uppercase"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="destination" className="text-sm font-medium">
                  To
                </Label>
                <Input
                  id="destination"
                  placeholder="LAX"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value.toUpperCase())}
                  maxLength={3}
                  className="uppercase"
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Enter 3-letter IATA airport codes (e.g., ORD, LAX, JFK)
            </p>
            <Button
              type="button"
              variant="secondary"
              className="w-full"
              onClick={lookupFlight}
              disabled={loading || origin.length !== 3 || destination.length !== 3}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Looking up...
                </>
              ) : (
                <>
                  <Plane className="mr-2 h-4 w-4" />
                  Calculate emissions
                </>
              )}
            </Button>
            {error && (
              <p className="text-xs text-red-600">{error}</p>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            <Label htmlFor="simple-kg" className="text-sm font-medium">
              Your flight emissions (kg CO2)
            </Label>
            <Input
              id="simple-kg"
              inputMode="decimal"
              placeholder="e.g., 307"
              value={kg}
              onChange={(e) => setKg(e.target.value)}
            />
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
        )}

        {donation > 0 && (
          <div className="rounded-lg bg-emerald-50 p-4">
            <div className="text-sm text-muted-foreground">
              {kg && mode === "flight" && origin && destination
                ? `${origin} → ${destination}: ${kg} kg CO2`
                : `${kg} kg CO2`}
            </div>
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
            <span>Enter flight to calculate</span>
          )}
        </Button>
      </div>
    </div>
  )
}
