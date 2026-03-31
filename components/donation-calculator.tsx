"use client"

import { useMemo, useState } from "react"
import { ArrowRight, Calculator, Plane, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const PRICE_PER_KG = 0.22

function formatCurrency(n: number) {
  return new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(isFinite(n) ? n : 0)
}

export default function DonationCalculator() {
  const [kg, setKg] = useState<string>("307")
  const [roundUp, setRoundUp] = useState<boolean>(true)
  
  // Flight lookup state
  const [origin, setOrigin] = useState("")
  const [destination, setDestination] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { exact, suggested } = useMemo(() => {
    const sanitized = kg.replace(/,/g, "")
    const parsed = Number.parseFloat(sanitized)
    const exactDonation = isFinite(parsed) && parsed > 0 ? parsed * PRICE_PER_KG : 0
    const suggestedDonation = roundUp ? Math.ceil(exactDonation) : exactDonation
    return { exact: exactDonation, suggested: suggestedDonation }
  }, [kg, roundUp])

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
                <Label htmlFor="origin-full">From (airport code)</Label>
                <Input
                  id="origin-full"
                  placeholder="ORD"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  maxLength={3}
                  className="uppercase"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="destination-full">To (airport code)</Label>
                <Input
                  id="destination-full"
                  placeholder="LAX"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  maxLength={3}
                  className="uppercase"
                />
              </div>
            </div>
            
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
            
            <Button 
              onClick={lookupFlightEmissions} 
              disabled={isLoading || !origin || !destination}
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
            
            <p className="text-xs text-muted-foreground">
              Uses Google Travel Impact Model API. Enter 3-letter IATA airport codes (e.g., ORD, LAX, JFK).
            </p>
          </TabsContent>
          
          <TabsContent value="manual" className="space-y-4 mt-4">
            <Button variant="outline" className="w-full bg-transparent" asChild>
              <a
                href="https://www.icao.int/environmental-protection/CarbonOffset"
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
          <div className="grid gap-2">
            <Label htmlFor="kg-display">Emissions (kg CO2)</Label>
            <Input
              id="kg-display"
              inputMode="decimal"
              placeholder="e.g., 307"
              value={kg}
              onChange={(e) => setKg(e.target.value)}
            />
          </div>

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
            <div className="text-3xl font-bold tabular-nums">{formatCurrency(suggested)}</div>
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
