import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

export async function middleware(request) {
  // console.log("request", request);

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });
  // console.log("response", response);

  // supabase will auto handle token session in cookies
  // 1. read the token session from cookies  --> check the token session exist or not
  // 2. reset (refresh) the token session in cookies  --> always keep token session fresh
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      // assign the behavior to supabase about the cookies, so that it can auto handle
      cookies: {
        // tell supabase how to get cookies
        getAll: () => request.cookies.getAll(),

        // tell supabase how to reset cookies
        // only will be trigger when successful login
        setAll: (cookiesToSet) => {
          // token session that created by auth.js in cookies
          // console.log(cookiesToSet);

          // reset the cookies again in request
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value),
          );

          // get the cookies request that reset just now
          response = NextResponse.next({ request });

          // reset the cookies in response
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const url = request.nextUrl.clone();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // not logged in
  if (!user) {
    url.pathname = "/signin";
    return NextResponse.redirect(url);
  }

  // auth user
  const { data, error } = await supabase
    .from("USERS_T")
    .select("role")
    .eq("user_id", user.id)
    .single();

  const role = data?.role;

  // redirect logic
  if (url.pathname === "/") {
    if (role === "Admin" || role === "Super Admin") {
      url.pathname = "/admin";
      return NextResponse.redirect(url);
    }

    if (role === "Courier") {
      url.pathname = "/courier";
      return NextResponse.redirect(url);
    }

    if (role === "Seller") {
      url.pathname = "/seller";
      return NextResponse.redirect(url);
    }

    if (role === "Buyer") {
      url.pathname = "/buyer";
      return NextResponse.redirect(url);
    }
  }

  return response;
}

// protected route
export const config = {
  matcher: [
    "/",
    "/buyer/:path*",
    "/seller/:path*",
    "/admin/:path*",
    "/courier/:path*",
  ],
};
