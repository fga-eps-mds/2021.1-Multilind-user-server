/*
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

module.exports = {
  transform: {
    "^.+\\.js?$": "babel-jest",
  },
  preset: "@shelf/jest-mongodb",
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  coveragePathIgnorePatterns: ["/node_modules/"],
  coverageProvider: "v8",
  coverageReporters: ["json", "text", "lcov", "clover"],
  reporters: [
    "default",
    [
      "jest-sonar",
      {
        outputDirectory: "coverage",
        outputName: "test-report.xml",
        reportedFilePath: "relative",
      },
    ],
  ],

  testMatch: ["**/tests/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[tj]s?(x)"],
};
