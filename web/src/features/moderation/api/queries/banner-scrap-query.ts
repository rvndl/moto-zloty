import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { Api } from "api";
import { BannerScrapResult } from "../types";

const BANNER_SCRAP_QUERY_KEY = "BANNER_SCRAP_QUERY_KEY";

const bannerScrap = async (bannerId: string) => {
  const response = await Api.get<BannerScrapResult>(
    `/mod/banner_scrap/${bannerId}`,
  );

  return response.data;
};

const useBannerScrapQuery = (
  bannerId: string,
  options?: Partial<UseQueryOptions<BannerScrapResult, Error>>,
) => {
  return useQuery({
    queryKey: [BANNER_SCRAP_QUERY_KEY, bannerId],
    queryFn: () => bannerScrap(bannerId),
    ...options,
  });
};

export { useBannerScrapQuery, BANNER_SCRAP_QUERY_KEY };
