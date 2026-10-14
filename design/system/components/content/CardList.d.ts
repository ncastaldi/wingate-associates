import type { StatCalloutProps } from './StatCallout';
export interface CardItem { title: string; href?: string; body?: string; stat?: StatCalloutProps }
/**
 * Grid of service or work cards. A card with href gets a linked title and the whole card becomes the hit area.
 * @startingPoint section="Content" subtitle="Service and recent-work cards" viewport="700x380"
 */
export interface CardListProps {
  cards: CardItem[];
}
export declare function CardList(props: CardListProps): JSX.Element;
