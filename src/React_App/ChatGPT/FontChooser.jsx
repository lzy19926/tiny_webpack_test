import * as React from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import { SizeMap } from '../store/constance';
import store from '../store/index'

export default function FontChooser() {
  const { Size } = store.useState("Size")

  const buttonCSS = { width: 60, height: 45, fontSize: 20, fontWeight: 600 }
  return (
    <ToggleButtonGroup
      value={Size.key}
      exclusive
      aria-label="Platform"
    >
      <ToggleButton value="S" color="primary" sx={buttonCSS}
        onClick={() => { store.setState({ Size: SizeMap['S'] }) }}
      >S</ToggleButton>
      <ToggleButton value="M" color="success" sx={buttonCSS}
        onClick={() => { store.setState({ Size: SizeMap['M'] }) }}
      >M</ToggleButton>
      <ToggleButton value="L" color="warning" sx={buttonCSS}
        onClick={() => { store.setState({ Size: SizeMap['L'] }) }}
      >L</ToggleButton>
    </ToggleButtonGroup>
  );
}