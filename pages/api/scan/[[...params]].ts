import { createHandler, Get, Param, Put, Query } from 'next-api-decorators'
import { spiderScan, spiderStatus, spiderStop } from '../../../services'

class ScanHandler {
  @Get()
  async scanURL(@Query('url') url: string) {
    return await spiderScan(url)
  }

  @Put('/stop/:scanId')
  async stopScan(@Param('scanId') scanId: string) {
    return await spiderStop(scanId)
  }

  @Get('/status/:scanId')
  async getScanStatus(@Param('scanId') scanId: string) {
    return await spiderStatus(scanId)
  }
}

export default createHandler(ScanHandler)
