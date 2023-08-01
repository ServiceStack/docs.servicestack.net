import { ref, onMounted, computed } from "vue"
import { addScript } from "@servicestack/client"
import { RazorPress } from "../razor-press/index.mjs"

const addChartsJs = await addScript('../lib/js/chart.js')

const ChartJs = {
    template:`<div><canvas ref="chart"></canvas></div>`,
    props:['type','data','options'],
    setup(props) {
        const chart = ref()
        onMounted(async () => {
            await addChartsJs
            const options = props.options || {
                responsive: true,
                legend: {
                    position: "top"
                },
            }
            new Chart(chart.value, {
                type: props.type || "bar",
                data: props.data,
                options,
            })

        })
        return { chart }
    }
}

export default {
    components: { 
        ChartJs,
        RazorPress,
    }
}

