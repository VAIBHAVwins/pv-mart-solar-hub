
import { serve } from "https://deno.land/std@0.200.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabaseService = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false }
    });

    const authHeader = req.headers.get('authorization')!;
    const token = authHeader.replace('Bearer ', '');
    
    // Verify caller's token
    const { data: callerUser, error: getUserErr } = await supabaseService.auth.getUser(token);
    if (getUserErr || !callerUser?.user) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), { 
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Check if caller is admin
    const { data: adminCheck } = await supabaseService
      .from('admin_users')
      .select('email,is_active')
      .eq('email', callerUser.user.email)
      .eq('is_active', true)
      .single();

    if (!adminCheck) {
      return new Response(JSON.stringify({ error: 'Forbidden: not an admin' }), { 
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const { email } = await req.json();
    
    if (!email) {
      return new Response(JSON.stringify({ error: 'email required' }), { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Deactivate admin
    const { error: updateErr } = await supabaseService
      .from('admin_users')
      .update({ is_active: false })
      .eq('email', email);

    if (updateErr) {
      return new Response(JSON.stringify({ error: updateErr.message }), { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Admin access revoked successfully' 
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (err) {
    console.error('Error:', err);
    return new Response(JSON.stringify({ 
      error: (err as Error).message || 'Internal server error' 
    }), { 
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
