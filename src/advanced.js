import './app.css'
import React, { Component } from 'react'
import { Button, Card, DatePicker, Layout, Menu, Select, Table } from 'antd'
import request from 'superagent'

const { RangePicker } = DatePicker
const { Header, Content } = Layout
const { Option } = Select

import Query from './components/query'

export default class Advanced extends Component {
  state = {
    results: []
  }

  render () {
    return (
      <Layout>
        <Header style={{
          height: 'auto',
          minHeight: 64
        }}>

          <Query displayQuery={console.log} />

        </Header>
        <Content>

        </Content>
      </Layout>
    )
  }
}
