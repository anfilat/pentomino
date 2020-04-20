<script>
	import Button, {Label} from '@smui/button';
	import Select, {Option} from '@smui/select';
	import LinearProgress from '@smui/linear-progress';
	import NumberField from './components/NumberField.svelte';
	import {valueStore} from './code/valueStore';
	import {printSolution} from './code/output';
	import {presets} from './code/presets';
	import {isItemsUnique, fillItems, prepareSpace} from "../common";

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

	let bunchChange = false;
	const selectPreset = valueStore('', onChangePreset);
	const width = valueStore(8, createSpace);
	const height = valueStore(8, createSpace);
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
	// по ширине надо всегда вписываться из-за мобильников
	$: cellSize = Math.min(Math.min(40, widthOnCell), Math.min(40, Math.max(20, heightOnCell)))

	function onChangePreset(value) {
		if (value) {
			const preset = presets.find(({name}) => name === value);

			bunchChange = true;
			space = prepareSpace(preset.space);
			height.set(space.length);
			width.set(space[0].length);

			let items = preset.items;
			if (typeof items === 'number') {
				items = fillItems(items);
			}

			figureI.set(items.I || 0);
			figureN.set(items.N || 0);
			figureL.set(items.L || 0);
			figureU.set(items.U || 0);
			figureX.set(items.X || 0);
			figureW.set(items.W || 0);
			figureP.set(items.P || 0);
			figureF.set(items.F || 0);
			figureZ.set(items.Z || 0);
			figureT.set(items.T || 0);
			figureV.set(items.V || 0);
			figureY.set(items.Y || 0);

			if (getItems().every(([, count]) => count == $figureI)) {
				all.set($figureI);
				allValueCorrect = true;
			} else {
				allValueCorrect = false;
			}
			resetVars();
			bunchChange = false;

			selectPreset.set('');
		}
	}

	function createSpace() {
		if (bunchChange) {
			return;
		}
		space = [];
		for (let y = 0; y < $height; y++) {
			const line = [];
			for (let x = 0; x < $width; x++) {
				line.push(1);
			}
			space.push(line);
		}
		resetVars();
	}

	function onChangeAll(value) {
		if (bunchChange) {
			return;
		}
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
		resetVars();
	}

	function checkAllValueCorrect() {
		if (bunchChange) {
			return;
		}
		const items = getItems();
		allValueCorrect = items.every(([, count]) => count == $all);
		resetVars();
	}

	function onCellClick(x, y) {
		if (waitAnswer) {
			return;
		}

		space[y][x] = space[y][x] ? 0 : 1;
		resetVars();
	}

	function clearAll() {
		space.forEach(line => {
			for (let i = 0; i < line.length; i++) {
				line[i] = 0;
			}
		});
		space = space;
		resetVars();
	}

	function fillAll() {
		space.forEach(line => {
			for (let i = 0; i < line.length; i++) {
				line[i] = 1;
			}
		});
		space = space;
		resetVars();
	}

	let worker;

	function onStartStop() {
		if (waitAnswer) {
			stop();
		} else {
			start();
		}
	}

	function start() {
		waitAnswer = true;
		resetVars();

		const items = getItems();
		worker = new Worker('./build/worker.js');
		worker.postMessage({items, space});
		worker.onmessage = message => {
			waitAnswer = false;

			const [sol, error] = message.data;
			dataError = error;
			if (error) {
				return;
			}
			if (!sol) {
				dataError = 'No solution';
				return;
			}
			const itemsUnique = isItemsUnique(items);
			solution = printSolution(sol, itemsUnique);
		}
	}

	function stop() {
		worker.terminate();
		waitAnswer = false;
	}

	function resetVars() {
		solution = null;
		dataError = null;
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
		<Select variant="outlined" bind:value={$selectPreset} label="Presets" class="custom" disabled="{waitAnswer}">
			<Option value=""></Option>
			{#each presets as preset}
				<Option value={preset}>{preset.name}</Option>
			{/each}
		</Select>
		<div></div>
		<div></div>
		<div></div>
		<NumberField bind:value={$width} label="width" min="1" max="100" disabled="{waitAnswer}"/>
		<NumberField bind:value={$height} label="height" min="1" max="100" disabled="{waitAnswer}"/>
		<div></div>
		<div></div>
		<div></div>
		<div class:nocorrect="{!allValueCorrect}">
			<NumberField bind:value={$all} label="all" min="0" max="100" disabled="{waitAnswer}"/>
		</div>
	</div>
	<div class="options-line">
		<NumberField bind:value={$figureI} label="I" min="0" max="999" disabled="{waitAnswer}"/>
		<NumberField bind:value={$figureN} label="N" min="0" max="999" disabled="{waitAnswer}"/>
		<NumberField bind:value={$figureL} label="L" min="0" max="999" disabled="{waitAnswer}"/>
		<NumberField bind:value={$figureU} label="U" min="0" max="999" disabled="{waitAnswer}"/>
		<NumberField bind:value={$figureX} label="X" min="0" max="999" disabled="{waitAnswer}"/>
		<NumberField bind:value={$figureW} label="W" min="0" max="999" disabled="{waitAnswer}"/>
	</div>
	<div class="options-line">
		<NumberField bind:value={$figureP} label="P" min="0" max="999" disabled="{waitAnswer}"/>
		<NumberField bind:value={$figureF} label="F" min="0" max="999" disabled="{waitAnswer}"/>
		<NumberField bind:value={$figureZ} label="Z" min="0" max="999" disabled="{waitAnswer}"/>
		<NumberField bind:value={$figureT} label="T" min="0" max="999" disabled="{waitAnswer}"/>
		<NumberField bind:value={$figureV} label="V" min="0" max="999" disabled="{waitAnswer}"/>
		<NumberField bind:value={$figureY} label="Y" min="0" max="999" disabled="{waitAnswer}"/>
	</div>
	<div class="options-line">
		<Button variant="raised" on:click={clearAll} disabled="{waitAnswer}">
			<Label>Clear All</Label>
		</Button>
		<Button variant="raised" on:click={fillAll} disabled="{waitAnswer}">
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
							class:disabled="{waitAnswer}"
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
							class:disabled="{waitAnswer}"
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
	.disabled.disabled {
		cursor: default;
	}
	.empty_cell {
		background-color: #ffffff;
	}
	.error {
		color: #b71c1c;
	}
</style>
