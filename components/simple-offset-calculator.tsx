"use client"

import { useMemo, useState, useEffect, useRef } from "react"
import { ArrowRight, Plane, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AirportCombobox } from "@/components/airport-combobox"

const PRICE_PER_KG = 0.22

function formatCurrency(n: number) {
  return new Intl.NumberFormat(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(
    isFinite(n) ? n : 0
  )
}

function useAnimatedNumber(value: number, duration: number = 500) {
  const [displayValue, setDisplayValue] = useState(value)
  const previousValue = useRef(value)
  const animationRef = useRef<number>()

  useEffect(() => {
    const startValue = previousValue.current
    const endValue = value
    const startTime = performance.now()

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      // Ease out cubic for smooth deceleration
      const easeOut = 1 - Math.pow(1 - progress, 3)
      const current = startValue + (endValue - startValue) * easeOut
      
      setDisplayValue(current)

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate)
      } else {
        previousValue.current = endValue
      }
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [value, duration])

  return displayValue
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

  const animatedDonation = useAnimatedNumber(donation)

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
                <AirportCombobox
                  id="origin"
                  value={origin}
                  onChange={setOrigin}
                  placeholder="Origin airport"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="destination" className="text-sm font-medium">
                  To
                </Label>
                <AirportCombobox
                  id="destination"
                  value={destination}
                  onChange={setDestination}
                  placeholder="Destination airport"
                />
              </div>
            </div>
            <Button
              type="button"
              variant="secondary"
              className="w-full"
              onClick={lookupFlight}
              disabled={loading || origin.length < 3 || destination.length < 3}
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
                href="https://icec.icao.int/calculator"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-foreground"
              >
                Use the ICAO calculator
              </a>
            </p>
          </div>
        )}

        {kg && (
          <div className="rounded-lg bg-emerald-50 p-4">
            <div className="text-sm font-medium text-emerald-800">
              {mode === "flight" && origin && destination
                ? `${origin} → ${destination}`
                : "Your emissions"}
            </div>
            <div className="text-xl font-bold text-emerald-700 tabular-nums">
              {Number(kg.replace(/,/g, "")).toLocaleString()} kg CO2
            </div>
            {donation > 0 && (
              <div className="mt-2 pt-2 border-t border-emerald-200">
                <div className="text-sm text-muted-foreground">Suggested donation</div>
                <div className="text-2xl font-bold text-emerald-700 tabular-nums">
                  {formatCurrency(Math.round(animatedDonation))}
                </div>
              </div>
            )}
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
