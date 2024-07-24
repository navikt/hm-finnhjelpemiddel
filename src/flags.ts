import { cookies } from "next/headers";
import React from "react";
import { evaluateFlags, flagsClient, getDefinitions } from "@unleash/nextjs";

const getFlag = async () => {
  const cookieStore = cookies();
  const sessionId =
    cookieStore.get("unleash-session-id")?.value ||
    `${Math.floor(Math.random() * 1_000_000_000)}`;

  const definitions = await getDefinitions({
    fetchOptions: {
      next: { revalidate: 15 }, // Cache layer like Unleash Proxy!
    },
  });

  const { toggles } = await evaluateFlags(definitions, {
    sessionId,
  });
  const flags = flagsClient(toggles);

  return flags.isEnabled("nextjs-example");
};

export default async function Page() {
  const isEnabled = await getFlag();

  return ()
}