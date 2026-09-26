import {
  createPredictiveArcRenderer,
  PREDICTIVE_ARC_DEFAULTS,
} from "../../../../vendor/threeui/src/predictive-arc/predictiveArcRenderer";
import { adaptThreeUI } from "./adapt";

/** ThreeUI Community "Predictive Arc" (MIT, © Meng To). Canvas 2D — WebGL shart emas. */
export default adaptThreeUI(createPredictiveArcRenderer, { ...PREDICTIVE_ARC_DEFAULTS });
