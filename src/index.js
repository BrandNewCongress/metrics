import React from 'react'
import ReactDOM from 'react-dom'
// import App from './app'
import Advanced from './advanced'
import { LocaleProvider } from 'antd'
import enUS from 'antd/lib/locale-provider/en_US'

window.API_ENDPOINT = window.location.href.includes('localhost')
  ? 'http://localhost:8080/metrics'
  : 'https://api.brandnewcongress.org/metrics'

ReactDOM.render(
  (
    <LocaleProvider locale={enUS}>
      <Advanced />
    </LocaleProvider>
  ),
  document.getElementById('root')
);
