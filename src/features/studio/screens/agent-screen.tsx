import { RequireTarget } from "../components/require-target";
import { ScreenBody, ScreenHeader } from "../components/screen-header";

export function AgentScreen() {
  return (
    <ScreenBody>
      <ScreenHeader screen="/studio/agent" />
      <RequireTarget>{(target) => <p className="text-sm text-muted-foreground">{target.name}</p>}</RequireTarget>
    </ScreenBody>
  );
}
