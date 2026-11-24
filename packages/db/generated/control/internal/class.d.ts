import * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "./prismaNamespace";
export type LogOptions<ClientOptions extends Prisma.PrismaClientOptions> = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never;
export interface PrismaClientConstructor {
    /**
   * ## Prisma Client
   *
   * Type-safe database client for TypeScript
   * @example
   * ```
   * const prisma = new PrismaClient({
   *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
   * })
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/client).
   */
    new <Options extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions, LogOpts extends LogOptions<Options> = LogOptions<Options>, OmitOpts extends Prisma.PrismaClientOptions['omit'] = Options extends {
        omit: infer U;
    } ? U : Prisma.PrismaClientOptions['omit'], ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs>(options: Prisma.PrismaClientConstructorArgs<Options>): PrismaClient<LogOpts, OmitOpts, ExtArgs>;
}
/**
 * ## Prisma Client
 *
 * Type-safe database client for TypeScript
 * @example
 * ```
 * const prisma = new PrismaClient({
 *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
 * })
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export interface PrismaClient<in LogOpts extends Prisma.LogLevel = never, in out OmitOpts extends Prisma.PrismaClientOptions['omit'] = Prisma.PrismaClientOptions['omit'], in out ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['other'];
    };
    $on<V extends LogOpts>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;
    /**
     * Connect with the database
     */
    $connect(): runtime.Types.Utils.JsPromise<void>;
    /**
     * Disconnect from the database
     */
    $disconnect(): runtime.Types.Utils.JsPromise<void>;
    /**
       * Executes a prepared raw query and returns the number of affected rows.
       * @example
       * ```
       * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
       * ```
       *
       * Read more in our [docs](https://pris.ly/d/raw-queries).
       */
    $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;
    /**
     * Executes a raw query and returns the number of affected rows.
     * Susceptible to SQL injections, see documentation.
     * @example
     * ```
     * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
     * ```
     *
     * Read more in our [docs](https://pris.ly/d/raw-queries).
     */
    $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;
    /**
     * Performs a prepared raw query and returns the `SELECT` data.
     * @example
     * ```
     * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
     * ```
     *
     * Read more in our [docs](https://pris.ly/d/raw-queries).
     */
    $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;
    /**
     * Performs a raw query and returns the `SELECT` data.
     * Susceptible to SQL injections, see documentation.
     * @example
     * ```
     * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
     * ```
     *
     * Read more in our [docs](https://pris.ly/d/raw-queries).
     */
    $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;
    /**
     * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
     * @example
     * ```
     * const [george, bob, alice] = await prisma.$transaction([
     *   prisma.user.create({ data: { name: 'George' } }),
     *   prisma.user.create({ data: { name: 'Bob' } }),
     *   prisma.user.create({ data: { name: 'Alice' } }),
     * ])
     * ```
     *
     * Read more in our [docs](https://www.prisma.io/docs/orm/prisma-client/queries/transactions).
     */
    $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: {
        maxWait?: number;
        timeout?: number;
        isolationLevel?: Prisma.TransactionIsolationLevel;
    }): runtime.Types.Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>;
    $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => runtime.Types.Utils.JsPromise<R>, options?: {
        maxWait?: number;
        timeout?: number;
        isolationLevel?: Prisma.TransactionIsolationLevel;
    }): runtime.Types.Utils.JsPromise<R>;
    $extends: runtime.Types.Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<OmitOpts>, ExtArgs, runtime.Types.Utils.Call<Prisma.TypeMapCb<OmitOpts>, {
        extArgs: ExtArgs;
    }>>;
    /**
 * `prisma.user`: Exposes CRUD operations for the **User** model.
  * Example usage:
  * ```ts
  * // Fetch zero or more Users
  * const users = await prisma.user.findMany()
  * ```
  */
    get user(): Prisma.UserDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.otpChallenge`: Exposes CRUD operations for the **OtpChallenge** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more OtpChallenges
      * const otpChallenges = await prisma.otpChallenge.findMany()
      * ```
      */
    get otpChallenge(): Prisma.OtpChallengeDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.session`: Exposes CRUD operations for the **Session** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Sessions
      * const sessions = await prisma.session.findMany()
      * ```
      */
    get session(): Prisma.SessionDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.loginEvent`: Exposes CRUD operations for the **LoginEvent** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more LoginEvents
      * const loginEvents = await prisma.loginEvent.findMany()
      * ```
      */
    get loginEvent(): Prisma.LoginEventDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.business`: Exposes CRUD operations for the **Business** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Businesses
      * const businesses = await prisma.business.findMany()
      * ```
      */
    get business(): Prisma.BusinessDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.membership`: Exposes CRUD operations for the **Membership** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Memberships
      * const memberships = await prisma.membership.findMany()
      * ```
      */
    get membership(): Prisma.MembershipDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.staffInvite`: Exposes CRUD operations for the **StaffInvite** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more StaffInvites
      * const staffInvites = await prisma.staffInvite.findMany()
      * ```
      */
    get staffInvite(): Prisma.StaffInviteDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.tenantMigrationState`: Exposes CRUD operations for the **TenantMigrationState** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more TenantMigrationStates
      * const tenantMigrationStates = await prisma.tenantMigrationState.findMany()
      * ```
      */
    get tenantMigrationState(): Prisma.TenantMigrationStateDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.tenantMigrationRun`: Exposes CRUD operations for the **TenantMigrationRun** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more TenantMigrationRuns
      * const tenantMigrationRuns = await prisma.tenantMigrationRun.findMany()
      * ```
      */
    get tenantMigrationRun(): Prisma.TenantMigrationRunDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.plan`: Exposes CRUD operations for the **Plan** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Plans
      * const plans = await prisma.plan.findMany()
      * ```
      */
    get plan(): Prisma.PlanDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.subscription`: Exposes CRUD operations for the **Subscription** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Subscriptions
      * const subscriptions = await prisma.subscription.findMany()
      * ```
      */
    get subscription(): Prisma.SubscriptionDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.subscriptionInvoice`: Exposes CRUD operations for the **SubscriptionInvoice** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more SubscriptionInvoices
      * const subscriptionInvoices = await prisma.subscriptionInvoice.findMany()
      * ```
      */
    get subscriptionInvoice(): Prisma.SubscriptionInvoiceDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.processedGatewayEvent`: Exposes CRUD operations for the **ProcessedGatewayEvent** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more ProcessedGatewayEvents
      * const processedGatewayEvents = await prisma.processedGatewayEvent.findMany()
      * ```
      */
    get processedGatewayEvent(): Prisma.ProcessedGatewayEventDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.appRelease`: Exposes CRUD operations for the **AppRelease** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more AppReleases
      * const appReleases = await prisma.appRelease.findMany()
      * ```
      */
    get appRelease(): Prisma.AppReleaseDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.consentRecord`: Exposes CRUD operations for the **ConsentRecord** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more ConsentRecords
      * const consentRecords = await prisma.consentRecord.findMany()
      * ```
      */
    get consentRecord(): Prisma.ConsentRecordDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.barcodeLookupCache`: Exposes CRUD operations for the **BarcodeLookupCache** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more BarcodeLookupCaches
      * const barcodeLookupCaches = await prisma.barcodeLookupCache.findMany()
      * ```
      */
    get barcodeLookupCache(): Prisma.BarcodeLookupCacheDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.idempotencyKey`: Exposes CRUD operations for the **IdempotencyKey** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more IdempotencyKeys
      * const idempotencyKeys = await prisma.idempotencyKey.findMany()
      * ```
      */
    get idempotencyKey(): Prisma.IdempotencyKeyDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
}
export declare function getPrismaClientClass(): PrismaClientConstructor;
//# sourceMappingURL=class.d.ts.map