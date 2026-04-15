import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name)

  constructor() {
    super({
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'stdout', level: 'error' },
        { emit: 'stdout', level: 'info' },
        { emit: 'stdout', level: 'warn' },
      ],
    })
  }

  async onModuleInit(): Promise<void> {
    try {
      await this.$connect()
      this.logger.log('Database connected successfully')
    } catch (error) {
      this.logger.error('Failed to connect to database', error)
      throw error
    }
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect()
    this.logger.log('Database disconnected')
  }

  async cleanDatabase(): Promise<void> {
    if (process.env.NODE_ENV !== 'test') {
      throw new Error('cleanDatabase can only be called in test environment')
    }
    const models = Reflect.ownKeys(this).filter((key) => {
      return (
        typeof key === 'string' &&
        !key.startsWith('_') &&
        !key.startsWith('$') &&
        typeof (this as Record<string, unknown>)[key] === 'object'
      )
    })

    await Promise.all(
      models.map((model) => {
        const delegate = (this as Record<string | symbol, unknown>)[model] as {
          deleteMany?: () => Promise<unknown>
        }
        if (delegate && typeof delegate.deleteMany === 'function') {
          return delegate.deleteMany()
        }
        return Promise.resolve()
      })
    )
  }
}
