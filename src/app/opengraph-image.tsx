import { ImageResponse } from "next/og";

export const alt = "Jivan — Medicine access for everyone";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          overflow: "hidden",
          background: "linear-gradient(135deg, #0b1020 0%, #17233e 54%, #0d2b34 100%)",
          color: "white",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: 500,
            height: 500,
            borderRadius: 999,
            right: -100,
            top: -170,
            background: "rgba(61,125,251,.22)",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 460,
            height: 460,
            borderRadius: 999,
            left: -140,
            bottom: -260,
            background: "rgba(18,185,140,.25)",
          }}
        />

        <div style={{ display: "flex", flexDirection: "column", padding: "72px 80px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div
              style={{
                width: 76,
                height: 76,
                borderRadius: 24,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(135deg, #6ee7c7, #12b98c)",
                color: "#08131b",
                fontSize: 42,
                fontWeight: 900,
              }}
            >
              J
            </div>
            <div style={{ fontSize: 42, fontWeight: 900, letterSpacing: -2 }}>Jivan</div>
          </div>

          <div style={{ marginTop: 74, maxWidth: 930, fontSize: 64, lineHeight: 1.05, fontWeight: 900, letterSpacing: -3 }}>
            Same molecule. A fraction of the price.
          </div>
          <div style={{ marginTop: 26, maxWidth: 850, fontSize: 25, lineHeight: 1.45, color: "#cbd6e8" }}>
            Compare medicine prices and discover lower-cost Indian same-salt alternatives with transparent sources.
          </div>

          <div style={{ marginTop: "auto", display: "flex", gap: 30, color: "#8ff0d3", fontSize: 20, fontWeight: 700 }}>
            <span>13,000+ catalog entries</span>
            <span>•</span>
            <span>Physician-first guidance</span>
            <span>•</span>
            <span>Free for everyone</span>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
