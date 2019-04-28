import React, { useEffect, useRef } from 'react'

const src = 'https://utteranc.es/client.js'

export const Utterences = ({ repo }) => {
  const rootElm = useRef(null)

  useEffect(() => {
    const utterances = document.createElement('script')
    const utterancesConfig = {
      src,
      repo,
      'issue-term': 'pathname',
      theme: 'github-light',
      crossorigin: 'anonymous',
      async: true,
    }

    Object.keys(utterancesConfig).forEach(configKey => {
      utterances.setAttribute(configKey, utterancesConfig[configKey])
    })
    rootElm.current.appendChild(utterances)
  }, [])

  return <div className="utterences" ref={rootElm} />
}
