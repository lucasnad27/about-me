module.exports = {
  siteMetadata: {
    title: `Lucas Culbertson`,
    description: `A place for pontification, prose, and projects`,
    author: `@lucasnad27`,
    siteUrl: `https://electricocean.io`,
  },
  plugins: [
    `gatsby-plugin-typescript`, 
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-image`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/assets/images`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `content`,
        path: `${__dirname}/src/data`
      }
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `ElectricOcean`,
        short_name: `electric-ocean`,
        start_url: `/`,
        background_color: `#ed64a6`,
        theme_color: `#ed64a6`,
        display: `minimal-ui`,
        icon: `src/assets/images/profile.jpg`, // This path is relative to the root of the site.
      },
    },
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-prismjs`,
            options: {
              showLineNumbers: false,
            }
          },
          {
            resolve: 'gatsby-remark-images',
            options: {
              maxWidth: 768,
              linkImagesToOriginal: false
            }
          },
          {
            resolve: `gatsby-remark-copy-linked-files`,
            options: {
              ignoreFileExtensions: [`png`, `jpg`, `jpeg`, `bmp`, `tiff`],
            },
          },
        ]
      }
    },
    {
      resolve: `gatsby-plugin-posthog`,
      options: {
        apiKey: "phc_zJIUZqVc6NQDVZQsgHdI5CEH8UzvtCqTsI4JJjJYh2I",
      },
    },
    `gatsby-plugin-postcss`,
    `gatsby-plugin-offline`,
    `gatsby-plugin-styled-components`,
  ],
}
