import Client from 'shopify-buy';
import { Product, Customer, Order, Address } from '../types';

// ==========================================
// CONFIGURATION
// ==========================================
const SHOPIFY_DOMAIN = '4jq1iv-eu.myshopify.com'; 
const SHOPIFY_ACCESS_TOKEN = 'b3374507009ad0a808108261ac3a704b';
const API_VERSION = '2024-07';

// ==========================================
// CLIENT INITIALIZATION
// ==========================================
export const client = Client.buildClient({
  domain: SHOPIFY_DOMAIN,
  storefrontAccessToken: SHOPIFY_ACCESS_TOKEN,
  apiVersion: API_VERSION
});

// Helper for raw GraphQL queries
const shopifyFetch = async <T>(query: string, variables: any = {}): Promise<T> => {
  try {
    const endpoint = `https://${SHOPIFY_DOMAIN}/api/${API_VERSION}/graphql.json`;
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': SHOPIFY_ACCESS_TOKEN,
        'Accept': 'application/json',
      },
      body: JSON.stringify({ query, variables }),
    });

    if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
    }

    const json = await response.json();
    
    if (json.errors) {
      const errorMessage = json.errors.map((e: any) => e.message).join(', ');
      throw new Error(errorMessage);
    }
    
    return json.data;
  } catch (error) {
    throw error;
  }
};

// ==========================================
// CART WRAPPERS (Replaces Checkout API)
// ==========================================

const CART_FRAGMENT = `
  id
  checkoutUrl
  lines(first: 100) {
    edges {
      node {
        id
        quantity
        merchandise {
          ... on ProductVariant {
            id
            title
            price {
              amount
              currencyCode
            }
            image {
              url
            }
            product {
              id
              title
              vendor
            }
          }
        }
      }
    }
  }
  cost {
    totalAmount {
      amount
      currencyCode
    }
    subtotalAmount {
      amount
      currencyCode
    }
  }
`;

export const createShopifyCart = async () => {
  const query = `
    mutation cartCreate {
      cartCreate {
        cart {
          ${CART_FRAGMENT}
        }
      }
    }
  `;
  const data: any = await shopifyFetch(query);
  return data.cartCreate.cart;
};

export const fetchShopifyCart = async (cartId: string) => {
  const query = `
    query getCart($cartId: ID!) {
      cart(id: $cartId) {
        ${CART_FRAGMENT}
      }
    }
  `;
  const data: any = await shopifyFetch(query, { cartId });
  return data.cart;
};

export const addItemToCart = async (cartId: string, lines: {merchandiseId: string, quantity: number}[]) => {
  const query = `
    mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart {
          ${CART_FRAGMENT}
        }
      }
    }
  `;
  const data: any = await shopifyFetch(query, { cartId, lines });
  return data.cartLinesAdd.cart;
};

export const updateLineItemInCart = async (cartId: string, lines: {id: string, quantity: number}[]) => {
  const query = `
    mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
        cart {
          ${CART_FRAGMENT}
        }
      }
    }
  `;
  const data: any = await shopifyFetch(query, { cartId, lines });
  return data.cartLinesUpdate.cart;
};

export const removeLineItemFromCart = async (cartId: string, lineIds: string[]) => {
  const query = `
    mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart {
          ${CART_FRAGMENT}
        }
      }
    }
  `;
  const data: any = await shopifyFetch(query, { cartId, lineIds });
  return data.cartLinesRemove.cart;
};

// ==========================================
// DATA NORMALIZATION & AUTO-CATEGORIZATION
// ==========================================

// keys match the 'slug' or 'name' used in UI constants
const CATEGORY_KEYWORDS: Record<string, string[]> = {
  "Oxygen Concentrator": ["oxygen", "concentrator", "portable", "dedakj", "philips", "evox", "5l", "10l", "flow", "oxy med"],
  "BiPAP": ["bipap", "bi-level", "resmed", "bmc", "dreamstation", "airsense", "lumis", "bilevel"],
  "CPAP": ["cpap", "auto cpap", "apnea", "sleep", "airsense", "resmart"],
  "Patient Monitor": ["monitor", "multipara", "vital", "ecg", "pulse", "oximeter", "heart rate", "bpl"],
  "Nebulizer": ["nebulizer", "compressor", "mesh", "inhaler", "omron"],
  "Suction Machine": ["suction", "aspirator", "vacuum", "phlegm"],
  "Thermometer": ["thermometer", "infrared", "digital", "temperature", "gun"],
  "Hospital Furniture": ["bed", "mattress", "table", "trolley", "stretcher", "fowler", "ward", "overbed"],
  "Wheelchair": ["wheelchair", "karma", "walker", "commode"],
  "Masks & Accessories": ["mask", "tubing", "cannula", "filter", "full face", "nasal"]
};

