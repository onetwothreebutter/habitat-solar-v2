"use client"

import { useMemo, useState, useEffect, useRef } from "react"
import { ArrowRight, Calculator, Plane, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AirportCombobox } from "@/components/airport-combobox"

const PRICE_PER_KG = 0.22

function formatCurrency(n: number) {
  return new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(isFinite(n) ? n : 0)
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

export default function DonationCalculator() {
  const [kg, setKg] = useState<string>("")
  const [roundUp, setRoundUp] = useState<boolean>(true)

  // Flight lookup state
  const [origin, setOrigin] = useState("")
  const [destination, setDestination] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasCalculated, setHasCalculated] = useState(false)

  const { exact, suggested, display } = useMemo(() => {
    const sanitized = kg.replace(/,/g, "")
    const parsed = Number.parseFloat(sanitized)
    const exactDonation = isFinite(parsed) && parsed > 0 ? parsed * PRICE_PER_KG : 0
    const suggestedDonation = Math.ceil(exactDonation)
    return { exact: exactDonation, suggested: suggestedDonation, display: roundUp ? suggestedDonation : exactDonation }
  }, [kg, roundUp])

  const animatedSuggested = useAnimatedNumber(display)

  const lookupFlightEmissions = async () => {
    if (!origin || !destination) {
      setError("Please enter both origin and destination airports")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/flight-emissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          origin: origin.toUpperCase().trim(),
          destination: destination.toUpperCase().trim(),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch emissions")
      }

      setKg(Math.round(data.emissionsKg).toString())
      setHasCalculated(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to calculate emissions")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle>Donation calculator</CardTitle>
            <CardDescription>Use $0.22 per kg CO2 to estimate your donation.</CardDescription>
          </div>
          <Calculator className="h-5 w-5 text-emerald-600" aria-hidden="true" />
        </div>
      </CardHeader>
      <CardContent className="grid gap-5">
        <Tabs defaultValue="flight" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="flight" className="flex items-center gap-2">
              <Plane className="h-4 w-4" />
              Flight Lookup
            </TabsTrigger>
            <TabsTrigger value="manual">Manual Entry</TabsTrigger>
          </TabsList>
          
          <TabsContent value="flight" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="origin-full">From</Label>
                <AirportCombobox
                  id="origin-full"
                  value={origin}
                  onChange={setOrigin}
                  placeholder="Origin airport"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="destination-full">To</Label>
                <AirportCombobox
                  id="destination-full"
                  value={destination}
                  onChange={setDestination}
                  placeholder="Destination airport"
                />
              </div>
            </div>
            
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
            
            <Button
              onClick={lookupFlightEmissions}
              disabled={isLoading || origin.length !== 3 || destination.length !== 3}
              variant="outline"
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Looking up...
                </>
              ) : (
                "Calculate Flight Emissions"
              )}
            </Button>

            {hasCalculated && kg && origin && destination && (
              <div className="rounded-lg bg-emerald-50 p-3">
                <div className="text-sm font-medium text-emerald-800">
                  {origin.toUpperCase()} → {destination.toUpperCase()}
                </div>
                <div className="text-lg font-bold text-emerald-700 tabular-nums">
                  {Number(kg.replace(/,/g, "")).toLocaleString()} kg CO2
                </div>
              </div>
            )}
            
            <p className="text-xs text-muted-foreground">
              Uses Google Travel Impact Model API. Search by city, airport name, or IATA code.
            </p>
          </TabsContent>
          
          <TabsContent value="manual" className="space-y-4 mt-4">
            <Button variant="outline" className="w-full bg-transparent" asChild>
              <a
                href="https://icec.icao.int/calculator"
                target="_blank"
                rel="noopener noreferrer"
              >
                First calculate your emissions
              </a>
            </Button>

            <div className="grid gap-2">
              <Label htmlFor="kg-manual">Emissions in kilograms (kg CO2)</Label>
              <Input
                id="kg-manual"
                inputMode="decimal"
                placeholder="e.g., 307"
                value={kg}
                onChange={(e) => setKg(e.target.value)}
                aria-describedby="kg-help-manual"
              />
              <p className="text-xs text-muted-foreground" id="kg-help-manual">
                Get your kg CO2 from the ICAO calculator, then paste it here.
              </p>
            </div>
          </TabsContent>
        </Tabs>

        <div className="border-t pt-4 space-y-4">
          <div className="flex items-center justify-between rounded-md border p-3">
            <div className="space-y-0.5">
              <div className="text-sm font-medium">Round up to the nearest dollar</div>
              <div className="text-xs text-muted-foreground">
                Exact: {formatCurrency(exact)} • Suggested: {formatCurrency(suggested)}
              </div>
            </div>
            <Switch checked={roundUp} onCheckedChange={setRoundUp} aria-label="Round up donation" />
          </div>

          <div className="grid gap-1">
            <div className="text-sm text-muted-foreground">Your estimated donation</div>
            <div className="text-3xl font-bold tabular-nums">{formatCurrency(Math.round(animatedSuggested * 100) / 100)}</div>
          </div>

          <Button className="w-full" asChild>
            <a href="https://build.iowavalleyhabitat.org/checkout/5390" target="_blank" rel="noopener noreferrer">
              Donate now
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
            </a>
          </Button>

          <p className="text-xs text-muted-foreground">
            This tool uses the assumption that $0.22 invested in Iowa solar offsets 1 kg CO₂ over 25 years. It&apos;s an
            approximation, not a certified offset.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
