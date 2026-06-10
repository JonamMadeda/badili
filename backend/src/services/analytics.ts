import { AnalyticsEvent } from '../types.js';

const events: AnalyticsEvent[] = [];
const MAX_EVENTS = 10000;

export function logEvent(event: AnalyticsEvent): void {
  events.push(event);
  if (events.length > MAX_EVENTS) {
    events.splice(0, events.length - MAX_EVENTS);
  }
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Analytics] ${event.event}:`, event.metadata);
  }
}

export function getEvents(): AnalyticsEvent[] {
  return [...events];
}

export function clearEvents(): void {
  events.length = 0;
}
