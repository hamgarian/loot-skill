import { Composition } from 'remotion';
import { Loot } from './Loot';

export const Root = () => (
  <Composition id="Loot" component={Loot} durationInFrames={450} fps={30} width={960} height={540} />
);
