export interface WordCapabilities { wordApi: boolean; ooxml: boolean; }
export function getCapabilities(requirements: { isSetSupported?: (name: string, version?: string) => boolean } | undefined): WordCapabilities {
  const wordApi = requirements?.isSetSupported?.("WordApi", "1.3") ?? true;
  return { wordApi, ooxml: wordApi };
}
