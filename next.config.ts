import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // The Cloudflare binding exists on Sites. Vercel uses the email delivery
  // path in the contact route and never accesses this stub.
  webpack(config, { webpack }) {
    config.plugins.push(new webpack.NormalModuleReplacementPlugin(
      /^cloudflare:workers$/,
      path.resolve(process.cwd(), "lib/vercel-worker-env.ts"),
    ));
    return config;
  },
};

export default nextConfig;
