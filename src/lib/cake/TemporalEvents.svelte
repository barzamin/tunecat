<script lang="ts">
	import type { LayerCake } from 'layercake';
	import type { Analysis, AudioAnalysis } from '$lib/spotify';
	import { getContext } from 'svelte';
	import type { ScaleBand, ScaleLinear } from 'd3-scale';
	import type { Readable, Writable } from 'svelte/store';

	export let fill = '#00bbff';

	const {
		data,
		xScale,
		yScale
	}: {
		data: Writable<any>;
		xScale: Readable<ScaleLinear<number, number>>;
		yScale: Readable<ScaleBand<string>>;
	} = getContext('LayerCake');
</script>

<g>
	{#each $data as dat, idx}
		<rect
			data-id={idx}
			x={$xScale(dat.ev.start)}
			y={$yScale(dat.k)}
			width={$xScale(dat.ev.duration)}
			height={dat.ev.confidence * $yScale.bandwidth()}
			{fill}
			stroke-width="1px"
			stroke="#000"
		/>
	{/each}
</g>
