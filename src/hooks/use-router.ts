// src/hooks/use-router.ts
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";

// Wrapper que preserva el locale en cada navegación
export function useAppRouter() {
  const router = useRouter();
  const locale = useLocale();

  return {
    push: (path: string) => router.push(`/${locale}${path}`),
    replace: (path: string) => router.replace(`/${locale}${path}`),
    back: () => router.back(),
  };
}
