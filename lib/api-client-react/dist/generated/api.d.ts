import type { QueryKey, UseMutationOptions, UseMutationResult, UseQueryOptions, UseQueryResult } from "@tanstack/react-query";
import type { ChatMessageBody, ChatResponse, HealthStatus, ListPropertiesParams, Property, PropertyStats, ScheduleVisitRequest, Visit } from "./api.schemas";
import { customFetch } from "../custom-fetch";
import type { ErrorType, BodyType } from "../custom-fetch";
type AwaitedInput<T> = PromiseLike<T> | T;
type Awaited<O> = O extends AwaitedInput<infer T> ? T : never;
type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];
/**
 * @summary Health check
 */
export declare const getHealthCheckUrl: () => string;
export declare const healthCheck: (options?: RequestInit) => Promise<HealthStatus>;
export declare const getHealthCheckQueryKey: () => readonly ["/api/healthz"];
export declare const getHealthCheckQueryOptions: <TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData> & {
    queryKey: QueryKey;
};
export type HealthCheckQueryResult = NonNullable<Awaited<ReturnType<typeof healthCheck>>>;
export type HealthCheckQueryError = ErrorType<unknown>;
/**
 * @summary Health check
 */
export declare function useHealthCheck<TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary List all properties
 */
export declare const getListPropertiesUrl: (params?: ListPropertiesParams) => string;
export declare const listProperties: (params?: ListPropertiesParams, options?: RequestInit) => Promise<Property[]>;
export declare const getListPropertiesQueryKey: (params?: ListPropertiesParams) => readonly ["/api/properties", ...ListPropertiesParams[]];
export declare const getListPropertiesQueryOptions: <TData = Awaited<ReturnType<typeof listProperties>>, TError = ErrorType<unknown>>(params?: ListPropertiesParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listProperties>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listProperties>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListPropertiesQueryResult = NonNullable<Awaited<ReturnType<typeof listProperties>>>;
export type ListPropertiesQueryError = ErrorType<unknown>;
/**
 * @summary List all properties
 */
export declare function useListProperties<TData = Awaited<ReturnType<typeof listProperties>>, TError = ErrorType<unknown>>(params?: ListPropertiesParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listProperties>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Get property by ID
 */
export declare const getGetPropertyUrl: (id: number) => string;
export declare const getProperty: (id: number, options?: RequestInit) => Promise<Property>;
export declare const getGetPropertyQueryKey: (id: number) => readonly [`/api/properties/${number}`];
export declare const getGetPropertyQueryOptions: <TData = Awaited<ReturnType<typeof getProperty>>, TError = ErrorType<void>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getProperty>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getProperty>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetPropertyQueryResult = NonNullable<Awaited<ReturnType<typeof getProperty>>>;
export type GetPropertyQueryError = ErrorType<void>;
/**
 * @summary Get property by ID
 */
export declare function useGetProperty<TData = Awaited<ReturnType<typeof getProperty>>, TError = ErrorType<void>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getProperty>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Get featured/top properties
 */
export declare const getGetFeaturedPropertiesUrl: () => string;
export declare const getFeaturedProperties: (options?: RequestInit) => Promise<Property[]>;
export declare const getGetFeaturedPropertiesQueryKey: () => readonly ["/api/properties/featured"];
export declare const getGetFeaturedPropertiesQueryOptions: <TData = Awaited<ReturnType<typeof getFeaturedProperties>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getFeaturedProperties>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getFeaturedProperties>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetFeaturedPropertiesQueryResult = NonNullable<Awaited<ReturnType<typeof getFeaturedProperties>>>;
export type GetFeaturedPropertiesQueryError = ErrorType<unknown>;
/**
 * @summary Get featured/top properties
 */
export declare function useGetFeaturedProperties<TData = Awaited<ReturnType<typeof getFeaturedProperties>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getFeaturedProperties>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Get summary stats for properties
 */
export declare const getGetPropertyStatsUrl: () => string;
export declare const getPropertyStats: (options?: RequestInit) => Promise<PropertyStats>;
export declare const getGetPropertyStatsQueryKey: () => readonly ["/api/properties/stats"];
export declare const getGetPropertyStatsQueryOptions: <TData = Awaited<ReturnType<typeof getPropertyStats>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getPropertyStats>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getPropertyStats>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetPropertyStatsQueryResult = NonNullable<Awaited<ReturnType<typeof getPropertyStats>>>;
export type GetPropertyStatsQueryError = ErrorType<unknown>;
/**
 * @summary Get summary stats for properties
 */
export declare function useGetPropertyStats<TData = Awaited<ReturnType<typeof getPropertyStats>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getPropertyStats>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Send a message to the AI property assistant
 */
export declare const getSendChatMessageUrl: () => string;
export declare const sendChatMessage: (chatMessageBody: ChatMessageBody, options?: RequestInit) => Promise<ChatResponse>;
export declare const getSendChatMessageMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof sendChatMessage>>, TError, {
        data: BodyType<ChatMessageBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof sendChatMessage>>, TError, {
    data: BodyType<ChatMessageBody>;
}, TContext>;
export type SendChatMessageMutationResult = NonNullable<Awaited<ReturnType<typeof sendChatMessage>>>;
export type SendChatMessageMutationBody = BodyType<ChatMessageBody>;
export type SendChatMessageMutationError = ErrorType<unknown>;
/**
 * @summary Send a message to the AI property assistant
 */
export declare const useSendChatMessage: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof sendChatMessage>>, TError, {
        data: BodyType<ChatMessageBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof sendChatMessage>>, TError, {
    data: BodyType<ChatMessageBody>;
}, TContext>;
/**
 * @summary List all scheduled visits
 */
export declare const getListVisitsUrl: () => string;
export declare const listVisits: (options?: RequestInit) => Promise<Visit[]>;
export declare const getListVisitsQueryKey: () => readonly ["/api/visits"];
export declare const getListVisitsQueryOptions: <TData = Awaited<ReturnType<typeof listVisits>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listVisits>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listVisits>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListVisitsQueryResult = NonNullable<Awaited<ReturnType<typeof listVisits>>>;
export type ListVisitsQueryError = ErrorType<unknown>;
/**
 * @summary List all scheduled visits
 */
export declare function useListVisits<TData = Awaited<ReturnType<typeof listVisits>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listVisits>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Schedule a property visit
 */
export declare const getScheduleVisitUrl: () => string;
export declare const scheduleVisit: (scheduleVisitRequest: ScheduleVisitRequest, options?: RequestInit) => Promise<Visit>;
export declare const getScheduleVisitMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof scheduleVisit>>, TError, {
        data: BodyType<ScheduleVisitRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof scheduleVisit>>, TError, {
    data: BodyType<ScheduleVisitRequest>;
}, TContext>;
export type ScheduleVisitMutationResult = NonNullable<Awaited<ReturnType<typeof scheduleVisit>>>;
export type ScheduleVisitMutationBody = BodyType<ScheduleVisitRequest>;
export type ScheduleVisitMutationError = ErrorType<unknown>;
/**
 * @summary Schedule a property visit
 */
export declare const useScheduleVisit: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof scheduleVisit>>, TError, {
        data: BodyType<ScheduleVisitRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof scheduleVisit>>, TError, {
    data: BodyType<ScheduleVisitRequest>;
}, TContext>;
/**
 * @summary Cancel a scheduled visit
 */
export declare const getCancelVisitUrl: (id: number) => string;
export declare const cancelVisit: (id: number, options?: RequestInit) => Promise<Visit>;
export declare const getCancelVisitMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof cancelVisit>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof cancelVisit>>, TError, {
    id: number;
}, TContext>;
export type CancelVisitMutationResult = NonNullable<Awaited<ReturnType<typeof cancelVisit>>>;
export type CancelVisitMutationError = ErrorType<unknown>;
/**
 * @summary Cancel a scheduled visit
 */
export declare const useCancelVisit: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof cancelVisit>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof cancelVisit>>, TError, {
    id: number;
}, TContext>;
export {};
//# sourceMappingURL=api.d.ts.map