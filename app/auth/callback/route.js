import { NextResponse } from "next/server";
import { createClient } from "@/app/_lib/server";
import { getUser } from "@/app/_lib/auth";
import { getUserInfo, initializeNewUser } from "@/app/_lib/data-services";

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  let next = "/signin";

  if (code) {
    try {
      const supabase = await createClient();

      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (!error) {
        const user = await getUser();

        if (user) {
          await initializeNewUser(user.id, user.user_metadata.full_name);

          const userInfo = await getUserInfo(user.id);

          if (userInfo) {
            const { user_status, role } = userInfo;

            const isSuspend = user_status !== "Active";

            if (!isSuspend) {
              if (role === "Admin") {
                next = "/admin";
              } else if (role === "Courier") {
                next = "/courier";
              } else if (role === "Seller") {
                next = "/seller";
              } else if (role === "Buyer") {
                next = "/buyer";
              } else {
                next = searchParams.get("next") ?? "/";
              }
            } else {
              await supabase.auth.signOut();
              next = "/signin";
            }
          }
        }
      }
    } catch (err) {
      console.error("Auth callback unexpected error:", err);
      next = "/signin";
    }
  }

  const redirectTo = new URL(next, origin);
  return NextResponse.redirect(redirectTo);
}