const normalizeCategoryKey = (value: string): string =>
  (value || '').toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]/g, '');

const CATEGORY_ALIASES: Record<string, string[]> = {
  "Oxygen Concentrator": ["oxygenconcentrator", "oxygenconcentrators", "oxygen"],
  "BiPAP": ["bipap", "bipapmachine", "bilevel"],
  "CPAP": ["cpap", "cpapmachine", "autocpap"],
  "Patient Monitor": ["patientmonitor", "patientmonitors", "monitor", "multiparamonitor"],
  "Nebulizer": ["nebulizer", "nebulizers"],
  "Suction Machine": ["suctionmachine", "suctionmachines", "aspirator"],
  "Thermometer": ["thermometer", "thermometers"],
  "Hospital Furniture": ["hospitalfurniture", "hospitalbed", "hospitalbeds"],
  "Wheelchair": ["wheelchair", "wheelchairs"],
  "Masks & Accessories": ["masksandaccessories", "mask", "masks", "cpapmask", "bipapmask"]
};

const getCategoryFromAliases = (rawValues: string[]): string | undefined => {
  const normalizedValues = rawValues
    .filter(Boolean)
    .map(v => normalizeCategoryKey(v));

  for (const [category, aliases] of Object.entries(CATEGORY_ALIASES)) {
    if (aliases.some(alias => normalizedValues.includes(alias))) {
      return category;
    }
  }

  return undefined;
};

const inferCategory = (title: string, tags: string[], productType: string, collections: { title?: string; handle?: string }[] = []): string => {
  const collectionValues = collections.flatMap(c => [c?.title || '', c?.handle || '']);
  const fromCollections = getCategoryFromAliases(collectionValues);
  if (fromCollections) return fromCollections;

  const fromProductTypeAlias = getCategoryFromAliases([productType]);
  if (fromProductTypeAlias) return fromProductTypeAlias;

  // 1. Check direct match with keyword keys
  if (CATEGORY_KEYWORDS[productType]) return productType;

  // 2. Search keywords
  const searchString = `${title} ${productType} ${tags.join(' ')}`.toLowerCase();

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some(k => searchString.includes(k.toLowerCase()))) {
      return category;
    }
  }

  // 3. Fallback logic
  if (searchString.includes("oxygen")) return "Oxygen Concentrator";
  if (searchString.includes("bipap")) return "BiPAP";
  if (searchString.includes("cpap")) return "CPAP";
  if (searchString.includes("monitor")) return "Patient Monitor";

  return productType || "General";
};

const generateRating = (id: string) => {
  // Deterministic rating based on ID hash for consistent UI
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  const normalized = Math.abs(hash % 15) / 10 + 3.5;
  return parseFloat(normalized.toFixed(1));
};

const normalizeProduct = (shopifyProduct: any): Product => {
  const node = shopifyProduct.node || shopifyProduct;
  const firstVariant = node.variants?.edges?.[0]?.node || node.variants?.[0] || {};

  // Extract all images
  const edges = node.images?.edges || node.images || [];
  const images = Array.isArray(edges)
    ? edges.map((e: any) => e.node?.url || e.src || e.url)
    : [firstVariant?.image?.src || 'https://via.placeholder.com/400?text=No+Image'];

  const rawDescription = node.description || "";
  const cleanSpecs = rawDescription.replace(/(<([^>]+)>)/gi, "").substring(0, 60) + "...";

  const collections = (node.collections?.edges || []).map((edge: any) => ({
    title: edge?.node?.title,
    handle: edge?.node?.handle
  }));

  // Auto-Categorization (prioritize Shopify collections)
  const inferredCategory = inferCategory(
      node.title || "",
      node.tags || [],
      node.productType || "",
      collections
  );

  return {
    id: node.id,
    title: node.title,
    vendor: node.vendor,
    category: inferredCategory,
    price: parseFloat(firstVariant.price?.amount || firstVariant.price || "0"),
    compareAtPrice: firstVariant.compareAtPrice?.amount ? parseFloat(firstVariant.compareAtPrice.amount) : null,
    image: images[0],
    images: images,
    tags: node.tags || [],
    specs: cleanSpecs,
    inStock: firstVariant.availableForSale || firstVariant.available || false,
    variantId: firstVariant.id,
    description: node.descriptionHtml || node.description || "",
    rating: generateRating(node.id),
    reviewCount: Math.floor(generateRating(node.title) * 10) + 5
  };
};

