import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Default is 1MB, too small for avatar/resume uploads through the
      // profile form's server action. Sized to fit both files in one
      // submit: up to 5MB avatar + up to 10MB resume.
      bodySizeLimit: "16mb",
    },
  },
};

export default nextConfig;
