import { BuildTargets,BuildWatchers,BuildTarget,BuildResult } from "./target.ts";

export interface IBuilder {
  watch(targets: BuildTargets): Promise<BuildWatchers>;
  build(target: BuildTarget): Promise<BuildResult>;
}
