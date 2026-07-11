import type { APIRoute } from "astro";

export const prerender = false;

const VALID_USERNAME = "amine";
const VALID_PASSWORD = "admin";

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const body = await request.json();

    const { username, password } = body;

    if (!username || !password) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing username or password" }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    if (username !== VALID_USERNAME || password !== VALID_PASSWORD) {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid credentials" }),
        { status: 401, headers: { "Content-Type": "application/json" } },
      );
    }

    // Set an auth cookie (valid for 24 hours)
    cookies.set("admin_auth", "1", {
      path: "/admin",
      httpOnly: true,
      sameSite: "strict",
      maxAge: 60 * 60 * 24, // 24 hours
    });

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
