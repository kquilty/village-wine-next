'use server';

import { sql } from '@/lib/db';

export interface DbEventItem {
  id: number;
  month: string;
  day: string;
  title: string;
  time: string;
  description: string;
  type: string;
  flyer_source: string | null;
  expiration_date: string | null;
}

export type EventType = "special" | "weekly";

export interface EventInput {
  month: string;
  day: string;
  title: string;
  time: string;
  description: string;
  type: EventType;
  flyer_source?: string | null;
  expiration_date?: string | null;
}

function normalizeOptional(value?: string | null) {
  if (!value) return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export async function verifyAdminPassword(password: string) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    console.warn("ADMIN_PASSWORD is not configured.");
    return false;
  }

  return password.trim() === expected;
}

export async function getEventsFromDb() {
  try {
    const result = await sql`
      SELECT 
        id,
        month,
        day,
        title,
        time,
        description,
        type,
        flyer_source,
        expiration_date
      FROM event
      ORDER BY id
    `;

    return result as DbEventItem[];
  } catch (error) {
    console.error('Error fetching events from database:', error);
    return [];
  }
}

export async function createEvent(input: EventInput) {
  const flyerSource = normalizeOptional(input.flyer_source);
  const expirationDate = normalizeOptional(input.expiration_date);

  const result = await sql`
    INSERT INTO event (
      month,
      day,
      title,
      time,
      description,
      type,
      flyer_source,
      expiration_date
    ) VALUES (
      ${input.month},
      ${input.day},
      ${input.title},
      ${input.time},
      ${input.description},
      ${input.type},
      ${flyerSource},
      ${expirationDate}
    )
    RETURNING
      id,
      month,
      day,
      title,
      time,
      description,
      type,
      flyer_source,
      expiration_date
  `;

  return (result as DbEventItem[])[0];
}

export async function updateEvent(id: number, input: EventInput) {
  const flyerSource = normalizeOptional(input.flyer_source);
  const expirationDate = normalizeOptional(input.expiration_date);

  const result = await sql`
    UPDATE event
    SET
      month = ${input.month},
      day = ${input.day},
      title = ${input.title},
      time = ${input.time},
      description = ${input.description},
      type = ${input.type},
      flyer_source = ${flyerSource},
      expiration_date = ${expirationDate}
    WHERE id = ${id}
    RETURNING
      id,
      month,
      day,
      title,
      time,
      description,
      type,
      flyer_source,
      expiration_date
  `;

  return (result as DbEventItem[])[0];
}

export async function deleteEvent(id: number) {
  await sql`
    DELETE FROM event
    WHERE id = ${id}
  `;

  return true;
}
