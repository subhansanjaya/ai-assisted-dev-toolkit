export function extractInput(extra: any) {
  return extra?.params?.arguments || extra?._meta || {};
}