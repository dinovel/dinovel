export interface SemVersion {
  readonly major: number;
  readonly minor: number;
  readonly patch: number;
  readonly prerelease: string;
  readonly build: string;
  readonly version: string;
}

export const SEM_VERSION_REGEX = /(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?/gm

export function parseSemVersion(version: string): SemVersion {
  const matcheAll = version.matchAll(SEM_VERSION_REGEX)
  const [_, major, minor, patch, prerelease, build] = matcheAll.next().value

  return {
    major: parseInt(major),
    minor: parseInt(minor),
    patch: parseInt(patch),
    prerelease: prerelease || '',
    build: build || '',
    version,
  }
}


export function compareSemVersion(aValue: SemVersion | string, bValue: SemVersion | string): number {
  const a = typeof aValue === 'string' ? parseSemVersion(aValue) : aValue
  const b = typeof bValue === 'string' ? parseSemVersion(bValue) : bValue

  if (a.major > b.major) {
    return 1;
  } else if (a.major < b.major) {
    return -1;
  } else if (a.minor > b.minor) {
    return 1;
  } else if (a.minor < b.minor) {
    return -1;
  } else if (a.patch > b.patch) {
    return 1;
  } else if (a.patch < b.patch) {
    return -1;
  } else {
    return 0;
  }
}
