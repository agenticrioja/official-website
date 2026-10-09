import { describe, expect, it } from 'vitest';
import { eventsJsonLd, formatEventDate, isPast, splitEvents, type EventData } from '../../src/lib/events';

const NOW = new Date('2026-10-07T12:00:00+02:00').getTime();
const ev = (data: Partial<EventData>) => ({
  data: { title: { es: 'Evento', en: 'Event' }, summary: { es: 'Resumen', en: 'Summary' }, tba: false, ...data },
});

describe('isPast', () => {
  it('is false for TBA and undated events', () => {
    expect(isPast(ev({ tba: true }), NOW)).toBe(false);
    expect(isPast(ev({}), NOW)).toBe(false);
    expect(isPast(ev({ tba: true, date: new Date('2020-01-01') }), NOW)).toBe(false);
  });

  it('uses endDate when present, so a running event is still upcoming', () => {
    const running = ev({ date: new Date('2026-10-07T10:00:00+02:00'), endDate: new Date('2026-10-07T14:00:00+02:00') });
    expect(isPast(running, NOW)).toBe(false);
  });

  it('falls back to date when there is no endDate', () => {
    expect(isPast(ev({ date: new Date('2026-10-07T11:59:00+02:00') }), NOW)).toBe(true);
    expect(isPast(ev({ date: new Date('2026-10-07T12:01:00+02:00') }), NOW)).toBe(false);
  });

  it('handles an endDate without a date', () => {
    expect(isPast(ev({ endDate: new Date('2026-01-01') }), NOW)).toBe(true);
  });
});

describe('splitEvents', () => {
  const title = (value: string) => ({ es: value, en: value });
  const later = ev({ title: title('later'), date: new Date('2026-12-01') });
  const sooner = ev({ title: title('sooner'), date: new Date('2026-11-01') });
  const tba = ev({ title: title('tba'), tba: true });
  const old = ev({ title: title('old'), date: new Date('2026-01-01') });
  const recent = ev({ title: title('recent'), date: new Date('2026-09-01') });

  it('sorts upcoming soonest first with TBA last, and past most recent first', () => {
    const { upcoming, past } = splitEvents([tba, later, old, sooner, recent], NOW);
    expect(upcoming.map((e) => e.data.title.en)).toEqual(['sooner', 'later', 'tba']);
    expect(past.map((e) => e.data.title.en)).toEqual(['recent', 'old']);
  });

  it('returns empty lists for no events', () => {
    expect(splitEvents([], NOW)).toEqual({ upcoming: [], past: [] });
  });
});

describe('eventsJsonLd', () => {
  it('only describes dated events, with optional fields when set', () => {
    const [json, ...rest] = eventsJsonLd(
      [
        ev({ title: { es: 'Encuentro', en: 'Meetup' }, date: new Date('2026-11-20T18:30:00+01:00'), lumaUrl: 'https://luma.com/x' }),
        ev({ title: { es: 'Más adelante', en: 'Later' }, tba: true }),
      ],
      'https://agenticrioja.com/',
      'en',
    );
    expect(rest).toHaveLength(0);
    expect(json).toMatchObject({
      '@type': 'Event',
      name: 'Meetup',
      startDate: '2026-11-20T17:30:00.000Z',
      url: 'https://luma.com/x',
      location: { name: 'Logroño' },
    });
    expect(json).not.toHaveProperty('endDate');
  });
});

describe('formatEventDate', () => {
  it('shows Logroño local time', () => {
    expect(formatEventDate({ tba: false, date: new Date('2026-11-20T17:30:00Z') }, 'en')).toBe('Friday, 20 November 2026 at 18:30');
    expect(formatEventDate({ tba: false, date: new Date('2026-07-01T16:00:00Z') }, 'es')).toBe('miércoles, 1 de julio de 2026, 18:00');
  });

  it('shows a TBA label without a date or when flagged TBA', () => {
    expect(formatEventDate({ tba: true }, 'en')).toBe('Coming soon · Date TBA');
    expect(formatEventDate({ tba: false }, 'es')).toBe('Próximamente · Fecha por confirmar');
  });
});
