import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Github } from 'lucide-react';

const assetPath = (process.env.NEXT_PUBLIC_BASE_PATH || '') + '/oc/assets/';

export function AppHeader() {
  return (
    <header className="risk-header">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="md:hidden" aria-label="Portfolio controls" />
        <span className="var-brand" role="img" aria-label="Shore Wash">
          <picture className="var-logo-light">
            <source media="(max-width: 680px)" srcSet={assetPath + 'icons/shore-wash-icon-light.png'} width="512" height="512" />
            <img src={assetPath + 'logos/shore-wash-banner.png'} width="692" height="245" alt="" />
          </picture>
          <img className="var-logo-dark" src={assetPath + 'icons/shore-wash-icon-dark.png'} width="512" height="512" alt="" />
        </span>
      </div>
      <div className="flex items-center gap-3">
        <select className="rounded-md border border-input bg-card px-2 py-2 text-sm" data-oc-theme aria-label="Appearance">
          <option value="system">System</option>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
        <Button variant="ghost" size="icon" asChild>
          <a href="https://github.com/imchuwy/app-var" aria-label="GitHub repository"><Github /></a>
        </Button>
      </div>
    </header>
  );
}
