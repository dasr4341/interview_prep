import { EventEmitter } from 'node:events';

import { ReportController } from '../db/dynamodb/report_controller.js';
import { Node_Events } from '../enum/enum.js';

const event_emitter = new EventEmitter();
const report_controller = new ReportController();

interface SPECIAL_REPORT_429_Args {
  id: string;
  date: Date;
}

/*
events
*/
event_emitter.on(Node_Events.SPECIAL_REPORT_429, async (args: SPECIAL_REPORT_429_Args) => {
  const { id, date } = args;
  console.log(`node_event - ${id}:  ${Node_Events.SPECIAL_REPORT_429} event fired, updating fitbit_rate_limit_time`);

  await report_controller.update(id, { user_id: id, fitbit_rate_limit_time: date.toISOString() });
});

/*
emitter
*/
export async function node_event(event_name: Node_Events, args: SPECIAL_REPORT_429_Args) {
  event_emitter.emit(event_name, args);
}
