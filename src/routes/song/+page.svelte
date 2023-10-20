<script lang="ts">
    import { modeName, pitchclassName } from '$lib/music';
    import type { PageData } from './$types';
    import EventTimeline from './EventTimeline.svelte';

    export let data: PageData;
</script>

WOAGH

<div>{data.info.artists.map((a) => a.name).join(', ')}—{data.info.name}</div>

<div>
    key: {pitchclassName(data.analysis.track.key)}
    <span class="confidence">(<sup>☈</sup>{data.analysis.track.key_confidence})</span>
</div>
<div>
    └ mode: {modeName(data.analysis.track.mode)}
    <span class="confidence">(<sup>☈</sup>{data.analysis.track.mode_confidence})</span>
</div>
<div>
    tempo: {data.analysis.track.tempo}bpm
    <span class="confidence">(<sup>☈</sup>{data.analysis.track.tempo_confidence})</span>
</div>
<div>
    time signature: {data.analysis.track.time_signature}/4
    <span class="confidence">(<sup>☈</sup>{data.analysis.track.time_signature_confidence})</span>
</div>
<div>loudness: {data.analysis.track.loudness}dB</div>

<EventTimeline analysis={data.analysis} />

<pre>
{JSON.stringify(data, null, 2)}
</pre>

<style>
    .confidence {
        font-size: 0.8em;
        background-color: black;
        color: white;
        padding: 0.1em;
    }
</style>
