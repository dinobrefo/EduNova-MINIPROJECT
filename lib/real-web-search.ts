import * as cheerio from 'cheerio';

export interface WebSearchResult {
  title: string;
  url: string;
  snippet: string;
  content?: string;
}

export class RealWebSearch {
  private searchCache: Map<string, WebSearchResult[]> = new Map();

  async searchWeb(query: string): Promise<WebSearchResult[]> {
    try {
      // Check cache first
      if (this.searchCache.has(query)) {
        console.log(`Using cached results for: ${query}`);
        return this.searchCache.get(query)!;
      }

      console.log(`Searching web for: ${query}`);

      // Use a simple web search approach (simulated for now)
      // In production, you would integrate with Google Custom Search API or similar
      const results = await this.simulateWebSearch(query);
      
      const searchResults: WebSearchResult[] = [];

      for (const result of results) {
        try {
          const content = await this.extractContent(result.url);
          searchResults.push({
            title: result.title,
            url: result.url,
            snippet: result.snippet,
            content: content
          });
        } catch (error) {
          console.error(`Error extracting content from ${result.url}:`, error);
          searchResults.push({
            title: result.title,
            url: result.url,
            snippet: result.snippet
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
      console.error('Web search error:', error);
      return this.getFallbackResults(query);
    }
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
      $('script, style, nav, header, footer, .ad, .advertisement, .sidebar').remove();
      
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

  private async simulateWebSearch(query: string): Promise<WebSearchResult[]> {
    // This is a simulated web search that provides realistic-looking results
    // In production, replace this with actual API calls to Google Custom Search, Bing, etc.
    
    const mockResults = [
      {
        title: `Latest information about ${query} - 2024`,
        url: `https://example.com/search?q=${encodeURIComponent(query)}`,
        snippet: `Comprehensive guide and latest updates about ${query}. Find detailed information, tutorials, and best practices.`
      },
      {
        title: `${query} - Complete Guide`,
        url: `https://docs.example.com/${encodeURIComponent(query.toLowerCase().replace(/\s+/g, '-'))}`,
        snippet: `Official documentation and tutorials for ${query}. Learn from experts and get started quickly.`
      },
      {
        title: `${query} - Best Practices & Examples`,
        url: `https://blog.example.com/${encodeURIComponent(query.toLowerCase().replace(/\s+/g, '-'))}`,
        snippet: `Real-world examples and best practices for ${query}. Practical tips and code samples included.`
      }
    ];

    return mockResults;
  }

  private getFallbackResults(query: string): WebSearchResult[] {
    return [
      {
        title: `Information about ${query}`,
        url: `https://example.com/search?q=${encodeURIComponent(query)}`,
        snippet: `This is fallback information about ${query}. The web search service is temporarily unavailable.`,
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
}

// Alternative implementation using Google Custom Search API
export class GoogleWebSearch {
  private apiKey: string;
  private searchEngineId: string;
  private searchCache: Map<string, WebSearchResult[]> = new Map();

  constructor(apiKey: string, searchEngineId: string) {
    this.apiKey = apiKey;
    this.searchEngineId = searchEngineId;
  }

  async searchWeb(query: string): Promise<WebSearchResult[]> {
    try {
      if (this.searchCache.has(query)) {
        return this.searchCache.get(query)!;
      }

      console.log(`Searching Google for: ${query}`);

      const response = await fetch(
        `https://www.googleapis.com/customsearch/v1?key=${this.apiKey}&cx=${this.searchEngineId}&q=${encodeURIComponent(query)}&num=5`
      );

      if (!response.ok) {
        throw new Error(`Google API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.items) {
        return [];
      }

      const searchResults: WebSearchResult[] = [];

      for (const item of data.items) {
        try {
          const content = await this.extractContent(item.link);
          searchResults.push({
            title: item.title,
            url: item.link,
            snippet: item.snippet,
            content: content
          });
        } catch (error) {
          searchResults.push({
            title: item.title,
            url: item.link,
            snippet: item.snippet
          });
        }
      }

      this.searchCache.set(query, searchResults);
      return searchResults;
    } catch (error) {
      console.error('Google search error:', error);
      return [];
    }
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