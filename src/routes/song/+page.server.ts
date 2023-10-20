import { getClient } from '$lib/spotify.server';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
    const trackId = url.searchParams.get('track_id') as string; // TODO!!
    const spotify = await getClient();
    const features = await spotify.audioFeatures(trackId);
    const analysis = await spotify.audioAnalysis(trackId);
    const info = await spotify.track(trackId);

    return {
        info,
        features,
        analysis,
    };
};
