/**
 * useWorkflows Hook
 * Custom hook for loading Power Automate cloud flow records from Dataverse.
 *
 * PURPOSE:
 * Loads `workflow` records filtered to Modern Flows (`category eq 5`) of type
 * Definition (`type eq 1`) — i.e. the canonical Power Automate cloud flows
 * available in the current environment.
 *
 * PATTERN:
 * - Loads data once on mount
 * - Exposes `loading` and `reload` for UI feedback and manual refresh
 */

import { useState, useEffect } from 'react';
import { WorkflowsService } from '../generated/services/WorkflowsService';
import type { Workflows } from '../generated/models/WorkflowsModel';

/** OData filter selecting all Power Automate cloud flows (Modern Flows), any state. */
const FLOWS_FILTER = "category eq 5";

/**
 * Decompresses a base64-encoded gzip string to a plain UTF-8 string.
 * Used to decode compressed `clientdata` payloads from Dataverse workflow records.
 *
 * @param encoded - Base64-encoded gzip data.
 * @returns The decompressed string content.
 */
export async function decompressGzipBase64(encoded: string): Promise<string> {
  const binaryStr = atob(encoded);
  const bytes = Uint8Array.from({ length: binaryStr.length }, (_, i) => binaryStr.charCodeAt(i));
  const ds = new DecompressionStream('gzip');
  const writer = ds.writable.getWriter();
  writer.write(bytes);
  writer.close();
  const reader = ds.readable.getReader();
  const chunks: Uint8Array[] = [];
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
  }
  const size = chunks.reduce((n, c) => n + c.length, 0);
  const merged = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) { merged.set(chunk, offset); offset += chunk.length; }
  return new TextDecoder().decode(merged);
}

/**
 * Fetches a single workflow record by ID with all fields, decompressing
 * `clientdata` when needed so trigger-type detection works.
 *
 * @param id - The workflow GUID.
 * @returns The full workflow record, or `null` on error.
 */
export async function fetchWorkflowDetail(id: string): Promise<Workflows | null> {
  try {
    const result = await WorkflowsService.get(id);
    const flow = result.data;
    if (!flow) return null;
    if (flow.clientdataiscompressed && flow.clientdata) {
      try {
        const decompressed = await decompressGzipBase64(flow.clientdata);
        return { ...flow, clientdata: decompressed };
      } catch {
        return flow;
      }
    }
    return flow;
  } catch {
    return null;
  }
}

/**
 * Fetches all activated Power Automate cloud flows from Dataverse.
 *
 * @returns `flows` — the list of retrieved flow records; `loading` — whether
 * a fetch is in progress; `reload` — function to manually re-fetch.
 * @example
 * ```ts
 * const { flows, loading, reload } = useWorkflows()
 * ```
 */
export function useWorkflows() {
  const [flows, setFlows] = useState<Workflows[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFlows();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadFlows = async () => {
    try {
      setLoading(true);
      const result = await WorkflowsService.getAll({
        filter: FLOWS_FILTER,
        orderBy: ['name asc'],
      });
      if (result.data) setFlows(result.data);
    } catch (err) {
      console.error('Error loading workflows:', err);
    } finally {
      setLoading(false);
    }
  };

  return { flows, loading, reload: loadFlows };
}
