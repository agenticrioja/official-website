/** Fields of an event entry that the scheduling logic needs (see src/content.config.ts). */
export interface EventData {
  title: string;
  date?: Date;
  endDate?: Date;
  tba: boolean;
  venue?: string;
  lumaUrl?: string;
  summary: string;
}

type Entry = { data: EventData };

const endOf = (e: Entry) => (e.data.endDate ?? e.data.date)?.getTime();

/** An event is past once it has finished. TBA and undated events are never past. */
export const isPast = (e: Entry, now: number): boolean => {
  const end = endOf(e);
  return !e.data.tba && end !== undefined && end < now;
};

/** Splits events into upcoming (soonest first, undated last) and past (most recent first). */
export function splitEvents<T extends Entry>(events: T[], now: number) {
  const upcoming = events
    .filter((e) => !isPast(e, now))
    .sort((a, b) => (a.data.date?.getTime() ?? Infinity) - (b.data.date?.getTime() ?? Infinity));
  const past = events.filter((e) => isPast(e, now)).sort((a, b) => endOf(b)! - endOf(a)!);
  return { upcoming, past };
}

/** schema.org Event markup for dated, upcoming events so search engines can show them. */
export function eventsJsonLd(upcoming: Entry[], siteUrl: string) {
  return upcoming
    .filter((e) => !e.data.tba && e.data.date)
    .map(({ data }) => ({
      '@context': 'https://schema.org',
      '@type': 'Event',
      name: data.title,
      description: data.summary,
      startDate: data.date!.toISOString(),
      ...(data.endDate && { endDate: data.endDate.toISOString() }),
      eventStatus: 'https://schema.org/EventScheduled',
      eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
      location: { '@type': 'Place', name: data.venue ?? 'Logroño', address: 'Logroño, La Rioja, Spain' },
      organizer: { '@type': 'Organization', name: 'AAIF Logroño Chapter', url: siteUrl },
      ...(data.lumaUrl && { url: data.lumaUrl }),
    }));
}

const dateFormat = new Intl.DateTimeFormat('en-GB', { dateStyle: 'full', timeStyle: 'short', timeZone: 'Europe/Madrid' });

/** Label shown on an event card: Logroño local time, or a TBA notice. */
export const formatEventDate = (data: Pick<EventData, 'date' | 'tba'>): string =>
  data.tba || !data.date ? 'Coming soon · Date TBA' : dateFormat.format(data.date);
