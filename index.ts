// Backend API for 60-Day Breakup Recovery App

// Dummy data store (replace with real database later)
let users = new Map();

// API Handler
export async function handler(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname;

  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get user progress
    if (path === "/api/progress" && request.method === "GET") {
      const userId = url.searchParams.get("userId") || "demo";
      
      const progress = users.get(userId) || {
        currentDay: 1,
        physicalStreak: 0,
        breathingStreak: 0,
        mentalStreak: 0,
        socialWeek: 0,
      };

      return new Response(JSON.stringify(progress), {
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Log daily check-in
    if (path === "/api/checkin" && request.method === "POST") {
      const { userId, physical, breathing, mental, social } = await request.json();
      
      // Get or create user
      let user = users.get(userId) || {
        currentDay: 1,
        physicalStreak: 0,
        breathingStreak: 0,
        mentalStreak: 0,
        socialWeek: 0,
      };

      // Update streaks
      if (physical.done) user.physicalStreak += 1;
      else user.physicalStreak = 0;

      if (breathing.done) user.breathingStreak += 1;
      else user.breathingStreak = 0;

      if (mental.done) user.mentalStreak += 1;
      else user.mentalStreak = 0;

      if (social.done) user.socialWeek += 1;

      user.currentDay += 1;

      users.set(userId, user);

      return new Response(JSON.stringify({ success: true, user }), {
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    return new Response("API is running!", {
      headers: { "Content-Type": "text/plain", ...corsHeaders },
    });

  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
}
