import React, { memo } from 'react'
import Switch from 'react-switch'

import './index.scss'

export const ThemeSwitch = memo(({ checked, handleThemeChange }) => (
  <div className="switch-container">
    <label htmlFor="normal-switch">
      <Switch
        onChange={handleThemeChange}
        checked={checked}
        id="normal-switch"
        height={24}
        width={48}
        checkedIcon={<div className="icon checkedIcon">D</div>}
        uncheckedIcon={<div className="icon uncheckedIcon">L</div>}
        offColor={'#d9dfe2'}
        offHandleColor={'#fff'}
        onColor={'#999'}
        onHandleColor={'#282c35'}
      />
    </label>
  </div>
))
