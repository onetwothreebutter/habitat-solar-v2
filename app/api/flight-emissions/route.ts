import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { origin, destination } = await request.json()

    if (!origin || !destination) {
      return NextResponse.json(
        { error: "Origin and destination are required" },
        { status: 400 }
      )
    }

    const apiKey = process.env.GOOGLE_TRAVEL_IMPACT_API_KEY

    if (!apiKey) {
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
      )
    }

    const response = await fetch(
      `https://travelimpactmodel.googleapis.com/v1/flights:computeTypicalFlightEmissions?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          markets: [
            {
              origin: origin.toUpperCase(),
              destination: destination.toUpperCase(),
            },
          ],
        }),
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Google API error:", errorText)
      return NextResponse.json(
        { error: "Failed to fetch emissions data" },
        { status: response.status }
      )
    }

    const data = await response.json()
    
    const emissions = data.typicalFlightEmissions?.[0]?.emissionsGramsPerPax
    
    if (!emissions) {
      return NextResponse.json(
        { error: "No emissions data available for this route" },
        { status: 404 }
      )
    }

    // Convert grams to kg and use economy class emissions
    const kgCO2 = Math.round((emissions.economy || emissions.first || 0) / 1000)

    return NextResponse.json({
      origin: origin.toUpperCase(),
      destination: destination.toUpperCase(),
      kgCO2,
      modelVersion: data.modelVersion,
    })
  } catch (error) {
    console.error("Flight emissions error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
