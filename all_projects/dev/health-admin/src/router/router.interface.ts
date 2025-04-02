
export type Route = {
  build: (id: string, query?: unknown) => string;
  label?: string;
  match: string;
  name: string;
  matchPath?: string;
};

export type MakeRouteOptions = {
  label?: string;
  build?: (id: string | any) => string;
  name: string;
  matchPath?: string;
};

export interface BreadCrumb {
  label: string;
  route?: string;
}