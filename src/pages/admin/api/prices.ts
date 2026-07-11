import type { APIRoute } from "astro";
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

export const prerender = false;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const pricesPath = resolve(__dirname, "../../../data/prices.json");

export const POST: APIRoute = async ({ request, cookies }) => {
  if (cookies.get("admin_auth")?.value !== "1") {
    return new Response(
      JSON.stringify({ success: false, error: "Unauthorized" }),
      { status: 401, headers: { "Content-Type": "application/json" } },
    );
  }
  try {
    const body = await request.json();

    // Validate required fields and positive prices
    const required = [
      "threeMonths",
      "sixMonths",
      "oneYear",
      "originalPrice",
      "monthlyComparisonRate",
      "currency",
      "symbol",
    ];
    for (const field of required) {
      if (!(field in body)) {
        return new Response(
          JSON.stringify({ success: false, error: `Missing field: ${field}` }),
          { status: 400, headers: { "Content-Type": "application/json" } },
        );
      }
    }

    // All price fields must be positive numbers
    const priceFields = ["threeMonths", "sixMonths", "oneYear", "originalPrice", "monthlyComparisonRate"];
    for (const field of priceFields) {
      const val = parseFloat(body[field]);
      if (isNaN(val) || val <= 0) {
        return new Response(
          JSON.stringify({ success: false, error: `${field} must be a positive number` }),
          { status: 400, headers: { "Content-Type": "application/json" } },
        );
      }
    }

    // Ensure all price fields are strings with 2 decimal places
    const formatted = {
      threeMonths: parseFloat(body.threeMonths).toFixed(2),
      sixMonths: parseFloat(body.sixMonths).toFixed(2),
      oneYear: parseFloat(body.oneYear).toFixed(2),
      originalPrice: parseFloat(body.originalPrice).toFixed(2),
      monthlyComparisonRate: parseFloat(body.monthlyComparisonRate).toFixed(2),
      currency: body.currency,
      symbol: body.symbol,
    };

    writeFileSync(pricesPath, JSON.stringify(formatted) + "\n", "utf-8");

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(
      JSON.stringify({ success: false, error: String(e) }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }
};
