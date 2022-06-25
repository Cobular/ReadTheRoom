import type { RequestEvent, ResolveOptions } from '@sveltejs/kit';
import type { MaybePromise } from '@sveltejs/kit/types/internal';

/// Disable ssr for everything but /
export async function handle({
	event,
	resolve
}: {
	event: RequestEvent;
	resolve(event: RequestEvent, opts?: ResolveOptions): MaybePromise<Response>;
}): Promise<Response> {
	const response = await resolve(event, {
		ssr: (event.url.pathname === "/" || event.url.pathname === "/index.html" || event.url.pathname === ""),
	});

	return response;
}
