module.exports = {
  client: {
    service: {
      name: "Pretaa-Staging-ap21v",
      url: process.env.REACT_APP_PRETAA_API_URL ? process.env.REACT_APP_PRETAA_API_URL : "https://pretaa-staging-new.x-studio.io/graphql",
      includes: ["src/**/*.ts", "src/**/*.tsx"]
    },
  },
};
