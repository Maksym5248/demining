import { useContext } from 'react';

import { TooltipRootContext, TooltipContext } from '~/context';
import { type ITooltipRootContext } from '~/types';

export const useTooltipRoot = (): ITooltipRootContext => useContext(TooltipRootContext);
export const useTooltip = () => useContext(TooltipContext);
