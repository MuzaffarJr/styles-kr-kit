import {
  createOrbitalSphereRenderer,
  ORBITAL_SPHERE_DEFAULTS,
} from "../../../../vendor/threeui/src/orbital-sphere/orbitalSphereRenderer";
import { adaptThreeUI } from "./adapt";

/** ThreeUI Community "Orbital Sphere" (MIT, © Meng To). WebGL, three@0.128 (three128 alias). */
export default adaptThreeUI(createOrbitalSphereRenderer, { ...ORBITAL_SPHERE_DEFAULTS });
