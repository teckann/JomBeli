/** @type {import('next').NextConfig} */
const nextConfig = {
  qualities: [80, 100],
  // should be configure when we try to fetch image and render in webpage
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "tqccjjrjlqfppgsotszz.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/avatars/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },

  // is for build the "out" folder for Static Side Generation (SSG)
  // should make sure all the page is static or SSG (NOT dynamic)
  // then command out the code below, and run "npm run build", the "out" folder will auto generate
  // ? this "out" folder is used to deploy in any platform that only support static, such as github
  // * when the output: "export" exist in this file, "npm run dev" cannot work anymore
  // * we only command out it if we want to export, else keep it as command

  // output: "export",
};

export default nextConfig;
