import { useEffect } from 'react'
import { PreloadableComponent } from 'react-lazy-with-preload'
import { isProdMode } from './get-app-env';
import { config } from 'config';

export default function useTemplatePreload({ templates }: { templates: PreloadableComponent<({ listHeight }: {
  listHeight?: string;
}) => JSX.Element>[] }) {
  useEffect(() => {
    if (isProdMode()) {
      setTimeout(() => {
       templates.forEach(e => e.preload());
      }, config.preloadAppTemplateTime);
    }
  }, []);
}
