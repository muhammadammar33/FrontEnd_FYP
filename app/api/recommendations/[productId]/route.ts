import { NextRequest, NextResponse } from "next/server";
import { env } from "process";

const RECOMMENDATION_SERVER = env.RECOMMENDATION_SERVER || "http://localhost:3002/recommendations";

export async function GET(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
  try {
    const response = await fetch(
      `${RECOMMENDATION_SERVER}/product/${params.productId}`
    );
    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Recommendation API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch recommendations" },
      { status: 500 }
    );
  }
}
