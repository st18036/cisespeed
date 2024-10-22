/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/Admin',  // Clean URL for Admin
        destination: '/Admin/page',  // Actual file path
      },
      {
        source: '/Analyst',  // Clean URL for Analyst
        destination: '/Analyst/analyst',  // Actual file path
      },
      {
        source: '/Login',  // Clean URL for Login
        destination: '/Login/page',  // Actual file path
      },
      {
        source: '/moderator',  // Clean URL for Moderator
        destination: '/moderator/moderator',  // Actual file path
      },
      {
        source: '/articles',  // Clean URL for articles index
        destination: '/articles/index',  // Actual file path
      },
      {
        source: '/articles/new',  // Clean URL for new article page
        destination: '/articles/new',  // Actual file path
      },
    ];
  },
};

export default nextConfig;
