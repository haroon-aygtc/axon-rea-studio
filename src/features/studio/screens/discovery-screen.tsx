import { RequireTarget } from "../components/require-target";
import { ScreenBody, ScreenHeader } from "../components/screen-header";

export function DiscoveryScreen() {
  return (
    <ScreenBody>
      <ScreenHeader screen="/studio/discovery" />
      <RequireTarget>{(target) => <p className="text-sm text-muted-foreground">{target.name}</p>}</RequireTarget>
    </ScreenBody>
  );
}
