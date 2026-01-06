import { FetchError } from "@medusajs/js-sdk"
import {
  QueryKey,
  UseMutationOptions,
  UseQueryOptions,
  useMutation,
  useQuery,
} from "@tanstack/react-query"
import { fetchQuery } from "../../lib/client"
import { queryClient } from "../../lib/query-client"
import { queryKeysFactory } from "../../lib/query-key-factory"

const GOOGLE_QUERY_KEY = "google" as const
const googleQueryKeys = {
  ...queryKeysFactory(GOOGLE_QUERY_KEY),
  account: () => [GOOGLE_QUERY_KEY, "account"],
  merchantCenter: () => [GOOGLE_QUERY_KEY, "merchant-center"],
  conversions: () => [GOOGLE_QUERY_KEY, "conversions"],
  storeRequirements: () => [GOOGLE_QUERY_KEY, "store-requirements"],
}

export const useGoogleAccount = (
  options?: UseQueryOptions<any, FetchError, any, QueryKey>
) => {
  const { data, ...rest } = useQuery({
    queryFn: () =>
      fetchQuery("/vendor/google-account", {
        method: "GET",
      }),
    queryKey: googleQueryKeys.account(),
    ...options,
  })

  return { ...data, ...rest }
}

export const useConnectGoogleAccount = (
  options?: UseMutationOptions<any, FetchError, any>
) => {
  return useMutation({
    mutationFn: (payload) =>
      fetchQuery("/vendor/google-account", {
        method: "POST",
        body: payload,
      }),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: [GOOGLE_QUERY_KEY, "account"],
      })

      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useDisconnectGoogleAccount = (
  options?: UseMutationOptions<any, FetchError, void>
) => {
  return useMutation({
    mutationFn: () =>
      fetchQuery("/vendor/google-account/disconnect", {
        method: "POST",
      }),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: [GOOGLE_QUERY_KEY, "account"],
      })
      queryClient.invalidateQueries({
        queryKey: [GOOGLE_QUERY_KEY, "merchant-center"],
      })
      queryClient.invalidateQueries({
        queryKey: [GOOGLE_QUERY_KEY, "conversions"],
      })

      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useGoogleMerchantCenter = (
  options?: UseQueryOptions<any, FetchError, any, QueryKey>
) => {
  const { data, ...rest } = useQuery({
    queryFn: () =>
      fetchQuery("/vendor/google-merchant-center", {
        method: "GET",
      }),
    queryKey: googleQueryKeys.merchantCenter(),
    ...options,
  })

  return { ...data, ...rest }
}

export const useSyncProducts = (
  options?: UseMutationOptions<any, FetchError, any>
) => {
  return useMutation({
    mutationFn: (payload) =>
      fetchQuery("/vendor/google-merchant-center/sync", {
        method: "POST",
        body: payload,
      }),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: [GOOGLE_QUERY_KEY, "merchant-center"],
      })

      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useGoogleAdsConversions = (
  options?: UseQueryOptions<any, FetchError, any, QueryKey>
) => {
  const { data, ...rest } = useQuery({
    queryFn: () =>
      fetchQuery("/vendor/google-ads/conversions", {
        method: "GET",
      }),
    queryKey: googleQueryKeys.conversions(),
    ...options,
  })

  return { ...data, ...rest }
}

export const useStoreRequirements = (
  options?: UseQueryOptions<any, FetchError, any, QueryKey>
) => {
  const { data, ...rest } = useQuery({
    queryFn: () =>
      fetchQuery("/vendor/google/store-requirements", {
        method: "GET",
      }),
    queryKey: googleQueryKeys.storeRequirements(),
    ...options,
  })

  return { ...data, ...rest }
}

