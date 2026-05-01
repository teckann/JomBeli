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

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const url = request.nextUrl.clone();
    url.pathname = "/signin";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ["/"],
};