const normalizeCustomer = (data: any): Customer => {
  let orders: Order[] = [];
  if (data.orders?.edges) {
      orders = data.orders.edges.map((edge: any) => ({
        id: edge.node.id,
        orderNumber: edge.node.orderNumber,
        processedAt: edge.node.processedAt,
        totalPrice: edge.node.totalPrice,
        statusUrl: edge.node.statusUrl,
        lineItems: edge.node.lineItems.edges.map((li: any) => ({
            title: li.node.title,
            quantity: li.node.quantity
        }))
      }));
  }

  let addresses: Address[] = [];
  if (data.addresses?.edges) {
    addresses = data.addresses.edges.map((edge: any) => ({
        id: edge.node.id,
        address1: edge.node.address1,
        address2: edge.node.address2,
        city: edge.node.city,
        zip: edge.node.zip,
        country: edge.node.country,
        firstName: edge.node.firstName,
        lastName: edge.node.lastName,
        phone: edge.node.phone
    }));
  }

  return {
    id: data.id,
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    phone: data.phone,
    orders,
    addresses
  };
};

// ==========================================
// PRODUCT FUNCTIONS
// ==========================================

const PRODUCT_FRAGMENT = `
  id
  title
  description
  descriptionHtml
  productType
  vendor
  tags
  variants(first: 1) {
    edges {
      node {
        id
        price {
          amount
          currencyCode
        }
        compareAtPrice {
          amount
          currencyCode
        }
        availableForSale
        image {
          url
        }
      }
    }
  }
  collections(first: 10) {
    edges {
      node {
        title
        handle
      }
    }
  }
  images(first: 10) {
    edges {
      node {
        url
      }
    }
  }
`;

export const fetchAllProducts = async (): Promise<Product[]> => {
  // Use a raw query with 'first: 250' to bypass default pagination of ~20
  const query = `
    query getAllProducts {
      products(first: 250) {
        edges {
          node {
            ${PRODUCT_FRAGMENT}
          }
        }
      }
    }
  `;
  
  try {
    const data: any = await shopifyFetch(query);
    return data.products.edges.map(normalizeProduct);
  } catch (error) {
    console.error("Error fetching all products:", error);
    const products = await client.product.fetchAll();
    return products.map(normalizeProduct);
  }
};

export const fetchProductById = async (id: string): Promise<Product | undefined> => {
  try {
    const product = await client.product.fetch(id);
    if (!product) return undefined;
    return normalizeProduct(product);
  } catch (error) {
     return undefined;
  }
};

export const fetchProductsByCategory = async (category: string): Promise<Product[]> => {
  if (category === 'All' || !category) return fetchAllProducts();
  
  let query = "";
  
  // 1. Try to find keywords for the exact category slug
  let keywords = CATEGORY_KEYWORDS[category];

  // 2. If not found, try to find a key that contains the category string (fuzzy match)
  if (!keywords) {
      const fuzzyKey = Object.keys(CATEGORY_KEYWORDS).find(k => k.toLowerCase().includes(category.toLowerCase()));
      if (fuzzyKey) keywords = CATEGORY_KEYWORDS[fuzzyKey];
  }

  if (keywords) {
      // Build an inclusive query using keywords
      // We limit to top 4 keywords to prevent query string overflow
      const mainKeywords = keywords.slice(0, 4);
      
      const titleQueries = mainKeywords.map(k => `title:*${k}*`).join(" OR ");
      // Tag queries usually require exact match, but we can try
      const tagQueries = mainKeywords.map(k => `tag:${k}`).join(" OR ");
      
      query = `(${titleQueries}) OR (${tagQueries}) OR product_type:${category}`;
  } else {
      // Fallback: Use the category string itself as a keyword
      query = `title:*${category}* OR product_type:${category} OR tag:${category}`;
  }
  
  try {
    const products = await client.product.fetchQuery({ query, first: 250 });
    return products.map(normalizeProduct);
  } catch (e) {
    console.warn("Category search failed, falling back to empty", e);
    // As a final fallback, fetch all and filter client side (slow but safe)
    try {
        const all = await fetchAllProducts();
        return all.filter(p => p.category === category);
    } catch(err) {
        return [];
    }
  }
};

