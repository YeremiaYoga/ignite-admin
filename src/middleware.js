import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export function middleware() {
  return NextResponse.next();
}
