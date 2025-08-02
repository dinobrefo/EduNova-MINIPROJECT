# API Keys Setup Guide for Real Web Search

## 🎯 Overview

This guide will help you set up real API keys to enable actual web search functionality in your TensorFlow chatbot, making it truly ChatGPT-like.

## 🚀 Quick Start (Google Custom Search API)

### Step 1: Get Google API Key

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/
   - Sign in with your Google account

2. **Create a New Project**
   - Click "Select a project" → "New Project"
   - Name it: `EduNova-Chatbot`
   - Click "Create"

3. **Enable Custom Search API**
   - Go to "APIs & Services" → "Library"
   - Search for "Custom Search API"
   - Click on it and press "Enable"

4. **Create Credentials**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "API Key"
   - Copy the API key (you'll need this later)

### Step 2: Create Custom Search Engine

1. **Go to Custom Search Engine**
   - Visit: https://cse.google.com/
   - Click "Add" to create a new search engine

2. **Configure Search Engine**
   - **Sites to search**: Leave blank (search entire web)
   - **Name**: `EduNova Web Search`
   - **Language**: English
   - **Search the entire web**: ✅ Check this
   - Click "Create"

3. **Get Search Engine ID**
   - After creation, click on your search engine
   - Go to "Setup" tab
   - Copy the "Search engine ID" (cx parameter)

### Step 3: Set Environment Variables

Create or update your `.env.local` file:

```env
# Google Custom Search API
GOOGLE_API_KEY=your_google_api_key_here
GOOGLE_SEARCH_ENGINE_ID=your_search_engine_id_here

# Optional: OpenAI for content summarization
OPENAI_API_KEY=your_openai_api_key_here
```

### Step 4: Test the Setup

```bash
# Test with production web search
npm run test-production-web-search
```

## 🔧 Alternative: Bing Web Search API

### Step 1: Get Bing API Key

1. **Go to Microsoft Azure**
   - Visit: https://portal.azure.com/
   - Sign in with your Microsoft account

2. **Create Bing Search Resource**
   - Click "Create a resource"
   - Search for "Bing Search v7"
   - Click "Create"

3. **Configure Resource**
   - **Subscription**: Choose your subscription
   - **Resource group**: Create new or use existing
   - **Region**: Choose closest to you
   - **Name**: `EduNova-Bing-Search`
   - **Pricing tier**: Free (F0) - 1000 calls/month
   - Click "Review + create" → "Create"

4. **Get API Key**
   - Go to your resource
   - "Keys and Endpoint" → Copy Key 1

### Step 2: Update Environment Variables

```env
# Bing Web Search API
BING_API_KEY=your_bing_api_key_here

# Google Custom Search API (if you want both)
GOOGLE_API_KEY=your_google_api_key_here
GOOGLE_SEARCH_ENGINE_ID=your_search_engine_id_here
```

## 💰 Cost Comparison

### Google Custom Search API
- **Free Tier**: 100 queries/day
- **Paid**: $5 per 1,000 queries
- **Best for**: High-quality, comprehensive results

### Bing Web Search API
- **Free Tier**: 1,000 calls/month
- **Paid**: $3 per 1,000 calls
- **Best for**: Cost-effective, good results

### OpenAI API (Optional)
- **Cost**: ~$0.01-0.05 per query
- **Best for**: Content summarization and enhancement

## 🔒 Security Best Practices

### 1. Environment Variables
```bash
# Never commit API keys to git
echo ".env.local" >> .gitignore
echo ".env" >> .gitignore
```

### 2. API Key Restrictions (Google)
- Go to Google Cloud Console → APIs & Services → Credentials
- Click on your API key
- Under "Application restrictions": Choose "HTTP referrers"
- Add your domain: `https://yourdomain.com/*`
- Under "API restrictions": Select "Custom Search API"

### 3. Rate Limiting
The implementation includes built-in rate limiting:
- 1 second between searches per query
- Caching to reduce API calls
- Error handling and fallbacks

## 🧪 Testing Your Setup

### Test Scripts Available

```bash
# Test with simulated search (no API keys needed)
npm run test-real-web-search

# Test with real API keys
npm run test-production-web-search

# Test original TensorFlow chatbot
npm run test-chatbot
```

### Expected Output with Real API Keys

```
✅ API keys found. Using real Google Custom Search API.

🔍 Testing: "latest JavaScript frameworks 2024"
──────────────────────────────────────────────────
Searching Google for: latest JavaScript frameworks 2024
⏱️  Response time: 2456ms
📝 Response: Based on current web information about "latest JavaScript frameworks 2024":
React 18, Vue 3, Angular 15, and Svelte 4 are among the most popular JavaScript frameworks in 2024...
🎯 Confidence: 0.949
🔗 Sources:
   1. https://react.dev/blog/2024/01/25/react-18-features
   2. https://vuejs.org/guide/introduction.html
   3. https://angular.io/docs
```

## 🚀 Production Deployment

### Vercel Deployment

1. **Set Environment Variables in Vercel**
   ```bash
   vercel env add GOOGLE_API_KEY
   vercel env add GOOGLE_SEARCH_ENGINE_ID
   ```

2. **Deploy**
   ```bash
   vercel --prod
   ```

### Other Platforms

- **Netlify**: Set environment variables in dashboard
- **Railway**: Set environment variables in dashboard
- **Heroku**: Use `heroku config:set`

## 🔍 Troubleshooting

### Common Issues

1. **"API key not valid"**
   - Check if API key is correct
   - Ensure Custom Search API is enabled
   - Verify billing is set up (if needed)

2. **"Search engine ID not found"**
   - Check if search engine ID is correct
   - Ensure search engine is configured for web search

3. **"Quota exceeded"**
   - Check your usage in Google Cloud Console
   - Consider upgrading to paid tier
   - Implement better caching

4. **"Rate limit exceeded"**
   - The implementation includes rate limiting
   - Wait a few seconds between searches
   - Check if multiple instances are running

### Debug Mode

Enable debug logging by setting:

```env
DEBUG=true
```

## 📊 Monitoring Usage

### Google Cloud Console
- Go to APIs & Services → Dashboard
- View Custom Search API usage
- Monitor quota and billing

### Azure Portal (Bing)
- Go to your Bing Search resource
- View metrics and usage
- Monitor API calls

## 🎉 Success Indicators

You'll know it's working when:

✅ **Real search results** appear instead of mock data  
✅ **Actual website URLs** are returned as sources  
✅ **Response times** are 2-5 seconds (first search)  
✅ **Cached searches** are instant (subsequent searches)  
✅ **No API errors** in console logs  

## 🔮 Next Steps

Once you have real web search working:

1. **Add OpenAI Integration** for better content summarization
2. **Implement Redis Caching** for persistent cache
3. **Add Analytics** to track usage patterns
4. **Optimize Rate Limiting** based on your needs
5. **Add Multi-language Support** for international users

## 📞 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Verify your API keys are correct
3. Ensure billing is set up (if required)
4. Check API quotas and limits
5. Review the implementation logs

---

**🎯 Your chatbot will now have real ChatGPT-like web search capabilities!** 