import { supabase } from "@/integrations/supabase/client";

export const sendPasswordResetEmail = async (email: string) => {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/profile?reset=true`,
  });
  
  if (error) throw error;
  
  // Send confirmation email using our edge function
  await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-email`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify({
      to: [email],
      subject: "Password Reset Requested",
      html: `
        <h2>Password Reset Requested</h2>
        <p>A password reset has been requested for your account. Check your email for instructions from Supabase to complete the reset process.</p>
        <p>If you didn't request this change, please contact support immediately.</p>
      `,
    }),
  });
};

export const updatePassword = async (newPassword: string) => {
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) throw error;
};