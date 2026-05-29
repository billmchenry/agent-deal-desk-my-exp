// Route-based placeholder text and suggestions for Mira input

export function getMiraPlaceholder(pathname: string, isMobile: boolean = false): string {
  if (isMobile) {
    return "Ask Mira...";
  }

  switch (pathname) {
    case '/':
      return "Ask Mira anything about your business...";
    case '/pulse':
      return "Ask Mira about your insights and trends...";
    case '/marketplace':
      return "Ask Mira about marketplace listings and opportunities...";
    case '/financials':
      return "Ask Mira about your financial performance...";
    case '/performance':
      return "Ask Mira about your performance metrics...";
    case '/transactions':
      return "Ask Mira about your transactions...";
    case '/team':
      return "Ask Mira about your team's performance...";
    case '/organization':
      return "Ask Mira about your organization...";
    case '/mentorship':
      return "Ask Mira about mentorship and coaching...";
    case '/alerts':
      return "Ask Mira about your alerts and notifications...";
    default:
      return "Ask Mira anything about your business...";
  }
}

export function getMiraSuggestions(pathname: string): string[] {
  switch (pathname) {
    case '/':
      return [
        "Why is my GCI down this month?",
        "Who's at risk of leaving?",
        "Show my cap progress",
      ];
    case '/pulse':
      return [
        "What are my key trends?",
        "Show weekly performance summary",
        "Alert me on anomalies",
      ];
    case '/marketplace':
      return [
        "Show top listing opportunities",
        "Compare market trends",
        "Find underpriced properties",
      ];
    case '/financials':
      return [
        "Show my revenue breakdown",
        "Compare to last quarter",
        "Forecast next month",
      ];
    case '/performance':
      return [
        "Who are my top performers?",
        "Show conversion rates",
        "Compare team metrics",
      ];
    case '/transactions':
      return [
        "Show pending transactions",
        "What closed this month?",
        "Find delayed closings",
      ];
    case '/team':
      return [
        "Who needs coaching?",
        "Show team rankings",
        "Identify top producers",
      ];
    case '/organization':
      return [
        "Show org structure",
        "Compare branch performance",
        "Find growth opportunities",
      ];
    case '/mentorship':
      return [
        "Who should I mentor?",
        "Show mentee progress",
        "Suggest coaching topics",
      ];
    case '/alerts':
      return [
        "Show critical alerts",
        "What needs attention?",
        "Summarize notifications",
      ];
    default:
      return [
        "Why is my GCI down?",
        "Show my top performers",
        "What needs attention?",
      ];
  }
}
