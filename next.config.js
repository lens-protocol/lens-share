/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  async redirects() {
    return [
      {
        source: "/p/:id",
        has: [
          {
            type: "query",
            key: "by",
            value: "lenster",
          },
        ],
        destination: "/p/:id?by=Hey",
        permanent: false,
      },
      {
        source: "/u/:handle",
        has: [
          {
            type: "query",
            key: "by",
            value: "lenster",
          },
        ],
        destination: "/u/:handle?by=Hey",
        permanent: false,
      },
      {
        source: "/p/:id",
        has: [
          {
            type: "query",
            key: "by",
            value: "lenstube",
          },
        ],
        destination: "/p/:id?by=tape",
        permanent: false,
      },
      {
        source: "/u/:handle",
        has: [
          {
            type: "query",
            key: "by",
            value: "lenstube",
          },
        ],
        destination: "/u/:handle?by=tape",
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