export const searchProducts = async (query: string): Promise<Product[]> => {
  try {
    // Break down query into terms for better matching
    const terms = query.split(' ').filter(t => t.length > 2);
    
    // Construct query: (title contains term1 OR title contains term2)
    // Note: Shopify API behavior with wildcards can be tricky.
    // Safe bet: title:*query* OR tag:query OR product_type:query
    
    const queryString = `title:*${query}* OR vendor:*${query}* OR tag:${query} OR product_type:${query}`;
    
    const products = await client.product.fetchQuery({ query: queryString });
    return products.map(normalizeProduct);
  } catch(e) {
    console.error("Search failed", e);
    return [];
  }
};

// ==========================================
// AUTH & CUSTOMER FUNCTIONS
// ==========================================

export const registerCustomer = async (email: string, password: string, firstName: string, lastName: string) => {
  const query = `
    mutation customerCreate($input: CustomerCreateInput!) {
      customerCreate(input: $input) {
        customer { id }
        customerUserErrors { code field message }
      }
    }
  `;
  const data: any = await shopifyFetch(query, { input: { email, password, firstName, lastName } });
  if (data.customerCreate?.customerUserErrors?.length > 0) {
    throw new Error(data.customerCreate.customerUserErrors[0].message);
  }
  return data.customerCreate?.customer;
};

export const loginCustomer = async (email: string, password: string) => {
  const query = `
    mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
      customerAccessTokenCreate(input: $input) {
        customerAccessToken { accessToken expiresAt }
        customerUserErrors { code field message }
      }
    }
  `;
  const data: any = await shopifyFetch(query, { input: { email, password } });
  if (data.customerAccessTokenCreate?.customerUserErrors?.length > 0) {
    throw new Error(data.customerAccessTokenCreate.customerUserErrors[0].message);
  }
  return data.customerAccessTokenCreate?.customerAccessToken?.accessToken;
};

export const getCustomer = async (accessToken: string): Promise<Customer> => {
  const query = `
    query getCustomer($customerAccessToken: String!) {
      customer(customerAccessToken: $customerAccessToken) {
        id
        firstName
        lastName
        email
        phone
        addresses(first: 5) {
          edges {
            node {
              id
              address1
              address2
              city
              province
              country
              zip
              firstName
              lastName
              phone
            }
          }
        }
        orders(first: 10, sortKey: PROCESSED_AT, reverse: true) {
          edges {
            node {
              id
              orderNumber
              processedAt
              totalPrice { amount currencyCode }
              statusUrl
              lineItems(first: 5) {
                edges {
                  node { title quantity }
                }
              }
            }
          }
        }
      }
    }
  `;

  const data: any = await shopifyFetch(query, { customerAccessToken: accessToken });
  if (!data.customer) throw new Error("Customer not found or token expired");
  return normalizeCustomer(data.customer);
};

export const recoverCustomerPassword = async (email: string) => {
  const query = `
    mutation customerRecover($email: String!) {
      customerRecover(email: $email) {
        customerUserErrors { code field message }
      }
    }
  `;
  await shopifyFetch(query, { email });
  return true;
};

// ==========================================
// ADDRESS MANAGEMENT
// ==========================================

export const createAddress = async (accessToken: string, address: Omit<Address, 'id'>) => {
  const query = `
    mutation customerAddressCreate($customerAccessToken: String!, $address: MailingAddressInput!) {
      customerAddressCreate(customerAccessToken: $customerAccessToken, address: $address) {
        customerAddress { id }
        customerUserErrors { code field message }
      }
    }
  `;
  const data: any = await shopifyFetch(query, { customerAccessToken: accessToken, address });
  if (data.customerAddressCreate?.customerUserErrors?.length > 0) {
    throw new Error(data.customerAddressCreate.customerUserErrors[0].message);
  }
  return data.customerAddressCreate?.customerAddress;
};

export const deleteAddress = async (accessToken: string, addressId: string) => {
  const query = `
    mutation customerAddressDelete($id: ID!, $customerAccessToken: String!) {
      customerAddressDelete(id: $id, customerAccessToken: $customerAccessToken) {
        customerUserErrors { code field message }
        deletedCustomerAddressId
      }
    }
  `;
  const data: any = await shopifyFetch(query, { id: addressId, customerAccessToken: accessToken });
  if (data.customerAddressDelete?.customerUserErrors?.length > 0) {
    throw new Error(data.customerAddressDelete.customerUserErrors[0].message);
  }
  return true;
};
