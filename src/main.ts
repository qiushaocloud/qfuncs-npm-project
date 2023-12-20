// eslint-disable-next-line spaced-comment, @typescript-eslint/triple-slash-reference
/// <reference path="./typings.d.ts" />

import {IQMethods} from '@src/qfuncs/qfuncs.i';
import qFuncs from '@src/qfuncs';
import CustomEventManager, {moduleEventInstance, ICustomEventManager} from '@common/custom-event-manager';
import {SDKVERSIONS, SDKVERSIONSTIME} from '@enum/version';

export {
  ICustomEventManager,
  IQMethods
};

export {
  moduleEventInstance,
  CustomEventManager,
  qFuncs,
  SDKVERSIONS,
  SDKVERSIONSTIME
};

export default qFuncs;