<script lang="ts">
	import type { Analysis, AudioAnalysis } from '$lib/spotify';
	import { LayerCake, Svg } from 'layercake';
	import { scaleBand, scaleOrdinal, scaleTime } from 'd3-scale';
	import AxisX from '$lib/cake/AxisX.svelte';
	import AxisY from '$lib/cake/AxisY.svelte';
	import Brush from '$lib/cake/Brush.html.svelte';
	import TemporalEvents from '$lib/cake/TemporalEvents.svelte';
	export let analysis: AudioAnalysis;

	const eventKeys: (keyof AudioAnalysis)[] = ['beats', 'tatums', 'bars', 'sections'];
	let flattenedEvents: { k: string; ev: Analysis.TemporalEvent }[] = [];
	for (const k of eventKeys) {
		for (const ev of analysis[k] as Analysis.TemporalEvent[]) {
			flattenedEvents.push({ k: k, ev: ev });
		}
	}
</script>

<div class="event-timeline">
	<LayerCake
		data={flattenedEvents}
		padding={{ top: 0, right: 20, bottom: 20, left: 45 }}
		xDomain={[0, analysis.track.duration]}
		yScale={scaleBand().padding(0.5).round(true)}
		yDomain={eventKeys}
	>
		<Svg>
			<AxisX
				formatTick={(t) =>
					`${String(Math.floor(t / 60)).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`}
			/>
			<AxisY />

			<TemporalEvents />
		</Svg>
	</LayerCake>
</div>

<style>
	.event-timeline {
		/* border: 1px solid black; */
		width: 100%;
		height: 300px;
	}
</style>
