/**
 * Client
 **/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types; // general types
import $Public = runtime.Types.Public;
import $Utils = runtime.Types.Utils;
import $Extensions = runtime.Types.Extensions;
import $Result = runtime.Types.Result;

export type PrismaPromise<T> = $Public.PrismaPromise<T>;

/**
 * Model User
 *
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>;
/**
 * Model Account
 *
 */
export type Account = $Result.DefaultSelection<Prisma.$AccountPayload>;
/**
 * Model Profile
 *
 */
export type Profile = $Result.DefaultSelection<Prisma.$ProfilePayload>;
/**
 * Model Follow
 *
 */
export type Follow = $Result.DefaultSelection<Prisma.$FollowPayload>;
/**
 * Model Post
 *
 */
export type Post = $Result.DefaultSelection<Prisma.$PostPayload>;
/**
 * Model Asset
 *
 */
export type Asset = $Result.DefaultSelection<Prisma.$AssetPayload>;
/**
 * Model Comment
 *
 */
export type Comment = $Result.DefaultSelection<Prisma.$CommentPayload>;
/**
 * Model Like
 *
 */
export type Like = $Result.DefaultSelection<Prisma.$LikePayload>;
/**
 * Model Chat
 *
 */
export type Chat = $Result.DefaultSelection<Prisma.$ChatPayload>;
/**
 * Model Message
 *
 */
export type Message = $Result.DefaultSelection<Prisma.$MessagePayload>;
/**
 * Model Notification
 *
 */
export type Notification =
  $Result.DefaultSelection<Prisma.$NotificationPayload>;

/**
 * Enums
 */
export namespace $Enums {
  export const NotificationType: {
    LIKE: 'LIKE';
    COMMENT: 'COMMENT';
    FOLLOW: 'FOLLOW';
    SYSTEM: 'SYSTEM';
    MENTION: 'MENTION';
  };

  export type NotificationType =
    (typeof NotificationType)[keyof typeof NotificationType];

  export const AssetType: {
    IMAGE: 'IMAGE';
    VIDEO: 'VIDEO';
  };

  export type AssetType = (typeof AssetType)[keyof typeof AssetType];

  export const FollowStatus: {
    PENDING: 'PENDING';
    ACCEPTED: 'ACCEPTED';
  };

  export type FollowStatus = (typeof FollowStatus)[keyof typeof FollowStatus];

  export const ChatType: {
    PRIVATE: 'PRIVATE';
    GROUP: 'GROUP';
  };

  export type ChatType = (typeof ChatType)[keyof typeof ChatType];
}

export type NotificationType = $Enums.NotificationType;

export const NotificationType: typeof $Enums.NotificationType;

export type AssetType = $Enums.AssetType;

export const AssetType: typeof $Enums.AssetType;

export type FollowStatus = $Enums.FollowStatus;

export const FollowStatus: typeof $Enums.FollowStatus;

export type ChatType = $Enums.ChatType;

export const ChatType: typeof $Enums.ChatType;

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions
    ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition>
      ? Prisma.GetEvents<ClientOptions['log']>
      : never
    : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] };

  /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(
    optionsArg?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>,
  );
  $on<V extends U>(
    eventType: V,
    callback: (
      event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent,
    ) => void,
  ): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(
    query: TemplateStringsArray | Prisma.Sql,
    ...values: any[]
  ): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(
    query: string,
    ...values: any[]
  ): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(
    query: TemplateStringsArray | Prisma.Sql,
    ...values: any[]
  ): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(
    query: string,
    ...values: any[]
  ): Prisma.PrismaPromise<T>;

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
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(
    arg: [...P],
    options?: { isolationLevel?: Prisma.TransactionIsolationLevel },
  ): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>;

  $transaction<R>(
    fn: (
      prisma: Omit<PrismaClient, runtime.ITXClientDenyList>,
    ) => $Utils.JsPromise<R>,
    options?: {
      maxWait?: number;
      timeout?: number;
      isolationLevel?: Prisma.TransactionIsolationLevel;
    },
  ): $Utils.JsPromise<R>;

  $extends: $Extensions.ExtendsHook<
    'extends',
    Prisma.TypeMapCb<ClientOptions>,
    ExtArgs,
    $Utils.Call<
      Prisma.TypeMapCb<ClientOptions>,
      {
        extArgs: ExtArgs;
      }
    >
  >;

  /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.account`: Exposes CRUD operations for the **Account** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more Accounts
   * const accounts = await prisma.account.findMany()
   * ```
   */
  get account(): Prisma.AccountDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.profile`: Exposes CRUD operations for the **Profile** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more Profiles
   * const profiles = await prisma.profile.findMany()
   * ```
   */
  get profile(): Prisma.ProfileDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.follow`: Exposes CRUD operations for the **Follow** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more Follows
   * const follows = await prisma.follow.findMany()
   * ```
   */
  get follow(): Prisma.FollowDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.post`: Exposes CRUD operations for the **Post** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more Posts
   * const posts = await prisma.post.findMany()
   * ```
   */
  get post(): Prisma.PostDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.asset`: Exposes CRUD operations for the **Asset** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more Assets
   * const assets = await prisma.asset.findMany()
   * ```
   */
  get asset(): Prisma.AssetDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.comment`: Exposes CRUD operations for the **Comment** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more Comments
   * const comments = await prisma.comment.findMany()
   * ```
   */
  get comment(): Prisma.CommentDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.like`: Exposes CRUD operations for the **Like** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more Likes
   * const likes = await prisma.like.findMany()
   * ```
   */
  get like(): Prisma.LikeDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.chat`: Exposes CRUD operations for the **Chat** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more Chats
   * const chats = await prisma.chat.findMany()
   * ```
   */
  get chat(): Prisma.ChatDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.message`: Exposes CRUD operations for the **Message** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more Messages
   * const messages = await prisma.message.findMany()
   * ```
   */
  get message(): Prisma.MessageDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.notification`: Exposes CRUD operations for the **Notification** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more Notifications
   * const notifications = await prisma.notification.findMany()
   * ```
   */
  get notification(): Prisma.NotificationDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF;

  export type PrismaPromise<T> = $Public.PrismaPromise<T>;

  /**
   * Validator
   */
  export import validator = runtime.Public.validator;

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError;
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError;
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError;
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError;
  export import PrismaClientValidationError = runtime.PrismaClientValidationError;

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag;
  export import empty = runtime.empty;
  export import join = runtime.join;
  export import raw = runtime.raw;
  export import Sql = runtime.Sql;

  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal;

  export type DecimalJsLike = runtime.DecimalJsLike;

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics;
  export type Metric<T> = runtime.Metric<T>;
  export type MetricHistogram = runtime.MetricHistogram;
  export type MetricHistogramBucket = runtime.MetricHistogramBucket;

  /**
   * Extensions
   */
  export import Extension = $Extensions.UserArgs;
  export import getExtensionContext = runtime.Extensions.getExtensionContext;
  export import Args = $Public.Args;
  export import Payload = $Public.Payload;
  export import Result = $Public.Result;
  export import Exact = $Public.Exact;

  /**
   * Prisma Client JS version: 6.19.2
   * Query Engine version: c2990dca591cba766e3b7ef5d9e8a84796e47ab7
   */
  export type PrismaVersion = {
    client: string;
  };

  export const prismaVersion: PrismaVersion;

  /**
   * Utility Types
   */

  export import Bytes = runtime.Bytes;
  export import JsonObject = runtime.JsonObject;
  export import JsonArray = runtime.JsonArray;
  export import JsonValue = runtime.JsonValue;
  export import InputJsonObject = runtime.InputJsonObject;
  export import InputJsonArray = runtime.InputJsonArray;
  export import InputJsonValue = runtime.InputJsonValue;

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
     * Type of `Prisma.DbNull`.
     *
     * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
     *
     * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
     */
    class DbNull {
      private DbNull: never;
      private constructor();
    }

    /**
     * Type of `Prisma.JsonNull`.
     *
     * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
     *
     * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
     */
    class JsonNull {
      private JsonNull: never;
      private constructor();
    }

    /**
     * Type of `Prisma.AnyNull`.
     *
     * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
     *
     * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
     */
    class AnyNull {
      private AnyNull: never;
      private constructor();
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull;

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull;

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull;

  type SelectAndInclude = {
    select: any;
    include: any;
  };

  type SelectAndOmit = {
    select: any;
    omit: any;
  };

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> =
    T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<
    T extends (...args: any) => $Utils.JsPromise<any>,
  > = PromiseType<ReturnType<T>>;

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
    [P in K]: T[P];
  };

  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K;
  }[keyof T];

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K;
  };

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>;

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  } & (T extends SelectAndInclude
    ? 'Please either choose `select` or `include`.'
    : T extends SelectAndOmit
      ? 'Please either choose `select` or `omit`.'
      : {});

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  } & K;

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> = T extends object
    ? U extends object
      ? (Without<T, U> & U) | (Without<U, T> & T)
      : U
    : T;

  /**
   * Is T a Record?
   */
  type IsObject<T extends any> =
    T extends Array<any>
      ? False
      : T extends Date
        ? False
        : T extends Uint8Array
          ? False
          : T extends bigint
            ? False
            : T extends object
              ? True
              : False;

  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T;

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O>; // With K possibilities
    }[K];

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>;

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<
    __Either<O, K>
  >;

  type _Either<O extends object, K extends Key, strict extends Boolean> = {
    1: EitherStrict<O, K>;
    0: EitherLoose<O, K>;
  }[strict];

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1,
  > = O extends unknown ? _Either<O, K, strict> : never;

  export type Union = any;

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K];
  } & {};

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never;

  export type Overwrite<O extends object, O1 extends object> = {
    [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<
    Overwrite<
      U,
      {
        [K in keyof U]-?: At<U, K>;
      }
    >
  >;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O
    ? O[K]
    : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown
    ? AtStrict<O, K>
    : never;
  export type At<
    O extends object,
    K extends Key,
    strict extends Boolean = 1,
  > = {
    1: AtStrict<O, K>;
    0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function
    ? A
    : {
        [K in keyof A]: A[K];
      } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
      ?
          | (K extends keyof O ? { [P in K]: O[P] } & O : O)
          | ({ [P in keyof O as P extends K ? P : never]-?: O[P] } & O)
      : never
  >;

  type _Strict<U, _U = U> = U extends unknown
    ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>>
    : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False;

  // /**
  // 1
  // */
  export type True = 1;

  /**
  0
  */
  export type False = 0;

  export type Not<B extends Boolean> = {
    0: 1;
    1: 0;
  }[B];

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
      ? 1
      : 0;

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >;

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0;
      1: 1;
    };
    1: {
      0: 1;
      1: 1;
    };
  }[B1][B2];

  export type Keys<U extends Union> = U extends unknown ? keyof U : never;

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;

  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object
    ? {
        [P in keyof T]: P extends keyof O ? O[P] : never;
      }
    : never;

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>,
  > = IsObject<T> extends True ? U : T;

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<
            UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never
          >
        : never
      : {} extends FieldPaths<T[K]>
        ? never
        : K;
  }[keyof T];

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never;
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>;
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T;

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<
    T,
    K extends Enumerable<keyof T> | keyof T,
  > = Prisma__Pick<T, MaybeTupleToUnion<K>>;

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}`
    ? never
    : T;

  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>;

  type FieldRefInputType<Model, FieldType> = Model extends never
    ? never
    : FieldRef<Model, FieldType>;

  export const ModelName: {
    User: 'User';
    Account: 'Account';
    Profile: 'Profile';
    Follow: 'Follow';
    Post: 'Post';
    Asset: 'Asset';
    Comment: 'Comment';
    Like: 'Like';
    Chat: 'Chat';
    Message: 'Message';
    Notification: 'Notification';
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName];

  export type Datasources = {
    db?: Datasource;
  };

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<
    { extArgs: $Extensions.InternalArgs },
    $Utils.Record<string, any>
  > {
    returns: Prisma.TypeMap<
      this['params']['extArgs'],
      ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}
    >;
  }

  export type TypeMap<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > = {
    globalOmitOptions: {
      omit: GlobalOmitOptions;
    };
    meta: {
      modelProps:
        | 'user'
        | 'account'
        | 'profile'
        | 'follow'
        | 'post'
        | 'asset'
        | 'comment'
        | 'like'
        | 'chat'
        | 'message'
        | 'notification';
      txIsolationLevel: Prisma.TransactionIsolationLevel;
    };
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>;
        fields: Prisma.UserFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UserPayload>;
          };
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UserPayload>;
          };
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[];
          };
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UserPayload>;
          };
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[];
          };
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UserPayload>;
          };
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UserPayload>;
          };
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[];
          };
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$UserPayload>;
          };
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregateUser>;
          };
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>;
            result: $Utils.Optional<UserGroupByOutputType>[];
          };
          count: {
            args: Prisma.UserCountArgs<ExtArgs>;
            result: $Utils.Optional<UserCountAggregateOutputType> | number;
          };
        };
      };
      Account: {
        payload: Prisma.$AccountPayload<ExtArgs>;
        fields: Prisma.AccountFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.AccountFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AccountPayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.AccountFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>;
          };
          findFirst: {
            args: Prisma.AccountFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AccountPayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.AccountFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>;
          };
          findMany: {
            args: Prisma.AccountFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>[];
          };
          create: {
            args: Prisma.AccountCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>;
          };
          createMany: {
            args: Prisma.AccountCreateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          createManyAndReturn: {
            args: Prisma.AccountCreateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>[];
          };
          delete: {
            args: Prisma.AccountDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>;
          };
          update: {
            args: Prisma.AccountUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>;
          };
          deleteMany: {
            args: Prisma.AccountDeleteManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateMany: {
            args: Prisma.AccountUpdateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateManyAndReturn: {
            args: Prisma.AccountUpdateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>[];
          };
          upsert: {
            args: Prisma.AccountUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>;
          };
          aggregate: {
            args: Prisma.AccountAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregateAccount>;
          };
          groupBy: {
            args: Prisma.AccountGroupByArgs<ExtArgs>;
            result: $Utils.Optional<AccountGroupByOutputType>[];
          };
          count: {
            args: Prisma.AccountCountArgs<ExtArgs>;
            result: $Utils.Optional<AccountCountAggregateOutputType> | number;
          };
        };
      };
      Profile: {
        payload: Prisma.$ProfilePayload<ExtArgs>;
        fields: Prisma.ProfileFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.ProfileFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ProfilePayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.ProfileFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ProfilePayload>;
          };
          findFirst: {
            args: Prisma.ProfileFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ProfilePayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.ProfileFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ProfilePayload>;
          };
          findMany: {
            args: Prisma.ProfileFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ProfilePayload>[];
          };
          create: {
            args: Prisma.ProfileCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ProfilePayload>;
          };
          createMany: {
            args: Prisma.ProfileCreateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          createManyAndReturn: {
            args: Prisma.ProfileCreateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ProfilePayload>[];
          };
          delete: {
            args: Prisma.ProfileDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ProfilePayload>;
          };
          update: {
            args: Prisma.ProfileUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ProfilePayload>;
          };
          deleteMany: {
            args: Prisma.ProfileDeleteManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateMany: {
            args: Prisma.ProfileUpdateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateManyAndReturn: {
            args: Prisma.ProfileUpdateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ProfilePayload>[];
          };
          upsert: {
            args: Prisma.ProfileUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ProfilePayload>;
          };
          aggregate: {
            args: Prisma.ProfileAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregateProfile>;
          };
          groupBy: {
            args: Prisma.ProfileGroupByArgs<ExtArgs>;
            result: $Utils.Optional<ProfileGroupByOutputType>[];
          };
          count: {
            args: Prisma.ProfileCountArgs<ExtArgs>;
            result: $Utils.Optional<ProfileCountAggregateOutputType> | number;
          };
        };
      };
      Follow: {
        payload: Prisma.$FollowPayload<ExtArgs>;
        fields: Prisma.FollowFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.FollowFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$FollowPayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.FollowFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$FollowPayload>;
          };
          findFirst: {
            args: Prisma.FollowFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$FollowPayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.FollowFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$FollowPayload>;
          };
          findMany: {
            args: Prisma.FollowFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$FollowPayload>[];
          };
          create: {
            args: Prisma.FollowCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$FollowPayload>;
          };
          createMany: {
            args: Prisma.FollowCreateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          createManyAndReturn: {
            args: Prisma.FollowCreateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$FollowPayload>[];
          };
          delete: {
            args: Prisma.FollowDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$FollowPayload>;
          };
          update: {
            args: Prisma.FollowUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$FollowPayload>;
          };
          deleteMany: {
            args: Prisma.FollowDeleteManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateMany: {
            args: Prisma.FollowUpdateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateManyAndReturn: {
            args: Prisma.FollowUpdateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$FollowPayload>[];
          };
          upsert: {
            args: Prisma.FollowUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$FollowPayload>;
          };
          aggregate: {
            args: Prisma.FollowAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregateFollow>;
          };
          groupBy: {
            args: Prisma.FollowGroupByArgs<ExtArgs>;
            result: $Utils.Optional<FollowGroupByOutputType>[];
          };
          count: {
            args: Prisma.FollowCountArgs<ExtArgs>;
            result: $Utils.Optional<FollowCountAggregateOutputType> | number;
          };
        };
      };
      Post: {
        payload: Prisma.$PostPayload<ExtArgs>;
        fields: Prisma.PostFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.PostFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$PostPayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.PostFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$PostPayload>;
          };
          findFirst: {
            args: Prisma.PostFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$PostPayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.PostFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$PostPayload>;
          };
          findMany: {
            args: Prisma.PostFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$PostPayload>[];
          };
          create: {
            args: Prisma.PostCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$PostPayload>;
          };
          createMany: {
            args: Prisma.PostCreateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          createManyAndReturn: {
            args: Prisma.PostCreateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$PostPayload>[];
          };
          delete: {
            args: Prisma.PostDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$PostPayload>;
          };
          update: {
            args: Prisma.PostUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$PostPayload>;
          };
          deleteMany: {
            args: Prisma.PostDeleteManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateMany: {
            args: Prisma.PostUpdateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateManyAndReturn: {
            args: Prisma.PostUpdateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$PostPayload>[];
          };
          upsert: {
            args: Prisma.PostUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$PostPayload>;
          };
          aggregate: {
            args: Prisma.PostAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregatePost>;
          };
          groupBy: {
            args: Prisma.PostGroupByArgs<ExtArgs>;
            result: $Utils.Optional<PostGroupByOutputType>[];
          };
          count: {
            args: Prisma.PostCountArgs<ExtArgs>;
            result: $Utils.Optional<PostCountAggregateOutputType> | number;
          };
        };
      };
      Asset: {
        payload: Prisma.$AssetPayload<ExtArgs>;
        fields: Prisma.AssetFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.AssetFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AssetPayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.AssetFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AssetPayload>;
          };
          findFirst: {
            args: Prisma.AssetFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AssetPayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.AssetFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AssetPayload>;
          };
          findMany: {
            args: Prisma.AssetFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AssetPayload>[];
          };
          create: {
            args: Prisma.AssetCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AssetPayload>;
          };
          createMany: {
            args: Prisma.AssetCreateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          createManyAndReturn: {
            args: Prisma.AssetCreateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AssetPayload>[];
          };
          delete: {
            args: Prisma.AssetDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AssetPayload>;
          };
          update: {
            args: Prisma.AssetUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AssetPayload>;
          };
          deleteMany: {
            args: Prisma.AssetDeleteManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateMany: {
            args: Prisma.AssetUpdateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateManyAndReturn: {
            args: Prisma.AssetUpdateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AssetPayload>[];
          };
          upsert: {
            args: Prisma.AssetUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$AssetPayload>;
          };
          aggregate: {
            args: Prisma.AssetAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregateAsset>;
          };
          groupBy: {
            args: Prisma.AssetGroupByArgs<ExtArgs>;
            result: $Utils.Optional<AssetGroupByOutputType>[];
          };
          count: {
            args: Prisma.AssetCountArgs<ExtArgs>;
            result: $Utils.Optional<AssetCountAggregateOutputType> | number;
          };
        };
      };
      Comment: {
        payload: Prisma.$CommentPayload<ExtArgs>;
        fields: Prisma.CommentFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.CommentFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$CommentPayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.CommentFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$CommentPayload>;
          };
          findFirst: {
            args: Prisma.CommentFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$CommentPayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.CommentFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$CommentPayload>;
          };
          findMany: {
            args: Prisma.CommentFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$CommentPayload>[];
          };
          create: {
            args: Prisma.CommentCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$CommentPayload>;
          };
          createMany: {
            args: Prisma.CommentCreateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          createManyAndReturn: {
            args: Prisma.CommentCreateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$CommentPayload>[];
          };
          delete: {
            args: Prisma.CommentDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$CommentPayload>;
          };
          update: {
            args: Prisma.CommentUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$CommentPayload>;
          };
          deleteMany: {
            args: Prisma.CommentDeleteManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateMany: {
            args: Prisma.CommentUpdateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateManyAndReturn: {
            args: Prisma.CommentUpdateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$CommentPayload>[];
          };
          upsert: {
            args: Prisma.CommentUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$CommentPayload>;
          };
          aggregate: {
            args: Prisma.CommentAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregateComment>;
          };
          groupBy: {
            args: Prisma.CommentGroupByArgs<ExtArgs>;
            result: $Utils.Optional<CommentGroupByOutputType>[];
          };
          count: {
            args: Prisma.CommentCountArgs<ExtArgs>;
            result: $Utils.Optional<CommentCountAggregateOutputType> | number;
          };
        };
      };
      Like: {
        payload: Prisma.$LikePayload<ExtArgs>;
        fields: Prisma.LikeFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.LikeFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$LikePayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.LikeFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$LikePayload>;
          };
          findFirst: {
            args: Prisma.LikeFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$LikePayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.LikeFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$LikePayload>;
          };
          findMany: {
            args: Prisma.LikeFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$LikePayload>[];
          };
          create: {
            args: Prisma.LikeCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$LikePayload>;
          };
          createMany: {
            args: Prisma.LikeCreateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          createManyAndReturn: {
            args: Prisma.LikeCreateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$LikePayload>[];
          };
          delete: {
            args: Prisma.LikeDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$LikePayload>;
          };
          update: {
            args: Prisma.LikeUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$LikePayload>;
          };
          deleteMany: {
            args: Prisma.LikeDeleteManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateMany: {
            args: Prisma.LikeUpdateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateManyAndReturn: {
            args: Prisma.LikeUpdateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$LikePayload>[];
          };
          upsert: {
            args: Prisma.LikeUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$LikePayload>;
          };
          aggregate: {
            args: Prisma.LikeAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregateLike>;
          };
          groupBy: {
            args: Prisma.LikeGroupByArgs<ExtArgs>;
            result: $Utils.Optional<LikeGroupByOutputType>[];
          };
          count: {
            args: Prisma.LikeCountArgs<ExtArgs>;
            result: $Utils.Optional<LikeCountAggregateOutputType> | number;
          };
        };
      };
      Chat: {
        payload: Prisma.$ChatPayload<ExtArgs>;
        fields: Prisma.ChatFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.ChatFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ChatPayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.ChatFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ChatPayload>;
          };
          findFirst: {
            args: Prisma.ChatFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ChatPayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.ChatFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ChatPayload>;
          };
          findMany: {
            args: Prisma.ChatFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ChatPayload>[];
          };
          create: {
            args: Prisma.ChatCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ChatPayload>;
          };
          createMany: {
            args: Prisma.ChatCreateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          createManyAndReturn: {
            args: Prisma.ChatCreateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ChatPayload>[];
          };
          delete: {
            args: Prisma.ChatDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ChatPayload>;
          };
          update: {
            args: Prisma.ChatUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ChatPayload>;
          };
          deleteMany: {
            args: Prisma.ChatDeleteManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateMany: {
            args: Prisma.ChatUpdateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateManyAndReturn: {
            args: Prisma.ChatUpdateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ChatPayload>[];
          };
          upsert: {
            args: Prisma.ChatUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$ChatPayload>;
          };
          aggregate: {
            args: Prisma.ChatAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregateChat>;
          };
          groupBy: {
            args: Prisma.ChatGroupByArgs<ExtArgs>;
            result: $Utils.Optional<ChatGroupByOutputType>[];
          };
          count: {
            args: Prisma.ChatCountArgs<ExtArgs>;
            result: $Utils.Optional<ChatCountAggregateOutputType> | number;
          };
        };
      };
      Message: {
        payload: Prisma.$MessagePayload<ExtArgs>;
        fields: Prisma.MessageFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.MessageFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$MessagePayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.MessageFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>;
          };
          findFirst: {
            args: Prisma.MessageFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$MessagePayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.MessageFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>;
          };
          findMany: {
            args: Prisma.MessageFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>[];
          };
          create: {
            args: Prisma.MessageCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>;
          };
          createMany: {
            args: Prisma.MessageCreateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          createManyAndReturn: {
            args: Prisma.MessageCreateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>[];
          };
          delete: {
            args: Prisma.MessageDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>;
          };
          update: {
            args: Prisma.MessageUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>;
          };
          deleteMany: {
            args: Prisma.MessageDeleteManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateMany: {
            args: Prisma.MessageUpdateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateManyAndReturn: {
            args: Prisma.MessageUpdateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>[];
          };
          upsert: {
            args: Prisma.MessageUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>;
          };
          aggregate: {
            args: Prisma.MessageAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregateMessage>;
          };
          groupBy: {
            args: Prisma.MessageGroupByArgs<ExtArgs>;
            result: $Utils.Optional<MessageGroupByOutputType>[];
          };
          count: {
            args: Prisma.MessageCountArgs<ExtArgs>;
            result: $Utils.Optional<MessageCountAggregateOutputType> | number;
          };
        };
      };
      Notification: {
        payload: Prisma.$NotificationPayload<ExtArgs>;
        fields: Prisma.NotificationFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.NotificationFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.NotificationFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>;
          };
          findFirst: {
            args: Prisma.NotificationFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.NotificationFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>;
          };
          findMany: {
            args: Prisma.NotificationFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>[];
          };
          create: {
            args: Prisma.NotificationCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>;
          };
          createMany: {
            args: Prisma.NotificationCreateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          createManyAndReturn: {
            args: Prisma.NotificationCreateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>[];
          };
          delete: {
            args: Prisma.NotificationDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>;
          };
          update: {
            args: Prisma.NotificationUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>;
          };
          deleteMany: {
            args: Prisma.NotificationDeleteManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateMany: {
            args: Prisma.NotificationUpdateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateManyAndReturn: {
            args: Prisma.NotificationUpdateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>[];
          };
          upsert: {
            args: Prisma.NotificationUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>;
          };
          aggregate: {
            args: Prisma.NotificationAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregateNotification>;
          };
          groupBy: {
            args: Prisma.NotificationGroupByArgs<ExtArgs>;
            result: $Utils.Optional<NotificationGroupByOutputType>[];
          };
          count: {
            args: Prisma.NotificationCountArgs<ExtArgs>;
            result:
              | $Utils.Optional<NotificationCountAggregateOutputType>
              | number;
          };
        };
      };
    };
  } & {
    other: {
      payload: any;
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]];
          result: any;
        };
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]];
          result: any;
        };
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]];
          result: any;
        };
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]];
          result: any;
        };
      };
    };
  };
  export const defineExtension: $Extensions.ExtendsHook<
    'define',
    Prisma.TypeMapCb,
    $Extensions.DefaultArgs
  >;
  export type DefaultPrismaClient = PrismaClient;
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal';
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources;
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string;
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat;
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     *
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     *
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     *
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[];
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number;
      timeout?: number;
      isolationLevel?: Prisma.TransactionIsolationLevel;
    };
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory | null;
    /**
     * Global configuration for omitting model fields by default.
     *
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig;
  }
  export type GlobalOmitConfig = {
    user?: UserOmit;
    account?: AccountOmit;
    profile?: ProfileOmit;
    follow?: FollowOmit;
    post?: PostOmit;
    asset?: AssetOmit;
    comment?: CommentOmit;
    like?: LikeOmit;
    chat?: ChatOmit;
    message?: MessageOmit;
    notification?: NotificationOmit;
  };

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error';
  export type LogDefinition = {
    level: LogLevel;
    emit: 'stdout' | 'event';
  };

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> =
    T extends Array<LogLevel | LogDefinition> ? GetLogType<T[number]> : never;

  export type QueryEvent = {
    timestamp: Date;
    query: string;
    params: string;
    duration: number;
    target: string;
  };

  export type LogEvent = {
    timestamp: Date;
    message: string;
    target: string;
  };
  /* End Types for Logging */

  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy';

  // tested in getLogLevel.test.ts
  export function getLogLevel(
    log: Array<LogLevel | LogDefinition>,
  ): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<
    Prisma.DefaultPrismaClient,
    runtime.ITXClientDenyList
  >;

  export type Datasource = {
    url?: string;
  };

  /**
   * Count Types
   */

  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    following: number;
    followers: number;
    posts: number;
    likes: number;
    comments: number;
    chats: number;
    createdChats: number;
    sentMessages: number;
    recievedNotifications: number;
    triggeredNotifications: number;
  };

  export type UserCountOutputTypeSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    following?: boolean | UserCountOutputTypeCountFollowingArgs;
    followers?: boolean | UserCountOutputTypeCountFollowersArgs;
    posts?: boolean | UserCountOutputTypeCountPostsArgs;
    likes?: boolean | UserCountOutputTypeCountLikesArgs;
    comments?: boolean | UserCountOutputTypeCountCommentsArgs;
    chats?: boolean | UserCountOutputTypeCountChatsArgs;
    createdChats?: boolean | UserCountOutputTypeCountCreatedChatsArgs;
    sentMessages?: boolean | UserCountOutputTypeCountSentMessagesArgs;
    recievedNotifications?:
      | boolean
      | UserCountOutputTypeCountRecievedNotificationsArgs;
    triggeredNotifications?:
      | boolean
      | UserCountOutputTypeCountTriggeredNotificationsArgs;
  };

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null;
  };

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountFollowingArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: FollowWhereInput;
  };

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountFollowersArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: FollowWhereInput;
  };

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountPostsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: PostWhereInput;
  };

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountLikesArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: LikeWhereInput;
  };

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountCommentsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: CommentWhereInput;
  };

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountChatsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: ChatWhereInput;
  };

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountCreatedChatsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: ChatWhereInput;
  };

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountSentMessagesArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: MessageWhereInput;
  };

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountRecievedNotificationsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: NotificationWhereInput;
  };

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountTriggeredNotificationsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: NotificationWhereInput;
  };

  /**
   * Count Type PostCountOutputType
   */

  export type PostCountOutputType = {
    assets: number;
    comments: number;
    likes: number;
  };

  export type PostCountOutputTypeSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    assets?: boolean | PostCountOutputTypeCountAssetsArgs;
    comments?: boolean | PostCountOutputTypeCountCommentsArgs;
    likes?: boolean | PostCountOutputTypeCountLikesArgs;
  };

  // Custom InputTypes
  /**
   * PostCountOutputType without action
   */
  export type PostCountOutputTypeDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the PostCountOutputType
     */
    select?: PostCountOutputTypeSelect<ExtArgs> | null;
  };

  /**
   * PostCountOutputType without action
   */
  export type PostCountOutputTypeCountAssetsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: AssetWhereInput;
  };

  /**
   * PostCountOutputType without action
   */
  export type PostCountOutputTypeCountCommentsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: CommentWhereInput;
  };

  /**
   * PostCountOutputType without action
   */
  export type PostCountOutputTypeCountLikesArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: LikeWhereInput;
  };

  /**
   * Count Type CommentCountOutputType
   */

  export type CommentCountOutputType = {
    children: number;
    likes: number;
  };

  export type CommentCountOutputTypeSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    children?: boolean | CommentCountOutputTypeCountChildrenArgs;
    likes?: boolean | CommentCountOutputTypeCountLikesArgs;
  };

  // Custom InputTypes
  /**
   * CommentCountOutputType without action
   */
  export type CommentCountOutputTypeDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the CommentCountOutputType
     */
    select?: CommentCountOutputTypeSelect<ExtArgs> | null;
  };

  /**
   * CommentCountOutputType without action
   */
  export type CommentCountOutputTypeCountChildrenArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: CommentWhereInput;
  };

  /**
   * CommentCountOutputType without action
   */
  export type CommentCountOutputTypeCountLikesArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: LikeWhereInput;
  };

  /**
   * Count Type ChatCountOutputType
   */

  export type ChatCountOutputType = {
    members: number;
    messages: number;
  };

  export type ChatCountOutputTypeSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    members?: boolean | ChatCountOutputTypeCountMembersArgs;
    messages?: boolean | ChatCountOutputTypeCountMessagesArgs;
  };

  // Custom InputTypes
  /**
   * ChatCountOutputType without action
   */
  export type ChatCountOutputTypeDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the ChatCountOutputType
     */
    select?: ChatCountOutputTypeSelect<ExtArgs> | null;
  };

  /**
   * ChatCountOutputType without action
   */
  export type ChatCountOutputTypeCountMembersArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: UserWhereInput;
  };

  /**
   * ChatCountOutputType without action
   */
  export type ChatCountOutputTypeCountMessagesArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: MessageWhereInput;
  };

  /**
   * Count Type MessageCountOutputType
   */

  export type MessageCountOutputType = {
    assets: number;
  };

  export type MessageCountOutputTypeSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    assets?: boolean | MessageCountOutputTypeCountAssetsArgs;
  };

  // Custom InputTypes
  /**
   * MessageCountOutputType without action
   */
  export type MessageCountOutputTypeDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the MessageCountOutputType
     */
    select?: MessageCountOutputTypeSelect<ExtArgs> | null;
  };

  /**
   * MessageCountOutputType without action
   */
  export type MessageCountOutputTypeCountAssetsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: AssetWhereInput;
  };

  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null;
    _min: UserMinAggregateOutputType | null;
    _max: UserMaxAggregateOutputType | null;
  };

  export type UserMinAggregateOutputType = {
    id: string | null;
    createdAt: Date | null;
    deletedAt: Date | null;
  };

  export type UserMaxAggregateOutputType = {
    id: string | null;
    createdAt: Date | null;
    deletedAt: Date | null;
  };

  export type UserCountAggregateOutputType = {
    id: number;
    createdAt: number;
    deletedAt: number;
    _all: number;
  };

  export type UserMinAggregateInputType = {
    id?: true;
    createdAt?: true;
    deletedAt?: true;
  };

  export type UserMaxAggregateInputType = {
    id?: true;
    createdAt?: true;
    deletedAt?: true;
  };

  export type UserCountAggregateInputType = {
    id?: true;
    createdAt?: true;
    deletedAt?: true;
    _all?: true;
  };

  export type UserAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Users from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Users.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned Users
     **/
    _count?: true | UserCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: UserMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: UserMaxAggregateInputType;
  };

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
    [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>;
  };

  export type UserGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: UserWhereInput;
    orderBy?:
      | UserOrderByWithAggregationInput
      | UserOrderByWithAggregationInput[];
    by: UserScalarFieldEnum[] | UserScalarFieldEnum;
    having?: UserScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: UserCountAggregateInputType | true;
    _min?: UserMinAggregateInputType;
    _max?: UserMaxAggregateInputType;
  };

  export type UserGroupByOutputType = {
    id: string;
    createdAt: Date;
    deletedAt: Date | null;
    _count: UserCountAggregateOutputType | null;
    _min: UserMinAggregateOutputType | null;
    _max: UserMaxAggregateOutputType | null;
  };

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> & {
        [P in keyof T & keyof UserGroupByOutputType]: P extends '_count'
          ? T[P] extends boolean
            ? number
            : GetScalarType<T[P], UserGroupByOutputType[P]>
          : GetScalarType<T[P], UserGroupByOutputType[P]>;
      }
    >
  >;

  export type UserSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      createdAt?: boolean;
      deletedAt?: boolean;
      account?: boolean | User$accountArgs<ExtArgs>;
      profile?: boolean | User$profileArgs<ExtArgs>;
      following?: boolean | User$followingArgs<ExtArgs>;
      followers?: boolean | User$followersArgs<ExtArgs>;
      posts?: boolean | User$postsArgs<ExtArgs>;
      likes?: boolean | User$likesArgs<ExtArgs>;
      comments?: boolean | User$commentsArgs<ExtArgs>;
      chats?: boolean | User$chatsArgs<ExtArgs>;
      createdChats?: boolean | User$createdChatsArgs<ExtArgs>;
      sentMessages?: boolean | User$sentMessagesArgs<ExtArgs>;
      recievedNotifications?: boolean | User$recievedNotificationsArgs<ExtArgs>;
      triggeredNotifications?:
        | boolean
        | User$triggeredNotificationsArgs<ExtArgs>;
      _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['user']
  >;

  export type UserSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      createdAt?: boolean;
      deletedAt?: boolean;
    },
    ExtArgs['result']['user']
  >;

  export type UserSelectUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      createdAt?: boolean;
      deletedAt?: boolean;
    },
    ExtArgs['result']['user']
  >;

  export type UserSelectScalar = {
    id?: boolean;
    createdAt?: boolean;
    deletedAt?: boolean;
  };

  export type UserOmit<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetOmit<
    'id' | 'createdAt' | 'deletedAt',
    ExtArgs['result']['user']
  >;
  export type UserInclude<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    account?: boolean | User$accountArgs<ExtArgs>;
    profile?: boolean | User$profileArgs<ExtArgs>;
    following?: boolean | User$followingArgs<ExtArgs>;
    followers?: boolean | User$followersArgs<ExtArgs>;
    posts?: boolean | User$postsArgs<ExtArgs>;
    likes?: boolean | User$likesArgs<ExtArgs>;
    comments?: boolean | User$commentsArgs<ExtArgs>;
    chats?: boolean | User$chatsArgs<ExtArgs>;
    createdChats?: boolean | User$createdChatsArgs<ExtArgs>;
    sentMessages?: boolean | User$sentMessagesArgs<ExtArgs>;
    recievedNotifications?: boolean | User$recievedNotificationsArgs<ExtArgs>;
    triggeredNotifications?: boolean | User$triggeredNotificationsArgs<ExtArgs>;
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>;
  };
  export type UserIncludeCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {};
  export type UserIncludeUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {};

  export type $UserPayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    name: 'User';
    objects: {
      account: Prisma.$AccountPayload<ExtArgs> | null;
      profile: Prisma.$ProfilePayload<ExtArgs> | null;
      following: Prisma.$FollowPayload<ExtArgs>[];
      followers: Prisma.$FollowPayload<ExtArgs>[];
      posts: Prisma.$PostPayload<ExtArgs>[];
      likes: Prisma.$LikePayload<ExtArgs>[];
      comments: Prisma.$CommentPayload<ExtArgs>[];
      chats: Prisma.$ChatPayload<ExtArgs>[];
      createdChats: Prisma.$ChatPayload<ExtArgs>[];
      sentMessages: Prisma.$MessagePayload<ExtArgs>[];
      recievedNotifications: Prisma.$NotificationPayload<ExtArgs>[];
      triggeredNotifications: Prisma.$NotificationPayload<ExtArgs>[];
    };
    scalars: $Extensions.GetPayloadResult<
      {
        id: string;
        createdAt: Date;
        deletedAt: Date | null;
      },
      ExtArgs['result']['user']
    >;
    composites: {};
  };

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> =
    $Result.GetResult<Prisma.$UserPayload, S>;

  type UserCountArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: UserCountAggregateInputType | true;
  };

  export interface UserDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>['model']['User'];
      meta: { name: 'User' };
    };
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(
      args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>,
    ): Prisma__UserClient<
      $Result.GetResult<
        Prisma.$UserPayload<ExtArgs>,
        T,
        'findUnique',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(
      args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>,
    ): Prisma__UserClient<
      $Result.GetResult<
        Prisma.$UserPayload<ExtArgs>,
        T,
        'findUniqueOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(
      args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>,
    ): Prisma__UserClient<
      $Result.GetResult<
        Prisma.$UserPayload<ExtArgs>,
        T,
        'findFirst',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(
      args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>,
    ): Prisma__UserClient<
      $Result.GetResult<
        Prisma.$UserPayload<ExtArgs>,
        T,
        'findFirstOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     *
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     *
     */
    findMany<T extends UserFindManyArgs>(
      args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$UserPayload<ExtArgs>,
        T,
        'findMany',
        GlobalOmitOptions
      >
    >;

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     *
     */
    create<T extends UserCreateArgs>(
      args: SelectSubset<T, UserCreateArgs<ExtArgs>>,
    ): Prisma__UserClient<
      $Result.GetResult<
        Prisma.$UserPayload<ExtArgs>,
        T,
        'create',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends UserCreateManyArgs>(
      args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(
      args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$UserPayload<ExtArgs>,
        T,
        'createManyAndReturn',
        GlobalOmitOptions
      >
    >;

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     *
     */
    delete<T extends UserDeleteArgs>(
      args: SelectSubset<T, UserDeleteArgs<ExtArgs>>,
    ): Prisma__UserClient<
      $Result.GetResult<
        Prisma.$UserPayload<ExtArgs>,
        T,
        'delete',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends UserUpdateArgs>(
      args: SelectSubset<T, UserUpdateArgs<ExtArgs>>,
    ): Prisma__UserClient<
      $Result.GetResult<
        Prisma.$UserPayload<ExtArgs>,
        T,
        'update',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends UserDeleteManyArgs>(
      args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends UserUpdateManyArgs>(
      args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(
      args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$UserPayload<ExtArgs>,
        T,
        'updateManyAndReturn',
        GlobalOmitOptions
      >
    >;

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(
      args: SelectSubset<T, UserUpsertArgs<ExtArgs>>,
    ): Prisma__UserClient<
      $Result.GetResult<
        Prisma.$UserPayload<ExtArgs>,
        T,
        'upsert',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
     **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends UserAggregateArgs>(
      args: Subset<T, UserAggregateArgs>,
    ): Prisma.PrismaPromise<GetUserAggregateType<T>>;

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<
        Keys<MaybeTupleToUnion<T['orderBy']>>
      >,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [
                      Error,
                      'Field ',
                      P,
                      ` in "having" needs to be provided in "by"`,
                    ];
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors,
    ): {} extends InputErrors
      ? GetUserGroupByPayload<T>
      : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the User model
     */
    readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    account<T extends User$accountArgs<ExtArgs> = {}>(
      args?: Subset<T, User$accountArgs<ExtArgs>>,
    ): Prisma__AccountClient<
      $Result.GetResult<
        Prisma.$AccountPayload<ExtArgs>,
        T,
        'findUniqueOrThrow',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;
    profile<T extends User$profileArgs<ExtArgs> = {}>(
      args?: Subset<T, User$profileArgs<ExtArgs>>,
    ): Prisma__ProfileClient<
      $Result.GetResult<
        Prisma.$ProfilePayload<ExtArgs>,
        T,
        'findUniqueOrThrow',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;
    following<T extends User$followingArgs<ExtArgs> = {}>(
      args?: Subset<T, User$followingArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      | $Result.GetResult<
          Prisma.$FollowPayload<ExtArgs>,
          T,
          'findMany',
          GlobalOmitOptions
        >
      | Null
    >;
    followers<T extends User$followersArgs<ExtArgs> = {}>(
      args?: Subset<T, User$followersArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      | $Result.GetResult<
          Prisma.$FollowPayload<ExtArgs>,
          T,
          'findMany',
          GlobalOmitOptions
        >
      | Null
    >;
    posts<T extends User$postsArgs<ExtArgs> = {}>(
      args?: Subset<T, User$postsArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      | $Result.GetResult<
          Prisma.$PostPayload<ExtArgs>,
          T,
          'findMany',
          GlobalOmitOptions
        >
      | Null
    >;
    likes<T extends User$likesArgs<ExtArgs> = {}>(
      args?: Subset<T, User$likesArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      | $Result.GetResult<
          Prisma.$LikePayload<ExtArgs>,
          T,
          'findMany',
          GlobalOmitOptions
        >
      | Null
    >;
    comments<T extends User$commentsArgs<ExtArgs> = {}>(
      args?: Subset<T, User$commentsArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      | $Result.GetResult<
          Prisma.$CommentPayload<ExtArgs>,
          T,
          'findMany',
          GlobalOmitOptions
        >
      | Null
    >;
    chats<T extends User$chatsArgs<ExtArgs> = {}>(
      args?: Subset<T, User$chatsArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      | $Result.GetResult<
          Prisma.$ChatPayload<ExtArgs>,
          T,
          'findMany',
          GlobalOmitOptions
        >
      | Null
    >;
    createdChats<T extends User$createdChatsArgs<ExtArgs> = {}>(
      args?: Subset<T, User$createdChatsArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      | $Result.GetResult<
          Prisma.$ChatPayload<ExtArgs>,
          T,
          'findMany',
          GlobalOmitOptions
        >
      | Null
    >;
    sentMessages<T extends User$sentMessagesArgs<ExtArgs> = {}>(
      args?: Subset<T, User$sentMessagesArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      | $Result.GetResult<
          Prisma.$MessagePayload<ExtArgs>,
          T,
          'findMany',
          GlobalOmitOptions
        >
      | Null
    >;
    recievedNotifications<
      T extends User$recievedNotificationsArgs<ExtArgs> = {},
    >(
      args?: Subset<T, User$recievedNotificationsArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      | $Result.GetResult<
          Prisma.$NotificationPayload<ExtArgs>,
          T,
          'findMany',
          GlobalOmitOptions
        >
      | Null
    >;
    triggeredNotifications<
      T extends User$triggeredNotificationsArgs<ExtArgs> = {},
    >(
      args?: Subset<T, User$triggeredNotificationsArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      | $Result.GetResult<
          Prisma.$NotificationPayload<ExtArgs>,
          T,
          'findMany',
          GlobalOmitOptions
        >
      | Null
    >;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | null,
      onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null,
    ): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | null,
    ): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | null): $Utils.JsPromise<T>;
  }

  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<'User', 'String'>;
    readonly createdAt: FieldRef<'User', 'DateTime'>;
    readonly deletedAt: FieldRef<'User', 'DateTime'>;
  }

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null;
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput;
  };

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null;
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput;
  };

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null;
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Users from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Users.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[];
  };

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null;
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Users from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Users.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[];
  };

  /**
   * User findMany
   */
  export type UserFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null;
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Users from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Users.
     */
    skip?: number;
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[];
  };

  /**
   * User create
   */
  export type UserCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null;
    /**
     * The data needed to create a User.
     */
    data?: XOR<UserCreateInput, UserUncheckedCreateInput>;
  };

  /**
   * User createMany
   */
  export type UserCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null;
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * User update
   */
  export type UserUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null;
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>;
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput;
  };

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>;
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput;
    /**
     * Limit how many Users to update.
     */
    limit?: number;
  };

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null;
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>;
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput;
    /**
     * Limit how many Users to update.
     */
    limit?: number;
  };

  /**
   * User upsert
   */
  export type UserUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null;
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput;
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>;
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>;
  };

  /**
   * User delete
   */
  export type UserDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null;
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput;
  };

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput;
    /**
     * Limit how many Users to delete.
     */
    limit?: number;
  };

  /**
   * User.account
   */
  export type User$accountArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null;
    where?: AccountWhereInput;
  };

  /**
   * User.profile
   */
  export type User$profileArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileInclude<ExtArgs> | null;
    where?: ProfileWhereInput;
  };

  /**
   * User.following
   */
  export type User$followingArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Follow
     */
    select?: FollowSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Follow
     */
    omit?: FollowOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FollowInclude<ExtArgs> | null;
    where?: FollowWhereInput;
    orderBy?: FollowOrderByWithRelationInput | FollowOrderByWithRelationInput[];
    cursor?: FollowWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: FollowScalarFieldEnum | FollowScalarFieldEnum[];
  };

  /**
   * User.followers
   */
  export type User$followersArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Follow
     */
    select?: FollowSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Follow
     */
    omit?: FollowOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FollowInclude<ExtArgs> | null;
    where?: FollowWhereInput;
    orderBy?: FollowOrderByWithRelationInput | FollowOrderByWithRelationInput[];
    cursor?: FollowWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: FollowScalarFieldEnum | FollowScalarFieldEnum[];
  };

  /**
   * User.posts
   */
  export type User$postsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Post
     */
    omit?: PostOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostInclude<ExtArgs> | null;
    where?: PostWhereInput;
    orderBy?: PostOrderByWithRelationInput | PostOrderByWithRelationInput[];
    cursor?: PostWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: PostScalarFieldEnum | PostScalarFieldEnum[];
  };

  /**
   * User.likes
   */
  export type User$likesArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Like
     */
    select?: LikeSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Like
     */
    omit?: LikeOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LikeInclude<ExtArgs> | null;
    where?: LikeWhereInput;
    orderBy?: LikeOrderByWithRelationInput | LikeOrderByWithRelationInput[];
    cursor?: LikeWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: LikeScalarFieldEnum | LikeScalarFieldEnum[];
  };

  /**
   * User.comments
   */
  export type User$commentsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Comment
     */
    omit?: CommentOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentInclude<ExtArgs> | null;
    where?: CommentWhereInput;
    orderBy?:
      | CommentOrderByWithRelationInput
      | CommentOrderByWithRelationInput[];
    cursor?: CommentWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: CommentScalarFieldEnum | CommentScalarFieldEnum[];
  };

  /**
   * User.chats
   */
  export type User$chatsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Chat
     */
    select?: ChatSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Chat
     */
    omit?: ChatOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatInclude<ExtArgs> | null;
    where?: ChatWhereInput;
    orderBy?: ChatOrderByWithRelationInput | ChatOrderByWithRelationInput[];
    cursor?: ChatWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: ChatScalarFieldEnum | ChatScalarFieldEnum[];
  };

  /**
   * User.createdChats
   */
  export type User$createdChatsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Chat
     */
    select?: ChatSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Chat
     */
    omit?: ChatOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatInclude<ExtArgs> | null;
    where?: ChatWhereInput;
    orderBy?: ChatOrderByWithRelationInput | ChatOrderByWithRelationInput[];
    cursor?: ChatWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: ChatScalarFieldEnum | ChatScalarFieldEnum[];
  };

  /**
   * User.sentMessages
   */
  export type User$sentMessagesArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null;
    where?: MessageWhereInput;
    orderBy?:
      | MessageOrderByWithRelationInput
      | MessageOrderByWithRelationInput[];
    cursor?: MessageWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: MessageScalarFieldEnum | MessageScalarFieldEnum[];
  };

  /**
   * User.recievedNotifications
   */
  export type User$recievedNotificationsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null;
    where?: NotificationWhereInput;
    orderBy?:
      | NotificationOrderByWithRelationInput
      | NotificationOrderByWithRelationInput[];
    cursor?: NotificationWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: NotificationScalarFieldEnum | NotificationScalarFieldEnum[];
  };

  /**
   * User.triggeredNotifications
   */
  export type User$triggeredNotificationsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null;
    where?: NotificationWhereInput;
    orderBy?:
      | NotificationOrderByWithRelationInput
      | NotificationOrderByWithRelationInput[];
    cursor?: NotificationWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: NotificationScalarFieldEnum | NotificationScalarFieldEnum[];
  };

  /**
   * User without action
   */
  export type UserDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null;
  };

  /**
   * Model Account
   */

  export type AggregateAccount = {
    _count: AccountCountAggregateOutputType | null;
    _min: AccountMinAggregateOutputType | null;
    _max: AccountMaxAggregateOutputType | null;
  };

  export type AccountMinAggregateOutputType = {
    id: string | null;
    userId: string | null;
    username: string | null;
    email: string | null;
    phoneNumber: string | null;
    passwordHash: string | null;
    updatedAt: Date | null;
  };

  export type AccountMaxAggregateOutputType = {
    id: string | null;
    userId: string | null;
    username: string | null;
    email: string | null;
    phoneNumber: string | null;
    passwordHash: string | null;
    updatedAt: Date | null;
  };

  export type AccountCountAggregateOutputType = {
    id: number;
    userId: number;
    username: number;
    email: number;
    phoneNumber: number;
    passwordHash: number;
    updatedAt: number;
    _all: number;
  };

  export type AccountMinAggregateInputType = {
    id?: true;
    userId?: true;
    username?: true;
    email?: true;
    phoneNumber?: true;
    passwordHash?: true;
    updatedAt?: true;
  };

  export type AccountMaxAggregateInputType = {
    id?: true;
    userId?: true;
    username?: true;
    email?: true;
    phoneNumber?: true;
    passwordHash?: true;
    updatedAt?: true;
  };

  export type AccountCountAggregateInputType = {
    id?: true;
    userId?: true;
    username?: true;
    email?: true;
    phoneNumber?: true;
    passwordHash?: true;
    updatedAt?: true;
    _all?: true;
  };

  export type AccountAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which Account to aggregate.
     */
    where?: AccountWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Accounts to fetch.
     */
    orderBy?:
      | AccountOrderByWithRelationInput
      | AccountOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: AccountWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Accounts.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned Accounts
     **/
    _count?: true | AccountCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: AccountMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: AccountMaxAggregateInputType;
  };

  export type GetAccountAggregateType<T extends AccountAggregateArgs> = {
    [P in keyof T & keyof AggregateAccount]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAccount[P]>
      : GetScalarType<T[P], AggregateAccount[P]>;
  };

  export type AccountGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: AccountWhereInput;
    orderBy?:
      | AccountOrderByWithAggregationInput
      | AccountOrderByWithAggregationInput[];
    by: AccountScalarFieldEnum[] | AccountScalarFieldEnum;
    having?: AccountScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: AccountCountAggregateInputType | true;
    _min?: AccountMinAggregateInputType;
    _max?: AccountMaxAggregateInputType;
  };

  export type AccountGroupByOutputType = {
    id: string;
    userId: string;
    username: string;
    email: string | null;
    phoneNumber: string | null;
    passwordHash: string | null;
    updatedAt: Date | null;
    _count: AccountCountAggregateOutputType | null;
    _min: AccountMinAggregateOutputType | null;
    _max: AccountMaxAggregateOutputType | null;
  };

  type GetAccountGroupByPayload<T extends AccountGroupByArgs> =
    Prisma.PrismaPromise<
      Array<
        PickEnumerable<AccountGroupByOutputType, T['by']> & {
          [P in keyof T & keyof AccountGroupByOutputType]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AccountGroupByOutputType[P]>
            : GetScalarType<T[P], AccountGroupByOutputType[P]>;
        }
      >
    >;

  export type AccountSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      userId?: boolean;
      username?: boolean;
      email?: boolean;
      phoneNumber?: boolean;
      passwordHash?: boolean;
      updatedAt?: boolean;
      user?: boolean | UserDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['account']
  >;

  export type AccountSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      userId?: boolean;
      username?: boolean;
      email?: boolean;
      phoneNumber?: boolean;
      passwordHash?: boolean;
      updatedAt?: boolean;
      user?: boolean | UserDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['account']
  >;

  export type AccountSelectUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      userId?: boolean;
      username?: boolean;
      email?: boolean;
      phoneNumber?: boolean;
      passwordHash?: boolean;
      updatedAt?: boolean;
      user?: boolean | UserDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['account']
  >;

  export type AccountSelectScalar = {
    id?: boolean;
    userId?: boolean;
    username?: boolean;
    email?: boolean;
    phoneNumber?: boolean;
    passwordHash?: boolean;
    updatedAt?: boolean;
  };

  export type AccountOmit<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetOmit<
    | 'id'
    | 'userId'
    | 'username'
    | 'email'
    | 'phoneNumber'
    | 'passwordHash'
    | 'updatedAt',
    ExtArgs['result']['account']
  >;
  export type AccountInclude<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    user?: boolean | UserDefaultArgs<ExtArgs>;
  };
  export type AccountIncludeCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    user?: boolean | UserDefaultArgs<ExtArgs>;
  };
  export type AccountIncludeUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    user?: boolean | UserDefaultArgs<ExtArgs>;
  };

  export type $AccountPayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    name: 'Account';
    objects: {
      user: Prisma.$UserPayload<ExtArgs>;
    };
    scalars: $Extensions.GetPayloadResult<
      {
        id: string;
        userId: string;
        username: string;
        email: string | null;
        phoneNumber: string | null;
        passwordHash: string | null;
        updatedAt: Date | null;
      },
      ExtArgs['result']['account']
    >;
    composites: {};
  };

  type AccountGetPayload<
    S extends boolean | null | undefined | AccountDefaultArgs,
  > = $Result.GetResult<Prisma.$AccountPayload, S>;

  type AccountCountArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = Omit<AccountFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: AccountCountAggregateInputType | true;
  };

  export interface AccountDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>['model']['Account'];
      meta: { name: 'Account' };
    };
    /**
     * Find zero or one Account that matches the filter.
     * @param {AccountFindUniqueArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AccountFindUniqueArgs>(
      args: SelectSubset<T, AccountFindUniqueArgs<ExtArgs>>,
    ): Prisma__AccountClient<
      $Result.GetResult<
        Prisma.$AccountPayload<ExtArgs>,
        T,
        'findUnique',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find one Account that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AccountFindUniqueOrThrowArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AccountFindUniqueOrThrowArgs>(
      args: SelectSubset<T, AccountFindUniqueOrThrowArgs<ExtArgs>>,
    ): Prisma__AccountClient<
      $Result.GetResult<
        Prisma.$AccountPayload<ExtArgs>,
        T,
        'findUniqueOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first Account that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountFindFirstArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AccountFindFirstArgs>(
      args?: SelectSubset<T, AccountFindFirstArgs<ExtArgs>>,
    ): Prisma__AccountClient<
      $Result.GetResult<
        Prisma.$AccountPayload<ExtArgs>,
        T,
        'findFirst',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first Account that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountFindFirstOrThrowArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AccountFindFirstOrThrowArgs>(
      args?: SelectSubset<T, AccountFindFirstOrThrowArgs<ExtArgs>>,
    ): Prisma__AccountClient<
      $Result.GetResult<
        Prisma.$AccountPayload<ExtArgs>,
        T,
        'findFirstOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find zero or more Accounts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Accounts
     * const accounts = await prisma.account.findMany()
     *
     * // Get first 10 Accounts
     * const accounts = await prisma.account.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const accountWithIdOnly = await prisma.account.findMany({ select: { id: true } })
     *
     */
    findMany<T extends AccountFindManyArgs>(
      args?: SelectSubset<T, AccountFindManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$AccountPayload<ExtArgs>,
        T,
        'findMany',
        GlobalOmitOptions
      >
    >;

    /**
     * Create a Account.
     * @param {AccountCreateArgs} args - Arguments to create a Account.
     * @example
     * // Create one Account
     * const Account = await prisma.account.create({
     *   data: {
     *     // ... data to create a Account
     *   }
     * })
     *
     */
    create<T extends AccountCreateArgs>(
      args: SelectSubset<T, AccountCreateArgs<ExtArgs>>,
    ): Prisma__AccountClient<
      $Result.GetResult<
        Prisma.$AccountPayload<ExtArgs>,
        T,
        'create',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Create many Accounts.
     * @param {AccountCreateManyArgs} args - Arguments to create many Accounts.
     * @example
     * // Create many Accounts
     * const account = await prisma.account.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends AccountCreateManyArgs>(
      args?: SelectSubset<T, AccountCreateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create many Accounts and returns the data saved in the database.
     * @param {AccountCreateManyAndReturnArgs} args - Arguments to create many Accounts.
     * @example
     * // Create many Accounts
     * const account = await prisma.account.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many Accounts and only return the `id`
     * const accountWithIdOnly = await prisma.account.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends AccountCreateManyAndReturnArgs>(
      args?: SelectSubset<T, AccountCreateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$AccountPayload<ExtArgs>,
        T,
        'createManyAndReturn',
        GlobalOmitOptions
      >
    >;

    /**
     * Delete a Account.
     * @param {AccountDeleteArgs} args - Arguments to delete one Account.
     * @example
     * // Delete one Account
     * const Account = await prisma.account.delete({
     *   where: {
     *     // ... filter to delete one Account
     *   }
     * })
     *
     */
    delete<T extends AccountDeleteArgs>(
      args: SelectSubset<T, AccountDeleteArgs<ExtArgs>>,
    ): Prisma__AccountClient<
      $Result.GetResult<
        Prisma.$AccountPayload<ExtArgs>,
        T,
        'delete',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Update one Account.
     * @param {AccountUpdateArgs} args - Arguments to update one Account.
     * @example
     * // Update one Account
     * const account = await prisma.account.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends AccountUpdateArgs>(
      args: SelectSubset<T, AccountUpdateArgs<ExtArgs>>,
    ): Prisma__AccountClient<
      $Result.GetResult<
        Prisma.$AccountPayload<ExtArgs>,
        T,
        'update',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Delete zero or more Accounts.
     * @param {AccountDeleteManyArgs} args - Arguments to filter Accounts to delete.
     * @example
     * // Delete a few Accounts
     * const { count } = await prisma.account.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends AccountDeleteManyArgs>(
      args?: SelectSubset<T, AccountDeleteManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Accounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Accounts
     * const account = await prisma.account.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends AccountUpdateManyArgs>(
      args: SelectSubset<T, AccountUpdateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Accounts and returns the data updated in the database.
     * @param {AccountUpdateManyAndReturnArgs} args - Arguments to update many Accounts.
     * @example
     * // Update many Accounts
     * const account = await prisma.account.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more Accounts and only return the `id`
     * const accountWithIdOnly = await prisma.account.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    updateManyAndReturn<T extends AccountUpdateManyAndReturnArgs>(
      args: SelectSubset<T, AccountUpdateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$AccountPayload<ExtArgs>,
        T,
        'updateManyAndReturn',
        GlobalOmitOptions
      >
    >;

    /**
     * Create or update one Account.
     * @param {AccountUpsertArgs} args - Arguments to update or create a Account.
     * @example
     * // Update or create a Account
     * const account = await prisma.account.upsert({
     *   create: {
     *     // ... data to create a Account
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Account we want to update
     *   }
     * })
     */
    upsert<T extends AccountUpsertArgs>(
      args: SelectSubset<T, AccountUpsertArgs<ExtArgs>>,
    ): Prisma__AccountClient<
      $Result.GetResult<
        Prisma.$AccountPayload<ExtArgs>,
        T,
        'upsert',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Count the number of Accounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountCountArgs} args - Arguments to filter Accounts to count.
     * @example
     * // Count the number of Accounts
     * const count = await prisma.account.count({
     *   where: {
     *     // ... the filter for the Accounts we want to count
     *   }
     * })
     **/
    count<T extends AccountCountArgs>(
      args?: Subset<T, AccountCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AccountCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a Account.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends AccountAggregateArgs>(
      args: Subset<T, AccountAggregateArgs>,
    ): Prisma.PrismaPromise<GetAccountAggregateType<T>>;

    /**
     * Group by Account.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends AccountGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AccountGroupByArgs['orderBy'] }
        : { orderBy?: AccountGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<
        Keys<MaybeTupleToUnion<T['orderBy']>>
      >,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [
                      Error,
                      'Field ',
                      P,
                      ` in "having" needs to be provided in "by"`,
                    ];
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, AccountGroupByArgs, OrderByArg> & InputErrors,
    ): {} extends InputErrors
      ? GetAccountGroupByPayload<T>
      : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the Account model
     */
    readonly fields: AccountFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Account.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AccountClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    user<T extends UserDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, UserDefaultArgs<ExtArgs>>,
    ): Prisma__UserClient<
      | $Result.GetResult<
          Prisma.$UserPayload<ExtArgs>,
          T,
          'findUniqueOrThrow',
          GlobalOmitOptions
        >
      | Null,
      Null,
      ExtArgs,
      GlobalOmitOptions
    >;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | null,
      onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null,
    ): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | null,
    ): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | null): $Utils.JsPromise<T>;
  }

  /**
   * Fields of the Account model
   */
  interface AccountFieldRefs {
    readonly id: FieldRef<'Account', 'String'>;
    readonly userId: FieldRef<'Account', 'String'>;
    readonly username: FieldRef<'Account', 'String'>;
    readonly email: FieldRef<'Account', 'String'>;
    readonly phoneNumber: FieldRef<'Account', 'String'>;
    readonly passwordHash: FieldRef<'Account', 'String'>;
    readonly updatedAt: FieldRef<'Account', 'DateTime'>;
  }

  // Custom InputTypes
  /**
   * Account findUnique
   */
  export type AccountFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null;
    /**
     * Filter, which Account to fetch.
     */
    where: AccountWhereUniqueInput;
  };

  /**
   * Account findUniqueOrThrow
   */
  export type AccountFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null;
    /**
     * Filter, which Account to fetch.
     */
    where: AccountWhereUniqueInput;
  };

  /**
   * Account findFirst
   */
  export type AccountFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null;
    /**
     * Filter, which Account to fetch.
     */
    where?: AccountWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Accounts to fetch.
     */
    orderBy?:
      | AccountOrderByWithRelationInput
      | AccountOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Accounts.
     */
    cursor?: AccountWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Accounts.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Accounts.
     */
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[];
  };

  /**
   * Account findFirstOrThrow
   */
  export type AccountFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null;
    /**
     * Filter, which Account to fetch.
     */
    where?: AccountWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Accounts to fetch.
     */
    orderBy?:
      | AccountOrderByWithRelationInput
      | AccountOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Accounts.
     */
    cursor?: AccountWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Accounts.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Accounts.
     */
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[];
  };

  /**
   * Account findMany
   */
  export type AccountFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null;
    /**
     * Filter, which Accounts to fetch.
     */
    where?: AccountWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Accounts to fetch.
     */
    orderBy?:
      | AccountOrderByWithRelationInput
      | AccountOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing Accounts.
     */
    cursor?: AccountWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Accounts.
     */
    skip?: number;
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[];
  };

  /**
   * Account create
   */
  export type AccountCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null;
    /**
     * The data needed to create a Account.
     */
    data: XOR<AccountCreateInput, AccountUncheckedCreateInput>;
  };

  /**
   * Account createMany
   */
  export type AccountCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many Accounts.
     */
    data: AccountCreateManyInput | AccountCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * Account createManyAndReturn
   */
  export type AccountCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null;
    /**
     * The data used to create many Accounts.
     */
    data: AccountCreateManyInput | AccountCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountIncludeCreateManyAndReturn<ExtArgs> | null;
  };

  /**
   * Account update
   */
  export type AccountUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null;
    /**
     * The data needed to update a Account.
     */
    data: XOR<AccountUpdateInput, AccountUncheckedUpdateInput>;
    /**
     * Choose, which Account to update.
     */
    where: AccountWhereUniqueInput;
  };

  /**
   * Account updateMany
   */
  export type AccountUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update Accounts.
     */
    data: XOR<AccountUpdateManyMutationInput, AccountUncheckedUpdateManyInput>;
    /**
     * Filter which Accounts to update
     */
    where?: AccountWhereInput;
    /**
     * Limit how many Accounts to update.
     */
    limit?: number;
  };

  /**
   * Account updateManyAndReturn
   */
  export type AccountUpdateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null;
    /**
     * The data used to update Accounts.
     */
    data: XOR<AccountUpdateManyMutationInput, AccountUncheckedUpdateManyInput>;
    /**
     * Filter which Accounts to update
     */
    where?: AccountWhereInput;
    /**
     * Limit how many Accounts to update.
     */
    limit?: number;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountIncludeUpdateManyAndReturn<ExtArgs> | null;
  };

  /**
   * Account upsert
   */
  export type AccountUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null;
    /**
     * The filter to search for the Account to update in case it exists.
     */
    where: AccountWhereUniqueInput;
    /**
     * In case the Account found by the `where` argument doesn't exist, create a new Account with this data.
     */
    create: XOR<AccountCreateInput, AccountUncheckedCreateInput>;
    /**
     * In case the Account was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AccountUpdateInput, AccountUncheckedUpdateInput>;
  };

  /**
   * Account delete
   */
  export type AccountDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null;
    /**
     * Filter which Account to delete.
     */
    where: AccountWhereUniqueInput;
  };

  /**
   * Account deleteMany
   */
  export type AccountDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which Accounts to delete
     */
    where?: AccountWhereInput;
    /**
     * Limit how many Accounts to delete.
     */
    limit?: number;
  };

  /**
   * Account without action
   */
  export type AccountDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null;
  };

  /**
   * Model Profile
   */

  export type AggregateProfile = {
    _count: ProfileCountAggregateOutputType | null;
    _min: ProfileMinAggregateOutputType | null;
    _max: ProfileMaxAggregateOutputType | null;
  };

  export type ProfileMinAggregateOutputType = {
    id: string | null;
    userId: string | null;
    firstName: string | null;
    secondName: string | null;
    avatarUrl: string | null;
    bio: string | null;
    birthday: Date | null;
    isPrivate: boolean | null;
  };

  export type ProfileMaxAggregateOutputType = {
    id: string | null;
    userId: string | null;
    firstName: string | null;
    secondName: string | null;
    avatarUrl: string | null;
    bio: string | null;
    birthday: Date | null;
    isPrivate: boolean | null;
  };

  export type ProfileCountAggregateOutputType = {
    id: number;
    userId: number;
    firstName: number;
    secondName: number;
    avatarUrl: number;
    bio: number;
    birthday: number;
    isPrivate: number;
    _all: number;
  };

  export type ProfileMinAggregateInputType = {
    id?: true;
    userId?: true;
    firstName?: true;
    secondName?: true;
    avatarUrl?: true;
    bio?: true;
    birthday?: true;
    isPrivate?: true;
  };

  export type ProfileMaxAggregateInputType = {
    id?: true;
    userId?: true;
    firstName?: true;
    secondName?: true;
    avatarUrl?: true;
    bio?: true;
    birthday?: true;
    isPrivate?: true;
  };

  export type ProfileCountAggregateInputType = {
    id?: true;
    userId?: true;
    firstName?: true;
    secondName?: true;
    avatarUrl?: true;
    bio?: true;
    birthday?: true;
    isPrivate?: true;
    _all?: true;
  };

  export type ProfileAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which Profile to aggregate.
     */
    where?: ProfileWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Profiles to fetch.
     */
    orderBy?:
      | ProfileOrderByWithRelationInput
      | ProfileOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: ProfileWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Profiles from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Profiles.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned Profiles
     **/
    _count?: true | ProfileCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: ProfileMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: ProfileMaxAggregateInputType;
  };

  export type GetProfileAggregateType<T extends ProfileAggregateArgs> = {
    [P in keyof T & keyof AggregateProfile]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProfile[P]>
      : GetScalarType<T[P], AggregateProfile[P]>;
  };

  export type ProfileGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: ProfileWhereInput;
    orderBy?:
      | ProfileOrderByWithAggregationInput
      | ProfileOrderByWithAggregationInput[];
    by: ProfileScalarFieldEnum[] | ProfileScalarFieldEnum;
    having?: ProfileScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: ProfileCountAggregateInputType | true;
    _min?: ProfileMinAggregateInputType;
    _max?: ProfileMaxAggregateInputType;
  };

  export type ProfileGroupByOutputType = {
    id: string;
    userId: string;
    firstName: string;
    secondName: string | null;
    avatarUrl: string | null;
    bio: string | null;
    birthday: Date | null;
    isPrivate: boolean;
    _count: ProfileCountAggregateOutputType | null;
    _min: ProfileMinAggregateOutputType | null;
    _max: ProfileMaxAggregateOutputType | null;
  };

  type GetProfileGroupByPayload<T extends ProfileGroupByArgs> =
    Prisma.PrismaPromise<
      Array<
        PickEnumerable<ProfileGroupByOutputType, T['by']> & {
          [P in keyof T & keyof ProfileGroupByOutputType]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProfileGroupByOutputType[P]>
            : GetScalarType<T[P], ProfileGroupByOutputType[P]>;
        }
      >
    >;

  export type ProfileSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      userId?: boolean;
      firstName?: boolean;
      secondName?: boolean;
      avatarUrl?: boolean;
      bio?: boolean;
      birthday?: boolean;
      isPrivate?: boolean;
      user?: boolean | UserDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['profile']
  >;

  export type ProfileSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      userId?: boolean;
      firstName?: boolean;
      secondName?: boolean;
      avatarUrl?: boolean;
      bio?: boolean;
      birthday?: boolean;
      isPrivate?: boolean;
      user?: boolean | UserDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['profile']
  >;

  export type ProfileSelectUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      userId?: boolean;
      firstName?: boolean;
      secondName?: boolean;
      avatarUrl?: boolean;
      bio?: boolean;
      birthday?: boolean;
      isPrivate?: boolean;
      user?: boolean | UserDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['profile']
  >;

  export type ProfileSelectScalar = {
    id?: boolean;
    userId?: boolean;
    firstName?: boolean;
    secondName?: boolean;
    avatarUrl?: boolean;
    bio?: boolean;
    birthday?: boolean;
    isPrivate?: boolean;
  };

  export type ProfileOmit<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetOmit<
    | 'id'
    | 'userId'
    | 'firstName'
    | 'secondName'
    | 'avatarUrl'
    | 'bio'
    | 'birthday'
    | 'isPrivate',
    ExtArgs['result']['profile']
  >;
  export type ProfileInclude<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    user?: boolean | UserDefaultArgs<ExtArgs>;
  };
  export type ProfileIncludeCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    user?: boolean | UserDefaultArgs<ExtArgs>;
  };
  export type ProfileIncludeUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    user?: boolean | UserDefaultArgs<ExtArgs>;
  };

  export type $ProfilePayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    name: 'Profile';
    objects: {
      user: Prisma.$UserPayload<ExtArgs>;
    };
    scalars: $Extensions.GetPayloadResult<
      {
        id: string;
        userId: string;
        firstName: string;
        secondName: string | null;
        avatarUrl: string | null;
        bio: string | null;
        birthday: Date | null;
        isPrivate: boolean;
      },
      ExtArgs['result']['profile']
    >;
    composites: {};
  };

  type ProfileGetPayload<
    S extends boolean | null | undefined | ProfileDefaultArgs,
  > = $Result.GetResult<Prisma.$ProfilePayload, S>;

  type ProfileCountArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = Omit<ProfileFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: ProfileCountAggregateInputType | true;
  };

  export interface ProfileDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>['model']['Profile'];
      meta: { name: 'Profile' };
    };
    /**
     * Find zero or one Profile that matches the filter.
     * @param {ProfileFindUniqueArgs} args - Arguments to find a Profile
     * @example
     * // Get one Profile
     * const profile = await prisma.profile.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProfileFindUniqueArgs>(
      args: SelectSubset<T, ProfileFindUniqueArgs<ExtArgs>>,
    ): Prisma__ProfileClient<
      $Result.GetResult<
        Prisma.$ProfilePayload<ExtArgs>,
        T,
        'findUnique',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find one Profile that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ProfileFindUniqueOrThrowArgs} args - Arguments to find a Profile
     * @example
     * // Get one Profile
     * const profile = await prisma.profile.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProfileFindUniqueOrThrowArgs>(
      args: SelectSubset<T, ProfileFindUniqueOrThrowArgs<ExtArgs>>,
    ): Prisma__ProfileClient<
      $Result.GetResult<
        Prisma.$ProfilePayload<ExtArgs>,
        T,
        'findUniqueOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first Profile that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileFindFirstArgs} args - Arguments to find a Profile
     * @example
     * // Get one Profile
     * const profile = await prisma.profile.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProfileFindFirstArgs>(
      args?: SelectSubset<T, ProfileFindFirstArgs<ExtArgs>>,
    ): Prisma__ProfileClient<
      $Result.GetResult<
        Prisma.$ProfilePayload<ExtArgs>,
        T,
        'findFirst',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first Profile that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileFindFirstOrThrowArgs} args - Arguments to find a Profile
     * @example
     * // Get one Profile
     * const profile = await prisma.profile.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProfileFindFirstOrThrowArgs>(
      args?: SelectSubset<T, ProfileFindFirstOrThrowArgs<ExtArgs>>,
    ): Prisma__ProfileClient<
      $Result.GetResult<
        Prisma.$ProfilePayload<ExtArgs>,
        T,
        'findFirstOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find zero or more Profiles that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Profiles
     * const profiles = await prisma.profile.findMany()
     *
     * // Get first 10 Profiles
     * const profiles = await prisma.profile.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const profileWithIdOnly = await prisma.profile.findMany({ select: { id: true } })
     *
     */
    findMany<T extends ProfileFindManyArgs>(
      args?: SelectSubset<T, ProfileFindManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$ProfilePayload<ExtArgs>,
        T,
        'findMany',
        GlobalOmitOptions
      >
    >;

    /**
     * Create a Profile.
     * @param {ProfileCreateArgs} args - Arguments to create a Profile.
     * @example
     * // Create one Profile
     * const Profile = await prisma.profile.create({
     *   data: {
     *     // ... data to create a Profile
     *   }
     * })
     *
     */
    create<T extends ProfileCreateArgs>(
      args: SelectSubset<T, ProfileCreateArgs<ExtArgs>>,
    ): Prisma__ProfileClient<
      $Result.GetResult<
        Prisma.$ProfilePayload<ExtArgs>,
        T,
        'create',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Create many Profiles.
     * @param {ProfileCreateManyArgs} args - Arguments to create many Profiles.
     * @example
     * // Create many Profiles
     * const profile = await prisma.profile.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends ProfileCreateManyArgs>(
      args?: SelectSubset<T, ProfileCreateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create many Profiles and returns the data saved in the database.
     * @param {ProfileCreateManyAndReturnArgs} args - Arguments to create many Profiles.
     * @example
     * // Create many Profiles
     * const profile = await prisma.profile.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many Profiles and only return the `id`
     * const profileWithIdOnly = await prisma.profile.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends ProfileCreateManyAndReturnArgs>(
      args?: SelectSubset<T, ProfileCreateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$ProfilePayload<ExtArgs>,
        T,
        'createManyAndReturn',
        GlobalOmitOptions
      >
    >;

    /**
     * Delete a Profile.
     * @param {ProfileDeleteArgs} args - Arguments to delete one Profile.
     * @example
     * // Delete one Profile
     * const Profile = await prisma.profile.delete({
     *   where: {
     *     // ... filter to delete one Profile
     *   }
     * })
     *
     */
    delete<T extends ProfileDeleteArgs>(
      args: SelectSubset<T, ProfileDeleteArgs<ExtArgs>>,
    ): Prisma__ProfileClient<
      $Result.GetResult<
        Prisma.$ProfilePayload<ExtArgs>,
        T,
        'delete',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Update one Profile.
     * @param {ProfileUpdateArgs} args - Arguments to update one Profile.
     * @example
     * // Update one Profile
     * const profile = await prisma.profile.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends ProfileUpdateArgs>(
      args: SelectSubset<T, ProfileUpdateArgs<ExtArgs>>,
    ): Prisma__ProfileClient<
      $Result.GetResult<
        Prisma.$ProfilePayload<ExtArgs>,
        T,
        'update',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Delete zero or more Profiles.
     * @param {ProfileDeleteManyArgs} args - Arguments to filter Profiles to delete.
     * @example
     * // Delete a few Profiles
     * const { count } = await prisma.profile.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends ProfileDeleteManyArgs>(
      args?: SelectSubset<T, ProfileDeleteManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Profiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Profiles
     * const profile = await prisma.profile.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends ProfileUpdateManyArgs>(
      args: SelectSubset<T, ProfileUpdateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Profiles and returns the data updated in the database.
     * @param {ProfileUpdateManyAndReturnArgs} args - Arguments to update many Profiles.
     * @example
     * // Update many Profiles
     * const profile = await prisma.profile.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more Profiles and only return the `id`
     * const profileWithIdOnly = await prisma.profile.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    updateManyAndReturn<T extends ProfileUpdateManyAndReturnArgs>(
      args: SelectSubset<T, ProfileUpdateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$ProfilePayload<ExtArgs>,
        T,
        'updateManyAndReturn',
        GlobalOmitOptions
      >
    >;

    /**
     * Create or update one Profile.
     * @param {ProfileUpsertArgs} args - Arguments to update or create a Profile.
     * @example
     * // Update or create a Profile
     * const profile = await prisma.profile.upsert({
     *   create: {
     *     // ... data to create a Profile
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Profile we want to update
     *   }
     * })
     */
    upsert<T extends ProfileUpsertArgs>(
      args: SelectSubset<T, ProfileUpsertArgs<ExtArgs>>,
    ): Prisma__ProfileClient<
      $Result.GetResult<
        Prisma.$ProfilePayload<ExtArgs>,
        T,
        'upsert',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Count the number of Profiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileCountArgs} args - Arguments to filter Profiles to count.
     * @example
     * // Count the number of Profiles
     * const count = await prisma.profile.count({
     *   where: {
     *     // ... the filter for the Profiles we want to count
     *   }
     * })
     **/
    count<T extends ProfileCountArgs>(
      args?: Subset<T, ProfileCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProfileCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a Profile.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends ProfileAggregateArgs>(
      args: Subset<T, ProfileAggregateArgs>,
    ): Prisma.PrismaPromise<GetProfileAggregateType<T>>;

    /**
     * Group by Profile.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends ProfileGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProfileGroupByArgs['orderBy'] }
        : { orderBy?: ProfileGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<
        Keys<MaybeTupleToUnion<T['orderBy']>>
      >,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [
                      Error,
                      'Field ',
                      P,
                      ` in "having" needs to be provided in "by"`,
                    ];
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, ProfileGroupByArgs, OrderByArg> & InputErrors,
    ): {} extends InputErrors
      ? GetProfileGroupByPayload<T>
      : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the Profile model
     */
    readonly fields: ProfileFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Profile.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProfileClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    user<T extends UserDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, UserDefaultArgs<ExtArgs>>,
    ): Prisma__UserClient<
      | $Result.GetResult<
          Prisma.$UserPayload<ExtArgs>,
          T,
          'findUniqueOrThrow',
          GlobalOmitOptions
        >
      | Null,
      Null,
      ExtArgs,
      GlobalOmitOptions
    >;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | null,
      onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null,
    ): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | null,
    ): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | null): $Utils.JsPromise<T>;
  }

  /**
   * Fields of the Profile model
   */
  interface ProfileFieldRefs {
    readonly id: FieldRef<'Profile', 'String'>;
    readonly userId: FieldRef<'Profile', 'String'>;
    readonly firstName: FieldRef<'Profile', 'String'>;
    readonly secondName: FieldRef<'Profile', 'String'>;
    readonly avatarUrl: FieldRef<'Profile', 'String'>;
    readonly bio: FieldRef<'Profile', 'String'>;
    readonly birthday: FieldRef<'Profile', 'DateTime'>;
    readonly isPrivate: FieldRef<'Profile', 'Boolean'>;
  }

  // Custom InputTypes
  /**
   * Profile findUnique
   */
  export type ProfileFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileInclude<ExtArgs> | null;
    /**
     * Filter, which Profile to fetch.
     */
    where: ProfileWhereUniqueInput;
  };

  /**
   * Profile findUniqueOrThrow
   */
  export type ProfileFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileInclude<ExtArgs> | null;
    /**
     * Filter, which Profile to fetch.
     */
    where: ProfileWhereUniqueInput;
  };

  /**
   * Profile findFirst
   */
  export type ProfileFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileInclude<ExtArgs> | null;
    /**
     * Filter, which Profile to fetch.
     */
    where?: ProfileWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Profiles to fetch.
     */
    orderBy?:
      | ProfileOrderByWithRelationInput
      | ProfileOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Profiles.
     */
    cursor?: ProfileWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Profiles from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Profiles.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Profiles.
     */
    distinct?: ProfileScalarFieldEnum | ProfileScalarFieldEnum[];
  };

  /**
   * Profile findFirstOrThrow
   */
  export type ProfileFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileInclude<ExtArgs> | null;
    /**
     * Filter, which Profile to fetch.
     */
    where?: ProfileWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Profiles to fetch.
     */
    orderBy?:
      | ProfileOrderByWithRelationInput
      | ProfileOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Profiles.
     */
    cursor?: ProfileWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Profiles from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Profiles.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Profiles.
     */
    distinct?: ProfileScalarFieldEnum | ProfileScalarFieldEnum[];
  };

  /**
   * Profile findMany
   */
  export type ProfileFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileInclude<ExtArgs> | null;
    /**
     * Filter, which Profiles to fetch.
     */
    where?: ProfileWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Profiles to fetch.
     */
    orderBy?:
      | ProfileOrderByWithRelationInput
      | ProfileOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing Profiles.
     */
    cursor?: ProfileWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Profiles from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Profiles.
     */
    skip?: number;
    distinct?: ProfileScalarFieldEnum | ProfileScalarFieldEnum[];
  };

  /**
   * Profile create
   */
  export type ProfileCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileInclude<ExtArgs> | null;
    /**
     * The data needed to create a Profile.
     */
    data: XOR<ProfileCreateInput, ProfileUncheckedCreateInput>;
  };

  /**
   * Profile createMany
   */
  export type ProfileCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many Profiles.
     */
    data: ProfileCreateManyInput | ProfileCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * Profile createManyAndReturn
   */
  export type ProfileCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null;
    /**
     * The data used to create many Profiles.
     */
    data: ProfileCreateManyInput | ProfileCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileIncludeCreateManyAndReturn<ExtArgs> | null;
  };

  /**
   * Profile update
   */
  export type ProfileUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileInclude<ExtArgs> | null;
    /**
     * The data needed to update a Profile.
     */
    data: XOR<ProfileUpdateInput, ProfileUncheckedUpdateInput>;
    /**
     * Choose, which Profile to update.
     */
    where: ProfileWhereUniqueInput;
  };

  /**
   * Profile updateMany
   */
  export type ProfileUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update Profiles.
     */
    data: XOR<ProfileUpdateManyMutationInput, ProfileUncheckedUpdateManyInput>;
    /**
     * Filter which Profiles to update
     */
    where?: ProfileWhereInput;
    /**
     * Limit how many Profiles to update.
     */
    limit?: number;
  };

  /**
   * Profile updateManyAndReturn
   */
  export type ProfileUpdateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null;
    /**
     * The data used to update Profiles.
     */
    data: XOR<ProfileUpdateManyMutationInput, ProfileUncheckedUpdateManyInput>;
    /**
     * Filter which Profiles to update
     */
    where?: ProfileWhereInput;
    /**
     * Limit how many Profiles to update.
     */
    limit?: number;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileIncludeUpdateManyAndReturn<ExtArgs> | null;
  };

  /**
   * Profile upsert
   */
  export type ProfileUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileInclude<ExtArgs> | null;
    /**
     * The filter to search for the Profile to update in case it exists.
     */
    where: ProfileWhereUniqueInput;
    /**
     * In case the Profile found by the `where` argument doesn't exist, create a new Profile with this data.
     */
    create: XOR<ProfileCreateInput, ProfileUncheckedCreateInput>;
    /**
     * In case the Profile was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProfileUpdateInput, ProfileUncheckedUpdateInput>;
  };

  /**
   * Profile delete
   */
  export type ProfileDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileInclude<ExtArgs> | null;
    /**
     * Filter which Profile to delete.
     */
    where: ProfileWhereUniqueInput;
  };

  /**
   * Profile deleteMany
   */
  export type ProfileDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which Profiles to delete
     */
    where?: ProfileWhereInput;
    /**
     * Limit how many Profiles to delete.
     */
    limit?: number;
  };

  /**
   * Profile without action
   */
  export type ProfileDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Profile
     */
    select?: ProfileSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Profile
     */
    omit?: ProfileOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProfileInclude<ExtArgs> | null;
  };

  /**
   * Model Follow
   */

  export type AggregateFollow = {
    _count: FollowCountAggregateOutputType | null;
    _min: FollowMinAggregateOutputType | null;
    _max: FollowMaxAggregateOutputType | null;
  };

  export type FollowMinAggregateOutputType = {
    id: string | null;
    followerId: string | null;
    followingId: string | null;
    createdAt: Date | null;
    status: $Enums.FollowStatus | null;
  };

  export type FollowMaxAggregateOutputType = {
    id: string | null;
    followerId: string | null;
    followingId: string | null;
    createdAt: Date | null;
    status: $Enums.FollowStatus | null;
  };

  export type FollowCountAggregateOutputType = {
    id: number;
    followerId: number;
    followingId: number;
    createdAt: number;
    status: number;
    _all: number;
  };

  export type FollowMinAggregateInputType = {
    id?: true;
    followerId?: true;
    followingId?: true;
    createdAt?: true;
    status?: true;
  };

  export type FollowMaxAggregateInputType = {
    id?: true;
    followerId?: true;
    followingId?: true;
    createdAt?: true;
    status?: true;
  };

  export type FollowCountAggregateInputType = {
    id?: true;
    followerId?: true;
    followingId?: true;
    createdAt?: true;
    status?: true;
    _all?: true;
  };

  export type FollowAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which Follow to aggregate.
     */
    where?: FollowWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Follows to fetch.
     */
    orderBy?: FollowOrderByWithRelationInput | FollowOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: FollowWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Follows from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Follows.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned Follows
     **/
    _count?: true | FollowCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: FollowMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: FollowMaxAggregateInputType;
  };

  export type GetFollowAggregateType<T extends FollowAggregateArgs> = {
    [P in keyof T & keyof AggregateFollow]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateFollow[P]>
      : GetScalarType<T[P], AggregateFollow[P]>;
  };

  export type FollowGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: FollowWhereInput;
    orderBy?:
      | FollowOrderByWithAggregationInput
      | FollowOrderByWithAggregationInput[];
    by: FollowScalarFieldEnum[] | FollowScalarFieldEnum;
    having?: FollowScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: FollowCountAggregateInputType | true;
    _min?: FollowMinAggregateInputType;
    _max?: FollowMaxAggregateInputType;
  };

  export type FollowGroupByOutputType = {
    id: string;
    followerId: string;
    followingId: string;
    createdAt: Date;
    status: $Enums.FollowStatus;
    _count: FollowCountAggregateOutputType | null;
    _min: FollowMinAggregateOutputType | null;
    _max: FollowMaxAggregateOutputType | null;
  };

  type GetFollowGroupByPayload<T extends FollowGroupByArgs> =
    Prisma.PrismaPromise<
      Array<
        PickEnumerable<FollowGroupByOutputType, T['by']> & {
          [P in keyof T & keyof FollowGroupByOutputType]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], FollowGroupByOutputType[P]>
            : GetScalarType<T[P], FollowGroupByOutputType[P]>;
        }
      >
    >;

  export type FollowSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      followerId?: boolean;
      followingId?: boolean;
      createdAt?: boolean;
      status?: boolean;
      follower?: boolean | UserDefaultArgs<ExtArgs>;
      following?: boolean | UserDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['follow']
  >;

  export type FollowSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      followerId?: boolean;
      followingId?: boolean;
      createdAt?: boolean;
      status?: boolean;
      follower?: boolean | UserDefaultArgs<ExtArgs>;
      following?: boolean | UserDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['follow']
  >;

  export type FollowSelectUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      followerId?: boolean;
      followingId?: boolean;
      createdAt?: boolean;
      status?: boolean;
      follower?: boolean | UserDefaultArgs<ExtArgs>;
      following?: boolean | UserDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['follow']
  >;

  export type FollowSelectScalar = {
    id?: boolean;
    followerId?: boolean;
    followingId?: boolean;
    createdAt?: boolean;
    status?: boolean;
  };

  export type FollowOmit<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetOmit<
    'id' | 'followerId' | 'followingId' | 'createdAt' | 'status',
    ExtArgs['result']['follow']
  >;
  export type FollowInclude<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    follower?: boolean | UserDefaultArgs<ExtArgs>;
    following?: boolean | UserDefaultArgs<ExtArgs>;
  };
  export type FollowIncludeCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    follower?: boolean | UserDefaultArgs<ExtArgs>;
    following?: boolean | UserDefaultArgs<ExtArgs>;
  };
  export type FollowIncludeUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    follower?: boolean | UserDefaultArgs<ExtArgs>;
    following?: boolean | UserDefaultArgs<ExtArgs>;
  };

  export type $FollowPayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    name: 'Follow';
    objects: {
      follower: Prisma.$UserPayload<ExtArgs>;
      following: Prisma.$UserPayload<ExtArgs>;
    };
    scalars: $Extensions.GetPayloadResult<
      {
        id: string;
        followerId: string;
        followingId: string;
        createdAt: Date;
        status: $Enums.FollowStatus;
      },
      ExtArgs['result']['follow']
    >;
    composites: {};
  };

  type FollowGetPayload<
    S extends boolean | null | undefined | FollowDefaultArgs,
  > = $Result.GetResult<Prisma.$FollowPayload, S>;

  type FollowCountArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = Omit<FollowFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: FollowCountAggregateInputType | true;
  };

  export interface FollowDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>['model']['Follow'];
      meta: { name: 'Follow' };
    };
    /**
     * Find zero or one Follow that matches the filter.
     * @param {FollowFindUniqueArgs} args - Arguments to find a Follow
     * @example
     * // Get one Follow
     * const follow = await prisma.follow.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends FollowFindUniqueArgs>(
      args: SelectSubset<T, FollowFindUniqueArgs<ExtArgs>>,
    ): Prisma__FollowClient<
      $Result.GetResult<
        Prisma.$FollowPayload<ExtArgs>,
        T,
        'findUnique',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find one Follow that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {FollowFindUniqueOrThrowArgs} args - Arguments to find a Follow
     * @example
     * // Get one Follow
     * const follow = await prisma.follow.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends FollowFindUniqueOrThrowArgs>(
      args: SelectSubset<T, FollowFindUniqueOrThrowArgs<ExtArgs>>,
    ): Prisma__FollowClient<
      $Result.GetResult<
        Prisma.$FollowPayload<ExtArgs>,
        T,
        'findUniqueOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first Follow that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FollowFindFirstArgs} args - Arguments to find a Follow
     * @example
     * // Get one Follow
     * const follow = await prisma.follow.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends FollowFindFirstArgs>(
      args?: SelectSubset<T, FollowFindFirstArgs<ExtArgs>>,
    ): Prisma__FollowClient<
      $Result.GetResult<
        Prisma.$FollowPayload<ExtArgs>,
        T,
        'findFirst',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first Follow that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FollowFindFirstOrThrowArgs} args - Arguments to find a Follow
     * @example
     * // Get one Follow
     * const follow = await prisma.follow.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends FollowFindFirstOrThrowArgs>(
      args?: SelectSubset<T, FollowFindFirstOrThrowArgs<ExtArgs>>,
    ): Prisma__FollowClient<
      $Result.GetResult<
        Prisma.$FollowPayload<ExtArgs>,
        T,
        'findFirstOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find zero or more Follows that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FollowFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Follows
     * const follows = await prisma.follow.findMany()
     *
     * // Get first 10 Follows
     * const follows = await prisma.follow.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const followWithIdOnly = await prisma.follow.findMany({ select: { id: true } })
     *
     */
    findMany<T extends FollowFindManyArgs>(
      args?: SelectSubset<T, FollowFindManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$FollowPayload<ExtArgs>,
        T,
        'findMany',
        GlobalOmitOptions
      >
    >;

    /**
     * Create a Follow.
     * @param {FollowCreateArgs} args - Arguments to create a Follow.
     * @example
     * // Create one Follow
     * const Follow = await prisma.follow.create({
     *   data: {
     *     // ... data to create a Follow
     *   }
     * })
     *
     */
    create<T extends FollowCreateArgs>(
      args: SelectSubset<T, FollowCreateArgs<ExtArgs>>,
    ): Prisma__FollowClient<
      $Result.GetResult<
        Prisma.$FollowPayload<ExtArgs>,
        T,
        'create',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Create many Follows.
     * @param {FollowCreateManyArgs} args - Arguments to create many Follows.
     * @example
     * // Create many Follows
     * const follow = await prisma.follow.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends FollowCreateManyArgs>(
      args?: SelectSubset<T, FollowCreateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create many Follows and returns the data saved in the database.
     * @param {FollowCreateManyAndReturnArgs} args - Arguments to create many Follows.
     * @example
     * // Create many Follows
     * const follow = await prisma.follow.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many Follows and only return the `id`
     * const followWithIdOnly = await prisma.follow.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends FollowCreateManyAndReturnArgs>(
      args?: SelectSubset<T, FollowCreateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$FollowPayload<ExtArgs>,
        T,
        'createManyAndReturn',
        GlobalOmitOptions
      >
    >;

    /**
     * Delete a Follow.
     * @param {FollowDeleteArgs} args - Arguments to delete one Follow.
     * @example
     * // Delete one Follow
     * const Follow = await prisma.follow.delete({
     *   where: {
     *     // ... filter to delete one Follow
     *   }
     * })
     *
     */
    delete<T extends FollowDeleteArgs>(
      args: SelectSubset<T, FollowDeleteArgs<ExtArgs>>,
    ): Prisma__FollowClient<
      $Result.GetResult<
        Prisma.$FollowPayload<ExtArgs>,
        T,
        'delete',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Update one Follow.
     * @param {FollowUpdateArgs} args - Arguments to update one Follow.
     * @example
     * // Update one Follow
     * const follow = await prisma.follow.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends FollowUpdateArgs>(
      args: SelectSubset<T, FollowUpdateArgs<ExtArgs>>,
    ): Prisma__FollowClient<
      $Result.GetResult<
        Prisma.$FollowPayload<ExtArgs>,
        T,
        'update',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Delete zero or more Follows.
     * @param {FollowDeleteManyArgs} args - Arguments to filter Follows to delete.
     * @example
     * // Delete a few Follows
     * const { count } = await prisma.follow.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends FollowDeleteManyArgs>(
      args?: SelectSubset<T, FollowDeleteManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Follows.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FollowUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Follows
     * const follow = await prisma.follow.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends FollowUpdateManyArgs>(
      args: SelectSubset<T, FollowUpdateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Follows and returns the data updated in the database.
     * @param {FollowUpdateManyAndReturnArgs} args - Arguments to update many Follows.
     * @example
     * // Update many Follows
     * const follow = await prisma.follow.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more Follows and only return the `id`
     * const followWithIdOnly = await prisma.follow.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    updateManyAndReturn<T extends FollowUpdateManyAndReturnArgs>(
      args: SelectSubset<T, FollowUpdateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$FollowPayload<ExtArgs>,
        T,
        'updateManyAndReturn',
        GlobalOmitOptions
      >
    >;

    /**
     * Create or update one Follow.
     * @param {FollowUpsertArgs} args - Arguments to update or create a Follow.
     * @example
     * // Update or create a Follow
     * const follow = await prisma.follow.upsert({
     *   create: {
     *     // ... data to create a Follow
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Follow we want to update
     *   }
     * })
     */
    upsert<T extends FollowUpsertArgs>(
      args: SelectSubset<T, FollowUpsertArgs<ExtArgs>>,
    ): Prisma__FollowClient<
      $Result.GetResult<
        Prisma.$FollowPayload<ExtArgs>,
        T,
        'upsert',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Count the number of Follows.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FollowCountArgs} args - Arguments to filter Follows to count.
     * @example
     * // Count the number of Follows
     * const count = await prisma.follow.count({
     *   where: {
     *     // ... the filter for the Follows we want to count
     *   }
     * })
     **/
    count<T extends FollowCountArgs>(
      args?: Subset<T, FollowCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], FollowCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a Follow.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FollowAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends FollowAggregateArgs>(
      args: Subset<T, FollowAggregateArgs>,
    ): Prisma.PrismaPromise<GetFollowAggregateType<T>>;

    /**
     * Group by Follow.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FollowGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends FollowGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: FollowGroupByArgs['orderBy'] }
        : { orderBy?: FollowGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<
        Keys<MaybeTupleToUnion<T['orderBy']>>
      >,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [
                      Error,
                      'Field ',
                      P,
                      ` in "having" needs to be provided in "by"`,
                    ];
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, FollowGroupByArgs, OrderByArg> & InputErrors,
    ): {} extends InputErrors
      ? GetFollowGroupByPayload<T>
      : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the Follow model
     */
    readonly fields: FollowFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Follow.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__FollowClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    follower<T extends UserDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, UserDefaultArgs<ExtArgs>>,
    ): Prisma__UserClient<
      | $Result.GetResult<
          Prisma.$UserPayload<ExtArgs>,
          T,
          'findUniqueOrThrow',
          GlobalOmitOptions
        >
      | Null,
      Null,
      ExtArgs,
      GlobalOmitOptions
    >;
    following<T extends UserDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, UserDefaultArgs<ExtArgs>>,
    ): Prisma__UserClient<
      | $Result.GetResult<
          Prisma.$UserPayload<ExtArgs>,
          T,
          'findUniqueOrThrow',
          GlobalOmitOptions
        >
      | Null,
      Null,
      ExtArgs,
      GlobalOmitOptions
    >;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | null,
      onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null,
    ): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | null,
    ): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | null): $Utils.JsPromise<T>;
  }

  /**
   * Fields of the Follow model
   */
  interface FollowFieldRefs {
    readonly id: FieldRef<'Follow', 'String'>;
    readonly followerId: FieldRef<'Follow', 'String'>;
    readonly followingId: FieldRef<'Follow', 'String'>;
    readonly createdAt: FieldRef<'Follow', 'DateTime'>;
    readonly status: FieldRef<'Follow', 'FollowStatus'>;
  }

  // Custom InputTypes
  /**
   * Follow findUnique
   */
  export type FollowFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Follow
     */
    select?: FollowSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Follow
     */
    omit?: FollowOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FollowInclude<ExtArgs> | null;
    /**
     * Filter, which Follow to fetch.
     */
    where: FollowWhereUniqueInput;
  };

  /**
   * Follow findUniqueOrThrow
   */
  export type FollowFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Follow
     */
    select?: FollowSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Follow
     */
    omit?: FollowOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FollowInclude<ExtArgs> | null;
    /**
     * Filter, which Follow to fetch.
     */
    where: FollowWhereUniqueInput;
  };

  /**
   * Follow findFirst
   */
  export type FollowFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Follow
     */
    select?: FollowSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Follow
     */
    omit?: FollowOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FollowInclude<ExtArgs> | null;
    /**
     * Filter, which Follow to fetch.
     */
    where?: FollowWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Follows to fetch.
     */
    orderBy?: FollowOrderByWithRelationInput | FollowOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Follows.
     */
    cursor?: FollowWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Follows from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Follows.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Follows.
     */
    distinct?: FollowScalarFieldEnum | FollowScalarFieldEnum[];
  };

  /**
   * Follow findFirstOrThrow
   */
  export type FollowFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Follow
     */
    select?: FollowSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Follow
     */
    omit?: FollowOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FollowInclude<ExtArgs> | null;
    /**
     * Filter, which Follow to fetch.
     */
    where?: FollowWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Follows to fetch.
     */
    orderBy?: FollowOrderByWithRelationInput | FollowOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Follows.
     */
    cursor?: FollowWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Follows from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Follows.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Follows.
     */
    distinct?: FollowScalarFieldEnum | FollowScalarFieldEnum[];
  };

  /**
   * Follow findMany
   */
  export type FollowFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Follow
     */
    select?: FollowSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Follow
     */
    omit?: FollowOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FollowInclude<ExtArgs> | null;
    /**
     * Filter, which Follows to fetch.
     */
    where?: FollowWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Follows to fetch.
     */
    orderBy?: FollowOrderByWithRelationInput | FollowOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing Follows.
     */
    cursor?: FollowWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Follows from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Follows.
     */
    skip?: number;
    distinct?: FollowScalarFieldEnum | FollowScalarFieldEnum[];
  };

  /**
   * Follow create
   */
  export type FollowCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Follow
     */
    select?: FollowSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Follow
     */
    omit?: FollowOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FollowInclude<ExtArgs> | null;
    /**
     * The data needed to create a Follow.
     */
    data: XOR<FollowCreateInput, FollowUncheckedCreateInput>;
  };

  /**
   * Follow createMany
   */
  export type FollowCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many Follows.
     */
    data: FollowCreateManyInput | FollowCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * Follow createManyAndReturn
   */
  export type FollowCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Follow
     */
    select?: FollowSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the Follow
     */
    omit?: FollowOmit<ExtArgs> | null;
    /**
     * The data used to create many Follows.
     */
    data: FollowCreateManyInput | FollowCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FollowIncludeCreateManyAndReturn<ExtArgs> | null;
  };

  /**
   * Follow update
   */
  export type FollowUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Follow
     */
    select?: FollowSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Follow
     */
    omit?: FollowOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FollowInclude<ExtArgs> | null;
    /**
     * The data needed to update a Follow.
     */
    data: XOR<FollowUpdateInput, FollowUncheckedUpdateInput>;
    /**
     * Choose, which Follow to update.
     */
    where: FollowWhereUniqueInput;
  };

  /**
   * Follow updateMany
   */
  export type FollowUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update Follows.
     */
    data: XOR<FollowUpdateManyMutationInput, FollowUncheckedUpdateManyInput>;
    /**
     * Filter which Follows to update
     */
    where?: FollowWhereInput;
    /**
     * Limit how many Follows to update.
     */
    limit?: number;
  };

  /**
   * Follow updateManyAndReturn
   */
  export type FollowUpdateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Follow
     */
    select?: FollowSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the Follow
     */
    omit?: FollowOmit<ExtArgs> | null;
    /**
     * The data used to update Follows.
     */
    data: XOR<FollowUpdateManyMutationInput, FollowUncheckedUpdateManyInput>;
    /**
     * Filter which Follows to update
     */
    where?: FollowWhereInput;
    /**
     * Limit how many Follows to update.
     */
    limit?: number;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FollowIncludeUpdateManyAndReturn<ExtArgs> | null;
  };

  /**
   * Follow upsert
   */
  export type FollowUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Follow
     */
    select?: FollowSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Follow
     */
    omit?: FollowOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FollowInclude<ExtArgs> | null;
    /**
     * The filter to search for the Follow to update in case it exists.
     */
    where: FollowWhereUniqueInput;
    /**
     * In case the Follow found by the `where` argument doesn't exist, create a new Follow with this data.
     */
    create: XOR<FollowCreateInput, FollowUncheckedCreateInput>;
    /**
     * In case the Follow was found with the provided `where` argument, update it with this data.
     */
    update: XOR<FollowUpdateInput, FollowUncheckedUpdateInput>;
  };

  /**
   * Follow delete
   */
  export type FollowDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Follow
     */
    select?: FollowSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Follow
     */
    omit?: FollowOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FollowInclude<ExtArgs> | null;
    /**
     * Filter which Follow to delete.
     */
    where: FollowWhereUniqueInput;
  };

  /**
   * Follow deleteMany
   */
  export type FollowDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which Follows to delete
     */
    where?: FollowWhereInput;
    /**
     * Limit how many Follows to delete.
     */
    limit?: number;
  };

  /**
   * Follow without action
   */
  export type FollowDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Follow
     */
    select?: FollowSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Follow
     */
    omit?: FollowOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FollowInclude<ExtArgs> | null;
  };

  /**
   * Model Post
   */

  export type AggregatePost = {
    _count: PostCountAggregateOutputType | null;
    _min: PostMinAggregateOutputType | null;
    _max: PostMaxAggregateOutputType | null;
  };

  export type PostMinAggregateOutputType = {
    id: string | null;
    authorId: string | null;
    description: string | null;
    isArchived: boolean | null;
    createdAt: Date | null;
    updatedAt: Date | null;
  };

  export type PostMaxAggregateOutputType = {
    id: string | null;
    authorId: string | null;
    description: string | null;
    isArchived: boolean | null;
    createdAt: Date | null;
    updatedAt: Date | null;
  };

  export type PostCountAggregateOutputType = {
    id: number;
    authorId: number;
    description: number;
    isArchived: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
  };

  export type PostMinAggregateInputType = {
    id?: true;
    authorId?: true;
    description?: true;
    isArchived?: true;
    createdAt?: true;
    updatedAt?: true;
  };

  export type PostMaxAggregateInputType = {
    id?: true;
    authorId?: true;
    description?: true;
    isArchived?: true;
    createdAt?: true;
    updatedAt?: true;
  };

  export type PostCountAggregateInputType = {
    id?: true;
    authorId?: true;
    description?: true;
    isArchived?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
  };

  export type PostAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which Post to aggregate.
     */
    where?: PostWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Posts to fetch.
     */
    orderBy?: PostOrderByWithRelationInput | PostOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: PostWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Posts from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Posts.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned Posts
     **/
    _count?: true | PostCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: PostMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: PostMaxAggregateInputType;
  };

  export type GetPostAggregateType<T extends PostAggregateArgs> = {
    [P in keyof T & keyof AggregatePost]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePost[P]>
      : GetScalarType<T[P], AggregatePost[P]>;
  };

  export type PostGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: PostWhereInput;
    orderBy?:
      | PostOrderByWithAggregationInput
      | PostOrderByWithAggregationInput[];
    by: PostScalarFieldEnum[] | PostScalarFieldEnum;
    having?: PostScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: PostCountAggregateInputType | true;
    _min?: PostMinAggregateInputType;
    _max?: PostMaxAggregateInputType;
  };

  export type PostGroupByOutputType = {
    id: string;
    authorId: string;
    description: string | null;
    isArchived: boolean;
    createdAt: Date;
    updatedAt: Date | null;
    _count: PostCountAggregateOutputType | null;
    _min: PostMinAggregateOutputType | null;
    _max: PostMaxAggregateOutputType | null;
  };

  type GetPostGroupByPayload<T extends PostGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PostGroupByOutputType, T['by']> & {
        [P in keyof T & keyof PostGroupByOutputType]: P extends '_count'
          ? T[P] extends boolean
            ? number
            : GetScalarType<T[P], PostGroupByOutputType[P]>
          : GetScalarType<T[P], PostGroupByOutputType[P]>;
      }
    >
  >;

  export type PostSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      authorId?: boolean;
      description?: boolean;
      isArchived?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      assets?: boolean | Post$assetsArgs<ExtArgs>;
      comments?: boolean | Post$commentsArgs<ExtArgs>;
      likes?: boolean | Post$likesArgs<ExtArgs>;
      author?: boolean | UserDefaultArgs<ExtArgs>;
      _count?: boolean | PostCountOutputTypeDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['post']
  >;

  export type PostSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      authorId?: boolean;
      description?: boolean;
      isArchived?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      author?: boolean | UserDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['post']
  >;

  export type PostSelectUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      authorId?: boolean;
      description?: boolean;
      isArchived?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      author?: boolean | UserDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['post']
  >;

  export type PostSelectScalar = {
    id?: boolean;
    authorId?: boolean;
    description?: boolean;
    isArchived?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
  };

  export type PostOmit<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetOmit<
    | 'id'
    | 'authorId'
    | 'description'
    | 'isArchived'
    | 'createdAt'
    | 'updatedAt',
    ExtArgs['result']['post']
  >;
  export type PostInclude<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    assets?: boolean | Post$assetsArgs<ExtArgs>;
    comments?: boolean | Post$commentsArgs<ExtArgs>;
    likes?: boolean | Post$likesArgs<ExtArgs>;
    author?: boolean | UserDefaultArgs<ExtArgs>;
    _count?: boolean | PostCountOutputTypeDefaultArgs<ExtArgs>;
  };
  export type PostIncludeCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    author?: boolean | UserDefaultArgs<ExtArgs>;
  };
  export type PostIncludeUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    author?: boolean | UserDefaultArgs<ExtArgs>;
  };

  export type $PostPayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    name: 'Post';
    objects: {
      assets: Prisma.$AssetPayload<ExtArgs>[];
      comments: Prisma.$CommentPayload<ExtArgs>[];
      likes: Prisma.$LikePayload<ExtArgs>[];
      author: Prisma.$UserPayload<ExtArgs>;
    };
    scalars: $Extensions.GetPayloadResult<
      {
        id: string;
        authorId: string;
        description: string | null;
        isArchived: boolean;
        createdAt: Date;
        updatedAt: Date | null;
      },
      ExtArgs['result']['post']
    >;
    composites: {};
  };

  type PostGetPayload<S extends boolean | null | undefined | PostDefaultArgs> =
    $Result.GetResult<Prisma.$PostPayload, S>;

  type PostCountArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = Omit<PostFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: PostCountAggregateInputType | true;
  };

  export interface PostDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>['model']['Post'];
      meta: { name: 'Post' };
    };
    /**
     * Find zero or one Post that matches the filter.
     * @param {PostFindUniqueArgs} args - Arguments to find a Post
     * @example
     * // Get one Post
     * const post = await prisma.post.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PostFindUniqueArgs>(
      args: SelectSubset<T, PostFindUniqueArgs<ExtArgs>>,
    ): Prisma__PostClient<
      $Result.GetResult<
        Prisma.$PostPayload<ExtArgs>,
        T,
        'findUnique',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find one Post that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PostFindUniqueOrThrowArgs} args - Arguments to find a Post
     * @example
     * // Get one Post
     * const post = await prisma.post.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PostFindUniqueOrThrowArgs>(
      args: SelectSubset<T, PostFindUniqueOrThrowArgs<ExtArgs>>,
    ): Prisma__PostClient<
      $Result.GetResult<
        Prisma.$PostPayload<ExtArgs>,
        T,
        'findUniqueOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first Post that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PostFindFirstArgs} args - Arguments to find a Post
     * @example
     * // Get one Post
     * const post = await prisma.post.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PostFindFirstArgs>(
      args?: SelectSubset<T, PostFindFirstArgs<ExtArgs>>,
    ): Prisma__PostClient<
      $Result.GetResult<
        Prisma.$PostPayload<ExtArgs>,
        T,
        'findFirst',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first Post that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PostFindFirstOrThrowArgs} args - Arguments to find a Post
     * @example
     * // Get one Post
     * const post = await prisma.post.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PostFindFirstOrThrowArgs>(
      args?: SelectSubset<T, PostFindFirstOrThrowArgs<ExtArgs>>,
    ): Prisma__PostClient<
      $Result.GetResult<
        Prisma.$PostPayload<ExtArgs>,
        T,
        'findFirstOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find zero or more Posts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PostFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Posts
     * const posts = await prisma.post.findMany()
     *
     * // Get first 10 Posts
     * const posts = await prisma.post.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const postWithIdOnly = await prisma.post.findMany({ select: { id: true } })
     *
     */
    findMany<T extends PostFindManyArgs>(
      args?: SelectSubset<T, PostFindManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$PostPayload<ExtArgs>,
        T,
        'findMany',
        GlobalOmitOptions
      >
    >;

    /**
     * Create a Post.
     * @param {PostCreateArgs} args - Arguments to create a Post.
     * @example
     * // Create one Post
     * const Post = await prisma.post.create({
     *   data: {
     *     // ... data to create a Post
     *   }
     * })
     *
     */
    create<T extends PostCreateArgs>(
      args: SelectSubset<T, PostCreateArgs<ExtArgs>>,
    ): Prisma__PostClient<
      $Result.GetResult<
        Prisma.$PostPayload<ExtArgs>,
        T,
        'create',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Create many Posts.
     * @param {PostCreateManyArgs} args - Arguments to create many Posts.
     * @example
     * // Create many Posts
     * const post = await prisma.post.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends PostCreateManyArgs>(
      args?: SelectSubset<T, PostCreateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create many Posts and returns the data saved in the database.
     * @param {PostCreateManyAndReturnArgs} args - Arguments to create many Posts.
     * @example
     * // Create many Posts
     * const post = await prisma.post.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many Posts and only return the `id`
     * const postWithIdOnly = await prisma.post.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends PostCreateManyAndReturnArgs>(
      args?: SelectSubset<T, PostCreateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$PostPayload<ExtArgs>,
        T,
        'createManyAndReturn',
        GlobalOmitOptions
      >
    >;

    /**
     * Delete a Post.
     * @param {PostDeleteArgs} args - Arguments to delete one Post.
     * @example
     * // Delete one Post
     * const Post = await prisma.post.delete({
     *   where: {
     *     // ... filter to delete one Post
     *   }
     * })
     *
     */
    delete<T extends PostDeleteArgs>(
      args: SelectSubset<T, PostDeleteArgs<ExtArgs>>,
    ): Prisma__PostClient<
      $Result.GetResult<
        Prisma.$PostPayload<ExtArgs>,
        T,
        'delete',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Update one Post.
     * @param {PostUpdateArgs} args - Arguments to update one Post.
     * @example
     * // Update one Post
     * const post = await prisma.post.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends PostUpdateArgs>(
      args: SelectSubset<T, PostUpdateArgs<ExtArgs>>,
    ): Prisma__PostClient<
      $Result.GetResult<
        Prisma.$PostPayload<ExtArgs>,
        T,
        'update',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Delete zero or more Posts.
     * @param {PostDeleteManyArgs} args - Arguments to filter Posts to delete.
     * @example
     * // Delete a few Posts
     * const { count } = await prisma.post.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends PostDeleteManyArgs>(
      args?: SelectSubset<T, PostDeleteManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Posts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PostUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Posts
     * const post = await prisma.post.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends PostUpdateManyArgs>(
      args: SelectSubset<T, PostUpdateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Posts and returns the data updated in the database.
     * @param {PostUpdateManyAndReturnArgs} args - Arguments to update many Posts.
     * @example
     * // Update many Posts
     * const post = await prisma.post.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more Posts and only return the `id`
     * const postWithIdOnly = await prisma.post.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    updateManyAndReturn<T extends PostUpdateManyAndReturnArgs>(
      args: SelectSubset<T, PostUpdateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$PostPayload<ExtArgs>,
        T,
        'updateManyAndReturn',
        GlobalOmitOptions
      >
    >;

    /**
     * Create or update one Post.
     * @param {PostUpsertArgs} args - Arguments to update or create a Post.
     * @example
     * // Update or create a Post
     * const post = await prisma.post.upsert({
     *   create: {
     *     // ... data to create a Post
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Post we want to update
     *   }
     * })
     */
    upsert<T extends PostUpsertArgs>(
      args: SelectSubset<T, PostUpsertArgs<ExtArgs>>,
    ): Prisma__PostClient<
      $Result.GetResult<
        Prisma.$PostPayload<ExtArgs>,
        T,
        'upsert',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Count the number of Posts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PostCountArgs} args - Arguments to filter Posts to count.
     * @example
     * // Count the number of Posts
     * const count = await prisma.post.count({
     *   where: {
     *     // ... the filter for the Posts we want to count
     *   }
     * })
     **/
    count<T extends PostCountArgs>(
      args?: Subset<T, PostCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PostCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a Post.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PostAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends PostAggregateArgs>(
      args: Subset<T, PostAggregateArgs>,
    ): Prisma.PrismaPromise<GetPostAggregateType<T>>;

    /**
     * Group by Post.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PostGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends PostGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PostGroupByArgs['orderBy'] }
        : { orderBy?: PostGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<
        Keys<MaybeTupleToUnion<T['orderBy']>>
      >,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [
                      Error,
                      'Field ',
                      P,
                      ` in "having" needs to be provided in "by"`,
                    ];
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, PostGroupByArgs, OrderByArg> & InputErrors,
    ): {} extends InputErrors
      ? GetPostGroupByPayload<T>
      : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the Post model
     */
    readonly fields: PostFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Post.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PostClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    assets<T extends Post$assetsArgs<ExtArgs> = {}>(
      args?: Subset<T, Post$assetsArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      | $Result.GetResult<
          Prisma.$AssetPayload<ExtArgs>,
          T,
          'findMany',
          GlobalOmitOptions
        >
      | Null
    >;
    comments<T extends Post$commentsArgs<ExtArgs> = {}>(
      args?: Subset<T, Post$commentsArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      | $Result.GetResult<
          Prisma.$CommentPayload<ExtArgs>,
          T,
          'findMany',
          GlobalOmitOptions
        >
      | Null
    >;
    likes<T extends Post$likesArgs<ExtArgs> = {}>(
      args?: Subset<T, Post$likesArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      | $Result.GetResult<
          Prisma.$LikePayload<ExtArgs>,
          T,
          'findMany',
          GlobalOmitOptions
        >
      | Null
    >;
    author<T extends UserDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, UserDefaultArgs<ExtArgs>>,
    ): Prisma__UserClient<
      | $Result.GetResult<
          Prisma.$UserPayload<ExtArgs>,
          T,
          'findUniqueOrThrow',
          GlobalOmitOptions
        >
      | Null,
      Null,
      ExtArgs,
      GlobalOmitOptions
    >;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | null,
      onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null,
    ): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | null,
    ): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | null): $Utils.JsPromise<T>;
  }

  /**
   * Fields of the Post model
   */
  interface PostFieldRefs {
    readonly id: FieldRef<'Post', 'String'>;
    readonly authorId: FieldRef<'Post', 'String'>;
    readonly description: FieldRef<'Post', 'String'>;
    readonly isArchived: FieldRef<'Post', 'Boolean'>;
    readonly createdAt: FieldRef<'Post', 'DateTime'>;
    readonly updatedAt: FieldRef<'Post', 'DateTime'>;
  }

  // Custom InputTypes
  /**
   * Post findUnique
   */
  export type PostFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Post
     */
    omit?: PostOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostInclude<ExtArgs> | null;
    /**
     * Filter, which Post to fetch.
     */
    where: PostWhereUniqueInput;
  };

  /**
   * Post findUniqueOrThrow
   */
  export type PostFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Post
     */
    omit?: PostOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostInclude<ExtArgs> | null;
    /**
     * Filter, which Post to fetch.
     */
    where: PostWhereUniqueInput;
  };

  /**
   * Post findFirst
   */
  export type PostFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Post
     */
    omit?: PostOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostInclude<ExtArgs> | null;
    /**
     * Filter, which Post to fetch.
     */
    where?: PostWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Posts to fetch.
     */
    orderBy?: PostOrderByWithRelationInput | PostOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Posts.
     */
    cursor?: PostWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Posts from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Posts.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Posts.
     */
    distinct?: PostScalarFieldEnum | PostScalarFieldEnum[];
  };

  /**
   * Post findFirstOrThrow
   */
  export type PostFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Post
     */
    omit?: PostOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostInclude<ExtArgs> | null;
    /**
     * Filter, which Post to fetch.
     */
    where?: PostWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Posts to fetch.
     */
    orderBy?: PostOrderByWithRelationInput | PostOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Posts.
     */
    cursor?: PostWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Posts from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Posts.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Posts.
     */
    distinct?: PostScalarFieldEnum | PostScalarFieldEnum[];
  };

  /**
   * Post findMany
   */
  export type PostFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Post
     */
    omit?: PostOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostInclude<ExtArgs> | null;
    /**
     * Filter, which Posts to fetch.
     */
    where?: PostWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Posts to fetch.
     */
    orderBy?: PostOrderByWithRelationInput | PostOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing Posts.
     */
    cursor?: PostWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Posts from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Posts.
     */
    skip?: number;
    distinct?: PostScalarFieldEnum | PostScalarFieldEnum[];
  };

  /**
   * Post create
   */
  export type PostCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Post
     */
    omit?: PostOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostInclude<ExtArgs> | null;
    /**
     * The data needed to create a Post.
     */
    data: XOR<PostCreateInput, PostUncheckedCreateInput>;
  };

  /**
   * Post createMany
   */
  export type PostCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many Posts.
     */
    data: PostCreateManyInput | PostCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * Post createManyAndReturn
   */
  export type PostCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the Post
     */
    omit?: PostOmit<ExtArgs> | null;
    /**
     * The data used to create many Posts.
     */
    data: PostCreateManyInput | PostCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostIncludeCreateManyAndReturn<ExtArgs> | null;
  };

  /**
   * Post update
   */
  export type PostUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Post
     */
    omit?: PostOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostInclude<ExtArgs> | null;
    /**
     * The data needed to update a Post.
     */
    data: XOR<PostUpdateInput, PostUncheckedUpdateInput>;
    /**
     * Choose, which Post to update.
     */
    where: PostWhereUniqueInput;
  };

  /**
   * Post updateMany
   */
  export type PostUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update Posts.
     */
    data: XOR<PostUpdateManyMutationInput, PostUncheckedUpdateManyInput>;
    /**
     * Filter which Posts to update
     */
    where?: PostWhereInput;
    /**
     * Limit how many Posts to update.
     */
    limit?: number;
  };

  /**
   * Post updateManyAndReturn
   */
  export type PostUpdateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the Post
     */
    omit?: PostOmit<ExtArgs> | null;
    /**
     * The data used to update Posts.
     */
    data: XOR<PostUpdateManyMutationInput, PostUncheckedUpdateManyInput>;
    /**
     * Filter which Posts to update
     */
    where?: PostWhereInput;
    /**
     * Limit how many Posts to update.
     */
    limit?: number;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostIncludeUpdateManyAndReturn<ExtArgs> | null;
  };

  /**
   * Post upsert
   */
  export type PostUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Post
     */
    omit?: PostOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostInclude<ExtArgs> | null;
    /**
     * The filter to search for the Post to update in case it exists.
     */
    where: PostWhereUniqueInput;
    /**
     * In case the Post found by the `where` argument doesn't exist, create a new Post with this data.
     */
    create: XOR<PostCreateInput, PostUncheckedCreateInput>;
    /**
     * In case the Post was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PostUpdateInput, PostUncheckedUpdateInput>;
  };

  /**
   * Post delete
   */
  export type PostDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Post
     */
    omit?: PostOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostInclude<ExtArgs> | null;
    /**
     * Filter which Post to delete.
     */
    where: PostWhereUniqueInput;
  };

  /**
   * Post deleteMany
   */
  export type PostDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which Posts to delete
     */
    where?: PostWhereInput;
    /**
     * Limit how many Posts to delete.
     */
    limit?: number;
  };

  /**
   * Post.assets
   */
  export type Post$assetsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Asset
     */
    select?: AssetSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Asset
     */
    omit?: AssetOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetInclude<ExtArgs> | null;
    where?: AssetWhereInput;
    orderBy?: AssetOrderByWithRelationInput | AssetOrderByWithRelationInput[];
    cursor?: AssetWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: AssetScalarFieldEnum | AssetScalarFieldEnum[];
  };

  /**
   * Post.comments
   */
  export type Post$commentsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Comment
     */
    omit?: CommentOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentInclude<ExtArgs> | null;
    where?: CommentWhereInput;
    orderBy?:
      | CommentOrderByWithRelationInput
      | CommentOrderByWithRelationInput[];
    cursor?: CommentWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: CommentScalarFieldEnum | CommentScalarFieldEnum[];
  };

  /**
   * Post.likes
   */
  export type Post$likesArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Like
     */
    select?: LikeSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Like
     */
    omit?: LikeOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LikeInclude<ExtArgs> | null;
    where?: LikeWhereInput;
    orderBy?: LikeOrderByWithRelationInput | LikeOrderByWithRelationInput[];
    cursor?: LikeWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: LikeScalarFieldEnum | LikeScalarFieldEnum[];
  };

  /**
   * Post without action
   */
  export type PostDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Post
     */
    omit?: PostOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostInclude<ExtArgs> | null;
  };

  /**
   * Model Asset
   */

  export type AggregateAsset = {
    _count: AssetCountAggregateOutputType | null;
    _min: AssetMinAggregateOutputType | null;
    _max: AssetMaxAggregateOutputType | null;
  };

  export type AssetMinAggregateOutputType = {
    id: string | null;
    url: string | null;
    type: $Enums.AssetType | null;
    postId: string | null;
    messageId: string | null;
  };

  export type AssetMaxAggregateOutputType = {
    id: string | null;
    url: string | null;
    type: $Enums.AssetType | null;
    postId: string | null;
    messageId: string | null;
  };

  export type AssetCountAggregateOutputType = {
    id: number;
    url: number;
    type: number;
    postId: number;
    messageId: number;
    _all: number;
  };

  export type AssetMinAggregateInputType = {
    id?: true;
    url?: true;
    type?: true;
    postId?: true;
    messageId?: true;
  };

  export type AssetMaxAggregateInputType = {
    id?: true;
    url?: true;
    type?: true;
    postId?: true;
    messageId?: true;
  };

  export type AssetCountAggregateInputType = {
    id?: true;
    url?: true;
    type?: true;
    postId?: true;
    messageId?: true;
    _all?: true;
  };

  export type AssetAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which Asset to aggregate.
     */
    where?: AssetWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Assets to fetch.
     */
    orderBy?: AssetOrderByWithRelationInput | AssetOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: AssetWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Assets from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Assets.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned Assets
     **/
    _count?: true | AssetCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: AssetMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: AssetMaxAggregateInputType;
  };

  export type GetAssetAggregateType<T extends AssetAggregateArgs> = {
    [P in keyof T & keyof AggregateAsset]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAsset[P]>
      : GetScalarType<T[P], AggregateAsset[P]>;
  };

  export type AssetGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: AssetWhereInput;
    orderBy?:
      | AssetOrderByWithAggregationInput
      | AssetOrderByWithAggregationInput[];
    by: AssetScalarFieldEnum[] | AssetScalarFieldEnum;
    having?: AssetScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: AssetCountAggregateInputType | true;
    _min?: AssetMinAggregateInputType;
    _max?: AssetMaxAggregateInputType;
  };

  export type AssetGroupByOutputType = {
    id: string;
    url: string;
    type: $Enums.AssetType;
    postId: string | null;
    messageId: string | null;
    _count: AssetCountAggregateOutputType | null;
    _min: AssetMinAggregateOutputType | null;
    _max: AssetMaxAggregateOutputType | null;
  };

  type GetAssetGroupByPayload<T extends AssetGroupByArgs> =
    Prisma.PrismaPromise<
      Array<
        PickEnumerable<AssetGroupByOutputType, T['by']> & {
          [P in keyof T & keyof AssetGroupByOutputType]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AssetGroupByOutputType[P]>
            : GetScalarType<T[P], AssetGroupByOutputType[P]>;
        }
      >
    >;

  export type AssetSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      url?: boolean;
      type?: boolean;
      postId?: boolean;
      messageId?: boolean;
      post?: boolean | Asset$postArgs<ExtArgs>;
      message?: boolean | Asset$messageArgs<ExtArgs>;
    },
    ExtArgs['result']['asset']
  >;

  export type AssetSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      url?: boolean;
      type?: boolean;
      postId?: boolean;
      messageId?: boolean;
      post?: boolean | Asset$postArgs<ExtArgs>;
      message?: boolean | Asset$messageArgs<ExtArgs>;
    },
    ExtArgs['result']['asset']
  >;

  export type AssetSelectUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      url?: boolean;
      type?: boolean;
      postId?: boolean;
      messageId?: boolean;
      post?: boolean | Asset$postArgs<ExtArgs>;
      message?: boolean | Asset$messageArgs<ExtArgs>;
    },
    ExtArgs['result']['asset']
  >;

  export type AssetSelectScalar = {
    id?: boolean;
    url?: boolean;
    type?: boolean;
    postId?: boolean;
    messageId?: boolean;
  };

  export type AssetOmit<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetOmit<
    'id' | 'url' | 'type' | 'postId' | 'messageId',
    ExtArgs['result']['asset']
  >;
  export type AssetInclude<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    post?: boolean | Asset$postArgs<ExtArgs>;
    message?: boolean | Asset$messageArgs<ExtArgs>;
  };
  export type AssetIncludeCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    post?: boolean | Asset$postArgs<ExtArgs>;
    message?: boolean | Asset$messageArgs<ExtArgs>;
  };
  export type AssetIncludeUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    post?: boolean | Asset$postArgs<ExtArgs>;
    message?: boolean | Asset$messageArgs<ExtArgs>;
  };

  export type $AssetPayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    name: 'Asset';
    objects: {
      post: Prisma.$PostPayload<ExtArgs> | null;
      message: Prisma.$MessagePayload<ExtArgs> | null;
    };
    scalars: $Extensions.GetPayloadResult<
      {
        id: string;
        url: string;
        type: $Enums.AssetType;
        postId: string | null;
        messageId: string | null;
      },
      ExtArgs['result']['asset']
    >;
    composites: {};
  };

  type AssetGetPayload<
    S extends boolean | null | undefined | AssetDefaultArgs,
  > = $Result.GetResult<Prisma.$AssetPayload, S>;

  type AssetCountArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = Omit<AssetFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: AssetCountAggregateInputType | true;
  };

  export interface AssetDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>['model']['Asset'];
      meta: { name: 'Asset' };
    };
    /**
     * Find zero or one Asset that matches the filter.
     * @param {AssetFindUniqueArgs} args - Arguments to find a Asset
     * @example
     * // Get one Asset
     * const asset = await prisma.asset.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AssetFindUniqueArgs>(
      args: SelectSubset<T, AssetFindUniqueArgs<ExtArgs>>,
    ): Prisma__AssetClient<
      $Result.GetResult<
        Prisma.$AssetPayload<ExtArgs>,
        T,
        'findUnique',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find one Asset that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AssetFindUniqueOrThrowArgs} args - Arguments to find a Asset
     * @example
     * // Get one Asset
     * const asset = await prisma.asset.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AssetFindUniqueOrThrowArgs>(
      args: SelectSubset<T, AssetFindUniqueOrThrowArgs<ExtArgs>>,
    ): Prisma__AssetClient<
      $Result.GetResult<
        Prisma.$AssetPayload<ExtArgs>,
        T,
        'findUniqueOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first Asset that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssetFindFirstArgs} args - Arguments to find a Asset
     * @example
     * // Get one Asset
     * const asset = await prisma.asset.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AssetFindFirstArgs>(
      args?: SelectSubset<T, AssetFindFirstArgs<ExtArgs>>,
    ): Prisma__AssetClient<
      $Result.GetResult<
        Prisma.$AssetPayload<ExtArgs>,
        T,
        'findFirst',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first Asset that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssetFindFirstOrThrowArgs} args - Arguments to find a Asset
     * @example
     * // Get one Asset
     * const asset = await prisma.asset.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AssetFindFirstOrThrowArgs>(
      args?: SelectSubset<T, AssetFindFirstOrThrowArgs<ExtArgs>>,
    ): Prisma__AssetClient<
      $Result.GetResult<
        Prisma.$AssetPayload<ExtArgs>,
        T,
        'findFirstOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find zero or more Assets that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssetFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Assets
     * const assets = await prisma.asset.findMany()
     *
     * // Get first 10 Assets
     * const assets = await prisma.asset.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const assetWithIdOnly = await prisma.asset.findMany({ select: { id: true } })
     *
     */
    findMany<T extends AssetFindManyArgs>(
      args?: SelectSubset<T, AssetFindManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$AssetPayload<ExtArgs>,
        T,
        'findMany',
        GlobalOmitOptions
      >
    >;

    /**
     * Create a Asset.
     * @param {AssetCreateArgs} args - Arguments to create a Asset.
     * @example
     * // Create one Asset
     * const Asset = await prisma.asset.create({
     *   data: {
     *     // ... data to create a Asset
     *   }
     * })
     *
     */
    create<T extends AssetCreateArgs>(
      args: SelectSubset<T, AssetCreateArgs<ExtArgs>>,
    ): Prisma__AssetClient<
      $Result.GetResult<
        Prisma.$AssetPayload<ExtArgs>,
        T,
        'create',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Create many Assets.
     * @param {AssetCreateManyArgs} args - Arguments to create many Assets.
     * @example
     * // Create many Assets
     * const asset = await prisma.asset.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends AssetCreateManyArgs>(
      args?: SelectSubset<T, AssetCreateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create many Assets and returns the data saved in the database.
     * @param {AssetCreateManyAndReturnArgs} args - Arguments to create many Assets.
     * @example
     * // Create many Assets
     * const asset = await prisma.asset.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many Assets and only return the `id`
     * const assetWithIdOnly = await prisma.asset.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends AssetCreateManyAndReturnArgs>(
      args?: SelectSubset<T, AssetCreateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$AssetPayload<ExtArgs>,
        T,
        'createManyAndReturn',
        GlobalOmitOptions
      >
    >;

    /**
     * Delete a Asset.
     * @param {AssetDeleteArgs} args - Arguments to delete one Asset.
     * @example
     * // Delete one Asset
     * const Asset = await prisma.asset.delete({
     *   where: {
     *     // ... filter to delete one Asset
     *   }
     * })
     *
     */
    delete<T extends AssetDeleteArgs>(
      args: SelectSubset<T, AssetDeleteArgs<ExtArgs>>,
    ): Prisma__AssetClient<
      $Result.GetResult<
        Prisma.$AssetPayload<ExtArgs>,
        T,
        'delete',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Update one Asset.
     * @param {AssetUpdateArgs} args - Arguments to update one Asset.
     * @example
     * // Update one Asset
     * const asset = await prisma.asset.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends AssetUpdateArgs>(
      args: SelectSubset<T, AssetUpdateArgs<ExtArgs>>,
    ): Prisma__AssetClient<
      $Result.GetResult<
        Prisma.$AssetPayload<ExtArgs>,
        T,
        'update',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Delete zero or more Assets.
     * @param {AssetDeleteManyArgs} args - Arguments to filter Assets to delete.
     * @example
     * // Delete a few Assets
     * const { count } = await prisma.asset.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends AssetDeleteManyArgs>(
      args?: SelectSubset<T, AssetDeleteManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Assets.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssetUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Assets
     * const asset = await prisma.asset.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends AssetUpdateManyArgs>(
      args: SelectSubset<T, AssetUpdateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Assets and returns the data updated in the database.
     * @param {AssetUpdateManyAndReturnArgs} args - Arguments to update many Assets.
     * @example
     * // Update many Assets
     * const asset = await prisma.asset.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more Assets and only return the `id`
     * const assetWithIdOnly = await prisma.asset.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    updateManyAndReturn<T extends AssetUpdateManyAndReturnArgs>(
      args: SelectSubset<T, AssetUpdateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$AssetPayload<ExtArgs>,
        T,
        'updateManyAndReturn',
        GlobalOmitOptions
      >
    >;

    /**
     * Create or update one Asset.
     * @param {AssetUpsertArgs} args - Arguments to update or create a Asset.
     * @example
     * // Update or create a Asset
     * const asset = await prisma.asset.upsert({
     *   create: {
     *     // ... data to create a Asset
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Asset we want to update
     *   }
     * })
     */
    upsert<T extends AssetUpsertArgs>(
      args: SelectSubset<T, AssetUpsertArgs<ExtArgs>>,
    ): Prisma__AssetClient<
      $Result.GetResult<
        Prisma.$AssetPayload<ExtArgs>,
        T,
        'upsert',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Count the number of Assets.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssetCountArgs} args - Arguments to filter Assets to count.
     * @example
     * // Count the number of Assets
     * const count = await prisma.asset.count({
     *   where: {
     *     // ... the filter for the Assets we want to count
     *   }
     * })
     **/
    count<T extends AssetCountArgs>(
      args?: Subset<T, AssetCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AssetCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a Asset.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssetAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends AssetAggregateArgs>(
      args: Subset<T, AssetAggregateArgs>,
    ): Prisma.PrismaPromise<GetAssetAggregateType<T>>;

    /**
     * Group by Asset.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssetGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends AssetGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AssetGroupByArgs['orderBy'] }
        : { orderBy?: AssetGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<
        Keys<MaybeTupleToUnion<T['orderBy']>>
      >,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [
                      Error,
                      'Field ',
                      P,
                      ` in "having" needs to be provided in "by"`,
                    ];
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, AssetGroupByArgs, OrderByArg> & InputErrors,
    ): {} extends InputErrors
      ? GetAssetGroupByPayload<T>
      : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the Asset model
     */
    readonly fields: AssetFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Asset.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AssetClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    post<T extends Asset$postArgs<ExtArgs> = {}>(
      args?: Subset<T, Asset$postArgs<ExtArgs>>,
    ): Prisma__PostClient<
      $Result.GetResult<
        Prisma.$PostPayload<ExtArgs>,
        T,
        'findUniqueOrThrow',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;
    message<T extends Asset$messageArgs<ExtArgs> = {}>(
      args?: Subset<T, Asset$messageArgs<ExtArgs>>,
    ): Prisma__MessageClient<
      $Result.GetResult<
        Prisma.$MessagePayload<ExtArgs>,
        T,
        'findUniqueOrThrow',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | null,
      onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null,
    ): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | null,
    ): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | null): $Utils.JsPromise<T>;
  }

  /**
   * Fields of the Asset model
   */
  interface AssetFieldRefs {
    readonly id: FieldRef<'Asset', 'String'>;
    readonly url: FieldRef<'Asset', 'String'>;
    readonly type: FieldRef<'Asset', 'AssetType'>;
    readonly postId: FieldRef<'Asset', 'String'>;
    readonly messageId: FieldRef<'Asset', 'String'>;
  }

  // Custom InputTypes
  /**
   * Asset findUnique
   */
  export type AssetFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Asset
     */
    select?: AssetSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Asset
     */
    omit?: AssetOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetInclude<ExtArgs> | null;
    /**
     * Filter, which Asset to fetch.
     */
    where: AssetWhereUniqueInput;
  };

  /**
   * Asset findUniqueOrThrow
   */
  export type AssetFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Asset
     */
    select?: AssetSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Asset
     */
    omit?: AssetOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetInclude<ExtArgs> | null;
    /**
     * Filter, which Asset to fetch.
     */
    where: AssetWhereUniqueInput;
  };

  /**
   * Asset findFirst
   */
  export type AssetFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Asset
     */
    select?: AssetSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Asset
     */
    omit?: AssetOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetInclude<ExtArgs> | null;
    /**
     * Filter, which Asset to fetch.
     */
    where?: AssetWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Assets to fetch.
     */
    orderBy?: AssetOrderByWithRelationInput | AssetOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Assets.
     */
    cursor?: AssetWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Assets from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Assets.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Assets.
     */
    distinct?: AssetScalarFieldEnum | AssetScalarFieldEnum[];
  };

  /**
   * Asset findFirstOrThrow
   */
  export type AssetFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Asset
     */
    select?: AssetSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Asset
     */
    omit?: AssetOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetInclude<ExtArgs> | null;
    /**
     * Filter, which Asset to fetch.
     */
    where?: AssetWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Assets to fetch.
     */
    orderBy?: AssetOrderByWithRelationInput | AssetOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Assets.
     */
    cursor?: AssetWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Assets from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Assets.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Assets.
     */
    distinct?: AssetScalarFieldEnum | AssetScalarFieldEnum[];
  };

  /**
   * Asset findMany
   */
  export type AssetFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Asset
     */
    select?: AssetSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Asset
     */
    omit?: AssetOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetInclude<ExtArgs> | null;
    /**
     * Filter, which Assets to fetch.
     */
    where?: AssetWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Assets to fetch.
     */
    orderBy?: AssetOrderByWithRelationInput | AssetOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing Assets.
     */
    cursor?: AssetWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Assets from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Assets.
     */
    skip?: number;
    distinct?: AssetScalarFieldEnum | AssetScalarFieldEnum[];
  };

  /**
   * Asset create
   */
  export type AssetCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Asset
     */
    select?: AssetSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Asset
     */
    omit?: AssetOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetInclude<ExtArgs> | null;
    /**
     * The data needed to create a Asset.
     */
    data: XOR<AssetCreateInput, AssetUncheckedCreateInput>;
  };

  /**
   * Asset createMany
   */
  export type AssetCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many Assets.
     */
    data: AssetCreateManyInput | AssetCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * Asset createManyAndReturn
   */
  export type AssetCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Asset
     */
    select?: AssetSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the Asset
     */
    omit?: AssetOmit<ExtArgs> | null;
    /**
     * The data used to create many Assets.
     */
    data: AssetCreateManyInput | AssetCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetIncludeCreateManyAndReturn<ExtArgs> | null;
  };

  /**
   * Asset update
   */
  export type AssetUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Asset
     */
    select?: AssetSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Asset
     */
    omit?: AssetOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetInclude<ExtArgs> | null;
    /**
     * The data needed to update a Asset.
     */
    data: XOR<AssetUpdateInput, AssetUncheckedUpdateInput>;
    /**
     * Choose, which Asset to update.
     */
    where: AssetWhereUniqueInput;
  };

  /**
   * Asset updateMany
   */
  export type AssetUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update Assets.
     */
    data: XOR<AssetUpdateManyMutationInput, AssetUncheckedUpdateManyInput>;
    /**
     * Filter which Assets to update
     */
    where?: AssetWhereInput;
    /**
     * Limit how many Assets to update.
     */
    limit?: number;
  };

  /**
   * Asset updateManyAndReturn
   */
  export type AssetUpdateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Asset
     */
    select?: AssetSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the Asset
     */
    omit?: AssetOmit<ExtArgs> | null;
    /**
     * The data used to update Assets.
     */
    data: XOR<AssetUpdateManyMutationInput, AssetUncheckedUpdateManyInput>;
    /**
     * Filter which Assets to update
     */
    where?: AssetWhereInput;
    /**
     * Limit how many Assets to update.
     */
    limit?: number;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetIncludeUpdateManyAndReturn<ExtArgs> | null;
  };

  /**
   * Asset upsert
   */
  export type AssetUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Asset
     */
    select?: AssetSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Asset
     */
    omit?: AssetOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetInclude<ExtArgs> | null;
    /**
     * The filter to search for the Asset to update in case it exists.
     */
    where: AssetWhereUniqueInput;
    /**
     * In case the Asset found by the `where` argument doesn't exist, create a new Asset with this data.
     */
    create: XOR<AssetCreateInput, AssetUncheckedCreateInput>;
    /**
     * In case the Asset was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AssetUpdateInput, AssetUncheckedUpdateInput>;
  };

  /**
   * Asset delete
   */
  export type AssetDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Asset
     */
    select?: AssetSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Asset
     */
    omit?: AssetOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetInclude<ExtArgs> | null;
    /**
     * Filter which Asset to delete.
     */
    where: AssetWhereUniqueInput;
  };

  /**
   * Asset deleteMany
   */
  export type AssetDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which Assets to delete
     */
    where?: AssetWhereInput;
    /**
     * Limit how many Assets to delete.
     */
    limit?: number;
  };

  /**
   * Asset.post
   */
  export type Asset$postArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Post
     */
    omit?: PostOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostInclude<ExtArgs> | null;
    where?: PostWhereInput;
  };

  /**
   * Asset.message
   */
  export type Asset$messageArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null;
    where?: MessageWhereInput;
  };

  /**
   * Asset without action
   */
  export type AssetDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Asset
     */
    select?: AssetSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Asset
     */
    omit?: AssetOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetInclude<ExtArgs> | null;
  };

  /**
   * Model Comment
   */

  export type AggregateComment = {
    _count: CommentCountAggregateOutputType | null;
    _min: CommentMinAggregateOutputType | null;
    _max: CommentMaxAggregateOutputType | null;
  };

  export type CommentMinAggregateOutputType = {
    id: string | null;
    authorId: string | null;
    postId: string | null;
    parentId: string | null;
    content: string | null;
    createdAt: Date | null;
  };

  export type CommentMaxAggregateOutputType = {
    id: string | null;
    authorId: string | null;
    postId: string | null;
    parentId: string | null;
    content: string | null;
    createdAt: Date | null;
  };

  export type CommentCountAggregateOutputType = {
    id: number;
    authorId: number;
    postId: number;
    parentId: number;
    content: number;
    createdAt: number;
    _all: number;
  };

  export type CommentMinAggregateInputType = {
    id?: true;
    authorId?: true;
    postId?: true;
    parentId?: true;
    content?: true;
    createdAt?: true;
  };

  export type CommentMaxAggregateInputType = {
    id?: true;
    authorId?: true;
    postId?: true;
    parentId?: true;
    content?: true;
    createdAt?: true;
  };

  export type CommentCountAggregateInputType = {
    id?: true;
    authorId?: true;
    postId?: true;
    parentId?: true;
    content?: true;
    createdAt?: true;
    _all?: true;
  };

  export type CommentAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which Comment to aggregate.
     */
    where?: CommentWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Comments to fetch.
     */
    orderBy?:
      | CommentOrderByWithRelationInput
      | CommentOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: CommentWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Comments from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Comments.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned Comments
     **/
    _count?: true | CommentCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: CommentMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: CommentMaxAggregateInputType;
  };

  export type GetCommentAggregateType<T extends CommentAggregateArgs> = {
    [P in keyof T & keyof AggregateComment]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateComment[P]>
      : GetScalarType<T[P], AggregateComment[P]>;
  };

  export type CommentGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: CommentWhereInput;
    orderBy?:
      | CommentOrderByWithAggregationInput
      | CommentOrderByWithAggregationInput[];
    by: CommentScalarFieldEnum[] | CommentScalarFieldEnum;
    having?: CommentScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: CommentCountAggregateInputType | true;
    _min?: CommentMinAggregateInputType;
    _max?: CommentMaxAggregateInputType;
  };

  export type CommentGroupByOutputType = {
    id: string;
    authorId: string;
    postId: string;
    parentId: string | null;
    content: string;
    createdAt: Date;
    _count: CommentCountAggregateOutputType | null;
    _min: CommentMinAggregateOutputType | null;
    _max: CommentMaxAggregateOutputType | null;
  };

  type GetCommentGroupByPayload<T extends CommentGroupByArgs> =
    Prisma.PrismaPromise<
      Array<
        PickEnumerable<CommentGroupByOutputType, T['by']> & {
          [P in keyof T & keyof CommentGroupByOutputType]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CommentGroupByOutputType[P]>
            : GetScalarType<T[P], CommentGroupByOutputType[P]>;
        }
      >
    >;

  export type CommentSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      authorId?: boolean;
      postId?: boolean;
      parentId?: boolean;
      content?: boolean;
      createdAt?: boolean;
      parent?: boolean | Comment$parentArgs<ExtArgs>;
      children?: boolean | Comment$childrenArgs<ExtArgs>;
      likes?: boolean | Comment$likesArgs<ExtArgs>;
      post?: boolean | PostDefaultArgs<ExtArgs>;
      author?: boolean | UserDefaultArgs<ExtArgs>;
      _count?: boolean | CommentCountOutputTypeDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['comment']
  >;

  export type CommentSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      authorId?: boolean;
      postId?: boolean;
      parentId?: boolean;
      content?: boolean;
      createdAt?: boolean;
      parent?: boolean | Comment$parentArgs<ExtArgs>;
      post?: boolean | PostDefaultArgs<ExtArgs>;
      author?: boolean | UserDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['comment']
  >;

  export type CommentSelectUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      authorId?: boolean;
      postId?: boolean;
      parentId?: boolean;
      content?: boolean;
      createdAt?: boolean;
      parent?: boolean | Comment$parentArgs<ExtArgs>;
      post?: boolean | PostDefaultArgs<ExtArgs>;
      author?: boolean | UserDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['comment']
  >;

  export type CommentSelectScalar = {
    id?: boolean;
    authorId?: boolean;
    postId?: boolean;
    parentId?: boolean;
    content?: boolean;
    createdAt?: boolean;
  };

  export type CommentOmit<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetOmit<
    'id' | 'authorId' | 'postId' | 'parentId' | 'content' | 'createdAt',
    ExtArgs['result']['comment']
  >;
  export type CommentInclude<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    parent?: boolean | Comment$parentArgs<ExtArgs>;
    children?: boolean | Comment$childrenArgs<ExtArgs>;
    likes?: boolean | Comment$likesArgs<ExtArgs>;
    post?: boolean | PostDefaultArgs<ExtArgs>;
    author?: boolean | UserDefaultArgs<ExtArgs>;
    _count?: boolean | CommentCountOutputTypeDefaultArgs<ExtArgs>;
  };
  export type CommentIncludeCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    parent?: boolean | Comment$parentArgs<ExtArgs>;
    post?: boolean | PostDefaultArgs<ExtArgs>;
    author?: boolean | UserDefaultArgs<ExtArgs>;
  };
  export type CommentIncludeUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    parent?: boolean | Comment$parentArgs<ExtArgs>;
    post?: boolean | PostDefaultArgs<ExtArgs>;
    author?: boolean | UserDefaultArgs<ExtArgs>;
  };

  export type $CommentPayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    name: 'Comment';
    objects: {
      parent: Prisma.$CommentPayload<ExtArgs> | null;
      children: Prisma.$CommentPayload<ExtArgs>[];
      likes: Prisma.$LikePayload<ExtArgs>[];
      post: Prisma.$PostPayload<ExtArgs>;
      author: Prisma.$UserPayload<ExtArgs>;
    };
    scalars: $Extensions.GetPayloadResult<
      {
        id: string;
        authorId: string;
        postId: string;
        parentId: string | null;
        content: string;
        createdAt: Date;
      },
      ExtArgs['result']['comment']
    >;
    composites: {};
  };

  type CommentGetPayload<
    S extends boolean | null | undefined | CommentDefaultArgs,
  > = $Result.GetResult<Prisma.$CommentPayload, S>;

  type CommentCountArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = Omit<CommentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: CommentCountAggregateInputType | true;
  };

  export interface CommentDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>['model']['Comment'];
      meta: { name: 'Comment' };
    };
    /**
     * Find zero or one Comment that matches the filter.
     * @param {CommentFindUniqueArgs} args - Arguments to find a Comment
     * @example
     * // Get one Comment
     * const comment = await prisma.comment.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CommentFindUniqueArgs>(
      args: SelectSubset<T, CommentFindUniqueArgs<ExtArgs>>,
    ): Prisma__CommentClient<
      $Result.GetResult<
        Prisma.$CommentPayload<ExtArgs>,
        T,
        'findUnique',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find one Comment that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CommentFindUniqueOrThrowArgs} args - Arguments to find a Comment
     * @example
     * // Get one Comment
     * const comment = await prisma.comment.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CommentFindUniqueOrThrowArgs>(
      args: SelectSubset<T, CommentFindUniqueOrThrowArgs<ExtArgs>>,
    ): Prisma__CommentClient<
      $Result.GetResult<
        Prisma.$CommentPayload<ExtArgs>,
        T,
        'findUniqueOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first Comment that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommentFindFirstArgs} args - Arguments to find a Comment
     * @example
     * // Get one Comment
     * const comment = await prisma.comment.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CommentFindFirstArgs>(
      args?: SelectSubset<T, CommentFindFirstArgs<ExtArgs>>,
    ): Prisma__CommentClient<
      $Result.GetResult<
        Prisma.$CommentPayload<ExtArgs>,
        T,
        'findFirst',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first Comment that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommentFindFirstOrThrowArgs} args - Arguments to find a Comment
     * @example
     * // Get one Comment
     * const comment = await prisma.comment.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CommentFindFirstOrThrowArgs>(
      args?: SelectSubset<T, CommentFindFirstOrThrowArgs<ExtArgs>>,
    ): Prisma__CommentClient<
      $Result.GetResult<
        Prisma.$CommentPayload<ExtArgs>,
        T,
        'findFirstOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find zero or more Comments that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Comments
     * const comments = await prisma.comment.findMany()
     *
     * // Get first 10 Comments
     * const comments = await prisma.comment.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const commentWithIdOnly = await prisma.comment.findMany({ select: { id: true } })
     *
     */
    findMany<T extends CommentFindManyArgs>(
      args?: SelectSubset<T, CommentFindManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$CommentPayload<ExtArgs>,
        T,
        'findMany',
        GlobalOmitOptions
      >
    >;

    /**
     * Create a Comment.
     * @param {CommentCreateArgs} args - Arguments to create a Comment.
     * @example
     * // Create one Comment
     * const Comment = await prisma.comment.create({
     *   data: {
     *     // ... data to create a Comment
     *   }
     * })
     *
     */
    create<T extends CommentCreateArgs>(
      args: SelectSubset<T, CommentCreateArgs<ExtArgs>>,
    ): Prisma__CommentClient<
      $Result.GetResult<
        Prisma.$CommentPayload<ExtArgs>,
        T,
        'create',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Create many Comments.
     * @param {CommentCreateManyArgs} args - Arguments to create many Comments.
     * @example
     * // Create many Comments
     * const comment = await prisma.comment.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends CommentCreateManyArgs>(
      args?: SelectSubset<T, CommentCreateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create many Comments and returns the data saved in the database.
     * @param {CommentCreateManyAndReturnArgs} args - Arguments to create many Comments.
     * @example
     * // Create many Comments
     * const comment = await prisma.comment.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many Comments and only return the `id`
     * const commentWithIdOnly = await prisma.comment.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends CommentCreateManyAndReturnArgs>(
      args?: SelectSubset<T, CommentCreateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$CommentPayload<ExtArgs>,
        T,
        'createManyAndReturn',
        GlobalOmitOptions
      >
    >;

    /**
     * Delete a Comment.
     * @param {CommentDeleteArgs} args - Arguments to delete one Comment.
     * @example
     * // Delete one Comment
     * const Comment = await prisma.comment.delete({
     *   where: {
     *     // ... filter to delete one Comment
     *   }
     * })
     *
     */
    delete<T extends CommentDeleteArgs>(
      args: SelectSubset<T, CommentDeleteArgs<ExtArgs>>,
    ): Prisma__CommentClient<
      $Result.GetResult<
        Prisma.$CommentPayload<ExtArgs>,
        T,
        'delete',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Update one Comment.
     * @param {CommentUpdateArgs} args - Arguments to update one Comment.
     * @example
     * // Update one Comment
     * const comment = await prisma.comment.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends CommentUpdateArgs>(
      args: SelectSubset<T, CommentUpdateArgs<ExtArgs>>,
    ): Prisma__CommentClient<
      $Result.GetResult<
        Prisma.$CommentPayload<ExtArgs>,
        T,
        'update',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Delete zero or more Comments.
     * @param {CommentDeleteManyArgs} args - Arguments to filter Comments to delete.
     * @example
     * // Delete a few Comments
     * const { count } = await prisma.comment.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends CommentDeleteManyArgs>(
      args?: SelectSubset<T, CommentDeleteManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Comments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Comments
     * const comment = await prisma.comment.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends CommentUpdateManyArgs>(
      args: SelectSubset<T, CommentUpdateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Comments and returns the data updated in the database.
     * @param {CommentUpdateManyAndReturnArgs} args - Arguments to update many Comments.
     * @example
     * // Update many Comments
     * const comment = await prisma.comment.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more Comments and only return the `id`
     * const commentWithIdOnly = await prisma.comment.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    updateManyAndReturn<T extends CommentUpdateManyAndReturnArgs>(
      args: SelectSubset<T, CommentUpdateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$CommentPayload<ExtArgs>,
        T,
        'updateManyAndReturn',
        GlobalOmitOptions
      >
    >;

    /**
     * Create or update one Comment.
     * @param {CommentUpsertArgs} args - Arguments to update or create a Comment.
     * @example
     * // Update or create a Comment
     * const comment = await prisma.comment.upsert({
     *   create: {
     *     // ... data to create a Comment
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Comment we want to update
     *   }
     * })
     */
    upsert<T extends CommentUpsertArgs>(
      args: SelectSubset<T, CommentUpsertArgs<ExtArgs>>,
    ): Prisma__CommentClient<
      $Result.GetResult<
        Prisma.$CommentPayload<ExtArgs>,
        T,
        'upsert',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Count the number of Comments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommentCountArgs} args - Arguments to filter Comments to count.
     * @example
     * // Count the number of Comments
     * const count = await prisma.comment.count({
     *   where: {
     *     // ... the filter for the Comments we want to count
     *   }
     * })
     **/
    count<T extends CommentCountArgs>(
      args?: Subset<T, CommentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CommentCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a Comment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends CommentAggregateArgs>(
      args: Subset<T, CommentAggregateArgs>,
    ): Prisma.PrismaPromise<GetCommentAggregateType<T>>;

    /**
     * Group by Comment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CommentGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends CommentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CommentGroupByArgs['orderBy'] }
        : { orderBy?: CommentGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<
        Keys<MaybeTupleToUnion<T['orderBy']>>
      >,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [
                      Error,
                      'Field ',
                      P,
                      ` in "having" needs to be provided in "by"`,
                    ];
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, CommentGroupByArgs, OrderByArg> & InputErrors,
    ): {} extends InputErrors
      ? GetCommentGroupByPayload<T>
      : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the Comment model
     */
    readonly fields: CommentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Comment.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CommentClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    parent<T extends Comment$parentArgs<ExtArgs> = {}>(
      args?: Subset<T, Comment$parentArgs<ExtArgs>>,
    ): Prisma__CommentClient<
      $Result.GetResult<
        Prisma.$CommentPayload<ExtArgs>,
        T,
        'findUniqueOrThrow',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;
    children<T extends Comment$childrenArgs<ExtArgs> = {}>(
      args?: Subset<T, Comment$childrenArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      | $Result.GetResult<
          Prisma.$CommentPayload<ExtArgs>,
          T,
          'findMany',
          GlobalOmitOptions
        >
      | Null
    >;
    likes<T extends Comment$likesArgs<ExtArgs> = {}>(
      args?: Subset<T, Comment$likesArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      | $Result.GetResult<
          Prisma.$LikePayload<ExtArgs>,
          T,
          'findMany',
          GlobalOmitOptions
        >
      | Null
    >;
    post<T extends PostDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, PostDefaultArgs<ExtArgs>>,
    ): Prisma__PostClient<
      | $Result.GetResult<
          Prisma.$PostPayload<ExtArgs>,
          T,
          'findUniqueOrThrow',
          GlobalOmitOptions
        >
      | Null,
      Null,
      ExtArgs,
      GlobalOmitOptions
    >;
    author<T extends UserDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, UserDefaultArgs<ExtArgs>>,
    ): Prisma__UserClient<
      | $Result.GetResult<
          Prisma.$UserPayload<ExtArgs>,
          T,
          'findUniqueOrThrow',
          GlobalOmitOptions
        >
      | Null,
      Null,
      ExtArgs,
      GlobalOmitOptions
    >;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | null,
      onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null,
    ): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | null,
    ): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | null): $Utils.JsPromise<T>;
  }

  /**
   * Fields of the Comment model
   */
  interface CommentFieldRefs {
    readonly id: FieldRef<'Comment', 'String'>;
    readonly authorId: FieldRef<'Comment', 'String'>;
    readonly postId: FieldRef<'Comment', 'String'>;
    readonly parentId: FieldRef<'Comment', 'String'>;
    readonly content: FieldRef<'Comment', 'String'>;
    readonly createdAt: FieldRef<'Comment', 'DateTime'>;
  }

  // Custom InputTypes
  /**
   * Comment findUnique
   */
  export type CommentFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Comment
     */
    omit?: CommentOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentInclude<ExtArgs> | null;
    /**
     * Filter, which Comment to fetch.
     */
    where: CommentWhereUniqueInput;
  };

  /**
   * Comment findUniqueOrThrow
   */
  export type CommentFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Comment
     */
    omit?: CommentOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentInclude<ExtArgs> | null;
    /**
     * Filter, which Comment to fetch.
     */
    where: CommentWhereUniqueInput;
  };

  /**
   * Comment findFirst
   */
  export type CommentFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Comment
     */
    omit?: CommentOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentInclude<ExtArgs> | null;
    /**
     * Filter, which Comment to fetch.
     */
    where?: CommentWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Comments to fetch.
     */
    orderBy?:
      | CommentOrderByWithRelationInput
      | CommentOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Comments.
     */
    cursor?: CommentWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Comments from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Comments.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Comments.
     */
    distinct?: CommentScalarFieldEnum | CommentScalarFieldEnum[];
  };

  /**
   * Comment findFirstOrThrow
   */
  export type CommentFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Comment
     */
    omit?: CommentOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentInclude<ExtArgs> | null;
    /**
     * Filter, which Comment to fetch.
     */
    where?: CommentWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Comments to fetch.
     */
    orderBy?:
      | CommentOrderByWithRelationInput
      | CommentOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Comments.
     */
    cursor?: CommentWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Comments from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Comments.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Comments.
     */
    distinct?: CommentScalarFieldEnum | CommentScalarFieldEnum[];
  };

  /**
   * Comment findMany
   */
  export type CommentFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Comment
     */
    omit?: CommentOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentInclude<ExtArgs> | null;
    /**
     * Filter, which Comments to fetch.
     */
    where?: CommentWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Comments to fetch.
     */
    orderBy?:
      | CommentOrderByWithRelationInput
      | CommentOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing Comments.
     */
    cursor?: CommentWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Comments from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Comments.
     */
    skip?: number;
    distinct?: CommentScalarFieldEnum | CommentScalarFieldEnum[];
  };

  /**
   * Comment create
   */
  export type CommentCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Comment
     */
    omit?: CommentOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentInclude<ExtArgs> | null;
    /**
     * The data needed to create a Comment.
     */
    data: XOR<CommentCreateInput, CommentUncheckedCreateInput>;
  };

  /**
   * Comment createMany
   */
  export type CommentCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many Comments.
     */
    data: CommentCreateManyInput | CommentCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * Comment createManyAndReturn
   */
  export type CommentCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the Comment
     */
    omit?: CommentOmit<ExtArgs> | null;
    /**
     * The data used to create many Comments.
     */
    data: CommentCreateManyInput | CommentCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentIncludeCreateManyAndReturn<ExtArgs> | null;
  };

  /**
   * Comment update
   */
  export type CommentUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Comment
     */
    omit?: CommentOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentInclude<ExtArgs> | null;
    /**
     * The data needed to update a Comment.
     */
    data: XOR<CommentUpdateInput, CommentUncheckedUpdateInput>;
    /**
     * Choose, which Comment to update.
     */
    where: CommentWhereUniqueInput;
  };

  /**
   * Comment updateMany
   */
  export type CommentUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update Comments.
     */
    data: XOR<CommentUpdateManyMutationInput, CommentUncheckedUpdateManyInput>;
    /**
     * Filter which Comments to update
     */
    where?: CommentWhereInput;
    /**
     * Limit how many Comments to update.
     */
    limit?: number;
  };

  /**
   * Comment updateManyAndReturn
   */
  export type CommentUpdateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the Comment
     */
    omit?: CommentOmit<ExtArgs> | null;
    /**
     * The data used to update Comments.
     */
    data: XOR<CommentUpdateManyMutationInput, CommentUncheckedUpdateManyInput>;
    /**
     * Filter which Comments to update
     */
    where?: CommentWhereInput;
    /**
     * Limit how many Comments to update.
     */
    limit?: number;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentIncludeUpdateManyAndReturn<ExtArgs> | null;
  };

  /**
   * Comment upsert
   */
  export type CommentUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Comment
     */
    omit?: CommentOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentInclude<ExtArgs> | null;
    /**
     * The filter to search for the Comment to update in case it exists.
     */
    where: CommentWhereUniqueInput;
    /**
     * In case the Comment found by the `where` argument doesn't exist, create a new Comment with this data.
     */
    create: XOR<CommentCreateInput, CommentUncheckedCreateInput>;
    /**
     * In case the Comment was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CommentUpdateInput, CommentUncheckedUpdateInput>;
  };

  /**
   * Comment delete
   */
  export type CommentDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Comment
     */
    omit?: CommentOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentInclude<ExtArgs> | null;
    /**
     * Filter which Comment to delete.
     */
    where: CommentWhereUniqueInput;
  };

  /**
   * Comment deleteMany
   */
  export type CommentDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which Comments to delete
     */
    where?: CommentWhereInput;
    /**
     * Limit how many Comments to delete.
     */
    limit?: number;
  };

  /**
   * Comment.parent
   */
  export type Comment$parentArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Comment
     */
    omit?: CommentOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentInclude<ExtArgs> | null;
    where?: CommentWhereInput;
  };

  /**
   * Comment.children
   */
  export type Comment$childrenArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Comment
     */
    omit?: CommentOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentInclude<ExtArgs> | null;
    where?: CommentWhereInput;
    orderBy?:
      | CommentOrderByWithRelationInput
      | CommentOrderByWithRelationInput[];
    cursor?: CommentWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: CommentScalarFieldEnum | CommentScalarFieldEnum[];
  };

  /**
   * Comment.likes
   */
  export type Comment$likesArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Like
     */
    select?: LikeSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Like
     */
    omit?: LikeOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LikeInclude<ExtArgs> | null;
    where?: LikeWhereInput;
    orderBy?: LikeOrderByWithRelationInput | LikeOrderByWithRelationInput[];
    cursor?: LikeWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: LikeScalarFieldEnum | LikeScalarFieldEnum[];
  };

  /**
   * Comment without action
   */
  export type CommentDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Comment
     */
    omit?: CommentOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentInclude<ExtArgs> | null;
  };

  /**
   * Model Like
   */

  export type AggregateLike = {
    _count: LikeCountAggregateOutputType | null;
    _min: LikeMinAggregateOutputType | null;
    _max: LikeMaxAggregateOutputType | null;
  };

  export type LikeMinAggregateOutputType = {
    id: string | null;
    authorId: string | null;
    postId: string | null;
    commentId: string | null;
    createdAt: Date | null;
  };

  export type LikeMaxAggregateOutputType = {
    id: string | null;
    authorId: string | null;
    postId: string | null;
    commentId: string | null;
    createdAt: Date | null;
  };

  export type LikeCountAggregateOutputType = {
    id: number;
    authorId: number;
    postId: number;
    commentId: number;
    createdAt: number;
    _all: number;
  };

  export type LikeMinAggregateInputType = {
    id?: true;
    authorId?: true;
    postId?: true;
    commentId?: true;
    createdAt?: true;
  };

  export type LikeMaxAggregateInputType = {
    id?: true;
    authorId?: true;
    postId?: true;
    commentId?: true;
    createdAt?: true;
  };

  export type LikeCountAggregateInputType = {
    id?: true;
    authorId?: true;
    postId?: true;
    commentId?: true;
    createdAt?: true;
    _all?: true;
  };

  export type LikeAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which Like to aggregate.
     */
    where?: LikeWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Likes to fetch.
     */
    orderBy?: LikeOrderByWithRelationInput | LikeOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: LikeWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Likes from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Likes.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned Likes
     **/
    _count?: true | LikeCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: LikeMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: LikeMaxAggregateInputType;
  };

  export type GetLikeAggregateType<T extends LikeAggregateArgs> = {
    [P in keyof T & keyof AggregateLike]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLike[P]>
      : GetScalarType<T[P], AggregateLike[P]>;
  };

  export type LikeGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: LikeWhereInput;
    orderBy?:
      | LikeOrderByWithAggregationInput
      | LikeOrderByWithAggregationInput[];
    by: LikeScalarFieldEnum[] | LikeScalarFieldEnum;
    having?: LikeScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: LikeCountAggregateInputType | true;
    _min?: LikeMinAggregateInputType;
    _max?: LikeMaxAggregateInputType;
  };

  export type LikeGroupByOutputType = {
    id: string;
    authorId: string;
    postId: string | null;
    commentId: string | null;
    createdAt: Date;
    _count: LikeCountAggregateOutputType | null;
    _min: LikeMinAggregateOutputType | null;
    _max: LikeMaxAggregateOutputType | null;
  };

  type GetLikeGroupByPayload<T extends LikeGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<LikeGroupByOutputType, T['by']> & {
        [P in keyof T & keyof LikeGroupByOutputType]: P extends '_count'
          ? T[P] extends boolean
            ? number
            : GetScalarType<T[P], LikeGroupByOutputType[P]>
          : GetScalarType<T[P], LikeGroupByOutputType[P]>;
      }
    >
  >;

  export type LikeSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      authorId?: boolean;
      postId?: boolean;
      commentId?: boolean;
      createdAt?: boolean;
      post?: boolean | Like$postArgs<ExtArgs>;
      comment?: boolean | Like$commentArgs<ExtArgs>;
      author?: boolean | UserDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['like']
  >;

  export type LikeSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      authorId?: boolean;
      postId?: boolean;
      commentId?: boolean;
      createdAt?: boolean;
      post?: boolean | Like$postArgs<ExtArgs>;
      comment?: boolean | Like$commentArgs<ExtArgs>;
      author?: boolean | UserDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['like']
  >;

  export type LikeSelectUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      authorId?: boolean;
      postId?: boolean;
      commentId?: boolean;
      createdAt?: boolean;
      post?: boolean | Like$postArgs<ExtArgs>;
      comment?: boolean | Like$commentArgs<ExtArgs>;
      author?: boolean | UserDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['like']
  >;

  export type LikeSelectScalar = {
    id?: boolean;
    authorId?: boolean;
    postId?: boolean;
    commentId?: boolean;
    createdAt?: boolean;
  };

  export type LikeOmit<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetOmit<
    'id' | 'authorId' | 'postId' | 'commentId' | 'createdAt',
    ExtArgs['result']['like']
  >;
  export type LikeInclude<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    post?: boolean | Like$postArgs<ExtArgs>;
    comment?: boolean | Like$commentArgs<ExtArgs>;
    author?: boolean | UserDefaultArgs<ExtArgs>;
  };
  export type LikeIncludeCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    post?: boolean | Like$postArgs<ExtArgs>;
    comment?: boolean | Like$commentArgs<ExtArgs>;
    author?: boolean | UserDefaultArgs<ExtArgs>;
  };
  export type LikeIncludeUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    post?: boolean | Like$postArgs<ExtArgs>;
    comment?: boolean | Like$commentArgs<ExtArgs>;
    author?: boolean | UserDefaultArgs<ExtArgs>;
  };

  export type $LikePayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    name: 'Like';
    objects: {
      post: Prisma.$PostPayload<ExtArgs> | null;
      comment: Prisma.$CommentPayload<ExtArgs> | null;
      author: Prisma.$UserPayload<ExtArgs>;
    };
    scalars: $Extensions.GetPayloadResult<
      {
        id: string;
        authorId: string;
        postId: string | null;
        commentId: string | null;
        createdAt: Date;
      },
      ExtArgs['result']['like']
    >;
    composites: {};
  };

  type LikeGetPayload<S extends boolean | null | undefined | LikeDefaultArgs> =
    $Result.GetResult<Prisma.$LikePayload, S>;

  type LikeCountArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = Omit<LikeFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: LikeCountAggregateInputType | true;
  };

  export interface LikeDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>['model']['Like'];
      meta: { name: 'Like' };
    };
    /**
     * Find zero or one Like that matches the filter.
     * @param {LikeFindUniqueArgs} args - Arguments to find a Like
     * @example
     * // Get one Like
     * const like = await prisma.like.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends LikeFindUniqueArgs>(
      args: SelectSubset<T, LikeFindUniqueArgs<ExtArgs>>,
    ): Prisma__LikeClient<
      $Result.GetResult<
        Prisma.$LikePayload<ExtArgs>,
        T,
        'findUnique',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find one Like that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {LikeFindUniqueOrThrowArgs} args - Arguments to find a Like
     * @example
     * // Get one Like
     * const like = await prisma.like.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends LikeFindUniqueOrThrowArgs>(
      args: SelectSubset<T, LikeFindUniqueOrThrowArgs<ExtArgs>>,
    ): Prisma__LikeClient<
      $Result.GetResult<
        Prisma.$LikePayload<ExtArgs>,
        T,
        'findUniqueOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first Like that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LikeFindFirstArgs} args - Arguments to find a Like
     * @example
     * // Get one Like
     * const like = await prisma.like.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends LikeFindFirstArgs>(
      args?: SelectSubset<T, LikeFindFirstArgs<ExtArgs>>,
    ): Prisma__LikeClient<
      $Result.GetResult<
        Prisma.$LikePayload<ExtArgs>,
        T,
        'findFirst',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first Like that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LikeFindFirstOrThrowArgs} args - Arguments to find a Like
     * @example
     * // Get one Like
     * const like = await prisma.like.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends LikeFindFirstOrThrowArgs>(
      args?: SelectSubset<T, LikeFindFirstOrThrowArgs<ExtArgs>>,
    ): Prisma__LikeClient<
      $Result.GetResult<
        Prisma.$LikePayload<ExtArgs>,
        T,
        'findFirstOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find zero or more Likes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LikeFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Likes
     * const likes = await prisma.like.findMany()
     *
     * // Get first 10 Likes
     * const likes = await prisma.like.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const likeWithIdOnly = await prisma.like.findMany({ select: { id: true } })
     *
     */
    findMany<T extends LikeFindManyArgs>(
      args?: SelectSubset<T, LikeFindManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$LikePayload<ExtArgs>,
        T,
        'findMany',
        GlobalOmitOptions
      >
    >;

    /**
     * Create a Like.
     * @param {LikeCreateArgs} args - Arguments to create a Like.
     * @example
     * // Create one Like
     * const Like = await prisma.like.create({
     *   data: {
     *     // ... data to create a Like
     *   }
     * })
     *
     */
    create<T extends LikeCreateArgs>(
      args: SelectSubset<T, LikeCreateArgs<ExtArgs>>,
    ): Prisma__LikeClient<
      $Result.GetResult<
        Prisma.$LikePayload<ExtArgs>,
        T,
        'create',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Create many Likes.
     * @param {LikeCreateManyArgs} args - Arguments to create many Likes.
     * @example
     * // Create many Likes
     * const like = await prisma.like.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends LikeCreateManyArgs>(
      args?: SelectSubset<T, LikeCreateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create many Likes and returns the data saved in the database.
     * @param {LikeCreateManyAndReturnArgs} args - Arguments to create many Likes.
     * @example
     * // Create many Likes
     * const like = await prisma.like.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many Likes and only return the `id`
     * const likeWithIdOnly = await prisma.like.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends LikeCreateManyAndReturnArgs>(
      args?: SelectSubset<T, LikeCreateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$LikePayload<ExtArgs>,
        T,
        'createManyAndReturn',
        GlobalOmitOptions
      >
    >;

    /**
     * Delete a Like.
     * @param {LikeDeleteArgs} args - Arguments to delete one Like.
     * @example
     * // Delete one Like
     * const Like = await prisma.like.delete({
     *   where: {
     *     // ... filter to delete one Like
     *   }
     * })
     *
     */
    delete<T extends LikeDeleteArgs>(
      args: SelectSubset<T, LikeDeleteArgs<ExtArgs>>,
    ): Prisma__LikeClient<
      $Result.GetResult<
        Prisma.$LikePayload<ExtArgs>,
        T,
        'delete',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Update one Like.
     * @param {LikeUpdateArgs} args - Arguments to update one Like.
     * @example
     * // Update one Like
     * const like = await prisma.like.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends LikeUpdateArgs>(
      args: SelectSubset<T, LikeUpdateArgs<ExtArgs>>,
    ): Prisma__LikeClient<
      $Result.GetResult<
        Prisma.$LikePayload<ExtArgs>,
        T,
        'update',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Delete zero or more Likes.
     * @param {LikeDeleteManyArgs} args - Arguments to filter Likes to delete.
     * @example
     * // Delete a few Likes
     * const { count } = await prisma.like.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends LikeDeleteManyArgs>(
      args?: SelectSubset<T, LikeDeleteManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Likes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LikeUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Likes
     * const like = await prisma.like.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends LikeUpdateManyArgs>(
      args: SelectSubset<T, LikeUpdateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Likes and returns the data updated in the database.
     * @param {LikeUpdateManyAndReturnArgs} args - Arguments to update many Likes.
     * @example
     * // Update many Likes
     * const like = await prisma.like.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more Likes and only return the `id`
     * const likeWithIdOnly = await prisma.like.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    updateManyAndReturn<T extends LikeUpdateManyAndReturnArgs>(
      args: SelectSubset<T, LikeUpdateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$LikePayload<ExtArgs>,
        T,
        'updateManyAndReturn',
        GlobalOmitOptions
      >
    >;

    /**
     * Create or update one Like.
     * @param {LikeUpsertArgs} args - Arguments to update or create a Like.
     * @example
     * // Update or create a Like
     * const like = await prisma.like.upsert({
     *   create: {
     *     // ... data to create a Like
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Like we want to update
     *   }
     * })
     */
    upsert<T extends LikeUpsertArgs>(
      args: SelectSubset<T, LikeUpsertArgs<ExtArgs>>,
    ): Prisma__LikeClient<
      $Result.GetResult<
        Prisma.$LikePayload<ExtArgs>,
        T,
        'upsert',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Count the number of Likes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LikeCountArgs} args - Arguments to filter Likes to count.
     * @example
     * // Count the number of Likes
     * const count = await prisma.like.count({
     *   where: {
     *     // ... the filter for the Likes we want to count
     *   }
     * })
     **/
    count<T extends LikeCountArgs>(
      args?: Subset<T, LikeCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], LikeCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a Like.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LikeAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends LikeAggregateArgs>(
      args: Subset<T, LikeAggregateArgs>,
    ): Prisma.PrismaPromise<GetLikeAggregateType<T>>;

    /**
     * Group by Like.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LikeGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends LikeGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: LikeGroupByArgs['orderBy'] }
        : { orderBy?: LikeGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<
        Keys<MaybeTupleToUnion<T['orderBy']>>
      >,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [
                      Error,
                      'Field ',
                      P,
                      ` in "having" needs to be provided in "by"`,
                    ];
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, LikeGroupByArgs, OrderByArg> & InputErrors,
    ): {} extends InputErrors
      ? GetLikeGroupByPayload<T>
      : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the Like model
     */
    readonly fields: LikeFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Like.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__LikeClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    post<T extends Like$postArgs<ExtArgs> = {}>(
      args?: Subset<T, Like$postArgs<ExtArgs>>,
    ): Prisma__PostClient<
      $Result.GetResult<
        Prisma.$PostPayload<ExtArgs>,
        T,
        'findUniqueOrThrow',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;
    comment<T extends Like$commentArgs<ExtArgs> = {}>(
      args?: Subset<T, Like$commentArgs<ExtArgs>>,
    ): Prisma__CommentClient<
      $Result.GetResult<
        Prisma.$CommentPayload<ExtArgs>,
        T,
        'findUniqueOrThrow',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;
    author<T extends UserDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, UserDefaultArgs<ExtArgs>>,
    ): Prisma__UserClient<
      | $Result.GetResult<
          Prisma.$UserPayload<ExtArgs>,
          T,
          'findUniqueOrThrow',
          GlobalOmitOptions
        >
      | Null,
      Null,
      ExtArgs,
      GlobalOmitOptions
    >;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | null,
      onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null,
    ): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | null,
    ): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | null): $Utils.JsPromise<T>;
  }

  /**
   * Fields of the Like model
   */
  interface LikeFieldRefs {
    readonly id: FieldRef<'Like', 'String'>;
    readonly authorId: FieldRef<'Like', 'String'>;
    readonly postId: FieldRef<'Like', 'String'>;
    readonly commentId: FieldRef<'Like', 'String'>;
    readonly createdAt: FieldRef<'Like', 'DateTime'>;
  }

  // Custom InputTypes
  /**
   * Like findUnique
   */
  export type LikeFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Like
     */
    select?: LikeSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Like
     */
    omit?: LikeOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LikeInclude<ExtArgs> | null;
    /**
     * Filter, which Like to fetch.
     */
    where: LikeWhereUniqueInput;
  };

  /**
   * Like findUniqueOrThrow
   */
  export type LikeFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Like
     */
    select?: LikeSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Like
     */
    omit?: LikeOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LikeInclude<ExtArgs> | null;
    /**
     * Filter, which Like to fetch.
     */
    where: LikeWhereUniqueInput;
  };

  /**
   * Like findFirst
   */
  export type LikeFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Like
     */
    select?: LikeSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Like
     */
    omit?: LikeOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LikeInclude<ExtArgs> | null;
    /**
     * Filter, which Like to fetch.
     */
    where?: LikeWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Likes to fetch.
     */
    orderBy?: LikeOrderByWithRelationInput | LikeOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Likes.
     */
    cursor?: LikeWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Likes from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Likes.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Likes.
     */
    distinct?: LikeScalarFieldEnum | LikeScalarFieldEnum[];
  };

  /**
   * Like findFirstOrThrow
   */
  export type LikeFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Like
     */
    select?: LikeSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Like
     */
    omit?: LikeOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LikeInclude<ExtArgs> | null;
    /**
     * Filter, which Like to fetch.
     */
    where?: LikeWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Likes to fetch.
     */
    orderBy?: LikeOrderByWithRelationInput | LikeOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Likes.
     */
    cursor?: LikeWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Likes from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Likes.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Likes.
     */
    distinct?: LikeScalarFieldEnum | LikeScalarFieldEnum[];
  };

  /**
   * Like findMany
   */
  export type LikeFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Like
     */
    select?: LikeSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Like
     */
    omit?: LikeOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LikeInclude<ExtArgs> | null;
    /**
     * Filter, which Likes to fetch.
     */
    where?: LikeWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Likes to fetch.
     */
    orderBy?: LikeOrderByWithRelationInput | LikeOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing Likes.
     */
    cursor?: LikeWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Likes from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Likes.
     */
    skip?: number;
    distinct?: LikeScalarFieldEnum | LikeScalarFieldEnum[];
  };

  /**
   * Like create
   */
  export type LikeCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Like
     */
    select?: LikeSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Like
     */
    omit?: LikeOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LikeInclude<ExtArgs> | null;
    /**
     * The data needed to create a Like.
     */
    data: XOR<LikeCreateInput, LikeUncheckedCreateInput>;
  };

  /**
   * Like createMany
   */
  export type LikeCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many Likes.
     */
    data: LikeCreateManyInput | LikeCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * Like createManyAndReturn
   */
  export type LikeCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Like
     */
    select?: LikeSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the Like
     */
    omit?: LikeOmit<ExtArgs> | null;
    /**
     * The data used to create many Likes.
     */
    data: LikeCreateManyInput | LikeCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LikeIncludeCreateManyAndReturn<ExtArgs> | null;
  };

  /**
   * Like update
   */
  export type LikeUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Like
     */
    select?: LikeSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Like
     */
    omit?: LikeOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LikeInclude<ExtArgs> | null;
    /**
     * The data needed to update a Like.
     */
    data: XOR<LikeUpdateInput, LikeUncheckedUpdateInput>;
    /**
     * Choose, which Like to update.
     */
    where: LikeWhereUniqueInput;
  };

  /**
   * Like updateMany
   */
  export type LikeUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update Likes.
     */
    data: XOR<LikeUpdateManyMutationInput, LikeUncheckedUpdateManyInput>;
    /**
     * Filter which Likes to update
     */
    where?: LikeWhereInput;
    /**
     * Limit how many Likes to update.
     */
    limit?: number;
  };

  /**
   * Like updateManyAndReturn
   */
  export type LikeUpdateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Like
     */
    select?: LikeSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the Like
     */
    omit?: LikeOmit<ExtArgs> | null;
    /**
     * The data used to update Likes.
     */
    data: XOR<LikeUpdateManyMutationInput, LikeUncheckedUpdateManyInput>;
    /**
     * Filter which Likes to update
     */
    where?: LikeWhereInput;
    /**
     * Limit how many Likes to update.
     */
    limit?: number;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LikeIncludeUpdateManyAndReturn<ExtArgs> | null;
  };

  /**
   * Like upsert
   */
  export type LikeUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Like
     */
    select?: LikeSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Like
     */
    omit?: LikeOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LikeInclude<ExtArgs> | null;
    /**
     * The filter to search for the Like to update in case it exists.
     */
    where: LikeWhereUniqueInput;
    /**
     * In case the Like found by the `where` argument doesn't exist, create a new Like with this data.
     */
    create: XOR<LikeCreateInput, LikeUncheckedCreateInput>;
    /**
     * In case the Like was found with the provided `where` argument, update it with this data.
     */
    update: XOR<LikeUpdateInput, LikeUncheckedUpdateInput>;
  };

  /**
   * Like delete
   */
  export type LikeDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Like
     */
    select?: LikeSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Like
     */
    omit?: LikeOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LikeInclude<ExtArgs> | null;
    /**
     * Filter which Like to delete.
     */
    where: LikeWhereUniqueInput;
  };

  /**
   * Like deleteMany
   */
  export type LikeDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which Likes to delete
     */
    where?: LikeWhereInput;
    /**
     * Limit how many Likes to delete.
     */
    limit?: number;
  };

  /**
   * Like.post
   */
  export type Like$postArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Post
     */
    omit?: PostOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostInclude<ExtArgs> | null;
    where?: PostWhereInput;
  };

  /**
   * Like.comment
   */
  export type Like$commentArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Comment
     */
    select?: CommentSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Comment
     */
    omit?: CommentOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CommentInclude<ExtArgs> | null;
    where?: CommentWhereInput;
  };

  /**
   * Like without action
   */
  export type LikeDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Like
     */
    select?: LikeSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Like
     */
    omit?: LikeOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LikeInclude<ExtArgs> | null;
  };

  /**
   * Model Chat
   */

  export type AggregateChat = {
    _count: ChatCountAggregateOutputType | null;
    _min: ChatMinAggregateOutputType | null;
    _max: ChatMaxAggregateOutputType | null;
  };

  export type ChatMinAggregateOutputType = {
    id: string | null;
    name: string | null;
    type: $Enums.ChatType | null;
    creatorId: string | null;
  };

  export type ChatMaxAggregateOutputType = {
    id: string | null;
    name: string | null;
    type: $Enums.ChatType | null;
    creatorId: string | null;
  };

  export type ChatCountAggregateOutputType = {
    id: number;
    name: number;
    type: number;
    creatorId: number;
    _all: number;
  };

  export type ChatMinAggregateInputType = {
    id?: true;
    name?: true;
    type?: true;
    creatorId?: true;
  };

  export type ChatMaxAggregateInputType = {
    id?: true;
    name?: true;
    type?: true;
    creatorId?: true;
  };

  export type ChatCountAggregateInputType = {
    id?: true;
    name?: true;
    type?: true;
    creatorId?: true;
    _all?: true;
  };

  export type ChatAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which Chat to aggregate.
     */
    where?: ChatWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Chats to fetch.
     */
    orderBy?: ChatOrderByWithRelationInput | ChatOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: ChatWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Chats from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Chats.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned Chats
     **/
    _count?: true | ChatCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: ChatMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: ChatMaxAggregateInputType;
  };

  export type GetChatAggregateType<T extends ChatAggregateArgs> = {
    [P in keyof T & keyof AggregateChat]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateChat[P]>
      : GetScalarType<T[P], AggregateChat[P]>;
  };

  export type ChatGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: ChatWhereInput;
    orderBy?:
      | ChatOrderByWithAggregationInput
      | ChatOrderByWithAggregationInput[];
    by: ChatScalarFieldEnum[] | ChatScalarFieldEnum;
    having?: ChatScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: ChatCountAggregateInputType | true;
    _min?: ChatMinAggregateInputType;
    _max?: ChatMaxAggregateInputType;
  };

  export type ChatGroupByOutputType = {
    id: string;
    name: string | null;
    type: $Enums.ChatType;
    creatorId: string | null;
    _count: ChatCountAggregateOutputType | null;
    _min: ChatMinAggregateOutputType | null;
    _max: ChatMaxAggregateOutputType | null;
  };

  type GetChatGroupByPayload<T extends ChatGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ChatGroupByOutputType, T['by']> & {
        [P in keyof T & keyof ChatGroupByOutputType]: P extends '_count'
          ? T[P] extends boolean
            ? number
            : GetScalarType<T[P], ChatGroupByOutputType[P]>
          : GetScalarType<T[P], ChatGroupByOutputType[P]>;
      }
    >
  >;

  export type ChatSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      name?: boolean;
      type?: boolean;
      creatorId?: boolean;
      creator?: boolean | Chat$creatorArgs<ExtArgs>;
      members?: boolean | Chat$membersArgs<ExtArgs>;
      messages?: boolean | Chat$messagesArgs<ExtArgs>;
      _count?: boolean | ChatCountOutputTypeDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['chat']
  >;

  export type ChatSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      name?: boolean;
      type?: boolean;
      creatorId?: boolean;
      creator?: boolean | Chat$creatorArgs<ExtArgs>;
    },
    ExtArgs['result']['chat']
  >;

  export type ChatSelectUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      name?: boolean;
      type?: boolean;
      creatorId?: boolean;
      creator?: boolean | Chat$creatorArgs<ExtArgs>;
    },
    ExtArgs['result']['chat']
  >;

  export type ChatSelectScalar = {
    id?: boolean;
    name?: boolean;
    type?: boolean;
    creatorId?: boolean;
  };

  export type ChatOmit<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetOmit<
    'id' | 'name' | 'type' | 'creatorId',
    ExtArgs['result']['chat']
  >;
  export type ChatInclude<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    creator?: boolean | Chat$creatorArgs<ExtArgs>;
    members?: boolean | Chat$membersArgs<ExtArgs>;
    messages?: boolean | Chat$messagesArgs<ExtArgs>;
    _count?: boolean | ChatCountOutputTypeDefaultArgs<ExtArgs>;
  };
  export type ChatIncludeCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    creator?: boolean | Chat$creatorArgs<ExtArgs>;
  };
  export type ChatIncludeUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    creator?: boolean | Chat$creatorArgs<ExtArgs>;
  };

  export type $ChatPayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    name: 'Chat';
    objects: {
      creator: Prisma.$UserPayload<ExtArgs> | null;
      members: Prisma.$UserPayload<ExtArgs>[];
      messages: Prisma.$MessagePayload<ExtArgs>[];
    };
    scalars: $Extensions.GetPayloadResult<
      {
        id: string;
        name: string | null;
        type: $Enums.ChatType;
        creatorId: string | null;
      },
      ExtArgs['result']['chat']
    >;
    composites: {};
  };

  type ChatGetPayload<S extends boolean | null | undefined | ChatDefaultArgs> =
    $Result.GetResult<Prisma.$ChatPayload, S>;

  type ChatCountArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = Omit<ChatFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: ChatCountAggregateInputType | true;
  };

  export interface ChatDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>['model']['Chat'];
      meta: { name: 'Chat' };
    };
    /**
     * Find zero or one Chat that matches the filter.
     * @param {ChatFindUniqueArgs} args - Arguments to find a Chat
     * @example
     * // Get one Chat
     * const chat = await prisma.chat.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ChatFindUniqueArgs>(
      args: SelectSubset<T, ChatFindUniqueArgs<ExtArgs>>,
    ): Prisma__ChatClient<
      $Result.GetResult<
        Prisma.$ChatPayload<ExtArgs>,
        T,
        'findUnique',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find one Chat that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ChatFindUniqueOrThrowArgs} args - Arguments to find a Chat
     * @example
     * // Get one Chat
     * const chat = await prisma.chat.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ChatFindUniqueOrThrowArgs>(
      args: SelectSubset<T, ChatFindUniqueOrThrowArgs<ExtArgs>>,
    ): Prisma__ChatClient<
      $Result.GetResult<
        Prisma.$ChatPayload<ExtArgs>,
        T,
        'findUniqueOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first Chat that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatFindFirstArgs} args - Arguments to find a Chat
     * @example
     * // Get one Chat
     * const chat = await prisma.chat.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ChatFindFirstArgs>(
      args?: SelectSubset<T, ChatFindFirstArgs<ExtArgs>>,
    ): Prisma__ChatClient<
      $Result.GetResult<
        Prisma.$ChatPayload<ExtArgs>,
        T,
        'findFirst',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first Chat that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatFindFirstOrThrowArgs} args - Arguments to find a Chat
     * @example
     * // Get one Chat
     * const chat = await prisma.chat.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ChatFindFirstOrThrowArgs>(
      args?: SelectSubset<T, ChatFindFirstOrThrowArgs<ExtArgs>>,
    ): Prisma__ChatClient<
      $Result.GetResult<
        Prisma.$ChatPayload<ExtArgs>,
        T,
        'findFirstOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find zero or more Chats that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Chats
     * const chats = await prisma.chat.findMany()
     *
     * // Get first 10 Chats
     * const chats = await prisma.chat.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const chatWithIdOnly = await prisma.chat.findMany({ select: { id: true } })
     *
     */
    findMany<T extends ChatFindManyArgs>(
      args?: SelectSubset<T, ChatFindManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$ChatPayload<ExtArgs>,
        T,
        'findMany',
        GlobalOmitOptions
      >
    >;

    /**
     * Create a Chat.
     * @param {ChatCreateArgs} args - Arguments to create a Chat.
     * @example
     * // Create one Chat
     * const Chat = await prisma.chat.create({
     *   data: {
     *     // ... data to create a Chat
     *   }
     * })
     *
     */
    create<T extends ChatCreateArgs>(
      args: SelectSubset<T, ChatCreateArgs<ExtArgs>>,
    ): Prisma__ChatClient<
      $Result.GetResult<
        Prisma.$ChatPayload<ExtArgs>,
        T,
        'create',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Create many Chats.
     * @param {ChatCreateManyArgs} args - Arguments to create many Chats.
     * @example
     * // Create many Chats
     * const chat = await prisma.chat.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends ChatCreateManyArgs>(
      args?: SelectSubset<T, ChatCreateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create many Chats and returns the data saved in the database.
     * @param {ChatCreateManyAndReturnArgs} args - Arguments to create many Chats.
     * @example
     * // Create many Chats
     * const chat = await prisma.chat.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many Chats and only return the `id`
     * const chatWithIdOnly = await prisma.chat.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends ChatCreateManyAndReturnArgs>(
      args?: SelectSubset<T, ChatCreateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$ChatPayload<ExtArgs>,
        T,
        'createManyAndReturn',
        GlobalOmitOptions
      >
    >;

    /**
     * Delete a Chat.
     * @param {ChatDeleteArgs} args - Arguments to delete one Chat.
     * @example
     * // Delete one Chat
     * const Chat = await prisma.chat.delete({
     *   where: {
     *     // ... filter to delete one Chat
     *   }
     * })
     *
     */
    delete<T extends ChatDeleteArgs>(
      args: SelectSubset<T, ChatDeleteArgs<ExtArgs>>,
    ): Prisma__ChatClient<
      $Result.GetResult<
        Prisma.$ChatPayload<ExtArgs>,
        T,
        'delete',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Update one Chat.
     * @param {ChatUpdateArgs} args - Arguments to update one Chat.
     * @example
     * // Update one Chat
     * const chat = await prisma.chat.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends ChatUpdateArgs>(
      args: SelectSubset<T, ChatUpdateArgs<ExtArgs>>,
    ): Prisma__ChatClient<
      $Result.GetResult<
        Prisma.$ChatPayload<ExtArgs>,
        T,
        'update',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Delete zero or more Chats.
     * @param {ChatDeleteManyArgs} args - Arguments to filter Chats to delete.
     * @example
     * // Delete a few Chats
     * const { count } = await prisma.chat.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends ChatDeleteManyArgs>(
      args?: SelectSubset<T, ChatDeleteManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Chats.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Chats
     * const chat = await prisma.chat.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends ChatUpdateManyArgs>(
      args: SelectSubset<T, ChatUpdateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Chats and returns the data updated in the database.
     * @param {ChatUpdateManyAndReturnArgs} args - Arguments to update many Chats.
     * @example
     * // Update many Chats
     * const chat = await prisma.chat.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more Chats and only return the `id`
     * const chatWithIdOnly = await prisma.chat.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    updateManyAndReturn<T extends ChatUpdateManyAndReturnArgs>(
      args: SelectSubset<T, ChatUpdateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$ChatPayload<ExtArgs>,
        T,
        'updateManyAndReturn',
        GlobalOmitOptions
      >
    >;

    /**
     * Create or update one Chat.
     * @param {ChatUpsertArgs} args - Arguments to update or create a Chat.
     * @example
     * // Update or create a Chat
     * const chat = await prisma.chat.upsert({
     *   create: {
     *     // ... data to create a Chat
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Chat we want to update
     *   }
     * })
     */
    upsert<T extends ChatUpsertArgs>(
      args: SelectSubset<T, ChatUpsertArgs<ExtArgs>>,
    ): Prisma__ChatClient<
      $Result.GetResult<
        Prisma.$ChatPayload<ExtArgs>,
        T,
        'upsert',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Count the number of Chats.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatCountArgs} args - Arguments to filter Chats to count.
     * @example
     * // Count the number of Chats
     * const count = await prisma.chat.count({
     *   where: {
     *     // ... the filter for the Chats we want to count
     *   }
     * })
     **/
    count<T extends ChatCountArgs>(
      args?: Subset<T, ChatCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ChatCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a Chat.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends ChatAggregateArgs>(
      args: Subset<T, ChatAggregateArgs>,
    ): Prisma.PrismaPromise<GetChatAggregateType<T>>;

    /**
     * Group by Chat.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends ChatGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ChatGroupByArgs['orderBy'] }
        : { orderBy?: ChatGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<
        Keys<MaybeTupleToUnion<T['orderBy']>>
      >,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [
                      Error,
                      'Field ',
                      P,
                      ` in "having" needs to be provided in "by"`,
                    ];
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, ChatGroupByArgs, OrderByArg> & InputErrors,
    ): {} extends InputErrors
      ? GetChatGroupByPayload<T>
      : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the Chat model
     */
    readonly fields: ChatFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Chat.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ChatClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    creator<T extends Chat$creatorArgs<ExtArgs> = {}>(
      args?: Subset<T, Chat$creatorArgs<ExtArgs>>,
    ): Prisma__UserClient<
      $Result.GetResult<
        Prisma.$UserPayload<ExtArgs>,
        T,
        'findUniqueOrThrow',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;
    members<T extends Chat$membersArgs<ExtArgs> = {}>(
      args?: Subset<T, Chat$membersArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      | $Result.GetResult<
          Prisma.$UserPayload<ExtArgs>,
          T,
          'findMany',
          GlobalOmitOptions
        >
      | Null
    >;
    messages<T extends Chat$messagesArgs<ExtArgs> = {}>(
      args?: Subset<T, Chat$messagesArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      | $Result.GetResult<
          Prisma.$MessagePayload<ExtArgs>,
          T,
          'findMany',
          GlobalOmitOptions
        >
      | Null
    >;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | null,
      onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null,
    ): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | null,
    ): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | null): $Utils.JsPromise<T>;
  }

  /**
   * Fields of the Chat model
   */
  interface ChatFieldRefs {
    readonly id: FieldRef<'Chat', 'String'>;
    readonly name: FieldRef<'Chat', 'String'>;
    readonly type: FieldRef<'Chat', 'ChatType'>;
    readonly creatorId: FieldRef<'Chat', 'String'>;
  }

  // Custom InputTypes
  /**
   * Chat findUnique
   */
  export type ChatFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Chat
     */
    select?: ChatSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Chat
     */
    omit?: ChatOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatInclude<ExtArgs> | null;
    /**
     * Filter, which Chat to fetch.
     */
    where: ChatWhereUniqueInput;
  };

  /**
   * Chat findUniqueOrThrow
   */
  export type ChatFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Chat
     */
    select?: ChatSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Chat
     */
    omit?: ChatOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatInclude<ExtArgs> | null;
    /**
     * Filter, which Chat to fetch.
     */
    where: ChatWhereUniqueInput;
  };

  /**
   * Chat findFirst
   */
  export type ChatFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Chat
     */
    select?: ChatSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Chat
     */
    omit?: ChatOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatInclude<ExtArgs> | null;
    /**
     * Filter, which Chat to fetch.
     */
    where?: ChatWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Chats to fetch.
     */
    orderBy?: ChatOrderByWithRelationInput | ChatOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Chats.
     */
    cursor?: ChatWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Chats from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Chats.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Chats.
     */
    distinct?: ChatScalarFieldEnum | ChatScalarFieldEnum[];
  };

  /**
   * Chat findFirstOrThrow
   */
  export type ChatFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Chat
     */
    select?: ChatSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Chat
     */
    omit?: ChatOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatInclude<ExtArgs> | null;
    /**
     * Filter, which Chat to fetch.
     */
    where?: ChatWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Chats to fetch.
     */
    orderBy?: ChatOrderByWithRelationInput | ChatOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Chats.
     */
    cursor?: ChatWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Chats from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Chats.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Chats.
     */
    distinct?: ChatScalarFieldEnum | ChatScalarFieldEnum[];
  };

  /**
   * Chat findMany
   */
  export type ChatFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Chat
     */
    select?: ChatSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Chat
     */
    omit?: ChatOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatInclude<ExtArgs> | null;
    /**
     * Filter, which Chats to fetch.
     */
    where?: ChatWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Chats to fetch.
     */
    orderBy?: ChatOrderByWithRelationInput | ChatOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing Chats.
     */
    cursor?: ChatWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Chats from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Chats.
     */
    skip?: number;
    distinct?: ChatScalarFieldEnum | ChatScalarFieldEnum[];
  };

  /**
   * Chat create
   */
  export type ChatCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Chat
     */
    select?: ChatSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Chat
     */
    omit?: ChatOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatInclude<ExtArgs> | null;
    /**
     * The data needed to create a Chat.
     */
    data?: XOR<ChatCreateInput, ChatUncheckedCreateInput>;
  };

  /**
   * Chat createMany
   */
  export type ChatCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many Chats.
     */
    data: ChatCreateManyInput | ChatCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * Chat createManyAndReturn
   */
  export type ChatCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Chat
     */
    select?: ChatSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the Chat
     */
    omit?: ChatOmit<ExtArgs> | null;
    /**
     * The data used to create many Chats.
     */
    data: ChatCreateManyInput | ChatCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatIncludeCreateManyAndReturn<ExtArgs> | null;
  };

  /**
   * Chat update
   */
  export type ChatUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Chat
     */
    select?: ChatSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Chat
     */
    omit?: ChatOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatInclude<ExtArgs> | null;
    /**
     * The data needed to update a Chat.
     */
    data: XOR<ChatUpdateInput, ChatUncheckedUpdateInput>;
    /**
     * Choose, which Chat to update.
     */
    where: ChatWhereUniqueInput;
  };

  /**
   * Chat updateMany
   */
  export type ChatUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update Chats.
     */
    data: XOR<ChatUpdateManyMutationInput, ChatUncheckedUpdateManyInput>;
    /**
     * Filter which Chats to update
     */
    where?: ChatWhereInput;
    /**
     * Limit how many Chats to update.
     */
    limit?: number;
  };

  /**
   * Chat updateManyAndReturn
   */
  export type ChatUpdateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Chat
     */
    select?: ChatSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the Chat
     */
    omit?: ChatOmit<ExtArgs> | null;
    /**
     * The data used to update Chats.
     */
    data: XOR<ChatUpdateManyMutationInput, ChatUncheckedUpdateManyInput>;
    /**
     * Filter which Chats to update
     */
    where?: ChatWhereInput;
    /**
     * Limit how many Chats to update.
     */
    limit?: number;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatIncludeUpdateManyAndReturn<ExtArgs> | null;
  };

  /**
   * Chat upsert
   */
  export type ChatUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Chat
     */
    select?: ChatSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Chat
     */
    omit?: ChatOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatInclude<ExtArgs> | null;
    /**
     * The filter to search for the Chat to update in case it exists.
     */
    where: ChatWhereUniqueInput;
    /**
     * In case the Chat found by the `where` argument doesn't exist, create a new Chat with this data.
     */
    create: XOR<ChatCreateInput, ChatUncheckedCreateInput>;
    /**
     * In case the Chat was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ChatUpdateInput, ChatUncheckedUpdateInput>;
  };

  /**
   * Chat delete
   */
  export type ChatDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Chat
     */
    select?: ChatSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Chat
     */
    omit?: ChatOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatInclude<ExtArgs> | null;
    /**
     * Filter which Chat to delete.
     */
    where: ChatWhereUniqueInput;
  };

  /**
   * Chat deleteMany
   */
  export type ChatDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which Chats to delete
     */
    where?: ChatWhereInput;
    /**
     * Limit how many Chats to delete.
     */
    limit?: number;
  };

  /**
   * Chat.creator
   */
  export type Chat$creatorArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null;
    where?: UserWhereInput;
  };

  /**
   * Chat.members
   */
  export type Chat$membersArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null;
    where?: UserWhereInput;
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[];
    cursor?: UserWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[];
  };

  /**
   * Chat.messages
   */
  export type Chat$messagesArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null;
    where?: MessageWhereInput;
    orderBy?:
      | MessageOrderByWithRelationInput
      | MessageOrderByWithRelationInput[];
    cursor?: MessageWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: MessageScalarFieldEnum | MessageScalarFieldEnum[];
  };

  /**
   * Chat without action
   */
  export type ChatDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Chat
     */
    select?: ChatSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Chat
     */
    omit?: ChatOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatInclude<ExtArgs> | null;
  };

  /**
   * Model Message
   */

  export type AggregateMessage = {
    _count: MessageCountAggregateOutputType | null;
    _min: MessageMinAggregateOutputType | null;
    _max: MessageMaxAggregateOutputType | null;
  };

  export type MessageMinAggregateOutputType = {
    id: string | null;
    content: string | null;
    isRead: boolean | null;
    isEdited: boolean | null;
    chatId: string | null;
    senderId: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
  };

  export type MessageMaxAggregateOutputType = {
    id: string | null;
    content: string | null;
    isRead: boolean | null;
    isEdited: boolean | null;
    chatId: string | null;
    senderId: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
  };

  export type MessageCountAggregateOutputType = {
    id: number;
    content: number;
    isRead: number;
    isEdited: number;
    chatId: number;
    senderId: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
  };

  export type MessageMinAggregateInputType = {
    id?: true;
    content?: true;
    isRead?: true;
    isEdited?: true;
    chatId?: true;
    senderId?: true;
    createdAt?: true;
    updatedAt?: true;
  };

  export type MessageMaxAggregateInputType = {
    id?: true;
    content?: true;
    isRead?: true;
    isEdited?: true;
    chatId?: true;
    senderId?: true;
    createdAt?: true;
    updatedAt?: true;
  };

  export type MessageCountAggregateInputType = {
    id?: true;
    content?: true;
    isRead?: true;
    isEdited?: true;
    chatId?: true;
    senderId?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
  };

  export type MessageAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which Message to aggregate.
     */
    where?: MessageWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Messages to fetch.
     */
    orderBy?:
      | MessageOrderByWithRelationInput
      | MessageOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: MessageWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Messages from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Messages.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned Messages
     **/
    _count?: true | MessageCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: MessageMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: MessageMaxAggregateInputType;
  };

  export type GetMessageAggregateType<T extends MessageAggregateArgs> = {
    [P in keyof T & keyof AggregateMessage]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMessage[P]>
      : GetScalarType<T[P], AggregateMessage[P]>;
  };

  export type MessageGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: MessageWhereInput;
    orderBy?:
      | MessageOrderByWithAggregationInput
      | MessageOrderByWithAggregationInput[];
    by: MessageScalarFieldEnum[] | MessageScalarFieldEnum;
    having?: MessageScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: MessageCountAggregateInputType | true;
    _min?: MessageMinAggregateInputType;
    _max?: MessageMaxAggregateInputType;
  };

  export type MessageGroupByOutputType = {
    id: string;
    content: string | null;
    isRead: boolean;
    isEdited: boolean;
    chatId: string;
    senderId: string;
    createdAt: Date;
    updatedAt: Date | null;
    _count: MessageCountAggregateOutputType | null;
    _min: MessageMinAggregateOutputType | null;
    _max: MessageMaxAggregateOutputType | null;
  };

  type GetMessageGroupByPayload<T extends MessageGroupByArgs> =
    Prisma.PrismaPromise<
      Array<
        PickEnumerable<MessageGroupByOutputType, T['by']> & {
          [P in keyof T & keyof MessageGroupByOutputType]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MessageGroupByOutputType[P]>
            : GetScalarType<T[P], MessageGroupByOutputType[P]>;
        }
      >
    >;

  export type MessageSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      content?: boolean;
      isRead?: boolean;
      isEdited?: boolean;
      chatId?: boolean;
      senderId?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      assets?: boolean | Message$assetsArgs<ExtArgs>;
      chat?: boolean | ChatDefaultArgs<ExtArgs>;
      sender?: boolean | UserDefaultArgs<ExtArgs>;
      _count?: boolean | MessageCountOutputTypeDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['message']
  >;

  export type MessageSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      content?: boolean;
      isRead?: boolean;
      isEdited?: boolean;
      chatId?: boolean;
      senderId?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      chat?: boolean | ChatDefaultArgs<ExtArgs>;
      sender?: boolean | UserDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['message']
  >;

  export type MessageSelectUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      content?: boolean;
      isRead?: boolean;
      isEdited?: boolean;
      chatId?: boolean;
      senderId?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      chat?: boolean | ChatDefaultArgs<ExtArgs>;
      sender?: boolean | UserDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['message']
  >;

  export type MessageSelectScalar = {
    id?: boolean;
    content?: boolean;
    isRead?: boolean;
    isEdited?: boolean;
    chatId?: boolean;
    senderId?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
  };

  export type MessageOmit<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetOmit<
    | 'id'
    | 'content'
    | 'isRead'
    | 'isEdited'
    | 'chatId'
    | 'senderId'
    | 'createdAt'
    | 'updatedAt',
    ExtArgs['result']['message']
  >;
  export type MessageInclude<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    assets?: boolean | Message$assetsArgs<ExtArgs>;
    chat?: boolean | ChatDefaultArgs<ExtArgs>;
    sender?: boolean | UserDefaultArgs<ExtArgs>;
    _count?: boolean | MessageCountOutputTypeDefaultArgs<ExtArgs>;
  };
  export type MessageIncludeCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    chat?: boolean | ChatDefaultArgs<ExtArgs>;
    sender?: boolean | UserDefaultArgs<ExtArgs>;
  };
  export type MessageIncludeUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    chat?: boolean | ChatDefaultArgs<ExtArgs>;
    sender?: boolean | UserDefaultArgs<ExtArgs>;
  };

  export type $MessagePayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    name: 'Message';
    objects: {
      assets: Prisma.$AssetPayload<ExtArgs>[];
      chat: Prisma.$ChatPayload<ExtArgs>;
      sender: Prisma.$UserPayload<ExtArgs>;
    };
    scalars: $Extensions.GetPayloadResult<
      {
        id: string;
        content: string | null;
        isRead: boolean;
        isEdited: boolean;
        chatId: string;
        senderId: string;
        createdAt: Date;
        updatedAt: Date | null;
      },
      ExtArgs['result']['message']
    >;
    composites: {};
  };

  type MessageGetPayload<
    S extends boolean | null | undefined | MessageDefaultArgs,
  > = $Result.GetResult<Prisma.$MessagePayload, S>;

  type MessageCountArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = Omit<MessageFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: MessageCountAggregateInputType | true;
  };

  export interface MessageDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>['model']['Message'];
      meta: { name: 'Message' };
    };
    /**
     * Find zero or one Message that matches the filter.
     * @param {MessageFindUniqueArgs} args - Arguments to find a Message
     * @example
     * // Get one Message
     * const message = await prisma.message.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MessageFindUniqueArgs>(
      args: SelectSubset<T, MessageFindUniqueArgs<ExtArgs>>,
    ): Prisma__MessageClient<
      $Result.GetResult<
        Prisma.$MessagePayload<ExtArgs>,
        T,
        'findUnique',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find one Message that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MessageFindUniqueOrThrowArgs} args - Arguments to find a Message
     * @example
     * // Get one Message
     * const message = await prisma.message.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MessageFindUniqueOrThrowArgs>(
      args: SelectSubset<T, MessageFindUniqueOrThrowArgs<ExtArgs>>,
    ): Prisma__MessageClient<
      $Result.GetResult<
        Prisma.$MessagePayload<ExtArgs>,
        T,
        'findUniqueOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first Message that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageFindFirstArgs} args - Arguments to find a Message
     * @example
     * // Get one Message
     * const message = await prisma.message.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MessageFindFirstArgs>(
      args?: SelectSubset<T, MessageFindFirstArgs<ExtArgs>>,
    ): Prisma__MessageClient<
      $Result.GetResult<
        Prisma.$MessagePayload<ExtArgs>,
        T,
        'findFirst',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first Message that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageFindFirstOrThrowArgs} args - Arguments to find a Message
     * @example
     * // Get one Message
     * const message = await prisma.message.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MessageFindFirstOrThrowArgs>(
      args?: SelectSubset<T, MessageFindFirstOrThrowArgs<ExtArgs>>,
    ): Prisma__MessageClient<
      $Result.GetResult<
        Prisma.$MessagePayload<ExtArgs>,
        T,
        'findFirstOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find zero or more Messages that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Messages
     * const messages = await prisma.message.findMany()
     *
     * // Get first 10 Messages
     * const messages = await prisma.message.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const messageWithIdOnly = await prisma.message.findMany({ select: { id: true } })
     *
     */
    findMany<T extends MessageFindManyArgs>(
      args?: SelectSubset<T, MessageFindManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$MessagePayload<ExtArgs>,
        T,
        'findMany',
        GlobalOmitOptions
      >
    >;

    /**
     * Create a Message.
     * @param {MessageCreateArgs} args - Arguments to create a Message.
     * @example
     * // Create one Message
     * const Message = await prisma.message.create({
     *   data: {
     *     // ... data to create a Message
     *   }
     * })
     *
     */
    create<T extends MessageCreateArgs>(
      args: SelectSubset<T, MessageCreateArgs<ExtArgs>>,
    ): Prisma__MessageClient<
      $Result.GetResult<
        Prisma.$MessagePayload<ExtArgs>,
        T,
        'create',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Create many Messages.
     * @param {MessageCreateManyArgs} args - Arguments to create many Messages.
     * @example
     * // Create many Messages
     * const message = await prisma.message.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends MessageCreateManyArgs>(
      args?: SelectSubset<T, MessageCreateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create many Messages and returns the data saved in the database.
     * @param {MessageCreateManyAndReturnArgs} args - Arguments to create many Messages.
     * @example
     * // Create many Messages
     * const message = await prisma.message.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many Messages and only return the `id`
     * const messageWithIdOnly = await prisma.message.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends MessageCreateManyAndReturnArgs>(
      args?: SelectSubset<T, MessageCreateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$MessagePayload<ExtArgs>,
        T,
        'createManyAndReturn',
        GlobalOmitOptions
      >
    >;

    /**
     * Delete a Message.
     * @param {MessageDeleteArgs} args - Arguments to delete one Message.
     * @example
     * // Delete one Message
     * const Message = await prisma.message.delete({
     *   where: {
     *     // ... filter to delete one Message
     *   }
     * })
     *
     */
    delete<T extends MessageDeleteArgs>(
      args: SelectSubset<T, MessageDeleteArgs<ExtArgs>>,
    ): Prisma__MessageClient<
      $Result.GetResult<
        Prisma.$MessagePayload<ExtArgs>,
        T,
        'delete',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Update one Message.
     * @param {MessageUpdateArgs} args - Arguments to update one Message.
     * @example
     * // Update one Message
     * const message = await prisma.message.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends MessageUpdateArgs>(
      args: SelectSubset<T, MessageUpdateArgs<ExtArgs>>,
    ): Prisma__MessageClient<
      $Result.GetResult<
        Prisma.$MessagePayload<ExtArgs>,
        T,
        'update',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Delete zero or more Messages.
     * @param {MessageDeleteManyArgs} args - Arguments to filter Messages to delete.
     * @example
     * // Delete a few Messages
     * const { count } = await prisma.message.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends MessageDeleteManyArgs>(
      args?: SelectSubset<T, MessageDeleteManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Messages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Messages
     * const message = await prisma.message.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends MessageUpdateManyArgs>(
      args: SelectSubset<T, MessageUpdateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Messages and returns the data updated in the database.
     * @param {MessageUpdateManyAndReturnArgs} args - Arguments to update many Messages.
     * @example
     * // Update many Messages
     * const message = await prisma.message.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more Messages and only return the `id`
     * const messageWithIdOnly = await prisma.message.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    updateManyAndReturn<T extends MessageUpdateManyAndReturnArgs>(
      args: SelectSubset<T, MessageUpdateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$MessagePayload<ExtArgs>,
        T,
        'updateManyAndReturn',
        GlobalOmitOptions
      >
    >;

    /**
     * Create or update one Message.
     * @param {MessageUpsertArgs} args - Arguments to update or create a Message.
     * @example
     * // Update or create a Message
     * const message = await prisma.message.upsert({
     *   create: {
     *     // ... data to create a Message
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Message we want to update
     *   }
     * })
     */
    upsert<T extends MessageUpsertArgs>(
      args: SelectSubset<T, MessageUpsertArgs<ExtArgs>>,
    ): Prisma__MessageClient<
      $Result.GetResult<
        Prisma.$MessagePayload<ExtArgs>,
        T,
        'upsert',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Count the number of Messages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageCountArgs} args - Arguments to filter Messages to count.
     * @example
     * // Count the number of Messages
     * const count = await prisma.message.count({
     *   where: {
     *     // ... the filter for the Messages we want to count
     *   }
     * })
     **/
    count<T extends MessageCountArgs>(
      args?: Subset<T, MessageCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MessageCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a Message.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends MessageAggregateArgs>(
      args: Subset<T, MessageAggregateArgs>,
    ): Prisma.PrismaPromise<GetMessageAggregateType<T>>;

    /**
     * Group by Message.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends MessageGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MessageGroupByArgs['orderBy'] }
        : { orderBy?: MessageGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<
        Keys<MaybeTupleToUnion<T['orderBy']>>
      >,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [
                      Error,
                      'Field ',
                      P,
                      ` in "having" needs to be provided in "by"`,
                    ];
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, MessageGroupByArgs, OrderByArg> & InputErrors,
    ): {} extends InputErrors
      ? GetMessageGroupByPayload<T>
      : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the Message model
     */
    readonly fields: MessageFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Message.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MessageClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    assets<T extends Message$assetsArgs<ExtArgs> = {}>(
      args?: Subset<T, Message$assetsArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      | $Result.GetResult<
          Prisma.$AssetPayload<ExtArgs>,
          T,
          'findMany',
          GlobalOmitOptions
        >
      | Null
    >;
    chat<T extends ChatDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, ChatDefaultArgs<ExtArgs>>,
    ): Prisma__ChatClient<
      | $Result.GetResult<
          Prisma.$ChatPayload<ExtArgs>,
          T,
          'findUniqueOrThrow',
          GlobalOmitOptions
        >
      | Null,
      Null,
      ExtArgs,
      GlobalOmitOptions
    >;
    sender<T extends UserDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, UserDefaultArgs<ExtArgs>>,
    ): Prisma__UserClient<
      | $Result.GetResult<
          Prisma.$UserPayload<ExtArgs>,
          T,
          'findUniqueOrThrow',
          GlobalOmitOptions
        >
      | Null,
      Null,
      ExtArgs,
      GlobalOmitOptions
    >;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | null,
      onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null,
    ): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | null,
    ): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | null): $Utils.JsPromise<T>;
  }

  /**
   * Fields of the Message model
   */
  interface MessageFieldRefs {
    readonly id: FieldRef<'Message', 'String'>;
    readonly content: FieldRef<'Message', 'String'>;
    readonly isRead: FieldRef<'Message', 'Boolean'>;
    readonly isEdited: FieldRef<'Message', 'Boolean'>;
    readonly chatId: FieldRef<'Message', 'String'>;
    readonly senderId: FieldRef<'Message', 'String'>;
    readonly createdAt: FieldRef<'Message', 'DateTime'>;
    readonly updatedAt: FieldRef<'Message', 'DateTime'>;
  }

  // Custom InputTypes
  /**
   * Message findUnique
   */
  export type MessageFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null;
    /**
     * Filter, which Message to fetch.
     */
    where: MessageWhereUniqueInput;
  };

  /**
   * Message findUniqueOrThrow
   */
  export type MessageFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null;
    /**
     * Filter, which Message to fetch.
     */
    where: MessageWhereUniqueInput;
  };

  /**
   * Message findFirst
   */
  export type MessageFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null;
    /**
     * Filter, which Message to fetch.
     */
    where?: MessageWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Messages to fetch.
     */
    orderBy?:
      | MessageOrderByWithRelationInput
      | MessageOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Messages.
     */
    cursor?: MessageWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Messages from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Messages.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Messages.
     */
    distinct?: MessageScalarFieldEnum | MessageScalarFieldEnum[];
  };

  /**
   * Message findFirstOrThrow
   */
  export type MessageFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null;
    /**
     * Filter, which Message to fetch.
     */
    where?: MessageWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Messages to fetch.
     */
    orderBy?:
      | MessageOrderByWithRelationInput
      | MessageOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Messages.
     */
    cursor?: MessageWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Messages from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Messages.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Messages.
     */
    distinct?: MessageScalarFieldEnum | MessageScalarFieldEnum[];
  };

  /**
   * Message findMany
   */
  export type MessageFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null;
    /**
     * Filter, which Messages to fetch.
     */
    where?: MessageWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Messages to fetch.
     */
    orderBy?:
      | MessageOrderByWithRelationInput
      | MessageOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing Messages.
     */
    cursor?: MessageWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Messages from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Messages.
     */
    skip?: number;
    distinct?: MessageScalarFieldEnum | MessageScalarFieldEnum[];
  };

  /**
   * Message create
   */
  export type MessageCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null;
    /**
     * The data needed to create a Message.
     */
    data: XOR<MessageCreateInput, MessageUncheckedCreateInput>;
  };

  /**
   * Message createMany
   */
  export type MessageCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many Messages.
     */
    data: MessageCreateManyInput | MessageCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * Message createManyAndReturn
   */
  export type MessageCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null;
    /**
     * The data used to create many Messages.
     */
    data: MessageCreateManyInput | MessageCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageIncludeCreateManyAndReturn<ExtArgs> | null;
  };

  /**
   * Message update
   */
  export type MessageUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null;
    /**
     * The data needed to update a Message.
     */
    data: XOR<MessageUpdateInput, MessageUncheckedUpdateInput>;
    /**
     * Choose, which Message to update.
     */
    where: MessageWhereUniqueInput;
  };

  /**
   * Message updateMany
   */
  export type MessageUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update Messages.
     */
    data: XOR<MessageUpdateManyMutationInput, MessageUncheckedUpdateManyInput>;
    /**
     * Filter which Messages to update
     */
    where?: MessageWhereInput;
    /**
     * Limit how many Messages to update.
     */
    limit?: number;
  };

  /**
   * Message updateManyAndReturn
   */
  export type MessageUpdateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null;
    /**
     * The data used to update Messages.
     */
    data: XOR<MessageUpdateManyMutationInput, MessageUncheckedUpdateManyInput>;
    /**
     * Filter which Messages to update
     */
    where?: MessageWhereInput;
    /**
     * Limit how many Messages to update.
     */
    limit?: number;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageIncludeUpdateManyAndReturn<ExtArgs> | null;
  };

  /**
   * Message upsert
   */
  export type MessageUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null;
    /**
     * The filter to search for the Message to update in case it exists.
     */
    where: MessageWhereUniqueInput;
    /**
     * In case the Message found by the `where` argument doesn't exist, create a new Message with this data.
     */
    create: XOR<MessageCreateInput, MessageUncheckedCreateInput>;
    /**
     * In case the Message was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MessageUpdateInput, MessageUncheckedUpdateInput>;
  };

  /**
   * Message delete
   */
  export type MessageDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null;
    /**
     * Filter which Message to delete.
     */
    where: MessageWhereUniqueInput;
  };

  /**
   * Message deleteMany
   */
  export type MessageDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which Messages to delete
     */
    where?: MessageWhereInput;
    /**
     * Limit how many Messages to delete.
     */
    limit?: number;
  };

  /**
   * Message.assets
   */
  export type Message$assetsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Asset
     */
    select?: AssetSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Asset
     */
    omit?: AssetOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetInclude<ExtArgs> | null;
    where?: AssetWhereInput;
    orderBy?: AssetOrderByWithRelationInput | AssetOrderByWithRelationInput[];
    cursor?: AssetWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: AssetScalarFieldEnum | AssetScalarFieldEnum[];
  };

  /**
   * Message without action
   */
  export type MessageDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null;
  };

  /**
   * Model Notification
   */

  export type AggregateNotification = {
    _count: NotificationCountAggregateOutputType | null;
    _min: NotificationMinAggregateOutputType | null;
    _max: NotificationMaxAggregateOutputType | null;
  };

  export type NotificationMinAggregateOutputType = {
    id: string | null;
    type: $Enums.NotificationType | null;
    recipientId: string | null;
    actorId: string | null;
    itemId: string | null;
    postId: string | null;
    isRead: boolean | null;
    createdAt: Date | null;
  };

  export type NotificationMaxAggregateOutputType = {
    id: string | null;
    type: $Enums.NotificationType | null;
    recipientId: string | null;
    actorId: string | null;
    itemId: string | null;
    postId: string | null;
    isRead: boolean | null;
    createdAt: Date | null;
  };

  export type NotificationCountAggregateOutputType = {
    id: number;
    type: number;
    recipientId: number;
    actorId: number;
    itemId: number;
    postId: number;
    isRead: number;
    createdAt: number;
    _all: number;
  };

  export type NotificationMinAggregateInputType = {
    id?: true;
    type?: true;
    recipientId?: true;
    actorId?: true;
    itemId?: true;
    postId?: true;
    isRead?: true;
    createdAt?: true;
  };

  export type NotificationMaxAggregateInputType = {
    id?: true;
    type?: true;
    recipientId?: true;
    actorId?: true;
    itemId?: true;
    postId?: true;
    isRead?: true;
    createdAt?: true;
  };

  export type NotificationCountAggregateInputType = {
    id?: true;
    type?: true;
    recipientId?: true;
    actorId?: true;
    itemId?: true;
    postId?: true;
    isRead?: true;
    createdAt?: true;
    _all?: true;
  };

  export type NotificationAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which Notification to aggregate.
     */
    where?: NotificationWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Notifications to fetch.
     */
    orderBy?:
      | NotificationOrderByWithRelationInput
      | NotificationOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: NotificationWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Notifications from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Notifications.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned Notifications
     **/
    _count?: true | NotificationCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: NotificationMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: NotificationMaxAggregateInputType;
  };

  export type GetNotificationAggregateType<
    T extends NotificationAggregateArgs,
  > = {
    [P in keyof T & keyof AggregateNotification]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateNotification[P]>
      : GetScalarType<T[P], AggregateNotification[P]>;
  };

  export type NotificationGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: NotificationWhereInput;
    orderBy?:
      | NotificationOrderByWithAggregationInput
      | NotificationOrderByWithAggregationInput[];
    by: NotificationScalarFieldEnum[] | NotificationScalarFieldEnum;
    having?: NotificationScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: NotificationCountAggregateInputType | true;
    _min?: NotificationMinAggregateInputType;
    _max?: NotificationMaxAggregateInputType;
  };

  export type NotificationGroupByOutputType = {
    id: string;
    type: $Enums.NotificationType;
    recipientId: string;
    actorId: string;
    itemId: string | null;
    postId: string | null;
    isRead: boolean;
    createdAt: Date;
    _count: NotificationCountAggregateOutputType | null;
    _min: NotificationMinAggregateOutputType | null;
    _max: NotificationMaxAggregateOutputType | null;
  };

  type GetNotificationGroupByPayload<T extends NotificationGroupByArgs> =
    Prisma.PrismaPromise<
      Array<
        PickEnumerable<NotificationGroupByOutputType, T['by']> & {
          [P in keyof T &
            keyof NotificationGroupByOutputType]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], NotificationGroupByOutputType[P]>
            : GetScalarType<T[P], NotificationGroupByOutputType[P]>;
        }
      >
    >;

  export type NotificationSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      type?: boolean;
      recipientId?: boolean;
      actorId?: boolean;
      itemId?: boolean;
      postId?: boolean;
      isRead?: boolean;
      createdAt?: boolean;
      recipient?: boolean | UserDefaultArgs<ExtArgs>;
      actor?: boolean | UserDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['notification']
  >;

  export type NotificationSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      type?: boolean;
      recipientId?: boolean;
      actorId?: boolean;
      itemId?: boolean;
      postId?: boolean;
      isRead?: boolean;
      createdAt?: boolean;
      recipient?: boolean | UserDefaultArgs<ExtArgs>;
      actor?: boolean | UserDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['notification']
  >;

  export type NotificationSelectUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      type?: boolean;
      recipientId?: boolean;
      actorId?: boolean;
      itemId?: boolean;
      postId?: boolean;
      isRead?: boolean;
      createdAt?: boolean;
      recipient?: boolean | UserDefaultArgs<ExtArgs>;
      actor?: boolean | UserDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['notification']
  >;

  export type NotificationSelectScalar = {
    id?: boolean;
    type?: boolean;
    recipientId?: boolean;
    actorId?: boolean;
    itemId?: boolean;
    postId?: boolean;
    isRead?: boolean;
    createdAt?: boolean;
  };

  export type NotificationOmit<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetOmit<
    | 'id'
    | 'type'
    | 'recipientId'
    | 'actorId'
    | 'itemId'
    | 'postId'
    | 'isRead'
    | 'createdAt',
    ExtArgs['result']['notification']
  >;
  export type NotificationInclude<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    recipient?: boolean | UserDefaultArgs<ExtArgs>;
    actor?: boolean | UserDefaultArgs<ExtArgs>;
  };
  export type NotificationIncludeCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    recipient?: boolean | UserDefaultArgs<ExtArgs>;
    actor?: boolean | UserDefaultArgs<ExtArgs>;
  };
  export type NotificationIncludeUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    recipient?: boolean | UserDefaultArgs<ExtArgs>;
    actor?: boolean | UserDefaultArgs<ExtArgs>;
  };

  export type $NotificationPayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    name: 'Notification';
    objects: {
      recipient: Prisma.$UserPayload<ExtArgs>;
      actor: Prisma.$UserPayload<ExtArgs>;
    };
    scalars: $Extensions.GetPayloadResult<
      {
        id: string;
        type: $Enums.NotificationType;
        recipientId: string;
        actorId: string;
        itemId: string | null;
        postId: string | null;
        isRead: boolean;
        createdAt: Date;
      },
      ExtArgs['result']['notification']
    >;
    composites: {};
  };

  type NotificationGetPayload<
    S extends boolean | null | undefined | NotificationDefaultArgs,
  > = $Result.GetResult<Prisma.$NotificationPayload, S>;

  type NotificationCountArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = Omit<
    NotificationFindManyArgs,
    'select' | 'include' | 'distinct' | 'omit'
  > & {
    select?: NotificationCountAggregateInputType | true;
  };

  export interface NotificationDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>['model']['Notification'];
      meta: { name: 'Notification' };
    };
    /**
     * Find zero or one Notification that matches the filter.
     * @param {NotificationFindUniqueArgs} args - Arguments to find a Notification
     * @example
     * // Get one Notification
     * const notification = await prisma.notification.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends NotificationFindUniqueArgs>(
      args: SelectSubset<T, NotificationFindUniqueArgs<ExtArgs>>,
    ): Prisma__NotificationClient<
      $Result.GetResult<
        Prisma.$NotificationPayload<ExtArgs>,
        T,
        'findUnique',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find one Notification that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {NotificationFindUniqueOrThrowArgs} args - Arguments to find a Notification
     * @example
     * // Get one Notification
     * const notification = await prisma.notification.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends NotificationFindUniqueOrThrowArgs>(
      args: SelectSubset<T, NotificationFindUniqueOrThrowArgs<ExtArgs>>,
    ): Prisma__NotificationClient<
      $Result.GetResult<
        Prisma.$NotificationPayload<ExtArgs>,
        T,
        'findUniqueOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first Notification that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationFindFirstArgs} args - Arguments to find a Notification
     * @example
     * // Get one Notification
     * const notification = await prisma.notification.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends NotificationFindFirstArgs>(
      args?: SelectSubset<T, NotificationFindFirstArgs<ExtArgs>>,
    ): Prisma__NotificationClient<
      $Result.GetResult<
        Prisma.$NotificationPayload<ExtArgs>,
        T,
        'findFirst',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first Notification that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationFindFirstOrThrowArgs} args - Arguments to find a Notification
     * @example
     * // Get one Notification
     * const notification = await prisma.notification.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends NotificationFindFirstOrThrowArgs>(
      args?: SelectSubset<T, NotificationFindFirstOrThrowArgs<ExtArgs>>,
    ): Prisma__NotificationClient<
      $Result.GetResult<
        Prisma.$NotificationPayload<ExtArgs>,
        T,
        'findFirstOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find zero or more Notifications that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Notifications
     * const notifications = await prisma.notification.findMany()
     *
     * // Get first 10 Notifications
     * const notifications = await prisma.notification.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const notificationWithIdOnly = await prisma.notification.findMany({ select: { id: true } })
     *
     */
    findMany<T extends NotificationFindManyArgs>(
      args?: SelectSubset<T, NotificationFindManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$NotificationPayload<ExtArgs>,
        T,
        'findMany',
        GlobalOmitOptions
      >
    >;

    /**
     * Create a Notification.
     * @param {NotificationCreateArgs} args - Arguments to create a Notification.
     * @example
     * // Create one Notification
     * const Notification = await prisma.notification.create({
     *   data: {
     *     // ... data to create a Notification
     *   }
     * })
     *
     */
    create<T extends NotificationCreateArgs>(
      args: SelectSubset<T, NotificationCreateArgs<ExtArgs>>,
    ): Prisma__NotificationClient<
      $Result.GetResult<
        Prisma.$NotificationPayload<ExtArgs>,
        T,
        'create',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Create many Notifications.
     * @param {NotificationCreateManyArgs} args - Arguments to create many Notifications.
     * @example
     * // Create many Notifications
     * const notification = await prisma.notification.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends NotificationCreateManyArgs>(
      args?: SelectSubset<T, NotificationCreateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create many Notifications and returns the data saved in the database.
     * @param {NotificationCreateManyAndReturnArgs} args - Arguments to create many Notifications.
     * @example
     * // Create many Notifications
     * const notification = await prisma.notification.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many Notifications and only return the `id`
     * const notificationWithIdOnly = await prisma.notification.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends NotificationCreateManyAndReturnArgs>(
      args?: SelectSubset<T, NotificationCreateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$NotificationPayload<ExtArgs>,
        T,
        'createManyAndReturn',
        GlobalOmitOptions
      >
    >;

    /**
     * Delete a Notification.
     * @param {NotificationDeleteArgs} args - Arguments to delete one Notification.
     * @example
     * // Delete one Notification
     * const Notification = await prisma.notification.delete({
     *   where: {
     *     // ... filter to delete one Notification
     *   }
     * })
     *
     */
    delete<T extends NotificationDeleteArgs>(
      args: SelectSubset<T, NotificationDeleteArgs<ExtArgs>>,
    ): Prisma__NotificationClient<
      $Result.GetResult<
        Prisma.$NotificationPayload<ExtArgs>,
        T,
        'delete',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Update one Notification.
     * @param {NotificationUpdateArgs} args - Arguments to update one Notification.
     * @example
     * // Update one Notification
     * const notification = await prisma.notification.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends NotificationUpdateArgs>(
      args: SelectSubset<T, NotificationUpdateArgs<ExtArgs>>,
    ): Prisma__NotificationClient<
      $Result.GetResult<
        Prisma.$NotificationPayload<ExtArgs>,
        T,
        'update',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Delete zero or more Notifications.
     * @param {NotificationDeleteManyArgs} args - Arguments to filter Notifications to delete.
     * @example
     * // Delete a few Notifications
     * const { count } = await prisma.notification.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends NotificationDeleteManyArgs>(
      args?: SelectSubset<T, NotificationDeleteManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Notifications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Notifications
     * const notification = await prisma.notification.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends NotificationUpdateManyArgs>(
      args: SelectSubset<T, NotificationUpdateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Notifications and returns the data updated in the database.
     * @param {NotificationUpdateManyAndReturnArgs} args - Arguments to update many Notifications.
     * @example
     * // Update many Notifications
     * const notification = await prisma.notification.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more Notifications and only return the `id`
     * const notificationWithIdOnly = await prisma.notification.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    updateManyAndReturn<T extends NotificationUpdateManyAndReturnArgs>(
      args: SelectSubset<T, NotificationUpdateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$NotificationPayload<ExtArgs>,
        T,
        'updateManyAndReturn',
        GlobalOmitOptions
      >
    >;

    /**
     * Create or update one Notification.
     * @param {NotificationUpsertArgs} args - Arguments to update or create a Notification.
     * @example
     * // Update or create a Notification
     * const notification = await prisma.notification.upsert({
     *   create: {
     *     // ... data to create a Notification
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Notification we want to update
     *   }
     * })
     */
    upsert<T extends NotificationUpsertArgs>(
      args: SelectSubset<T, NotificationUpsertArgs<ExtArgs>>,
    ): Prisma__NotificationClient<
      $Result.GetResult<
        Prisma.$NotificationPayload<ExtArgs>,
        T,
        'upsert',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Count the number of Notifications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationCountArgs} args - Arguments to filter Notifications to count.
     * @example
     * // Count the number of Notifications
     * const count = await prisma.notification.count({
     *   where: {
     *     // ... the filter for the Notifications we want to count
     *   }
     * })
     **/
    count<T extends NotificationCountArgs>(
      args?: Subset<T, NotificationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], NotificationCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a Notification.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends NotificationAggregateArgs>(
      args: Subset<T, NotificationAggregateArgs>,
    ): Prisma.PrismaPromise<GetNotificationAggregateType<T>>;

    /**
     * Group by Notification.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends NotificationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: NotificationGroupByArgs['orderBy'] }
        : { orderBy?: NotificationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<
        Keys<MaybeTupleToUnion<T['orderBy']>>
      >,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [
                      Error,
                      'Field ',
                      P,
                      ` in "having" needs to be provided in "by"`,
                    ];
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, NotificationGroupByArgs, OrderByArg> &
        InputErrors,
    ): {} extends InputErrors
      ? GetNotificationGroupByPayload<T>
      : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the Notification model
     */
    readonly fields: NotificationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Notification.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__NotificationClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    recipient<T extends UserDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, UserDefaultArgs<ExtArgs>>,
    ): Prisma__UserClient<
      | $Result.GetResult<
          Prisma.$UserPayload<ExtArgs>,
          T,
          'findUniqueOrThrow',
          GlobalOmitOptions
        >
      | Null,
      Null,
      ExtArgs,
      GlobalOmitOptions
    >;
    actor<T extends UserDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, UserDefaultArgs<ExtArgs>>,
    ): Prisma__UserClient<
      | $Result.GetResult<
          Prisma.$UserPayload<ExtArgs>,
          T,
          'findUniqueOrThrow',
          GlobalOmitOptions
        >
      | Null,
      Null,
      ExtArgs,
      GlobalOmitOptions
    >;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | null,
      onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null,
    ): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | null,
    ): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | null): $Utils.JsPromise<T>;
  }

  /**
   * Fields of the Notification model
   */
  interface NotificationFieldRefs {
    readonly id: FieldRef<'Notification', 'String'>;
    readonly type: FieldRef<'Notification', 'NotificationType'>;
    readonly recipientId: FieldRef<'Notification', 'String'>;
    readonly actorId: FieldRef<'Notification', 'String'>;
    readonly itemId: FieldRef<'Notification', 'String'>;
    readonly postId: FieldRef<'Notification', 'String'>;
    readonly isRead: FieldRef<'Notification', 'Boolean'>;
    readonly createdAt: FieldRef<'Notification', 'DateTime'>;
  }

  // Custom InputTypes
  /**
   * Notification findUnique
   */
  export type NotificationFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null;
    /**
     * Filter, which Notification to fetch.
     */
    where: NotificationWhereUniqueInput;
  };

  /**
   * Notification findUniqueOrThrow
   */
  export type NotificationFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null;
    /**
     * Filter, which Notification to fetch.
     */
    where: NotificationWhereUniqueInput;
  };

  /**
   * Notification findFirst
   */
  export type NotificationFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null;
    /**
     * Filter, which Notification to fetch.
     */
    where?: NotificationWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Notifications to fetch.
     */
    orderBy?:
      | NotificationOrderByWithRelationInput
      | NotificationOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Notifications.
     */
    cursor?: NotificationWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Notifications from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Notifications.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Notifications.
     */
    distinct?: NotificationScalarFieldEnum | NotificationScalarFieldEnum[];
  };

  /**
   * Notification findFirstOrThrow
   */
  export type NotificationFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null;
    /**
     * Filter, which Notification to fetch.
     */
    where?: NotificationWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Notifications to fetch.
     */
    orderBy?:
      | NotificationOrderByWithRelationInput
      | NotificationOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Notifications.
     */
    cursor?: NotificationWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Notifications from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Notifications.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Notifications.
     */
    distinct?: NotificationScalarFieldEnum | NotificationScalarFieldEnum[];
  };

  /**
   * Notification findMany
   */
  export type NotificationFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null;
    /**
     * Filter, which Notifications to fetch.
     */
    where?: NotificationWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Notifications to fetch.
     */
    orderBy?:
      | NotificationOrderByWithRelationInput
      | NotificationOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing Notifications.
     */
    cursor?: NotificationWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Notifications from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Notifications.
     */
    skip?: number;
    distinct?: NotificationScalarFieldEnum | NotificationScalarFieldEnum[];
  };

  /**
   * Notification create
   */
  export type NotificationCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null;
    /**
     * The data needed to create a Notification.
     */
    data: XOR<NotificationCreateInput, NotificationUncheckedCreateInput>;
  };

  /**
   * Notification createMany
   */
  export type NotificationCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to create many Notifications.
     */
    data: NotificationCreateManyInput | NotificationCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * Notification createManyAndReturn
   */
  export type NotificationCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null;
    /**
     * The data used to create many Notifications.
     */
    data: NotificationCreateManyInput | NotificationCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationIncludeCreateManyAndReturn<ExtArgs> | null;
  };

  /**
   * Notification update
   */
  export type NotificationUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null;
    /**
     * The data needed to update a Notification.
     */
    data: XOR<NotificationUpdateInput, NotificationUncheckedUpdateInput>;
    /**
     * Choose, which Notification to update.
     */
    where: NotificationWhereUniqueInput;
  };

  /**
   * Notification updateMany
   */
  export type NotificationUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * The data used to update Notifications.
     */
    data: XOR<
      NotificationUpdateManyMutationInput,
      NotificationUncheckedUpdateManyInput
    >;
    /**
     * Filter which Notifications to update
     */
    where?: NotificationWhereInput;
    /**
     * Limit how many Notifications to update.
     */
    limit?: number;
  };

  /**
   * Notification updateManyAndReturn
   */
  export type NotificationUpdateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null;
    /**
     * The data used to update Notifications.
     */
    data: XOR<
      NotificationUpdateManyMutationInput,
      NotificationUncheckedUpdateManyInput
    >;
    /**
     * Filter which Notifications to update
     */
    where?: NotificationWhereInput;
    /**
     * Limit how many Notifications to update.
     */
    limit?: number;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationIncludeUpdateManyAndReturn<ExtArgs> | null;
  };

  /**
   * Notification upsert
   */
  export type NotificationUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null;
    /**
     * The filter to search for the Notification to update in case it exists.
     */
    where: NotificationWhereUniqueInput;
    /**
     * In case the Notification found by the `where` argument doesn't exist, create a new Notification with this data.
     */
    create: XOR<NotificationCreateInput, NotificationUncheckedCreateInput>;
    /**
     * In case the Notification was found with the provided `where` argument, update it with this data.
     */
    update: XOR<NotificationUpdateInput, NotificationUncheckedUpdateInput>;
  };

  /**
   * Notification delete
   */
  export type NotificationDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null;
    /**
     * Filter which Notification to delete.
     */
    where: NotificationWhereUniqueInput;
  };

  /**
   * Notification deleteMany
   */
  export type NotificationDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Filter which Notifications to delete
     */
    where?: NotificationWhereInput;
    /**
     * Limit how many Notifications to delete.
     */
    limit?: number;
  };

  /**
   * Notification without action
   */
  export type NotificationDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null;
  };

  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted';
    ReadCommitted: 'ReadCommitted';
    RepeatableRead: 'RepeatableRead';
    Serializable: 'Serializable';
  };

  export type TransactionIsolationLevel =
    (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel];

  export const UserScalarFieldEnum: {
    id: 'id';
    createdAt: 'createdAt';
    deletedAt: 'deletedAt';
  };

  export type UserScalarFieldEnum =
    (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum];

  export const AccountScalarFieldEnum: {
    id: 'id';
    userId: 'userId';
    username: 'username';
    email: 'email';
    phoneNumber: 'phoneNumber';
    passwordHash: 'passwordHash';
    updatedAt: 'updatedAt';
  };

  export type AccountScalarFieldEnum =
    (typeof AccountScalarFieldEnum)[keyof typeof AccountScalarFieldEnum];

  export const ProfileScalarFieldEnum: {
    id: 'id';
    userId: 'userId';
    firstName: 'firstName';
    secondName: 'secondName';
    avatarUrl: 'avatarUrl';
    bio: 'bio';
    birthday: 'birthday';
    isPrivate: 'isPrivate';
  };

  export type ProfileScalarFieldEnum =
    (typeof ProfileScalarFieldEnum)[keyof typeof ProfileScalarFieldEnum];

  export const FollowScalarFieldEnum: {
    id: 'id';
    followerId: 'followerId';
    followingId: 'followingId';
    createdAt: 'createdAt';
    status: 'status';
  };

  export type FollowScalarFieldEnum =
    (typeof FollowScalarFieldEnum)[keyof typeof FollowScalarFieldEnum];

  export const PostScalarFieldEnum: {
    id: 'id';
    authorId: 'authorId';
    description: 'description';
    isArchived: 'isArchived';
    createdAt: 'createdAt';
    updatedAt: 'updatedAt';
  };

  export type PostScalarFieldEnum =
    (typeof PostScalarFieldEnum)[keyof typeof PostScalarFieldEnum];

  export const AssetScalarFieldEnum: {
    id: 'id';
    url: 'url';
    type: 'type';
    postId: 'postId';
    messageId: 'messageId';
  };

  export type AssetScalarFieldEnum =
    (typeof AssetScalarFieldEnum)[keyof typeof AssetScalarFieldEnum];

  export const CommentScalarFieldEnum: {
    id: 'id';
    authorId: 'authorId';
    postId: 'postId';
    parentId: 'parentId';
    content: 'content';
    createdAt: 'createdAt';
  };

  export type CommentScalarFieldEnum =
    (typeof CommentScalarFieldEnum)[keyof typeof CommentScalarFieldEnum];

  export const LikeScalarFieldEnum: {
    id: 'id';
    authorId: 'authorId';
    postId: 'postId';
    commentId: 'commentId';
    createdAt: 'createdAt';
  };

  export type LikeScalarFieldEnum =
    (typeof LikeScalarFieldEnum)[keyof typeof LikeScalarFieldEnum];

  export const ChatScalarFieldEnum: {
    id: 'id';
    name: 'name';
    type: 'type';
    creatorId: 'creatorId';
  };

  export type ChatScalarFieldEnum =
    (typeof ChatScalarFieldEnum)[keyof typeof ChatScalarFieldEnum];

  export const MessageScalarFieldEnum: {
    id: 'id';
    content: 'content';
    isRead: 'isRead';
    isEdited: 'isEdited';
    chatId: 'chatId';
    senderId: 'senderId';
    createdAt: 'createdAt';
    updatedAt: 'updatedAt';
  };

  export type MessageScalarFieldEnum =
    (typeof MessageScalarFieldEnum)[keyof typeof MessageScalarFieldEnum];

  export const NotificationScalarFieldEnum: {
    id: 'id';
    type: 'type';
    recipientId: 'recipientId';
    actorId: 'actorId';
    itemId: 'itemId';
    postId: 'postId';
    isRead: 'isRead';
    createdAt: 'createdAt';
  };

  export type NotificationScalarFieldEnum =
    (typeof NotificationScalarFieldEnum)[keyof typeof NotificationScalarFieldEnum];

  export const SortOrder: {
    asc: 'asc';
    desc: 'desc';
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];

  export const QueryMode: {
    default: 'default';
    insensitive: 'insensitive';
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode];

  export const NullsOrder: {
    first: 'first';
    last: 'last';
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder];

  /**
   * Field references
   */

  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'String'
  >;

  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'String[]'
  >;

  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'DateTime'
  >;

  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'DateTime[]'
  >;

  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'Boolean'
  >;

  /**
   * Reference to a field of type 'FollowStatus'
   */
  export type EnumFollowStatusFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'FollowStatus'
  >;

  /**
   * Reference to a field of type 'FollowStatus[]'
   */
  export type ListEnumFollowStatusFieldRefInput<$PrismaModel> =
    FieldRefInputType<$PrismaModel, 'FollowStatus[]'>;

  /**
   * Reference to a field of type 'AssetType'
   */
  export type EnumAssetTypeFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'AssetType'
  >;

  /**
   * Reference to a field of type 'AssetType[]'
   */
  export type ListEnumAssetTypeFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'AssetType[]'
  >;

  /**
   * Reference to a field of type 'ChatType'
   */
  export type EnumChatTypeFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'ChatType'
  >;

  /**
   * Reference to a field of type 'ChatType[]'
   */
  export type ListEnumChatTypeFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'ChatType[]'
  >;

  /**
   * Reference to a field of type 'NotificationType'
   */
  export type EnumNotificationTypeFieldRefInput<$PrismaModel> =
    FieldRefInputType<$PrismaModel, 'NotificationType'>;

  /**
   * Reference to a field of type 'NotificationType[]'
   */
  export type ListEnumNotificationTypeFieldRefInput<$PrismaModel> =
    FieldRefInputType<$PrismaModel, 'NotificationType[]'>;

  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'Int'
  >;

  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'Int[]'
  >;

  /**
   * Deep Input Types
   */

  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[];
    OR?: UserWhereInput[];
    NOT?: UserWhereInput | UserWhereInput[];
    id?: StringFilter<'User'> | string;
    createdAt?: DateTimeFilter<'User'> | Date | string;
    deletedAt?: DateTimeNullableFilter<'User'> | Date | string | null;
    account?: XOR<
      AccountNullableScalarRelationFilter,
      AccountWhereInput
    > | null;
    profile?: XOR<
      ProfileNullableScalarRelationFilter,
      ProfileWhereInput
    > | null;
    following?: FollowListRelationFilter;
    followers?: FollowListRelationFilter;
    posts?: PostListRelationFilter;
    likes?: LikeListRelationFilter;
    comments?: CommentListRelationFilter;
    chats?: ChatListRelationFilter;
    createdChats?: ChatListRelationFilter;
    sentMessages?: MessageListRelationFilter;
    recievedNotifications?: NotificationListRelationFilter;
    triggeredNotifications?: NotificationListRelationFilter;
  };

  export type UserOrderByWithRelationInput = {
    id?: SortOrder;
    createdAt?: SortOrder;
    deletedAt?: SortOrderInput | SortOrder;
    account?: AccountOrderByWithRelationInput;
    profile?: ProfileOrderByWithRelationInput;
    following?: FollowOrderByRelationAggregateInput;
    followers?: FollowOrderByRelationAggregateInput;
    posts?: PostOrderByRelationAggregateInput;
    likes?: LikeOrderByRelationAggregateInput;
    comments?: CommentOrderByRelationAggregateInput;
    chats?: ChatOrderByRelationAggregateInput;
    createdChats?: ChatOrderByRelationAggregateInput;
    sentMessages?: MessageOrderByRelationAggregateInput;
    recievedNotifications?: NotificationOrderByRelationAggregateInput;
    triggeredNotifications?: NotificationOrderByRelationAggregateInput;
  };

  export type UserWhereUniqueInput = Prisma.AtLeast<
    {
      id?: string;
      AND?: UserWhereInput | UserWhereInput[];
      OR?: UserWhereInput[];
      NOT?: UserWhereInput | UserWhereInput[];
      createdAt?: DateTimeFilter<'User'> | Date | string;
      deletedAt?: DateTimeNullableFilter<'User'> | Date | string | null;
      account?: XOR<
        AccountNullableScalarRelationFilter,
        AccountWhereInput
      > | null;
      profile?: XOR<
        ProfileNullableScalarRelationFilter,
        ProfileWhereInput
      > | null;
      following?: FollowListRelationFilter;
      followers?: FollowListRelationFilter;
      posts?: PostListRelationFilter;
      likes?: LikeListRelationFilter;
      comments?: CommentListRelationFilter;
      chats?: ChatListRelationFilter;
      createdChats?: ChatListRelationFilter;
      sentMessages?: MessageListRelationFilter;
      recievedNotifications?: NotificationListRelationFilter;
      triggeredNotifications?: NotificationListRelationFilter;
    },
    'id'
  >;

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder;
    createdAt?: SortOrder;
    deletedAt?: SortOrderInput | SortOrder;
    _count?: UserCountOrderByAggregateInput;
    _max?: UserMaxOrderByAggregateInput;
    _min?: UserMinOrderByAggregateInput;
  };

  export type UserScalarWhereWithAggregatesInput = {
    AND?:
      | UserScalarWhereWithAggregatesInput
      | UserScalarWhereWithAggregatesInput[];
    OR?: UserScalarWhereWithAggregatesInput[];
    NOT?:
      | UserScalarWhereWithAggregatesInput
      | UserScalarWhereWithAggregatesInput[];
    id?: StringWithAggregatesFilter<'User'> | string;
    createdAt?: DateTimeWithAggregatesFilter<'User'> | Date | string;
    deletedAt?:
      | DateTimeNullableWithAggregatesFilter<'User'>
      | Date
      | string
      | null;
  };

  export type AccountWhereInput = {
    AND?: AccountWhereInput | AccountWhereInput[];
    OR?: AccountWhereInput[];
    NOT?: AccountWhereInput | AccountWhereInput[];
    id?: StringFilter<'Account'> | string;
    userId?: StringFilter<'Account'> | string;
    username?: StringFilter<'Account'> | string;
    email?: StringNullableFilter<'Account'> | string | null;
    phoneNumber?: StringNullableFilter<'Account'> | string | null;
    passwordHash?: StringNullableFilter<'Account'> | string | null;
    updatedAt?: DateTimeNullableFilter<'Account'> | Date | string | null;
    user?: XOR<UserScalarRelationFilter, UserWhereInput>;
  };

  export type AccountOrderByWithRelationInput = {
    id?: SortOrder;
    userId?: SortOrder;
    username?: SortOrder;
    email?: SortOrderInput | SortOrder;
    phoneNumber?: SortOrderInput | SortOrder;
    passwordHash?: SortOrderInput | SortOrder;
    updatedAt?: SortOrderInput | SortOrder;
    user?: UserOrderByWithRelationInput;
  };

  export type AccountWhereUniqueInput = Prisma.AtLeast<
    {
      id?: string;
      userId?: string;
      username?: string;
      email?: string;
      phoneNumber?: string;
      AND?: AccountWhereInput | AccountWhereInput[];
      OR?: AccountWhereInput[];
      NOT?: AccountWhereInput | AccountWhereInput[];
      passwordHash?: StringNullableFilter<'Account'> | string | null;
      updatedAt?: DateTimeNullableFilter<'Account'> | Date | string | null;
      user?: XOR<UserScalarRelationFilter, UserWhereInput>;
    },
    'id' | 'userId' | 'username' | 'email' | 'phoneNumber'
  >;

  export type AccountOrderByWithAggregationInput = {
    id?: SortOrder;
    userId?: SortOrder;
    username?: SortOrder;
    email?: SortOrderInput | SortOrder;
    phoneNumber?: SortOrderInput | SortOrder;
    passwordHash?: SortOrderInput | SortOrder;
    updatedAt?: SortOrderInput | SortOrder;
    _count?: AccountCountOrderByAggregateInput;
    _max?: AccountMaxOrderByAggregateInput;
    _min?: AccountMinOrderByAggregateInput;
  };

  export type AccountScalarWhereWithAggregatesInput = {
    AND?:
      | AccountScalarWhereWithAggregatesInput
      | AccountScalarWhereWithAggregatesInput[];
    OR?: AccountScalarWhereWithAggregatesInput[];
    NOT?:
      | AccountScalarWhereWithAggregatesInput
      | AccountScalarWhereWithAggregatesInput[];
    id?: StringWithAggregatesFilter<'Account'> | string;
    userId?: StringWithAggregatesFilter<'Account'> | string;
    username?: StringWithAggregatesFilter<'Account'> | string;
    email?: StringNullableWithAggregatesFilter<'Account'> | string | null;
    phoneNumber?: StringNullableWithAggregatesFilter<'Account'> | string | null;
    passwordHash?:
      | StringNullableWithAggregatesFilter<'Account'>
      | string
      | null;
    updatedAt?:
      | DateTimeNullableWithAggregatesFilter<'Account'>
      | Date
      | string
      | null;
  };

  export type ProfileWhereInput = {
    AND?: ProfileWhereInput | ProfileWhereInput[];
    OR?: ProfileWhereInput[];
    NOT?: ProfileWhereInput | ProfileWhereInput[];
    id?: StringFilter<'Profile'> | string;
    userId?: StringFilter<'Profile'> | string;
    firstName?: StringFilter<'Profile'> | string;
    secondName?: StringNullableFilter<'Profile'> | string | null;
    avatarUrl?: StringNullableFilter<'Profile'> | string | null;
    bio?: StringNullableFilter<'Profile'> | string | null;
    birthday?: DateTimeNullableFilter<'Profile'> | Date | string | null;
    isPrivate?: BoolFilter<'Profile'> | boolean;
    user?: XOR<UserScalarRelationFilter, UserWhereInput>;
  };

  export type ProfileOrderByWithRelationInput = {
    id?: SortOrder;
    userId?: SortOrder;
    firstName?: SortOrder;
    secondName?: SortOrderInput | SortOrder;
    avatarUrl?: SortOrderInput | SortOrder;
    bio?: SortOrderInput | SortOrder;
    birthday?: SortOrderInput | SortOrder;
    isPrivate?: SortOrder;
    user?: UserOrderByWithRelationInput;
  };

  export type ProfileWhereUniqueInput = Prisma.AtLeast<
    {
      id?: string;
      userId?: string;
      AND?: ProfileWhereInput | ProfileWhereInput[];
      OR?: ProfileWhereInput[];
      NOT?: ProfileWhereInput | ProfileWhereInput[];
      firstName?: StringFilter<'Profile'> | string;
      secondName?: StringNullableFilter<'Profile'> | string | null;
      avatarUrl?: StringNullableFilter<'Profile'> | string | null;
      bio?: StringNullableFilter<'Profile'> | string | null;
      birthday?: DateTimeNullableFilter<'Profile'> | Date | string | null;
      isPrivate?: BoolFilter<'Profile'> | boolean;
      user?: XOR<UserScalarRelationFilter, UserWhereInput>;
    },
    'id' | 'userId'
  >;

  export type ProfileOrderByWithAggregationInput = {
    id?: SortOrder;
    userId?: SortOrder;
    firstName?: SortOrder;
    secondName?: SortOrderInput | SortOrder;
    avatarUrl?: SortOrderInput | SortOrder;
    bio?: SortOrderInput | SortOrder;
    birthday?: SortOrderInput | SortOrder;
    isPrivate?: SortOrder;
    _count?: ProfileCountOrderByAggregateInput;
    _max?: ProfileMaxOrderByAggregateInput;
    _min?: ProfileMinOrderByAggregateInput;
  };

  export type ProfileScalarWhereWithAggregatesInput = {
    AND?:
      | ProfileScalarWhereWithAggregatesInput
      | ProfileScalarWhereWithAggregatesInput[];
    OR?: ProfileScalarWhereWithAggregatesInput[];
    NOT?:
      | ProfileScalarWhereWithAggregatesInput
      | ProfileScalarWhereWithAggregatesInput[];
    id?: StringWithAggregatesFilter<'Profile'> | string;
    userId?: StringWithAggregatesFilter<'Profile'> | string;
    firstName?: StringWithAggregatesFilter<'Profile'> | string;
    secondName?: StringNullableWithAggregatesFilter<'Profile'> | string | null;
    avatarUrl?: StringNullableWithAggregatesFilter<'Profile'> | string | null;
    bio?: StringNullableWithAggregatesFilter<'Profile'> | string | null;
    birthday?:
      | DateTimeNullableWithAggregatesFilter<'Profile'>
      | Date
      | string
      | null;
    isPrivate?: BoolWithAggregatesFilter<'Profile'> | boolean;
  };

  export type FollowWhereInput = {
    AND?: FollowWhereInput | FollowWhereInput[];
    OR?: FollowWhereInput[];
    NOT?: FollowWhereInput | FollowWhereInput[];
    id?: StringFilter<'Follow'> | string;
    followerId?: StringFilter<'Follow'> | string;
    followingId?: StringFilter<'Follow'> | string;
    createdAt?: DateTimeFilter<'Follow'> | Date | string;
    status?: EnumFollowStatusFilter<'Follow'> | $Enums.FollowStatus;
    follower?: XOR<UserScalarRelationFilter, UserWhereInput>;
    following?: XOR<UserScalarRelationFilter, UserWhereInput>;
  };

  export type FollowOrderByWithRelationInput = {
    id?: SortOrder;
    followerId?: SortOrder;
    followingId?: SortOrder;
    createdAt?: SortOrder;
    status?: SortOrder;
    follower?: UserOrderByWithRelationInput;
    following?: UserOrderByWithRelationInput;
  };

  export type FollowWhereUniqueInput = Prisma.AtLeast<
    {
      id?: string;
      followerId_followingId?: FollowFollowerIdFollowingIdCompoundUniqueInput;
      AND?: FollowWhereInput | FollowWhereInput[];
      OR?: FollowWhereInput[];
      NOT?: FollowWhereInput | FollowWhereInput[];
      followerId?: StringFilter<'Follow'> | string;
      followingId?: StringFilter<'Follow'> | string;
      createdAt?: DateTimeFilter<'Follow'> | Date | string;
      status?: EnumFollowStatusFilter<'Follow'> | $Enums.FollowStatus;
      follower?: XOR<UserScalarRelationFilter, UserWhereInput>;
      following?: XOR<UserScalarRelationFilter, UserWhereInput>;
    },
    'id' | 'followerId_followingId'
  >;

  export type FollowOrderByWithAggregationInput = {
    id?: SortOrder;
    followerId?: SortOrder;
    followingId?: SortOrder;
    createdAt?: SortOrder;
    status?: SortOrder;
    _count?: FollowCountOrderByAggregateInput;
    _max?: FollowMaxOrderByAggregateInput;
    _min?: FollowMinOrderByAggregateInput;
  };

  export type FollowScalarWhereWithAggregatesInput = {
    AND?:
      | FollowScalarWhereWithAggregatesInput
      | FollowScalarWhereWithAggregatesInput[];
    OR?: FollowScalarWhereWithAggregatesInput[];
    NOT?:
      | FollowScalarWhereWithAggregatesInput
      | FollowScalarWhereWithAggregatesInput[];
    id?: StringWithAggregatesFilter<'Follow'> | string;
    followerId?: StringWithAggregatesFilter<'Follow'> | string;
    followingId?: StringWithAggregatesFilter<'Follow'> | string;
    createdAt?: DateTimeWithAggregatesFilter<'Follow'> | Date | string;
    status?:
      | EnumFollowStatusWithAggregatesFilter<'Follow'>
      | $Enums.FollowStatus;
  };

  export type PostWhereInput = {
    AND?: PostWhereInput | PostWhereInput[];
    OR?: PostWhereInput[];
    NOT?: PostWhereInput | PostWhereInput[];
    id?: StringFilter<'Post'> | string;
    authorId?: StringFilter<'Post'> | string;
    description?: StringNullableFilter<'Post'> | string | null;
    isArchived?: BoolFilter<'Post'> | boolean;
    createdAt?: DateTimeFilter<'Post'> | Date | string;
    updatedAt?: DateTimeNullableFilter<'Post'> | Date | string | null;
    assets?: AssetListRelationFilter;
    comments?: CommentListRelationFilter;
    likes?: LikeListRelationFilter;
    author?: XOR<UserScalarRelationFilter, UserWhereInput>;
  };

  export type PostOrderByWithRelationInput = {
    id?: SortOrder;
    authorId?: SortOrder;
    description?: SortOrderInput | SortOrder;
    isArchived?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrderInput | SortOrder;
    assets?: AssetOrderByRelationAggregateInput;
    comments?: CommentOrderByRelationAggregateInput;
    likes?: LikeOrderByRelationAggregateInput;
    author?: UserOrderByWithRelationInput;
  };

  export type PostWhereUniqueInput = Prisma.AtLeast<
    {
      id?: string;
      AND?: PostWhereInput | PostWhereInput[];
      OR?: PostWhereInput[];
      NOT?: PostWhereInput | PostWhereInput[];
      authorId?: StringFilter<'Post'> | string;
      description?: StringNullableFilter<'Post'> | string | null;
      isArchived?: BoolFilter<'Post'> | boolean;
      createdAt?: DateTimeFilter<'Post'> | Date | string;
      updatedAt?: DateTimeNullableFilter<'Post'> | Date | string | null;
      assets?: AssetListRelationFilter;
      comments?: CommentListRelationFilter;
      likes?: LikeListRelationFilter;
      author?: XOR<UserScalarRelationFilter, UserWhereInput>;
    },
    'id'
  >;

  export type PostOrderByWithAggregationInput = {
    id?: SortOrder;
    authorId?: SortOrder;
    description?: SortOrderInput | SortOrder;
    isArchived?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrderInput | SortOrder;
    _count?: PostCountOrderByAggregateInput;
    _max?: PostMaxOrderByAggregateInput;
    _min?: PostMinOrderByAggregateInput;
  };

  export type PostScalarWhereWithAggregatesInput = {
    AND?:
      | PostScalarWhereWithAggregatesInput
      | PostScalarWhereWithAggregatesInput[];
    OR?: PostScalarWhereWithAggregatesInput[];
    NOT?:
      | PostScalarWhereWithAggregatesInput
      | PostScalarWhereWithAggregatesInput[];
    id?: StringWithAggregatesFilter<'Post'> | string;
    authorId?: StringWithAggregatesFilter<'Post'> | string;
    description?: StringNullableWithAggregatesFilter<'Post'> | string | null;
    isArchived?: BoolWithAggregatesFilter<'Post'> | boolean;
    createdAt?: DateTimeWithAggregatesFilter<'Post'> | Date | string;
    updatedAt?:
      | DateTimeNullableWithAggregatesFilter<'Post'>
      | Date
      | string
      | null;
  };

  export type AssetWhereInput = {
    AND?: AssetWhereInput | AssetWhereInput[];
    OR?: AssetWhereInput[];
    NOT?: AssetWhereInput | AssetWhereInput[];
    id?: StringFilter<'Asset'> | string;
    url?: StringFilter<'Asset'> | string;
    type?: EnumAssetTypeFilter<'Asset'> | $Enums.AssetType;
    postId?: StringNullableFilter<'Asset'> | string | null;
    messageId?: StringNullableFilter<'Asset'> | string | null;
    post?: XOR<PostNullableScalarRelationFilter, PostWhereInput> | null;
    message?: XOR<
      MessageNullableScalarRelationFilter,
      MessageWhereInput
    > | null;
  };

  export type AssetOrderByWithRelationInput = {
    id?: SortOrder;
    url?: SortOrder;
    type?: SortOrder;
    postId?: SortOrderInput | SortOrder;
    messageId?: SortOrderInput | SortOrder;
    post?: PostOrderByWithRelationInput;
    message?: MessageOrderByWithRelationInput;
  };

  export type AssetWhereUniqueInput = Prisma.AtLeast<
    {
      id?: string;
      AND?: AssetWhereInput | AssetWhereInput[];
      OR?: AssetWhereInput[];
      NOT?: AssetWhereInput | AssetWhereInput[];
      url?: StringFilter<'Asset'> | string;
      type?: EnumAssetTypeFilter<'Asset'> | $Enums.AssetType;
      postId?: StringNullableFilter<'Asset'> | string | null;
      messageId?: StringNullableFilter<'Asset'> | string | null;
      post?: XOR<PostNullableScalarRelationFilter, PostWhereInput> | null;
      message?: XOR<
        MessageNullableScalarRelationFilter,
        MessageWhereInput
      > | null;
    },
    'id'
  >;

  export type AssetOrderByWithAggregationInput = {
    id?: SortOrder;
    url?: SortOrder;
    type?: SortOrder;
    postId?: SortOrderInput | SortOrder;
    messageId?: SortOrderInput | SortOrder;
    _count?: AssetCountOrderByAggregateInput;
    _max?: AssetMaxOrderByAggregateInput;
    _min?: AssetMinOrderByAggregateInput;
  };

  export type AssetScalarWhereWithAggregatesInput = {
    AND?:
      | AssetScalarWhereWithAggregatesInput
      | AssetScalarWhereWithAggregatesInput[];
    OR?: AssetScalarWhereWithAggregatesInput[];
    NOT?:
      | AssetScalarWhereWithAggregatesInput
      | AssetScalarWhereWithAggregatesInput[];
    id?: StringWithAggregatesFilter<'Asset'> | string;
    url?: StringWithAggregatesFilter<'Asset'> | string;
    type?: EnumAssetTypeWithAggregatesFilter<'Asset'> | $Enums.AssetType;
    postId?: StringNullableWithAggregatesFilter<'Asset'> | string | null;
    messageId?: StringNullableWithAggregatesFilter<'Asset'> | string | null;
  };

  export type CommentWhereInput = {
    AND?: CommentWhereInput | CommentWhereInput[];
    OR?: CommentWhereInput[];
    NOT?: CommentWhereInput | CommentWhereInput[];
    id?: StringFilter<'Comment'> | string;
    authorId?: StringFilter<'Comment'> | string;
    postId?: StringFilter<'Comment'> | string;
    parentId?: StringNullableFilter<'Comment'> | string | null;
    content?: StringFilter<'Comment'> | string;
    createdAt?: DateTimeFilter<'Comment'> | Date | string;
    parent?: XOR<CommentNullableScalarRelationFilter, CommentWhereInput> | null;
    children?: CommentListRelationFilter;
    likes?: LikeListRelationFilter;
    post?: XOR<PostScalarRelationFilter, PostWhereInput>;
    author?: XOR<UserScalarRelationFilter, UserWhereInput>;
  };

  export type CommentOrderByWithRelationInput = {
    id?: SortOrder;
    authorId?: SortOrder;
    postId?: SortOrder;
    parentId?: SortOrderInput | SortOrder;
    content?: SortOrder;
    createdAt?: SortOrder;
    parent?: CommentOrderByWithRelationInput;
    children?: CommentOrderByRelationAggregateInput;
    likes?: LikeOrderByRelationAggregateInput;
    post?: PostOrderByWithRelationInput;
    author?: UserOrderByWithRelationInput;
  };

  export type CommentWhereUniqueInput = Prisma.AtLeast<
    {
      id?: string;
      AND?: CommentWhereInput | CommentWhereInput[];
      OR?: CommentWhereInput[];
      NOT?: CommentWhereInput | CommentWhereInput[];
      authorId?: StringFilter<'Comment'> | string;
      postId?: StringFilter<'Comment'> | string;
      parentId?: StringNullableFilter<'Comment'> | string | null;
      content?: StringFilter<'Comment'> | string;
      createdAt?: DateTimeFilter<'Comment'> | Date | string;
      parent?: XOR<
        CommentNullableScalarRelationFilter,
        CommentWhereInput
      > | null;
      children?: CommentListRelationFilter;
      likes?: LikeListRelationFilter;
      post?: XOR<PostScalarRelationFilter, PostWhereInput>;
      author?: XOR<UserScalarRelationFilter, UserWhereInput>;
    },
    'id'
  >;

  export type CommentOrderByWithAggregationInput = {
    id?: SortOrder;
    authorId?: SortOrder;
    postId?: SortOrder;
    parentId?: SortOrderInput | SortOrder;
    content?: SortOrder;
    createdAt?: SortOrder;
    _count?: CommentCountOrderByAggregateInput;
    _max?: CommentMaxOrderByAggregateInput;
    _min?: CommentMinOrderByAggregateInput;
  };

  export type CommentScalarWhereWithAggregatesInput = {
    AND?:
      | CommentScalarWhereWithAggregatesInput
      | CommentScalarWhereWithAggregatesInput[];
    OR?: CommentScalarWhereWithAggregatesInput[];
    NOT?:
      | CommentScalarWhereWithAggregatesInput
      | CommentScalarWhereWithAggregatesInput[];
    id?: StringWithAggregatesFilter<'Comment'> | string;
    authorId?: StringWithAggregatesFilter<'Comment'> | string;
    postId?: StringWithAggregatesFilter<'Comment'> | string;
    parentId?: StringNullableWithAggregatesFilter<'Comment'> | string | null;
    content?: StringWithAggregatesFilter<'Comment'> | string;
    createdAt?: DateTimeWithAggregatesFilter<'Comment'> | Date | string;
  };

  export type LikeWhereInput = {
    AND?: LikeWhereInput | LikeWhereInput[];
    OR?: LikeWhereInput[];
    NOT?: LikeWhereInput | LikeWhereInput[];
    id?: StringFilter<'Like'> | string;
    authorId?: StringFilter<'Like'> | string;
    postId?: StringNullableFilter<'Like'> | string | null;
    commentId?: StringNullableFilter<'Like'> | string | null;
    createdAt?: DateTimeFilter<'Like'> | Date | string;
    post?: XOR<PostNullableScalarRelationFilter, PostWhereInput> | null;
    comment?: XOR<
      CommentNullableScalarRelationFilter,
      CommentWhereInput
    > | null;
    author?: XOR<UserScalarRelationFilter, UserWhereInput>;
  };

  export type LikeOrderByWithRelationInput = {
    id?: SortOrder;
    authorId?: SortOrder;
    postId?: SortOrderInput | SortOrder;
    commentId?: SortOrderInput | SortOrder;
    createdAt?: SortOrder;
    post?: PostOrderByWithRelationInput;
    comment?: CommentOrderByWithRelationInput;
    author?: UserOrderByWithRelationInput;
  };

  export type LikeWhereUniqueInput = Prisma.AtLeast<
    {
      id?: string;
      authorId_postId?: LikeAuthorIdPostIdCompoundUniqueInput;
      authorId_commentId?: LikeAuthorIdCommentIdCompoundUniqueInput;
      AND?: LikeWhereInput | LikeWhereInput[];
      OR?: LikeWhereInput[];
      NOT?: LikeWhereInput | LikeWhereInput[];
      authorId?: StringFilter<'Like'> | string;
      postId?: StringNullableFilter<'Like'> | string | null;
      commentId?: StringNullableFilter<'Like'> | string | null;
      createdAt?: DateTimeFilter<'Like'> | Date | string;
      post?: XOR<PostNullableScalarRelationFilter, PostWhereInput> | null;
      comment?: XOR<
        CommentNullableScalarRelationFilter,
        CommentWhereInput
      > | null;
      author?: XOR<UserScalarRelationFilter, UserWhereInput>;
    },
    'id' | 'authorId_postId' | 'authorId_commentId'
  >;

  export type LikeOrderByWithAggregationInput = {
    id?: SortOrder;
    authorId?: SortOrder;
    postId?: SortOrderInput | SortOrder;
    commentId?: SortOrderInput | SortOrder;
    createdAt?: SortOrder;
    _count?: LikeCountOrderByAggregateInput;
    _max?: LikeMaxOrderByAggregateInput;
    _min?: LikeMinOrderByAggregateInput;
  };

  export type LikeScalarWhereWithAggregatesInput = {
    AND?:
      | LikeScalarWhereWithAggregatesInput
      | LikeScalarWhereWithAggregatesInput[];
    OR?: LikeScalarWhereWithAggregatesInput[];
    NOT?:
      | LikeScalarWhereWithAggregatesInput
      | LikeScalarWhereWithAggregatesInput[];
    id?: StringWithAggregatesFilter<'Like'> | string;
    authorId?: StringWithAggregatesFilter<'Like'> | string;
    postId?: StringNullableWithAggregatesFilter<'Like'> | string | null;
    commentId?: StringNullableWithAggregatesFilter<'Like'> | string | null;
    createdAt?: DateTimeWithAggregatesFilter<'Like'> | Date | string;
  };

  export type ChatWhereInput = {
    AND?: ChatWhereInput | ChatWhereInput[];
    OR?: ChatWhereInput[];
    NOT?: ChatWhereInput | ChatWhereInput[];
    id?: StringFilter<'Chat'> | string;
    name?: StringNullableFilter<'Chat'> | string | null;
    type?: EnumChatTypeFilter<'Chat'> | $Enums.ChatType;
    creatorId?: StringNullableFilter<'Chat'> | string | null;
    creator?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null;
    members?: UserListRelationFilter;
    messages?: MessageListRelationFilter;
  };

  export type ChatOrderByWithRelationInput = {
    id?: SortOrder;
    name?: SortOrderInput | SortOrder;
    type?: SortOrder;
    creatorId?: SortOrderInput | SortOrder;
    creator?: UserOrderByWithRelationInput;
    members?: UserOrderByRelationAggregateInput;
    messages?: MessageOrderByRelationAggregateInput;
  };

  export type ChatWhereUniqueInput = Prisma.AtLeast<
    {
      id?: string;
      AND?: ChatWhereInput | ChatWhereInput[];
      OR?: ChatWhereInput[];
      NOT?: ChatWhereInput | ChatWhereInput[];
      name?: StringNullableFilter<'Chat'> | string | null;
      type?: EnumChatTypeFilter<'Chat'> | $Enums.ChatType;
      creatorId?: StringNullableFilter<'Chat'> | string | null;
      creator?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null;
      members?: UserListRelationFilter;
      messages?: MessageListRelationFilter;
    },
    'id'
  >;

  export type ChatOrderByWithAggregationInput = {
    id?: SortOrder;
    name?: SortOrderInput | SortOrder;
    type?: SortOrder;
    creatorId?: SortOrderInput | SortOrder;
    _count?: ChatCountOrderByAggregateInput;
    _max?: ChatMaxOrderByAggregateInput;
    _min?: ChatMinOrderByAggregateInput;
  };

  export type ChatScalarWhereWithAggregatesInput = {
    AND?:
      | ChatScalarWhereWithAggregatesInput
      | ChatScalarWhereWithAggregatesInput[];
    OR?: ChatScalarWhereWithAggregatesInput[];
    NOT?:
      | ChatScalarWhereWithAggregatesInput
      | ChatScalarWhereWithAggregatesInput[];
    id?: StringWithAggregatesFilter<'Chat'> | string;
    name?: StringNullableWithAggregatesFilter<'Chat'> | string | null;
    type?: EnumChatTypeWithAggregatesFilter<'Chat'> | $Enums.ChatType;
    creatorId?: StringNullableWithAggregatesFilter<'Chat'> | string | null;
  };

  export type MessageWhereInput = {
    AND?: MessageWhereInput | MessageWhereInput[];
    OR?: MessageWhereInput[];
    NOT?: MessageWhereInput | MessageWhereInput[];
    id?: StringFilter<'Message'> | string;
    content?: StringNullableFilter<'Message'> | string | null;
    isRead?: BoolFilter<'Message'> | boolean;
    isEdited?: BoolFilter<'Message'> | boolean;
    chatId?: StringFilter<'Message'> | string;
    senderId?: StringFilter<'Message'> | string;
    createdAt?: DateTimeFilter<'Message'> | Date | string;
    updatedAt?: DateTimeNullableFilter<'Message'> | Date | string | null;
    assets?: AssetListRelationFilter;
    chat?: XOR<ChatScalarRelationFilter, ChatWhereInput>;
    sender?: XOR<UserScalarRelationFilter, UserWhereInput>;
  };

  export type MessageOrderByWithRelationInput = {
    id?: SortOrder;
    content?: SortOrderInput | SortOrder;
    isRead?: SortOrder;
    isEdited?: SortOrder;
    chatId?: SortOrder;
    senderId?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrderInput | SortOrder;
    assets?: AssetOrderByRelationAggregateInput;
    chat?: ChatOrderByWithRelationInput;
    sender?: UserOrderByWithRelationInput;
  };

  export type MessageWhereUniqueInput = Prisma.AtLeast<
    {
      id?: string;
      AND?: MessageWhereInput | MessageWhereInput[];
      OR?: MessageWhereInput[];
      NOT?: MessageWhereInput | MessageWhereInput[];
      content?: StringNullableFilter<'Message'> | string | null;
      isRead?: BoolFilter<'Message'> | boolean;
      isEdited?: BoolFilter<'Message'> | boolean;
      chatId?: StringFilter<'Message'> | string;
      senderId?: StringFilter<'Message'> | string;
      createdAt?: DateTimeFilter<'Message'> | Date | string;
      updatedAt?: DateTimeNullableFilter<'Message'> | Date | string | null;
      assets?: AssetListRelationFilter;
      chat?: XOR<ChatScalarRelationFilter, ChatWhereInput>;
      sender?: XOR<UserScalarRelationFilter, UserWhereInput>;
    },
    'id'
  >;

  export type MessageOrderByWithAggregationInput = {
    id?: SortOrder;
    content?: SortOrderInput | SortOrder;
    isRead?: SortOrder;
    isEdited?: SortOrder;
    chatId?: SortOrder;
    senderId?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrderInput | SortOrder;
    _count?: MessageCountOrderByAggregateInput;
    _max?: MessageMaxOrderByAggregateInput;
    _min?: MessageMinOrderByAggregateInput;
  };

  export type MessageScalarWhereWithAggregatesInput = {
    AND?:
      | MessageScalarWhereWithAggregatesInput
      | MessageScalarWhereWithAggregatesInput[];
    OR?: MessageScalarWhereWithAggregatesInput[];
    NOT?:
      | MessageScalarWhereWithAggregatesInput
      | MessageScalarWhereWithAggregatesInput[];
    id?: StringWithAggregatesFilter<'Message'> | string;
    content?: StringNullableWithAggregatesFilter<'Message'> | string | null;
    isRead?: BoolWithAggregatesFilter<'Message'> | boolean;
    isEdited?: BoolWithAggregatesFilter<'Message'> | boolean;
    chatId?: StringWithAggregatesFilter<'Message'> | string;
    senderId?: StringWithAggregatesFilter<'Message'> | string;
    createdAt?: DateTimeWithAggregatesFilter<'Message'> | Date | string;
    updatedAt?:
      | DateTimeNullableWithAggregatesFilter<'Message'>
      | Date
      | string
      | null;
  };

  export type NotificationWhereInput = {
    AND?: NotificationWhereInput | NotificationWhereInput[];
    OR?: NotificationWhereInput[];
    NOT?: NotificationWhereInput | NotificationWhereInput[];
    id?: StringFilter<'Notification'> | string;
    type?: EnumNotificationTypeFilter<'Notification'> | $Enums.NotificationType;
    recipientId?: StringFilter<'Notification'> | string;
    actorId?: StringFilter<'Notification'> | string;
    itemId?: StringNullableFilter<'Notification'> | string | null;
    postId?: StringNullableFilter<'Notification'> | string | null;
    isRead?: BoolFilter<'Notification'> | boolean;
    createdAt?: DateTimeFilter<'Notification'> | Date | string;
    recipient?: XOR<UserScalarRelationFilter, UserWhereInput>;
    actor?: XOR<UserScalarRelationFilter, UserWhereInput>;
  };

  export type NotificationOrderByWithRelationInput = {
    id?: SortOrder;
    type?: SortOrder;
    recipientId?: SortOrder;
    actorId?: SortOrder;
    itemId?: SortOrderInput | SortOrder;
    postId?: SortOrderInput | SortOrder;
    isRead?: SortOrder;
    createdAt?: SortOrder;
    recipient?: UserOrderByWithRelationInput;
    actor?: UserOrderByWithRelationInput;
  };

  export type NotificationWhereUniqueInput = Prisma.AtLeast<
    {
      id?: string;
      AND?: NotificationWhereInput | NotificationWhereInput[];
      OR?: NotificationWhereInput[];
      NOT?: NotificationWhereInput | NotificationWhereInput[];
      type?:
        | EnumNotificationTypeFilter<'Notification'>
        | $Enums.NotificationType;
      recipientId?: StringFilter<'Notification'> | string;
      actorId?: StringFilter<'Notification'> | string;
      itemId?: StringNullableFilter<'Notification'> | string | null;
      postId?: StringNullableFilter<'Notification'> | string | null;
      isRead?: BoolFilter<'Notification'> | boolean;
      createdAt?: DateTimeFilter<'Notification'> | Date | string;
      recipient?: XOR<UserScalarRelationFilter, UserWhereInput>;
      actor?: XOR<UserScalarRelationFilter, UserWhereInput>;
    },
    'id'
  >;

  export type NotificationOrderByWithAggregationInput = {
    id?: SortOrder;
    type?: SortOrder;
    recipientId?: SortOrder;
    actorId?: SortOrder;
    itemId?: SortOrderInput | SortOrder;
    postId?: SortOrderInput | SortOrder;
    isRead?: SortOrder;
    createdAt?: SortOrder;
    _count?: NotificationCountOrderByAggregateInput;
    _max?: NotificationMaxOrderByAggregateInput;
    _min?: NotificationMinOrderByAggregateInput;
  };

  export type NotificationScalarWhereWithAggregatesInput = {
    AND?:
      | NotificationScalarWhereWithAggregatesInput
      | NotificationScalarWhereWithAggregatesInput[];
    OR?: NotificationScalarWhereWithAggregatesInput[];
    NOT?:
      | NotificationScalarWhereWithAggregatesInput
      | NotificationScalarWhereWithAggregatesInput[];
    id?: StringWithAggregatesFilter<'Notification'> | string;
    type?:
      | EnumNotificationTypeWithAggregatesFilter<'Notification'>
      | $Enums.NotificationType;
    recipientId?: StringWithAggregatesFilter<'Notification'> | string;
    actorId?: StringWithAggregatesFilter<'Notification'> | string;
    itemId?: StringNullableWithAggregatesFilter<'Notification'> | string | null;
    postId?: StringNullableWithAggregatesFilter<'Notification'> | string | null;
    isRead?: BoolWithAggregatesFilter<'Notification'> | boolean;
    createdAt?: DateTimeWithAggregatesFilter<'Notification'> | Date | string;
  };

  export type UserCreateInput = {
    id?: string;
    createdAt?: Date | string;
    deletedAt?: Date | string | null;
    account?: AccountCreateNestedOneWithoutUserInput;
    profile?: ProfileCreateNestedOneWithoutUserInput;
    following?: FollowCreateNestedManyWithoutFollowerInput;
    followers?: FollowCreateNestedManyWithoutFollowingInput;
    posts?: PostCreateNestedManyWithoutAuthorInput;
    likes?: LikeCreateNestedManyWithoutAuthorInput;
    comments?: CommentCreateNestedManyWithoutAuthorInput;
    chats?: ChatCreateNestedManyWithoutMembersInput;
    createdChats?: ChatCreateNestedManyWithoutCreatorInput;
    sentMessages?: MessageCreateNestedManyWithoutSenderInput;
    recievedNotifications?: NotificationCreateNestedManyWithoutRecipientInput;
    triggeredNotifications?: NotificationCreateNestedManyWithoutActorInput;
  };

  export type UserUncheckedCreateInput = {
    id?: string;
    createdAt?: Date | string;
    deletedAt?: Date | string | null;
    account?: AccountUncheckedCreateNestedOneWithoutUserInput;
    profile?: ProfileUncheckedCreateNestedOneWithoutUserInput;
    following?: FollowUncheckedCreateNestedManyWithoutFollowerInput;
    followers?: FollowUncheckedCreateNestedManyWithoutFollowingInput;
    posts?: PostUncheckedCreateNestedManyWithoutAuthorInput;
    likes?: LikeUncheckedCreateNestedManyWithoutAuthorInput;
    comments?: CommentUncheckedCreateNestedManyWithoutAuthorInput;
    chats?: ChatUncheckedCreateNestedManyWithoutMembersInput;
    createdChats?: ChatUncheckedCreateNestedManyWithoutCreatorInput;
    sentMessages?: MessageUncheckedCreateNestedManyWithoutSenderInput;
    recievedNotifications?: NotificationUncheckedCreateNestedManyWithoutRecipientInput;
    triggeredNotifications?: NotificationUncheckedCreateNestedManyWithoutActorInput;
  };

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    account?: AccountUpdateOneWithoutUserNestedInput;
    profile?: ProfileUpdateOneWithoutUserNestedInput;
    following?: FollowUpdateManyWithoutFollowerNestedInput;
    followers?: FollowUpdateManyWithoutFollowingNestedInput;
    posts?: PostUpdateManyWithoutAuthorNestedInput;
    likes?: LikeUpdateManyWithoutAuthorNestedInput;
    comments?: CommentUpdateManyWithoutAuthorNestedInput;
    chats?: ChatUpdateManyWithoutMembersNestedInput;
    createdChats?: ChatUpdateManyWithoutCreatorNestedInput;
    sentMessages?: MessageUpdateManyWithoutSenderNestedInput;
    recievedNotifications?: NotificationUpdateManyWithoutRecipientNestedInput;
    triggeredNotifications?: NotificationUpdateManyWithoutActorNestedInput;
  };

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    account?: AccountUncheckedUpdateOneWithoutUserNestedInput;
    profile?: ProfileUncheckedUpdateOneWithoutUserNestedInput;
    following?: FollowUncheckedUpdateManyWithoutFollowerNestedInput;
    followers?: FollowUncheckedUpdateManyWithoutFollowingNestedInput;
    posts?: PostUncheckedUpdateManyWithoutAuthorNestedInput;
    likes?: LikeUncheckedUpdateManyWithoutAuthorNestedInput;
    comments?: CommentUncheckedUpdateManyWithoutAuthorNestedInput;
    chats?: ChatUncheckedUpdateManyWithoutMembersNestedInput;
    createdChats?: ChatUncheckedUpdateManyWithoutCreatorNestedInput;
    sentMessages?: MessageUncheckedUpdateManyWithoutSenderNestedInput;
    recievedNotifications?: NotificationUncheckedUpdateManyWithoutRecipientNestedInput;
    triggeredNotifications?: NotificationUncheckedUpdateManyWithoutActorNestedInput;
  };

  export type UserCreateManyInput = {
    id?: string;
    createdAt?: Date | string;
    deletedAt?: Date | string | null;
  };

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
  };

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
  };

  export type AccountCreateInput = {
    id?: string;
    username: string;
    email?: string | null;
    phoneNumber?: string | null;
    passwordHash?: string | null;
    updatedAt?: Date | string | null;
    user: UserCreateNestedOneWithoutAccountInput;
  };

  export type AccountUncheckedCreateInput = {
    id?: string;
    userId: string;
    username: string;
    email?: string | null;
    phoneNumber?: string | null;
    passwordHash?: string | null;
    updatedAt?: Date | string | null;
  };

  export type AccountUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    username?: StringFieldUpdateOperationsInput | string;
    email?: NullableStringFieldUpdateOperationsInput | string | null;
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null;
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null;
    updatedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    user?: UserUpdateOneRequiredWithoutAccountNestedInput;
  };

  export type AccountUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    userId?: StringFieldUpdateOperationsInput | string;
    username?: StringFieldUpdateOperationsInput | string;
    email?: NullableStringFieldUpdateOperationsInput | string | null;
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null;
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null;
    updatedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
  };

  export type AccountCreateManyInput = {
    id?: string;
    userId: string;
    username: string;
    email?: string | null;
    phoneNumber?: string | null;
    passwordHash?: string | null;
    updatedAt?: Date | string | null;
  };

  export type AccountUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    username?: StringFieldUpdateOperationsInput | string;
    email?: NullableStringFieldUpdateOperationsInput | string | null;
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null;
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null;
    updatedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
  };

  export type AccountUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string;
    userId?: StringFieldUpdateOperationsInput | string;
    username?: StringFieldUpdateOperationsInput | string;
    email?: NullableStringFieldUpdateOperationsInput | string | null;
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null;
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null;
    updatedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
  };

  export type ProfileCreateInput = {
    id?: string;
    firstName: string;
    secondName?: string | null;
    avatarUrl?: string | null;
    bio?: string | null;
    birthday?: Date | string | null;
    isPrivate?: boolean;
    user: UserCreateNestedOneWithoutProfileInput;
  };

  export type ProfileUncheckedCreateInput = {
    id?: string;
    userId: string;
    firstName: string;
    secondName?: string | null;
    avatarUrl?: string | null;
    bio?: string | null;
    birthday?: Date | string | null;
    isPrivate?: boolean;
  };

  export type ProfileUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    firstName?: StringFieldUpdateOperationsInput | string;
    secondName?: NullableStringFieldUpdateOperationsInput | string | null;
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null;
    bio?: NullableStringFieldUpdateOperationsInput | string | null;
    birthday?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    isPrivate?: BoolFieldUpdateOperationsInput | boolean;
    user?: UserUpdateOneRequiredWithoutProfileNestedInput;
  };

  export type ProfileUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    userId?: StringFieldUpdateOperationsInput | string;
    firstName?: StringFieldUpdateOperationsInput | string;
    secondName?: NullableStringFieldUpdateOperationsInput | string | null;
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null;
    bio?: NullableStringFieldUpdateOperationsInput | string | null;
    birthday?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    isPrivate?: BoolFieldUpdateOperationsInput | boolean;
  };

  export type ProfileCreateManyInput = {
    id?: string;
    userId: string;
    firstName: string;
    secondName?: string | null;
    avatarUrl?: string | null;
    bio?: string | null;
    birthday?: Date | string | null;
    isPrivate?: boolean;
  };

  export type ProfileUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    firstName?: StringFieldUpdateOperationsInput | string;
    secondName?: NullableStringFieldUpdateOperationsInput | string | null;
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null;
    bio?: NullableStringFieldUpdateOperationsInput | string | null;
    birthday?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    isPrivate?: BoolFieldUpdateOperationsInput | boolean;
  };

  export type ProfileUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string;
    userId?: StringFieldUpdateOperationsInput | string;
    firstName?: StringFieldUpdateOperationsInput | string;
    secondName?: NullableStringFieldUpdateOperationsInput | string | null;
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null;
    bio?: NullableStringFieldUpdateOperationsInput | string | null;
    birthday?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    isPrivate?: BoolFieldUpdateOperationsInput | boolean;
  };

  export type FollowCreateInput = {
    id?: string;
    createdAt?: Date | string;
    status?: $Enums.FollowStatus;
    follower: UserCreateNestedOneWithoutFollowingInput;
    following: UserCreateNestedOneWithoutFollowersInput;
  };

  export type FollowUncheckedCreateInput = {
    id?: string;
    followerId: string;
    followingId: string;
    createdAt?: Date | string;
    status?: $Enums.FollowStatus;
  };

  export type FollowUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    status?: EnumFollowStatusFieldUpdateOperationsInput | $Enums.FollowStatus;
    follower?: UserUpdateOneRequiredWithoutFollowingNestedInput;
    following?: UserUpdateOneRequiredWithoutFollowersNestedInput;
  };

  export type FollowUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    followerId?: StringFieldUpdateOperationsInput | string;
    followingId?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    status?: EnumFollowStatusFieldUpdateOperationsInput | $Enums.FollowStatus;
  };

  export type FollowCreateManyInput = {
    id?: string;
    followerId: string;
    followingId: string;
    createdAt?: Date | string;
    status?: $Enums.FollowStatus;
  };

  export type FollowUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    status?: EnumFollowStatusFieldUpdateOperationsInput | $Enums.FollowStatus;
  };

  export type FollowUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string;
    followerId?: StringFieldUpdateOperationsInput | string;
    followingId?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    status?: EnumFollowStatusFieldUpdateOperationsInput | $Enums.FollowStatus;
  };

  export type PostCreateInput = {
    id?: string;
    description?: string | null;
    isArchived?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string | null;
    assets?: AssetCreateNestedManyWithoutPostInput;
    comments?: CommentCreateNestedManyWithoutPostInput;
    likes?: LikeCreateNestedManyWithoutPostInput;
    author: UserCreateNestedOneWithoutPostsInput;
  };

  export type PostUncheckedCreateInput = {
    id?: string;
    authorId: string;
    description?: string | null;
    isArchived?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string | null;
    assets?: AssetUncheckedCreateNestedManyWithoutPostInput;
    comments?: CommentUncheckedCreateNestedManyWithoutPostInput;
    likes?: LikeUncheckedCreateNestedManyWithoutPostInput;
  };

  export type PostUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    isArchived?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    assets?: AssetUpdateManyWithoutPostNestedInput;
    comments?: CommentUpdateManyWithoutPostNestedInput;
    likes?: LikeUpdateManyWithoutPostNestedInput;
    author?: UserUpdateOneRequiredWithoutPostsNestedInput;
  };

  export type PostUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    authorId?: StringFieldUpdateOperationsInput | string;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    isArchived?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    assets?: AssetUncheckedUpdateManyWithoutPostNestedInput;
    comments?: CommentUncheckedUpdateManyWithoutPostNestedInput;
    likes?: LikeUncheckedUpdateManyWithoutPostNestedInput;
  };

  export type PostCreateManyInput = {
    id?: string;
    authorId: string;
    description?: string | null;
    isArchived?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string | null;
  };

  export type PostUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    isArchived?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
  };

  export type PostUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string;
    authorId?: StringFieldUpdateOperationsInput | string;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    isArchived?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
  };

  export type AssetCreateInput = {
    id?: string;
    url: string;
    type?: $Enums.AssetType;
    post?: PostCreateNestedOneWithoutAssetsInput;
    message?: MessageCreateNestedOneWithoutAssetsInput;
  };

  export type AssetUncheckedCreateInput = {
    id?: string;
    url: string;
    type?: $Enums.AssetType;
    postId?: string | null;
    messageId?: string | null;
  };

  export type AssetUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    url?: StringFieldUpdateOperationsInput | string;
    type?: EnumAssetTypeFieldUpdateOperationsInput | $Enums.AssetType;
    post?: PostUpdateOneWithoutAssetsNestedInput;
    message?: MessageUpdateOneWithoutAssetsNestedInput;
  };

  export type AssetUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    url?: StringFieldUpdateOperationsInput | string;
    type?: EnumAssetTypeFieldUpdateOperationsInput | $Enums.AssetType;
    postId?: NullableStringFieldUpdateOperationsInput | string | null;
    messageId?: NullableStringFieldUpdateOperationsInput | string | null;
  };

  export type AssetCreateManyInput = {
    id?: string;
    url: string;
    type?: $Enums.AssetType;
    postId?: string | null;
    messageId?: string | null;
  };

  export type AssetUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    url?: StringFieldUpdateOperationsInput | string;
    type?: EnumAssetTypeFieldUpdateOperationsInput | $Enums.AssetType;
  };

  export type AssetUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string;
    url?: StringFieldUpdateOperationsInput | string;
    type?: EnumAssetTypeFieldUpdateOperationsInput | $Enums.AssetType;
    postId?: NullableStringFieldUpdateOperationsInput | string | null;
    messageId?: NullableStringFieldUpdateOperationsInput | string | null;
  };

  export type CommentCreateInput = {
    id?: string;
    content: string;
    createdAt?: Date | string;
    parent?: CommentCreateNestedOneWithoutChildrenInput;
    children?: CommentCreateNestedManyWithoutParentInput;
    likes?: LikeCreateNestedManyWithoutCommentInput;
    post: PostCreateNestedOneWithoutCommentsInput;
    author: UserCreateNestedOneWithoutCommentsInput;
  };

  export type CommentUncheckedCreateInput = {
    id?: string;
    authorId: string;
    postId: string;
    parentId?: string | null;
    content: string;
    createdAt?: Date | string;
    children?: CommentUncheckedCreateNestedManyWithoutParentInput;
    likes?: LikeUncheckedCreateNestedManyWithoutCommentInput;
  };

  export type CommentUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    content?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    parent?: CommentUpdateOneWithoutChildrenNestedInput;
    children?: CommentUpdateManyWithoutParentNestedInput;
    likes?: LikeUpdateManyWithoutCommentNestedInput;
    post?: PostUpdateOneRequiredWithoutCommentsNestedInput;
    author?: UserUpdateOneRequiredWithoutCommentsNestedInput;
  };

  export type CommentUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    authorId?: StringFieldUpdateOperationsInput | string;
    postId?: StringFieldUpdateOperationsInput | string;
    parentId?: NullableStringFieldUpdateOperationsInput | string | null;
    content?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    children?: CommentUncheckedUpdateManyWithoutParentNestedInput;
    likes?: LikeUncheckedUpdateManyWithoutCommentNestedInput;
  };

  export type CommentCreateManyInput = {
    id?: string;
    authorId: string;
    postId: string;
    parentId?: string | null;
    content: string;
    createdAt?: Date | string;
  };

  export type CommentUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    content?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type CommentUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string;
    authorId?: StringFieldUpdateOperationsInput | string;
    postId?: StringFieldUpdateOperationsInput | string;
    parentId?: NullableStringFieldUpdateOperationsInput | string | null;
    content?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type LikeCreateInput = {
    id?: string;
    createdAt?: Date | string;
    post?: PostCreateNestedOneWithoutLikesInput;
    comment?: CommentCreateNestedOneWithoutLikesInput;
    author: UserCreateNestedOneWithoutLikesInput;
  };

  export type LikeUncheckedCreateInput = {
    id?: string;
    authorId: string;
    postId?: string | null;
    commentId?: string | null;
    createdAt?: Date | string;
  };

  export type LikeUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    post?: PostUpdateOneWithoutLikesNestedInput;
    comment?: CommentUpdateOneWithoutLikesNestedInput;
    author?: UserUpdateOneRequiredWithoutLikesNestedInput;
  };

  export type LikeUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    authorId?: StringFieldUpdateOperationsInput | string;
    postId?: NullableStringFieldUpdateOperationsInput | string | null;
    commentId?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type LikeCreateManyInput = {
    id?: string;
    authorId: string;
    postId?: string | null;
    commentId?: string | null;
    createdAt?: Date | string;
  };

  export type LikeUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type LikeUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string;
    authorId?: StringFieldUpdateOperationsInput | string;
    postId?: NullableStringFieldUpdateOperationsInput | string | null;
    commentId?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type ChatCreateInput = {
    id?: string;
    name?: string | null;
    type?: $Enums.ChatType;
    creator?: UserCreateNestedOneWithoutCreatedChatsInput;
    members?: UserCreateNestedManyWithoutChatsInput;
    messages?: MessageCreateNestedManyWithoutChatInput;
  };

  export type ChatUncheckedCreateInput = {
    id?: string;
    name?: string | null;
    type?: $Enums.ChatType;
    creatorId?: string | null;
    members?: UserUncheckedCreateNestedManyWithoutChatsInput;
    messages?: MessageUncheckedCreateNestedManyWithoutChatInput;
  };

  export type ChatUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: NullableStringFieldUpdateOperationsInput | string | null;
    type?: EnumChatTypeFieldUpdateOperationsInput | $Enums.ChatType;
    creator?: UserUpdateOneWithoutCreatedChatsNestedInput;
    members?: UserUpdateManyWithoutChatsNestedInput;
    messages?: MessageUpdateManyWithoutChatNestedInput;
  };

  export type ChatUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: NullableStringFieldUpdateOperationsInput | string | null;
    type?: EnumChatTypeFieldUpdateOperationsInput | $Enums.ChatType;
    creatorId?: NullableStringFieldUpdateOperationsInput | string | null;
    members?: UserUncheckedUpdateManyWithoutChatsNestedInput;
    messages?: MessageUncheckedUpdateManyWithoutChatNestedInput;
  };

  export type ChatCreateManyInput = {
    id?: string;
    name?: string | null;
    type?: $Enums.ChatType;
    creatorId?: string | null;
  };

  export type ChatUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: NullableStringFieldUpdateOperationsInput | string | null;
    type?: EnumChatTypeFieldUpdateOperationsInput | $Enums.ChatType;
  };

  export type ChatUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: NullableStringFieldUpdateOperationsInput | string | null;
    type?: EnumChatTypeFieldUpdateOperationsInput | $Enums.ChatType;
    creatorId?: NullableStringFieldUpdateOperationsInput | string | null;
  };

  export type MessageCreateInput = {
    id?: string;
    content?: string | null;
    isRead?: boolean;
    isEdited?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string | null;
    assets?: AssetCreateNestedManyWithoutMessageInput;
    chat: ChatCreateNestedOneWithoutMessagesInput;
    sender: UserCreateNestedOneWithoutSentMessagesInput;
  };

  export type MessageUncheckedCreateInput = {
    id?: string;
    content?: string | null;
    isRead?: boolean;
    isEdited?: boolean;
    chatId: string;
    senderId: string;
    createdAt?: Date | string;
    updatedAt?: Date | string | null;
    assets?: AssetUncheckedCreateNestedManyWithoutMessageInput;
  };

  export type MessageUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    content?: NullableStringFieldUpdateOperationsInput | string | null;
    isRead?: BoolFieldUpdateOperationsInput | boolean;
    isEdited?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    assets?: AssetUpdateManyWithoutMessageNestedInput;
    chat?: ChatUpdateOneRequiredWithoutMessagesNestedInput;
    sender?: UserUpdateOneRequiredWithoutSentMessagesNestedInput;
  };

  export type MessageUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    content?: NullableStringFieldUpdateOperationsInput | string | null;
    isRead?: BoolFieldUpdateOperationsInput | boolean;
    isEdited?: BoolFieldUpdateOperationsInput | boolean;
    chatId?: StringFieldUpdateOperationsInput | string;
    senderId?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    assets?: AssetUncheckedUpdateManyWithoutMessageNestedInput;
  };

  export type MessageCreateManyInput = {
    id?: string;
    content?: string | null;
    isRead?: boolean;
    isEdited?: boolean;
    chatId: string;
    senderId: string;
    createdAt?: Date | string;
    updatedAt?: Date | string | null;
  };

  export type MessageUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    content?: NullableStringFieldUpdateOperationsInput | string | null;
    isRead?: BoolFieldUpdateOperationsInput | boolean;
    isEdited?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
  };

  export type MessageUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string;
    content?: NullableStringFieldUpdateOperationsInput | string | null;
    isRead?: BoolFieldUpdateOperationsInput | boolean;
    isEdited?: BoolFieldUpdateOperationsInput | boolean;
    chatId?: StringFieldUpdateOperationsInput | string;
    senderId?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
  };

  export type NotificationCreateInput = {
    id?: string;
    type: $Enums.NotificationType;
    itemId?: string | null;
    postId?: string | null;
    isRead?: boolean;
    createdAt?: Date | string;
    recipient: UserCreateNestedOneWithoutRecievedNotificationsInput;
    actor: UserCreateNestedOneWithoutTriggeredNotificationsInput;
  };

  export type NotificationUncheckedCreateInput = {
    id?: string;
    type: $Enums.NotificationType;
    recipientId: string;
    actorId: string;
    itemId?: string | null;
    postId?: string | null;
    isRead?: boolean;
    createdAt?: Date | string;
  };

  export type NotificationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    type?:
      | EnumNotificationTypeFieldUpdateOperationsInput
      | $Enums.NotificationType;
    itemId?: NullableStringFieldUpdateOperationsInput | string | null;
    postId?: NullableStringFieldUpdateOperationsInput | string | null;
    isRead?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    recipient?: UserUpdateOneRequiredWithoutRecievedNotificationsNestedInput;
    actor?: UserUpdateOneRequiredWithoutTriggeredNotificationsNestedInput;
  };

  export type NotificationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    type?:
      | EnumNotificationTypeFieldUpdateOperationsInput
      | $Enums.NotificationType;
    recipientId?: StringFieldUpdateOperationsInput | string;
    actorId?: StringFieldUpdateOperationsInput | string;
    itemId?: NullableStringFieldUpdateOperationsInput | string | null;
    postId?: NullableStringFieldUpdateOperationsInput | string | null;
    isRead?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type NotificationCreateManyInput = {
    id?: string;
    type: $Enums.NotificationType;
    recipientId: string;
    actorId: string;
    itemId?: string | null;
    postId?: string | null;
    isRead?: boolean;
    createdAt?: Date | string;
  };

  export type NotificationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    type?:
      | EnumNotificationTypeFieldUpdateOperationsInput
      | $Enums.NotificationType;
    itemId?: NullableStringFieldUpdateOperationsInput | string | null;
    postId?: NullableStringFieldUpdateOperationsInput | string | null;
    isRead?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type NotificationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string;
    type?:
      | EnumNotificationTypeFieldUpdateOperationsInput
      | $Enums.NotificationType;
    recipientId?: StringFieldUpdateOperationsInput | string;
    actorId?: StringFieldUpdateOperationsInput | string;
    itemId?: NullableStringFieldUpdateOperationsInput | string | null;
    postId?: NullableStringFieldUpdateOperationsInput | string | null;
    isRead?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>;
    in?: string[] | ListStringFieldRefInput<$PrismaModel>;
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>;
    lt?: string | StringFieldRefInput<$PrismaModel>;
    lte?: string | StringFieldRefInput<$PrismaModel>;
    gt?: string | StringFieldRefInput<$PrismaModel>;
    gte?: string | StringFieldRefInput<$PrismaModel>;
    contains?: string | StringFieldRefInput<$PrismaModel>;
    startsWith?: string | StringFieldRefInput<$PrismaModel>;
    endsWith?: string | StringFieldRefInput<$PrismaModel>;
    mode?: QueryMode;
    not?: NestedStringFilter<$PrismaModel> | string;
  };

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string;
  };

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null;
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null;
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null;
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null;
  };

  export type AccountNullableScalarRelationFilter = {
    is?: AccountWhereInput | null;
    isNot?: AccountWhereInput | null;
  };

  export type ProfileNullableScalarRelationFilter = {
    is?: ProfileWhereInput | null;
    isNot?: ProfileWhereInput | null;
  };

  export type FollowListRelationFilter = {
    every?: FollowWhereInput;
    some?: FollowWhereInput;
    none?: FollowWhereInput;
  };

  export type PostListRelationFilter = {
    every?: PostWhereInput;
    some?: PostWhereInput;
    none?: PostWhereInput;
  };

  export type LikeListRelationFilter = {
    every?: LikeWhereInput;
    some?: LikeWhereInput;
    none?: LikeWhereInput;
  };

  export type CommentListRelationFilter = {
    every?: CommentWhereInput;
    some?: CommentWhereInput;
    none?: CommentWhereInput;
  };

  export type ChatListRelationFilter = {
    every?: ChatWhereInput;
    some?: ChatWhereInput;
    none?: ChatWhereInput;
  };

  export type MessageListRelationFilter = {
    every?: MessageWhereInput;
    some?: MessageWhereInput;
    none?: MessageWhereInput;
  };

  export type NotificationListRelationFilter = {
    every?: NotificationWhereInput;
    some?: NotificationWhereInput;
    none?: NotificationWhereInput;
  };

  export type SortOrderInput = {
    sort: SortOrder;
    nulls?: NullsOrder;
  };

  export type FollowOrderByRelationAggregateInput = {
    _count?: SortOrder;
  };

  export type PostOrderByRelationAggregateInput = {
    _count?: SortOrder;
  };

  export type LikeOrderByRelationAggregateInput = {
    _count?: SortOrder;
  };

  export type CommentOrderByRelationAggregateInput = {
    _count?: SortOrder;
  };

  export type ChatOrderByRelationAggregateInput = {
    _count?: SortOrder;
  };

  export type MessageOrderByRelationAggregateInput = {
    _count?: SortOrder;
  };

  export type NotificationOrderByRelationAggregateInput = {
    _count?: SortOrder;
  };

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder;
    createdAt?: SortOrder;
    deletedAt?: SortOrder;
  };

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder;
    createdAt?: SortOrder;
    deletedAt?: SortOrder;
  };

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder;
    createdAt?: SortOrder;
    deletedAt?: SortOrder;
  };

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>;
    in?: string[] | ListStringFieldRefInput<$PrismaModel>;
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>;
    lt?: string | StringFieldRefInput<$PrismaModel>;
    lte?: string | StringFieldRefInput<$PrismaModel>;
    gt?: string | StringFieldRefInput<$PrismaModel>;
    gte?: string | StringFieldRefInput<$PrismaModel>;
    contains?: string | StringFieldRefInput<$PrismaModel>;
    startsWith?: string | StringFieldRefInput<$PrismaModel>;
    endsWith?: string | StringFieldRefInput<$PrismaModel>;
    mode?: QueryMode;
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedStringFilter<$PrismaModel>;
    _max?: NestedStringFilter<$PrismaModel>;
  };

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedDateTimeFilter<$PrismaModel>;
    _max?: NestedDateTimeFilter<$PrismaModel>;
  };

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null;
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null;
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null;
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    not?:
      | NestedDateTimeNullableWithAggregatesFilter<$PrismaModel>
      | Date
      | string
      | null;
    _count?: NestedIntNullableFilter<$PrismaModel>;
    _min?: NestedDateTimeNullableFilter<$PrismaModel>;
    _max?: NestedDateTimeNullableFilter<$PrismaModel>;
  };

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null;
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
    lt?: string | StringFieldRefInput<$PrismaModel>;
    lte?: string | StringFieldRefInput<$PrismaModel>;
    gt?: string | StringFieldRefInput<$PrismaModel>;
    gte?: string | StringFieldRefInput<$PrismaModel>;
    contains?: string | StringFieldRefInput<$PrismaModel>;
    startsWith?: string | StringFieldRefInput<$PrismaModel>;
    endsWith?: string | StringFieldRefInput<$PrismaModel>;
    mode?: QueryMode;
    not?: NestedStringNullableFilter<$PrismaModel> | string | null;
  };

  export type UserScalarRelationFilter = {
    is?: UserWhereInput;
    isNot?: UserWhereInput;
  };

  export type AccountCountOrderByAggregateInput = {
    id?: SortOrder;
    userId?: SortOrder;
    username?: SortOrder;
    email?: SortOrder;
    phoneNumber?: SortOrder;
    passwordHash?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type AccountMaxOrderByAggregateInput = {
    id?: SortOrder;
    userId?: SortOrder;
    username?: SortOrder;
    email?: SortOrder;
    phoneNumber?: SortOrder;
    passwordHash?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type AccountMinOrderByAggregateInput = {
    id?: SortOrder;
    userId?: SortOrder;
    username?: SortOrder;
    email?: SortOrder;
    phoneNumber?: SortOrder;
    passwordHash?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null;
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
    lt?: string | StringFieldRefInput<$PrismaModel>;
    lte?: string | StringFieldRefInput<$PrismaModel>;
    gt?: string | StringFieldRefInput<$PrismaModel>;
    gte?: string | StringFieldRefInput<$PrismaModel>;
    contains?: string | StringFieldRefInput<$PrismaModel>;
    startsWith?: string | StringFieldRefInput<$PrismaModel>;
    endsWith?: string | StringFieldRefInput<$PrismaModel>;
    mode?: QueryMode;
    not?:
      | NestedStringNullableWithAggregatesFilter<$PrismaModel>
      | string
      | null;
    _count?: NestedIntNullableFilter<$PrismaModel>;
    _min?: NestedStringNullableFilter<$PrismaModel>;
    _max?: NestedStringNullableFilter<$PrismaModel>;
  };

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>;
    not?: NestedBoolFilter<$PrismaModel> | boolean;
  };

  export type ProfileCountOrderByAggregateInput = {
    id?: SortOrder;
    userId?: SortOrder;
    firstName?: SortOrder;
    secondName?: SortOrder;
    avatarUrl?: SortOrder;
    bio?: SortOrder;
    birthday?: SortOrder;
    isPrivate?: SortOrder;
  };

  export type ProfileMaxOrderByAggregateInput = {
    id?: SortOrder;
    userId?: SortOrder;
    firstName?: SortOrder;
    secondName?: SortOrder;
    avatarUrl?: SortOrder;
    bio?: SortOrder;
    birthday?: SortOrder;
    isPrivate?: SortOrder;
  };

  export type ProfileMinOrderByAggregateInput = {
    id?: SortOrder;
    userId?: SortOrder;
    firstName?: SortOrder;
    secondName?: SortOrder;
    avatarUrl?: SortOrder;
    bio?: SortOrder;
    birthday?: SortOrder;
    isPrivate?: SortOrder;
  };

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>;
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedBoolFilter<$PrismaModel>;
    _max?: NestedBoolFilter<$PrismaModel>;
  };

  export type EnumFollowStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.FollowStatus | EnumFollowStatusFieldRefInput<$PrismaModel>;
    in?:
      | $Enums.FollowStatus[]
      | ListEnumFollowStatusFieldRefInput<$PrismaModel>;
    notIn?:
      | $Enums.FollowStatus[]
      | ListEnumFollowStatusFieldRefInput<$PrismaModel>;
    not?: NestedEnumFollowStatusFilter<$PrismaModel> | $Enums.FollowStatus;
  };

  export type FollowFollowerIdFollowingIdCompoundUniqueInput = {
    followerId: string;
    followingId: string;
  };

  export type FollowCountOrderByAggregateInput = {
    id?: SortOrder;
    followerId?: SortOrder;
    followingId?: SortOrder;
    createdAt?: SortOrder;
    status?: SortOrder;
  };

  export type FollowMaxOrderByAggregateInput = {
    id?: SortOrder;
    followerId?: SortOrder;
    followingId?: SortOrder;
    createdAt?: SortOrder;
    status?: SortOrder;
  };

  export type FollowMinOrderByAggregateInput = {
    id?: SortOrder;
    followerId?: SortOrder;
    followingId?: SortOrder;
    createdAt?: SortOrder;
    status?: SortOrder;
  };

  export type EnumFollowStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.FollowStatus | EnumFollowStatusFieldRefInput<$PrismaModel>;
    in?:
      | $Enums.FollowStatus[]
      | ListEnumFollowStatusFieldRefInput<$PrismaModel>;
    notIn?:
      | $Enums.FollowStatus[]
      | ListEnumFollowStatusFieldRefInput<$PrismaModel>;
    not?:
      | NestedEnumFollowStatusWithAggregatesFilter<$PrismaModel>
      | $Enums.FollowStatus;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedEnumFollowStatusFilter<$PrismaModel>;
    _max?: NestedEnumFollowStatusFilter<$PrismaModel>;
  };

  export type AssetListRelationFilter = {
    every?: AssetWhereInput;
    some?: AssetWhereInput;
    none?: AssetWhereInput;
  };

  export type AssetOrderByRelationAggregateInput = {
    _count?: SortOrder;
  };

  export type PostCountOrderByAggregateInput = {
    id?: SortOrder;
    authorId?: SortOrder;
    description?: SortOrder;
    isArchived?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type PostMaxOrderByAggregateInput = {
    id?: SortOrder;
    authorId?: SortOrder;
    description?: SortOrder;
    isArchived?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type PostMinOrderByAggregateInput = {
    id?: SortOrder;
    authorId?: SortOrder;
    description?: SortOrder;
    isArchived?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type EnumAssetTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.AssetType | EnumAssetTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.AssetType[] | ListEnumAssetTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.AssetType[] | ListEnumAssetTypeFieldRefInput<$PrismaModel>;
    not?: NestedEnumAssetTypeFilter<$PrismaModel> | $Enums.AssetType;
  };

  export type PostNullableScalarRelationFilter = {
    is?: PostWhereInput | null;
    isNot?: PostWhereInput | null;
  };

  export type MessageNullableScalarRelationFilter = {
    is?: MessageWhereInput | null;
    isNot?: MessageWhereInput | null;
  };

  export type AssetCountOrderByAggregateInput = {
    id?: SortOrder;
    url?: SortOrder;
    type?: SortOrder;
    postId?: SortOrder;
    messageId?: SortOrder;
  };

  export type AssetMaxOrderByAggregateInput = {
    id?: SortOrder;
    url?: SortOrder;
    type?: SortOrder;
    postId?: SortOrder;
    messageId?: SortOrder;
  };

  export type AssetMinOrderByAggregateInput = {
    id?: SortOrder;
    url?: SortOrder;
    type?: SortOrder;
    postId?: SortOrder;
    messageId?: SortOrder;
  };

  export type EnumAssetTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AssetType | EnumAssetTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.AssetType[] | ListEnumAssetTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.AssetType[] | ListEnumAssetTypeFieldRefInput<$PrismaModel>;
    not?:
      | NestedEnumAssetTypeWithAggregatesFilter<$PrismaModel>
      | $Enums.AssetType;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedEnumAssetTypeFilter<$PrismaModel>;
    _max?: NestedEnumAssetTypeFilter<$PrismaModel>;
  };

  export type CommentNullableScalarRelationFilter = {
    is?: CommentWhereInput | null;
    isNot?: CommentWhereInput | null;
  };

  export type PostScalarRelationFilter = {
    is?: PostWhereInput;
    isNot?: PostWhereInput;
  };

  export type CommentCountOrderByAggregateInput = {
    id?: SortOrder;
    authorId?: SortOrder;
    postId?: SortOrder;
    parentId?: SortOrder;
    content?: SortOrder;
    createdAt?: SortOrder;
  };

  export type CommentMaxOrderByAggregateInput = {
    id?: SortOrder;
    authorId?: SortOrder;
    postId?: SortOrder;
    parentId?: SortOrder;
    content?: SortOrder;
    createdAt?: SortOrder;
  };

  export type CommentMinOrderByAggregateInput = {
    id?: SortOrder;
    authorId?: SortOrder;
    postId?: SortOrder;
    parentId?: SortOrder;
    content?: SortOrder;
    createdAt?: SortOrder;
  };

  export type LikeAuthorIdPostIdCompoundUniqueInput = {
    authorId: string;
    postId: string;
  };

  export type LikeAuthorIdCommentIdCompoundUniqueInput = {
    authorId: string;
    commentId: string;
  };

  export type LikeCountOrderByAggregateInput = {
    id?: SortOrder;
    authorId?: SortOrder;
    postId?: SortOrder;
    commentId?: SortOrder;
    createdAt?: SortOrder;
  };

  export type LikeMaxOrderByAggregateInput = {
    id?: SortOrder;
    authorId?: SortOrder;
    postId?: SortOrder;
    commentId?: SortOrder;
    createdAt?: SortOrder;
  };

  export type LikeMinOrderByAggregateInput = {
    id?: SortOrder;
    authorId?: SortOrder;
    postId?: SortOrder;
    commentId?: SortOrder;
    createdAt?: SortOrder;
  };

  export type EnumChatTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.ChatType | EnumChatTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.ChatType[] | ListEnumChatTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.ChatType[] | ListEnumChatTypeFieldRefInput<$PrismaModel>;
    not?: NestedEnumChatTypeFilter<$PrismaModel> | $Enums.ChatType;
  };

  export type UserNullableScalarRelationFilter = {
    is?: UserWhereInput | null;
    isNot?: UserWhereInput | null;
  };

  export type UserListRelationFilter = {
    every?: UserWhereInput;
    some?: UserWhereInput;
    none?: UserWhereInput;
  };

  export type UserOrderByRelationAggregateInput = {
    _count?: SortOrder;
  };

  export type ChatCountOrderByAggregateInput = {
    id?: SortOrder;
    name?: SortOrder;
    type?: SortOrder;
    creatorId?: SortOrder;
  };

  export type ChatMaxOrderByAggregateInput = {
    id?: SortOrder;
    name?: SortOrder;
    type?: SortOrder;
    creatorId?: SortOrder;
  };

  export type ChatMinOrderByAggregateInput = {
    id?: SortOrder;
    name?: SortOrder;
    type?: SortOrder;
    creatorId?: SortOrder;
  };

  export type EnumChatTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ChatType | EnumChatTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.ChatType[] | ListEnumChatTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.ChatType[] | ListEnumChatTypeFieldRefInput<$PrismaModel>;
    not?:
      | NestedEnumChatTypeWithAggregatesFilter<$PrismaModel>
      | $Enums.ChatType;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedEnumChatTypeFilter<$PrismaModel>;
    _max?: NestedEnumChatTypeFilter<$PrismaModel>;
  };

  export type ChatScalarRelationFilter = {
    is?: ChatWhereInput;
    isNot?: ChatWhereInput;
  };

  export type MessageCountOrderByAggregateInput = {
    id?: SortOrder;
    content?: SortOrder;
    isRead?: SortOrder;
    isEdited?: SortOrder;
    chatId?: SortOrder;
    senderId?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type MessageMaxOrderByAggregateInput = {
    id?: SortOrder;
    content?: SortOrder;
    isRead?: SortOrder;
    isEdited?: SortOrder;
    chatId?: SortOrder;
    senderId?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type MessageMinOrderByAggregateInput = {
    id?: SortOrder;
    content?: SortOrder;
    isRead?: SortOrder;
    isEdited?: SortOrder;
    chatId?: SortOrder;
    senderId?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type EnumNotificationTypeFilter<$PrismaModel = never> = {
    equals?:
      | $Enums.NotificationType
      | EnumNotificationTypeFieldRefInput<$PrismaModel>;
    in?:
      | $Enums.NotificationType[]
      | ListEnumNotificationTypeFieldRefInput<$PrismaModel>;
    notIn?:
      | $Enums.NotificationType[]
      | ListEnumNotificationTypeFieldRefInput<$PrismaModel>;
    not?:
      | NestedEnumNotificationTypeFilter<$PrismaModel>
      | $Enums.NotificationType;
  };

  export type NotificationCountOrderByAggregateInput = {
    id?: SortOrder;
    type?: SortOrder;
    recipientId?: SortOrder;
    actorId?: SortOrder;
    itemId?: SortOrder;
    postId?: SortOrder;
    isRead?: SortOrder;
    createdAt?: SortOrder;
  };

  export type NotificationMaxOrderByAggregateInput = {
    id?: SortOrder;
    type?: SortOrder;
    recipientId?: SortOrder;
    actorId?: SortOrder;
    itemId?: SortOrder;
    postId?: SortOrder;
    isRead?: SortOrder;
    createdAt?: SortOrder;
  };

  export type NotificationMinOrderByAggregateInput = {
    id?: SortOrder;
    type?: SortOrder;
    recipientId?: SortOrder;
    actorId?: SortOrder;
    itemId?: SortOrder;
    postId?: SortOrder;
    isRead?: SortOrder;
    createdAt?: SortOrder;
  };

  export type EnumNotificationTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?:
      | $Enums.NotificationType
      | EnumNotificationTypeFieldRefInput<$PrismaModel>;
    in?:
      | $Enums.NotificationType[]
      | ListEnumNotificationTypeFieldRefInput<$PrismaModel>;
    notIn?:
      | $Enums.NotificationType[]
      | ListEnumNotificationTypeFieldRefInput<$PrismaModel>;
    not?:
      | NestedEnumNotificationTypeWithAggregatesFilter<$PrismaModel>
      | $Enums.NotificationType;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedEnumNotificationTypeFilter<$PrismaModel>;
    _max?: NestedEnumNotificationTypeFilter<$PrismaModel>;
  };

  export type AccountCreateNestedOneWithoutUserInput = {
    create?: XOR<
      AccountCreateWithoutUserInput,
      AccountUncheckedCreateWithoutUserInput
    >;
    connectOrCreate?: AccountCreateOrConnectWithoutUserInput;
    connect?: AccountWhereUniqueInput;
  };

  export type ProfileCreateNestedOneWithoutUserInput = {
    create?: XOR<
      ProfileCreateWithoutUserInput,
      ProfileUncheckedCreateWithoutUserInput
    >;
    connectOrCreate?: ProfileCreateOrConnectWithoutUserInput;
    connect?: ProfileWhereUniqueInput;
  };

  export type FollowCreateNestedManyWithoutFollowerInput = {
    create?:
      | XOR<
          FollowCreateWithoutFollowerInput,
          FollowUncheckedCreateWithoutFollowerInput
        >
      | FollowCreateWithoutFollowerInput[]
      | FollowUncheckedCreateWithoutFollowerInput[];
    connectOrCreate?:
      | FollowCreateOrConnectWithoutFollowerInput
      | FollowCreateOrConnectWithoutFollowerInput[];
    createMany?: FollowCreateManyFollowerInputEnvelope;
    connect?: FollowWhereUniqueInput | FollowWhereUniqueInput[];
  };

  export type FollowCreateNestedManyWithoutFollowingInput = {
    create?:
      | XOR<
          FollowCreateWithoutFollowingInput,
          FollowUncheckedCreateWithoutFollowingInput
        >
      | FollowCreateWithoutFollowingInput[]
      | FollowUncheckedCreateWithoutFollowingInput[];
    connectOrCreate?:
      | FollowCreateOrConnectWithoutFollowingInput
      | FollowCreateOrConnectWithoutFollowingInput[];
    createMany?: FollowCreateManyFollowingInputEnvelope;
    connect?: FollowWhereUniqueInput | FollowWhereUniqueInput[];
  };

  export type PostCreateNestedManyWithoutAuthorInput = {
    create?:
      | XOR<PostCreateWithoutAuthorInput, PostUncheckedCreateWithoutAuthorInput>
      | PostCreateWithoutAuthorInput[]
      | PostUncheckedCreateWithoutAuthorInput[];
    connectOrCreate?:
      | PostCreateOrConnectWithoutAuthorInput
      | PostCreateOrConnectWithoutAuthorInput[];
    createMany?: PostCreateManyAuthorInputEnvelope;
    connect?: PostWhereUniqueInput | PostWhereUniqueInput[];
  };

  export type LikeCreateNestedManyWithoutAuthorInput = {
    create?:
      | XOR<LikeCreateWithoutAuthorInput, LikeUncheckedCreateWithoutAuthorInput>
      | LikeCreateWithoutAuthorInput[]
      | LikeUncheckedCreateWithoutAuthorInput[];
    connectOrCreate?:
      | LikeCreateOrConnectWithoutAuthorInput
      | LikeCreateOrConnectWithoutAuthorInput[];
    createMany?: LikeCreateManyAuthorInputEnvelope;
    connect?: LikeWhereUniqueInput | LikeWhereUniqueInput[];
  };

  export type CommentCreateNestedManyWithoutAuthorInput = {
    create?:
      | XOR<
          CommentCreateWithoutAuthorInput,
          CommentUncheckedCreateWithoutAuthorInput
        >
      | CommentCreateWithoutAuthorInput[]
      | CommentUncheckedCreateWithoutAuthorInput[];
    connectOrCreate?:
      | CommentCreateOrConnectWithoutAuthorInput
      | CommentCreateOrConnectWithoutAuthorInput[];
    createMany?: CommentCreateManyAuthorInputEnvelope;
    connect?: CommentWhereUniqueInput | CommentWhereUniqueInput[];
  };

  export type ChatCreateNestedManyWithoutMembersInput = {
    create?:
      | XOR<
          ChatCreateWithoutMembersInput,
          ChatUncheckedCreateWithoutMembersInput
        >
      | ChatCreateWithoutMembersInput[]
      | ChatUncheckedCreateWithoutMembersInput[];
    connectOrCreate?:
      | ChatCreateOrConnectWithoutMembersInput
      | ChatCreateOrConnectWithoutMembersInput[];
    connect?: ChatWhereUniqueInput | ChatWhereUniqueInput[];
  };

  export type ChatCreateNestedManyWithoutCreatorInput = {
    create?:
      | XOR<
          ChatCreateWithoutCreatorInput,
          ChatUncheckedCreateWithoutCreatorInput
        >
      | ChatCreateWithoutCreatorInput[]
      | ChatUncheckedCreateWithoutCreatorInput[];
    connectOrCreate?:
      | ChatCreateOrConnectWithoutCreatorInput
      | ChatCreateOrConnectWithoutCreatorInput[];
    createMany?: ChatCreateManyCreatorInputEnvelope;
    connect?: ChatWhereUniqueInput | ChatWhereUniqueInput[];
  };

  export type MessageCreateNestedManyWithoutSenderInput = {
    create?:
      | XOR<
          MessageCreateWithoutSenderInput,
          MessageUncheckedCreateWithoutSenderInput
        >
      | MessageCreateWithoutSenderInput[]
      | MessageUncheckedCreateWithoutSenderInput[];
    connectOrCreate?:
      | MessageCreateOrConnectWithoutSenderInput
      | MessageCreateOrConnectWithoutSenderInput[];
    createMany?: MessageCreateManySenderInputEnvelope;
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[];
  };

  export type NotificationCreateNestedManyWithoutRecipientInput = {
    create?:
      | XOR<
          NotificationCreateWithoutRecipientInput,
          NotificationUncheckedCreateWithoutRecipientInput
        >
      | NotificationCreateWithoutRecipientInput[]
      | NotificationUncheckedCreateWithoutRecipientInput[];
    connectOrCreate?:
      | NotificationCreateOrConnectWithoutRecipientInput
      | NotificationCreateOrConnectWithoutRecipientInput[];
    createMany?: NotificationCreateManyRecipientInputEnvelope;
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[];
  };

  export type NotificationCreateNestedManyWithoutActorInput = {
    create?:
      | XOR<
          NotificationCreateWithoutActorInput,
          NotificationUncheckedCreateWithoutActorInput
        >
      | NotificationCreateWithoutActorInput[]
      | NotificationUncheckedCreateWithoutActorInput[];
    connectOrCreate?:
      | NotificationCreateOrConnectWithoutActorInput
      | NotificationCreateOrConnectWithoutActorInput[];
    createMany?: NotificationCreateManyActorInputEnvelope;
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[];
  };

  export type AccountUncheckedCreateNestedOneWithoutUserInput = {
    create?: XOR<
      AccountCreateWithoutUserInput,
      AccountUncheckedCreateWithoutUserInput
    >;
    connectOrCreate?: AccountCreateOrConnectWithoutUserInput;
    connect?: AccountWhereUniqueInput;
  };

  export type ProfileUncheckedCreateNestedOneWithoutUserInput = {
    create?: XOR<
      ProfileCreateWithoutUserInput,
      ProfileUncheckedCreateWithoutUserInput
    >;
    connectOrCreate?: ProfileCreateOrConnectWithoutUserInput;
    connect?: ProfileWhereUniqueInput;
  };

  export type FollowUncheckedCreateNestedManyWithoutFollowerInput = {
    create?:
      | XOR<
          FollowCreateWithoutFollowerInput,
          FollowUncheckedCreateWithoutFollowerInput
        >
      | FollowCreateWithoutFollowerInput[]
      | FollowUncheckedCreateWithoutFollowerInput[];
    connectOrCreate?:
      | FollowCreateOrConnectWithoutFollowerInput
      | FollowCreateOrConnectWithoutFollowerInput[];
    createMany?: FollowCreateManyFollowerInputEnvelope;
    connect?: FollowWhereUniqueInput | FollowWhereUniqueInput[];
  };

  export type FollowUncheckedCreateNestedManyWithoutFollowingInput = {
    create?:
      | XOR<
          FollowCreateWithoutFollowingInput,
          FollowUncheckedCreateWithoutFollowingInput
        >
      | FollowCreateWithoutFollowingInput[]
      | FollowUncheckedCreateWithoutFollowingInput[];
    connectOrCreate?:
      | FollowCreateOrConnectWithoutFollowingInput
      | FollowCreateOrConnectWithoutFollowingInput[];
    createMany?: FollowCreateManyFollowingInputEnvelope;
    connect?: FollowWhereUniqueInput | FollowWhereUniqueInput[];
  };

  export type PostUncheckedCreateNestedManyWithoutAuthorInput = {
    create?:
      | XOR<PostCreateWithoutAuthorInput, PostUncheckedCreateWithoutAuthorInput>
      | PostCreateWithoutAuthorInput[]
      | PostUncheckedCreateWithoutAuthorInput[];
    connectOrCreate?:
      | PostCreateOrConnectWithoutAuthorInput
      | PostCreateOrConnectWithoutAuthorInput[];
    createMany?: PostCreateManyAuthorInputEnvelope;
    connect?: PostWhereUniqueInput | PostWhereUniqueInput[];
  };

  export type LikeUncheckedCreateNestedManyWithoutAuthorInput = {
    create?:
      | XOR<LikeCreateWithoutAuthorInput, LikeUncheckedCreateWithoutAuthorInput>
      | LikeCreateWithoutAuthorInput[]
      | LikeUncheckedCreateWithoutAuthorInput[];
    connectOrCreate?:
      | LikeCreateOrConnectWithoutAuthorInput
      | LikeCreateOrConnectWithoutAuthorInput[];
    createMany?: LikeCreateManyAuthorInputEnvelope;
    connect?: LikeWhereUniqueInput | LikeWhereUniqueInput[];
  };

  export type CommentUncheckedCreateNestedManyWithoutAuthorInput = {
    create?:
      | XOR<
          CommentCreateWithoutAuthorInput,
          CommentUncheckedCreateWithoutAuthorInput
        >
      | CommentCreateWithoutAuthorInput[]
      | CommentUncheckedCreateWithoutAuthorInput[];
    connectOrCreate?:
      | CommentCreateOrConnectWithoutAuthorInput
      | CommentCreateOrConnectWithoutAuthorInput[];
    createMany?: CommentCreateManyAuthorInputEnvelope;
    connect?: CommentWhereUniqueInput | CommentWhereUniqueInput[];
  };

  export type ChatUncheckedCreateNestedManyWithoutMembersInput = {
    create?:
      | XOR<
          ChatCreateWithoutMembersInput,
          ChatUncheckedCreateWithoutMembersInput
        >
      | ChatCreateWithoutMembersInput[]
      | ChatUncheckedCreateWithoutMembersInput[];
    connectOrCreate?:
      | ChatCreateOrConnectWithoutMembersInput
      | ChatCreateOrConnectWithoutMembersInput[];
    connect?: ChatWhereUniqueInput | ChatWhereUniqueInput[];
  };

  export type ChatUncheckedCreateNestedManyWithoutCreatorInput = {
    create?:
      | XOR<
          ChatCreateWithoutCreatorInput,
          ChatUncheckedCreateWithoutCreatorInput
        >
      | ChatCreateWithoutCreatorInput[]
      | ChatUncheckedCreateWithoutCreatorInput[];
    connectOrCreate?:
      | ChatCreateOrConnectWithoutCreatorInput
      | ChatCreateOrConnectWithoutCreatorInput[];
    createMany?: ChatCreateManyCreatorInputEnvelope;
    connect?: ChatWhereUniqueInput | ChatWhereUniqueInput[];
  };

  export type MessageUncheckedCreateNestedManyWithoutSenderInput = {
    create?:
      | XOR<
          MessageCreateWithoutSenderInput,
          MessageUncheckedCreateWithoutSenderInput
        >
      | MessageCreateWithoutSenderInput[]
      | MessageUncheckedCreateWithoutSenderInput[];
    connectOrCreate?:
      | MessageCreateOrConnectWithoutSenderInput
      | MessageCreateOrConnectWithoutSenderInput[];
    createMany?: MessageCreateManySenderInputEnvelope;
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[];
  };

  export type NotificationUncheckedCreateNestedManyWithoutRecipientInput = {
    create?:
      | XOR<
          NotificationCreateWithoutRecipientInput,
          NotificationUncheckedCreateWithoutRecipientInput
        >
      | NotificationCreateWithoutRecipientInput[]
      | NotificationUncheckedCreateWithoutRecipientInput[];
    connectOrCreate?:
      | NotificationCreateOrConnectWithoutRecipientInput
      | NotificationCreateOrConnectWithoutRecipientInput[];
    createMany?: NotificationCreateManyRecipientInputEnvelope;
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[];
  };

  export type NotificationUncheckedCreateNestedManyWithoutActorInput = {
    create?:
      | XOR<
          NotificationCreateWithoutActorInput,
          NotificationUncheckedCreateWithoutActorInput
        >
      | NotificationCreateWithoutActorInput[]
      | NotificationUncheckedCreateWithoutActorInput[];
    connectOrCreate?:
      | NotificationCreateOrConnectWithoutActorInput
      | NotificationCreateOrConnectWithoutActorInput[];
    createMany?: NotificationCreateManyActorInputEnvelope;
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[];
  };

  export type StringFieldUpdateOperationsInput = {
    set?: string;
  };

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string;
  };

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null;
  };

  export type AccountUpdateOneWithoutUserNestedInput = {
    create?: XOR<
      AccountCreateWithoutUserInput,
      AccountUncheckedCreateWithoutUserInput
    >;
    connectOrCreate?: AccountCreateOrConnectWithoutUserInput;
    upsert?: AccountUpsertWithoutUserInput;
    disconnect?: AccountWhereInput | boolean;
    delete?: AccountWhereInput | boolean;
    connect?: AccountWhereUniqueInput;
    update?: XOR<
      XOR<
        AccountUpdateToOneWithWhereWithoutUserInput,
        AccountUpdateWithoutUserInput
      >,
      AccountUncheckedUpdateWithoutUserInput
    >;
  };

  export type ProfileUpdateOneWithoutUserNestedInput = {
    create?: XOR<
      ProfileCreateWithoutUserInput,
      ProfileUncheckedCreateWithoutUserInput
    >;
    connectOrCreate?: ProfileCreateOrConnectWithoutUserInput;
    upsert?: ProfileUpsertWithoutUserInput;
    disconnect?: ProfileWhereInput | boolean;
    delete?: ProfileWhereInput | boolean;
    connect?: ProfileWhereUniqueInput;
    update?: XOR<
      XOR<
        ProfileUpdateToOneWithWhereWithoutUserInput,
        ProfileUpdateWithoutUserInput
      >,
      ProfileUncheckedUpdateWithoutUserInput
    >;
  };

  export type FollowUpdateManyWithoutFollowerNestedInput = {
    create?:
      | XOR<
          FollowCreateWithoutFollowerInput,
          FollowUncheckedCreateWithoutFollowerInput
        >
      | FollowCreateWithoutFollowerInput[]
      | FollowUncheckedCreateWithoutFollowerInput[];
    connectOrCreate?:
      | FollowCreateOrConnectWithoutFollowerInput
      | FollowCreateOrConnectWithoutFollowerInput[];
    upsert?:
      | FollowUpsertWithWhereUniqueWithoutFollowerInput
      | FollowUpsertWithWhereUniqueWithoutFollowerInput[];
    createMany?: FollowCreateManyFollowerInputEnvelope;
    set?: FollowWhereUniqueInput | FollowWhereUniqueInput[];
    disconnect?: FollowWhereUniqueInput | FollowWhereUniqueInput[];
    delete?: FollowWhereUniqueInput | FollowWhereUniqueInput[];
    connect?: FollowWhereUniqueInput | FollowWhereUniqueInput[];
    update?:
      | FollowUpdateWithWhereUniqueWithoutFollowerInput
      | FollowUpdateWithWhereUniqueWithoutFollowerInput[];
    updateMany?:
      | FollowUpdateManyWithWhereWithoutFollowerInput
      | FollowUpdateManyWithWhereWithoutFollowerInput[];
    deleteMany?: FollowScalarWhereInput | FollowScalarWhereInput[];
  };

  export type FollowUpdateManyWithoutFollowingNestedInput = {
    create?:
      | XOR<
          FollowCreateWithoutFollowingInput,
          FollowUncheckedCreateWithoutFollowingInput
        >
      | FollowCreateWithoutFollowingInput[]
      | FollowUncheckedCreateWithoutFollowingInput[];
    connectOrCreate?:
      | FollowCreateOrConnectWithoutFollowingInput
      | FollowCreateOrConnectWithoutFollowingInput[];
    upsert?:
      | FollowUpsertWithWhereUniqueWithoutFollowingInput
      | FollowUpsertWithWhereUniqueWithoutFollowingInput[];
    createMany?: FollowCreateManyFollowingInputEnvelope;
    set?: FollowWhereUniqueInput | FollowWhereUniqueInput[];
    disconnect?: FollowWhereUniqueInput | FollowWhereUniqueInput[];
    delete?: FollowWhereUniqueInput | FollowWhereUniqueInput[];
    connect?: FollowWhereUniqueInput | FollowWhereUniqueInput[];
    update?:
      | FollowUpdateWithWhereUniqueWithoutFollowingInput
      | FollowUpdateWithWhereUniqueWithoutFollowingInput[];
    updateMany?:
      | FollowUpdateManyWithWhereWithoutFollowingInput
      | FollowUpdateManyWithWhereWithoutFollowingInput[];
    deleteMany?: FollowScalarWhereInput | FollowScalarWhereInput[];
  };

  export type PostUpdateManyWithoutAuthorNestedInput = {
    create?:
      | XOR<PostCreateWithoutAuthorInput, PostUncheckedCreateWithoutAuthorInput>
      | PostCreateWithoutAuthorInput[]
      | PostUncheckedCreateWithoutAuthorInput[];
    connectOrCreate?:
      | PostCreateOrConnectWithoutAuthorInput
      | PostCreateOrConnectWithoutAuthorInput[];
    upsert?:
      | PostUpsertWithWhereUniqueWithoutAuthorInput
      | PostUpsertWithWhereUniqueWithoutAuthorInput[];
    createMany?: PostCreateManyAuthorInputEnvelope;
    set?: PostWhereUniqueInput | PostWhereUniqueInput[];
    disconnect?: PostWhereUniqueInput | PostWhereUniqueInput[];
    delete?: PostWhereUniqueInput | PostWhereUniqueInput[];
    connect?: PostWhereUniqueInput | PostWhereUniqueInput[];
    update?:
      | PostUpdateWithWhereUniqueWithoutAuthorInput
      | PostUpdateWithWhereUniqueWithoutAuthorInput[];
    updateMany?:
      | PostUpdateManyWithWhereWithoutAuthorInput
      | PostUpdateManyWithWhereWithoutAuthorInput[];
    deleteMany?: PostScalarWhereInput | PostScalarWhereInput[];
  };

  export type LikeUpdateManyWithoutAuthorNestedInput = {
    create?:
      | XOR<LikeCreateWithoutAuthorInput, LikeUncheckedCreateWithoutAuthorInput>
      | LikeCreateWithoutAuthorInput[]
      | LikeUncheckedCreateWithoutAuthorInput[];
    connectOrCreate?:
      | LikeCreateOrConnectWithoutAuthorInput
      | LikeCreateOrConnectWithoutAuthorInput[];
    upsert?:
      | LikeUpsertWithWhereUniqueWithoutAuthorInput
      | LikeUpsertWithWhereUniqueWithoutAuthorInput[];
    createMany?: LikeCreateManyAuthorInputEnvelope;
    set?: LikeWhereUniqueInput | LikeWhereUniqueInput[];
    disconnect?: LikeWhereUniqueInput | LikeWhereUniqueInput[];
    delete?: LikeWhereUniqueInput | LikeWhereUniqueInput[];
    connect?: LikeWhereUniqueInput | LikeWhereUniqueInput[];
    update?:
      | LikeUpdateWithWhereUniqueWithoutAuthorInput
      | LikeUpdateWithWhereUniqueWithoutAuthorInput[];
    updateMany?:
      | LikeUpdateManyWithWhereWithoutAuthorInput
      | LikeUpdateManyWithWhereWithoutAuthorInput[];
    deleteMany?: LikeScalarWhereInput | LikeScalarWhereInput[];
  };

  export type CommentUpdateManyWithoutAuthorNestedInput = {
    create?:
      | XOR<
          CommentCreateWithoutAuthorInput,
          CommentUncheckedCreateWithoutAuthorInput
        >
      | CommentCreateWithoutAuthorInput[]
      | CommentUncheckedCreateWithoutAuthorInput[];
    connectOrCreate?:
      | CommentCreateOrConnectWithoutAuthorInput
      | CommentCreateOrConnectWithoutAuthorInput[];
    upsert?:
      | CommentUpsertWithWhereUniqueWithoutAuthorInput
      | CommentUpsertWithWhereUniqueWithoutAuthorInput[];
    createMany?: CommentCreateManyAuthorInputEnvelope;
    set?: CommentWhereUniqueInput | CommentWhereUniqueInput[];
    disconnect?: CommentWhereUniqueInput | CommentWhereUniqueInput[];
    delete?: CommentWhereUniqueInput | CommentWhereUniqueInput[];
    connect?: CommentWhereUniqueInput | CommentWhereUniqueInput[];
    update?:
      | CommentUpdateWithWhereUniqueWithoutAuthorInput
      | CommentUpdateWithWhereUniqueWithoutAuthorInput[];
    updateMany?:
      | CommentUpdateManyWithWhereWithoutAuthorInput
      | CommentUpdateManyWithWhereWithoutAuthorInput[];
    deleteMany?: CommentScalarWhereInput | CommentScalarWhereInput[];
  };

  export type ChatUpdateManyWithoutMembersNestedInput = {
    create?:
      | XOR<
          ChatCreateWithoutMembersInput,
          ChatUncheckedCreateWithoutMembersInput
        >
      | ChatCreateWithoutMembersInput[]
      | ChatUncheckedCreateWithoutMembersInput[];
    connectOrCreate?:
      | ChatCreateOrConnectWithoutMembersInput
      | ChatCreateOrConnectWithoutMembersInput[];
    upsert?:
      | ChatUpsertWithWhereUniqueWithoutMembersInput
      | ChatUpsertWithWhereUniqueWithoutMembersInput[];
    set?: ChatWhereUniqueInput | ChatWhereUniqueInput[];
    disconnect?: ChatWhereUniqueInput | ChatWhereUniqueInput[];
    delete?: ChatWhereUniqueInput | ChatWhereUniqueInput[];
    connect?: ChatWhereUniqueInput | ChatWhereUniqueInput[];
    update?:
      | ChatUpdateWithWhereUniqueWithoutMembersInput
      | ChatUpdateWithWhereUniqueWithoutMembersInput[];
    updateMany?:
      | ChatUpdateManyWithWhereWithoutMembersInput
      | ChatUpdateManyWithWhereWithoutMembersInput[];
    deleteMany?: ChatScalarWhereInput | ChatScalarWhereInput[];
  };

  export type ChatUpdateManyWithoutCreatorNestedInput = {
    create?:
      | XOR<
          ChatCreateWithoutCreatorInput,
          ChatUncheckedCreateWithoutCreatorInput
        >
      | ChatCreateWithoutCreatorInput[]
      | ChatUncheckedCreateWithoutCreatorInput[];
    connectOrCreate?:
      | ChatCreateOrConnectWithoutCreatorInput
      | ChatCreateOrConnectWithoutCreatorInput[];
    upsert?:
      | ChatUpsertWithWhereUniqueWithoutCreatorInput
      | ChatUpsertWithWhereUniqueWithoutCreatorInput[];
    createMany?: ChatCreateManyCreatorInputEnvelope;
    set?: ChatWhereUniqueInput | ChatWhereUniqueInput[];
    disconnect?: ChatWhereUniqueInput | ChatWhereUniqueInput[];
    delete?: ChatWhereUniqueInput | ChatWhereUniqueInput[];
    connect?: ChatWhereUniqueInput | ChatWhereUniqueInput[];
    update?:
      | ChatUpdateWithWhereUniqueWithoutCreatorInput
      | ChatUpdateWithWhereUniqueWithoutCreatorInput[];
    updateMany?:
      | ChatUpdateManyWithWhereWithoutCreatorInput
      | ChatUpdateManyWithWhereWithoutCreatorInput[];
    deleteMany?: ChatScalarWhereInput | ChatScalarWhereInput[];
  };

  export type MessageUpdateManyWithoutSenderNestedInput = {
    create?:
      | XOR<
          MessageCreateWithoutSenderInput,
          MessageUncheckedCreateWithoutSenderInput
        >
      | MessageCreateWithoutSenderInput[]
      | MessageUncheckedCreateWithoutSenderInput[];
    connectOrCreate?:
      | MessageCreateOrConnectWithoutSenderInput
      | MessageCreateOrConnectWithoutSenderInput[];
    upsert?:
      | MessageUpsertWithWhereUniqueWithoutSenderInput
      | MessageUpsertWithWhereUniqueWithoutSenderInput[];
    createMany?: MessageCreateManySenderInputEnvelope;
    set?: MessageWhereUniqueInput | MessageWhereUniqueInput[];
    disconnect?: MessageWhereUniqueInput | MessageWhereUniqueInput[];
    delete?: MessageWhereUniqueInput | MessageWhereUniqueInput[];
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[];
    update?:
      | MessageUpdateWithWhereUniqueWithoutSenderInput
      | MessageUpdateWithWhereUniqueWithoutSenderInput[];
    updateMany?:
      | MessageUpdateManyWithWhereWithoutSenderInput
      | MessageUpdateManyWithWhereWithoutSenderInput[];
    deleteMany?: MessageScalarWhereInput | MessageScalarWhereInput[];
  };

  export type NotificationUpdateManyWithoutRecipientNestedInput = {
    create?:
      | XOR<
          NotificationCreateWithoutRecipientInput,
          NotificationUncheckedCreateWithoutRecipientInput
        >
      | NotificationCreateWithoutRecipientInput[]
      | NotificationUncheckedCreateWithoutRecipientInput[];
    connectOrCreate?:
      | NotificationCreateOrConnectWithoutRecipientInput
      | NotificationCreateOrConnectWithoutRecipientInput[];
    upsert?:
      | NotificationUpsertWithWhereUniqueWithoutRecipientInput
      | NotificationUpsertWithWhereUniqueWithoutRecipientInput[];
    createMany?: NotificationCreateManyRecipientInputEnvelope;
    set?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[];
    disconnect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[];
    delete?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[];
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[];
    update?:
      | NotificationUpdateWithWhereUniqueWithoutRecipientInput
      | NotificationUpdateWithWhereUniqueWithoutRecipientInput[];
    updateMany?:
      | NotificationUpdateManyWithWhereWithoutRecipientInput
      | NotificationUpdateManyWithWhereWithoutRecipientInput[];
    deleteMany?: NotificationScalarWhereInput | NotificationScalarWhereInput[];
  };

  export type NotificationUpdateManyWithoutActorNestedInput = {
    create?:
      | XOR<
          NotificationCreateWithoutActorInput,
          NotificationUncheckedCreateWithoutActorInput
        >
      | NotificationCreateWithoutActorInput[]
      | NotificationUncheckedCreateWithoutActorInput[];
    connectOrCreate?:
      | NotificationCreateOrConnectWithoutActorInput
      | NotificationCreateOrConnectWithoutActorInput[];
    upsert?:
      | NotificationUpsertWithWhereUniqueWithoutActorInput
      | NotificationUpsertWithWhereUniqueWithoutActorInput[];
    createMany?: NotificationCreateManyActorInputEnvelope;
    set?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[];
    disconnect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[];
    delete?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[];
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[];
    update?:
      | NotificationUpdateWithWhereUniqueWithoutActorInput
      | NotificationUpdateWithWhereUniqueWithoutActorInput[];
    updateMany?:
      | NotificationUpdateManyWithWhereWithoutActorInput
      | NotificationUpdateManyWithWhereWithoutActorInput[];
    deleteMany?: NotificationScalarWhereInput | NotificationScalarWhereInput[];
  };

  export type AccountUncheckedUpdateOneWithoutUserNestedInput = {
    create?: XOR<
      AccountCreateWithoutUserInput,
      AccountUncheckedCreateWithoutUserInput
    >;
    connectOrCreate?: AccountCreateOrConnectWithoutUserInput;
    upsert?: AccountUpsertWithoutUserInput;
    disconnect?: AccountWhereInput | boolean;
    delete?: AccountWhereInput | boolean;
    connect?: AccountWhereUniqueInput;
    update?: XOR<
      XOR<
        AccountUpdateToOneWithWhereWithoutUserInput,
        AccountUpdateWithoutUserInput
      >,
      AccountUncheckedUpdateWithoutUserInput
    >;
  };

  export type ProfileUncheckedUpdateOneWithoutUserNestedInput = {
    create?: XOR<
      ProfileCreateWithoutUserInput,
      ProfileUncheckedCreateWithoutUserInput
    >;
    connectOrCreate?: ProfileCreateOrConnectWithoutUserInput;
    upsert?: ProfileUpsertWithoutUserInput;
    disconnect?: ProfileWhereInput | boolean;
    delete?: ProfileWhereInput | boolean;
    connect?: ProfileWhereUniqueInput;
    update?: XOR<
      XOR<
        ProfileUpdateToOneWithWhereWithoutUserInput,
        ProfileUpdateWithoutUserInput
      >,
      ProfileUncheckedUpdateWithoutUserInput
    >;
  };

  export type FollowUncheckedUpdateManyWithoutFollowerNestedInput = {
    create?:
      | XOR<
          FollowCreateWithoutFollowerInput,
          FollowUncheckedCreateWithoutFollowerInput
        >
      | FollowCreateWithoutFollowerInput[]
      | FollowUncheckedCreateWithoutFollowerInput[];
    connectOrCreate?:
      | FollowCreateOrConnectWithoutFollowerInput
      | FollowCreateOrConnectWithoutFollowerInput[];
    upsert?:
      | FollowUpsertWithWhereUniqueWithoutFollowerInput
      | FollowUpsertWithWhereUniqueWithoutFollowerInput[];
    createMany?: FollowCreateManyFollowerInputEnvelope;
    set?: FollowWhereUniqueInput | FollowWhereUniqueInput[];
    disconnect?: FollowWhereUniqueInput | FollowWhereUniqueInput[];
    delete?: FollowWhereUniqueInput | FollowWhereUniqueInput[];
    connect?: FollowWhereUniqueInput | FollowWhereUniqueInput[];
    update?:
      | FollowUpdateWithWhereUniqueWithoutFollowerInput
      | FollowUpdateWithWhereUniqueWithoutFollowerInput[];
    updateMany?:
      | FollowUpdateManyWithWhereWithoutFollowerInput
      | FollowUpdateManyWithWhereWithoutFollowerInput[];
    deleteMany?: FollowScalarWhereInput | FollowScalarWhereInput[];
  };

  export type FollowUncheckedUpdateManyWithoutFollowingNestedInput = {
    create?:
      | XOR<
          FollowCreateWithoutFollowingInput,
          FollowUncheckedCreateWithoutFollowingInput
        >
      | FollowCreateWithoutFollowingInput[]
      | FollowUncheckedCreateWithoutFollowingInput[];
    connectOrCreate?:
      | FollowCreateOrConnectWithoutFollowingInput
      | FollowCreateOrConnectWithoutFollowingInput[];
    upsert?:
      | FollowUpsertWithWhereUniqueWithoutFollowingInput
      | FollowUpsertWithWhereUniqueWithoutFollowingInput[];
    createMany?: FollowCreateManyFollowingInputEnvelope;
    set?: FollowWhereUniqueInput | FollowWhereUniqueInput[];
    disconnect?: FollowWhereUniqueInput | FollowWhereUniqueInput[];
    delete?: FollowWhereUniqueInput | FollowWhereUniqueInput[];
    connect?: FollowWhereUniqueInput | FollowWhereUniqueInput[];
    update?:
      | FollowUpdateWithWhereUniqueWithoutFollowingInput
      | FollowUpdateWithWhereUniqueWithoutFollowingInput[];
    updateMany?:
      | FollowUpdateManyWithWhereWithoutFollowingInput
      | FollowUpdateManyWithWhereWithoutFollowingInput[];
    deleteMany?: FollowScalarWhereInput | FollowScalarWhereInput[];
  };

  export type PostUncheckedUpdateManyWithoutAuthorNestedInput = {
    create?:
      | XOR<PostCreateWithoutAuthorInput, PostUncheckedCreateWithoutAuthorInput>
      | PostCreateWithoutAuthorInput[]
      | PostUncheckedCreateWithoutAuthorInput[];
    connectOrCreate?:
      | PostCreateOrConnectWithoutAuthorInput
      | PostCreateOrConnectWithoutAuthorInput[];
    upsert?:
      | PostUpsertWithWhereUniqueWithoutAuthorInput
      | PostUpsertWithWhereUniqueWithoutAuthorInput[];
    createMany?: PostCreateManyAuthorInputEnvelope;
    set?: PostWhereUniqueInput | PostWhereUniqueInput[];
    disconnect?: PostWhereUniqueInput | PostWhereUniqueInput[];
    delete?: PostWhereUniqueInput | PostWhereUniqueInput[];
    connect?: PostWhereUniqueInput | PostWhereUniqueInput[];
    update?:
      | PostUpdateWithWhereUniqueWithoutAuthorInput
      | PostUpdateWithWhereUniqueWithoutAuthorInput[];
    updateMany?:
      | PostUpdateManyWithWhereWithoutAuthorInput
      | PostUpdateManyWithWhereWithoutAuthorInput[];
    deleteMany?: PostScalarWhereInput | PostScalarWhereInput[];
  };

  export type LikeUncheckedUpdateManyWithoutAuthorNestedInput = {
    create?:
      | XOR<LikeCreateWithoutAuthorInput, LikeUncheckedCreateWithoutAuthorInput>
      | LikeCreateWithoutAuthorInput[]
      | LikeUncheckedCreateWithoutAuthorInput[];
    connectOrCreate?:
      | LikeCreateOrConnectWithoutAuthorInput
      | LikeCreateOrConnectWithoutAuthorInput[];
    upsert?:
      | LikeUpsertWithWhereUniqueWithoutAuthorInput
      | LikeUpsertWithWhereUniqueWithoutAuthorInput[];
    createMany?: LikeCreateManyAuthorInputEnvelope;
    set?: LikeWhereUniqueInput | LikeWhereUniqueInput[];
    disconnect?: LikeWhereUniqueInput | LikeWhereUniqueInput[];
    delete?: LikeWhereUniqueInput | LikeWhereUniqueInput[];
    connect?: LikeWhereUniqueInput | LikeWhereUniqueInput[];
    update?:
      | LikeUpdateWithWhereUniqueWithoutAuthorInput
      | LikeUpdateWithWhereUniqueWithoutAuthorInput[];
    updateMany?:
      | LikeUpdateManyWithWhereWithoutAuthorInput
      | LikeUpdateManyWithWhereWithoutAuthorInput[];
    deleteMany?: LikeScalarWhereInput | LikeScalarWhereInput[];
  };

  export type CommentUncheckedUpdateManyWithoutAuthorNestedInput = {
    create?:
      | XOR<
          CommentCreateWithoutAuthorInput,
          CommentUncheckedCreateWithoutAuthorInput
        >
      | CommentCreateWithoutAuthorInput[]
      | CommentUncheckedCreateWithoutAuthorInput[];
    connectOrCreate?:
      | CommentCreateOrConnectWithoutAuthorInput
      | CommentCreateOrConnectWithoutAuthorInput[];
    upsert?:
      | CommentUpsertWithWhereUniqueWithoutAuthorInput
      | CommentUpsertWithWhereUniqueWithoutAuthorInput[];
    createMany?: CommentCreateManyAuthorInputEnvelope;
    set?: CommentWhereUniqueInput | CommentWhereUniqueInput[];
    disconnect?: CommentWhereUniqueInput | CommentWhereUniqueInput[];
    delete?: CommentWhereUniqueInput | CommentWhereUniqueInput[];
    connect?: CommentWhereUniqueInput | CommentWhereUniqueInput[];
    update?:
      | CommentUpdateWithWhereUniqueWithoutAuthorInput
      | CommentUpdateWithWhereUniqueWithoutAuthorInput[];
    updateMany?:
      | CommentUpdateManyWithWhereWithoutAuthorInput
      | CommentUpdateManyWithWhereWithoutAuthorInput[];
    deleteMany?: CommentScalarWhereInput | CommentScalarWhereInput[];
  };

  export type ChatUncheckedUpdateManyWithoutMembersNestedInput = {
    create?:
      | XOR<
          ChatCreateWithoutMembersInput,
          ChatUncheckedCreateWithoutMembersInput
        >
      | ChatCreateWithoutMembersInput[]
      | ChatUncheckedCreateWithoutMembersInput[];
    connectOrCreate?:
      | ChatCreateOrConnectWithoutMembersInput
      | ChatCreateOrConnectWithoutMembersInput[];
    upsert?:
      | ChatUpsertWithWhereUniqueWithoutMembersInput
      | ChatUpsertWithWhereUniqueWithoutMembersInput[];
    set?: ChatWhereUniqueInput | ChatWhereUniqueInput[];
    disconnect?: ChatWhereUniqueInput | ChatWhereUniqueInput[];
    delete?: ChatWhereUniqueInput | ChatWhereUniqueInput[];
    connect?: ChatWhereUniqueInput | ChatWhereUniqueInput[];
    update?:
      | ChatUpdateWithWhereUniqueWithoutMembersInput
      | ChatUpdateWithWhereUniqueWithoutMembersInput[];
    updateMany?:
      | ChatUpdateManyWithWhereWithoutMembersInput
      | ChatUpdateManyWithWhereWithoutMembersInput[];
    deleteMany?: ChatScalarWhereInput | ChatScalarWhereInput[];
  };

  export type ChatUncheckedUpdateManyWithoutCreatorNestedInput = {
    create?:
      | XOR<
          ChatCreateWithoutCreatorInput,
          ChatUncheckedCreateWithoutCreatorInput
        >
      | ChatCreateWithoutCreatorInput[]
      | ChatUncheckedCreateWithoutCreatorInput[];
    connectOrCreate?:
      | ChatCreateOrConnectWithoutCreatorInput
      | ChatCreateOrConnectWithoutCreatorInput[];
    upsert?:
      | ChatUpsertWithWhereUniqueWithoutCreatorInput
      | ChatUpsertWithWhereUniqueWithoutCreatorInput[];
    createMany?: ChatCreateManyCreatorInputEnvelope;
    set?: ChatWhereUniqueInput | ChatWhereUniqueInput[];
    disconnect?: ChatWhereUniqueInput | ChatWhereUniqueInput[];
    delete?: ChatWhereUniqueInput | ChatWhereUniqueInput[];
    connect?: ChatWhereUniqueInput | ChatWhereUniqueInput[];
    update?:
      | ChatUpdateWithWhereUniqueWithoutCreatorInput
      | ChatUpdateWithWhereUniqueWithoutCreatorInput[];
    updateMany?:
      | ChatUpdateManyWithWhereWithoutCreatorInput
      | ChatUpdateManyWithWhereWithoutCreatorInput[];
    deleteMany?: ChatScalarWhereInput | ChatScalarWhereInput[];
  };

  export type MessageUncheckedUpdateManyWithoutSenderNestedInput = {
    create?:
      | XOR<
          MessageCreateWithoutSenderInput,
          MessageUncheckedCreateWithoutSenderInput
        >
      | MessageCreateWithoutSenderInput[]
      | MessageUncheckedCreateWithoutSenderInput[];
    connectOrCreate?:
      | MessageCreateOrConnectWithoutSenderInput
      | MessageCreateOrConnectWithoutSenderInput[];
    upsert?:
      | MessageUpsertWithWhereUniqueWithoutSenderInput
      | MessageUpsertWithWhereUniqueWithoutSenderInput[];
    createMany?: MessageCreateManySenderInputEnvelope;
    set?: MessageWhereUniqueInput | MessageWhereUniqueInput[];
    disconnect?: MessageWhereUniqueInput | MessageWhereUniqueInput[];
    delete?: MessageWhereUniqueInput | MessageWhereUniqueInput[];
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[];
    update?:
      | MessageUpdateWithWhereUniqueWithoutSenderInput
      | MessageUpdateWithWhereUniqueWithoutSenderInput[];
    updateMany?:
      | MessageUpdateManyWithWhereWithoutSenderInput
      | MessageUpdateManyWithWhereWithoutSenderInput[];
    deleteMany?: MessageScalarWhereInput | MessageScalarWhereInput[];
  };

  export type NotificationUncheckedUpdateManyWithoutRecipientNestedInput = {
    create?:
      | XOR<
          NotificationCreateWithoutRecipientInput,
          NotificationUncheckedCreateWithoutRecipientInput
        >
      | NotificationCreateWithoutRecipientInput[]
      | NotificationUncheckedCreateWithoutRecipientInput[];
    connectOrCreate?:
      | NotificationCreateOrConnectWithoutRecipientInput
      | NotificationCreateOrConnectWithoutRecipientInput[];
    upsert?:
      | NotificationUpsertWithWhereUniqueWithoutRecipientInput
      | NotificationUpsertWithWhereUniqueWithoutRecipientInput[];
    createMany?: NotificationCreateManyRecipientInputEnvelope;
    set?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[];
    disconnect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[];
    delete?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[];
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[];
    update?:
      | NotificationUpdateWithWhereUniqueWithoutRecipientInput
      | NotificationUpdateWithWhereUniqueWithoutRecipientInput[];
    updateMany?:
      | NotificationUpdateManyWithWhereWithoutRecipientInput
      | NotificationUpdateManyWithWhereWithoutRecipientInput[];
    deleteMany?: NotificationScalarWhereInput | NotificationScalarWhereInput[];
  };

  export type NotificationUncheckedUpdateManyWithoutActorNestedInput = {
    create?:
      | XOR<
          NotificationCreateWithoutActorInput,
          NotificationUncheckedCreateWithoutActorInput
        >
      | NotificationCreateWithoutActorInput[]
      | NotificationUncheckedCreateWithoutActorInput[];
    connectOrCreate?:
      | NotificationCreateOrConnectWithoutActorInput
      | NotificationCreateOrConnectWithoutActorInput[];
    upsert?:
      | NotificationUpsertWithWhereUniqueWithoutActorInput
      | NotificationUpsertWithWhereUniqueWithoutActorInput[];
    createMany?: NotificationCreateManyActorInputEnvelope;
    set?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[];
    disconnect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[];
    delete?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[];
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[];
    update?:
      | NotificationUpdateWithWhereUniqueWithoutActorInput
      | NotificationUpdateWithWhereUniqueWithoutActorInput[];
    updateMany?:
      | NotificationUpdateManyWithWhereWithoutActorInput
      | NotificationUpdateManyWithWhereWithoutActorInput[];
    deleteMany?: NotificationScalarWhereInput | NotificationScalarWhereInput[];
  };

  export type UserCreateNestedOneWithoutAccountInput = {
    create?: XOR<
      UserCreateWithoutAccountInput,
      UserUncheckedCreateWithoutAccountInput
    >;
    connectOrCreate?: UserCreateOrConnectWithoutAccountInput;
    connect?: UserWhereUniqueInput;
  };

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null;
  };

  export type UserUpdateOneRequiredWithoutAccountNestedInput = {
    create?: XOR<
      UserCreateWithoutAccountInput,
      UserUncheckedCreateWithoutAccountInput
    >;
    connectOrCreate?: UserCreateOrConnectWithoutAccountInput;
    upsert?: UserUpsertWithoutAccountInput;
    connect?: UserWhereUniqueInput;
    update?: XOR<
      XOR<
        UserUpdateToOneWithWhereWithoutAccountInput,
        UserUpdateWithoutAccountInput
      >,
      UserUncheckedUpdateWithoutAccountInput
    >;
  };

  export type UserCreateNestedOneWithoutProfileInput = {
    create?: XOR<
      UserCreateWithoutProfileInput,
      UserUncheckedCreateWithoutProfileInput
    >;
    connectOrCreate?: UserCreateOrConnectWithoutProfileInput;
    connect?: UserWhereUniqueInput;
  };

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean;
  };

  export type UserUpdateOneRequiredWithoutProfileNestedInput = {
    create?: XOR<
      UserCreateWithoutProfileInput,
      UserUncheckedCreateWithoutProfileInput
    >;
    connectOrCreate?: UserCreateOrConnectWithoutProfileInput;
    upsert?: UserUpsertWithoutProfileInput;
    connect?: UserWhereUniqueInput;
    update?: XOR<
      XOR<
        UserUpdateToOneWithWhereWithoutProfileInput,
        UserUpdateWithoutProfileInput
      >,
      UserUncheckedUpdateWithoutProfileInput
    >;
  };

  export type UserCreateNestedOneWithoutFollowingInput = {
    create?: XOR<
      UserCreateWithoutFollowingInput,
      UserUncheckedCreateWithoutFollowingInput
    >;
    connectOrCreate?: UserCreateOrConnectWithoutFollowingInput;
    connect?: UserWhereUniqueInput;
  };

  export type UserCreateNestedOneWithoutFollowersInput = {
    create?: XOR<
      UserCreateWithoutFollowersInput,
      UserUncheckedCreateWithoutFollowersInput
    >;
    connectOrCreate?: UserCreateOrConnectWithoutFollowersInput;
    connect?: UserWhereUniqueInput;
  };

  export type EnumFollowStatusFieldUpdateOperationsInput = {
    set?: $Enums.FollowStatus;
  };

  export type UserUpdateOneRequiredWithoutFollowingNestedInput = {
    create?: XOR<
      UserCreateWithoutFollowingInput,
      UserUncheckedCreateWithoutFollowingInput
    >;
    connectOrCreate?: UserCreateOrConnectWithoutFollowingInput;
    upsert?: UserUpsertWithoutFollowingInput;
    connect?: UserWhereUniqueInput;
    update?: XOR<
      XOR<
        UserUpdateToOneWithWhereWithoutFollowingInput,
        UserUpdateWithoutFollowingInput
      >,
      UserUncheckedUpdateWithoutFollowingInput
    >;
  };

  export type UserUpdateOneRequiredWithoutFollowersNestedInput = {
    create?: XOR<
      UserCreateWithoutFollowersInput,
      UserUncheckedCreateWithoutFollowersInput
    >;
    connectOrCreate?: UserCreateOrConnectWithoutFollowersInput;
    upsert?: UserUpsertWithoutFollowersInput;
    connect?: UserWhereUniqueInput;
    update?: XOR<
      XOR<
        UserUpdateToOneWithWhereWithoutFollowersInput,
        UserUpdateWithoutFollowersInput
      >,
      UserUncheckedUpdateWithoutFollowersInput
    >;
  };

  export type AssetCreateNestedManyWithoutPostInput = {
    create?:
      | XOR<AssetCreateWithoutPostInput, AssetUncheckedCreateWithoutPostInput>
      | AssetCreateWithoutPostInput[]
      | AssetUncheckedCreateWithoutPostInput[];
    connectOrCreate?:
      | AssetCreateOrConnectWithoutPostInput
      | AssetCreateOrConnectWithoutPostInput[];
    createMany?: AssetCreateManyPostInputEnvelope;
    connect?: AssetWhereUniqueInput | AssetWhereUniqueInput[];
  };

  export type CommentCreateNestedManyWithoutPostInput = {
    create?:
      | XOR<
          CommentCreateWithoutPostInput,
          CommentUncheckedCreateWithoutPostInput
        >
      | CommentCreateWithoutPostInput[]
      | CommentUncheckedCreateWithoutPostInput[];
    connectOrCreate?:
      | CommentCreateOrConnectWithoutPostInput
      | CommentCreateOrConnectWithoutPostInput[];
    createMany?: CommentCreateManyPostInputEnvelope;
    connect?: CommentWhereUniqueInput | CommentWhereUniqueInput[];
  };

  export type LikeCreateNestedManyWithoutPostInput = {
    create?:
      | XOR<LikeCreateWithoutPostInput, LikeUncheckedCreateWithoutPostInput>
      | LikeCreateWithoutPostInput[]
      | LikeUncheckedCreateWithoutPostInput[];
    connectOrCreate?:
      | LikeCreateOrConnectWithoutPostInput
      | LikeCreateOrConnectWithoutPostInput[];
    createMany?: LikeCreateManyPostInputEnvelope;
    connect?: LikeWhereUniqueInput | LikeWhereUniqueInput[];
  };

  export type UserCreateNestedOneWithoutPostsInput = {
    create?: XOR<
      UserCreateWithoutPostsInput,
      UserUncheckedCreateWithoutPostsInput
    >;
    connectOrCreate?: UserCreateOrConnectWithoutPostsInput;
    connect?: UserWhereUniqueInput;
  };

  export type AssetUncheckedCreateNestedManyWithoutPostInput = {
    create?:
      | XOR<AssetCreateWithoutPostInput, AssetUncheckedCreateWithoutPostInput>
      | AssetCreateWithoutPostInput[]
      | AssetUncheckedCreateWithoutPostInput[];
    connectOrCreate?:
      | AssetCreateOrConnectWithoutPostInput
      | AssetCreateOrConnectWithoutPostInput[];
    createMany?: AssetCreateManyPostInputEnvelope;
    connect?: AssetWhereUniqueInput | AssetWhereUniqueInput[];
  };

  export type CommentUncheckedCreateNestedManyWithoutPostInput = {
    create?:
      | XOR<
          CommentCreateWithoutPostInput,
          CommentUncheckedCreateWithoutPostInput
        >
      | CommentCreateWithoutPostInput[]
      | CommentUncheckedCreateWithoutPostInput[];
    connectOrCreate?:
      | CommentCreateOrConnectWithoutPostInput
      | CommentCreateOrConnectWithoutPostInput[];
    createMany?: CommentCreateManyPostInputEnvelope;
    connect?: CommentWhereUniqueInput | CommentWhereUniqueInput[];
  };

  export type LikeUncheckedCreateNestedManyWithoutPostInput = {
    create?:
      | XOR<LikeCreateWithoutPostInput, LikeUncheckedCreateWithoutPostInput>
      | LikeCreateWithoutPostInput[]
      | LikeUncheckedCreateWithoutPostInput[];
    connectOrCreate?:
      | LikeCreateOrConnectWithoutPostInput
      | LikeCreateOrConnectWithoutPostInput[];
    createMany?: LikeCreateManyPostInputEnvelope;
    connect?: LikeWhereUniqueInput | LikeWhereUniqueInput[];
  };

  export type AssetUpdateManyWithoutPostNestedInput = {
    create?:
      | XOR<AssetCreateWithoutPostInput, AssetUncheckedCreateWithoutPostInput>
      | AssetCreateWithoutPostInput[]
      | AssetUncheckedCreateWithoutPostInput[];
    connectOrCreate?:
      | AssetCreateOrConnectWithoutPostInput
      | AssetCreateOrConnectWithoutPostInput[];
    upsert?:
      | AssetUpsertWithWhereUniqueWithoutPostInput
      | AssetUpsertWithWhereUniqueWithoutPostInput[];
    createMany?: AssetCreateManyPostInputEnvelope;
    set?: AssetWhereUniqueInput | AssetWhereUniqueInput[];
    disconnect?: AssetWhereUniqueInput | AssetWhereUniqueInput[];
    delete?: AssetWhereUniqueInput | AssetWhereUniqueInput[];
    connect?: AssetWhereUniqueInput | AssetWhereUniqueInput[];
    update?:
      | AssetUpdateWithWhereUniqueWithoutPostInput
      | AssetUpdateWithWhereUniqueWithoutPostInput[];
    updateMany?:
      | AssetUpdateManyWithWhereWithoutPostInput
      | AssetUpdateManyWithWhereWithoutPostInput[];
    deleteMany?: AssetScalarWhereInput | AssetScalarWhereInput[];
  };

  export type CommentUpdateManyWithoutPostNestedInput = {
    create?:
      | XOR<
          CommentCreateWithoutPostInput,
          CommentUncheckedCreateWithoutPostInput
        >
      | CommentCreateWithoutPostInput[]
      | CommentUncheckedCreateWithoutPostInput[];
    connectOrCreate?:
      | CommentCreateOrConnectWithoutPostInput
      | CommentCreateOrConnectWithoutPostInput[];
    upsert?:
      | CommentUpsertWithWhereUniqueWithoutPostInput
      | CommentUpsertWithWhereUniqueWithoutPostInput[];
    createMany?: CommentCreateManyPostInputEnvelope;
    set?: CommentWhereUniqueInput | CommentWhereUniqueInput[];
    disconnect?: CommentWhereUniqueInput | CommentWhereUniqueInput[];
    delete?: CommentWhereUniqueInput | CommentWhereUniqueInput[];
    connect?: CommentWhereUniqueInput | CommentWhereUniqueInput[];
    update?:
      | CommentUpdateWithWhereUniqueWithoutPostInput
      | CommentUpdateWithWhereUniqueWithoutPostInput[];
    updateMany?:
      | CommentUpdateManyWithWhereWithoutPostInput
      | CommentUpdateManyWithWhereWithoutPostInput[];
    deleteMany?: CommentScalarWhereInput | CommentScalarWhereInput[];
  };

  export type LikeUpdateManyWithoutPostNestedInput = {
    create?:
      | XOR<LikeCreateWithoutPostInput, LikeUncheckedCreateWithoutPostInput>
      | LikeCreateWithoutPostInput[]
      | LikeUncheckedCreateWithoutPostInput[];
    connectOrCreate?:
      | LikeCreateOrConnectWithoutPostInput
      | LikeCreateOrConnectWithoutPostInput[];
    upsert?:
      | LikeUpsertWithWhereUniqueWithoutPostInput
      | LikeUpsertWithWhereUniqueWithoutPostInput[];
    createMany?: LikeCreateManyPostInputEnvelope;
    set?: LikeWhereUniqueInput | LikeWhereUniqueInput[];
    disconnect?: LikeWhereUniqueInput | LikeWhereUniqueInput[];
    delete?: LikeWhereUniqueInput | LikeWhereUniqueInput[];
    connect?: LikeWhereUniqueInput | LikeWhereUniqueInput[];
    update?:
      | LikeUpdateWithWhereUniqueWithoutPostInput
      | LikeUpdateWithWhereUniqueWithoutPostInput[];
    updateMany?:
      | LikeUpdateManyWithWhereWithoutPostInput
      | LikeUpdateManyWithWhereWithoutPostInput[];
    deleteMany?: LikeScalarWhereInput | LikeScalarWhereInput[];
  };

  export type UserUpdateOneRequiredWithoutPostsNestedInput = {
    create?: XOR<
      UserCreateWithoutPostsInput,
      UserUncheckedCreateWithoutPostsInput
    >;
    connectOrCreate?: UserCreateOrConnectWithoutPostsInput;
    upsert?: UserUpsertWithoutPostsInput;
    connect?: UserWhereUniqueInput;
    update?: XOR<
      XOR<
        UserUpdateToOneWithWhereWithoutPostsInput,
        UserUpdateWithoutPostsInput
      >,
      UserUncheckedUpdateWithoutPostsInput
    >;
  };

  export type AssetUncheckedUpdateManyWithoutPostNestedInput = {
    create?:
      | XOR<AssetCreateWithoutPostInput, AssetUncheckedCreateWithoutPostInput>
      | AssetCreateWithoutPostInput[]
      | AssetUncheckedCreateWithoutPostInput[];
    connectOrCreate?:
      | AssetCreateOrConnectWithoutPostInput
      | AssetCreateOrConnectWithoutPostInput[];
    upsert?:
      | AssetUpsertWithWhereUniqueWithoutPostInput
      | AssetUpsertWithWhereUniqueWithoutPostInput[];
    createMany?: AssetCreateManyPostInputEnvelope;
    set?: AssetWhereUniqueInput | AssetWhereUniqueInput[];
    disconnect?: AssetWhereUniqueInput | AssetWhereUniqueInput[];
    delete?: AssetWhereUniqueInput | AssetWhereUniqueInput[];
    connect?: AssetWhereUniqueInput | AssetWhereUniqueInput[];
    update?:
      | AssetUpdateWithWhereUniqueWithoutPostInput
      | AssetUpdateWithWhereUniqueWithoutPostInput[];
    updateMany?:
      | AssetUpdateManyWithWhereWithoutPostInput
      | AssetUpdateManyWithWhereWithoutPostInput[];
    deleteMany?: AssetScalarWhereInput | AssetScalarWhereInput[];
  };

  export type CommentUncheckedUpdateManyWithoutPostNestedInput = {
    create?:
      | XOR<
          CommentCreateWithoutPostInput,
          CommentUncheckedCreateWithoutPostInput
        >
      | CommentCreateWithoutPostInput[]
      | CommentUncheckedCreateWithoutPostInput[];
    connectOrCreate?:
      | CommentCreateOrConnectWithoutPostInput
      | CommentCreateOrConnectWithoutPostInput[];
    upsert?:
      | CommentUpsertWithWhereUniqueWithoutPostInput
      | CommentUpsertWithWhereUniqueWithoutPostInput[];
    createMany?: CommentCreateManyPostInputEnvelope;
    set?: CommentWhereUniqueInput | CommentWhereUniqueInput[];
    disconnect?: CommentWhereUniqueInput | CommentWhereUniqueInput[];
    delete?: CommentWhereUniqueInput | CommentWhereUniqueInput[];
    connect?: CommentWhereUniqueInput | CommentWhereUniqueInput[];
    update?:
      | CommentUpdateWithWhereUniqueWithoutPostInput
      | CommentUpdateWithWhereUniqueWithoutPostInput[];
    updateMany?:
      | CommentUpdateManyWithWhereWithoutPostInput
      | CommentUpdateManyWithWhereWithoutPostInput[];
    deleteMany?: CommentScalarWhereInput | CommentScalarWhereInput[];
  };

  export type LikeUncheckedUpdateManyWithoutPostNestedInput = {
    create?:
      | XOR<LikeCreateWithoutPostInput, LikeUncheckedCreateWithoutPostInput>
      | LikeCreateWithoutPostInput[]
      | LikeUncheckedCreateWithoutPostInput[];
    connectOrCreate?:
      | LikeCreateOrConnectWithoutPostInput
      | LikeCreateOrConnectWithoutPostInput[];
    upsert?:
      | LikeUpsertWithWhereUniqueWithoutPostInput
      | LikeUpsertWithWhereUniqueWithoutPostInput[];
    createMany?: LikeCreateManyPostInputEnvelope;
    set?: LikeWhereUniqueInput | LikeWhereUniqueInput[];
    disconnect?: LikeWhereUniqueInput | LikeWhereUniqueInput[];
    delete?: LikeWhereUniqueInput | LikeWhereUniqueInput[];
    connect?: LikeWhereUniqueInput | LikeWhereUniqueInput[];
    update?:
      | LikeUpdateWithWhereUniqueWithoutPostInput
      | LikeUpdateWithWhereUniqueWithoutPostInput[];
    updateMany?:
      | LikeUpdateManyWithWhereWithoutPostInput
      | LikeUpdateManyWithWhereWithoutPostInput[];
    deleteMany?: LikeScalarWhereInput | LikeScalarWhereInput[];
  };

  export type PostCreateNestedOneWithoutAssetsInput = {
    create?: XOR<
      PostCreateWithoutAssetsInput,
      PostUncheckedCreateWithoutAssetsInput
    >;
    connectOrCreate?: PostCreateOrConnectWithoutAssetsInput;
    connect?: PostWhereUniqueInput;
  };

  export type MessageCreateNestedOneWithoutAssetsInput = {
    create?: XOR<
      MessageCreateWithoutAssetsInput,
      MessageUncheckedCreateWithoutAssetsInput
    >;
    connectOrCreate?: MessageCreateOrConnectWithoutAssetsInput;
    connect?: MessageWhereUniqueInput;
  };

  export type EnumAssetTypeFieldUpdateOperationsInput = {
    set?: $Enums.AssetType;
  };

  export type PostUpdateOneWithoutAssetsNestedInput = {
    create?: XOR<
      PostCreateWithoutAssetsInput,
      PostUncheckedCreateWithoutAssetsInput
    >;
    connectOrCreate?: PostCreateOrConnectWithoutAssetsInput;
    upsert?: PostUpsertWithoutAssetsInput;
    disconnect?: PostWhereInput | boolean;
    delete?: PostWhereInput | boolean;
    connect?: PostWhereUniqueInput;
    update?: XOR<
      XOR<
        PostUpdateToOneWithWhereWithoutAssetsInput,
        PostUpdateWithoutAssetsInput
      >,
      PostUncheckedUpdateWithoutAssetsInput
    >;
  };

  export type MessageUpdateOneWithoutAssetsNestedInput = {
    create?: XOR<
      MessageCreateWithoutAssetsInput,
      MessageUncheckedCreateWithoutAssetsInput
    >;
    connectOrCreate?: MessageCreateOrConnectWithoutAssetsInput;
    upsert?: MessageUpsertWithoutAssetsInput;
    disconnect?: MessageWhereInput | boolean;
    delete?: MessageWhereInput | boolean;
    connect?: MessageWhereUniqueInput;
    update?: XOR<
      XOR<
        MessageUpdateToOneWithWhereWithoutAssetsInput,
        MessageUpdateWithoutAssetsInput
      >,
      MessageUncheckedUpdateWithoutAssetsInput
    >;
  };

  export type CommentCreateNestedOneWithoutChildrenInput = {
    create?: XOR<
      CommentCreateWithoutChildrenInput,
      CommentUncheckedCreateWithoutChildrenInput
    >;
    connectOrCreate?: CommentCreateOrConnectWithoutChildrenInput;
    connect?: CommentWhereUniqueInput;
  };

  export type CommentCreateNestedManyWithoutParentInput = {
    create?:
      | XOR<
          CommentCreateWithoutParentInput,
          CommentUncheckedCreateWithoutParentInput
        >
      | CommentCreateWithoutParentInput[]
      | CommentUncheckedCreateWithoutParentInput[];
    connectOrCreate?:
      | CommentCreateOrConnectWithoutParentInput
      | CommentCreateOrConnectWithoutParentInput[];
    createMany?: CommentCreateManyParentInputEnvelope;
    connect?: CommentWhereUniqueInput | CommentWhereUniqueInput[];
  };

  export type LikeCreateNestedManyWithoutCommentInput = {
    create?:
      | XOR<
          LikeCreateWithoutCommentInput,
          LikeUncheckedCreateWithoutCommentInput
        >
      | LikeCreateWithoutCommentInput[]
      | LikeUncheckedCreateWithoutCommentInput[];
    connectOrCreate?:
      | LikeCreateOrConnectWithoutCommentInput
      | LikeCreateOrConnectWithoutCommentInput[];
    createMany?: LikeCreateManyCommentInputEnvelope;
    connect?: LikeWhereUniqueInput | LikeWhereUniqueInput[];
  };

  export type PostCreateNestedOneWithoutCommentsInput = {
    create?: XOR<
      PostCreateWithoutCommentsInput,
      PostUncheckedCreateWithoutCommentsInput
    >;
    connectOrCreate?: PostCreateOrConnectWithoutCommentsInput;
    connect?: PostWhereUniqueInput;
  };

  export type UserCreateNestedOneWithoutCommentsInput = {
    create?: XOR<
      UserCreateWithoutCommentsInput,
      UserUncheckedCreateWithoutCommentsInput
    >;
    connectOrCreate?: UserCreateOrConnectWithoutCommentsInput;
    connect?: UserWhereUniqueInput;
  };

  export type CommentUncheckedCreateNestedManyWithoutParentInput = {
    create?:
      | XOR<
          CommentCreateWithoutParentInput,
          CommentUncheckedCreateWithoutParentInput
        >
      | CommentCreateWithoutParentInput[]
      | CommentUncheckedCreateWithoutParentInput[];
    connectOrCreate?:
      | CommentCreateOrConnectWithoutParentInput
      | CommentCreateOrConnectWithoutParentInput[];
    createMany?: CommentCreateManyParentInputEnvelope;
    connect?: CommentWhereUniqueInput | CommentWhereUniqueInput[];
  };

  export type LikeUncheckedCreateNestedManyWithoutCommentInput = {
    create?:
      | XOR<
          LikeCreateWithoutCommentInput,
          LikeUncheckedCreateWithoutCommentInput
        >
      | LikeCreateWithoutCommentInput[]
      | LikeUncheckedCreateWithoutCommentInput[];
    connectOrCreate?:
      | LikeCreateOrConnectWithoutCommentInput
      | LikeCreateOrConnectWithoutCommentInput[];
    createMany?: LikeCreateManyCommentInputEnvelope;
    connect?: LikeWhereUniqueInput | LikeWhereUniqueInput[];
  };

  export type CommentUpdateOneWithoutChildrenNestedInput = {
    create?: XOR<
      CommentCreateWithoutChildrenInput,
      CommentUncheckedCreateWithoutChildrenInput
    >;
    connectOrCreate?: CommentCreateOrConnectWithoutChildrenInput;
    upsert?: CommentUpsertWithoutChildrenInput;
    disconnect?: CommentWhereInput | boolean;
    delete?: CommentWhereInput | boolean;
    connect?: CommentWhereUniqueInput;
    update?: XOR<
      XOR<
        CommentUpdateToOneWithWhereWithoutChildrenInput,
        CommentUpdateWithoutChildrenInput
      >,
      CommentUncheckedUpdateWithoutChildrenInput
    >;
  };

  export type CommentUpdateManyWithoutParentNestedInput = {
    create?:
      | XOR<
          CommentCreateWithoutParentInput,
          CommentUncheckedCreateWithoutParentInput
        >
      | CommentCreateWithoutParentInput[]
      | CommentUncheckedCreateWithoutParentInput[];
    connectOrCreate?:
      | CommentCreateOrConnectWithoutParentInput
      | CommentCreateOrConnectWithoutParentInput[];
    upsert?:
      | CommentUpsertWithWhereUniqueWithoutParentInput
      | CommentUpsertWithWhereUniqueWithoutParentInput[];
    createMany?: CommentCreateManyParentInputEnvelope;
    set?: CommentWhereUniqueInput | CommentWhereUniqueInput[];
    disconnect?: CommentWhereUniqueInput | CommentWhereUniqueInput[];
    delete?: CommentWhereUniqueInput | CommentWhereUniqueInput[];
    connect?: CommentWhereUniqueInput | CommentWhereUniqueInput[];
    update?:
      | CommentUpdateWithWhereUniqueWithoutParentInput
      | CommentUpdateWithWhereUniqueWithoutParentInput[];
    updateMany?:
      | CommentUpdateManyWithWhereWithoutParentInput
      | CommentUpdateManyWithWhereWithoutParentInput[];
    deleteMany?: CommentScalarWhereInput | CommentScalarWhereInput[];
  };

  export type LikeUpdateManyWithoutCommentNestedInput = {
    create?:
      | XOR<
          LikeCreateWithoutCommentInput,
          LikeUncheckedCreateWithoutCommentInput
        >
      | LikeCreateWithoutCommentInput[]
      | LikeUncheckedCreateWithoutCommentInput[];
    connectOrCreate?:
      | LikeCreateOrConnectWithoutCommentInput
      | LikeCreateOrConnectWithoutCommentInput[];
    upsert?:
      | LikeUpsertWithWhereUniqueWithoutCommentInput
      | LikeUpsertWithWhereUniqueWithoutCommentInput[];
    createMany?: LikeCreateManyCommentInputEnvelope;
    set?: LikeWhereUniqueInput | LikeWhereUniqueInput[];
    disconnect?: LikeWhereUniqueInput | LikeWhereUniqueInput[];
    delete?: LikeWhereUniqueInput | LikeWhereUniqueInput[];
    connect?: LikeWhereUniqueInput | LikeWhereUniqueInput[];
    update?:
      | LikeUpdateWithWhereUniqueWithoutCommentInput
      | LikeUpdateWithWhereUniqueWithoutCommentInput[];
    updateMany?:
      | LikeUpdateManyWithWhereWithoutCommentInput
      | LikeUpdateManyWithWhereWithoutCommentInput[];
    deleteMany?: LikeScalarWhereInput | LikeScalarWhereInput[];
  };

  export type PostUpdateOneRequiredWithoutCommentsNestedInput = {
    create?: XOR<
      PostCreateWithoutCommentsInput,
      PostUncheckedCreateWithoutCommentsInput
    >;
    connectOrCreate?: PostCreateOrConnectWithoutCommentsInput;
    upsert?: PostUpsertWithoutCommentsInput;
    connect?: PostWhereUniqueInput;
    update?: XOR<
      XOR<
        PostUpdateToOneWithWhereWithoutCommentsInput,
        PostUpdateWithoutCommentsInput
      >,
      PostUncheckedUpdateWithoutCommentsInput
    >;
  };

  export type UserUpdateOneRequiredWithoutCommentsNestedInput = {
    create?: XOR<
      UserCreateWithoutCommentsInput,
      UserUncheckedCreateWithoutCommentsInput
    >;
    connectOrCreate?: UserCreateOrConnectWithoutCommentsInput;
    upsert?: UserUpsertWithoutCommentsInput;
    connect?: UserWhereUniqueInput;
    update?: XOR<
      XOR<
        UserUpdateToOneWithWhereWithoutCommentsInput,
        UserUpdateWithoutCommentsInput
      >,
      UserUncheckedUpdateWithoutCommentsInput
    >;
  };

  export type CommentUncheckedUpdateManyWithoutParentNestedInput = {
    create?:
      | XOR<
          CommentCreateWithoutParentInput,
          CommentUncheckedCreateWithoutParentInput
        >
      | CommentCreateWithoutParentInput[]
      | CommentUncheckedCreateWithoutParentInput[];
    connectOrCreate?:
      | CommentCreateOrConnectWithoutParentInput
      | CommentCreateOrConnectWithoutParentInput[];
    upsert?:
      | CommentUpsertWithWhereUniqueWithoutParentInput
      | CommentUpsertWithWhereUniqueWithoutParentInput[];
    createMany?: CommentCreateManyParentInputEnvelope;
    set?: CommentWhereUniqueInput | CommentWhereUniqueInput[];
    disconnect?: CommentWhereUniqueInput | CommentWhereUniqueInput[];
    delete?: CommentWhereUniqueInput | CommentWhereUniqueInput[];
    connect?: CommentWhereUniqueInput | CommentWhereUniqueInput[];
    update?:
      | CommentUpdateWithWhereUniqueWithoutParentInput
      | CommentUpdateWithWhereUniqueWithoutParentInput[];
    updateMany?:
      | CommentUpdateManyWithWhereWithoutParentInput
      | CommentUpdateManyWithWhereWithoutParentInput[];
    deleteMany?: CommentScalarWhereInput | CommentScalarWhereInput[];
  };

  export type LikeUncheckedUpdateManyWithoutCommentNestedInput = {
    create?:
      | XOR<
          LikeCreateWithoutCommentInput,
          LikeUncheckedCreateWithoutCommentInput
        >
      | LikeCreateWithoutCommentInput[]
      | LikeUncheckedCreateWithoutCommentInput[];
    connectOrCreate?:
      | LikeCreateOrConnectWithoutCommentInput
      | LikeCreateOrConnectWithoutCommentInput[];
    upsert?:
      | LikeUpsertWithWhereUniqueWithoutCommentInput
      | LikeUpsertWithWhereUniqueWithoutCommentInput[];
    createMany?: LikeCreateManyCommentInputEnvelope;
    set?: LikeWhereUniqueInput | LikeWhereUniqueInput[];
    disconnect?: LikeWhereUniqueInput | LikeWhereUniqueInput[];
    delete?: LikeWhereUniqueInput | LikeWhereUniqueInput[];
    connect?: LikeWhereUniqueInput | LikeWhereUniqueInput[];
    update?:
      | LikeUpdateWithWhereUniqueWithoutCommentInput
      | LikeUpdateWithWhereUniqueWithoutCommentInput[];
    updateMany?:
      | LikeUpdateManyWithWhereWithoutCommentInput
      | LikeUpdateManyWithWhereWithoutCommentInput[];
    deleteMany?: LikeScalarWhereInput | LikeScalarWhereInput[];
  };

  export type PostCreateNestedOneWithoutLikesInput = {
    create?: XOR<
      PostCreateWithoutLikesInput,
      PostUncheckedCreateWithoutLikesInput
    >;
    connectOrCreate?: PostCreateOrConnectWithoutLikesInput;
    connect?: PostWhereUniqueInput;
  };

  export type CommentCreateNestedOneWithoutLikesInput = {
    create?: XOR<
      CommentCreateWithoutLikesInput,
      CommentUncheckedCreateWithoutLikesInput
    >;
    connectOrCreate?: CommentCreateOrConnectWithoutLikesInput;
    connect?: CommentWhereUniqueInput;
  };

  export type UserCreateNestedOneWithoutLikesInput = {
    create?: XOR<
      UserCreateWithoutLikesInput,
      UserUncheckedCreateWithoutLikesInput
    >;
    connectOrCreate?: UserCreateOrConnectWithoutLikesInput;
    connect?: UserWhereUniqueInput;
  };

  export type PostUpdateOneWithoutLikesNestedInput = {
    create?: XOR<
      PostCreateWithoutLikesInput,
      PostUncheckedCreateWithoutLikesInput
    >;
    connectOrCreate?: PostCreateOrConnectWithoutLikesInput;
    upsert?: PostUpsertWithoutLikesInput;
    disconnect?: PostWhereInput | boolean;
    delete?: PostWhereInput | boolean;
    connect?: PostWhereUniqueInput;
    update?: XOR<
      XOR<
        PostUpdateToOneWithWhereWithoutLikesInput,
        PostUpdateWithoutLikesInput
      >,
      PostUncheckedUpdateWithoutLikesInput
    >;
  };

  export type CommentUpdateOneWithoutLikesNestedInput = {
    create?: XOR<
      CommentCreateWithoutLikesInput,
      CommentUncheckedCreateWithoutLikesInput
    >;
    connectOrCreate?: CommentCreateOrConnectWithoutLikesInput;
    upsert?: CommentUpsertWithoutLikesInput;
    disconnect?: CommentWhereInput | boolean;
    delete?: CommentWhereInput | boolean;
    connect?: CommentWhereUniqueInput;
    update?: XOR<
      XOR<
        CommentUpdateToOneWithWhereWithoutLikesInput,
        CommentUpdateWithoutLikesInput
      >,
      CommentUncheckedUpdateWithoutLikesInput
    >;
  };

  export type UserUpdateOneRequiredWithoutLikesNestedInput = {
    create?: XOR<
      UserCreateWithoutLikesInput,
      UserUncheckedCreateWithoutLikesInput
    >;
    connectOrCreate?: UserCreateOrConnectWithoutLikesInput;
    upsert?: UserUpsertWithoutLikesInput;
    connect?: UserWhereUniqueInput;
    update?: XOR<
      XOR<
        UserUpdateToOneWithWhereWithoutLikesInput,
        UserUpdateWithoutLikesInput
      >,
      UserUncheckedUpdateWithoutLikesInput
    >;
  };

  export type UserCreateNestedOneWithoutCreatedChatsInput = {
    create?: XOR<
      UserCreateWithoutCreatedChatsInput,
      UserUncheckedCreateWithoutCreatedChatsInput
    >;
    connectOrCreate?: UserCreateOrConnectWithoutCreatedChatsInput;
    connect?: UserWhereUniqueInput;
  };

  export type UserCreateNestedManyWithoutChatsInput = {
    create?:
      | XOR<UserCreateWithoutChatsInput, UserUncheckedCreateWithoutChatsInput>
      | UserCreateWithoutChatsInput[]
      | UserUncheckedCreateWithoutChatsInput[];
    connectOrCreate?:
      | UserCreateOrConnectWithoutChatsInput
      | UserCreateOrConnectWithoutChatsInput[];
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[];
  };

  export type MessageCreateNestedManyWithoutChatInput = {
    create?:
      | XOR<
          MessageCreateWithoutChatInput,
          MessageUncheckedCreateWithoutChatInput
        >
      | MessageCreateWithoutChatInput[]
      | MessageUncheckedCreateWithoutChatInput[];
    connectOrCreate?:
      | MessageCreateOrConnectWithoutChatInput
      | MessageCreateOrConnectWithoutChatInput[];
    createMany?: MessageCreateManyChatInputEnvelope;
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[];
  };

  export type UserUncheckedCreateNestedManyWithoutChatsInput = {
    create?:
      | XOR<UserCreateWithoutChatsInput, UserUncheckedCreateWithoutChatsInput>
      | UserCreateWithoutChatsInput[]
      | UserUncheckedCreateWithoutChatsInput[];
    connectOrCreate?:
      | UserCreateOrConnectWithoutChatsInput
      | UserCreateOrConnectWithoutChatsInput[];
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[];
  };

  export type MessageUncheckedCreateNestedManyWithoutChatInput = {
    create?:
      | XOR<
          MessageCreateWithoutChatInput,
          MessageUncheckedCreateWithoutChatInput
        >
      | MessageCreateWithoutChatInput[]
      | MessageUncheckedCreateWithoutChatInput[];
    connectOrCreate?:
      | MessageCreateOrConnectWithoutChatInput
      | MessageCreateOrConnectWithoutChatInput[];
    createMany?: MessageCreateManyChatInputEnvelope;
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[];
  };

  export type EnumChatTypeFieldUpdateOperationsInput = {
    set?: $Enums.ChatType;
  };

  export type UserUpdateOneWithoutCreatedChatsNestedInput = {
    create?: XOR<
      UserCreateWithoutCreatedChatsInput,
      UserUncheckedCreateWithoutCreatedChatsInput
    >;
    connectOrCreate?: UserCreateOrConnectWithoutCreatedChatsInput;
    upsert?: UserUpsertWithoutCreatedChatsInput;
    disconnect?: UserWhereInput | boolean;
    delete?: UserWhereInput | boolean;
    connect?: UserWhereUniqueInput;
    update?: XOR<
      XOR<
        UserUpdateToOneWithWhereWithoutCreatedChatsInput,
        UserUpdateWithoutCreatedChatsInput
      >,
      UserUncheckedUpdateWithoutCreatedChatsInput
    >;
  };

  export type UserUpdateManyWithoutChatsNestedInput = {
    create?:
      | XOR<UserCreateWithoutChatsInput, UserUncheckedCreateWithoutChatsInput>
      | UserCreateWithoutChatsInput[]
      | UserUncheckedCreateWithoutChatsInput[];
    connectOrCreate?:
      | UserCreateOrConnectWithoutChatsInput
      | UserCreateOrConnectWithoutChatsInput[];
    upsert?:
      | UserUpsertWithWhereUniqueWithoutChatsInput
      | UserUpsertWithWhereUniqueWithoutChatsInput[];
    set?: UserWhereUniqueInput | UserWhereUniqueInput[];
    disconnect?: UserWhereUniqueInput | UserWhereUniqueInput[];
    delete?: UserWhereUniqueInput | UserWhereUniqueInput[];
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[];
    update?:
      | UserUpdateWithWhereUniqueWithoutChatsInput
      | UserUpdateWithWhereUniqueWithoutChatsInput[];
    updateMany?:
      | UserUpdateManyWithWhereWithoutChatsInput
      | UserUpdateManyWithWhereWithoutChatsInput[];
    deleteMany?: UserScalarWhereInput | UserScalarWhereInput[];
  };

  export type MessageUpdateManyWithoutChatNestedInput = {
    create?:
      | XOR<
          MessageCreateWithoutChatInput,
          MessageUncheckedCreateWithoutChatInput
        >
      | MessageCreateWithoutChatInput[]
      | MessageUncheckedCreateWithoutChatInput[];
    connectOrCreate?:
      | MessageCreateOrConnectWithoutChatInput
      | MessageCreateOrConnectWithoutChatInput[];
    upsert?:
      | MessageUpsertWithWhereUniqueWithoutChatInput
      | MessageUpsertWithWhereUniqueWithoutChatInput[];
    createMany?: MessageCreateManyChatInputEnvelope;
    set?: MessageWhereUniqueInput | MessageWhereUniqueInput[];
    disconnect?: MessageWhereUniqueInput | MessageWhereUniqueInput[];
    delete?: MessageWhereUniqueInput | MessageWhereUniqueInput[];
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[];
    update?:
      | MessageUpdateWithWhereUniqueWithoutChatInput
      | MessageUpdateWithWhereUniqueWithoutChatInput[];
    updateMany?:
      | MessageUpdateManyWithWhereWithoutChatInput
      | MessageUpdateManyWithWhereWithoutChatInput[];
    deleteMany?: MessageScalarWhereInput | MessageScalarWhereInput[];
  };

  export type UserUncheckedUpdateManyWithoutChatsNestedInput = {
    create?:
      | XOR<UserCreateWithoutChatsInput, UserUncheckedCreateWithoutChatsInput>
      | UserCreateWithoutChatsInput[]
      | UserUncheckedCreateWithoutChatsInput[];
    connectOrCreate?:
      | UserCreateOrConnectWithoutChatsInput
      | UserCreateOrConnectWithoutChatsInput[];
    upsert?:
      | UserUpsertWithWhereUniqueWithoutChatsInput
      | UserUpsertWithWhereUniqueWithoutChatsInput[];
    set?: UserWhereUniqueInput | UserWhereUniqueInput[];
    disconnect?: UserWhereUniqueInput | UserWhereUniqueInput[];
    delete?: UserWhereUniqueInput | UserWhereUniqueInput[];
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[];
    update?:
      | UserUpdateWithWhereUniqueWithoutChatsInput
      | UserUpdateWithWhereUniqueWithoutChatsInput[];
    updateMany?:
      | UserUpdateManyWithWhereWithoutChatsInput
      | UserUpdateManyWithWhereWithoutChatsInput[];
    deleteMany?: UserScalarWhereInput | UserScalarWhereInput[];
  };

  export type MessageUncheckedUpdateManyWithoutChatNestedInput = {
    create?:
      | XOR<
          MessageCreateWithoutChatInput,
          MessageUncheckedCreateWithoutChatInput
        >
      | MessageCreateWithoutChatInput[]
      | MessageUncheckedCreateWithoutChatInput[];
    connectOrCreate?:
      | MessageCreateOrConnectWithoutChatInput
      | MessageCreateOrConnectWithoutChatInput[];
    upsert?:
      | MessageUpsertWithWhereUniqueWithoutChatInput
      | MessageUpsertWithWhereUniqueWithoutChatInput[];
    createMany?: MessageCreateManyChatInputEnvelope;
    set?: MessageWhereUniqueInput | MessageWhereUniqueInput[];
    disconnect?: MessageWhereUniqueInput | MessageWhereUniqueInput[];
    delete?: MessageWhereUniqueInput | MessageWhereUniqueInput[];
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[];
    update?:
      | MessageUpdateWithWhereUniqueWithoutChatInput
      | MessageUpdateWithWhereUniqueWithoutChatInput[];
    updateMany?:
      | MessageUpdateManyWithWhereWithoutChatInput
      | MessageUpdateManyWithWhereWithoutChatInput[];
    deleteMany?: MessageScalarWhereInput | MessageScalarWhereInput[];
  };

  export type AssetCreateNestedManyWithoutMessageInput = {
    create?:
      | XOR<
          AssetCreateWithoutMessageInput,
          AssetUncheckedCreateWithoutMessageInput
        >
      | AssetCreateWithoutMessageInput[]
      | AssetUncheckedCreateWithoutMessageInput[];
    connectOrCreate?:
      | AssetCreateOrConnectWithoutMessageInput
      | AssetCreateOrConnectWithoutMessageInput[];
    createMany?: AssetCreateManyMessageInputEnvelope;
    connect?: AssetWhereUniqueInput | AssetWhereUniqueInput[];
  };

  export type ChatCreateNestedOneWithoutMessagesInput = {
    create?: XOR<
      ChatCreateWithoutMessagesInput,
      ChatUncheckedCreateWithoutMessagesInput
    >;
    connectOrCreate?: ChatCreateOrConnectWithoutMessagesInput;
    connect?: ChatWhereUniqueInput;
  };

  export type UserCreateNestedOneWithoutSentMessagesInput = {
    create?: XOR<
      UserCreateWithoutSentMessagesInput,
      UserUncheckedCreateWithoutSentMessagesInput
    >;
    connectOrCreate?: UserCreateOrConnectWithoutSentMessagesInput;
    connect?: UserWhereUniqueInput;
  };

  export type AssetUncheckedCreateNestedManyWithoutMessageInput = {
    create?:
      | XOR<
          AssetCreateWithoutMessageInput,
          AssetUncheckedCreateWithoutMessageInput
        >
      | AssetCreateWithoutMessageInput[]
      | AssetUncheckedCreateWithoutMessageInput[];
    connectOrCreate?:
      | AssetCreateOrConnectWithoutMessageInput
      | AssetCreateOrConnectWithoutMessageInput[];
    createMany?: AssetCreateManyMessageInputEnvelope;
    connect?: AssetWhereUniqueInput | AssetWhereUniqueInput[];
  };

  export type AssetUpdateManyWithoutMessageNestedInput = {
    create?:
      | XOR<
          AssetCreateWithoutMessageInput,
          AssetUncheckedCreateWithoutMessageInput
        >
      | AssetCreateWithoutMessageInput[]
      | AssetUncheckedCreateWithoutMessageInput[];
    connectOrCreate?:
      | AssetCreateOrConnectWithoutMessageInput
      | AssetCreateOrConnectWithoutMessageInput[];
    upsert?:
      | AssetUpsertWithWhereUniqueWithoutMessageInput
      | AssetUpsertWithWhereUniqueWithoutMessageInput[];
    createMany?: AssetCreateManyMessageInputEnvelope;
    set?: AssetWhereUniqueInput | AssetWhereUniqueInput[];
    disconnect?: AssetWhereUniqueInput | AssetWhereUniqueInput[];
    delete?: AssetWhereUniqueInput | AssetWhereUniqueInput[];
    connect?: AssetWhereUniqueInput | AssetWhereUniqueInput[];
    update?:
      | AssetUpdateWithWhereUniqueWithoutMessageInput
      | AssetUpdateWithWhereUniqueWithoutMessageInput[];
    updateMany?:
      | AssetUpdateManyWithWhereWithoutMessageInput
      | AssetUpdateManyWithWhereWithoutMessageInput[];
    deleteMany?: AssetScalarWhereInput | AssetScalarWhereInput[];
  };

  export type ChatUpdateOneRequiredWithoutMessagesNestedInput = {
    create?: XOR<
      ChatCreateWithoutMessagesInput,
      ChatUncheckedCreateWithoutMessagesInput
    >;
    connectOrCreate?: ChatCreateOrConnectWithoutMessagesInput;
    upsert?: ChatUpsertWithoutMessagesInput;
    connect?: ChatWhereUniqueInput;
    update?: XOR<
      XOR<
        ChatUpdateToOneWithWhereWithoutMessagesInput,
        ChatUpdateWithoutMessagesInput
      >,
      ChatUncheckedUpdateWithoutMessagesInput
    >;
  };

  export type UserUpdateOneRequiredWithoutSentMessagesNestedInput = {
    create?: XOR<
      UserCreateWithoutSentMessagesInput,
      UserUncheckedCreateWithoutSentMessagesInput
    >;
    connectOrCreate?: UserCreateOrConnectWithoutSentMessagesInput;
    upsert?: UserUpsertWithoutSentMessagesInput;
    connect?: UserWhereUniqueInput;
    update?: XOR<
      XOR<
        UserUpdateToOneWithWhereWithoutSentMessagesInput,
        UserUpdateWithoutSentMessagesInput
      >,
      UserUncheckedUpdateWithoutSentMessagesInput
    >;
  };

  export type AssetUncheckedUpdateManyWithoutMessageNestedInput = {
    create?:
      | XOR<
          AssetCreateWithoutMessageInput,
          AssetUncheckedCreateWithoutMessageInput
        >
      | AssetCreateWithoutMessageInput[]
      | AssetUncheckedCreateWithoutMessageInput[];
    connectOrCreate?:
      | AssetCreateOrConnectWithoutMessageInput
      | AssetCreateOrConnectWithoutMessageInput[];
    upsert?:
      | AssetUpsertWithWhereUniqueWithoutMessageInput
      | AssetUpsertWithWhereUniqueWithoutMessageInput[];
    createMany?: AssetCreateManyMessageInputEnvelope;
    set?: AssetWhereUniqueInput | AssetWhereUniqueInput[];
    disconnect?: AssetWhereUniqueInput | AssetWhereUniqueInput[];
    delete?: AssetWhereUniqueInput | AssetWhereUniqueInput[];
    connect?: AssetWhereUniqueInput | AssetWhereUniqueInput[];
    update?:
      | AssetUpdateWithWhereUniqueWithoutMessageInput
      | AssetUpdateWithWhereUniqueWithoutMessageInput[];
    updateMany?:
      | AssetUpdateManyWithWhereWithoutMessageInput
      | AssetUpdateManyWithWhereWithoutMessageInput[];
    deleteMany?: AssetScalarWhereInput | AssetScalarWhereInput[];
  };

  export type UserCreateNestedOneWithoutRecievedNotificationsInput = {
    create?: XOR<
      UserCreateWithoutRecievedNotificationsInput,
      UserUncheckedCreateWithoutRecievedNotificationsInput
    >;
    connectOrCreate?: UserCreateOrConnectWithoutRecievedNotificationsInput;
    connect?: UserWhereUniqueInput;
  };

  export type UserCreateNestedOneWithoutTriggeredNotificationsInput = {
    create?: XOR<
      UserCreateWithoutTriggeredNotificationsInput,
      UserUncheckedCreateWithoutTriggeredNotificationsInput
    >;
    connectOrCreate?: UserCreateOrConnectWithoutTriggeredNotificationsInput;
    connect?: UserWhereUniqueInput;
  };

  export type EnumNotificationTypeFieldUpdateOperationsInput = {
    set?: $Enums.NotificationType;
  };

  export type UserUpdateOneRequiredWithoutRecievedNotificationsNestedInput = {
    create?: XOR<
      UserCreateWithoutRecievedNotificationsInput,
      UserUncheckedCreateWithoutRecievedNotificationsInput
    >;
    connectOrCreate?: UserCreateOrConnectWithoutRecievedNotificationsInput;
    upsert?: UserUpsertWithoutRecievedNotificationsInput;
    connect?: UserWhereUniqueInput;
    update?: XOR<
      XOR<
        UserUpdateToOneWithWhereWithoutRecievedNotificationsInput,
        UserUpdateWithoutRecievedNotificationsInput
      >,
      UserUncheckedUpdateWithoutRecievedNotificationsInput
    >;
  };

  export type UserUpdateOneRequiredWithoutTriggeredNotificationsNestedInput = {
    create?: XOR<
      UserCreateWithoutTriggeredNotificationsInput,
      UserUncheckedCreateWithoutTriggeredNotificationsInput
    >;
    connectOrCreate?: UserCreateOrConnectWithoutTriggeredNotificationsInput;
    upsert?: UserUpsertWithoutTriggeredNotificationsInput;
    connect?: UserWhereUniqueInput;
    update?: XOR<
      XOR<
        UserUpdateToOneWithWhereWithoutTriggeredNotificationsInput,
        UserUpdateWithoutTriggeredNotificationsInput
      >,
      UserUncheckedUpdateWithoutTriggeredNotificationsInput
    >;
  };

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>;
    in?: string[] | ListStringFieldRefInput<$PrismaModel>;
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>;
    lt?: string | StringFieldRefInput<$PrismaModel>;
    lte?: string | StringFieldRefInput<$PrismaModel>;
    gt?: string | StringFieldRefInput<$PrismaModel>;
    gte?: string | StringFieldRefInput<$PrismaModel>;
    contains?: string | StringFieldRefInput<$PrismaModel>;
    startsWith?: string | StringFieldRefInput<$PrismaModel>;
    endsWith?: string | StringFieldRefInput<$PrismaModel>;
    not?: NestedStringFilter<$PrismaModel> | string;
  };

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string;
  };

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null;
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null;
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null;
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null;
  };

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>;
    in?: string[] | ListStringFieldRefInput<$PrismaModel>;
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>;
    lt?: string | StringFieldRefInput<$PrismaModel>;
    lte?: string | StringFieldRefInput<$PrismaModel>;
    gt?: string | StringFieldRefInput<$PrismaModel>;
    gte?: string | StringFieldRefInput<$PrismaModel>;
    contains?: string | StringFieldRefInput<$PrismaModel>;
    startsWith?: string | StringFieldRefInput<$PrismaModel>;
    endsWith?: string | StringFieldRefInput<$PrismaModel>;
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedStringFilter<$PrismaModel>;
    _max?: NestedStringFilter<$PrismaModel>;
  };

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>;
    in?: number[] | ListIntFieldRefInput<$PrismaModel>;
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>;
    lt?: number | IntFieldRefInput<$PrismaModel>;
    lte?: number | IntFieldRefInput<$PrismaModel>;
    gt?: number | IntFieldRefInput<$PrismaModel>;
    gte?: number | IntFieldRefInput<$PrismaModel>;
    not?: NestedIntFilter<$PrismaModel> | number;
  };

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedDateTimeFilter<$PrismaModel>;
    _max?: NestedDateTimeFilter<$PrismaModel>;
  };

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> =
    {
      equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null;
      in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null;
      notIn?:
        | Date[]
        | string[]
        | ListDateTimeFieldRefInput<$PrismaModel>
        | null;
      lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
      lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
      gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
      gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
      not?:
        | NestedDateTimeNullableWithAggregatesFilter<$PrismaModel>
        | Date
        | string
        | null;
      _count?: NestedIntNullableFilter<$PrismaModel>;
      _min?: NestedDateTimeNullableFilter<$PrismaModel>;
      _max?: NestedDateTimeNullableFilter<$PrismaModel>;
    };

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null;
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null;
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null;
    lt?: number | IntFieldRefInput<$PrismaModel>;
    lte?: number | IntFieldRefInput<$PrismaModel>;
    gt?: number | IntFieldRefInput<$PrismaModel>;
    gte?: number | IntFieldRefInput<$PrismaModel>;
    not?: NestedIntNullableFilter<$PrismaModel> | number | null;
  };

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null;
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
    lt?: string | StringFieldRefInput<$PrismaModel>;
    lte?: string | StringFieldRefInput<$PrismaModel>;
    gt?: string | StringFieldRefInput<$PrismaModel>;
    gte?: string | StringFieldRefInput<$PrismaModel>;
    contains?: string | StringFieldRefInput<$PrismaModel>;
    startsWith?: string | StringFieldRefInput<$PrismaModel>;
    endsWith?: string | StringFieldRefInput<$PrismaModel>;
    not?: NestedStringNullableFilter<$PrismaModel> | string | null;
  };

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null;
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
    lt?: string | StringFieldRefInput<$PrismaModel>;
    lte?: string | StringFieldRefInput<$PrismaModel>;
    gt?: string | StringFieldRefInput<$PrismaModel>;
    gte?: string | StringFieldRefInput<$PrismaModel>;
    contains?: string | StringFieldRefInput<$PrismaModel>;
    startsWith?: string | StringFieldRefInput<$PrismaModel>;
    endsWith?: string | StringFieldRefInput<$PrismaModel>;
    not?:
      | NestedStringNullableWithAggregatesFilter<$PrismaModel>
      | string
      | null;
    _count?: NestedIntNullableFilter<$PrismaModel>;
    _min?: NestedStringNullableFilter<$PrismaModel>;
    _max?: NestedStringNullableFilter<$PrismaModel>;
  };

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>;
    not?: NestedBoolFilter<$PrismaModel> | boolean;
  };

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>;
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedBoolFilter<$PrismaModel>;
    _max?: NestedBoolFilter<$PrismaModel>;
  };

  export type NestedEnumFollowStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.FollowStatus | EnumFollowStatusFieldRefInput<$PrismaModel>;
    in?:
      | $Enums.FollowStatus[]
      | ListEnumFollowStatusFieldRefInput<$PrismaModel>;
    notIn?:
      | $Enums.FollowStatus[]
      | ListEnumFollowStatusFieldRefInput<$PrismaModel>;
    not?: NestedEnumFollowStatusFilter<$PrismaModel> | $Enums.FollowStatus;
  };

  export type NestedEnumFollowStatusWithAggregatesFilter<$PrismaModel = never> =
    {
      equals?:
        | $Enums.FollowStatus
        | EnumFollowStatusFieldRefInput<$PrismaModel>;
      in?:
        | $Enums.FollowStatus[]
        | ListEnumFollowStatusFieldRefInput<$PrismaModel>;
      notIn?:
        | $Enums.FollowStatus[]
        | ListEnumFollowStatusFieldRefInput<$PrismaModel>;
      not?:
        | NestedEnumFollowStatusWithAggregatesFilter<$PrismaModel>
        | $Enums.FollowStatus;
      _count?: NestedIntFilter<$PrismaModel>;
      _min?: NestedEnumFollowStatusFilter<$PrismaModel>;
      _max?: NestedEnumFollowStatusFilter<$PrismaModel>;
    };

  export type NestedEnumAssetTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.AssetType | EnumAssetTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.AssetType[] | ListEnumAssetTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.AssetType[] | ListEnumAssetTypeFieldRefInput<$PrismaModel>;
    not?: NestedEnumAssetTypeFilter<$PrismaModel> | $Enums.AssetType;
  };

  export type NestedEnumAssetTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AssetType | EnumAssetTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.AssetType[] | ListEnumAssetTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.AssetType[] | ListEnumAssetTypeFieldRefInput<$PrismaModel>;
    not?:
      | NestedEnumAssetTypeWithAggregatesFilter<$PrismaModel>
      | $Enums.AssetType;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedEnumAssetTypeFilter<$PrismaModel>;
    _max?: NestedEnumAssetTypeFilter<$PrismaModel>;
  };

  export type NestedEnumChatTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.ChatType | EnumChatTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.ChatType[] | ListEnumChatTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.ChatType[] | ListEnumChatTypeFieldRefInput<$PrismaModel>;
    not?: NestedEnumChatTypeFilter<$PrismaModel> | $Enums.ChatType;
  };

  export type NestedEnumChatTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ChatType | EnumChatTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.ChatType[] | ListEnumChatTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.ChatType[] | ListEnumChatTypeFieldRefInput<$PrismaModel>;
    not?:
      | NestedEnumChatTypeWithAggregatesFilter<$PrismaModel>
      | $Enums.ChatType;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedEnumChatTypeFilter<$PrismaModel>;
    _max?: NestedEnumChatTypeFilter<$PrismaModel>;
  };

  export type NestedEnumNotificationTypeFilter<$PrismaModel = never> = {
    equals?:
      | $Enums.NotificationType
      | EnumNotificationTypeFieldRefInput<$PrismaModel>;
    in?:
      | $Enums.NotificationType[]
      | ListEnumNotificationTypeFieldRefInput<$PrismaModel>;
    notIn?:
      | $Enums.NotificationType[]
      | ListEnumNotificationTypeFieldRefInput<$PrismaModel>;
    not?:
      | NestedEnumNotificationTypeFilter<$PrismaModel>
      | $Enums.NotificationType;
  };

  export type NestedEnumNotificationTypeWithAggregatesFilter<
    $PrismaModel = never,
  > = {
    equals?:
      | $Enums.NotificationType
      | EnumNotificationTypeFieldRefInput<$PrismaModel>;
    in?:
      | $Enums.NotificationType[]
      | ListEnumNotificationTypeFieldRefInput<$PrismaModel>;
    notIn?:
      | $Enums.NotificationType[]
      | ListEnumNotificationTypeFieldRefInput<$PrismaModel>;
    not?:
      | NestedEnumNotificationTypeWithAggregatesFilter<$PrismaModel>
      | $Enums.NotificationType;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedEnumNotificationTypeFilter<$PrismaModel>;
    _max?: NestedEnumNotificationTypeFilter<$PrismaModel>;
  };

  export type AccountCreateWithoutUserInput = {
    id?: string;
    username: string;
    email?: string | null;
    phoneNumber?: string | null;
    passwordHash?: string | null;
    updatedAt?: Date | string | null;
  };

  export type AccountUncheckedCreateWithoutUserInput = {
    id?: string;
    username: string;
    email?: string | null;
    phoneNumber?: string | null;
    passwordHash?: string | null;
    updatedAt?: Date | string | null;
  };

  export type AccountCreateOrConnectWithoutUserInput = {
    where: AccountWhereUniqueInput;
    create: XOR<
      AccountCreateWithoutUserInput,
      AccountUncheckedCreateWithoutUserInput
    >;
  };

  export type ProfileCreateWithoutUserInput = {
    id?: string;
    firstName: string;
    secondName?: string | null;
    avatarUrl?: string | null;
    bio?: string | null;
    birthday?: Date | string | null;
    isPrivate?: boolean;
  };

  export type ProfileUncheckedCreateWithoutUserInput = {
    id?: string;
    firstName: string;
    secondName?: string | null;
    avatarUrl?: string | null;
    bio?: string | null;
    birthday?: Date | string | null;
    isPrivate?: boolean;
  };

  export type ProfileCreateOrConnectWithoutUserInput = {
    where: ProfileWhereUniqueInput;
    create: XOR<
      ProfileCreateWithoutUserInput,
      ProfileUncheckedCreateWithoutUserInput
    >;
  };

  export type FollowCreateWithoutFollowerInput = {
    id?: string;
    createdAt?: Date | string;
    status?: $Enums.FollowStatus;
    following: UserCreateNestedOneWithoutFollowersInput;
  };

  export type FollowUncheckedCreateWithoutFollowerInput = {
    id?: string;
    followingId: string;
    createdAt?: Date | string;
    status?: $Enums.FollowStatus;
  };

  export type FollowCreateOrConnectWithoutFollowerInput = {
    where: FollowWhereUniqueInput;
    create: XOR<
      FollowCreateWithoutFollowerInput,
      FollowUncheckedCreateWithoutFollowerInput
    >;
  };

  export type FollowCreateManyFollowerInputEnvelope = {
    data: FollowCreateManyFollowerInput | FollowCreateManyFollowerInput[];
    skipDuplicates?: boolean;
  };

  export type FollowCreateWithoutFollowingInput = {
    id?: string;
    createdAt?: Date | string;
    status?: $Enums.FollowStatus;
    follower: UserCreateNestedOneWithoutFollowingInput;
  };

  export type FollowUncheckedCreateWithoutFollowingInput = {
    id?: string;
    followerId: string;
    createdAt?: Date | string;
    status?: $Enums.FollowStatus;
  };

  export type FollowCreateOrConnectWithoutFollowingInput = {
    where: FollowWhereUniqueInput;
    create: XOR<
      FollowCreateWithoutFollowingInput,
      FollowUncheckedCreateWithoutFollowingInput
    >;
  };

  export type FollowCreateManyFollowingInputEnvelope = {
    data: FollowCreateManyFollowingInput | FollowCreateManyFollowingInput[];
    skipDuplicates?: boolean;
  };

  export type PostCreateWithoutAuthorInput = {
    id?: string;
    description?: string | null;
    isArchived?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string | null;
    assets?: AssetCreateNestedManyWithoutPostInput;
    comments?: CommentCreateNestedManyWithoutPostInput;
    likes?: LikeCreateNestedManyWithoutPostInput;
  };

  export type PostUncheckedCreateWithoutAuthorInput = {
    id?: string;
    description?: string | null;
    isArchived?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string | null;
    assets?: AssetUncheckedCreateNestedManyWithoutPostInput;
    comments?: CommentUncheckedCreateNestedManyWithoutPostInput;
    likes?: LikeUncheckedCreateNestedManyWithoutPostInput;
  };

  export type PostCreateOrConnectWithoutAuthorInput = {
    where: PostWhereUniqueInput;
    create: XOR<
      PostCreateWithoutAuthorInput,
      PostUncheckedCreateWithoutAuthorInput
    >;
  };

  export type PostCreateManyAuthorInputEnvelope = {
    data: PostCreateManyAuthorInput | PostCreateManyAuthorInput[];
    skipDuplicates?: boolean;
  };

  export type LikeCreateWithoutAuthorInput = {
    id?: string;
    createdAt?: Date | string;
    post?: PostCreateNestedOneWithoutLikesInput;
    comment?: CommentCreateNestedOneWithoutLikesInput;
  };

  export type LikeUncheckedCreateWithoutAuthorInput = {
    id?: string;
    postId?: string | null;
    commentId?: string | null;
    createdAt?: Date | string;
  };

  export type LikeCreateOrConnectWithoutAuthorInput = {
    where: LikeWhereUniqueInput;
    create: XOR<
      LikeCreateWithoutAuthorInput,
      LikeUncheckedCreateWithoutAuthorInput
    >;
  };

  export type LikeCreateManyAuthorInputEnvelope = {
    data: LikeCreateManyAuthorInput | LikeCreateManyAuthorInput[];
    skipDuplicates?: boolean;
  };

  export type CommentCreateWithoutAuthorInput = {
    id?: string;
    content: string;
    createdAt?: Date | string;
    parent?: CommentCreateNestedOneWithoutChildrenInput;
    children?: CommentCreateNestedManyWithoutParentInput;
    likes?: LikeCreateNestedManyWithoutCommentInput;
    post: PostCreateNestedOneWithoutCommentsInput;
  };

  export type CommentUncheckedCreateWithoutAuthorInput = {
    id?: string;
    postId: string;
    parentId?: string | null;
    content: string;
    createdAt?: Date | string;
    children?: CommentUncheckedCreateNestedManyWithoutParentInput;
    likes?: LikeUncheckedCreateNestedManyWithoutCommentInput;
  };

  export type CommentCreateOrConnectWithoutAuthorInput = {
    where: CommentWhereUniqueInput;
    create: XOR<
      CommentCreateWithoutAuthorInput,
      CommentUncheckedCreateWithoutAuthorInput
    >;
  };

  export type CommentCreateManyAuthorInputEnvelope = {
    data: CommentCreateManyAuthorInput | CommentCreateManyAuthorInput[];
    skipDuplicates?: boolean;
  };

  export type ChatCreateWithoutMembersInput = {
    id?: string;
    name?: string | null;
    type?: $Enums.ChatType;
    creator?: UserCreateNestedOneWithoutCreatedChatsInput;
    messages?: MessageCreateNestedManyWithoutChatInput;
  };

  export type ChatUncheckedCreateWithoutMembersInput = {
    id?: string;
    name?: string | null;
    type?: $Enums.ChatType;
    creatorId?: string | null;
    messages?: MessageUncheckedCreateNestedManyWithoutChatInput;
  };

  export type ChatCreateOrConnectWithoutMembersInput = {
    where: ChatWhereUniqueInput;
    create: XOR<
      ChatCreateWithoutMembersInput,
      ChatUncheckedCreateWithoutMembersInput
    >;
  };

  export type ChatCreateWithoutCreatorInput = {
    id?: string;
    name?: string | null;
    type?: $Enums.ChatType;
    members?: UserCreateNestedManyWithoutChatsInput;
    messages?: MessageCreateNestedManyWithoutChatInput;
  };

  export type ChatUncheckedCreateWithoutCreatorInput = {
    id?: string;
    name?: string | null;
    type?: $Enums.ChatType;
    members?: UserUncheckedCreateNestedManyWithoutChatsInput;
    messages?: MessageUncheckedCreateNestedManyWithoutChatInput;
  };

  export type ChatCreateOrConnectWithoutCreatorInput = {
    where: ChatWhereUniqueInput;
    create: XOR<
      ChatCreateWithoutCreatorInput,
      ChatUncheckedCreateWithoutCreatorInput
    >;
  };

  export type ChatCreateManyCreatorInputEnvelope = {
    data: ChatCreateManyCreatorInput | ChatCreateManyCreatorInput[];
    skipDuplicates?: boolean;
  };

  export type MessageCreateWithoutSenderInput = {
    id?: string;
    content?: string | null;
    isRead?: boolean;
    isEdited?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string | null;
    assets?: AssetCreateNestedManyWithoutMessageInput;
    chat: ChatCreateNestedOneWithoutMessagesInput;
  };

  export type MessageUncheckedCreateWithoutSenderInput = {
    id?: string;
    content?: string | null;
    isRead?: boolean;
    isEdited?: boolean;
    chatId: string;
    createdAt?: Date | string;
    updatedAt?: Date | string | null;
    assets?: AssetUncheckedCreateNestedManyWithoutMessageInput;
  };

  export type MessageCreateOrConnectWithoutSenderInput = {
    where: MessageWhereUniqueInput;
    create: XOR<
      MessageCreateWithoutSenderInput,
      MessageUncheckedCreateWithoutSenderInput
    >;
  };

  export type MessageCreateManySenderInputEnvelope = {
    data: MessageCreateManySenderInput | MessageCreateManySenderInput[];
    skipDuplicates?: boolean;
  };

  export type NotificationCreateWithoutRecipientInput = {
    id?: string;
    type: $Enums.NotificationType;
    itemId?: string | null;
    postId?: string | null;
    isRead?: boolean;
    createdAt?: Date | string;
    actor: UserCreateNestedOneWithoutTriggeredNotificationsInput;
  };

  export type NotificationUncheckedCreateWithoutRecipientInput = {
    id?: string;
    type: $Enums.NotificationType;
    actorId: string;
    itemId?: string | null;
    postId?: string | null;
    isRead?: boolean;
    createdAt?: Date | string;
  };

  export type NotificationCreateOrConnectWithoutRecipientInput = {
    where: NotificationWhereUniqueInput;
    create: XOR<
      NotificationCreateWithoutRecipientInput,
      NotificationUncheckedCreateWithoutRecipientInput
    >;
  };

  export type NotificationCreateManyRecipientInputEnvelope = {
    data:
      | NotificationCreateManyRecipientInput
      | NotificationCreateManyRecipientInput[];
    skipDuplicates?: boolean;
  };

  export type NotificationCreateWithoutActorInput = {
    id?: string;
    type: $Enums.NotificationType;
    itemId?: string | null;
    postId?: string | null;
    isRead?: boolean;
    createdAt?: Date | string;
    recipient: UserCreateNestedOneWithoutRecievedNotificationsInput;
  };

  export type NotificationUncheckedCreateWithoutActorInput = {
    id?: string;
    type: $Enums.NotificationType;
    recipientId: string;
    itemId?: string | null;
    postId?: string | null;
    isRead?: boolean;
    createdAt?: Date | string;
  };

  export type NotificationCreateOrConnectWithoutActorInput = {
    where: NotificationWhereUniqueInput;
    create: XOR<
      NotificationCreateWithoutActorInput,
      NotificationUncheckedCreateWithoutActorInput
    >;
  };

  export type NotificationCreateManyActorInputEnvelope = {
    data: NotificationCreateManyActorInput | NotificationCreateManyActorInput[];
    skipDuplicates?: boolean;
  };

  export type AccountUpsertWithoutUserInput = {
    update: XOR<
      AccountUpdateWithoutUserInput,
      AccountUncheckedUpdateWithoutUserInput
    >;
    create: XOR<
      AccountCreateWithoutUserInput,
      AccountUncheckedCreateWithoutUserInput
    >;
    where?: AccountWhereInput;
  };

  export type AccountUpdateToOneWithWhereWithoutUserInput = {
    where?: AccountWhereInput;
    data: XOR<
      AccountUpdateWithoutUserInput,
      AccountUncheckedUpdateWithoutUserInput
    >;
  };

  export type AccountUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string;
    username?: StringFieldUpdateOperationsInput | string;
    email?: NullableStringFieldUpdateOperationsInput | string | null;
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null;
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null;
    updatedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
  };

  export type AccountUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string;
    username?: StringFieldUpdateOperationsInput | string;
    email?: NullableStringFieldUpdateOperationsInput | string | null;
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null;
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null;
    updatedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
  };

  export type ProfileUpsertWithoutUserInput = {
    update: XOR<
      ProfileUpdateWithoutUserInput,
      ProfileUncheckedUpdateWithoutUserInput
    >;
    create: XOR<
      ProfileCreateWithoutUserInput,
      ProfileUncheckedCreateWithoutUserInput
    >;
    where?: ProfileWhereInput;
  };

  export type ProfileUpdateToOneWithWhereWithoutUserInput = {
    where?: ProfileWhereInput;
    data: XOR<
      ProfileUpdateWithoutUserInput,
      ProfileUncheckedUpdateWithoutUserInput
    >;
  };

  export type ProfileUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string;
    firstName?: StringFieldUpdateOperationsInput | string;
    secondName?: NullableStringFieldUpdateOperationsInput | string | null;
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null;
    bio?: NullableStringFieldUpdateOperationsInput | string | null;
    birthday?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    isPrivate?: BoolFieldUpdateOperationsInput | boolean;
  };

  export type ProfileUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string;
    firstName?: StringFieldUpdateOperationsInput | string;
    secondName?: NullableStringFieldUpdateOperationsInput | string | null;
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null;
    bio?: NullableStringFieldUpdateOperationsInput | string | null;
    birthday?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    isPrivate?: BoolFieldUpdateOperationsInput | boolean;
  };

  export type FollowUpsertWithWhereUniqueWithoutFollowerInput = {
    where: FollowWhereUniqueInput;
    update: XOR<
      FollowUpdateWithoutFollowerInput,
      FollowUncheckedUpdateWithoutFollowerInput
    >;
    create: XOR<
      FollowCreateWithoutFollowerInput,
      FollowUncheckedCreateWithoutFollowerInput
    >;
  };

  export type FollowUpdateWithWhereUniqueWithoutFollowerInput = {
    where: FollowWhereUniqueInput;
    data: XOR<
      FollowUpdateWithoutFollowerInput,
      FollowUncheckedUpdateWithoutFollowerInput
    >;
  };

  export type FollowUpdateManyWithWhereWithoutFollowerInput = {
    where: FollowScalarWhereInput;
    data: XOR<
      FollowUpdateManyMutationInput,
      FollowUncheckedUpdateManyWithoutFollowerInput
    >;
  };

  export type FollowScalarWhereInput = {
    AND?: FollowScalarWhereInput | FollowScalarWhereInput[];
    OR?: FollowScalarWhereInput[];
    NOT?: FollowScalarWhereInput | FollowScalarWhereInput[];
    id?: StringFilter<'Follow'> | string;
    followerId?: StringFilter<'Follow'> | string;
    followingId?: StringFilter<'Follow'> | string;
    createdAt?: DateTimeFilter<'Follow'> | Date | string;
    status?: EnumFollowStatusFilter<'Follow'> | $Enums.FollowStatus;
  };

  export type FollowUpsertWithWhereUniqueWithoutFollowingInput = {
    where: FollowWhereUniqueInput;
    update: XOR<
      FollowUpdateWithoutFollowingInput,
      FollowUncheckedUpdateWithoutFollowingInput
    >;
    create: XOR<
      FollowCreateWithoutFollowingInput,
      FollowUncheckedCreateWithoutFollowingInput
    >;
  };

  export type FollowUpdateWithWhereUniqueWithoutFollowingInput = {
    where: FollowWhereUniqueInput;
    data: XOR<
      FollowUpdateWithoutFollowingInput,
      FollowUncheckedUpdateWithoutFollowingInput
    >;
  };

  export type FollowUpdateManyWithWhereWithoutFollowingInput = {
    where: FollowScalarWhereInput;
    data: XOR<
      FollowUpdateManyMutationInput,
      FollowUncheckedUpdateManyWithoutFollowingInput
    >;
  };

  export type PostUpsertWithWhereUniqueWithoutAuthorInput = {
    where: PostWhereUniqueInput;
    update: XOR<
      PostUpdateWithoutAuthorInput,
      PostUncheckedUpdateWithoutAuthorInput
    >;
    create: XOR<
      PostCreateWithoutAuthorInput,
      PostUncheckedCreateWithoutAuthorInput
    >;
  };

  export type PostUpdateWithWhereUniqueWithoutAuthorInput = {
    where: PostWhereUniqueInput;
    data: XOR<
      PostUpdateWithoutAuthorInput,
      PostUncheckedUpdateWithoutAuthorInput
    >;
  };

  export type PostUpdateManyWithWhereWithoutAuthorInput = {
    where: PostScalarWhereInput;
    data: XOR<
      PostUpdateManyMutationInput,
      PostUncheckedUpdateManyWithoutAuthorInput
    >;
  };

  export type PostScalarWhereInput = {
    AND?: PostScalarWhereInput | PostScalarWhereInput[];
    OR?: PostScalarWhereInput[];
    NOT?: PostScalarWhereInput | PostScalarWhereInput[];
    id?: StringFilter<'Post'> | string;
    authorId?: StringFilter<'Post'> | string;
    description?: StringNullableFilter<'Post'> | string | null;
    isArchived?: BoolFilter<'Post'> | boolean;
    createdAt?: DateTimeFilter<'Post'> | Date | string;
    updatedAt?: DateTimeNullableFilter<'Post'> | Date | string | null;
  };

  export type LikeUpsertWithWhereUniqueWithoutAuthorInput = {
    where: LikeWhereUniqueInput;
    update: XOR<
      LikeUpdateWithoutAuthorInput,
      LikeUncheckedUpdateWithoutAuthorInput
    >;
    create: XOR<
      LikeCreateWithoutAuthorInput,
      LikeUncheckedCreateWithoutAuthorInput
    >;
  };

  export type LikeUpdateWithWhereUniqueWithoutAuthorInput = {
    where: LikeWhereUniqueInput;
    data: XOR<
      LikeUpdateWithoutAuthorInput,
      LikeUncheckedUpdateWithoutAuthorInput
    >;
  };

  export type LikeUpdateManyWithWhereWithoutAuthorInput = {
    where: LikeScalarWhereInput;
    data: XOR<
      LikeUpdateManyMutationInput,
      LikeUncheckedUpdateManyWithoutAuthorInput
    >;
  };

  export type LikeScalarWhereInput = {
    AND?: LikeScalarWhereInput | LikeScalarWhereInput[];
    OR?: LikeScalarWhereInput[];
    NOT?: LikeScalarWhereInput | LikeScalarWhereInput[];
    id?: StringFilter<'Like'> | string;
    authorId?: StringFilter<'Like'> | string;
    postId?: StringNullableFilter<'Like'> | string | null;
    commentId?: StringNullableFilter<'Like'> | string | null;
    createdAt?: DateTimeFilter<'Like'> | Date | string;
  };

  export type CommentUpsertWithWhereUniqueWithoutAuthorInput = {
    where: CommentWhereUniqueInput;
    update: XOR<
      CommentUpdateWithoutAuthorInput,
      CommentUncheckedUpdateWithoutAuthorInput
    >;
    create: XOR<
      CommentCreateWithoutAuthorInput,
      CommentUncheckedCreateWithoutAuthorInput
    >;
  };

  export type CommentUpdateWithWhereUniqueWithoutAuthorInput = {
    where: CommentWhereUniqueInput;
    data: XOR<
      CommentUpdateWithoutAuthorInput,
      CommentUncheckedUpdateWithoutAuthorInput
    >;
  };

  export type CommentUpdateManyWithWhereWithoutAuthorInput = {
    where: CommentScalarWhereInput;
    data: XOR<
      CommentUpdateManyMutationInput,
      CommentUncheckedUpdateManyWithoutAuthorInput
    >;
  };

  export type CommentScalarWhereInput = {
    AND?: CommentScalarWhereInput | CommentScalarWhereInput[];
    OR?: CommentScalarWhereInput[];
    NOT?: CommentScalarWhereInput | CommentScalarWhereInput[];
    id?: StringFilter<'Comment'> | string;
    authorId?: StringFilter<'Comment'> | string;
    postId?: StringFilter<'Comment'> | string;
    parentId?: StringNullableFilter<'Comment'> | string | null;
    content?: StringFilter<'Comment'> | string;
    createdAt?: DateTimeFilter<'Comment'> | Date | string;
  };

  export type ChatUpsertWithWhereUniqueWithoutMembersInput = {
    where: ChatWhereUniqueInput;
    update: XOR<
      ChatUpdateWithoutMembersInput,
      ChatUncheckedUpdateWithoutMembersInput
    >;
    create: XOR<
      ChatCreateWithoutMembersInput,
      ChatUncheckedCreateWithoutMembersInput
    >;
  };

  export type ChatUpdateWithWhereUniqueWithoutMembersInput = {
    where: ChatWhereUniqueInput;
    data: XOR<
      ChatUpdateWithoutMembersInput,
      ChatUncheckedUpdateWithoutMembersInput
    >;
  };

  export type ChatUpdateManyWithWhereWithoutMembersInput = {
    where: ChatScalarWhereInput;
    data: XOR<
      ChatUpdateManyMutationInput,
      ChatUncheckedUpdateManyWithoutMembersInput
    >;
  };

  export type ChatScalarWhereInput = {
    AND?: ChatScalarWhereInput | ChatScalarWhereInput[];
    OR?: ChatScalarWhereInput[];
    NOT?: ChatScalarWhereInput | ChatScalarWhereInput[];
    id?: StringFilter<'Chat'> | string;
    name?: StringNullableFilter<'Chat'> | string | null;
    type?: EnumChatTypeFilter<'Chat'> | $Enums.ChatType;
    creatorId?: StringNullableFilter<'Chat'> | string | null;
  };

  export type ChatUpsertWithWhereUniqueWithoutCreatorInput = {
    where: ChatWhereUniqueInput;
    update: XOR<
      ChatUpdateWithoutCreatorInput,
      ChatUncheckedUpdateWithoutCreatorInput
    >;
    create: XOR<
      ChatCreateWithoutCreatorInput,
      ChatUncheckedCreateWithoutCreatorInput
    >;
  };

  export type ChatUpdateWithWhereUniqueWithoutCreatorInput = {
    where: ChatWhereUniqueInput;
    data: XOR<
      ChatUpdateWithoutCreatorInput,
      ChatUncheckedUpdateWithoutCreatorInput
    >;
  };

  export type ChatUpdateManyWithWhereWithoutCreatorInput = {
    where: ChatScalarWhereInput;
    data: XOR<
      ChatUpdateManyMutationInput,
      ChatUncheckedUpdateManyWithoutCreatorInput
    >;
  };

  export type MessageUpsertWithWhereUniqueWithoutSenderInput = {
    where: MessageWhereUniqueInput;
    update: XOR<
      MessageUpdateWithoutSenderInput,
      MessageUncheckedUpdateWithoutSenderInput
    >;
    create: XOR<
      MessageCreateWithoutSenderInput,
      MessageUncheckedCreateWithoutSenderInput
    >;
  };

  export type MessageUpdateWithWhereUniqueWithoutSenderInput = {
    where: MessageWhereUniqueInput;
    data: XOR<
      MessageUpdateWithoutSenderInput,
      MessageUncheckedUpdateWithoutSenderInput
    >;
  };

  export type MessageUpdateManyWithWhereWithoutSenderInput = {
    where: MessageScalarWhereInput;
    data: XOR<
      MessageUpdateManyMutationInput,
      MessageUncheckedUpdateManyWithoutSenderInput
    >;
  };

  export type MessageScalarWhereInput = {
    AND?: MessageScalarWhereInput | MessageScalarWhereInput[];
    OR?: MessageScalarWhereInput[];
    NOT?: MessageScalarWhereInput | MessageScalarWhereInput[];
    id?: StringFilter<'Message'> | string;
    content?: StringNullableFilter<'Message'> | string | null;
    isRead?: BoolFilter<'Message'> | boolean;
    isEdited?: BoolFilter<'Message'> | boolean;
    chatId?: StringFilter<'Message'> | string;
    senderId?: StringFilter<'Message'> | string;
    createdAt?: DateTimeFilter<'Message'> | Date | string;
    updatedAt?: DateTimeNullableFilter<'Message'> | Date | string | null;
  };

  export type NotificationUpsertWithWhereUniqueWithoutRecipientInput = {
    where: NotificationWhereUniqueInput;
    update: XOR<
      NotificationUpdateWithoutRecipientInput,
      NotificationUncheckedUpdateWithoutRecipientInput
    >;
    create: XOR<
      NotificationCreateWithoutRecipientInput,
      NotificationUncheckedCreateWithoutRecipientInput
    >;
  };

  export type NotificationUpdateWithWhereUniqueWithoutRecipientInput = {
    where: NotificationWhereUniqueInput;
    data: XOR<
      NotificationUpdateWithoutRecipientInput,
      NotificationUncheckedUpdateWithoutRecipientInput
    >;
  };

  export type NotificationUpdateManyWithWhereWithoutRecipientInput = {
    where: NotificationScalarWhereInput;
    data: XOR<
      NotificationUpdateManyMutationInput,
      NotificationUncheckedUpdateManyWithoutRecipientInput
    >;
  };

  export type NotificationScalarWhereInput = {
    AND?: NotificationScalarWhereInput | NotificationScalarWhereInput[];
    OR?: NotificationScalarWhereInput[];
    NOT?: NotificationScalarWhereInput | NotificationScalarWhereInput[];
    id?: StringFilter<'Notification'> | string;
    type?: EnumNotificationTypeFilter<'Notification'> | $Enums.NotificationType;
    recipientId?: StringFilter<'Notification'> | string;
    actorId?: StringFilter<'Notification'> | string;
    itemId?: StringNullableFilter<'Notification'> | string | null;
    postId?: StringNullableFilter<'Notification'> | string | null;
    isRead?: BoolFilter<'Notification'> | boolean;
    createdAt?: DateTimeFilter<'Notification'> | Date | string;
  };

  export type NotificationUpsertWithWhereUniqueWithoutActorInput = {
    where: NotificationWhereUniqueInput;
    update: XOR<
      NotificationUpdateWithoutActorInput,
      NotificationUncheckedUpdateWithoutActorInput
    >;
    create: XOR<
      NotificationCreateWithoutActorInput,
      NotificationUncheckedCreateWithoutActorInput
    >;
  };

  export type NotificationUpdateWithWhereUniqueWithoutActorInput = {
    where: NotificationWhereUniqueInput;
    data: XOR<
      NotificationUpdateWithoutActorInput,
      NotificationUncheckedUpdateWithoutActorInput
    >;
  };

  export type NotificationUpdateManyWithWhereWithoutActorInput = {
    where: NotificationScalarWhereInput;
    data: XOR<
      NotificationUpdateManyMutationInput,
      NotificationUncheckedUpdateManyWithoutActorInput
    >;
  };

  export type UserCreateWithoutAccountInput = {
    id?: string;
    createdAt?: Date | string;
    deletedAt?: Date | string | null;
    profile?: ProfileCreateNestedOneWithoutUserInput;
    following?: FollowCreateNestedManyWithoutFollowerInput;
    followers?: FollowCreateNestedManyWithoutFollowingInput;
    posts?: PostCreateNestedManyWithoutAuthorInput;
    likes?: LikeCreateNestedManyWithoutAuthorInput;
    comments?: CommentCreateNestedManyWithoutAuthorInput;
    chats?: ChatCreateNestedManyWithoutMembersInput;
    createdChats?: ChatCreateNestedManyWithoutCreatorInput;
    sentMessages?: MessageCreateNestedManyWithoutSenderInput;
    recievedNotifications?: NotificationCreateNestedManyWithoutRecipientInput;
    triggeredNotifications?: NotificationCreateNestedManyWithoutActorInput;
  };

  export type UserUncheckedCreateWithoutAccountInput = {
    id?: string;
    createdAt?: Date | string;
    deletedAt?: Date | string | null;
    profile?: ProfileUncheckedCreateNestedOneWithoutUserInput;
    following?: FollowUncheckedCreateNestedManyWithoutFollowerInput;
    followers?: FollowUncheckedCreateNestedManyWithoutFollowingInput;
    posts?: PostUncheckedCreateNestedManyWithoutAuthorInput;
    likes?: LikeUncheckedCreateNestedManyWithoutAuthorInput;
    comments?: CommentUncheckedCreateNestedManyWithoutAuthorInput;
    chats?: ChatUncheckedCreateNestedManyWithoutMembersInput;
    createdChats?: ChatUncheckedCreateNestedManyWithoutCreatorInput;
    sentMessages?: MessageUncheckedCreateNestedManyWithoutSenderInput;
    recievedNotifications?: NotificationUncheckedCreateNestedManyWithoutRecipientInput;
    triggeredNotifications?: NotificationUncheckedCreateNestedManyWithoutActorInput;
  };

  export type UserCreateOrConnectWithoutAccountInput = {
    where: UserWhereUniqueInput;
    create: XOR<
      UserCreateWithoutAccountInput,
      UserUncheckedCreateWithoutAccountInput
    >;
  };

  export type UserUpsertWithoutAccountInput = {
    update: XOR<
      UserUpdateWithoutAccountInput,
      UserUncheckedUpdateWithoutAccountInput
    >;
    create: XOR<
      UserCreateWithoutAccountInput,
      UserUncheckedCreateWithoutAccountInput
    >;
    where?: UserWhereInput;
  };

  export type UserUpdateToOneWithWhereWithoutAccountInput = {
    where?: UserWhereInput;
    data: XOR<
      UserUpdateWithoutAccountInput,
      UserUncheckedUpdateWithoutAccountInput
    >;
  };

  export type UserUpdateWithoutAccountInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    profile?: ProfileUpdateOneWithoutUserNestedInput;
    following?: FollowUpdateManyWithoutFollowerNestedInput;
    followers?: FollowUpdateManyWithoutFollowingNestedInput;
    posts?: PostUpdateManyWithoutAuthorNestedInput;
    likes?: LikeUpdateManyWithoutAuthorNestedInput;
    comments?: CommentUpdateManyWithoutAuthorNestedInput;
    chats?: ChatUpdateManyWithoutMembersNestedInput;
    createdChats?: ChatUpdateManyWithoutCreatorNestedInput;
    sentMessages?: MessageUpdateManyWithoutSenderNestedInput;
    recievedNotifications?: NotificationUpdateManyWithoutRecipientNestedInput;
    triggeredNotifications?: NotificationUpdateManyWithoutActorNestedInput;
  };

  export type UserUncheckedUpdateWithoutAccountInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    profile?: ProfileUncheckedUpdateOneWithoutUserNestedInput;
    following?: FollowUncheckedUpdateManyWithoutFollowerNestedInput;
    followers?: FollowUncheckedUpdateManyWithoutFollowingNestedInput;
    posts?: PostUncheckedUpdateManyWithoutAuthorNestedInput;
    likes?: LikeUncheckedUpdateManyWithoutAuthorNestedInput;
    comments?: CommentUncheckedUpdateManyWithoutAuthorNestedInput;
    chats?: ChatUncheckedUpdateManyWithoutMembersNestedInput;
    createdChats?: ChatUncheckedUpdateManyWithoutCreatorNestedInput;
    sentMessages?: MessageUncheckedUpdateManyWithoutSenderNestedInput;
    recievedNotifications?: NotificationUncheckedUpdateManyWithoutRecipientNestedInput;
    triggeredNotifications?: NotificationUncheckedUpdateManyWithoutActorNestedInput;
  };

  export type UserCreateWithoutProfileInput = {
    id?: string;
    createdAt?: Date | string;
    deletedAt?: Date | string | null;
    account?: AccountCreateNestedOneWithoutUserInput;
    following?: FollowCreateNestedManyWithoutFollowerInput;
    followers?: FollowCreateNestedManyWithoutFollowingInput;
    posts?: PostCreateNestedManyWithoutAuthorInput;
    likes?: LikeCreateNestedManyWithoutAuthorInput;
    comments?: CommentCreateNestedManyWithoutAuthorInput;
    chats?: ChatCreateNestedManyWithoutMembersInput;
    createdChats?: ChatCreateNestedManyWithoutCreatorInput;
    sentMessages?: MessageCreateNestedManyWithoutSenderInput;
    recievedNotifications?: NotificationCreateNestedManyWithoutRecipientInput;
    triggeredNotifications?: NotificationCreateNestedManyWithoutActorInput;
  };

  export type UserUncheckedCreateWithoutProfileInput = {
    id?: string;
    createdAt?: Date | string;
    deletedAt?: Date | string | null;
    account?: AccountUncheckedCreateNestedOneWithoutUserInput;
    following?: FollowUncheckedCreateNestedManyWithoutFollowerInput;
    followers?: FollowUncheckedCreateNestedManyWithoutFollowingInput;
    posts?: PostUncheckedCreateNestedManyWithoutAuthorInput;
    likes?: LikeUncheckedCreateNestedManyWithoutAuthorInput;
    comments?: CommentUncheckedCreateNestedManyWithoutAuthorInput;
    chats?: ChatUncheckedCreateNestedManyWithoutMembersInput;
    createdChats?: ChatUncheckedCreateNestedManyWithoutCreatorInput;
    sentMessages?: MessageUncheckedCreateNestedManyWithoutSenderInput;
    recievedNotifications?: NotificationUncheckedCreateNestedManyWithoutRecipientInput;
    triggeredNotifications?: NotificationUncheckedCreateNestedManyWithoutActorInput;
  };

  export type UserCreateOrConnectWithoutProfileInput = {
    where: UserWhereUniqueInput;
    create: XOR<
      UserCreateWithoutProfileInput,
      UserUncheckedCreateWithoutProfileInput
    >;
  };

  export type UserUpsertWithoutProfileInput = {
    update: XOR<
      UserUpdateWithoutProfileInput,
      UserUncheckedUpdateWithoutProfileInput
    >;
    create: XOR<
      UserCreateWithoutProfileInput,
      UserUncheckedCreateWithoutProfileInput
    >;
    where?: UserWhereInput;
  };

  export type UserUpdateToOneWithWhereWithoutProfileInput = {
    where?: UserWhereInput;
    data: XOR<
      UserUpdateWithoutProfileInput,
      UserUncheckedUpdateWithoutProfileInput
    >;
  };

  export type UserUpdateWithoutProfileInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    account?: AccountUpdateOneWithoutUserNestedInput;
    following?: FollowUpdateManyWithoutFollowerNestedInput;
    followers?: FollowUpdateManyWithoutFollowingNestedInput;
    posts?: PostUpdateManyWithoutAuthorNestedInput;
    likes?: LikeUpdateManyWithoutAuthorNestedInput;
    comments?: CommentUpdateManyWithoutAuthorNestedInput;
    chats?: ChatUpdateManyWithoutMembersNestedInput;
    createdChats?: ChatUpdateManyWithoutCreatorNestedInput;
    sentMessages?: MessageUpdateManyWithoutSenderNestedInput;
    recievedNotifications?: NotificationUpdateManyWithoutRecipientNestedInput;
    triggeredNotifications?: NotificationUpdateManyWithoutActorNestedInput;
  };

  export type UserUncheckedUpdateWithoutProfileInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    account?: AccountUncheckedUpdateOneWithoutUserNestedInput;
    following?: FollowUncheckedUpdateManyWithoutFollowerNestedInput;
    followers?: FollowUncheckedUpdateManyWithoutFollowingNestedInput;
    posts?: PostUncheckedUpdateManyWithoutAuthorNestedInput;
    likes?: LikeUncheckedUpdateManyWithoutAuthorNestedInput;
    comments?: CommentUncheckedUpdateManyWithoutAuthorNestedInput;
    chats?: ChatUncheckedUpdateManyWithoutMembersNestedInput;
    createdChats?: ChatUncheckedUpdateManyWithoutCreatorNestedInput;
    sentMessages?: MessageUncheckedUpdateManyWithoutSenderNestedInput;
    recievedNotifications?: NotificationUncheckedUpdateManyWithoutRecipientNestedInput;
    triggeredNotifications?: NotificationUncheckedUpdateManyWithoutActorNestedInput;
  };

  export type UserCreateWithoutFollowingInput = {
    id?: string;
    createdAt?: Date | string;
    deletedAt?: Date | string | null;
    account?: AccountCreateNestedOneWithoutUserInput;
    profile?: ProfileCreateNestedOneWithoutUserInput;
    followers?: FollowCreateNestedManyWithoutFollowingInput;
    posts?: PostCreateNestedManyWithoutAuthorInput;
    likes?: LikeCreateNestedManyWithoutAuthorInput;
    comments?: CommentCreateNestedManyWithoutAuthorInput;
    chats?: ChatCreateNestedManyWithoutMembersInput;
    createdChats?: ChatCreateNestedManyWithoutCreatorInput;
    sentMessages?: MessageCreateNestedManyWithoutSenderInput;
    recievedNotifications?: NotificationCreateNestedManyWithoutRecipientInput;
    triggeredNotifications?: NotificationCreateNestedManyWithoutActorInput;
  };

  export type UserUncheckedCreateWithoutFollowingInput = {
    id?: string;
    createdAt?: Date | string;
    deletedAt?: Date | string | null;
    account?: AccountUncheckedCreateNestedOneWithoutUserInput;
    profile?: ProfileUncheckedCreateNestedOneWithoutUserInput;
    followers?: FollowUncheckedCreateNestedManyWithoutFollowingInput;
    posts?: PostUncheckedCreateNestedManyWithoutAuthorInput;
    likes?: LikeUncheckedCreateNestedManyWithoutAuthorInput;
    comments?: CommentUncheckedCreateNestedManyWithoutAuthorInput;
    chats?: ChatUncheckedCreateNestedManyWithoutMembersInput;
    createdChats?: ChatUncheckedCreateNestedManyWithoutCreatorInput;
    sentMessages?: MessageUncheckedCreateNestedManyWithoutSenderInput;
    recievedNotifications?: NotificationUncheckedCreateNestedManyWithoutRecipientInput;
    triggeredNotifications?: NotificationUncheckedCreateNestedManyWithoutActorInput;
  };

  export type UserCreateOrConnectWithoutFollowingInput = {
    where: UserWhereUniqueInput;
    create: XOR<
      UserCreateWithoutFollowingInput,
      UserUncheckedCreateWithoutFollowingInput
    >;
  };

  export type UserCreateWithoutFollowersInput = {
    id?: string;
    createdAt?: Date | string;
    deletedAt?: Date | string | null;
    account?: AccountCreateNestedOneWithoutUserInput;
    profile?: ProfileCreateNestedOneWithoutUserInput;
    following?: FollowCreateNestedManyWithoutFollowerInput;
    posts?: PostCreateNestedManyWithoutAuthorInput;
    likes?: LikeCreateNestedManyWithoutAuthorInput;
    comments?: CommentCreateNestedManyWithoutAuthorInput;
    chats?: ChatCreateNestedManyWithoutMembersInput;
    createdChats?: ChatCreateNestedManyWithoutCreatorInput;
    sentMessages?: MessageCreateNestedManyWithoutSenderInput;
    recievedNotifications?: NotificationCreateNestedManyWithoutRecipientInput;
    triggeredNotifications?: NotificationCreateNestedManyWithoutActorInput;
  };

  export type UserUncheckedCreateWithoutFollowersInput = {
    id?: string;
    createdAt?: Date | string;
    deletedAt?: Date | string | null;
    account?: AccountUncheckedCreateNestedOneWithoutUserInput;
    profile?: ProfileUncheckedCreateNestedOneWithoutUserInput;
    following?: FollowUncheckedCreateNestedManyWithoutFollowerInput;
    posts?: PostUncheckedCreateNestedManyWithoutAuthorInput;
    likes?: LikeUncheckedCreateNestedManyWithoutAuthorInput;
    comments?: CommentUncheckedCreateNestedManyWithoutAuthorInput;
    chats?: ChatUncheckedCreateNestedManyWithoutMembersInput;
    createdChats?: ChatUncheckedCreateNestedManyWithoutCreatorInput;
    sentMessages?: MessageUncheckedCreateNestedManyWithoutSenderInput;
    recievedNotifications?: NotificationUncheckedCreateNestedManyWithoutRecipientInput;
    triggeredNotifications?: NotificationUncheckedCreateNestedManyWithoutActorInput;
  };

  export type UserCreateOrConnectWithoutFollowersInput = {
    where: UserWhereUniqueInput;
    create: XOR<
      UserCreateWithoutFollowersInput,
      UserUncheckedCreateWithoutFollowersInput
    >;
  };

  export type UserUpsertWithoutFollowingInput = {
    update: XOR<
      UserUpdateWithoutFollowingInput,
      UserUncheckedUpdateWithoutFollowingInput
    >;
    create: XOR<
      UserCreateWithoutFollowingInput,
      UserUncheckedCreateWithoutFollowingInput
    >;
    where?: UserWhereInput;
  };

  export type UserUpdateToOneWithWhereWithoutFollowingInput = {
    where?: UserWhereInput;
    data: XOR<
      UserUpdateWithoutFollowingInput,
      UserUncheckedUpdateWithoutFollowingInput
    >;
  };

  export type UserUpdateWithoutFollowingInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    account?: AccountUpdateOneWithoutUserNestedInput;
    profile?: ProfileUpdateOneWithoutUserNestedInput;
    followers?: FollowUpdateManyWithoutFollowingNestedInput;
    posts?: PostUpdateManyWithoutAuthorNestedInput;
    likes?: LikeUpdateManyWithoutAuthorNestedInput;
    comments?: CommentUpdateManyWithoutAuthorNestedInput;
    chats?: ChatUpdateManyWithoutMembersNestedInput;
    createdChats?: ChatUpdateManyWithoutCreatorNestedInput;
    sentMessages?: MessageUpdateManyWithoutSenderNestedInput;
    recievedNotifications?: NotificationUpdateManyWithoutRecipientNestedInput;
    triggeredNotifications?: NotificationUpdateManyWithoutActorNestedInput;
  };

  export type UserUncheckedUpdateWithoutFollowingInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    account?: AccountUncheckedUpdateOneWithoutUserNestedInput;
    profile?: ProfileUncheckedUpdateOneWithoutUserNestedInput;
    followers?: FollowUncheckedUpdateManyWithoutFollowingNestedInput;
    posts?: PostUncheckedUpdateManyWithoutAuthorNestedInput;
    likes?: LikeUncheckedUpdateManyWithoutAuthorNestedInput;
    comments?: CommentUncheckedUpdateManyWithoutAuthorNestedInput;
    chats?: ChatUncheckedUpdateManyWithoutMembersNestedInput;
    createdChats?: ChatUncheckedUpdateManyWithoutCreatorNestedInput;
    sentMessages?: MessageUncheckedUpdateManyWithoutSenderNestedInput;
    recievedNotifications?: NotificationUncheckedUpdateManyWithoutRecipientNestedInput;
    triggeredNotifications?: NotificationUncheckedUpdateManyWithoutActorNestedInput;
  };

  export type UserUpsertWithoutFollowersInput = {
    update: XOR<
      UserUpdateWithoutFollowersInput,
      UserUncheckedUpdateWithoutFollowersInput
    >;
    create: XOR<
      UserCreateWithoutFollowersInput,
      UserUncheckedCreateWithoutFollowersInput
    >;
    where?: UserWhereInput;
  };

  export type UserUpdateToOneWithWhereWithoutFollowersInput = {
    where?: UserWhereInput;
    data: XOR<
      UserUpdateWithoutFollowersInput,
      UserUncheckedUpdateWithoutFollowersInput
    >;
  };

  export type UserUpdateWithoutFollowersInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    account?: AccountUpdateOneWithoutUserNestedInput;
    profile?: ProfileUpdateOneWithoutUserNestedInput;
    following?: FollowUpdateManyWithoutFollowerNestedInput;
    posts?: PostUpdateManyWithoutAuthorNestedInput;
    likes?: LikeUpdateManyWithoutAuthorNestedInput;
    comments?: CommentUpdateManyWithoutAuthorNestedInput;
    chats?: ChatUpdateManyWithoutMembersNestedInput;
    createdChats?: ChatUpdateManyWithoutCreatorNestedInput;
    sentMessages?: MessageUpdateManyWithoutSenderNestedInput;
    recievedNotifications?: NotificationUpdateManyWithoutRecipientNestedInput;
    triggeredNotifications?: NotificationUpdateManyWithoutActorNestedInput;
  };

  export type UserUncheckedUpdateWithoutFollowersInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    account?: AccountUncheckedUpdateOneWithoutUserNestedInput;
    profile?: ProfileUncheckedUpdateOneWithoutUserNestedInput;
    following?: FollowUncheckedUpdateManyWithoutFollowerNestedInput;
    posts?: PostUncheckedUpdateManyWithoutAuthorNestedInput;
    likes?: LikeUncheckedUpdateManyWithoutAuthorNestedInput;
    comments?: CommentUncheckedUpdateManyWithoutAuthorNestedInput;
    chats?: ChatUncheckedUpdateManyWithoutMembersNestedInput;
    createdChats?: ChatUncheckedUpdateManyWithoutCreatorNestedInput;
    sentMessages?: MessageUncheckedUpdateManyWithoutSenderNestedInput;
    recievedNotifications?: NotificationUncheckedUpdateManyWithoutRecipientNestedInput;
    triggeredNotifications?: NotificationUncheckedUpdateManyWithoutActorNestedInput;
  };

  export type AssetCreateWithoutPostInput = {
    id?: string;
    url: string;
    type?: $Enums.AssetType;
    message?: MessageCreateNestedOneWithoutAssetsInput;
  };

  export type AssetUncheckedCreateWithoutPostInput = {
    id?: string;
    url: string;
    type?: $Enums.AssetType;
    messageId?: string | null;
  };

  export type AssetCreateOrConnectWithoutPostInput = {
    where: AssetWhereUniqueInput;
    create: XOR<
      AssetCreateWithoutPostInput,
      AssetUncheckedCreateWithoutPostInput
    >;
  };

  export type AssetCreateManyPostInputEnvelope = {
    data: AssetCreateManyPostInput | AssetCreateManyPostInput[];
    skipDuplicates?: boolean;
  };

  export type CommentCreateWithoutPostInput = {
    id?: string;
    content: string;
    createdAt?: Date | string;
    parent?: CommentCreateNestedOneWithoutChildrenInput;
    children?: CommentCreateNestedManyWithoutParentInput;
    likes?: LikeCreateNestedManyWithoutCommentInput;
    author: UserCreateNestedOneWithoutCommentsInput;
  };

  export type CommentUncheckedCreateWithoutPostInput = {
    id?: string;
    authorId: string;
    parentId?: string | null;
    content: string;
    createdAt?: Date | string;
    children?: CommentUncheckedCreateNestedManyWithoutParentInput;
    likes?: LikeUncheckedCreateNestedManyWithoutCommentInput;
  };

  export type CommentCreateOrConnectWithoutPostInput = {
    where: CommentWhereUniqueInput;
    create: XOR<
      CommentCreateWithoutPostInput,
      CommentUncheckedCreateWithoutPostInput
    >;
  };

  export type CommentCreateManyPostInputEnvelope = {
    data: CommentCreateManyPostInput | CommentCreateManyPostInput[];
    skipDuplicates?: boolean;
  };

  export type LikeCreateWithoutPostInput = {
    id?: string;
    createdAt?: Date | string;
    comment?: CommentCreateNestedOneWithoutLikesInput;
    author: UserCreateNestedOneWithoutLikesInput;
  };

  export type LikeUncheckedCreateWithoutPostInput = {
    id?: string;
    authorId: string;
    commentId?: string | null;
    createdAt?: Date | string;
  };

  export type LikeCreateOrConnectWithoutPostInput = {
    where: LikeWhereUniqueInput;
    create: XOR<
      LikeCreateWithoutPostInput,
      LikeUncheckedCreateWithoutPostInput
    >;
  };

  export type LikeCreateManyPostInputEnvelope = {
    data: LikeCreateManyPostInput | LikeCreateManyPostInput[];
    skipDuplicates?: boolean;
  };

  export type UserCreateWithoutPostsInput = {
    id?: string;
    createdAt?: Date | string;
    deletedAt?: Date | string | null;
    account?: AccountCreateNestedOneWithoutUserInput;
    profile?: ProfileCreateNestedOneWithoutUserInput;
    following?: FollowCreateNestedManyWithoutFollowerInput;
    followers?: FollowCreateNestedManyWithoutFollowingInput;
    likes?: LikeCreateNestedManyWithoutAuthorInput;
    comments?: CommentCreateNestedManyWithoutAuthorInput;
    chats?: ChatCreateNestedManyWithoutMembersInput;
    createdChats?: ChatCreateNestedManyWithoutCreatorInput;
    sentMessages?: MessageCreateNestedManyWithoutSenderInput;
    recievedNotifications?: NotificationCreateNestedManyWithoutRecipientInput;
    triggeredNotifications?: NotificationCreateNestedManyWithoutActorInput;
  };

  export type UserUncheckedCreateWithoutPostsInput = {
    id?: string;
    createdAt?: Date | string;
    deletedAt?: Date | string | null;
    account?: AccountUncheckedCreateNestedOneWithoutUserInput;
    profile?: ProfileUncheckedCreateNestedOneWithoutUserInput;
    following?: FollowUncheckedCreateNestedManyWithoutFollowerInput;
    followers?: FollowUncheckedCreateNestedManyWithoutFollowingInput;
    likes?: LikeUncheckedCreateNestedManyWithoutAuthorInput;
    comments?: CommentUncheckedCreateNestedManyWithoutAuthorInput;
    chats?: ChatUncheckedCreateNestedManyWithoutMembersInput;
    createdChats?: ChatUncheckedCreateNestedManyWithoutCreatorInput;
    sentMessages?: MessageUncheckedCreateNestedManyWithoutSenderInput;
    recievedNotifications?: NotificationUncheckedCreateNestedManyWithoutRecipientInput;
    triggeredNotifications?: NotificationUncheckedCreateNestedManyWithoutActorInput;
  };

  export type UserCreateOrConnectWithoutPostsInput = {
    where: UserWhereUniqueInput;
    create: XOR<
      UserCreateWithoutPostsInput,
      UserUncheckedCreateWithoutPostsInput
    >;
  };

  export type AssetUpsertWithWhereUniqueWithoutPostInput = {
    where: AssetWhereUniqueInput;
    update: XOR<
      AssetUpdateWithoutPostInput,
      AssetUncheckedUpdateWithoutPostInput
    >;
    create: XOR<
      AssetCreateWithoutPostInput,
      AssetUncheckedCreateWithoutPostInput
    >;
  };

  export type AssetUpdateWithWhereUniqueWithoutPostInput = {
    where: AssetWhereUniqueInput;
    data: XOR<
      AssetUpdateWithoutPostInput,
      AssetUncheckedUpdateWithoutPostInput
    >;
  };

  export type AssetUpdateManyWithWhereWithoutPostInput = {
    where: AssetScalarWhereInput;
    data: XOR<
      AssetUpdateManyMutationInput,
      AssetUncheckedUpdateManyWithoutPostInput
    >;
  };

  export type AssetScalarWhereInput = {
    AND?: AssetScalarWhereInput | AssetScalarWhereInput[];
    OR?: AssetScalarWhereInput[];
    NOT?: AssetScalarWhereInput | AssetScalarWhereInput[];
    id?: StringFilter<'Asset'> | string;
    url?: StringFilter<'Asset'> | string;
    type?: EnumAssetTypeFilter<'Asset'> | $Enums.AssetType;
    postId?: StringNullableFilter<'Asset'> | string | null;
    messageId?: StringNullableFilter<'Asset'> | string | null;
  };

  export type CommentUpsertWithWhereUniqueWithoutPostInput = {
    where: CommentWhereUniqueInput;
    update: XOR<
      CommentUpdateWithoutPostInput,
      CommentUncheckedUpdateWithoutPostInput
    >;
    create: XOR<
      CommentCreateWithoutPostInput,
      CommentUncheckedCreateWithoutPostInput
    >;
  };

  export type CommentUpdateWithWhereUniqueWithoutPostInput = {
    where: CommentWhereUniqueInput;
    data: XOR<
      CommentUpdateWithoutPostInput,
      CommentUncheckedUpdateWithoutPostInput
    >;
  };

  export type CommentUpdateManyWithWhereWithoutPostInput = {
    where: CommentScalarWhereInput;
    data: XOR<
      CommentUpdateManyMutationInput,
      CommentUncheckedUpdateManyWithoutPostInput
    >;
  };

  export type LikeUpsertWithWhereUniqueWithoutPostInput = {
    where: LikeWhereUniqueInput;
    update: XOR<
      LikeUpdateWithoutPostInput,
      LikeUncheckedUpdateWithoutPostInput
    >;
    create: XOR<
      LikeCreateWithoutPostInput,
      LikeUncheckedCreateWithoutPostInput
    >;
  };

  export type LikeUpdateWithWhereUniqueWithoutPostInput = {
    where: LikeWhereUniqueInput;
    data: XOR<LikeUpdateWithoutPostInput, LikeUncheckedUpdateWithoutPostInput>;
  };

  export type LikeUpdateManyWithWhereWithoutPostInput = {
    where: LikeScalarWhereInput;
    data: XOR<
      LikeUpdateManyMutationInput,
      LikeUncheckedUpdateManyWithoutPostInput
    >;
  };

  export type UserUpsertWithoutPostsInput = {
    update: XOR<
      UserUpdateWithoutPostsInput,
      UserUncheckedUpdateWithoutPostsInput
    >;
    create: XOR<
      UserCreateWithoutPostsInput,
      UserUncheckedCreateWithoutPostsInput
    >;
    where?: UserWhereInput;
  };

  export type UserUpdateToOneWithWhereWithoutPostsInput = {
    where?: UserWhereInput;
    data: XOR<
      UserUpdateWithoutPostsInput,
      UserUncheckedUpdateWithoutPostsInput
    >;
  };

  export type UserUpdateWithoutPostsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    account?: AccountUpdateOneWithoutUserNestedInput;
    profile?: ProfileUpdateOneWithoutUserNestedInput;
    following?: FollowUpdateManyWithoutFollowerNestedInput;
    followers?: FollowUpdateManyWithoutFollowingNestedInput;
    likes?: LikeUpdateManyWithoutAuthorNestedInput;
    comments?: CommentUpdateManyWithoutAuthorNestedInput;
    chats?: ChatUpdateManyWithoutMembersNestedInput;
    createdChats?: ChatUpdateManyWithoutCreatorNestedInput;
    sentMessages?: MessageUpdateManyWithoutSenderNestedInput;
    recievedNotifications?: NotificationUpdateManyWithoutRecipientNestedInput;
    triggeredNotifications?: NotificationUpdateManyWithoutActorNestedInput;
  };

  export type UserUncheckedUpdateWithoutPostsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    account?: AccountUncheckedUpdateOneWithoutUserNestedInput;
    profile?: ProfileUncheckedUpdateOneWithoutUserNestedInput;
    following?: FollowUncheckedUpdateManyWithoutFollowerNestedInput;
    followers?: FollowUncheckedUpdateManyWithoutFollowingNestedInput;
    likes?: LikeUncheckedUpdateManyWithoutAuthorNestedInput;
    comments?: CommentUncheckedUpdateManyWithoutAuthorNestedInput;
    chats?: ChatUncheckedUpdateManyWithoutMembersNestedInput;
    createdChats?: ChatUncheckedUpdateManyWithoutCreatorNestedInput;
    sentMessages?: MessageUncheckedUpdateManyWithoutSenderNestedInput;
    recievedNotifications?: NotificationUncheckedUpdateManyWithoutRecipientNestedInput;
    triggeredNotifications?: NotificationUncheckedUpdateManyWithoutActorNestedInput;
  };

  export type PostCreateWithoutAssetsInput = {
    id?: string;
    description?: string | null;
    isArchived?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string | null;
    comments?: CommentCreateNestedManyWithoutPostInput;
    likes?: LikeCreateNestedManyWithoutPostInput;
    author: UserCreateNestedOneWithoutPostsInput;
  };

  export type PostUncheckedCreateWithoutAssetsInput = {
    id?: string;
    authorId: string;
    description?: string | null;
    isArchived?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string | null;
    comments?: CommentUncheckedCreateNestedManyWithoutPostInput;
    likes?: LikeUncheckedCreateNestedManyWithoutPostInput;
  };

  export type PostCreateOrConnectWithoutAssetsInput = {
    where: PostWhereUniqueInput;
    create: XOR<
      PostCreateWithoutAssetsInput,
      PostUncheckedCreateWithoutAssetsInput
    >;
  };

  export type MessageCreateWithoutAssetsInput = {
    id?: string;
    content?: string | null;
    isRead?: boolean;
    isEdited?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string | null;
    chat: ChatCreateNestedOneWithoutMessagesInput;
    sender: UserCreateNestedOneWithoutSentMessagesInput;
  };

  export type MessageUncheckedCreateWithoutAssetsInput = {
    id?: string;
    content?: string | null;
    isRead?: boolean;
    isEdited?: boolean;
    chatId: string;
    senderId: string;
    createdAt?: Date | string;
    updatedAt?: Date | string | null;
  };

  export type MessageCreateOrConnectWithoutAssetsInput = {
    where: MessageWhereUniqueInput;
    create: XOR<
      MessageCreateWithoutAssetsInput,
      MessageUncheckedCreateWithoutAssetsInput
    >;
  };

  export type PostUpsertWithoutAssetsInput = {
    update: XOR<
      PostUpdateWithoutAssetsInput,
      PostUncheckedUpdateWithoutAssetsInput
    >;
    create: XOR<
      PostCreateWithoutAssetsInput,
      PostUncheckedCreateWithoutAssetsInput
    >;
    where?: PostWhereInput;
  };

  export type PostUpdateToOneWithWhereWithoutAssetsInput = {
    where?: PostWhereInput;
    data: XOR<
      PostUpdateWithoutAssetsInput,
      PostUncheckedUpdateWithoutAssetsInput
    >;
  };

  export type PostUpdateWithoutAssetsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    isArchived?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    comments?: CommentUpdateManyWithoutPostNestedInput;
    likes?: LikeUpdateManyWithoutPostNestedInput;
    author?: UserUpdateOneRequiredWithoutPostsNestedInput;
  };

  export type PostUncheckedUpdateWithoutAssetsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    authorId?: StringFieldUpdateOperationsInput | string;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    isArchived?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    comments?: CommentUncheckedUpdateManyWithoutPostNestedInput;
    likes?: LikeUncheckedUpdateManyWithoutPostNestedInput;
  };

  export type MessageUpsertWithoutAssetsInput = {
    update: XOR<
      MessageUpdateWithoutAssetsInput,
      MessageUncheckedUpdateWithoutAssetsInput
    >;
    create: XOR<
      MessageCreateWithoutAssetsInput,
      MessageUncheckedCreateWithoutAssetsInput
    >;
    where?: MessageWhereInput;
  };

  export type MessageUpdateToOneWithWhereWithoutAssetsInput = {
    where?: MessageWhereInput;
    data: XOR<
      MessageUpdateWithoutAssetsInput,
      MessageUncheckedUpdateWithoutAssetsInput
    >;
  };

  export type MessageUpdateWithoutAssetsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    content?: NullableStringFieldUpdateOperationsInput | string | null;
    isRead?: BoolFieldUpdateOperationsInput | boolean;
    isEdited?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    chat?: ChatUpdateOneRequiredWithoutMessagesNestedInput;
    sender?: UserUpdateOneRequiredWithoutSentMessagesNestedInput;
  };

  export type MessageUncheckedUpdateWithoutAssetsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    content?: NullableStringFieldUpdateOperationsInput | string | null;
    isRead?: BoolFieldUpdateOperationsInput | boolean;
    isEdited?: BoolFieldUpdateOperationsInput | boolean;
    chatId?: StringFieldUpdateOperationsInput | string;
    senderId?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
  };

  export type CommentCreateWithoutChildrenInput = {
    id?: string;
    content: string;
    createdAt?: Date | string;
    parent?: CommentCreateNestedOneWithoutChildrenInput;
    likes?: LikeCreateNestedManyWithoutCommentInput;
    post: PostCreateNestedOneWithoutCommentsInput;
    author: UserCreateNestedOneWithoutCommentsInput;
  };

  export type CommentUncheckedCreateWithoutChildrenInput = {
    id?: string;
    authorId: string;
    postId: string;
    parentId?: string | null;
    content: string;
    createdAt?: Date | string;
    likes?: LikeUncheckedCreateNestedManyWithoutCommentInput;
  };

  export type CommentCreateOrConnectWithoutChildrenInput = {
    where: CommentWhereUniqueInput;
    create: XOR<
      CommentCreateWithoutChildrenInput,
      CommentUncheckedCreateWithoutChildrenInput
    >;
  };

  export type CommentCreateWithoutParentInput = {
    id?: string;
    content: string;
    createdAt?: Date | string;
    children?: CommentCreateNestedManyWithoutParentInput;
    likes?: LikeCreateNestedManyWithoutCommentInput;
    post: PostCreateNestedOneWithoutCommentsInput;
    author: UserCreateNestedOneWithoutCommentsInput;
  };

  export type CommentUncheckedCreateWithoutParentInput = {
    id?: string;
    authorId: string;
    postId: string;
    content: string;
    createdAt?: Date | string;
    children?: CommentUncheckedCreateNestedManyWithoutParentInput;
    likes?: LikeUncheckedCreateNestedManyWithoutCommentInput;
  };

  export type CommentCreateOrConnectWithoutParentInput = {
    where: CommentWhereUniqueInput;
    create: XOR<
      CommentCreateWithoutParentInput,
      CommentUncheckedCreateWithoutParentInput
    >;
  };

  export type CommentCreateManyParentInputEnvelope = {
    data: CommentCreateManyParentInput | CommentCreateManyParentInput[];
    skipDuplicates?: boolean;
  };

  export type LikeCreateWithoutCommentInput = {
    id?: string;
    createdAt?: Date | string;
    post?: PostCreateNestedOneWithoutLikesInput;
    author: UserCreateNestedOneWithoutLikesInput;
  };

  export type LikeUncheckedCreateWithoutCommentInput = {
    id?: string;
    authorId: string;
    postId?: string | null;
    createdAt?: Date | string;
  };

  export type LikeCreateOrConnectWithoutCommentInput = {
    where: LikeWhereUniqueInput;
    create: XOR<
      LikeCreateWithoutCommentInput,
      LikeUncheckedCreateWithoutCommentInput
    >;
  };

  export type LikeCreateManyCommentInputEnvelope = {
    data: LikeCreateManyCommentInput | LikeCreateManyCommentInput[];
    skipDuplicates?: boolean;
  };

  export type PostCreateWithoutCommentsInput = {
    id?: string;
    description?: string | null;
    isArchived?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string | null;
    assets?: AssetCreateNestedManyWithoutPostInput;
    likes?: LikeCreateNestedManyWithoutPostInput;
    author: UserCreateNestedOneWithoutPostsInput;
  };

  export type PostUncheckedCreateWithoutCommentsInput = {
    id?: string;
    authorId: string;
    description?: string | null;
    isArchived?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string | null;
    assets?: AssetUncheckedCreateNestedManyWithoutPostInput;
    likes?: LikeUncheckedCreateNestedManyWithoutPostInput;
  };

  export type PostCreateOrConnectWithoutCommentsInput = {
    where: PostWhereUniqueInput;
    create: XOR<
      PostCreateWithoutCommentsInput,
      PostUncheckedCreateWithoutCommentsInput
    >;
  };

  export type UserCreateWithoutCommentsInput = {
    id?: string;
    createdAt?: Date | string;
    deletedAt?: Date | string | null;
    account?: AccountCreateNestedOneWithoutUserInput;
    profile?: ProfileCreateNestedOneWithoutUserInput;
    following?: FollowCreateNestedManyWithoutFollowerInput;
    followers?: FollowCreateNestedManyWithoutFollowingInput;
    posts?: PostCreateNestedManyWithoutAuthorInput;
    likes?: LikeCreateNestedManyWithoutAuthorInput;
    chats?: ChatCreateNestedManyWithoutMembersInput;
    createdChats?: ChatCreateNestedManyWithoutCreatorInput;
    sentMessages?: MessageCreateNestedManyWithoutSenderInput;
    recievedNotifications?: NotificationCreateNestedManyWithoutRecipientInput;
    triggeredNotifications?: NotificationCreateNestedManyWithoutActorInput;
  };

  export type UserUncheckedCreateWithoutCommentsInput = {
    id?: string;
    createdAt?: Date | string;
    deletedAt?: Date | string | null;
    account?: AccountUncheckedCreateNestedOneWithoutUserInput;
    profile?: ProfileUncheckedCreateNestedOneWithoutUserInput;
    following?: FollowUncheckedCreateNestedManyWithoutFollowerInput;
    followers?: FollowUncheckedCreateNestedManyWithoutFollowingInput;
    posts?: PostUncheckedCreateNestedManyWithoutAuthorInput;
    likes?: LikeUncheckedCreateNestedManyWithoutAuthorInput;
    chats?: ChatUncheckedCreateNestedManyWithoutMembersInput;
    createdChats?: ChatUncheckedCreateNestedManyWithoutCreatorInput;
    sentMessages?: MessageUncheckedCreateNestedManyWithoutSenderInput;
    recievedNotifications?: NotificationUncheckedCreateNestedManyWithoutRecipientInput;
    triggeredNotifications?: NotificationUncheckedCreateNestedManyWithoutActorInput;
  };

  export type UserCreateOrConnectWithoutCommentsInput = {
    where: UserWhereUniqueInput;
    create: XOR<
      UserCreateWithoutCommentsInput,
      UserUncheckedCreateWithoutCommentsInput
    >;
  };

  export type CommentUpsertWithoutChildrenInput = {
    update: XOR<
      CommentUpdateWithoutChildrenInput,
      CommentUncheckedUpdateWithoutChildrenInput
    >;
    create: XOR<
      CommentCreateWithoutChildrenInput,
      CommentUncheckedCreateWithoutChildrenInput
    >;
    where?: CommentWhereInput;
  };

  export type CommentUpdateToOneWithWhereWithoutChildrenInput = {
    where?: CommentWhereInput;
    data: XOR<
      CommentUpdateWithoutChildrenInput,
      CommentUncheckedUpdateWithoutChildrenInput
    >;
  };

  export type CommentUpdateWithoutChildrenInput = {
    id?: StringFieldUpdateOperationsInput | string;
    content?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    parent?: CommentUpdateOneWithoutChildrenNestedInput;
    likes?: LikeUpdateManyWithoutCommentNestedInput;
    post?: PostUpdateOneRequiredWithoutCommentsNestedInput;
    author?: UserUpdateOneRequiredWithoutCommentsNestedInput;
  };

  export type CommentUncheckedUpdateWithoutChildrenInput = {
    id?: StringFieldUpdateOperationsInput | string;
    authorId?: StringFieldUpdateOperationsInput | string;
    postId?: StringFieldUpdateOperationsInput | string;
    parentId?: NullableStringFieldUpdateOperationsInput | string | null;
    content?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    likes?: LikeUncheckedUpdateManyWithoutCommentNestedInput;
  };

  export type CommentUpsertWithWhereUniqueWithoutParentInput = {
    where: CommentWhereUniqueInput;
    update: XOR<
      CommentUpdateWithoutParentInput,
      CommentUncheckedUpdateWithoutParentInput
    >;
    create: XOR<
      CommentCreateWithoutParentInput,
      CommentUncheckedCreateWithoutParentInput
    >;
  };

  export type CommentUpdateWithWhereUniqueWithoutParentInput = {
    where: CommentWhereUniqueInput;
    data: XOR<
      CommentUpdateWithoutParentInput,
      CommentUncheckedUpdateWithoutParentInput
    >;
  };

  export type CommentUpdateManyWithWhereWithoutParentInput = {
    where: CommentScalarWhereInput;
    data: XOR<
      CommentUpdateManyMutationInput,
      CommentUncheckedUpdateManyWithoutParentInput
    >;
  };

  export type LikeUpsertWithWhereUniqueWithoutCommentInput = {
    where: LikeWhereUniqueInput;
    update: XOR<
      LikeUpdateWithoutCommentInput,
      LikeUncheckedUpdateWithoutCommentInput
    >;
    create: XOR<
      LikeCreateWithoutCommentInput,
      LikeUncheckedCreateWithoutCommentInput
    >;
  };

  export type LikeUpdateWithWhereUniqueWithoutCommentInput = {
    where: LikeWhereUniqueInput;
    data: XOR<
      LikeUpdateWithoutCommentInput,
      LikeUncheckedUpdateWithoutCommentInput
    >;
  };

  export type LikeUpdateManyWithWhereWithoutCommentInput = {
    where: LikeScalarWhereInput;
    data: XOR<
      LikeUpdateManyMutationInput,
      LikeUncheckedUpdateManyWithoutCommentInput
    >;
  };

  export type PostUpsertWithoutCommentsInput = {
    update: XOR<
      PostUpdateWithoutCommentsInput,
      PostUncheckedUpdateWithoutCommentsInput
    >;
    create: XOR<
      PostCreateWithoutCommentsInput,
      PostUncheckedCreateWithoutCommentsInput
    >;
    where?: PostWhereInput;
  };

  export type PostUpdateToOneWithWhereWithoutCommentsInput = {
    where?: PostWhereInput;
    data: XOR<
      PostUpdateWithoutCommentsInput,
      PostUncheckedUpdateWithoutCommentsInput
    >;
  };

  export type PostUpdateWithoutCommentsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    isArchived?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    assets?: AssetUpdateManyWithoutPostNestedInput;
    likes?: LikeUpdateManyWithoutPostNestedInput;
    author?: UserUpdateOneRequiredWithoutPostsNestedInput;
  };

  export type PostUncheckedUpdateWithoutCommentsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    authorId?: StringFieldUpdateOperationsInput | string;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    isArchived?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    assets?: AssetUncheckedUpdateManyWithoutPostNestedInput;
    likes?: LikeUncheckedUpdateManyWithoutPostNestedInput;
  };

  export type UserUpsertWithoutCommentsInput = {
    update: XOR<
      UserUpdateWithoutCommentsInput,
      UserUncheckedUpdateWithoutCommentsInput
    >;
    create: XOR<
      UserCreateWithoutCommentsInput,
      UserUncheckedCreateWithoutCommentsInput
    >;
    where?: UserWhereInput;
  };

  export type UserUpdateToOneWithWhereWithoutCommentsInput = {
    where?: UserWhereInput;
    data: XOR<
      UserUpdateWithoutCommentsInput,
      UserUncheckedUpdateWithoutCommentsInput
    >;
  };

  export type UserUpdateWithoutCommentsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    account?: AccountUpdateOneWithoutUserNestedInput;
    profile?: ProfileUpdateOneWithoutUserNestedInput;
    following?: FollowUpdateManyWithoutFollowerNestedInput;
    followers?: FollowUpdateManyWithoutFollowingNestedInput;
    posts?: PostUpdateManyWithoutAuthorNestedInput;
    likes?: LikeUpdateManyWithoutAuthorNestedInput;
    chats?: ChatUpdateManyWithoutMembersNestedInput;
    createdChats?: ChatUpdateManyWithoutCreatorNestedInput;
    sentMessages?: MessageUpdateManyWithoutSenderNestedInput;
    recievedNotifications?: NotificationUpdateManyWithoutRecipientNestedInput;
    triggeredNotifications?: NotificationUpdateManyWithoutActorNestedInput;
  };

  export type UserUncheckedUpdateWithoutCommentsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    account?: AccountUncheckedUpdateOneWithoutUserNestedInput;
    profile?: ProfileUncheckedUpdateOneWithoutUserNestedInput;
    following?: FollowUncheckedUpdateManyWithoutFollowerNestedInput;
    followers?: FollowUncheckedUpdateManyWithoutFollowingNestedInput;
    posts?: PostUncheckedUpdateManyWithoutAuthorNestedInput;
    likes?: LikeUncheckedUpdateManyWithoutAuthorNestedInput;
    chats?: ChatUncheckedUpdateManyWithoutMembersNestedInput;
    createdChats?: ChatUncheckedUpdateManyWithoutCreatorNestedInput;
    sentMessages?: MessageUncheckedUpdateManyWithoutSenderNestedInput;
    recievedNotifications?: NotificationUncheckedUpdateManyWithoutRecipientNestedInput;
    triggeredNotifications?: NotificationUncheckedUpdateManyWithoutActorNestedInput;
  };

  export type PostCreateWithoutLikesInput = {
    id?: string;
    description?: string | null;
    isArchived?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string | null;
    assets?: AssetCreateNestedManyWithoutPostInput;
    comments?: CommentCreateNestedManyWithoutPostInput;
    author: UserCreateNestedOneWithoutPostsInput;
  };

  export type PostUncheckedCreateWithoutLikesInput = {
    id?: string;
    authorId: string;
    description?: string | null;
    isArchived?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string | null;
    assets?: AssetUncheckedCreateNestedManyWithoutPostInput;
    comments?: CommentUncheckedCreateNestedManyWithoutPostInput;
  };

  export type PostCreateOrConnectWithoutLikesInput = {
    where: PostWhereUniqueInput;
    create: XOR<
      PostCreateWithoutLikesInput,
      PostUncheckedCreateWithoutLikesInput
    >;
  };

  export type CommentCreateWithoutLikesInput = {
    id?: string;
    content: string;
    createdAt?: Date | string;
    parent?: CommentCreateNestedOneWithoutChildrenInput;
    children?: CommentCreateNestedManyWithoutParentInput;
    post: PostCreateNestedOneWithoutCommentsInput;
    author: UserCreateNestedOneWithoutCommentsInput;
  };

  export type CommentUncheckedCreateWithoutLikesInput = {
    id?: string;
    authorId: string;
    postId: string;
    parentId?: string | null;
    content: string;
    createdAt?: Date | string;
    children?: CommentUncheckedCreateNestedManyWithoutParentInput;
  };

  export type CommentCreateOrConnectWithoutLikesInput = {
    where: CommentWhereUniqueInput;
    create: XOR<
      CommentCreateWithoutLikesInput,
      CommentUncheckedCreateWithoutLikesInput
    >;
  };

  export type UserCreateWithoutLikesInput = {
    id?: string;
    createdAt?: Date | string;
    deletedAt?: Date | string | null;
    account?: AccountCreateNestedOneWithoutUserInput;
    profile?: ProfileCreateNestedOneWithoutUserInput;
    following?: FollowCreateNestedManyWithoutFollowerInput;
    followers?: FollowCreateNestedManyWithoutFollowingInput;
    posts?: PostCreateNestedManyWithoutAuthorInput;
    comments?: CommentCreateNestedManyWithoutAuthorInput;
    chats?: ChatCreateNestedManyWithoutMembersInput;
    createdChats?: ChatCreateNestedManyWithoutCreatorInput;
    sentMessages?: MessageCreateNestedManyWithoutSenderInput;
    recievedNotifications?: NotificationCreateNestedManyWithoutRecipientInput;
    triggeredNotifications?: NotificationCreateNestedManyWithoutActorInput;
  };

  export type UserUncheckedCreateWithoutLikesInput = {
    id?: string;
    createdAt?: Date | string;
    deletedAt?: Date | string | null;
    account?: AccountUncheckedCreateNestedOneWithoutUserInput;
    profile?: ProfileUncheckedCreateNestedOneWithoutUserInput;
    following?: FollowUncheckedCreateNestedManyWithoutFollowerInput;
    followers?: FollowUncheckedCreateNestedManyWithoutFollowingInput;
    posts?: PostUncheckedCreateNestedManyWithoutAuthorInput;
    comments?: CommentUncheckedCreateNestedManyWithoutAuthorInput;
    chats?: ChatUncheckedCreateNestedManyWithoutMembersInput;
    createdChats?: ChatUncheckedCreateNestedManyWithoutCreatorInput;
    sentMessages?: MessageUncheckedCreateNestedManyWithoutSenderInput;
    recievedNotifications?: NotificationUncheckedCreateNestedManyWithoutRecipientInput;
    triggeredNotifications?: NotificationUncheckedCreateNestedManyWithoutActorInput;
  };

  export type UserCreateOrConnectWithoutLikesInput = {
    where: UserWhereUniqueInput;
    create: XOR<
      UserCreateWithoutLikesInput,
      UserUncheckedCreateWithoutLikesInput
    >;
  };

  export type PostUpsertWithoutLikesInput = {
    update: XOR<
      PostUpdateWithoutLikesInput,
      PostUncheckedUpdateWithoutLikesInput
    >;
    create: XOR<
      PostCreateWithoutLikesInput,
      PostUncheckedCreateWithoutLikesInput
    >;
    where?: PostWhereInput;
  };

  export type PostUpdateToOneWithWhereWithoutLikesInput = {
    where?: PostWhereInput;
    data: XOR<
      PostUpdateWithoutLikesInput,
      PostUncheckedUpdateWithoutLikesInput
    >;
  };

  export type PostUpdateWithoutLikesInput = {
    id?: StringFieldUpdateOperationsInput | string;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    isArchived?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    assets?: AssetUpdateManyWithoutPostNestedInput;
    comments?: CommentUpdateManyWithoutPostNestedInput;
    author?: UserUpdateOneRequiredWithoutPostsNestedInput;
  };

  export type PostUncheckedUpdateWithoutLikesInput = {
    id?: StringFieldUpdateOperationsInput | string;
    authorId?: StringFieldUpdateOperationsInput | string;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    isArchived?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    assets?: AssetUncheckedUpdateManyWithoutPostNestedInput;
    comments?: CommentUncheckedUpdateManyWithoutPostNestedInput;
  };

  export type CommentUpsertWithoutLikesInput = {
    update: XOR<
      CommentUpdateWithoutLikesInput,
      CommentUncheckedUpdateWithoutLikesInput
    >;
    create: XOR<
      CommentCreateWithoutLikesInput,
      CommentUncheckedCreateWithoutLikesInput
    >;
    where?: CommentWhereInput;
  };

  export type CommentUpdateToOneWithWhereWithoutLikesInput = {
    where?: CommentWhereInput;
    data: XOR<
      CommentUpdateWithoutLikesInput,
      CommentUncheckedUpdateWithoutLikesInput
    >;
  };

  export type CommentUpdateWithoutLikesInput = {
    id?: StringFieldUpdateOperationsInput | string;
    content?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    parent?: CommentUpdateOneWithoutChildrenNestedInput;
    children?: CommentUpdateManyWithoutParentNestedInput;
    post?: PostUpdateOneRequiredWithoutCommentsNestedInput;
    author?: UserUpdateOneRequiredWithoutCommentsNestedInput;
  };

  export type CommentUncheckedUpdateWithoutLikesInput = {
    id?: StringFieldUpdateOperationsInput | string;
    authorId?: StringFieldUpdateOperationsInput | string;
    postId?: StringFieldUpdateOperationsInput | string;
    parentId?: NullableStringFieldUpdateOperationsInput | string | null;
    content?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    children?: CommentUncheckedUpdateManyWithoutParentNestedInput;
  };

  export type UserUpsertWithoutLikesInput = {
    update: XOR<
      UserUpdateWithoutLikesInput,
      UserUncheckedUpdateWithoutLikesInput
    >;
    create: XOR<
      UserCreateWithoutLikesInput,
      UserUncheckedCreateWithoutLikesInput
    >;
    where?: UserWhereInput;
  };

  export type UserUpdateToOneWithWhereWithoutLikesInput = {
    where?: UserWhereInput;
    data: XOR<
      UserUpdateWithoutLikesInput,
      UserUncheckedUpdateWithoutLikesInput
    >;
  };

  export type UserUpdateWithoutLikesInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    account?: AccountUpdateOneWithoutUserNestedInput;
    profile?: ProfileUpdateOneWithoutUserNestedInput;
    following?: FollowUpdateManyWithoutFollowerNestedInput;
    followers?: FollowUpdateManyWithoutFollowingNestedInput;
    posts?: PostUpdateManyWithoutAuthorNestedInput;
    comments?: CommentUpdateManyWithoutAuthorNestedInput;
    chats?: ChatUpdateManyWithoutMembersNestedInput;
    createdChats?: ChatUpdateManyWithoutCreatorNestedInput;
    sentMessages?: MessageUpdateManyWithoutSenderNestedInput;
    recievedNotifications?: NotificationUpdateManyWithoutRecipientNestedInput;
    triggeredNotifications?: NotificationUpdateManyWithoutActorNestedInput;
  };

  export type UserUncheckedUpdateWithoutLikesInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    account?: AccountUncheckedUpdateOneWithoutUserNestedInput;
    profile?: ProfileUncheckedUpdateOneWithoutUserNestedInput;
    following?: FollowUncheckedUpdateManyWithoutFollowerNestedInput;
    followers?: FollowUncheckedUpdateManyWithoutFollowingNestedInput;
    posts?: PostUncheckedUpdateManyWithoutAuthorNestedInput;
    comments?: CommentUncheckedUpdateManyWithoutAuthorNestedInput;
    chats?: ChatUncheckedUpdateManyWithoutMembersNestedInput;
    createdChats?: ChatUncheckedUpdateManyWithoutCreatorNestedInput;
    sentMessages?: MessageUncheckedUpdateManyWithoutSenderNestedInput;
    recievedNotifications?: NotificationUncheckedUpdateManyWithoutRecipientNestedInput;
    triggeredNotifications?: NotificationUncheckedUpdateManyWithoutActorNestedInput;
  };

  export type UserCreateWithoutCreatedChatsInput = {
    id?: string;
    createdAt?: Date | string;
    deletedAt?: Date | string | null;
    account?: AccountCreateNestedOneWithoutUserInput;
    profile?: ProfileCreateNestedOneWithoutUserInput;
    following?: FollowCreateNestedManyWithoutFollowerInput;
    followers?: FollowCreateNestedManyWithoutFollowingInput;
    posts?: PostCreateNestedManyWithoutAuthorInput;
    likes?: LikeCreateNestedManyWithoutAuthorInput;
    comments?: CommentCreateNestedManyWithoutAuthorInput;
    chats?: ChatCreateNestedManyWithoutMembersInput;
    sentMessages?: MessageCreateNestedManyWithoutSenderInput;
    recievedNotifications?: NotificationCreateNestedManyWithoutRecipientInput;
    triggeredNotifications?: NotificationCreateNestedManyWithoutActorInput;
  };

  export type UserUncheckedCreateWithoutCreatedChatsInput = {
    id?: string;
    createdAt?: Date | string;
    deletedAt?: Date | string | null;
    account?: AccountUncheckedCreateNestedOneWithoutUserInput;
    profile?: ProfileUncheckedCreateNestedOneWithoutUserInput;
    following?: FollowUncheckedCreateNestedManyWithoutFollowerInput;
    followers?: FollowUncheckedCreateNestedManyWithoutFollowingInput;
    posts?: PostUncheckedCreateNestedManyWithoutAuthorInput;
    likes?: LikeUncheckedCreateNestedManyWithoutAuthorInput;
    comments?: CommentUncheckedCreateNestedManyWithoutAuthorInput;
    chats?: ChatUncheckedCreateNestedManyWithoutMembersInput;
    sentMessages?: MessageUncheckedCreateNestedManyWithoutSenderInput;
    recievedNotifications?: NotificationUncheckedCreateNestedManyWithoutRecipientInput;
    triggeredNotifications?: NotificationUncheckedCreateNestedManyWithoutActorInput;
  };

  export type UserCreateOrConnectWithoutCreatedChatsInput = {
    where: UserWhereUniqueInput;
    create: XOR<
      UserCreateWithoutCreatedChatsInput,
      UserUncheckedCreateWithoutCreatedChatsInput
    >;
  };

  export type UserCreateWithoutChatsInput = {
    id?: string;
    createdAt?: Date | string;
    deletedAt?: Date | string | null;
    account?: AccountCreateNestedOneWithoutUserInput;
    profile?: ProfileCreateNestedOneWithoutUserInput;
    following?: FollowCreateNestedManyWithoutFollowerInput;
    followers?: FollowCreateNestedManyWithoutFollowingInput;
    posts?: PostCreateNestedManyWithoutAuthorInput;
    likes?: LikeCreateNestedManyWithoutAuthorInput;
    comments?: CommentCreateNestedManyWithoutAuthorInput;
    createdChats?: ChatCreateNestedManyWithoutCreatorInput;
    sentMessages?: MessageCreateNestedManyWithoutSenderInput;
    recievedNotifications?: NotificationCreateNestedManyWithoutRecipientInput;
    triggeredNotifications?: NotificationCreateNestedManyWithoutActorInput;
  };

  export type UserUncheckedCreateWithoutChatsInput = {
    id?: string;
    createdAt?: Date | string;
    deletedAt?: Date | string | null;
    account?: AccountUncheckedCreateNestedOneWithoutUserInput;
    profile?: ProfileUncheckedCreateNestedOneWithoutUserInput;
    following?: FollowUncheckedCreateNestedManyWithoutFollowerInput;
    followers?: FollowUncheckedCreateNestedManyWithoutFollowingInput;
    posts?: PostUncheckedCreateNestedManyWithoutAuthorInput;
    likes?: LikeUncheckedCreateNestedManyWithoutAuthorInput;
    comments?: CommentUncheckedCreateNestedManyWithoutAuthorInput;
    createdChats?: ChatUncheckedCreateNestedManyWithoutCreatorInput;
    sentMessages?: MessageUncheckedCreateNestedManyWithoutSenderInput;
    recievedNotifications?: NotificationUncheckedCreateNestedManyWithoutRecipientInput;
    triggeredNotifications?: NotificationUncheckedCreateNestedManyWithoutActorInput;
  };

  export type UserCreateOrConnectWithoutChatsInput = {
    where: UserWhereUniqueInput;
    create: XOR<
      UserCreateWithoutChatsInput,
      UserUncheckedCreateWithoutChatsInput
    >;
  };

  export type MessageCreateWithoutChatInput = {
    id?: string;
    content?: string | null;
    isRead?: boolean;
    isEdited?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string | null;
    assets?: AssetCreateNestedManyWithoutMessageInput;
    sender: UserCreateNestedOneWithoutSentMessagesInput;
  };

  export type MessageUncheckedCreateWithoutChatInput = {
    id?: string;
    content?: string | null;
    isRead?: boolean;
    isEdited?: boolean;
    senderId: string;
    createdAt?: Date | string;
    updatedAt?: Date | string | null;
    assets?: AssetUncheckedCreateNestedManyWithoutMessageInput;
  };

  export type MessageCreateOrConnectWithoutChatInput = {
    where: MessageWhereUniqueInput;
    create: XOR<
      MessageCreateWithoutChatInput,
      MessageUncheckedCreateWithoutChatInput
    >;
  };

  export type MessageCreateManyChatInputEnvelope = {
    data: MessageCreateManyChatInput | MessageCreateManyChatInput[];
    skipDuplicates?: boolean;
  };

  export type UserUpsertWithoutCreatedChatsInput = {
    update: XOR<
      UserUpdateWithoutCreatedChatsInput,
      UserUncheckedUpdateWithoutCreatedChatsInput
    >;
    create: XOR<
      UserCreateWithoutCreatedChatsInput,
      UserUncheckedCreateWithoutCreatedChatsInput
    >;
    where?: UserWhereInput;
  };

  export type UserUpdateToOneWithWhereWithoutCreatedChatsInput = {
    where?: UserWhereInput;
    data: XOR<
      UserUpdateWithoutCreatedChatsInput,
      UserUncheckedUpdateWithoutCreatedChatsInput
    >;
  };

  export type UserUpdateWithoutCreatedChatsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    account?: AccountUpdateOneWithoutUserNestedInput;
    profile?: ProfileUpdateOneWithoutUserNestedInput;
    following?: FollowUpdateManyWithoutFollowerNestedInput;
    followers?: FollowUpdateManyWithoutFollowingNestedInput;
    posts?: PostUpdateManyWithoutAuthorNestedInput;
    likes?: LikeUpdateManyWithoutAuthorNestedInput;
    comments?: CommentUpdateManyWithoutAuthorNestedInput;
    chats?: ChatUpdateManyWithoutMembersNestedInput;
    sentMessages?: MessageUpdateManyWithoutSenderNestedInput;
    recievedNotifications?: NotificationUpdateManyWithoutRecipientNestedInput;
    triggeredNotifications?: NotificationUpdateManyWithoutActorNestedInput;
  };

  export type UserUncheckedUpdateWithoutCreatedChatsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    account?: AccountUncheckedUpdateOneWithoutUserNestedInput;
    profile?: ProfileUncheckedUpdateOneWithoutUserNestedInput;
    following?: FollowUncheckedUpdateManyWithoutFollowerNestedInput;
    followers?: FollowUncheckedUpdateManyWithoutFollowingNestedInput;
    posts?: PostUncheckedUpdateManyWithoutAuthorNestedInput;
    likes?: LikeUncheckedUpdateManyWithoutAuthorNestedInput;
    comments?: CommentUncheckedUpdateManyWithoutAuthorNestedInput;
    chats?: ChatUncheckedUpdateManyWithoutMembersNestedInput;
    sentMessages?: MessageUncheckedUpdateManyWithoutSenderNestedInput;
    recievedNotifications?: NotificationUncheckedUpdateManyWithoutRecipientNestedInput;
    triggeredNotifications?: NotificationUncheckedUpdateManyWithoutActorNestedInput;
  };

  export type UserUpsertWithWhereUniqueWithoutChatsInput = {
    where: UserWhereUniqueInput;
    update: XOR<
      UserUpdateWithoutChatsInput,
      UserUncheckedUpdateWithoutChatsInput
    >;
    create: XOR<
      UserCreateWithoutChatsInput,
      UserUncheckedCreateWithoutChatsInput
    >;
  };

  export type UserUpdateWithWhereUniqueWithoutChatsInput = {
    where: UserWhereUniqueInput;
    data: XOR<
      UserUpdateWithoutChatsInput,
      UserUncheckedUpdateWithoutChatsInput
    >;
  };

  export type UserUpdateManyWithWhereWithoutChatsInput = {
    where: UserScalarWhereInput;
    data: XOR<
      UserUpdateManyMutationInput,
      UserUncheckedUpdateManyWithoutChatsInput
    >;
  };

  export type UserScalarWhereInput = {
    AND?: UserScalarWhereInput | UserScalarWhereInput[];
    OR?: UserScalarWhereInput[];
    NOT?: UserScalarWhereInput | UserScalarWhereInput[];
    id?: StringFilter<'User'> | string;
    createdAt?: DateTimeFilter<'User'> | Date | string;
    deletedAt?: DateTimeNullableFilter<'User'> | Date | string | null;
  };

  export type MessageUpsertWithWhereUniqueWithoutChatInput = {
    where: MessageWhereUniqueInput;
    update: XOR<
      MessageUpdateWithoutChatInput,
      MessageUncheckedUpdateWithoutChatInput
    >;
    create: XOR<
      MessageCreateWithoutChatInput,
      MessageUncheckedCreateWithoutChatInput
    >;
  };

  export type MessageUpdateWithWhereUniqueWithoutChatInput = {
    where: MessageWhereUniqueInput;
    data: XOR<
      MessageUpdateWithoutChatInput,
      MessageUncheckedUpdateWithoutChatInput
    >;
  };

  export type MessageUpdateManyWithWhereWithoutChatInput = {
    where: MessageScalarWhereInput;
    data: XOR<
      MessageUpdateManyMutationInput,
      MessageUncheckedUpdateManyWithoutChatInput
    >;
  };

  export type AssetCreateWithoutMessageInput = {
    id?: string;
    url: string;
    type?: $Enums.AssetType;
    post?: PostCreateNestedOneWithoutAssetsInput;
  };

  export type AssetUncheckedCreateWithoutMessageInput = {
    id?: string;
    url: string;
    type?: $Enums.AssetType;
    postId?: string | null;
  };

  export type AssetCreateOrConnectWithoutMessageInput = {
    where: AssetWhereUniqueInput;
    create: XOR<
      AssetCreateWithoutMessageInput,
      AssetUncheckedCreateWithoutMessageInput
    >;
  };

  export type AssetCreateManyMessageInputEnvelope = {
    data: AssetCreateManyMessageInput | AssetCreateManyMessageInput[];
    skipDuplicates?: boolean;
  };

  export type ChatCreateWithoutMessagesInput = {
    id?: string;
    name?: string | null;
    type?: $Enums.ChatType;
    creator?: UserCreateNestedOneWithoutCreatedChatsInput;
    members?: UserCreateNestedManyWithoutChatsInput;
  };

  export type ChatUncheckedCreateWithoutMessagesInput = {
    id?: string;
    name?: string | null;
    type?: $Enums.ChatType;
    creatorId?: string | null;
    members?: UserUncheckedCreateNestedManyWithoutChatsInput;
  };

  export type ChatCreateOrConnectWithoutMessagesInput = {
    where: ChatWhereUniqueInput;
    create: XOR<
      ChatCreateWithoutMessagesInput,
      ChatUncheckedCreateWithoutMessagesInput
    >;
  };

  export type UserCreateWithoutSentMessagesInput = {
    id?: string;
    createdAt?: Date | string;
    deletedAt?: Date | string | null;
    account?: AccountCreateNestedOneWithoutUserInput;
    profile?: ProfileCreateNestedOneWithoutUserInput;
    following?: FollowCreateNestedManyWithoutFollowerInput;
    followers?: FollowCreateNestedManyWithoutFollowingInput;
    posts?: PostCreateNestedManyWithoutAuthorInput;
    likes?: LikeCreateNestedManyWithoutAuthorInput;
    comments?: CommentCreateNestedManyWithoutAuthorInput;
    chats?: ChatCreateNestedManyWithoutMembersInput;
    createdChats?: ChatCreateNestedManyWithoutCreatorInput;
    recievedNotifications?: NotificationCreateNestedManyWithoutRecipientInput;
    triggeredNotifications?: NotificationCreateNestedManyWithoutActorInput;
  };

  export type UserUncheckedCreateWithoutSentMessagesInput = {
    id?: string;
    createdAt?: Date | string;
    deletedAt?: Date | string | null;
    account?: AccountUncheckedCreateNestedOneWithoutUserInput;
    profile?: ProfileUncheckedCreateNestedOneWithoutUserInput;
    following?: FollowUncheckedCreateNestedManyWithoutFollowerInput;
    followers?: FollowUncheckedCreateNestedManyWithoutFollowingInput;
    posts?: PostUncheckedCreateNestedManyWithoutAuthorInput;
    likes?: LikeUncheckedCreateNestedManyWithoutAuthorInput;
    comments?: CommentUncheckedCreateNestedManyWithoutAuthorInput;
    chats?: ChatUncheckedCreateNestedManyWithoutMembersInput;
    createdChats?: ChatUncheckedCreateNestedManyWithoutCreatorInput;
    recievedNotifications?: NotificationUncheckedCreateNestedManyWithoutRecipientInput;
    triggeredNotifications?: NotificationUncheckedCreateNestedManyWithoutActorInput;
  };

  export type UserCreateOrConnectWithoutSentMessagesInput = {
    where: UserWhereUniqueInput;
    create: XOR<
      UserCreateWithoutSentMessagesInput,
      UserUncheckedCreateWithoutSentMessagesInput
    >;
  };

  export type AssetUpsertWithWhereUniqueWithoutMessageInput = {
    where: AssetWhereUniqueInput;
    update: XOR<
      AssetUpdateWithoutMessageInput,
      AssetUncheckedUpdateWithoutMessageInput
    >;
    create: XOR<
      AssetCreateWithoutMessageInput,
      AssetUncheckedCreateWithoutMessageInput
    >;
  };

  export type AssetUpdateWithWhereUniqueWithoutMessageInput = {
    where: AssetWhereUniqueInput;
    data: XOR<
      AssetUpdateWithoutMessageInput,
      AssetUncheckedUpdateWithoutMessageInput
    >;
  };

  export type AssetUpdateManyWithWhereWithoutMessageInput = {
    where: AssetScalarWhereInput;
    data: XOR<
      AssetUpdateManyMutationInput,
      AssetUncheckedUpdateManyWithoutMessageInput
    >;
  };

  export type ChatUpsertWithoutMessagesInput = {
    update: XOR<
      ChatUpdateWithoutMessagesInput,
      ChatUncheckedUpdateWithoutMessagesInput
    >;
    create: XOR<
      ChatCreateWithoutMessagesInput,
      ChatUncheckedCreateWithoutMessagesInput
    >;
    where?: ChatWhereInput;
  };

  export type ChatUpdateToOneWithWhereWithoutMessagesInput = {
    where?: ChatWhereInput;
    data: XOR<
      ChatUpdateWithoutMessagesInput,
      ChatUncheckedUpdateWithoutMessagesInput
    >;
  };

  export type ChatUpdateWithoutMessagesInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: NullableStringFieldUpdateOperationsInput | string | null;
    type?: EnumChatTypeFieldUpdateOperationsInput | $Enums.ChatType;
    creator?: UserUpdateOneWithoutCreatedChatsNestedInput;
    members?: UserUpdateManyWithoutChatsNestedInput;
  };

  export type ChatUncheckedUpdateWithoutMessagesInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: NullableStringFieldUpdateOperationsInput | string | null;
    type?: EnumChatTypeFieldUpdateOperationsInput | $Enums.ChatType;
    creatorId?: NullableStringFieldUpdateOperationsInput | string | null;
    members?: UserUncheckedUpdateManyWithoutChatsNestedInput;
  };

  export type UserUpsertWithoutSentMessagesInput = {
    update: XOR<
      UserUpdateWithoutSentMessagesInput,
      UserUncheckedUpdateWithoutSentMessagesInput
    >;
    create: XOR<
      UserCreateWithoutSentMessagesInput,
      UserUncheckedCreateWithoutSentMessagesInput
    >;
    where?: UserWhereInput;
  };

  export type UserUpdateToOneWithWhereWithoutSentMessagesInput = {
    where?: UserWhereInput;
    data: XOR<
      UserUpdateWithoutSentMessagesInput,
      UserUncheckedUpdateWithoutSentMessagesInput
    >;
  };

  export type UserUpdateWithoutSentMessagesInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    account?: AccountUpdateOneWithoutUserNestedInput;
    profile?: ProfileUpdateOneWithoutUserNestedInput;
    following?: FollowUpdateManyWithoutFollowerNestedInput;
    followers?: FollowUpdateManyWithoutFollowingNestedInput;
    posts?: PostUpdateManyWithoutAuthorNestedInput;
    likes?: LikeUpdateManyWithoutAuthorNestedInput;
    comments?: CommentUpdateManyWithoutAuthorNestedInput;
    chats?: ChatUpdateManyWithoutMembersNestedInput;
    createdChats?: ChatUpdateManyWithoutCreatorNestedInput;
    recievedNotifications?: NotificationUpdateManyWithoutRecipientNestedInput;
    triggeredNotifications?: NotificationUpdateManyWithoutActorNestedInput;
  };

  export type UserUncheckedUpdateWithoutSentMessagesInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    account?: AccountUncheckedUpdateOneWithoutUserNestedInput;
    profile?: ProfileUncheckedUpdateOneWithoutUserNestedInput;
    following?: FollowUncheckedUpdateManyWithoutFollowerNestedInput;
    followers?: FollowUncheckedUpdateManyWithoutFollowingNestedInput;
    posts?: PostUncheckedUpdateManyWithoutAuthorNestedInput;
    likes?: LikeUncheckedUpdateManyWithoutAuthorNestedInput;
    comments?: CommentUncheckedUpdateManyWithoutAuthorNestedInput;
    chats?: ChatUncheckedUpdateManyWithoutMembersNestedInput;
    createdChats?: ChatUncheckedUpdateManyWithoutCreatorNestedInput;
    recievedNotifications?: NotificationUncheckedUpdateManyWithoutRecipientNestedInput;
    triggeredNotifications?: NotificationUncheckedUpdateManyWithoutActorNestedInput;
  };

  export type UserCreateWithoutRecievedNotificationsInput = {
    id?: string;
    createdAt?: Date | string;
    deletedAt?: Date | string | null;
    account?: AccountCreateNestedOneWithoutUserInput;
    profile?: ProfileCreateNestedOneWithoutUserInput;
    following?: FollowCreateNestedManyWithoutFollowerInput;
    followers?: FollowCreateNestedManyWithoutFollowingInput;
    posts?: PostCreateNestedManyWithoutAuthorInput;
    likes?: LikeCreateNestedManyWithoutAuthorInput;
    comments?: CommentCreateNestedManyWithoutAuthorInput;
    chats?: ChatCreateNestedManyWithoutMembersInput;
    createdChats?: ChatCreateNestedManyWithoutCreatorInput;
    sentMessages?: MessageCreateNestedManyWithoutSenderInput;
    triggeredNotifications?: NotificationCreateNestedManyWithoutActorInput;
  };

  export type UserUncheckedCreateWithoutRecievedNotificationsInput = {
    id?: string;
    createdAt?: Date | string;
    deletedAt?: Date | string | null;
    account?: AccountUncheckedCreateNestedOneWithoutUserInput;
    profile?: ProfileUncheckedCreateNestedOneWithoutUserInput;
    following?: FollowUncheckedCreateNestedManyWithoutFollowerInput;
    followers?: FollowUncheckedCreateNestedManyWithoutFollowingInput;
    posts?: PostUncheckedCreateNestedManyWithoutAuthorInput;
    likes?: LikeUncheckedCreateNestedManyWithoutAuthorInput;
    comments?: CommentUncheckedCreateNestedManyWithoutAuthorInput;
    chats?: ChatUncheckedCreateNestedManyWithoutMembersInput;
    createdChats?: ChatUncheckedCreateNestedManyWithoutCreatorInput;
    sentMessages?: MessageUncheckedCreateNestedManyWithoutSenderInput;
    triggeredNotifications?: NotificationUncheckedCreateNestedManyWithoutActorInput;
  };

  export type UserCreateOrConnectWithoutRecievedNotificationsInput = {
    where: UserWhereUniqueInput;
    create: XOR<
      UserCreateWithoutRecievedNotificationsInput,
      UserUncheckedCreateWithoutRecievedNotificationsInput
    >;
  };

  export type UserCreateWithoutTriggeredNotificationsInput = {
    id?: string;
    createdAt?: Date | string;
    deletedAt?: Date | string | null;
    account?: AccountCreateNestedOneWithoutUserInput;
    profile?: ProfileCreateNestedOneWithoutUserInput;
    following?: FollowCreateNestedManyWithoutFollowerInput;
    followers?: FollowCreateNestedManyWithoutFollowingInput;
    posts?: PostCreateNestedManyWithoutAuthorInput;
    likes?: LikeCreateNestedManyWithoutAuthorInput;
    comments?: CommentCreateNestedManyWithoutAuthorInput;
    chats?: ChatCreateNestedManyWithoutMembersInput;
    createdChats?: ChatCreateNestedManyWithoutCreatorInput;
    sentMessages?: MessageCreateNestedManyWithoutSenderInput;
    recievedNotifications?: NotificationCreateNestedManyWithoutRecipientInput;
  };

  export type UserUncheckedCreateWithoutTriggeredNotificationsInput = {
    id?: string;
    createdAt?: Date | string;
    deletedAt?: Date | string | null;
    account?: AccountUncheckedCreateNestedOneWithoutUserInput;
    profile?: ProfileUncheckedCreateNestedOneWithoutUserInput;
    following?: FollowUncheckedCreateNestedManyWithoutFollowerInput;
    followers?: FollowUncheckedCreateNestedManyWithoutFollowingInput;
    posts?: PostUncheckedCreateNestedManyWithoutAuthorInput;
    likes?: LikeUncheckedCreateNestedManyWithoutAuthorInput;
    comments?: CommentUncheckedCreateNestedManyWithoutAuthorInput;
    chats?: ChatUncheckedCreateNestedManyWithoutMembersInput;
    createdChats?: ChatUncheckedCreateNestedManyWithoutCreatorInput;
    sentMessages?: MessageUncheckedCreateNestedManyWithoutSenderInput;
    recievedNotifications?: NotificationUncheckedCreateNestedManyWithoutRecipientInput;
  };

  export type UserCreateOrConnectWithoutTriggeredNotificationsInput = {
    where: UserWhereUniqueInput;
    create: XOR<
      UserCreateWithoutTriggeredNotificationsInput,
      UserUncheckedCreateWithoutTriggeredNotificationsInput
    >;
  };

  export type UserUpsertWithoutRecievedNotificationsInput = {
    update: XOR<
      UserUpdateWithoutRecievedNotificationsInput,
      UserUncheckedUpdateWithoutRecievedNotificationsInput
    >;
    create: XOR<
      UserCreateWithoutRecievedNotificationsInput,
      UserUncheckedCreateWithoutRecievedNotificationsInput
    >;
    where?: UserWhereInput;
  };

  export type UserUpdateToOneWithWhereWithoutRecievedNotificationsInput = {
    where?: UserWhereInput;
    data: XOR<
      UserUpdateWithoutRecievedNotificationsInput,
      UserUncheckedUpdateWithoutRecievedNotificationsInput
    >;
  };

  export type UserUpdateWithoutRecievedNotificationsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    account?: AccountUpdateOneWithoutUserNestedInput;
    profile?: ProfileUpdateOneWithoutUserNestedInput;
    following?: FollowUpdateManyWithoutFollowerNestedInput;
    followers?: FollowUpdateManyWithoutFollowingNestedInput;
    posts?: PostUpdateManyWithoutAuthorNestedInput;
    likes?: LikeUpdateManyWithoutAuthorNestedInput;
    comments?: CommentUpdateManyWithoutAuthorNestedInput;
    chats?: ChatUpdateManyWithoutMembersNestedInput;
    createdChats?: ChatUpdateManyWithoutCreatorNestedInput;
    sentMessages?: MessageUpdateManyWithoutSenderNestedInput;
    triggeredNotifications?: NotificationUpdateManyWithoutActorNestedInput;
  };

  export type UserUncheckedUpdateWithoutRecievedNotificationsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    account?: AccountUncheckedUpdateOneWithoutUserNestedInput;
    profile?: ProfileUncheckedUpdateOneWithoutUserNestedInput;
    following?: FollowUncheckedUpdateManyWithoutFollowerNestedInput;
    followers?: FollowUncheckedUpdateManyWithoutFollowingNestedInput;
    posts?: PostUncheckedUpdateManyWithoutAuthorNestedInput;
    likes?: LikeUncheckedUpdateManyWithoutAuthorNestedInput;
    comments?: CommentUncheckedUpdateManyWithoutAuthorNestedInput;
    chats?: ChatUncheckedUpdateManyWithoutMembersNestedInput;
    createdChats?: ChatUncheckedUpdateManyWithoutCreatorNestedInput;
    sentMessages?: MessageUncheckedUpdateManyWithoutSenderNestedInput;
    triggeredNotifications?: NotificationUncheckedUpdateManyWithoutActorNestedInput;
  };

  export type UserUpsertWithoutTriggeredNotificationsInput = {
    update: XOR<
      UserUpdateWithoutTriggeredNotificationsInput,
      UserUncheckedUpdateWithoutTriggeredNotificationsInput
    >;
    create: XOR<
      UserCreateWithoutTriggeredNotificationsInput,
      UserUncheckedCreateWithoutTriggeredNotificationsInput
    >;
    where?: UserWhereInput;
  };

  export type UserUpdateToOneWithWhereWithoutTriggeredNotificationsInput = {
    where?: UserWhereInput;
    data: XOR<
      UserUpdateWithoutTriggeredNotificationsInput,
      UserUncheckedUpdateWithoutTriggeredNotificationsInput
    >;
  };

  export type UserUpdateWithoutTriggeredNotificationsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    account?: AccountUpdateOneWithoutUserNestedInput;
    profile?: ProfileUpdateOneWithoutUserNestedInput;
    following?: FollowUpdateManyWithoutFollowerNestedInput;
    followers?: FollowUpdateManyWithoutFollowingNestedInput;
    posts?: PostUpdateManyWithoutAuthorNestedInput;
    likes?: LikeUpdateManyWithoutAuthorNestedInput;
    comments?: CommentUpdateManyWithoutAuthorNestedInput;
    chats?: ChatUpdateManyWithoutMembersNestedInput;
    createdChats?: ChatUpdateManyWithoutCreatorNestedInput;
    sentMessages?: MessageUpdateManyWithoutSenderNestedInput;
    recievedNotifications?: NotificationUpdateManyWithoutRecipientNestedInput;
  };

  export type UserUncheckedUpdateWithoutTriggeredNotificationsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    account?: AccountUncheckedUpdateOneWithoutUserNestedInput;
    profile?: ProfileUncheckedUpdateOneWithoutUserNestedInput;
    following?: FollowUncheckedUpdateManyWithoutFollowerNestedInput;
    followers?: FollowUncheckedUpdateManyWithoutFollowingNestedInput;
    posts?: PostUncheckedUpdateManyWithoutAuthorNestedInput;
    likes?: LikeUncheckedUpdateManyWithoutAuthorNestedInput;
    comments?: CommentUncheckedUpdateManyWithoutAuthorNestedInput;
    chats?: ChatUncheckedUpdateManyWithoutMembersNestedInput;
    createdChats?: ChatUncheckedUpdateManyWithoutCreatorNestedInput;
    sentMessages?: MessageUncheckedUpdateManyWithoutSenderNestedInput;
    recievedNotifications?: NotificationUncheckedUpdateManyWithoutRecipientNestedInput;
  };

  export type FollowCreateManyFollowerInput = {
    id?: string;
    followingId: string;
    createdAt?: Date | string;
    status?: $Enums.FollowStatus;
  };

  export type FollowCreateManyFollowingInput = {
    id?: string;
    followerId: string;
    createdAt?: Date | string;
    status?: $Enums.FollowStatus;
  };

  export type PostCreateManyAuthorInput = {
    id?: string;
    description?: string | null;
    isArchived?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string | null;
  };

  export type LikeCreateManyAuthorInput = {
    id?: string;
    postId?: string | null;
    commentId?: string | null;
    createdAt?: Date | string;
  };

  export type CommentCreateManyAuthorInput = {
    id?: string;
    postId: string;
    parentId?: string | null;
    content: string;
    createdAt?: Date | string;
  };

  export type ChatCreateManyCreatorInput = {
    id?: string;
    name?: string | null;
    type?: $Enums.ChatType;
  };

  export type MessageCreateManySenderInput = {
    id?: string;
    content?: string | null;
    isRead?: boolean;
    isEdited?: boolean;
    chatId: string;
    createdAt?: Date | string;
    updatedAt?: Date | string | null;
  };

  export type NotificationCreateManyRecipientInput = {
    id?: string;
    type: $Enums.NotificationType;
    actorId: string;
    itemId?: string | null;
    postId?: string | null;
    isRead?: boolean;
    createdAt?: Date | string;
  };

  export type NotificationCreateManyActorInput = {
    id?: string;
    type: $Enums.NotificationType;
    recipientId: string;
    itemId?: string | null;
    postId?: string | null;
    isRead?: boolean;
    createdAt?: Date | string;
  };

  export type FollowUpdateWithoutFollowerInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    status?: EnumFollowStatusFieldUpdateOperationsInput | $Enums.FollowStatus;
    following?: UserUpdateOneRequiredWithoutFollowersNestedInput;
  };

  export type FollowUncheckedUpdateWithoutFollowerInput = {
    id?: StringFieldUpdateOperationsInput | string;
    followingId?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    status?: EnumFollowStatusFieldUpdateOperationsInput | $Enums.FollowStatus;
  };

  export type FollowUncheckedUpdateManyWithoutFollowerInput = {
    id?: StringFieldUpdateOperationsInput | string;
    followingId?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    status?: EnumFollowStatusFieldUpdateOperationsInput | $Enums.FollowStatus;
  };

  export type FollowUpdateWithoutFollowingInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    status?: EnumFollowStatusFieldUpdateOperationsInput | $Enums.FollowStatus;
    follower?: UserUpdateOneRequiredWithoutFollowingNestedInput;
  };

  export type FollowUncheckedUpdateWithoutFollowingInput = {
    id?: StringFieldUpdateOperationsInput | string;
    followerId?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    status?: EnumFollowStatusFieldUpdateOperationsInput | $Enums.FollowStatus;
  };

  export type FollowUncheckedUpdateManyWithoutFollowingInput = {
    id?: StringFieldUpdateOperationsInput | string;
    followerId?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    status?: EnumFollowStatusFieldUpdateOperationsInput | $Enums.FollowStatus;
  };

  export type PostUpdateWithoutAuthorInput = {
    id?: StringFieldUpdateOperationsInput | string;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    isArchived?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    assets?: AssetUpdateManyWithoutPostNestedInput;
    comments?: CommentUpdateManyWithoutPostNestedInput;
    likes?: LikeUpdateManyWithoutPostNestedInput;
  };

  export type PostUncheckedUpdateWithoutAuthorInput = {
    id?: StringFieldUpdateOperationsInput | string;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    isArchived?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    assets?: AssetUncheckedUpdateManyWithoutPostNestedInput;
    comments?: CommentUncheckedUpdateManyWithoutPostNestedInput;
    likes?: LikeUncheckedUpdateManyWithoutPostNestedInput;
  };

  export type PostUncheckedUpdateManyWithoutAuthorInput = {
    id?: StringFieldUpdateOperationsInput | string;
    description?: NullableStringFieldUpdateOperationsInput | string | null;
    isArchived?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
  };

  export type LikeUpdateWithoutAuthorInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    post?: PostUpdateOneWithoutLikesNestedInput;
    comment?: CommentUpdateOneWithoutLikesNestedInput;
  };

  export type LikeUncheckedUpdateWithoutAuthorInput = {
    id?: StringFieldUpdateOperationsInput | string;
    postId?: NullableStringFieldUpdateOperationsInput | string | null;
    commentId?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type LikeUncheckedUpdateManyWithoutAuthorInput = {
    id?: StringFieldUpdateOperationsInput | string;
    postId?: NullableStringFieldUpdateOperationsInput | string | null;
    commentId?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type CommentUpdateWithoutAuthorInput = {
    id?: StringFieldUpdateOperationsInput | string;
    content?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    parent?: CommentUpdateOneWithoutChildrenNestedInput;
    children?: CommentUpdateManyWithoutParentNestedInput;
    likes?: LikeUpdateManyWithoutCommentNestedInput;
    post?: PostUpdateOneRequiredWithoutCommentsNestedInput;
  };

  export type CommentUncheckedUpdateWithoutAuthorInput = {
    id?: StringFieldUpdateOperationsInput | string;
    postId?: StringFieldUpdateOperationsInput | string;
    parentId?: NullableStringFieldUpdateOperationsInput | string | null;
    content?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    children?: CommentUncheckedUpdateManyWithoutParentNestedInput;
    likes?: LikeUncheckedUpdateManyWithoutCommentNestedInput;
  };

  export type CommentUncheckedUpdateManyWithoutAuthorInput = {
    id?: StringFieldUpdateOperationsInput | string;
    postId?: StringFieldUpdateOperationsInput | string;
    parentId?: NullableStringFieldUpdateOperationsInput | string | null;
    content?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type ChatUpdateWithoutMembersInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: NullableStringFieldUpdateOperationsInput | string | null;
    type?: EnumChatTypeFieldUpdateOperationsInput | $Enums.ChatType;
    creator?: UserUpdateOneWithoutCreatedChatsNestedInput;
    messages?: MessageUpdateManyWithoutChatNestedInput;
  };

  export type ChatUncheckedUpdateWithoutMembersInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: NullableStringFieldUpdateOperationsInput | string | null;
    type?: EnumChatTypeFieldUpdateOperationsInput | $Enums.ChatType;
    creatorId?: NullableStringFieldUpdateOperationsInput | string | null;
    messages?: MessageUncheckedUpdateManyWithoutChatNestedInput;
  };

  export type ChatUncheckedUpdateManyWithoutMembersInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: NullableStringFieldUpdateOperationsInput | string | null;
    type?: EnumChatTypeFieldUpdateOperationsInput | $Enums.ChatType;
    creatorId?: NullableStringFieldUpdateOperationsInput | string | null;
  };

  export type ChatUpdateWithoutCreatorInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: NullableStringFieldUpdateOperationsInput | string | null;
    type?: EnumChatTypeFieldUpdateOperationsInput | $Enums.ChatType;
    members?: UserUpdateManyWithoutChatsNestedInput;
    messages?: MessageUpdateManyWithoutChatNestedInput;
  };

  export type ChatUncheckedUpdateWithoutCreatorInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: NullableStringFieldUpdateOperationsInput | string | null;
    type?: EnumChatTypeFieldUpdateOperationsInput | $Enums.ChatType;
    members?: UserUncheckedUpdateManyWithoutChatsNestedInput;
    messages?: MessageUncheckedUpdateManyWithoutChatNestedInput;
  };

  export type ChatUncheckedUpdateManyWithoutCreatorInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: NullableStringFieldUpdateOperationsInput | string | null;
    type?: EnumChatTypeFieldUpdateOperationsInput | $Enums.ChatType;
  };

  export type MessageUpdateWithoutSenderInput = {
    id?: StringFieldUpdateOperationsInput | string;
    content?: NullableStringFieldUpdateOperationsInput | string | null;
    isRead?: BoolFieldUpdateOperationsInput | boolean;
    isEdited?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    assets?: AssetUpdateManyWithoutMessageNestedInput;
    chat?: ChatUpdateOneRequiredWithoutMessagesNestedInput;
  };

  export type MessageUncheckedUpdateWithoutSenderInput = {
    id?: StringFieldUpdateOperationsInput | string;
    content?: NullableStringFieldUpdateOperationsInput | string | null;
    isRead?: BoolFieldUpdateOperationsInput | boolean;
    isEdited?: BoolFieldUpdateOperationsInput | boolean;
    chatId?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    assets?: AssetUncheckedUpdateManyWithoutMessageNestedInput;
  };

  export type MessageUncheckedUpdateManyWithoutSenderInput = {
    id?: StringFieldUpdateOperationsInput | string;
    content?: NullableStringFieldUpdateOperationsInput | string | null;
    isRead?: BoolFieldUpdateOperationsInput | boolean;
    isEdited?: BoolFieldUpdateOperationsInput | boolean;
    chatId?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
  };

  export type NotificationUpdateWithoutRecipientInput = {
    id?: StringFieldUpdateOperationsInput | string;
    type?:
      | EnumNotificationTypeFieldUpdateOperationsInput
      | $Enums.NotificationType;
    itemId?: NullableStringFieldUpdateOperationsInput | string | null;
    postId?: NullableStringFieldUpdateOperationsInput | string | null;
    isRead?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    actor?: UserUpdateOneRequiredWithoutTriggeredNotificationsNestedInput;
  };

  export type NotificationUncheckedUpdateWithoutRecipientInput = {
    id?: StringFieldUpdateOperationsInput | string;
    type?:
      | EnumNotificationTypeFieldUpdateOperationsInput
      | $Enums.NotificationType;
    actorId?: StringFieldUpdateOperationsInput | string;
    itemId?: NullableStringFieldUpdateOperationsInput | string | null;
    postId?: NullableStringFieldUpdateOperationsInput | string | null;
    isRead?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type NotificationUncheckedUpdateManyWithoutRecipientInput = {
    id?: StringFieldUpdateOperationsInput | string;
    type?:
      | EnumNotificationTypeFieldUpdateOperationsInput
      | $Enums.NotificationType;
    actorId?: StringFieldUpdateOperationsInput | string;
    itemId?: NullableStringFieldUpdateOperationsInput | string | null;
    postId?: NullableStringFieldUpdateOperationsInput | string | null;
    isRead?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type NotificationUpdateWithoutActorInput = {
    id?: StringFieldUpdateOperationsInput | string;
    type?:
      | EnumNotificationTypeFieldUpdateOperationsInput
      | $Enums.NotificationType;
    itemId?: NullableStringFieldUpdateOperationsInput | string | null;
    postId?: NullableStringFieldUpdateOperationsInput | string | null;
    isRead?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    recipient?: UserUpdateOneRequiredWithoutRecievedNotificationsNestedInput;
  };

  export type NotificationUncheckedUpdateWithoutActorInput = {
    id?: StringFieldUpdateOperationsInput | string;
    type?:
      | EnumNotificationTypeFieldUpdateOperationsInput
      | $Enums.NotificationType;
    recipientId?: StringFieldUpdateOperationsInput | string;
    itemId?: NullableStringFieldUpdateOperationsInput | string | null;
    postId?: NullableStringFieldUpdateOperationsInput | string | null;
    isRead?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type NotificationUncheckedUpdateManyWithoutActorInput = {
    id?: StringFieldUpdateOperationsInput | string;
    type?:
      | EnumNotificationTypeFieldUpdateOperationsInput
      | $Enums.NotificationType;
    recipientId?: StringFieldUpdateOperationsInput | string;
    itemId?: NullableStringFieldUpdateOperationsInput | string | null;
    postId?: NullableStringFieldUpdateOperationsInput | string | null;
    isRead?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type AssetCreateManyPostInput = {
    id?: string;
    url: string;
    type?: $Enums.AssetType;
    messageId?: string | null;
  };

  export type CommentCreateManyPostInput = {
    id?: string;
    authorId: string;
    parentId?: string | null;
    content: string;
    createdAt?: Date | string;
  };

  export type LikeCreateManyPostInput = {
    id?: string;
    authorId: string;
    commentId?: string | null;
    createdAt?: Date | string;
  };

  export type AssetUpdateWithoutPostInput = {
    id?: StringFieldUpdateOperationsInput | string;
    url?: StringFieldUpdateOperationsInput | string;
    type?: EnumAssetTypeFieldUpdateOperationsInput | $Enums.AssetType;
    message?: MessageUpdateOneWithoutAssetsNestedInput;
  };

  export type AssetUncheckedUpdateWithoutPostInput = {
    id?: StringFieldUpdateOperationsInput | string;
    url?: StringFieldUpdateOperationsInput | string;
    type?: EnumAssetTypeFieldUpdateOperationsInput | $Enums.AssetType;
    messageId?: NullableStringFieldUpdateOperationsInput | string | null;
  };

  export type AssetUncheckedUpdateManyWithoutPostInput = {
    id?: StringFieldUpdateOperationsInput | string;
    url?: StringFieldUpdateOperationsInput | string;
    type?: EnumAssetTypeFieldUpdateOperationsInput | $Enums.AssetType;
    messageId?: NullableStringFieldUpdateOperationsInput | string | null;
  };

  export type CommentUpdateWithoutPostInput = {
    id?: StringFieldUpdateOperationsInput | string;
    content?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    parent?: CommentUpdateOneWithoutChildrenNestedInput;
    children?: CommentUpdateManyWithoutParentNestedInput;
    likes?: LikeUpdateManyWithoutCommentNestedInput;
    author?: UserUpdateOneRequiredWithoutCommentsNestedInput;
  };

  export type CommentUncheckedUpdateWithoutPostInput = {
    id?: StringFieldUpdateOperationsInput | string;
    authorId?: StringFieldUpdateOperationsInput | string;
    parentId?: NullableStringFieldUpdateOperationsInput | string | null;
    content?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    children?: CommentUncheckedUpdateManyWithoutParentNestedInput;
    likes?: LikeUncheckedUpdateManyWithoutCommentNestedInput;
  };

  export type CommentUncheckedUpdateManyWithoutPostInput = {
    id?: StringFieldUpdateOperationsInput | string;
    authorId?: StringFieldUpdateOperationsInput | string;
    parentId?: NullableStringFieldUpdateOperationsInput | string | null;
    content?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type LikeUpdateWithoutPostInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    comment?: CommentUpdateOneWithoutLikesNestedInput;
    author?: UserUpdateOneRequiredWithoutLikesNestedInput;
  };

  export type LikeUncheckedUpdateWithoutPostInput = {
    id?: StringFieldUpdateOperationsInput | string;
    authorId?: StringFieldUpdateOperationsInput | string;
    commentId?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type LikeUncheckedUpdateManyWithoutPostInput = {
    id?: StringFieldUpdateOperationsInput | string;
    authorId?: StringFieldUpdateOperationsInput | string;
    commentId?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type CommentCreateManyParentInput = {
    id?: string;
    authorId: string;
    postId: string;
    content: string;
    createdAt?: Date | string;
  };

  export type LikeCreateManyCommentInput = {
    id?: string;
    authorId: string;
    postId?: string | null;
    createdAt?: Date | string;
  };

  export type CommentUpdateWithoutParentInput = {
    id?: StringFieldUpdateOperationsInput | string;
    content?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    children?: CommentUpdateManyWithoutParentNestedInput;
    likes?: LikeUpdateManyWithoutCommentNestedInput;
    post?: PostUpdateOneRequiredWithoutCommentsNestedInput;
    author?: UserUpdateOneRequiredWithoutCommentsNestedInput;
  };

  export type CommentUncheckedUpdateWithoutParentInput = {
    id?: StringFieldUpdateOperationsInput | string;
    authorId?: StringFieldUpdateOperationsInput | string;
    postId?: StringFieldUpdateOperationsInput | string;
    content?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    children?: CommentUncheckedUpdateManyWithoutParentNestedInput;
    likes?: LikeUncheckedUpdateManyWithoutCommentNestedInput;
  };

  export type CommentUncheckedUpdateManyWithoutParentInput = {
    id?: StringFieldUpdateOperationsInput | string;
    authorId?: StringFieldUpdateOperationsInput | string;
    postId?: StringFieldUpdateOperationsInput | string;
    content?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type LikeUpdateWithoutCommentInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    post?: PostUpdateOneWithoutLikesNestedInput;
    author?: UserUpdateOneRequiredWithoutLikesNestedInput;
  };

  export type LikeUncheckedUpdateWithoutCommentInput = {
    id?: StringFieldUpdateOperationsInput | string;
    authorId?: StringFieldUpdateOperationsInput | string;
    postId?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type LikeUncheckedUpdateManyWithoutCommentInput = {
    id?: StringFieldUpdateOperationsInput | string;
    authorId?: StringFieldUpdateOperationsInput | string;
    postId?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type MessageCreateManyChatInput = {
    id?: string;
    content?: string | null;
    isRead?: boolean;
    isEdited?: boolean;
    senderId: string;
    createdAt?: Date | string;
    updatedAt?: Date | string | null;
  };

  export type UserUpdateWithoutChatsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    account?: AccountUpdateOneWithoutUserNestedInput;
    profile?: ProfileUpdateOneWithoutUserNestedInput;
    following?: FollowUpdateManyWithoutFollowerNestedInput;
    followers?: FollowUpdateManyWithoutFollowingNestedInput;
    posts?: PostUpdateManyWithoutAuthorNestedInput;
    likes?: LikeUpdateManyWithoutAuthorNestedInput;
    comments?: CommentUpdateManyWithoutAuthorNestedInput;
    createdChats?: ChatUpdateManyWithoutCreatorNestedInput;
    sentMessages?: MessageUpdateManyWithoutSenderNestedInput;
    recievedNotifications?: NotificationUpdateManyWithoutRecipientNestedInput;
    triggeredNotifications?: NotificationUpdateManyWithoutActorNestedInput;
  };

  export type UserUncheckedUpdateWithoutChatsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    account?: AccountUncheckedUpdateOneWithoutUserNestedInput;
    profile?: ProfileUncheckedUpdateOneWithoutUserNestedInput;
    following?: FollowUncheckedUpdateManyWithoutFollowerNestedInput;
    followers?: FollowUncheckedUpdateManyWithoutFollowingNestedInput;
    posts?: PostUncheckedUpdateManyWithoutAuthorNestedInput;
    likes?: LikeUncheckedUpdateManyWithoutAuthorNestedInput;
    comments?: CommentUncheckedUpdateManyWithoutAuthorNestedInput;
    createdChats?: ChatUncheckedUpdateManyWithoutCreatorNestedInput;
    sentMessages?: MessageUncheckedUpdateManyWithoutSenderNestedInput;
    recievedNotifications?: NotificationUncheckedUpdateManyWithoutRecipientNestedInput;
    triggeredNotifications?: NotificationUncheckedUpdateManyWithoutActorNestedInput;
  };

  export type UserUncheckedUpdateManyWithoutChatsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    deletedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
  };

  export type MessageUpdateWithoutChatInput = {
    id?: StringFieldUpdateOperationsInput | string;
    content?: NullableStringFieldUpdateOperationsInput | string | null;
    isRead?: BoolFieldUpdateOperationsInput | boolean;
    isEdited?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    assets?: AssetUpdateManyWithoutMessageNestedInput;
    sender?: UserUpdateOneRequiredWithoutSentMessagesNestedInput;
  };

  export type MessageUncheckedUpdateWithoutChatInput = {
    id?: StringFieldUpdateOperationsInput | string;
    content?: NullableStringFieldUpdateOperationsInput | string | null;
    isRead?: BoolFieldUpdateOperationsInput | boolean;
    isEdited?: BoolFieldUpdateOperationsInput | boolean;
    senderId?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    assets?: AssetUncheckedUpdateManyWithoutMessageNestedInput;
  };

  export type MessageUncheckedUpdateManyWithoutChatInput = {
    id?: StringFieldUpdateOperationsInput | string;
    content?: NullableStringFieldUpdateOperationsInput | string | null;
    isRead?: BoolFieldUpdateOperationsInput | boolean;
    isEdited?: BoolFieldUpdateOperationsInput | boolean;
    senderId?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
  };

  export type AssetCreateManyMessageInput = {
    id?: string;
    url: string;
    type?: $Enums.AssetType;
    postId?: string | null;
  };

  export type AssetUpdateWithoutMessageInput = {
    id?: StringFieldUpdateOperationsInput | string;
    url?: StringFieldUpdateOperationsInput | string;
    type?: EnumAssetTypeFieldUpdateOperationsInput | $Enums.AssetType;
    post?: PostUpdateOneWithoutAssetsNestedInput;
  };

  export type AssetUncheckedUpdateWithoutMessageInput = {
    id?: StringFieldUpdateOperationsInput | string;
    url?: StringFieldUpdateOperationsInput | string;
    type?: EnumAssetTypeFieldUpdateOperationsInput | $Enums.AssetType;
    postId?: NullableStringFieldUpdateOperationsInput | string | null;
  };

  export type AssetUncheckedUpdateManyWithoutMessageInput = {
    id?: StringFieldUpdateOperationsInput | string;
    url?: StringFieldUpdateOperationsInput | string;
    type?: EnumAssetTypeFieldUpdateOperationsInput | $Enums.AssetType;
    postId?: NullableStringFieldUpdateOperationsInput | string | null;
  };

  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number;
  };

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF;
}
