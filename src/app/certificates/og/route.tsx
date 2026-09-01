import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const name = (searchParams.get("name") || "Graduate").slice(0, 48);
  const course = (searchParams.get("course") || "Doyintech Academy Course").slice(0, 64);
  const id = (searchParams.get("id") || "").slice(0, 32);
  const score = searchParams.get("score") || "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(135deg, #0b1220 0%, #1e3a5f 55%, #0b1220 100%)",
          color: "#f8fafc",
          padding: "48px 56px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 28,
              background: "linear-gradient(135deg, #FB923C, #EA580C)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: 28,
              fontWeight: 700,
            }}
          >
            A
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 18, opacity: 0.85 }}>Doyintech Academy</span>
            <span style={{ fontSize: 14, opacity: 0.6 }}>Verified certificate</span>
          </div>
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ fontSize: 22, opacity: 0.7, marginBottom: 8 }}>Awarded to</div>
          <div style={{ fontSize: 52, fontWeight: 700, lineHeight: 1.1 }}>{name}</div>
          <div style={{ fontSize: 28, marginTop: 20, color: "#FB923C", fontWeight: 600 }}>{course}</div>
          {score ? (
            <div style={{ fontSize: 20, marginTop: 12, opacity: 0.8 }}>Score: {score}%</div>
          ) : null}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid rgba(255,255,255,0.15)",
            paddingTop: 20,
            fontSize: 16,
            opacity: 0.75,
          }}
        >
          <span>{id ? `ID ${id}` : "doyintechacademy.vercel.app"}</span>
          <span>Learn · Ship · Certify</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
