import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: "./",
});

// Add any custom config to be passed to Jest
/** @type {import('jest').Config} */
const config = {
  // Add more setup options before each test is run
  setupFilesAfterEnv: ["<rootDir>/jest.setup.mjs"],

  testEnvironment: "jest-environment-jsdom",

  moduleNameMapper: {
    // 🧑🏻‍🔧 resolve react module with the next.js inset one.
    // see https://github.com/vercel/next.js/discussions/49304#discussioncomment-6108618
    react: "next/dist/compiled/react/cjs/react.development.js",
    "^@/(.*)$": "<rootDir>/src/$1",
  },
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config);
