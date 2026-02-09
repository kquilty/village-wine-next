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
