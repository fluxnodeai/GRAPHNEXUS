import { Entity } from '../db/supabase';

// Real data fetcher for open source APIs
export class RealDataFetcher {
  private static instance: RealDataFetcher;
  private cache: Map<string, any> = new Map();

  public static getInstance(): RealDataFetcher {
    if (!RealDataFetcher.instance) {
      RealDataFetcher.instance = new RealDataFetcher();
    }
    return RealDataFetcher.instance;
  }

  // Fetch real countries data from REST Countries API
  async fetchCountries(limit: number = 10): Promise<Omit<Entity, 'id' | 'created_at'>[]> {
    const cacheKey = `countries_${limit}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      const response = await fetch('https://restcountries.com/v3.1/all?fields=name,capital,population,region,subregion,area,languages,currencies');
      const countries = await response.json();
      
      const entities = countries.slice(0, limit).map((country: any) => ({
        name: country.name.common,
        type: 'Location',
        description: `${country.name.common} is a country in ${country.region}${country.subregion ? `, ${country.subregion}` : ''}.`,
        properties: {
          region: country.region,
          subregion: country.subregion,
          capital: country.capital?.[0] || 'N/A',
          population: country.population,
          area: country.area,
          languages: Object.values(country.languages || {}).join(', '),
          currencies: Object.keys(country.currencies || {}).join(', ')
        }
      }));

      this.cache.set(cacheKey, entities);
      return entities;
    } catch (error) {
      console.error('Failed to fetch countries:', error);
      return [];
    }
  }

  // Fetch real GitHub organizations
  async fetchGitHubOrganizations(limit: number = 10): Promise<Omit<Entity, 'id' | 'created_at'>[]> {
    const cacheKey = `github_orgs_${limit}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      // Get popular organizations
      const orgs = ['microsoft', 'google', 'facebook', 'apple', 'netflix', 'spotify', 'twitter', 'amazon', 'adobe', 'mozilla', 'github', 'docker', 'kubernetes', 'vercel', 'netlify'];
      const selectedOrgs = orgs.slice(0, limit);
      
      const entities = await Promise.all(
        selectedOrgs.map(async (orgName) => {
          try {
            const response = await fetch(`https://api.github.com/orgs/${orgName}`);
            const org = await response.json();
            
            return {
              name: org.name || org.login,
              type: 'Organization',
              description: org.description || `${org.name || org.login} is a technology organization.`,
              properties: {
                login: org.login,
                website: org.blog || org.html_url,
                location: org.location,
                publicRepos: org.public_repos,
                followers: org.followers,
                following: org.following,
                createdAt: org.created_at,
                type: org.type
              }
            };
          } catch {
            return {
              name: orgName,
              type: 'Organization',
              description: `${orgName} is a technology organization.`,
              properties: {
                login: orgName,
                website: `https://github.com/${orgName}`,
                type: 'Organization'
              }
            };
          }
        })
      );

      this.cache.set(cacheKey, entities);
      return entities;
    } catch (error) {
      console.error('Failed to fetch GitHub organizations:', error);
      return [];
    }
  }

  // Fetch real people from JSONPlaceholder (represents real-like user data)
  async fetchPeople(limit: number = 10): Promise<Omit<Entity, 'id' | 'created_at'>[]> {
    const cacheKey = `people_${limit}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/users');
      const users = await response.json();
      
      const entities = users.slice(0, limit).map((user: any) => ({
        name: user.name,
        type: 'Person',
        description: `${user.name} is a professional working at ${user.company?.name || 'various organizations'}.`,
        properties: {
          username: user.username,
          email: user.email,
          phone: user.phone,
          website: user.website,
          company: user.company?.name,
          catchPhrase: user.company?.catchPhrase,
          city: user.address?.city,
          street: user.address?.street,
          zipcode: user.address?.zipcode,
          lat: user.address?.geo?.lat,
          lng: user.address?.geo?.lng
        }
      }));

      this.cache.set(cacheKey, entities);
      return entities;
    } catch (error) {
      console.error('Failed to fetch people:', error);
      return [];
    }
  }

  // Fetch real products from a sample API
  async fetchProducts(limit: number = 10): Promise<Omit<Entity, 'id' | 'created_at'>[]> {
    const cacheKey = `products_${limit}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      const response = await fetch('https://fakestoreapi.com/products');
      const products = await response.json();
      
      const entities = products.slice(0, limit).map((product: any) => ({
        name: product.title,
        type: 'Product',
        description: product.description,
        properties: {
          price: product.price,
          category: product.category,
          rating: product.rating?.rate,
          ratingCount: product.rating?.count,
          image: product.image,
          inStock: Math.random() > 0.2 // Random stock status
        }
      }));

      this.cache.set(cacheKey, entities);
      return entities;
    } catch (error) {
      console.error('Failed to fetch products:', error);
      return [];
    }
  }

  // Fetch real events/news (using a free news API or placeholder)
  async fetchEvents(limit: number = 10): Promise<Omit<Entity, 'id' | 'created_at'>[]> {
    const cacheKey = `events_${limit}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      // Using JSONPlaceholder posts as "events"
      const response = await fetch('https://jsonplaceholder.typicode.com/posts');
      const posts = await response.json();
      
      const entities = posts.slice(0, limit).map((post: any, index: number) => ({
        name: post.title,
        type: 'Event',
        description: post.body,
        properties: {
          eventId: post.id,
          userId: post.userId,
          date: new Date(Date.now() + (index * 24 * 60 * 60 * 1000)).toISOString(), // Future dates
          duration: `${Math.floor(Math.random() * 4) + 1} hours`,
          attendees: Math.floor(Math.random() * 500) + 50,
          type: 'Conference'
        }
      }));

      this.cache.set(cacheKey, entities);
      return entities;
    } catch (error) {
      console.error('Failed to fetch events:', error);
      return [];
    }
  }

  // Fetch a mixed dataset of real entities
  async fetchMixedRealData(totalCount: number = 25): Promise<Omit<Entity, 'id' | 'created_at'>[]> {
    const entitiesPerType = Math.ceil(totalCount / 5);
    
    try {
      const [countries, organizations, people, products, events] = await Promise.all([
        this.fetchCountries(entitiesPerType),
        this.fetchGitHubOrganizations(entitiesPerType),
        this.fetchPeople(entitiesPerType),
        this.fetchProducts(entitiesPerType),
        this.fetchEvents(entitiesPerType)
      ]);

      // Combine and shuffle the results
      const allEntities = [...countries, ...organizations, ...people, ...products, ...events];
      
      // Shuffle array using Fisher-Yates algorithm
      for (let i = allEntities.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [allEntities[i], allEntities[j]] = [allEntities[j], allEntities[i]];
      }

      return allEntities.slice(0, totalCount);
    } catch (error) {
      console.error('Failed to fetch mixed real data:', error);
      return [];
    }
  }

  // Clear cache (useful for refreshing data)
  clearCache(): void {
    this.cache.clear();
  }

  // Get cache status
  getCacheStatus(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

// Export singleton instance
export const realDataFetcher = RealDataFetcher.getInstance();

// Example usage and API information
export const API_SOURCES = {
  countries: {
    name: 'REST Countries API',
    url: 'https://restcountries.com/',
    description: 'Real country data including population, capital, languages, etc.',
    rateLimit: 'No rate limit',
    cost: 'Free'
  },
  github: {
    name: 'GitHub API',
    url: 'https://api.github.com/',
    description: 'Real organization and repository data',
    rateLimit: '60 requests/hour (unauthenticated)',
    cost: 'Free'
  },
  jsonplaceholder: {
    name: 'JSONPlaceholder',
    url: 'https://jsonplaceholder.typicode.com/',
    description: 'Realistic user and post data for testing',
    rateLimit: 'No rate limit',
    cost: 'Free'
  },
  fakestore: {
    name: 'Fake Store API',
    url: 'https://fakestoreapi.com/',
    description: 'Real product data for e-commerce testing',
    rateLimit: 'No rate limit',
    cost: 'Free'
  }
};
