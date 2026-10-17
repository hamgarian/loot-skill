import { Composition, Still } from 'remotion';
import { Loot } from './Loot';
import { Social } from './Social';

export const Root = () => (
  <>
    <Composition id="Loot" component={Loot} durationInFrames={450} fps={30} width={960} height={540} />
    <Still id="Social" component={Social} width={1280} height={640} />
  </>
);
