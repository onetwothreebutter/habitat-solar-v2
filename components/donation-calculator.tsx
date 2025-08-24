"use client"

import { useMemo, useState } from "react"
import { ArrowRight, Calculator } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

const PRICE_PER_KG = 0.22

function formatCurrency(n: number) {
  return new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(isFinite(n) ? n : 0)
}

export default function DonationCalculator() {
  const [kg, setKg] = useState<string>("307")
  const [roundUp, setRoundUp] = useState<boolean>(true)

  const { exact, suggested } = useMemo(() => {
    const parsed = Number.parseFloat(kg)
    const exactDonation = isFinite(parsed) && parsed > 0 ? parsed * PRICE_PER_KG : 0
    const suggestedDonation = roundUp ? Math.ceil(exactDonation) : exactDonation
    return { exact: exactDonation, suggested: suggestedDonation }
  }, [kg, roundUp])

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
        {/* Add the "First calculate your emissions" button above the emissions input field */}
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
          <Label htmlFor="kg">Emissions in kilograms (kg CO2)</Label>
          <Input
            id="kg"
            inputMode="decimal"
            placeholder="e.g., 307"
            value={kg}
            onChange={(e) => setKg(e.target.value)}
            aria-describedby="kg-help"
          />
          <p className="text-xs text-muted-foreground" id="kg-help">
            Get your kg CO2 from the ICAO calculator, then paste it here.
          </p>
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

        {/* Update the button layout - the "Donate now" button should be full width at the bottom */}
        <Button className="w-full" asChild>
          <a href="https://build.iowavalleyhabitat.org/checkout/5390" target="_blank" rel="noopener noreferrer">
            Donate now
            <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
          </a>
        </Button>

        <p className="text-xs text-muted-foreground">
          This tool uses the assumption that $0.22 invested in Iowa solar offsets 1 kg CO₂ over 25 years. It’s an
          approximation, not a certified offset.
        </p>
      </CardContent>
    </Card>
  )
}
