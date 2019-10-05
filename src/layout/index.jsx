import React, { useState, useCallback, useEffect } from 'react'

import { THEME } from '../constants'
import { Top } from '../components/top'
import { Header } from '../components/header'
import { ThemeSwitch } from '../components/theme-switch'
import { Footer } from '../components/footer'

import * as Dom from '../utils/dom'
import { rhythm } from '../utils/typography'
import * as Storage from '../utils/storage'

import './index.scss'

function getTheme(checked) {
  return checked ? THEME.DARK : THEME.LIGHT
}

function toggleTheme(theme) {
  switch (theme) {
    case THEME.LIGHT: {
      Dom.addClassToBody(THEME.LIGHT)
      Dom.removeClassToBody(THEME.DARK)
      break
    }
    case THEME.DARK: {
      Dom.addClassToBody(THEME.DARK)
      Dom.removeClassToBody(THEME.LIGHT)
      break
    }
  }
}

export const Layout = ({ location, title, children }) => {
  const rootPath = `${__PATH_PREFIX__}/`
  const [themeSwitchChecked, setThemeSwitchChecked] = useState(
    Storage.getTheme() === THEME.DARK
  )

  const handleThemeChange = useCallback(checked => {
    const nextTheme = getTheme(checked)
    setThemeSwitchChecked(checked)
    toggleTheme(nextTheme)
    Storage.setTheme(nextTheme)
  }, [])

  useEffect(() => {
    const isDarkMode = themeSwitchChecked

    handleThemeChange(isDarkMode)
  }, [])

  return (
    <React.Fragment>
      <Top title={title} location={location} rootPath={rootPath} />
      <div
        style={{
          marginLeft: `auto`,
          marginRight: `auto`,
          maxWidth: rhythm(32),
          padding: `${rhythm(1.5)} ${rhythm(3 / 4)}`,
        }}
      >
        <ThemeSwitch
          checked={themeSwitchChecked}
          handleThemeChange={handleThemeChange}
        />
        <Header title={title} location={location} rootPath={rootPath} />
        {children}
        <Footer />
      </div>
    </React.Fragment>
  )
}
