/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",

  // THIS IS THE IMPORTANT PART — tell ts-jest to handle TSX
  transform: {
    "^.+\\.(ts|tsx)$": ["ts-jest", { tsconfig: "tsconfig.json" }],
  },

  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },

  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testMatch: ["**/__tests__/**/*.(test|spec).(ts|tsx)"],
};
