/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_PUBLIC_URL,
  generateRobotsTxt: true,
  exclude: ["/server-sitemap.xml", "/moderation"],
  robotsTxtOptions: {
    policies: [
      { userAgent: "*", allow: "/" },
      { userAgent: "*", disallow: "/cdn-cgi/" },
      { userAgent: "*", disallow: "api.moto-zloty.pl" },
    ],
    additionalSitemaps: [
      process.env.NEXT_PUBLIC_PUBLIC_URL + "/server-sitemap.xml",
    ],
  },
};
