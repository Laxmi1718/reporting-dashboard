import { getComparisonMetrics } from './comparisonMetrics';
import { formatGrowth, formatDateTime } from './format';

const HEADER_FILL = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0A6CFF' } };
const HEADER_FONT = { bold: true, color: { argb: 'FFFFFFFF' } };

function styleHeaderRow(row) {
  row.eachCell((cell) => {
    cell.fill = HEADER_FILL;
    cell.font = HEADER_FONT;
  });
}

function autoWidth(sheet, minWidth = 12) {
  sheet.columns.forEach((column) => {
    let maxLength = minWidth;
    column.eachCell?.({ includeEmpty: true }, (cell) => {
      const length = cell.value ? String(cell.value).length : 0;
      if (length > maxLength) maxLength = length;
    });
    column.width = maxLength + 2;
  });
}

function addKeyValueSheet(workbook, name, rows) {
  const sheet = workbook.addWorksheet(name);
  const header = sheet.addRow(['Metric', 'Current Period', 'Previous Period']);
  styleHeaderRow(header);
  rows.forEach(({ label, current, previous }) => sheet.addRow([label, current, previous]));
  autoWidth(sheet);
}

function buildSummaryRows(currentPeriod, previousPeriod) {
  const rows = [
    { label: 'Report Period', current: currentPeriod.reportPeriod, previous: previousPeriod.reportPeriod },
    { label: 'Last Login', current: formatDateTime(currentPeriod.lastLogin), previous: formatDateTime(previousPeriod.lastLogin) },
    { label: 'Total Login', current: currentPeriod.totalLogin, previous: previousPeriod.totalLogin },
    { label: 'Active Users', current: currentPeriod.activeUsers, previous: previousPeriod.activeUsers },
    { label: 'Average Active Users / Day', current: currentPeriod.averageActiveUsersPerDay, previous: previousPeriod.averageActiveUsersPerDay },
    { label: 'Login Average Per User', current: currentPeriod.loginAveragePerUser, previous: previousPeriod.loginAveragePerUser },
  ];

  if (currentPeriod.newLogins !== undefined) {
    rows.push({ label: 'Unique Logins', current: currentPeriod.newLogins, previous: previousPeriod.newLogins });
  }

  return rows;
}

function buildTrainingRows(current, previous) {
  return [
    { label: 'Trainings Created', current: current.created, previous: previous?.created },
    { label: 'Trainings Completed', current: current.completed, previous: previous?.completed },
    { label: 'Assigned Users', current: current.assignedUsers, previous: previous?.assignedUsers },
    { label: 'Completed Users', current: current.completedUsers, previous: previous?.completedUsers },
  ];
}

function buildELearningRows(current, previous) {
  return [
    { label: 'Active Courses', current: current.activeCourses, previous: previous?.activeCourses },
    { label: 'Assigned Users', current: current.assignedUsers, previous: previous?.assignedUsers },
    { label: 'Completed Users', current: current.completedUsers, previous: previous?.completedUsers },
    { label: 'In Progress Users', current: current.inProgressUsers, previous: previous?.inProgressUsers },
  ];
}

function addTrendSheet(workbook, trend) {
  const sheet = workbook.addWorksheet('Trend');
  const header = sheet.addRow(['Period', 'Logins', 'Active Users']);
  styleHeaderRow(header);
  trend.forEach(({ label, logins, activeUsers }) => sheet.addRow([label, logins, activeUsers]));
  autoWidth(sheet);
}

function addComparisonSheet(workbook, currentPeriod, previousPeriod) {
  const sheet = workbook.addWorksheet('Comparison');
  const header = sheet.addRow(['Metric', 'Current Period', 'Previous Period', 'Difference', 'Growth %']);
  styleHeaderRow(header);

  getComparisonMetrics(currentPeriod).forEach((metric) => {
    const current = metric.get(currentPeriod);
    const previous = metric.get(previousPeriod);
    const difference = current - previous;
    const growth = Number(formatGrowth(current, previous).toFixed(1));
    sheet.addRow([metric.label, current, previous, difference, growth / 100]);
  });

  sheet.getColumn(5).numFmt = '+0.0%;-0.0%';
  autoWidth(sheet);
}

function slugify(value) {
  return String(value).replace(/[^a-z0-9]+/gi, '_');
}

export async function exportDashboardReport({ data, filters }) {
  if (!data?.currentPeriod || !data?.previousPeriod) {
    throw new Error('No report data to export yet');
  }

  const { currentPeriod, previousPeriod, trend } = data;
  // exceljs is a large dependency - load it only when someone actually
  // exports, instead of paying for it on every page load.
  const { default: ExcelJS } = await import('exceljs');
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Reporting Dashboard';

  addKeyValueSheet(workbook, 'Summary', buildSummaryRows(currentPeriod, previousPeriod));

  if (currentPeriod.trainingSessions) {
    addKeyValueSheet(workbook, 'Training', buildTrainingRows(currentPeriod.trainingSessions, previousPeriod.trainingSessions));
  }
  if (currentPeriod.eLearning) {
    addKeyValueSheet(workbook, 'E-Learning', buildELearningRows(currentPeriod.eLearning, previousPeriod.eLearning));
  }
  if (trend?.length) {
    addTrendSheet(workbook, trend);
  }
  addComparisonSheet(workbook, currentPeriod, previousPeriod);

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = URL.createObjectURL(blob);
  const filename = `Report_${slugify(filters.app)}_${slugify(filters.reportType)}_${filters.fromDate}_to_${filters.toDate}.xlsx`;

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
