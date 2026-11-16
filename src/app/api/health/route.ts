import { NextResponse } from "next/server";

export interface HealthResponse {
  status: "success";
  application: string;
  message: string;
  version: string;
  timestamp?: string;
}

export async function GET(): Promise<NextResponse<HealthResponse>> {
  return NextResponse.json({
    status: "success",
    application: "REX AI",
    message: "REX AI backend is running",
    version: "0.1.0",
    timestamp: new Date().toISOString(),
  });
}

