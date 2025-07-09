import axios from 'axios';
import * as cheerio from 'cheerio';
import { Tool } from '../types.js';

export const webTools: Tool[] = [
  {
    name: 'WebFetch',
    description: 'Fetches content from a specified URL and processes it using an AI model',
    inputSchema: {
      type: 'object',
      properties: {
        url: {
          type: 'string',
          format: 'uri',
          description: 'The URL to fetch content from',
        },
        prompt: {
          type: 'string',
          description: 'The prompt to run on the fetched content',
        },
      },
      required: ['url', 'prompt'],
    },
    handler: async (args: any) => {
      try {
        let url = args.url;
        if (url.startsWith('http://')) {
          url = url.replace('http://', 'https://');
        }
        
        const response = await axios.get(url, {
          timeout: 30000,
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; Claude-Code-MCP/1.0)',
          },
          maxRedirects: 5,
        });
        
        const contentType = response.headers['content-type'] || '';
        let content = '';
        
        if (contentType.includes('application/json')) {
          // Handle JSON content
          content = JSON.stringify(response.data, null, 2);
        } else if (contentType.includes('text/html')) {
          const $ = cheerio.load(response.data);
          
          // Remove script and style elements
          $('script, style, nav, header, footer, aside').remove();
          
          // Convert to markdown-like format
          content = $('body').text().replace(/\\s+/g, ' ').trim();
          
          // Add some basic structure
          $('h1, h2, h3, h4, h5, h6').each((i, el) => {
            const level = parseInt(el.tagName.charAt(1));
            const prefix = '#'.repeat(level);
            content += `\\n${prefix} ${$(el).text()}\\n`;
          });
          
          $('p').each((i, el) => {
            content += `\\n${$(el).text()}\\n`;
          });
          
          $('li').each((i, el) => {
            content += `\\n- ${$(el).text()}`;
          });
          
        } else {
          // Handle other content types
          content = typeof response.data === 'string' ? response.data : JSON.stringify(response.data, null, 2);
        }
        
        // Truncate if too long
        if (content.length > 50000) {
          content = content.substring(0, 50000) + '... (content truncated)';
        }
        
        return `Fetched content from ${url}:\\n\\n${content}\\n\\nPrompt: ${args.prompt}\\n\\nNote: In a real implementation, this would be processed by an AI model. For this demo, the raw content is returned.`;
        
      } catch (error: any) {
        if (error.response?.status === 301 || error.response?.status === 302) {
          const redirectUrl = error.response.headers.location;
          return `Redirect detected to: ${redirectUrl}\\nPlease make a new WebFetch request with the redirect URL.`;
        }
        
        throw new Error(`Failed to fetch URL: ${error.message}`);
      }
    },
  },
  
  {
    name: 'WebSearch',
    description: 'Allows Claude to search the web and use the results to inform responses',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          minLength: 2,
          description: 'The search query to use',
        },
        allowed_domains: {
          type: 'array',
          description: 'Only include search results from these domains',
          items: {
            type: 'string',
          },
        },
        blocked_domains: {
          type: 'array',
          description: 'Never include search results from these domains',
          items: {
            type: 'string',
          },
        },
      },
      required: ['query'],
    },
    handler: async (args: any) => {
      // Note: This is a simplified implementation
      // In a real implementation, you would integrate with a search API like Google Custom Search, Bing, etc.
      
      const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(args.query)}`;
      
      try {
        const response = await axios.get(searchUrl, {
          timeout: 30000,
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; Claude-Code-MCP/1.0)',
          },
        });
        
        const $ = cheerio.load(response.data);
        const results: string[] = [];
        
        // Extract search results (simplified)
        $('div.g').each((i, el) => {
          const title = $(el).find('h3').text();
          const link = $(el).find('a').attr('href');
          const snippet = $(el).find('.VwiC3b').text();
          
          if (title && link && snippet) {
            let include = true;
            
            if (args.allowed_domains) {
              include = args.allowed_domains.some((domain: string) => link.includes(domain));
            }
            
            if (args.blocked_domains) {
              include = include && !args.blocked_domains.some((domain: string) => link.includes(domain));
            }
            
            if (include) {
              results.push(`**${title}**\\n${link}\\n${snippet}\\n`);
            }
          }
        });
        
        return `Search results for "${args.query}":\\n\\n${results.slice(0, 10).join('\\n---\\n')}`;
        
      } catch (error: any) {
        return `Note: This is a simplified web search implementation. In a production environment, you would need to integrate with proper search APIs like Google Custom Search, Bing Search API, etc.\\n\\nSearch query: ${args.query}\\nError: ${error.message}`;
      }
    },
  },
];