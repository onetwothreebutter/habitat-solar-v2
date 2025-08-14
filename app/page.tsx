import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Home, Leaf, Plane } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import DonationCalculator from "@/components/donation-calculator"

export const metadata = {
  title: "Offset CO2 from flights and help an Iowa family | Habitat Solar",
  description:
    "Donate to the Iowa Valley Habitat for Humanity Solar Fund. Every $0.22 invested in local solar offsets 1 kg of CO2 over 25 years and lowers energy bills for low‑income families.",
}

export default function Page() {
  return (
    <main className="min-h-dvh">
      <header className="border-b">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Home className="h-5 w-5" aria-hidden="true" />
            <span className="font-semibold">Habitat Solar</span>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild>
              <Link href="https://www.iowavalleyhabitat.org/" target="_blank" rel="noopener noreferrer">
                Visit IVHFH
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-emerald-50 to-white" />
        <div className="mx-auto max-w-6xl px-4 py-12 md:py-16 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <h1 className="text-3xl md:text-5xl font-bold leading-tight">
              Want to offset CO2 from a flight and help an Iowa family?
            </h1>
            <p className="text-muted-foreground text-base md:text-lg">
              You can compensate for CO2 emissions from flights or other carbon‑intensive activities by funding local
              solar installations for Iowa Valley Habitat for Humanity homes. These homes are built “solar‑ready,” but
              most homeowners can’t afford the upfront cost of a solar array. Your donation makes these systems
              possible—reducing carbon emissions for the lifetime of the panels and lowering energy bills for low‑income
              families.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button size="lg" asChild>
                <Link href="https://www.iowavalleyhabitat.org/donate.html" target="_blank" rel="noopener noreferrer">
                  Donate now
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="#calculator">Calculate your offset</a>
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Offset‑equivalent based on local solar production and 25‑year panel lifetime assumptions.
            </p>
          </div>
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl border bg-white">
            <Image
              src="/iowa-solar-rooftop.png"
              alt="Rooftop solar panels on a sunny day"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-4 py-10 md:py-14">
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="space-y-1">
              <div className="flex items-center gap-2">
                <Leaf className="h-5 w-5 text-emerald-600" aria-hidden="true" />
                <CardTitle className="text-base">How it works</CardTitle>
              </div>
              <CardDescription>Simple conversion for local solar</CardDescription>
            </CardHeader>
            <CardContent className="text-sm">
              Every <span className="font-semibold">$0.22</span> invested in solar in Iowa offsets the equivalent of{" "}
              <span className="font-semibold">1 kilogram of CO2</span> over 25 years.
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="space-y-1">
              <div className="flex items-center gap-2">
                <Plane className="h-5 w-5 text-emerald-600" aria-hidden="true" />
                <CardTitle className="text-base">Example</CardTitle>
              </div>
              <CardDescription>NYC → Los Angeles</CardDescription>
            </CardHeader>
            <CardContent className="text-sm">
              A one‑way flight emits about <span className="font-semibold">307 kg CO2</span>. Offset with a{" "}
              <span className="font-semibold">$68</span> donation.
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="space-y-1">
              <div className="flex items-center gap-2">
                <Home className="h-5 w-5 text-emerald-600" aria-hidden="true" />
                <CardTitle className="text-base">Local impact</CardTitle>
              </div>
              <CardDescription>Support families in Johnson County</CardDescription>
            </CardHeader>
            <CardContent className="text-sm">
              Solar reduces lifetime carbon emissions and lowers energy bills for Iowa Valley Habitat for Humanity
              homeowners.
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Steps */}
      <section className="mx-auto max-w-6xl px-4 py-10 md:py-14">
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h2 className="text-2xl md:text-3xl font-semibold">Offset your emissions in 4 steps</h2>
            <ol className="space-y-3 text-sm md:text-base">
              <li className="flex gap-3">
                <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-white text-xs font-medium">
                  1
                </span>
                <span>
                  Calculate your emissions using the ICAO Carbon Emissions Calculator:{" "}
                  <Link
                    className="underline underline-offset-4"
                    href="https://www.icao.int/environmental-protection/CarbonOffset"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    https://www.icao.int/environmental-protection/CarbonOffset
                  </Link>
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-white text-xs font-medium">
                  2
                </span>
                <span>Make sure the result is in kilograms (kg).</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-white text-xs font-medium">
                  3
                </span>
                <span>Multiply by $0.22 per kilogram to get your donation amount.</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-white text-xs font-medium">
                  4
                </span>
                <span>
                  Go to{" "}
                  <Link
                    className="underline underline-offset-4"
                    href="https://www.iowavalleyhabitat.org/donate.html"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    iowavalleyhabitat.org
                  </Link>
                  , click “Donate,” and in the comments designate “For Solar Projects.”
                </span>
              </li>
            </ol>
            <p className="text-xs text-muted-foreground">
              Tip: If your calculator gives pounds (lb), convert to kilograms by dividing by 2.2046.
            </p>
          </div>

          {/* Calculator */}
          <div id="calculator" className="scroll-mt-24">
            <DonationCalculator />
          </div>
        </div>
      </section>

      <footer className="border-t">
        <div className="mx-auto max-w-6xl px-4 py-10 text-sm text-muted-foreground">
          Thank you for supporting clean energy and local families in Johnson County.
        </div>
      </footer>
    </main>
  )
}
