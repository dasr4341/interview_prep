import { spawnSync } from 'child_process';
import path from 'path';

export function python_connect(data: any, path_after_src: string) {
  console.log('python_connect: start');

  try {
    const arg1 = JSON.stringify(data);
    const py = spawnSync('python3.8', [path.join(process.cwd(), 'python', 'src', path_after_src), arg1]);

    const res = py.stdout.toString();

    return res;
  } catch (error) {
    console.log('python_connect error', error);
    return null;
  }
}
