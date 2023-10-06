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
        source: "/watch/:id",
        has: [
          {
            type: "query",
            key: "by",
            value: "lenstube",
          },
        ],
        destination: "/watch/:id?by=Tape",
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
        destination: "/channel/:handle?by=Tape",
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
