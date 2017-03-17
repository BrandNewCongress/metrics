import React from 'react'
import ReactDOM from 'react-dom'
// import App from './app'
import Advanced from './advanced'
import { LocaleProvider } from 'antd'
import enUS from 'antd/lib/locale-provider/en_US'

ReactDOM.render(
  (
    <LocaleProvider locale={enUS}>
      <Advanced />
    </LocaleProvider>
  ),
  document.getElementById('root')
);
