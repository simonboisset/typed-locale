import {select, SelectConfig} from './select';

export const plural = <Config extends SelectConfig>(config: Config) => select('count', config);
