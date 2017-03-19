import './app.css'
import React, { Component } from 'react'
import { Button, Card, DatePicker, Layout, Menu, Select, Table } from 'antd'
import request from 'superagent'
import toSpaceCase from 'to-space-case'

const { RangePicker } = DatePicker
const { Header, Content } = Layout
const { Option } = Select

import Query from './components/query'
import MyTable from './components/my-table'

export default class Advanced extends Component {
  state = {
    queries: []
  }

  displayQuery = (query, results) => this.setState({
    queries: [{query, results}].concat(this.state.queries)
  })

  render () {
    const { queries } = this.state

    return (
      <Layout>
        <Header style={{
          height: 'auto',
          minHeight: 64
        }}>
          <Query displayQuery={this.displayQuery} />
        </Header>
        <Content>
          {queries.map(({query, results}, idx) => (
            <Card style={{margin: 10}}
              key={idx} title={`${query.operation} of ${query.model}'s ${query.secondaryAttribute
              ? `${query.attribute}'s ${query.secondaryAttribute}`
              : `${query.attribute}`
            } between ${new Date(query.dateRange[0]).toDateString()} and ${new Date(query.dateRange[1]).toDateString()}`}>
              {typeof results == 'object'
                ? ( <MyTable label={toSpaceCase(Object.keys(results)[0])} data={results[Object.keys(results)[0]]} /> )
                : ( results )
              }
            </Card>
          ))}

          <div
            style={{
              display: 'flex', justifyContent: 'center', alignItems: 'center',
              height: 400
            }}
          >
            Try
            <br/>
            <br/>
            "Breakdown Nominee Evaluations's nominee's gender"
            <br/>
            <br/>
            "Breakdown Nominee Evaluations's evaluator name"
            <br/>
            <br/>
            "Breakdown Nomination's source"
            <br/>
            <br/>
            "Breakdown Contact Logs's result"
          </div>
        </Content>
      </Layout>
    )
  }
}
