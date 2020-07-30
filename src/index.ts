import { join } from 'path';
import { addEdEventListener } from './event-processors';
import {
  NavRoute,
  FSDJump,
  Docked,
  Undocked,
  ApproachBody,
  LeaveBody,
} from './event-processors/nav';
import { NavInfoGenerator } from './info-generators/nav';
import { WriteFileOutputter } from './outputters/write-file';
import { OUTPUT_FOLDER } from './constants';
import { Scanned, HeatWarning } from './event-processors/misc';
import { Bounty, ShipTargeted } from './event-processors/pirates';
import { OutputRotator } from './outputters/rotator';
import { HeatWarningsInfoGenerator } from './info-generators/heat-warning';
import { ScannedInfoGenerator } from './info-generators/scanned';

const OUTPUT_NAV = join(OUTPUT_FOLDER, 'nav.txt');
const OUTPUT_EVENTS = join(OUTPUT_FOLDER, 'events.txt');
const spacer = { prefix: ' ', postfix: ' ' };

/*
 * Nav
 */
addEdEventListener(NavRoute);
addEdEventListener(FSDJump);
addEdEventListener(Docked);
addEdEventListener(Undocked);
addEdEventListener(ApproachBody);
addEdEventListener(LeaveBody);

new NavInfoGenerator().pipe(new WriteFileOutputter(OUTPUT_NAV, spacer));

/*
 * Events
 */
addEdEventListener(Scanned);
addEdEventListener(HeatWarning);
addEdEventListener(Bounty);
addEdEventListener(ShipTargeted);

new OutputRotator({ repeatTimes: 1 })
  .pipe(new WriteFileOutputter(OUTPUT_EVENTS, spacer))
  .source([new HeatWarningsInfoGenerator(), new ScannedInfoGenerator()]);
