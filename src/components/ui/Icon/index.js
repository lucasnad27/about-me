import React from 'react';

import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import {
  faLaptopCode,
  faServer,
  faMapMarkerAlt,
  faPaperPlane,
  faSearch,
  faChess,
  faPeopleCarry,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

/* add any additional icon to the library */
library.add(fab, faPeopleCarry, faChess, faSearch, faLaptopCode, faServer, faMapMarkerAlt, faPaperPlane);

const Icon = ({ ...props }) => <FontAwesomeIcon {...props} />;

export default Icon;
