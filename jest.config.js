require("dotenv").config({ path: ".env.development" });

const nextJest = require("next/jest");
const createJestConfig = nextJest();

const jestConfig = createJestConfig({
  moduleDirectories: ["node_modules", "<rootDir>"],
  testTimeout: 60000,
});

module.exports = jestConfig;
