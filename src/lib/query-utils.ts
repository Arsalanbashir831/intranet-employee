/**
 * Utility functions for React Query hooks
 */

/**
 * Normalize query parameters to ensure consistent query keys
 * Sorts keys alphabetically to prevent different key orderings from creating separate cache entries
 */
export function normalizeParams(
	params?: Record<string, string | number | boolean>
): Record<string, string | number | boolean> | undefined {
	if (!params) return undefined;
	// Sort keys to ensure consistent query key ordering
	const entries = Object.entries(params).sort(([a], [b]) => (a > b ? 1 : -1));
	return Object.fromEntries(entries) as Record<
		string,
		string | number | boolean
	>;
}

