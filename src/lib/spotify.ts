export interface AudioFeatures {
	acousticness: number;
	analysis_url: string;
	danceability: number;
	duration_ms: number;
	energy: number;
	id: string;
	instrumentalness: number;
	key: number; // pitch class: https://en.wikipedia.org/wiki/Pitch_class; -1 if undet
	liveness: number;
	loudness: number;
	mode: number; // 1 => major, 0 => minor
	speechiness: number;
	tempo: number; // bpm
	time_signature: number; // i∈[3, 7] over 4
	track_href: string;
	type: 'audio_features';
	uri: string;
	valence: number;
}

export namespace Analysis {
	export interface Meta {
		analyzer_version: string;
		platform: string;
		detailed_status: string;
		status_code: number;
		timestamp: number;
		analysis_time: number;
		input_process: string;
	}

	export interface Track {
		num_samples: number;
		duration: number; // [s]
		sample_md5: string; // always an empty string (?!)

		offset_seconds: number; // should be 0
		window_seconds: number; // should be 0
		analysis_sample_rate: number; // [Hz]
		analysis_channels: number; // 1 => summed to mono before analysis

		end_of_fade_in: number; // [s], 0 if none
		start_of_fade_out: number; // [s], track duration if none
		loudness: number; // [dB]

		tempo: number; // [bpm]
		tempo_confidence: number; // ∈[0, 1]
		time_signature: number; // i/4, i∈[3, 7]
		time_signature_confidence: number;
		key: number; // pitch class
		key_confidence: number;
		mode: number; // 1 => major, 0 => minor
		mode_confidence: number;

		codestring: string; // echonest musical fingerprint/ENMFP (https://academiccommons.columbia.edu/doi/10.7916/D8Q248M4)
		code_version: number; // ENMFP format version number
		echoprintstring: string; // echoprint fingerprint (https://github.com/spotify/echoprint-codegen)
		echoprint_version: number; // echoprint format version number
		synchstring: string; // synchstring (https://github.com/echonest/synchdata)
		synch_version: number; // synchstring format version number
		rhythmstring: string; // rhythmstring. no doc link lol, "similar to Synchstring"
		rhythm_version: number; // rhythmstring format version number
	}

	export interface TemporalEvent {
		start: number; // [s]
		duration: number; // [s]
		confidence: number; // ∈[0, 1]
	}

	export interface Bar extends TemporalEvent {}

	export interface Beat extends TemporalEvent {}

	// Sections are defined by large variations in rhythm or timbre, e.g. chorus, verse, bridge, guitar solo, etc.
	export interface Section extends TemporalEvent {
		loudness: number; // [dB]
		tempo: number; // [bpm]
		key: number; // pitch class
		key_confidence: number; // ∈[0, 1]
		mode: number; // 1 => major, 0 => minor, -1 for "no result"
		mode_confidence: number;
		time_signature: number; // i/4, i∈[3, 7]
		time_signature_confidence: number;
	}

	// Each segment contains a roughly consistent sound throughout its duration.
	export interface Segment extends TemporalEvent {
		loudness_start: number; // [dB] onset loudness
		loudness_max: number; // [dB] peak loudness
		loudness_max_time: number; // [s] time of peak loudness relative to start of segment
		loudnesss_end: number; // [dB] offset loudness
		pitches: number[]; // ∈[0, 1]^12; weight of each pitch in chromatic scale, indexed by pitch class.
		timbre: number[]; // ∈ℝ^12; weights of basis functions for timbre
	}

	// A tatum represents the lowest regular pulse train that a listener intuitively infers from the timing of perceived musical events (segments).
	export interface Tatum extends TemporalEvent {}
}

export interface AudioAnalysis {
	meta: Analysis.Meta;
	track: Analysis.Track;
	bars: Analysis.Bar[];
	beats: Analysis.Beat[];
	sections: Analysis.Section[];
	tatums: Analysis.Tatum[];
}
export interface ImageObject {
	url: string;
	height: number;
	width: number;
}

export interface SimplifiedArtist {
	external_urls: { spotify: string };
	href: string; // points to full details
	id: string;
	name: string;
	type: 'artist';
	uri: string;
}

export interface Artist {
	external_urls: { spotify: string };
	followers: { href: null; total: number };
	genres: string[];
	href: string; // points to full details
	id: string;
	images: ImageObject[]; // various sizes; widest first
	name: string;
	popularity: number; // ∈ℤ, ∈[0, 100]
	type: 'artist';
	uri: string;
}

export interface Album {
	album_type: 'album' | 'single' | 'compilation';
	total_tracks: number;
	available_markets: string[];
	external_urls: { spotify: string };
	href: string;
	id: string;
	images: ImageObject[]; // various sizes; widest first
	name: string;
	release_date: string;
	release_date_precision: 'year' | 'month' | 'day';
	restrictions: { reason: 'market' | 'product' | 'explicit' };
	type: 'album';
	uri: string;
	artists: SimplifiedArtist[];
}

export interface Track {
	album: Album;
	artists: Artist[];
	available_markets: string[];
	disc_number: number;
	duration_ms: number; // [ms]
	explicit: boolean; // false = no / unknown
	external_ids: {
		isrc: string;
		ean: string;
		upc: string;
	};
	external_urls: { spotify: string };
	href: string;
	id: string;

	// track linking
	is_playable: boolean;
	linked_from: object;

	restrictions: { reason: 'market' | 'product' | 'explicit' };

	name: string;
	popularity: number; // ∈ℤ, ∈[0, 100]
	preview_url: string; // url to preview mp3 clip (30s)
	track_number: number;
	type: 'track';
	uri: string;
	is_local: boolean;
}

export interface SearchParams {
	market?: string; // ISO 3166-1 alpha-2 country code
	limit?: number;
	offset?: number; // pagination
	// "If include_external=audio is specified it signals that the client can play
	// externally hosted audio content, and marks the content as playable in the response.
	// By default externally hosted audio content is marked as unplayable in the response."
	include_external?: 'audio';
}

export interface SearchResultCategory<T> {
	href: string;
	limit: number; // as set in query, or default
	offset: number; // as set in query, or default
	next: string | null; // pagination pointer
	previous: string | null; // pagination pointer
	total: number;
	items: T[];
}

export interface SearchResults {
	tracks: SearchResultCategory<Track>;
	artists: SearchResultCategory<Artist>;
	albums: SearchResultCategory<Album>;

	// TODO: model these
	playlists: SearchResultCategory<any>;
	shows: SearchResultCategory<any>;
	episodes: SearchResultCategory<any>;
	audiobooks: SearchResultCategory<any>;
}
