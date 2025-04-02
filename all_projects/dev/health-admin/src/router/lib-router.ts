import queryString from 'query-string';
import { MakeRouteOptions, Route } from './router.interface';


export function buildUrl(route: string, query?: any) {
  if (query) {
    route = `${route}?${queryString.stringify(query)}`;
  }
  return route;
}

export function makeRoute(match: string, option: MakeRouteOptions): Route {
  return {
    match,
    label: option?.label ?? match.split('/').pop() ?? '-',
    build: option?.build ?? (() => match),
    name: option.name,
    matchPath: option.matchPath
  };
}