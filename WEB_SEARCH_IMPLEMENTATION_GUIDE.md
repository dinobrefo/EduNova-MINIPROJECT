# Web Search Implementation Guide for TensorFlow Chatbot

## Overview
This guide shows how to transform your TensorFlow chatbot into a ChatGPT-like system that can pull real-time data from the web.

## Current Implementation
Your enhanced chatbot currently has:
- ✅ TensorFlow-inspired ML capabilities
- ✅ Pattern recognition and response generation
- ✅ Simulated web search (mock data)
- ✅ Conversation history tracking
- ✅ Context awareness

## Real Web Search Implementation Options

### Option 1: Google Custom Search API (Recommended)

#### Step 1: Set up Google Custom Search
```bash
# Get API credentials
# 1. Go to https://console.cloud.google.com/
# 2. Create a new project
# 3. Enable Custom Search API
# 4. Create credentials (API Key)
# 5. Go to https://cse.google.com/ to create a search engine
```

#### Step 2: Install Dependencies
```bash
npm install googleapis
```

#### Step 3: Implement Real Search
```typescript
// lib/real-web-search.ts
import { google } from 'googleapis';

export class RealWebSearch {
  private customsearch = google.customsearch('v1');
  private apiKey: string;
  private searchEngineId: string;

  constructor(apiKey: string, searchEngineId: string) {
    this.apiKey = apiKey;
    this.searchEngineId = searchEngineId;
  }

  async searchWeb(query: string): Promise<WebSearchResult[]> {
    try {
      const response = await this.customsearch.cse.list({
        auth: this.apiKey,
        cx: this.searchEngineId,
        q: query,
        num: 5, // Number of results
      });

      return response.data.items?.map(item => ({
        title: item.title || '',
        url: item.link || '',
        snippet: item.snippet || '',
        content: await this.extractContent(item.link || '')
      })) || [];
    } catch (error) {
      console.error('Google search error:', error);
      return [];
    }
  }

  private async extractContent(url: string): Promise<string> {
    try {
      const response = await fetch(url);
      const html = await response.text();
      // Use cheerio to extract text content
      const $ = cheerio.load(html);
      $('script, style, nav, header, footer').remove();
      return $('body').text().substring(0, 1000);
    } catch (error) {
      return '';
    }
  }
}
```

### Option 2: Bing Web Search API

#### Step 1: Set up Bing Search
```bash
# 1. Go to https://www.microsoft.com/en-us/bing/apis/bing-web-search-api
# 2. Get API key
# 3. Install SDK
npm install @azure/cognitiveservices-websearch
```

#### Step 2: Implementation
```typescript
import { WebSearchClient } from '@azure/cognitiveservices-websearch';

export class BingWebSearch {
  private client: WebSearchClient;

  constructor(apiKey: string) {
    this.client = new WebSearchClient(apiKey);
  }

  async searchWeb(query: string): Promise<WebSearchResult[]> {
    try {
      const result = await this.client.web.search(query);
      return result.webPages?.value?.map(page => ({
        title: page.name || '',
        url: page.url || '',
        snippet: page.snippet || '',
        content: await this.extractContent(page.url || '')
      })) || [];
    } catch (error) {
      console.error('Bing search error:', error);
      return [];
    }
  }
}
```

### Option 3: DuckDuckGo (Free, No API Key)

#### Step 1: Install Dependencies
```bash
npm install duckduckgo-scrape
```

#### Step 2: Implementation
```typescript
import { search } from 'duckduckgo-scrape';

export class DuckDuckGoSearch {
  async searchWeb(query: string): Promise<WebSearchResult[]> {
    try {
      const results = await search(query, { maxResults: 5 });
      return results.map(result => ({
        title: result.title,
        url: result.url,
        snippet: result.description,
        content: await this.extractContent(result.url)
      }));
    } catch (error) {
      console.error('DuckDuckGo search error:', error);
      return [];
    }
  }
}
```

## Enhanced Chatbot Integration

### Update Enhanced Chatbot
```typescript
// lib/enhanced-tensorflow-chatbot.ts
import { RealWebSearch } from './real-web-search';

export class EnhancedTensorFlowChatbot {
  private webSearch: RealWebSearch;

  constructor(context?: LearningContext, apiKey?: string, searchEngineId?: string) {
    // ... existing code ...
    
    if (apiKey && searchEngineId) {
      this.webSearch = new RealWebSearch(apiKey, searchEngineId);
    }
  }

  private async searchWeb(query: string): Promise<WebSearchResult[]> {
    if (this.webSearch) {
      return await this.webSearch.searchWeb(query);
    }
    
    // Fallback to mock search
    return this.mockSearch(query);
  }
}
```

## Environment Variables Setup

### Create .env.local
```env
# Google Custom Search
GOOGLE_API_KEY=your_google_api_key_here
GOOGLE_SEARCH_ENGINE_ID=your_search_engine_id_here

# Bing Search (Alternative)
BING_API_KEY=your_bing_api_key_here

# OpenAI (for content summarization)
OPENAI_API_KEY=your_openai_api_key_here
```

## Content Processing & Summarization

