import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // Verify the calling user is a pro
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data: { user: callingUser }, error: userError } = await supabaseAdmin.auth.getUser(token);

    if (userError || !callingUser) {
      throw new Error("Non autorisé");
    }

    // Check if calling user has 'pro' role
    const { data: roleData } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", callingUser.id)
      .single();

    if (roleData?.role !== "pro") {
      throw new Error("Seuls les promoteurs peuvent créer des clients");
    }

    const { name, email, phone, password } = await req.json();

    // Check if email already exists in clients table
    const { data: existingClient } = await supabaseAdmin
      .from("clients")
      .select("email")
      .eq("email", email)
      .maybeSingle();

    if (existingClient) {
      throw new Error("Un client avec cet email existe déjà");
    }

    // Create auth user using Admin API (doesn't affect current session)
    const { data: newUser, error: signUpError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: name,
      },
    });

    if (signUpError) {
      if (signUpError.message.includes("already registered")) {
        throw new Error("Un compte avec cet email existe déjà");
      }
      throw signUpError;
    }

    if (!newUser.user) {
      throw new Error("Erreur lors de la création du compte");
    }

    // The trigger will create the profile and role automatically
    // Now create the client record
    const { error: clientError } = await supabaseAdmin
      .from("clients")
      .insert({
        name,
        email,
        phone,
        owner_id: callingUser.id,
        status: "Actif",
      });

    if (clientError) throw clientError;

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Client créé avec succès",
        email,
        password 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});