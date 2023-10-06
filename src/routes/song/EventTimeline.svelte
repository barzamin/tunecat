<script lang="ts">
	import type { AudioAnalysis } from '$lib/server/spotify';
	import { LayerCake, Svg } from 'layercake';
	import { scaleTime } from 'd3-scale';
	import AxisX from '$lib/cake/AxisX.svelte';
	const points = [
		{ x: 0, y: 0 },
		{ x: 5, y: 10 },
		{ x: 10, y: 20 },
		{ x: 15, y: 30 },
		{ x: 20, y: 40 }
	];
	export let analysis: AudioAnalysis;
</script>

<div class="event-timeline">
	<LayerCake x="x" data={points} xDomain={[0, analysis.track.duration]}>
		<Svg>
			<AxisX
				formatTick={(t) =>
					`${String(Math.floor(t / 60)).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`}
			/>
		</Svg>
	</LayerCake>
</div>

<style>
	.event-timeline {
		border: 1px solid black;
		width: 100%;
		height: 300px;
	}
</style>
