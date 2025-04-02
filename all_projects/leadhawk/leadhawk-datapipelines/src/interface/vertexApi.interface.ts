export interface VertexResponse {
  results: Array<SearchResult>,
  totalSize: number;
  attributionToken: string;
  nextPageToken: string;
  guidedSearchResult: {};
  summary: {};
}

export interface SearchResult {
  id: string;
  document: Document;
}

interface Document {
  name: string;
  id: string;
  derivedStructData: DerivedStructData;
}

interface DerivedStructData {
  displayLink: string;
  link: string;
  snippets: Snippet[];
  htmlFormattedUrl: string;
  htmlTitle: string;
  formattedUrl: string;
  title: string;
  pagemap: Pagemap;
}

interface Pagemap {
  cse_image: Cseimage[];
  cse_thumbnail: Csethumbnail[];
  metatags: Metatag[];
}

interface Metatag {
  'twitter:description': string;
  'al:ios:app_store_id': string;
  'al:android:url': string;
  'twitter:card': string;
  viewport: string;
  clientsideingraphs: string;
  bingbot: string;
  'al:android:package': string;
  'linkedin:pagetag': string;
  'og:image': string;
  'al:ios:app_name': string;
  'og:description': string;
  'twitter:image': string;
  'twitter:title': string;
  'al:android:app_name': string;
  'og:type': string;
  'og:title': string;
  'al:ios:url': string;
  'og:url': string;
  locale: string;
  pagekey: string;
  'twitter:site': string;
}

interface Csethumbnail {
  width: string;
  height: string;
  src: string;
}

interface Cseimage {
  src: string;
}

interface Snippet {
  snippet: string;
  htmlSnippet: string;
}
