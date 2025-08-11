
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
    const { phone, userType } = await req.json();

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Try to get Twilio credentials with different naming patterns
    let accountSid = Deno.env.get('TWILIO_ACCOUNT_SID') || Deno.env.get('Twilio Account SID');
    let authToken = Deno.env.get('TWILIO_AUTH_TOKEN') || Deno.env.get('Twilio Auth Token');
    let verifySid = Deno.env.get('TWILIO_VERIFY_SERVICE_SID') || Deno.env.get('Twilio Verify Service SID');

    console.log('Environment check:', {
      accountSid: accountSid ? 'Found' : 'Missing',
      authToken: authToken ? 'Found' : 'Missing',
      verifySid: verifySid ? 'Found' : 'Missing'
    });

    if (!accountSid || !authToken || !verifySid) {
      console.error('Missing Twilio credentials:', {
        accountSid: !!accountSid,
        authToken: !!authToken,
        verifySid: !!verifySid
      });
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

    console.log(`Sending OTP to ${normalizedPhone} for ${userType}`);

    // Send OTP using Twilio Verify API
    const twilioUrl = `https://verify.twilio.com/v2/Services/${verifySid}/Verifications`;
    
    const response = await fetch(twilioUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`${accountSid}:${authToken}`)}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        'To': normalizedPhone,
        'Channel': 'sms'
      }),
    });

    const twilioData = await response.json();
    
    if (!response.ok) {
      console.error('Twilio error:', twilioData);
      return new Response(
        JSON.stringify({ error: 'Failed to send OTP. Please check your phone number.' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('OTP sent successfully:', twilioData.status);

    // Store OTP verification record in database (expires in 5 minutes)
    const { error: dbError } = await supabase
      .from('mobile_otp_verifications')
      .insert({
        phone: normalizedPhone,
        otp_code: 'TWILIO_MANAGED', // Twilio manages the actual OTP
        user_type: userType,
        expires_at: new Date(Date.now() + 5 * 60 * 1000).toISOString(), // 5 minutes
      });

    if (dbError) {
      console.error('Database error:', dbError);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'OTP sent successfully to your phone number'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in send-otp function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
