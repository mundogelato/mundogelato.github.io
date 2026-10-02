import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface IgMedia {
  id: string;
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  media_url: string;
  thumbnail_url?: string;
  permalink: string;
  caption?: string;
  timestamp: string;
}

interface FeedPost {
  id: string;
  type: "image" | "video" | "carousel";
  image: string;
  permalink: string;
  caption: string;
  timestamp: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const { data: tokenRow, error: tokenError } = await supabase
      .from("instagram_config")
      .select("value")
      .eq("key", "access_token")
      .maybeSingle();

    if (tokenError) throw new Error("No se pudo leer la configuración de Instagram");
    if (!tokenRow?.value) {
      return new Response(
        JSON.stringify({ configured: false, posts: [] }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const accessToken = tokenRow.value as string;

    const { data: idRow } = await supabase
      .from("instagram_config")
      .select("value")
      .eq("key", "ig_user_id")
      .maybeSingle();

    if (!idRow?.value) {
      return new Response(
        JSON.stringify({ configured: false, posts: [] }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const igUserId = idRow.value as string;

    // Query the Instagram Graph API for the 8 most recent media posts
    const fields = "media_type,media_url,thumbnail_url,permalink,caption,timestamp";
    const apiUrl = `https://graph.facebook.com/v21.0/${igUserId}/media?fields=${fields}&limit=8&access_token=${accessToken}`;

    const response = await fetch(apiUrl);
    if (!response.ok) {
      const errorBody = await response.text();
      console.error("Instagram API error:", response.status, errorBody);
      return new Response(
        JSON.stringify({ configured: true, posts: [], error: "instagram_api_error" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const mediaItems: IgMedia[] = data.data ?? [];

    const posts: FeedPost[] = mediaItems.map((item) => {
      const type =
        item.media_type === "VIDEO" ? "video" :
        item.media_type === "CAROUSEL_ALBUM" ? "carousel" : "image";
      return {
        id: item.id,
        type: type as FeedPost["type"],
        image: item.thumbnail_url || item.media_url,
        permalink: item.permalink,
        caption: (item.caption ?? "").slice(0, 140),
        timestamp: item.timestamp,
      };
    });

    return new Response(
      JSON.stringify({ configured: true, posts }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Edge function error:", err);
    return new Response(
      JSON.stringify({ configured: false, posts: [], error: "internal_error" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
