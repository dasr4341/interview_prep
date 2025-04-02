import { Chart } from 'chart.js';

interface CustomTooltipContext {
  opacity: number;
  title: string[];
  body: CustomTooltipItem[];
  labelTextColor: string;
  labelPointStyle: string;
  labelTextColors: string[];
  xAlign: string;
  yAlign: string;
  width: number;
  height: number;
  x: number;
  y: number;
  chart: Chart;
  tooltip: any;
}

interface CustomTooltipItem {
  before: string;
  beforeColor: string;
  lines: string[];
  label: string;
  labelColor: string;
  textColor: string;
}

const getOrCreateTooltip = (chart: any) => {
  let tooltipEl = chart?.canvas?.parentNode?.querySelector('.custom-tooltip-arrow');

  if (!tooltipEl) {
    tooltipEl = document.createElement('div');
    tooltipEl.className = 'custom-tooltip-arrow';
    tooltipEl.style.background = 'rgba(0, 0, 0, 0.7)';
    tooltipEl.style.borderRadius = '3px';
    tooltipEl.style.color = 'white';
    tooltipEl.style.fontSize = '13px';
    tooltipEl.style.pointerEvents = 'none';
    tooltipEl.style.position = 'absolute';
    tooltipEl.style.transform = 'translate(-20%, 0)';
    tooltipEl.style.transition = 'all .1s ease';

    // Add the tooltip arrow element
    const tooltipArrow = document.createElement('div');
    tooltipArrow.className = 'custom-tooltip-arrow';
    tooltipEl.appendChild(tooltipArrow);

    const table = document.createElement('table');
    table.style.margin = '0px';

    tooltipEl.appendChild(table);
    chart?.canvas?.parentNode?.appendChild(tooltipEl);
  }
  return tooltipEl;
};

export const customTooltipHandler = (context: CustomTooltipContext) => {
  // Tooltip Element
  const { chart, tooltip } = context;
  const tooltipEl = getOrCreateTooltip(chart);

  // Hide if no tooltip
  if (tooltip.opacity === 0) {
    tooltipEl.style.opacity = String(0);
    return;
  }

  // Set Text
  if (tooltip.body) {
    const bodyLines = tooltip.body.map((b: { lines: number; }) => b.lines);

    const tableHead = document.createElement('thead');

    const tableBody = document.createElement('tbody');
    bodyLines.forEach((body: string, i: number) => {
      const colors = tooltip.labelColors[i];

      const span = document.createElement('span');
      span.style.background = colors.backgroundColor;
      span.style.borderColor = colors.borderColor;
      span.style.borderWidth = '2px';
      span.style.marginRight = '5px';
      span.style.height = '10px';
      span.style.width = '10px';
      span.style.display = 'inline-block';

      const tr = document.createElement('tr');
      tr.style.backgroundColor = 'inherit';
      tr.style.borderWidth = String(0);

      const td = document.createElement('td');
      td.style.borderWidth = String(0);

      const text = document.createTextNode(body);

      td.appendChild(span);
      td.appendChild(text);
      tr.appendChild(td);
      tableBody.appendChild(tr);
    });

    const tableRoot = tooltipEl.querySelector('table');

    // Remove old children
    while (tableRoot?.firstChild) {
      tableRoot.firstChild.remove();
    }

    // Add new children
    tableRoot?.appendChild(tableHead);
    tableRoot?.appendChild(tableBody);
  }

  // Position the tooltip arrow
  const arrow = tooltipEl.querySelector('.custom-tooltip-arrow');
  if (arrow) {
    arrow.style.left = tooltip.caretX + 'px';
  }

  const { offsetLeft: positionX, offsetTop: positionY } = chart.canvas;

  // Display, position, and set styles for font
  tooltipEl.style.opacity = String(1);
  tooltipEl.style.left = positionX + tooltip.caretX + 'px';
  tooltipEl.style.top = positionY + tooltip.caretY + 'px';
  tooltipEl.style.padding = tooltip.options.padding + 'px ' + tooltip.options.padding + 'px';
};