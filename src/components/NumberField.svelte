<script>
    import Textfield from '@smui/textfield'

    let { value, label, disabled, min = Number.MIN_SAFE_INTEGER, max = Number.MAX_SAFE_INTEGER } = $props();

    let valueInternal = $derived(toLimits(value));

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
    onchange={onChange}
    label={label}
    input$min={min}
    input$max={max}
    {disabled}
    class="custom"
/>
