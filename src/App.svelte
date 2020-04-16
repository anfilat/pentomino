<script>
	import Button, {Label} from '@smui/button';
	import NumberField from './components/NumberField.svelte';
	import {valueStore} from './utils/valueStore';
	import {prepareData, Solver, isItemsUnique} from "../dlx/index.js";

	let space = [
		[1, 1, 1, 1, 1, 1, 1, 1],
		[1, 1, 1, 1, 1, 1, 1, 1],
		[1, 1, 1, 1, 1, 1, 1, 1],
		[1, 1, 1, 0, 0, 1, 1, 1],
		[1, 1, 1, 0, 0, 1, 1, 1],
		[1, 1, 1, 1, 1, 1, 1, 1],
		[1, 1, 1, 1, 1, 1, 1, 1],
		[1, 1, 1, 1, 1, 1, 1, 1]
	];
	const width = valueStore(8, createSpace);
	const height = valueStore(8, createSpace);

	let bunchChange = false;
	let allValueCorrect = true;
	const all = valueStore(1, onChangeAll);
	const figureI = valueStore(1, checkAllValueCorrect);
	const figureN = valueStore(1, checkAllValueCorrect);
	const figureL = valueStore(1, checkAllValueCorrect);
	const figureU = valueStore(1, checkAllValueCorrect);
	const figureX = valueStore(1, checkAllValueCorrect);
	const figureW = valueStore(1, checkAllValueCorrect);
	const figureP = valueStore(1, checkAllValueCorrect);
	const figureF = valueStore(1, checkAllValueCorrect);
	const figureZ = valueStore(1, checkAllValueCorrect);
	const figureT = valueStore(1, checkAllValueCorrect);
	const figureV = valueStore(1, checkAllValueCorrect);
	const figureY = valueStore(1, checkAllValueCorrect);
	let dataError;

	function createSpace() {
		space = [];
		for (let y = 0; y < $height; y++) {
			const line = [];
			for (let x = 0; x < $width; x++) {
				line.push(1);
			}
			space.push(line);
		}
	}

	function onChangeAll(value) {
		bunchChange = true;
		figureI.set(value);
		figureN.set(value);
		figureL.set(value);
		figureU.set(value);
		figureX.set(value);
		figureW.set(value);
		figureP.set(value);
		figureF.set(value);
		figureZ.set(value);
		figureT.set(value);
		figureV.set(value);
		figureY.set(value);
		bunchChange = false;
		allValueCorrect = true;
	}

	function checkAllValueCorrect() {
		if (!bunchChange) {
			const items = getItems();
			allValueCorrect = items.every(([, count]) => count == $all);
		}
	}

	function onCellClick(x, y) {
		space[y][x] = space[y][x] ? 0 : 1;
	}

	function onStartStop() {
		const items = getItems();
		const [data, error] = prepareData(items, space);
		dataError = error;
		if (error) {
			return;
		}
		const itemsUnique = isItemsUnique(items);
		const solver = new Solver(data);
		let isSolution = false;
		solver.findSolutions(
			(solution) => {
				isSolution = true;
				console.log(solution);
			},
			() => isSolution
		);
	}

	function getItems() {
		return [
			['I', $figureI],
			['N', $figureN],
			['L', $figureL],
			['U', $figureU],
			['X', $figureX],
			['W', $figureW],
			['P', $figureP],
			['F', $figureF],
			['Z', $figureZ],
			['T', $figureT],
			['V', $figureV],
			['Y', $figureY],
		];
	}
</script>

<div class="flex options-line">
	<NumberField bind:value={$width} label="width" min="1" max="100" />
	<NumberField bind:value={$height} label="height" min="1" max="100" />
	<div class:nocorrect="{!allValueCorrect}">
		<NumberField bind:value={$all} label="all" min="0" max="10" />
	</div>
</div>
<div class="flex options-line">
	<NumberField bind:value={$figureI} label="I" min="0" max="999" />
	<NumberField bind:value={$figureN} label="N" min="0" max="999" />
	<NumberField bind:value={$figureL} label="L" min="0" max="999" />
	<NumberField bind:value={$figureU} label="U" min="0" max="999" />
	<NumberField bind:value={$figureX} label="X" min="0" max="999" />
	<NumberField bind:value={$figureW} label="W" min="0" max="999" />
</div>
<div class="flex options-line">
	<NumberField bind:value={$figureP} label="P" min="0" max="999" />
	<NumberField bind:value={$figureF} label="F" min="0" max="999" />
	<NumberField bind:value={$figureZ} label="Z" min="0" max="999" />
	<NumberField bind:value={$figureT} label="T" min="0" max="999" />
	<NumberField bind:value={$figureV} label="V" min="0" max="999" />
	<NumberField bind:value={$figureY} label="v" min="0" max="999" />
</div>

<Button variant="raised" on:click={onStartStop}>
	<Label>Start</Label>
</Button>
{#if dataError}
	<div>{dataError}</div>
{/if}
<div class="space">
	<div class="space-internal">
		{#each space as line, y}
			<div class="space_line">
				{#each line as cell, x}
					<div
						on:click={() => onCellClick(x, y)}
						class="space_cell"
						class:empty_cell={!cell}>
					</div>
				{/each}
			</div>
		{/each}
	</div>
</div>

<style>
	.flex {
		display: flex;
	}
	.options-line {
		margin-bottom: 10px;
	}
	.nocorrect {
		opacity: 0.5;
	}
	.space {
		display: flex;
		justify-content: center;
	}
	.space-internal {
		flex-grow: 0;
		background: #333333;
	}
	.space_line {
		display: flex;
	}
	.space_line:not(:last-child) {
		margin-bottom: 1px;
	}
	.space_cell {
		width: 20px;
		height: 20px;
		background: #888888;
		cursor: pointer;
	}
	.space_cell:not(:last-child) {
		margin-right: 1px;
	}
	.empty_cell {
		background-color: #ffffff;
	}
</style>
