const React = require('react')
const SESSION_STORAGE_KEY = '__rinae_dev_session_storage_key__'

exports.onRenderBody = ({ setHeadComponents }) => {
  setHeadComponents([
    <script
      key="check-system-dark-mode"
      type="text/javascript"
      dangerouslySetInnerHTML={{
        __html: `
          const darkModeMeidaQuery = window.matchMedia('(prefers-color-scheme: dark)')

          if (darkModeMeidaQuery.matches) {
            window.sessionStorage.setItem('${SESSION_STORAGE_KEY}/theme', '"dark"')
          }
        `,
      }}
    />,
  ])
}
