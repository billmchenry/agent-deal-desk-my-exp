export type WidgetType = 
  | 'hero-banner'
  | 'stats-row'
  | 'action-center'
  | 'promo-carousel'
  | 'news-training'
  | 'connect-upline'
  | 'disc-assessment'
  | 'forecast'
  | 'velocity'
  | 'pipeline'
  | 'ai-insight';
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

// Template types
export type TemplateCategory = 'production' | 'team' | 'growth' | 'custom';
export type TemplateVisibility = 'private' | 'team' | 'public';

export interface DashboardTemplate {
  id: string;
  name: string;
  description: string;
  category: TemplateCategory;
  tags: string[];
  visibility: TemplateVisibility;
  widgets: DashboardWidget[];
  createdAt: string;
  updatedAt: string;
  createdBy: {
    id: string;
    name: string;
    avatar?: string;
    badge?: 'star' | 'verified';
  };
  rating: number;
  installCount: number;
  isOwned: boolean;
}

export const WIDGET_REGISTRY: Record<WidgetType, { 
  title: string; 
  defaultSize: DashboardWidget['size'];
  defaultColumn: DashboardWidget['column'];
  description: string;
  refreshFrequency?: 'Daily' | 'Weekly' | 'Real-time';
  widgetKind?: 'List' | 'Chart' | 'Card';
}> = {
  'hero-banner': {
    title: 'Capping Progress',
    defaultSize: 'large',
    defaultColumn: 'main',
    description: 'Track your progress to capping goal',
    refreshFrequency: 'Daily',
    widgetKind: 'Chart',
  },
  'stats-row': {
    title: 'Key Stats',
    defaultSize: 'large',
    defaultColumn: 'main',
    description: 'Units, GCI, and Volume metrics',
    refreshFrequency: 'Daily',
    widgetKind: 'List',
  },
  'action-center': {
    title: 'Action Center',
    defaultSize: 'large',
    defaultColumn: 'main',
    description: 'Influencer status and achievements',
    refreshFrequency: 'Weekly',
    widgetKind: 'List',
  },
  'promo-carousel': {
    title: 'Promotions',
    defaultSize: 'large',
    defaultColumn: 'main',
    description: 'Featured programs and opportunities',
    refreshFrequency: 'Weekly',
    widgetKind: 'Card',
  },
  'news-training': {
    title: 'News & Training',
    defaultSize: 'medium',
    defaultColumn: 'sidebar',
    description: 'Latest updates and training events',
    refreshFrequency: 'Daily',
    widgetKind: 'List',
  },
  'connect-upline': {
    title: 'Connect Upline',
    defaultSize: 'medium',
    defaultColumn: 'sidebar',
    description: 'Quick access to your upline partners',
    refreshFrequency: 'Weekly',
    widgetKind: 'List',
  },
  'disc-assessment': {
    title: 'DISC Assessment',
    defaultSize: 'medium',
    defaultColumn: 'sidebar',
    description: 'Understand your communication style',
    refreshFrequency: 'Weekly',
    widgetKind: 'Card',
  },
  'forecast': {
    title: 'Revenue Forecast',
    defaultSize: 'small',
    defaultColumn: 'main',
    description: 'Projected revenue share chart',
    refreshFrequency: 'Daily',
    widgetKind: 'Chart',
  },
  'velocity': {
    title: 'Listing Velocity',
    defaultSize: 'small',
    defaultColumn: 'main',
    description: 'How fast listings are selling',
    refreshFrequency: 'Real-time',
    widgetKind: 'Chart',
  },
  'pipeline': {
    title: 'Active Pipeline',
    defaultSize: 'small',
    defaultColumn: 'main',
    description: 'Summary of active escrows',
    refreshFrequency: 'Real-time',
    widgetKind: 'List',
  },
  'ai-insight': {
    title: 'AI Insight',
    defaultSize: 'medium',
    defaultColumn: 'main',
    description: 'Pinned insight from Mira AI',
    refreshFrequency: 'Daily',
    widgetKind: 'Card',
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

export const CATEGORY_STYLES: Record<TemplateCategory, { bg: string; text: string; label: string }> = {
  production: { bg: 'bg-orange-100', text: 'text-orange-700', label: 'Production' },
  team: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Team' },
  growth: { bg: 'bg-green-100', text: 'text-green-700', label: 'Growth' },
  custom: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Custom' },
};
