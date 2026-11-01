import { RequireTarget } from "../components/require-target";
import { ScreenBody, ScreenHeader } from "../components/screen-header";

export function SecondBrainScreen() {
  return (
    <ScreenBody>
      <ScreenHeader screen="/studio/second-brain" />
      <RequireTarget>{(target) => <p className="text-sm text-muted-foreground">{target.name}</p>}</RequireTarget>
    </ScreenBody>
  );
}
