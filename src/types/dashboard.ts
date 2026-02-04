export type WidgetType = 
  | 'hero-banner'
  | 'stats-row'
  | 'action-center'
  | 'promo-carousel'
  | 'news-training'
  | 'connect-upline'
  | 'forecast'
  | 'velocity'
  | 'pipeline'
  | 'ai-insight';

export interface DashboardWidget {
  id: string;
  type: WidgetType;
  title: string;
  size: 'small' | 'medium' | 'large' | 'full';
  column: 'main' | 'sidebar';
  // For AI insight widgets, store the content
  content?: string;
}


export const WIDGET_REGISTRY: Record<WidgetType, { 
  title: string; 
  defaultSize: DashboardWidget['size'];
  defaultColumn: DashboardWidget['column'];
  description: string;
}> = {
  'hero-banner': {
    title: 'Capping Progress',
    defaultSize: 'large',
    defaultColumn: 'main',
    description: 'Track your progress to capping goal',
  },
  'stats-row': {
    title: 'Key Stats',
    defaultSize: 'large',
    defaultColumn: 'main',
    description: 'Units, GCI, and Volume metrics',
  },
  'action-center': {
    title: 'Action Center',
    defaultSize: 'large',
    defaultColumn: 'main',
    description: 'Influencer status and achievements',
  },
  'promo-carousel': {
    title: 'Promotions',
    defaultSize: 'large',
    defaultColumn: 'main',
    description: 'Featured programs and opportunities',
  },
  'news-training': {
    title: 'News & Training',
    defaultSize: 'medium',
    defaultColumn: 'sidebar',
    description: 'Latest updates and training events',
  },
  'connect-upline': {
    title: 'Connect Upline',
    defaultSize: 'medium',
    defaultColumn: 'sidebar',
    description: 'Quick access to your upline partners',
  },
  'forecast': {
    title: 'Revenue Forecast',
    defaultSize: 'small',
    defaultColumn: 'main',
    description: 'Projected revenue share chart',
  },
  'velocity': {
    title: 'Listing Velocity',
    defaultSize: 'small',
    defaultColumn: 'main',
    description: 'How fast listings are selling',
  },
  'pipeline': {
    title: 'Active Pipeline',
    defaultSize: 'small',
    defaultColumn: 'main',
    description: 'Summary of active escrows',
  },
  'ai-insight': {
    title: 'AI Insight',
    defaultSize: 'medium',
    defaultColumn: 'main',
    description: 'Pinned insight from Mira AI',
  },
};

export const DEFAULT_LAYOUT: DashboardWidget[] = [
  { id: 'hero-banner-1', type: 'hero-banner', title: 'Capping Progress', size: 'large', column: 'main' },
  { id: 'stats-row-1', type: 'stats-row', title: 'Key Stats', size: 'large', column: 'main' },
  { id: 'action-center-1', type: 'action-center', title: 'Action Center', size: 'large', column: 'main' },
  { id: 'promo-carousel-1', type: 'promo-carousel', title: 'Promotions', size: 'large', column: 'main' },
  { id: 'news-training-1', type: 'news-training', title: 'News & Training', size: 'medium', column: 'sidebar' },
  { id: 'connect-upline-1', type: 'connect-upline', title: 'Connect Upline', size: 'medium', column: 'sidebar' },
];
