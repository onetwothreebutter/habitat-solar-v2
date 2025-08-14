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
  const [showPopup, setShowPopup] = useState(false)

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

        <div className="flex flex-col sm:flex-row gap-3">
          <Button className="flex-1" onClick={() => setShowPopup(true)}>
            Donate now
            <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
          </Button>
          <Button variant="outline" className="flex-1 bg-transparent" asChild>
            <a
              href="https://www.icao.int/environmental-protection/CarbonOffset"
              target="_blank"
              rel="noopener noreferrer"
            >
              Open ICAO calculator
            </a>
          </Button>
        </div>

        {showPopup && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-md mx-4 space-y-4">
              <h3 className="font-semibold text-lg">Important Note</h3>
              <p className="text-sm text-muted-foreground">
                Be sure to enter a note that your donation is for the habitat solar fund. In the future, there will be
                an added option to the dropdown.
              </p>
              <div className="flex gap-3">
                <Button
                  onClick={() => {
                    setShowPopup(false)
                    window.open("https://build.iowavalleyhabitat.org/checkout/5390", "_blank", "noopener,noreferrer")
                  }}
                  className="flex-1"
                >
                  OK, Continue to Donate
                </Button>
                <Button variant="outline" onClick={() => setShowPopup(false)} className="flex-1">
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        <p className="text-xs text-muted-foreground">
          This tool uses the assumption that $0.22 invested in Iowa solar offsets 1 kg CO₂ over 25 years. It’s an
          approximation, not a certified offset.
        </p>
      </CardContent>
    </Card>
  )
}
