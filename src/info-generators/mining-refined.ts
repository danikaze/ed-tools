import { EdData } from '@src/ed/data-manager';
import { t } from '@src/utils/i18n';
import { InfoGenerator } from '.';

type DataKeys = 'sessionTotalMiningRefined';
type Data = Pick<EdData, DataKeys>;
export type TranslationData = Data;

export class MiningRefinedInfoGenerator extends InfoGenerator<DataKeys> {
  constructor() {
    super(['sessionTotalMiningRefined']);
  }

  protected generate(data: Data): string | string[] | undefined {
    return t('miningRefined', data);
  }
}
