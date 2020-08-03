import { default as nodeCleanup } from 'node-cleanup';
import { join } from 'path';

import { initEventManager, EventType } from './ed/event-manager';
import { EdEvent } from './ed/events';

import { WriteFileOutputter } from './outputters/write-file';
import { OutputRotator } from './outputters/middleware/rotator';
import { TextSpacer } from './outputters/middleware/text-spacer';
import { Outputter } from './outputters';

import { NavInfoGenerator } from './info-generators/nav';
import { HeatWarningsInfoGenerator } from './info-generators/heat-warning';
import { ScannedInfoGenerator } from './info-generators/scanned';
import { BountyInfoGenerator } from './info-generators/bounty';

import { registerAllEvents } from './event-processors/register-all-events';

import { OUTPUT_FOLDER } from './constants';
import { JumpDistanceInfoGenerator } from './info-generators/jump-distance';
import { OnlyInMilestones } from './info-generators/middleware/milestone';
import { MaterialsCollectedInfoGenerator } from './info-generators/material-collected';
import { MiningRefinedInfoGenerator } from './info-generators/mining-refined';
import { ProspectedAsteroidsInfoGenerator } from './info-generators/prospected-asteroids';
import { LaunchedDronesInfoGenerator } from './info-generators/launched-drones';
import { InterdictionsEscapedInfoGenerator } from './info-generators/interdiction-escaped';
import { InterdictionsLostInfoGenerator } from './info-generators/interdiction-lost';
import { InterdictionsSubmittedInfoGenerator } from './info-generators/interdiction-submitted';

const OUTPUT_NAV = join(OUTPUT_FOLDER, 'nav.txt');
const OUTPUT_EVENTS = join(OUTPUT_FOLDER, 'events.txt');
const spacer = { prefix: ' ', postfix: ' ' };

nodeCleanup((exitCode, signal) => {
  nodeCleanup.uninstall();
  console.log(`\nExiting... (${signal})`);
  Outputter.destroyAll().then(() => process.kill(process.pid, signal!));
  return false;
});

(async () => {
  try {
    await initEventManager();
  } catch (e) {
    console.error(e, '=> Exiting');
    return;
  }

  registerAllEvents();

  new NavInfoGenerator().pipe(
    new TextSpacer(spacer).pipe(new WriteFileOutputter(OUTPUT_NAV))
  );

  new OutputRotator({ repeatTimes: 1 })
    .pipe(new TextSpacer(spacer).pipe(new WriteFileOutputter(OUTPUT_EVENTS)))
    .source([
      new HeatWarningsInfoGenerator(),
      new ScannedInfoGenerator(),
      new BountyInfoGenerator(),
      new JumpDistanceInfoGenerator().use(
        new OnlyInMilestones(
          'sessionTotalJumpDistance',
          [100, 250, 500, 1000, 2500, 5000],
          { cap: true }
        )
      ),
      new MaterialsCollectedInfoGenerator().use(
        new OnlyInMilestones('sessionTotalMaterialsCollected', [5, 10, 25, 50])
      ),
      new MiningRefinedInfoGenerator().use(
        new OnlyInMilestones('sessionTotalMaterialsRefined', [5, 10, 25, 50])
      ),
      new ProspectedAsteroidsInfoGenerator().use(
        new OnlyInMilestones('sessionTotalAsteroidsProspected', [5, 10, 25, 50])
      ),
      new LaunchedDronesInfoGenerator().use(
        new OnlyInMilestones('sessionTotalDronesLaunched', [5, 10, 25, 50])
      ),
      new InterdictionsEscapedInfoGenerator(),
      new InterdictionsLostInfoGenerator(),
      new InterdictionsSubmittedInfoGenerator(),
    ]);
})();
