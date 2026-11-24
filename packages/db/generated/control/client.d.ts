import * as runtime from "@prisma/client/runtime/client";
import * as $Class from "./internal/class";
import * as Prisma from "./internal/prismaNamespace";
export * as $Enums from './enums';
export * from "./enums";
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
export declare const PrismaClient: $Class.PrismaClientConstructor;
export type PrismaClient<LogOpts extends Prisma.LogLevel = never, OmitOpts extends Prisma.PrismaClientOptions["omit"] = Prisma.PrismaClientOptions["omit"], ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = $Class.PrismaClient<LogOpts, OmitOpts, ExtArgs>;
export { Prisma };
/**
 * Model User
 *
 */
export type User = Prisma.UserModel;
/**
 * Model OtpChallenge
 *
 */
export type OtpChallenge = Prisma.OtpChallengeModel;
/**
 * Model Session
 *
 */
export type Session = Prisma.SessionModel;
/**
 * Model LoginEvent
 *
 */
export type LoginEvent = Prisma.LoginEventModel;
/**
 * Model Business
 *
 */
export type Business = Prisma.BusinessModel;
/**
 * Model Membership
 *
 */
export type Membership = Prisma.MembershipModel;
/**
 * Model StaffInvite
 *
 */
export type StaffInvite = Prisma.StaffInviteModel;
/**
 * Model TenantMigrationState
 *
 */
export type TenantMigrationState = Prisma.TenantMigrationStateModel;
/**
 * Model TenantMigrationRun
 *
 */
export type TenantMigrationRun = Prisma.TenantMigrationRunModel;
/**
 * Model Plan
 *
 */
export type Plan = Prisma.PlanModel;
/**
 * Model Subscription
 *
 */
export type Subscription = Prisma.SubscriptionModel;
/**
 * Model SubscriptionInvoice
 *
 */
export type SubscriptionInvoice = Prisma.SubscriptionInvoiceModel;
/**
 * Model ProcessedGatewayEvent
 *
 */
export type ProcessedGatewayEvent = Prisma.ProcessedGatewayEventModel;
/**
 * Model AppRelease
 *
 */
export type AppRelease = Prisma.AppReleaseModel;
/**
 * Model ConsentRecord
 *
 */
export type ConsentRecord = Prisma.ConsentRecordModel;
/**
 * Model BarcodeLookupCache
 *
 */
export type BarcodeLookupCache = Prisma.BarcodeLookupCacheModel;
/**
 * Model IdempotencyKey
 *
 */
export type IdempotencyKey = Prisma.IdempotencyKeyModel;
//# sourceMappingURL=client.d.ts.map