export interface SiteHeaderLink { href: string; label: string }
/**
 * Site header: logo mark, name and main nav. Nav drops to its own row below 480px.
 * @startingPoint section="Chrome" subtitle="Header with mark, name and nav" viewport="700x140"
 */
export interface SiteHeaderProps {
  /** Label of the current page; gets aria-current="page". */
  current?: string;
  homeHref?: string;
  links?: SiteHeaderLink[];
  /** Mark on light backgrounds (assets/wingate-mark.png). */
  markSrc?: string;
  /** Mark for dark mode (assets/wingate-mark-badge.png). */
  markDarkSrc?: string;
}
export declare function SiteHeader(props: SiteHeaderProps): JSX.Element;