### Add OpenAI Integration for Better Responses
```typescript
import OpenAI from 'openai';

export class ContentProcessor {
  private openai: OpenAI;

  constructor(apiKey: string) {
    this.openai = new OpenAI({ apiKey });
  }

  async summarizeContent(content: string, query: string): Promise<string> {
    try {
      const completion = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that summarizes web content in a concise, educational manner."
          },
          {
            role: "user",
            content: `Summarize this content about "${query}": ${content}`
          }
        ],
        max_tokens: 300
      });

      return completion.choices[0]?.message?.content || content;
    } catch (error) {
      console.error('OpenAI error:', error);
      return content;
    }
  }
}
```

## Advanced Features

### 1. Real-time News Integration
```typescript
// lib/news-api.ts
export class NewsAPI {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async getLatestNews(topic: string): Promise<NewsArticle[]> {
    const response = await fetch(
      `https://newsapi.org/v2/everything?q=${topic}&apiKey=${this.apiKey}&sortBy=publishedAt&pageSize=5`
    );
    const data = await response.json();
    return data.articles || [];
  }
}
```

### 2. Wikipedia Integration
```typescript
// lib/wikipedia-api.ts
export class WikipediaAPI {
  async searchWikipedia(query: string): Promise<WikiResult> {
    const response = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`
    );
    return await response.json();
  }
}
```

### 3. Weather Data
```typescript
// lib/weather-api.ts
export class WeatherAPI {
  async getWeather(location: string): Promise<WeatherData> {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${process.env.WEATHER_API_KEY}`
    );
    return await response.json();
  }
}
```

## Usage Examples

### Basic Web Search
```typescript
const chatbot = new EnhancedTensorFlowChatbot(
  { courseTitle: "Programming" },
  process.env.GOOGLE_API_KEY,
  process.env.GOOGLE_SEARCH_ENGINE_ID
);

const response = await chatbot.sendMessage("What are the latest JavaScript frameworks?");
console.log(response.response);
console.log(response.sources);
```

### News Search
```typescript
const response = await chatbot.sendMessage("What's the latest news about AI?");
// Will search for recent AI news articles
```

### Technical Information
```typescript
const response = await chatbot.sendMessage("How does React hooks work?");
// Will search for technical documentation and tutorials
```

## Deployment Considerations

### 1. Rate Limiting
```typescript
class RateLimitedSearch {
  private lastSearch = 0;
  private minInterval = 1000; // 1 second

  async search(query: string): Promise<WebSearchResult[]> {
    const now = Date.now();
    if (now - this.lastSearch < this.minInterval) {
      await new Promise(resolve => setTimeout(resolve, this.minInterval));
    }
    this.lastSearch = now;
    return await this.performSearch(query);
  }
}
```

### 2. Caching
```typescript
import Redis from 'ioredis';

class CachedSearch {
  private redis = new Redis(process.env.REDIS_URL);

  async search(query: string): Promise<WebSearchResult[]> {
    const cacheKey = `search:${query}`;
    const cached = await this.redis.get(cacheKey);
    
    if (cached) {
      return JSON.parse(cached);
    }

    const results = await this.performSearch(query);
    await this.redis.setex(cacheKey, 3600, JSON.stringify(results)); // Cache for 1 hour
    return results;
  }
}
```

### 3. Error Handling
```typescript
class RobustSearch {
  async search(query: string): Promise<WebSearchResult[]> {
    try {
      return await this.primarySearch(query);
    } catch (error) {
      console.error('Primary search failed:', error);
      try {
        return await this.fallbackSearch(query);
      } catch (fallbackError) {
        console.error('Fallback search failed:', fallbackError);
        return this.getMockResults(query);
      }
    }
  }
}
```

## Testing Your Implementation

### Test Script
```typescript
// scripts/test-real-search.ts
import { EnhancedTensorFlowChatbot } from '../lib/enhanced-tensorflow-chatbot';

async function testRealSearch() {
  const chatbot = new EnhancedTensorFlowChatbot(
    undefined,
    process.env.GOOGLE_API_KEY,
    process.env.GOOGLE_SEARCH_ENGINE_ID
  );

  const testQueries = [
    "latest JavaScript frameworks 2024",
    "machine learning trends",
    "React 18 new features",
    "Python best practices"
  ];

  for (const query of testQueries) {
    console.log(`\nSearching: "${query}"`);
    const response = await chatbot.sendMessage(query);
    console.log(`Response: ${response.response.substring(0, 200)}...`);
    console.log(`Sources: ${response.sources?.join(', ')}`);
  }
}

testRealSearch().catch(console.error);
```

## Cost Considerations

### Google Custom Search API
- 100 free queries per day
- $5 per 1000 queries after free tier

### Bing Web Search API
- 1000 free transactions per month
- $3 per 1000 transactions after free tier

### OpenAI API
- $0.002 per 1K tokens (GPT-3.5-turbo)
- ~$0.01-0.05 per search query

## Security Best Practices

1. **API Key Management**
   ```typescript
   // Never expose API keys in client-side code
   // Use environment variables and server-side only
   ```

2. **Input Sanitization**
   ```typescript
   function sanitizeQuery(query: string): string {
     return query.replace(/[<>]/g, '').substring(0, 100);
   }
   ```

3. **Rate Limiting**
   ```typescript
   // Implement per-user rate limiting
   // Use Redis or database to track usage
   ```

## Next Steps

1. **Choose your search provider** (Google, Bing, or DuckDuckGo)
2. **Set up API credentials**
3. **Implement the search integration**
4. **Add content processing and summarization**
5. **Test with real queries**
6. **Deploy and monitor usage**

This implementation will give you a ChatGPT-like experience with real-time web search capabilities! 