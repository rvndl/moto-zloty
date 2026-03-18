import * as cheerio from "cheerio";

const BASE_URL = "https://mototour.pl";
const ITEMS_PER_PAGE = 9;

interface ScrapeResult {
  url: string;
  title: string;
  imageUrl?: string | null;
  place?: string;
  description?: string;
}

interface ScraperConfig {
  url: string;
  excludeUrls?: string[];
}

export class Scraper {
  private readonly config: ScraperConfig;

  constructor(config: ScraperConfig) {
    this.config = {
      ...config,
      url: this.toAbsoluteUrl(config.url),
    };
  }

  async scrape() {
    const firstPage = await this.fetchPage();
    const totalPages = this.getTotalPages(firstPage);

    console.log("scrapper: total pages:", totalPages);

    const totalUrls: string[] = [];
    const firstPageUrls = this.getPageUrls(firstPage);

    console.log("scrapper: 1 page urls:", `+${firstPageUrls.length} urls`);

    totalUrls.push(...firstPageUrls);

    for (let i = 1; i < totalPages; i++) {
      const pageData = await this.fetchPage(i);
      const pageUrls = this.getPageUrls(pageData);

      console.log(`scrapper: ${i + 1} page urls:`, `+${pageUrls.length} urls`);

      totalUrls.push(...pageUrls);
    }

    console.log("scrapper: total urls:", totalUrls.length);

    const results: ScrapeResult[] = [];

    for (const url of totalUrls) {
      try {
        const result = await this.scrapePage(url);
        results.push(result);
        console.log("scrapper: scraped:", url);
      } catch (error) {
        console.error("scrapper: error scraping:", url, error);
      }
    }

    return results;
  }

  private async scrapePage(url: string): Promise<ScrapeResult> {
    const $ = await this.fetchDocument(url);

    const title = $('h2[itemprop="name"]').text().trim();
    const imageUrl = $("div > img").attr("src");
    const fullImageUrl = imageUrl ? this.toAbsoluteUrl(imageUrl) : null;
    const place = $("div#miejsce > p").text().trim();
    const description = this.extractDescription($);

    return {
      url,
      title,
      imageUrl: fullImageUrl,
      place,
      description,
    };
  }

  private extractDescription(pageData: cheerio.CheerioAPI): string {
    const paragraphs = pageData(
      'div[itemprop="body"] > p, div[itemprop="articleBody"] > p',
    )
      .map((_, el) => pageData(el).text().trim())
      .get()
      .filter((paragraph) => Boolean(paragraph));

    return paragraphs.join("\n");
  }

  private getPageUrls(pageData: cheerio.CheerioAPI) {
    const urls: string[] = [];

    pageData("h2 > a").each((_, element) => {
      const url = pageData(element).attr("href");

      if (url) {
        const fullUrl = this.toAbsoluteUrl(url);
        if (this.config.excludeUrls?.includes(fullUrl)) {
          return;
        }

        urls.push(fullUrl);
      }
    });

    return urls;
  }

  private getTotalPages(pageData: cheerio.CheerioAPI) {
    const paginationText = pageData(".pagination-wrapper .counter").text();
    const match = paginationText.match(/Strona \d+ z (\d+)/);

    if (match && match[1]) {
      return parseInt(match[1], 10);
    }

    return 1;
  }

  private async fetchPage(page?: number) {
    const pageUrl = page
      ? `${this.config.url}?start=${page * ITEMS_PER_PAGE}`
      : this.config.url;

    return this.fetchDocument(pageUrl);
  }

  private async fetchDocument(url: string): Promise<cheerio.CheerioAPI> {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch ${url}: ${response.status} ${response.statusText}`,
      );
    }

    const html = await response.text();
    return cheerio.load(html);
  }

  private toAbsoluteUrl(url: string): string {
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }

    return `${BASE_URL}${url.startsWith("/") ? "" : "/"}${url}`;
  }
}
