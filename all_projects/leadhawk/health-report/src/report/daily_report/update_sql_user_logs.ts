import { context } from '../../db/postgresql/prisma_context.js';
import { Source_System } from '../../enum/enum.js';
import { notify } from '../../utils/upload_util.js';

export async function update_sql_user_logs(
  pretaa_user_id: string,
  source_system_id: string,
  source_system: Source_System,
  device_sync_time: string,
  device_sync_time_utc: Date | string,
  info: object
) {
  try {
    console.log(`create_daily_report - ${source_system_id}, upsert device in sql db`);

    const user = await context.prisma.user.findUnique({
      where: {
        pretaa_user_id_source_system_id_source_system: {
          pretaa_user_id: pretaa_user_id,
          source_system_id: source_system_id,
          source_system: source_system,
        },
      },
    });

    if (!user) {
      console.log(`pretaa_user_id: ${pretaa_user_id} not available in user table`);
      return;
    }

    const device = await context.prisma.device.findUnique({
      where: { user_id: user.id },
    });

    if (!device) {
      console.log('user_id: not available in device table');
      return;
    }

    if (device_sync_time && device_sync_time_utc) {
      await context.prisma.userLogs.create({
        data: {
          user_id: device.user_id,
          device_id: device.id,
          device_sync_date_time_local: `${device_sync_time.split(' ').join('T')}Z`,
          device_sync_date_time_UTC: device_sync_time_utc,
          info: info,
        },
      });
    }
  } catch (error) {
    console.log(`update_user_logs - ${source_system_id}: error`, error);
    await notify(`update_user_logs - ${source_system_id}: error`, error);
  }
}
