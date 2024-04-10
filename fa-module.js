import { library, dom } from '@fortawesome/fontawesome-svg-core';
import { faHouse, faBook, faCompass, faCirclePlus } from '@fortawesome/free-solid-svg-icons';
library.add(faHouse, faBook, faCompass, faCirclePlus);

// Remplace automatiquement les icônes <i> par les SVG
dom.watch();