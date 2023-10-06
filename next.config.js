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
            value: "Lenstube",
          },
        ],
        destination: "/p/:id?by=Tape",
        permanent: false,
      },
      {
        source: "/u/:handle",
        has: [
          {
            type: "query",
            key: "by",
            value: "Lenstube",
          },
        ],
        destination: "/u/:handle?by=Tape",
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
