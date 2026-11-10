// What the pages show: visible items only, in the studio's chosen order.
import { getCollection } from 'astro:content';

export async function getProjects() {
  const all = await getCollection('projects');
  return all
    .filter((p) => !p.data.hidden)
    .sort((a, b) => a.data.order - b.data.order || a.data.title.localeCompare(b.data.title))
    .map((p) => ({ slug: p.id, ...p.data, entries: p.data.entries.filter((e) => !e.hidden) }));
}

export async function getCollaborators() {
  const all = await getCollection('collaborators');
  return all.filter((c) => !c.data.hidden).sort((a, b) => a.data.order - b.data.order).map((c) => c.data);
}
