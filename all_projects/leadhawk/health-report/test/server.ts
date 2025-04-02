import fs from 'node:fs/promises';
import path from 'node:path';
import express, { NextFunction, Request, Response } from 'express';

const app = express();
const host = 'localhost';
const port = 3003;

async function server() {
  try {
    /* status */
    app.get('/status', (req: Request, res: Response) => {
      res.status(200).json({ status: 'server running !' });
    });

    /* api routes */
    app.get(
      '/1/user/-/activities/:activity/date/:start_date/:end_date/1min/time/:start_time/:end_time.json',
      async (req: Request, res: Response) => {
        const { end_date, activity } = req.params;
        const _path = path.join(process.cwd(), 'test', 'files', 'daily_report', end_date, `${end_date}-${activity}.json`);
        const file = JSON.parse(await fs.readFile(_path, { encoding: 'utf-8' }));

        res.status(200).json(file);
      }
    );

    app.get('/1.2/user/-/sleep/date/:start_date/:end_date.json', async (req: Request, res: Response) => {
      const { end_date } = req.params;
      const _path = path.join(process.cwd(), 'test', 'files', 'daily_report', end_date, `${end_date}-sleep.json`);
      const file = JSON.parse(await fs.readFile(_path, { encoding: 'utf-8' }));

      res.status(200).json(file);
    });

    app.get('/1/user/-/temp/skin/date/:start_date/:end_date.json', async (req: Request, res: Response) => {
      const { end_date } = req.params;
      const _path = path.join(process.cwd(), 'test', 'files', 'daily_report', end_date, `${end_date}-temp.json`);
      const file = JSON.parse(await fs.readFile(_path, { encoding: 'utf-8' }));

      res.status(200).json(file);
    });

    app.get('/1/user/-/:activity/date/:start_date/:end_date.json', async (req: Request, res: Response) => {
      const { end_date, activity } = req.params;
      const _path = path.join(process.cwd(), 'test', 'files', 'daily_report', end_date, `${end_date}-${activity}.json`);
      const file = JSON.parse(await fs.readFile(_path, { encoding: 'utf-8' }));

      res.status(200).json(file);
    });

    app.get('/1/user/-/profile.json', async (req: Request, res: Response) => {
      const _path = path.join(process.cwd(), 'test', 'files', 'profile.json');
      const file = JSON.parse(await fs.readFile(_path, { encoding: 'utf-8' }));

      res.status(200).json(file);
    });

    app.get('/1/user/-/devices.json', async (req: Request, res: Response) => {
      const _path = path.join(process.cwd(), 'test', 'files', 'devices.json');
      const file = JSON.parse(await fs.readFile(_path, { encoding: 'utf-8' }));

      res.status(200).json(file);
    });

    /* page not found */
    app.use((req: Request, res: Response, next: NextFunction) => {
      res.status(404).json({ status: 'page not found' });
    });

    /* app error */
    app.use((error: any, req: Request, res: Response, next: NextFunction) => {
      res.status(500).json({ status: 'Internal server error' });
    });

    /* start */
    app.listen(port, host, () => {
      console.log(`🚀 server running at: http://${host}:${port}`);
    });
  } catch (error) {
    console.log('server error', error);
  }
}

void server();
