import { Controller, Get, Header, Res } from '@nestjs/common';
import { Response } from 'express';
import client from 'prom-client';

@Controller()
export class MetricsController {
  @Get('metrics')
  @Header('Content-Type', client.register.contentType)
  async metrics(@Res() res: Response) {
    res.send(await client.register.metrics());
  }
}
