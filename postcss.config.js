module.exports = {
    plugins: [
      require("postcss-import")({
        plugins: [],
      }),
      require("tailwindcss")("./tailwind.config.js"),
    ],
  };
