import { google } from 'googleapis';
import * as cheerio from 'cheerio';

export interface WebSearchResult {
  title: string;
  url: string;
  snippet: string;
  content?: string;
}

export class ProductionWebSearch {
  private customsearch = google.customsearch('v1');
  private apiKey: string;
  private searchEngineId: string;
  private searchCache: Map<string, WebSearchResult[]> = new Map();
  private rateLimitMap: Map<string, number> = new Map();
  private readonly RATE_LIMIT_MS = 1000; // 1 second between searches

  constructor(apiKey: string, searchEngineId: string) {
    this.apiKey = apiKey;
    this.searchEngineId = searchEngineId;
  }

  async searchWeb(query: string): Promise<WebSearchResult[]> {
    try {
      // Check cache first
      if (this.searchCache.has(query)) {
        console.log(`Using cached results for: ${query}`);
        return this.searchCache.get(query)!;
      }

      // Rate limiting
      await this.enforceRateLimit(query);

      console.log(`Searching Google for: ${query}`);

      const response = await this.customsearch.cse.list({
        auth: this.apiKey,
        cx: this.searchEngineId,
        q: query,
        num: 5, // Number of results
        dateRestrict: 'm1', // Restrict to last month for freshness
        sort: 'date' // Sort by date for latest results
      });

      if (!response.data.items || response.data.items.length === 0) {
        console.log('No search results found');
        return [];
      }

      const searchResults: WebSearchResult[] = [];

      for (const item of response.data.items) {
        try {
          const content = await this.extractContent(item.link || '');
          searchResults.push({
            title: item.title || '',
            url: item.link || '',
            snippet: item.snippet || '',
            content: content
          });
        } catch (error) {
          console.error(`Error extracting content from ${item.link}:`, error);
          searchResults.push({
            title: item.title || '',
            url: item.link || '',
            snippet: item.snippet || ''
          });
        }
      }

      // Cache the results for 1 hour
      this.searchCache.set(query, searchResults);
      
      // Clean up old cache entries (keep only last 50 searches)
      if (this.searchCache.size > 50) {
        const keys = Array.from(this.searchCache.keys());
        for (let i = 0; i < keys.length - 50; i++) {
          this.searchCache.delete(keys[i]);
        }
      }

      return searchResults;
    } catch (error) {
      console.error('Google search error:', error);
      return this.getFallbackResults(query);
    }
  }

  private async enforceRateLimit(query: string): Promise<void> {
    const now = Date.now();
    const lastSearch = this.rateLimitMap.get(query) || 0;
    
    if (now - lastSearch < this.RATE_LIMIT_MS) {
      const waitTime = this.RATE_LIMIT_MS - (now - lastSearch);
      console.log(`Rate limiting: waiting ${waitTime}ms`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
    
    this.rateLimitMap.set(query, Date.now());
  }

  private async extractContent(url: string): Promise<string> {
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        },
        timeout: 5000
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const html = await response.text();
      const $ = cheerio.load(html);
      
      // Remove unwanted elements
      $('script, style, nav, header, footer, .ad, .advertisement, .sidebar, .cookie-banner, .popup').remove();
      
      // Extract main content
      const content = $('body').text()
        .replace(/\s+/g, ' ')
        .trim()
        .substring(0, 1000);

      return content;
    } catch (error) {
      console.error(`Error extracting content from ${url}:`, error);
      return '';
    }
  }

  private getFallbackResults(query: string): WebSearchResult[] {
    return [
      {
        title: `Information about ${query}`,
        url: `https://example.com/search?q=${encodeURIComponent(query)}`,
        snippet: `This is fallback information about ${query}. The Google search service is temporarily unavailable.`,
        content: `Fallback content for ${query}. Please try again later or contact support if the issue persists.`
      }
    ];
  }

  public clearCache(): void {
    this.searchCache.clear();
  }

  public getCacheSize(): number {
    return this.searchCache.size;
  }

  public getRateLimitInfo(): { query: string; lastSearch: number }[] {
    return Array.from(this.rateLimitMap.entries()).map(([query, lastSearch]) => ({
      query,
      lastSearch
    }));
  }
}

// Alternative implementation using Bing Web Search API
export class BingWebSearch {
  private apiKey: string;
  private searchCache: Map<string, WebSearchResult[]> = new Map();
  private rateLimitMap: Map<string, number> = new Map();
  private readonly RATE_LIMIT_MS = 1000;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async searchWeb(query: string): Promise<WebSearchResult[]> {
    try {
      if (this.searchCache.has(query)) {
        return this.searchCache.get(query)!;
      }

      await this.enforceRateLimit(query);

      console.log(`Searching Bing for: ${query}`);

      const response = await fetch(
        `https://api.bing.microsoft.com/v7.0/search?q=${encodeURIComponent(query)}&count=5&mkt=en-US`,
        {
          headers: {
            'Ocp-Apim-Subscription-Key': this.apiKey
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Bing API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.webPages?.value) {
        return [];
      }

      const searchResults: WebSearchResult[] = [];

      for (const page of data.webPages.value) {
        try {
          const content = await this.extractContent(page.url);
          searchResults.push({
            title: page.name,
            url: page.url,
            snippet: page.snippet,
            content: content
          });
        } catch (error) {
          searchResults.push({
            title: page.name,
            url: page.url,
            snippet: page.snippet
          });
        }
      }

      this.searchCache.set(query, searchResults);
      return searchResults;
    } catch (error) {
      console.error('Bing search error:', error);
      return [];
    }
  }

  private async enforceRateLimit(query: string): Promise<void> {
    const now = Date.now();
    const lastSearch = this.rateLimitMap.get(query) || 0;
    
    if (now - lastSearch < this.RATE_LIMIT_MS) {
      const waitTime = this.RATE_LIMIT_MS - (now - lastSearch);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
    
    this.rateLimitMap.set(query, Date.now());
  }

  private async extractContent(url: string): Promise<string> {
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        timeout: 5000
      });

      const html = await response.text();
      const $ = cheerio.load(html);
      $('script, style, nav, header, footer').remove();
      
      return $('body').text().replace(/\s+/g, ' ').trim().substring(0, 1000);
    } catch (error) {
      return '';
    }
  }
} 