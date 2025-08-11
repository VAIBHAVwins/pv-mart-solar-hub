
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { phone, otp, userType } = await req.json();

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Try to get Twilio credentials with different naming patterns
    let accountSid = Deno.env.get('TWILIO_ACCOUNT_SID') || Deno.env.get('Twilio Account SID');
    let authToken = Deno.env.get('TWILIO_AUTH_TOKEN') || Deno.env.get('Twilio Auth Token');
    let verifySid = Deno.env.get('TWILIO_VERIFY_SERVICE_SID') || Deno.env.get('Twilio Verify Service SID');

    if (!accountSid || !authToken || !verifySid) {
      console.error('Missing Twilio credentials');
      return new Response(
        JSON.stringify({ error: 'SMS service not configured' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Normalize phone number
    const normalizedPhone = phone.startsWith('+91') ? phone : `+91${phone.replace(/\D/g, '')}`;

    console.log(`Verifying OTP for ${normalizedPhone} with code ${otp}`);

    // Verify OTP using Twilio Verify API
    const twilioUrl = `https://verify.twilio.com/v2/Services/${verifySid}/VerificationCheck`;
    
    const response = await fetch(twilioUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`${accountSid}:${authToken}`)}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        'To': normalizedPhone,
        'Code': otp
      }),
    });

    const twilioData = await response.json();
    
    if (!response.ok || twilioData.status !== 'approved') {
      console.error('Twilio verification failed:', twilioData);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Invalid or expired OTP. Please try again.' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('OTP verified successfully');

    // Mark OTP as used in database
    const { error: dbError } = await supabase
      .from('mobile_otp_verifications')
      .update({ is_used: true })
      .eq('phone', normalizedPhone)
      .eq('user_type', userType)
      .eq('is_used', false);

    if (dbError) {
      console.error('Database error:', dbError);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'OTP verified successfully' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in verify-otp function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
