import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common'

/**
 * Postgres tenant provisioning removed. Businesses are ready immediately on DynamoDB.
 * Kept as a no-op provider so older imports do not break during cutover.
 */
@Injectable()
export class ProvisionQueue implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(ProvisionQueue.name)

  async onModuleInit() {
    this.logger.log('Provision queue disabled (DynamoDB — shops are ready on create)')
  }

  async onModuleDestroy() {}

  async enqueue(businessId: string): Promise<void> {
    this.logger.debug(`Skip provision for ${businessId}`)
  }
}
