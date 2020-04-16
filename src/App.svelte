<script>
	import Button, {Label} from '@smui/button';
	import LinearProgress from '@smui/linear-progress';
	import NumberField from './components/NumberField.svelte';
	import {valueStore} from './utils/valueStore';
	import {printSolution} from './utils/output';
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
	let solution = null;
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
	let waitAnswer = false;

	let windowWidth = 0;
	let windowHeight = 0;
	let optionsHeight = 0;
	let widthOnCell;
	let heightOnCell;
	let cellSize;

	$: widthOnCell = (windowWidth - 16) / $width - 1;
	$: heightOnCell = (windowHeight - 16 - optionsHeight - 10) / $height - 1;
	$: cellSize = Math.min(40, Math.max(20, Math.min(widthOnCell, heightOnCell)));

	function createSpace() {
		space = [];
		for (let y = 0; y < $height; y++) {
			const line = [];
			for (let x = 0; x < $width; x++) {
				line.push(1);
			}
			space.push(line);
		}
		solution = null;
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
		solution = null;
	}

	function checkAllValueCorrect() {
		if (!bunchChange) {
			const items = getItems();
			allValueCorrect = items.every(([, count]) => count == $all);
			solution = null;
		}
	}

	function onCellClick(x, y) {
		space[y][x] = space[y][x] ? 0 : 1;
		solution = null;
	}

	function clearAll() {
		space.forEach(line => {
			for (let i = 0; i < line.length; i++) {
				line[i] = 0;
			}
		});
		space = space;
		solution = null;
	}

	function fillAll() {
		space.forEach(line => {
			for (let i = 0; i < line.length; i++) {
				line[i] = 1;
			}
		});
		space = space;
		solution = null;
	}

	function onStartStop() {
		solution = null;

		const items = getItems();
		const [data, error] = prepareData(items, space);
		dataError = error;
		if (error) {
			return;
		}

		waitAnswer = true;
		const itemsUnique = isItemsUnique(items);
		const solver = new Solver(data);
		let isSolution = false;
		solver.findSolutions(
			(sol) => {
				isSolution = true;
				solution = printSolution(sol, itemsUnique);
			},
			() => isSolution
		);
		waitAnswer = false;
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

<svelte:window bind:innerWidth={windowWidth} bind:innerHeight={windowHeight}/>

<LinearProgress indeterminate closed="{!waitAnswer}"/>
<div class="options" bind:clientHeight={optionsHeight}>
	<div class="options-line">
		<NumberField bind:value={$width} label="width" min="1" max="100" />
		<NumberField bind:value={$height} label="height" min="1" max="100" />
		<div></div>
		<div></div>
		<div></div>
		<div class:nocorrect="{!allValueCorrect}">
			<NumberField bind:value={$all} label="all" min="0" max="100" />
		</div>
	</div>
	<div class="options-line">
		<NumberField bind:value={$figureI} label="I" min="0" max="999" />
		<NumberField bind:value={$figureN} label="N" min="0" max="999" />
		<NumberField bind:value={$figureL} label="L" min="0" max="999" />
		<NumberField bind:value={$figureU} label="U" min="0" max="999" />
		<NumberField bind:value={$figureX} label="X" min="0" max="999" />
		<NumberField bind:value={$figureW} label="W" min="0" max="999" />
	</div>
	<div class="options-line">
		<NumberField bind:value={$figureP} label="P" min="0" max="999" />
		<NumberField bind:value={$figureF} label="F" min="0" max="999" />
		<NumberField bind:value={$figureZ} label="Z" min="0" max="999" />
		<NumberField bind:value={$figureT} label="T" min="0" max="999" />
		<NumberField bind:value={$figureV} label="V" min="0" max="999" />
		<NumberField bind:value={$figureY} label="v" min="0" max="999" />
	</div>
	<div class="options-line">
		<Button variant="raised" on:click={clearAll}>
			<Label>Clear All</Label>
		</Button>
		<Button variant="raised" on:click={fillAll}>
			<Label>Fill All</Label>
		</Button>
		<div></div>
		<div></div>
		<div></div>
		<Button variant="raised" on:click={onStartStop}>
			<Label>{waitAnswer ? 'Stop' : 'Start'}</Label>
		</Button>
	</div>
	{#if dataError}
		<div class="error-line">
			<div class="error">{dataError}</div>
		</div>
	{/if}
</div>

<div class="space">
	<div class="space_internal">
		{#if solution}
			{#each solution as line, y}
				<div class="space_line">
					{#each line as cell, x}
						<div
							on:click={() => onCellClick(x, y)}
							class="space_cell"
							style="width: {cellSize}px; height: {cellSize}px; background: {cell == null ? '#ffffff' : cell};"
						>
						</div>
					{/each}
				</div>
			{/each}
		{:else}
			{#each space as line, y}
				<div class="space_line">
					{#each line as cell, x}
						<div
							on:click={() => onCellClick(x, y)}
							class="space_cell"
							class:empty_cell={!cell}
							style="width: {cellSize}px; height: {cellSize}px;"
						>
						</div>
					{/each}
				</div>
			{/each}
		{/if}
	</div>
</div>

<style>
	.options {
		margin-top: 8px;
		margin-bottom: 10px;
	}
	.options-line {
		display: flex;
		justify-content: center;
		margin-bottom: 10px;
	}
	.options-line > :global(*:not(:last-child)) {
		margin-right: 10px;
	}
	.error-line {
		display: flex;
		justify-content: center;
		margin-bottom: 10px;
	}
	.nocorrect {
		opacity: 0.5;
	}
	.space {
		display: flex;
		justify-content: center;
	}
	.space_internal {
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
		background: #888888;
		cursor: pointer;
	}
	.space_cell:not(:last-child) {
		margin-right: 1px;
	}
	.empty_cell {
		background-color: #ffffff;
	}
	.error {
		color: #b71c1c;
	}
</style>
