import fs from 'node:fs/promises';
import path from 'node:path';

export async function check(daily_iteration: number, weekly_iteration: number, monthly_iteration: number, anomaly_iteration: number) {
  const _path = path.join(process.cwd(), 'debug', 'pdf');
  const _dir = (await fs.readdir(_path)).filter((e) => e.includes('.pdf'));

  const daily_dir = _dir.filter((e) => e.includes('daily'));
  const weekly_dir = _dir.filter((e) => e.includes('weekly'));
  const monthly_dir = _dir.filter((e) => e.includes('monthly'));
  const anomaly_dir = _dir.filter((e) => e.includes('special'));

  console.table({
    daily_report_status: `${daily_dir.length} / ${daily_iteration}`,
    weekly_report_status: `${weekly_dir.length} / ${weekly_iteration}`,
    monthly_report_status: `${monthly_dir.length} / ${monthly_iteration}`,
    anomaly_report_status: `${anomaly_dir.length} / ${anomaly_iteration}`,
  });
}
