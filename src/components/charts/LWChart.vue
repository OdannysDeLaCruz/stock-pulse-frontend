<template>
  <div class="lw-chart" ref="chartContainer"></div>
</template>
<script setup lang="ts">
import { onMounted, onUnmounted, ref, defineProps, defineExpose, watch, type PropType } from 'vue';
import { createChart, AreaSeries, type AreaSeriesOptions, type IChartApi, type ISeriesApi, type DeepPartial, type ChartOptions, type AreaData } from 'lightweight-charts';

const props = defineProps({
  type: {
    type: String,
    default: 'line',
  },
  data: {
    type: Array as PropType<AreaData[]>,
    required: true,
  },
  autosize: {
    default: true,
    type: Boolean,
  },
  chartOptions: {
    type: Object as PropType<DeepPartial<ChartOptions>>,
  },
  timeScaleOptions: {
    type: Object,
  },
  priceScaleOptions: {
    type: Object,
  },
});


let series: ISeriesApi<'Area'> | null;
let chart: IChartApi | null;
const chartContainer = ref();

const designPositive = {
  lineColor: 'rgba(0, 135, 49, 100%)',
  color: 'rgba(74, 222, 128, 100%)',
  topColor: 'rgba(4, 165, 63, 100%)',
  bottomColor: 'rgba(124, 255, 172, 40%)',
}

const designNegative = {
  lineColor: 'rgba(255, 0, 0, 100%)',
  color: 'rgba(250, 0, 0, 100%)',
  topColor: 'rgba(255, 0, 0, 100%)',
  bottomColor: 'rgba(255, 0, 0, 10%)',
}

const getChart = () => {
  return chart;
};

const seriesOptions = ref<DeepPartial<AreaSeriesOptions>>({
  ...designPositive,
  lineWidth: 1,
});

// Creates the chart series and sets the data.
const addSeriesAndData = (data: { data: AreaData[], seriesOptions: DeepPartial<AreaSeriesOptions> | null }) => {
  if (data.data && data.seriesOptions && chart) {
    series = chart.addSeries(AreaSeries, data.seriesOptions);
    series.setData(data.data);
  }
};

onMounted(() => {
  // Create the Lightweight Charts Instance using the container ref.
  chart = createChart(chartContainer.value, props.chartOptions);
  addSeriesAndData({ data: props.data, seriesOptions: seriesOptions.value || null });

  if (props.priceScaleOptions) {
    chart.priceScale('').applyOptions(props.priceScaleOptions);
  }
  if (props.timeScaleOptions) {
    chart.timeScale().applyOptions(props.timeScaleOptions);
  }

  chart.timeScale().fitContent();

  if (props.autosize) {
    window.addEventListener('resize', resizeHandler);
  }

  chart.removePane(0);

  // setColor(props.data[props.data.length - 1].value, props.data[props.data.length - 2].value);

  setTimeout(() => {
    const watermark = chartContainer.value.querySelector('svg');
    if (watermark) {
      watermark.style.display = 'none'; // Ocultamos el SVG del logo
    }
  }, 100);
})

onUnmounted(() => {
  if (chart) {
    chart.remove();
    chart = null;
  }

  if (series) {
    series = null;
  }
});

watch(
  () => props.type,
  () => {
    if (series && chart) {
      chart.removeSeries(series);
    }
    addSeriesAndData({ data: props.data, seriesOptions: seriesOptions.value || null });
  }
);

watch(
  () => props.data,
  (newData) => {
    if (!series) return;
    if(!chart) return;
    chart.removeSeries(series)
    setColor(newData[newData.length - 1].value, newData[newData.length - 2].value);
    addSeriesAndData({ data: newData, seriesOptions: seriesOptions.value || null });
  }, { deep: true }
);

watch(
  () => props.autosize,
  (enabled) => {
    if (!enabled) {
      window.removeEventListener('resize', resizeHandler);
      return;
    }
    window.addEventListener('resize', resizeHandler);
  },
);

const fitContent = () => {
    if (!chart) {
        return;
    }
    chart.timeScale().fitContent();
};

const resizeHandler = () => {
  if (!chart || !chartContainer.value) return;
  const dimensions = chartContainer.value.getBoundingClientRect();
  chart.resize(dimensions.width, dimensions.height);
};

defineExpose({ fitContent, getChart });

const setColor = (lastValue: number, secondLastValue: number) => {
  if (lastValue < secondLastValue) {
    seriesOptions.value = { ...seriesOptions.value, ...designNegative };
  } else {
    seriesOptions.value = { ...seriesOptions.value, ...designPositive };
  }
};
</script>
<style scoped>
.lw-chart {
  height: 100%;
  width: 100%;
}
</style>
