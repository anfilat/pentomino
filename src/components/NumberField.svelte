<script>
    import Textfield from '@smui/textfield'

    export let value;
    export let label;
    export let min = Number.MIN_SAFE_INTEGER;
    export let max = Number.MAX_SAFE_INTEGER;

    let valueInternal;

    $: {
        value = toLimits(value);
        valueInternal = value;
    }

    function onChange() {
        valueInternal = toLimits(valueInternal);
        value = valueInternal;
    }

    function toLimits(val) {
        return Math.max(min, Math.min(max, val));
    }
</script>

<Textfield
    type="number"
    variant="outlined"
    bind:value={valueInternal}
    on:change={onChange}
    label="{label}"
    input$min="{min}"
    input$max="{max}"
    class="custom"
/>
