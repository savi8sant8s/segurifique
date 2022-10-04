import {
  BadRequestException,
  createHandler,
  Get,
  Param,
  Query,
} from 'next-api-decorators'
import {
  spiderScan,
  spiderStatus,
  urlAllowed,
  urlsAlreadyScanned,
} from '@/services'

class ScanHandler {
  @Get()
  async scanURL(@Query('url') url: string) {
    const allowed = urlAllowed(url)
    if (!allowed) {
      throw new BadRequestException('Válido apenas para sites institucionais')
    }
    const origin = new URL(url).origin
    const { sites } = await urlsAlreadyScanned()
    if (sites.includes(origin)) {
      return { status: 'SCANNED' }
    }
    return await spiderScan(origin)
  }

  @Get('/status/:scanId')
  async getScanStatus(@Param('scanId') scanId: string) {
    return await spiderStatus(scanId)
  }
}

export default createHandler(ScanHandler)
