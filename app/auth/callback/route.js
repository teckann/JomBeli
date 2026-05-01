import { NextResponse } from "next/server";
import { createClient } from "@/app/_lib/server";
import { getUser } from "@/app/_lib/auth";
import { getUserInfo, initializeNewUser } from "@/app/_lib/data-services";

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createClient();

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const user = await getUser();
      // let role = "buyer";
      let next = searchParams.get("next") ?? "/";

      // initialize new user & retrieve the role
      if (user) {
        await initializeNewUser(user.id, user.user_metadata.full_name);

        const userInfo = await getUserInfo(user.id);
        if (userInfo) role = userInfo.role;
      }

      // switch (role) {
      //   case "buyer":
      //     next = "/";
      //     break;
      //   case "seller":
      //     next = "products";
      //     break;
      //   default:
      //     next = "/";
      //     break;
      // }

      const redirectTo = new URL(next, origin);
      return NextResponse.redirect(redirectTo);
    }
  }

  return NextResponse.redirect(`${origin}/signin`);
}
