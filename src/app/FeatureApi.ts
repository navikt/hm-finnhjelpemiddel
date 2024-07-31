import useSWR from "swr";
import { EXPECTED_TOGGLES } from "@/toggles/toggles";
import { fetcherGET } from "@/utils/api-util";
import { IToggle } from "@/toggles/context";

export function useFeatureFlags() {
  const queryParams = EXPECTED_TOGGLES.map((toggle) => `feature=${toggle}`).join("&");
  const path = `/adminregister/features?${queryParams}`;

  const { data, error } = useSWR<Record<string, boolean>>(path, fetcherGET);

  if (error) {
    return [];
  }

  const toggles: IToggle[] = EXPECTED_TOGGLES.map((toggle) => ({
    name: toggle,
    enabled: data ? data[toggle] : false,
  }));

  return toggles;
}
