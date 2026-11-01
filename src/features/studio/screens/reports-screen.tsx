import { RequireTarget } from "../components/require-target";
import { ScreenBody, ScreenHeader } from "../components/screen-header";

export function ReportsScreen() {
  return (
    <ScreenBody>
      <ScreenHeader screen="/studio/reports" />
      <RequireTarget>{(target) => <p className="text-sm text-muted-foreground">{target.name}</p>}</RequireTarget>
    </ScreenBody>
  );
}
