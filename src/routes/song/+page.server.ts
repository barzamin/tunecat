import * as spotify from '$lib/server/spotify';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const trackId = url.searchParams.get('track_id') as string; // TODO!!
	const spotifyToken = await spotify.getAccessToken();
	const features = await spotify.audioFeatures(spotifyToken, trackId);
	const analysis = await spotify.audioAnalysis(spotifyToken, trackId);
	const info = await spotify.track(spotifyToken, trackId);

	return {
		info,
		features,
		analysis
	};
};
