import type { APIRoute } from "astro";
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

export const prerender = false;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const promoPath = resolve(__dirname, "../../../data/promo.json");

export const POST: APIRoute = async ({ request, cookies }) => {
  if (cookies.get("admin_auth")?.value !== "1") {
    return new Response(
      JSON.stringify({ success: false, error: "Unauthorized" }),
      { status: 401, headers: { "Content-Type": "application/json" } },
    );
  }
  try {
    const body = await request.json();

    if (!body.countdownTarget || typeof body.countdownTarget !== "string") {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Missing or invalid countdownTarget",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    // Validate ISO date format
    if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/.test(body.countdownTarget)) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "countdownTarget must be ISO format (YYYY-MM-DDTHH:mm:ss)",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const formatted = {
      countdownTarget: body.countdownTarget,
    };

    writeFileSync(promoPath, JSON.stringify(formatted, null, 2) + "\n", "utf-8");

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
