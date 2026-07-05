import React from 'react';
import { cookies } from 'next/headers';
import NavBar from '../_components/SellerNavBar/SellerNavBar';

export default async function Seller({ children }) {
  let avatarUrl = null;

  try {
    const cookieStore = await cookies();
    const supabaseRef = 'tqccjjrjlqfppgsotszz'; 
    const supabaseAuthCookie = cookieStore.get(`sb-${supabaseRef}-auth-token`); 
    
    if (supabaseAuthCookie) {
      let rawValue = supabaseAuthCookie.value;
      if (rawValue.startsWith('base64-')) {
        rawValue = Buffer.from(rawValue.replace('base64-', ''), 'base64').toString('utf-8');
      }
      
      const sessionData = JSON.parse(rawValue);
      const userId = sessionData?.user?.id;

      if (userId) {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || `https://${supabaseRef}.supabase.co`;
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!supabaseAnonKey) {
          console.warn("Warning: NEXT_PUBLIC_SUPABASE_ANON_KEY is missing in environment variables.");
        }

        const res = await fetch(
          `${supabaseUrl}/rest/v1/USERS_T?user_id=eq.${userId}&select=avatar`,
          {
            headers: {
              'apikey': supabaseAnonKey,
              'Authorization': `Bearer ${supabaseAnonKey}`
            }
          }
        );
        
        if (res.ok) {
          const data = await res.json();
          avatarUrl = data?.[0]?.avatar || null;
        }
      }
    }
  } catch (error) {
    console.error("Failed to fetch user avatar via server:", error);
  }

  return (
    <main>
      <NavBar userAvatar={avatarUrl} />
      {children}
    </main>
  );
}