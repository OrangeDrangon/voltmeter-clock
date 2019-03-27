// Adds support for source maps on exception
import 'source-map-support/register';

import { Clock } from './clock';

const clock = new Clock(17, 27, 22);

clock.setInterval(10);

console.log('Running...');
