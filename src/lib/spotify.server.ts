import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } from '$env/static/private';
import type {
    AudioAnalysis,
    AudioFeatures,
    Track,
    SearchParams,
    SearchResult,
    SearchResults,
} from './spotify';

const CLIENT_CREDENTIALS_ENDPOINT = 'https://accounts.spotify.com/api/token';
export const SPOTIFY_API_BASE = 'https://api.spotify.com/v1';

interface ClientCredentialsResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
}

async function _getAccessToken(): Promise<ClientCredentialsResponse> {
    const resp = await fetch(CLIENT_CREDENTIALS_ENDPOINT, {
        method: 'POST',
        body: new URLSearchParams({ grant_type: 'client_credentials' }),
        headers: {
            Authorization: 'basic ' + btoa(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`),
        },
    });
    return (await resp.json()) as ClientCredentialsResponse;
}

let client: SpotifyClient | null = null;
export async function getClient(): Promise<SpotifyClient> {
    // TODO; backoff etc
    if (!client) {
        client = new SpotifyClient();
    }

    // grab token if necessary
    if (!client.access_token || (client.token_expiry_ts && client.token_expiry_ts >= Date.now())) {
        console.log('spotify: refreshing token');
        client.access_token = await _getAccessToken();
        client.token_expiry_ts = Date.now() + client.access_token.expires_in * 1000; // s->ms
    }

    return client;
}

export class SpotifyClient {
    access_token: ClientCredentialsResponse | null = null;
    token_expiry_ts: number | null = null;

    _headers(): { Authorization: string } {
        return {
            Authorization: `${this.access_token?.token_type} ${this.access_token?.access_token}`,
        };
    }

    async audioFeatures(trackId: string): Promise<AudioFeatures> {
        const resp = await fetch(`${SPOTIFY_API_BASE}/audio-features/${trackId}`, {
            headers: this._headers(),
        });

        return await resp.json();
    }

    async audioAnalysis(trackId: string): Promise<AudioAnalysis> {
        const resp = await fetch(`${SPOTIFY_API_BASE}/audio-analysis/${trackId}`, {
            headers: this._headers(),
        });

        return await resp.json();
    }

    async track(id: string, market?: string): Promise<Track> {
        const url = new URL(`${SPOTIFY_API_BASE}/tracks/${id}`);
        if (market) url.searchParams.append('market', market);

        const resp = await fetch(url, {
            headers: this._headers(),
        });

        return await resp.json();
    }

    async search(q: string, type: string[], params?: SearchParams): Promise<SearchResults> {
        const url = new URL(`${SPOTIFY_API_BASE}/search`);
        url.searchParams.append('q', q);
        url.searchParams.append('type', type.join(','));
        if (params?.market) url.searchParams.append('market', params.market);
        if (params?.limit) url.searchParams.append('limit', `${params.limit}`);
        if (params?.offset) url.searchParams.append('offset', `${params.offset}`);
        if (params?.include_external)
            url.searchParams.append('include_external', `${params.include_external}`);

        const resp = await fetch(url, {
            headers: this._headers(),
        });

        return await resp.json();
    }
}
