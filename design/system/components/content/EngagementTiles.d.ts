export interface Tile { title: string; body: string }
/** Three small numbered items under a strong top rule. */
export interface EngagementTilesProps {
  tiles: Tile[];
}
export declare function EngagementTiles(props: EngagementTilesProps): JSX.Element;
