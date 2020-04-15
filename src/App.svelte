<script>
	import Button, {Label} from '@smui/button';
	import {prepareData, Solver, isItemsUnique} from "../dlx/index.js";

	const items = [["I", 1], ["N", 1], ["L", 1], ["U", 1], ["X", 1], ["W", 1], ["P", 1], ["F", 1], ["Z", 1], ["T", 1], ["V", 1], ["Y", 1]];
	const space = [
		[1, 1, 1, 1, 1, 1, 1, 1],
		[1, 1, 1, 1, 1, 1, 1, 1],
		[1, 1, 1, 1, 1, 1, 1, 1],
		[1, 1, 1, 0, 0, 1, 1, 1],
		[1, 1, 1, 0, 0, 1, 1, 1],
		[1, 1, 1, 1, 1, 1, 1, 1],
		[1, 1, 1, 1, 1, 1, 1, 1],
		[1, 1, 1, 1, 1, 1, 1, 1]
	];

	function handleClick() {
		const [data, error] = prepareData(items, space);
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
</script>

<Button variant="raised" on:click={handleClick}>
	<Label>Кликни по мне</Label>
</Button>
