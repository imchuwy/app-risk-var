import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Github } from 'lucide-react';

const assetPath = (process.env.NEXT_PUBLIC_BASE_PATH || '') + '/oc/assets/';

export function AppHeader() {
  return (
    <header className="risk-header">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="md:hidden" aria-label="Portfolio controls" />
        <svg className="absolute" width="0" height="0" aria-hidden="true" focusable="false">
          <filter id="shore-wash-night" colorInterpolationFilters="sRGB">
            {/* Map the banner's plum wave to ivory and its coral sun to warm coral. */}
            <feColorMatrix type="matrix" values="
              -0.22 0 0 0 1.04
              -1.03 0 0 0 1.21
              -1.12 0 0 0 1.20
               0    0 0 1 0" />
          </filter>
        </svg>
        <img className="var-banner" src={assetPath + 'logos/shore-wash-banner.png'}
          width="692" height="245" alt="Shore Wash" />
      </div>
      <div className="flex items-center gap-3">
        <select className="rounded-md border border-input bg-card px-2 py-2 text-sm" data-oc-theme aria-label="Appearance">
          <option value="system">System</option>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
        <Button variant="ghost" size="icon" asChild>
          <a href="https://github.com/imchuwy/app-risk-var" aria-label="GitHub repository"><Github /></a>
        </Button>
      </div>
    </header>
  );
}
