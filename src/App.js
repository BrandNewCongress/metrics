import './app.css'
import React, { Component } from 'react'
import { Button, Card, DatePicker, Layout, Menu, Select, Table } from 'antd'
import request from 'superagent'

const { RangePicker } = DatePicker
const { Header, Content } = Layout
const { Option } = Select

import MyTable from './components/my-table'

/*
 * TODO - disallow future date selection
 */

 const apiEndpoint = () => window.location.href.includes('localhost')
  ? 'http://localhost:8080/metrics'
  : 'https://api.brandnewcongress.org/metrics'

export default class App extends Component {
  state = {
    dateRange: [],
    round: 'R1',
    source: 'All',
    evaluators: [],
    data: {},
    err: null,
    loading: false,
    evaluatorOptions: [],
    displaySource: 'All'
  }

  queryState = () => {
    const query = {
      round: this.state.round,
      dateRange: this.state.dateRange.map(mom => mom.toDate().toDateString()),
    }

    if (this.state.source && this.state.source !== 'All')
      query.source = this.state.source

    if (this.state.evaluators.length > 0)
      query.evaluators = this.state.evaluators

    return query
  }

  mutate = attr => val => this.setState({[attr]: val})

  setEvaluators = () => request.get(apiEndpoint() + '/evaluators').end((err, res) =>
    err
      ? this.setState({err})
      : this.setState({evaluatorOptions: res.body})
  )

  go = () => {
    this.setState({loading: true})

    request
    .get(apiEndpoint())
    .query(this.queryState())
    .end((err, res) => err
      ? this.setState({err, loading: false})
      : this.setState({
          data: res.body,
          loading: false,
          displaySource: this.state.source
        })
    )
  }

  componentWillMount () {
    this.setEvaluators()
  }

  render () {
    const {
      dateRange, round, loading, data, evaluators, evaluatorOptions,
      source, displaySource
    } = this.state

    const tableStyle = {
      margin: 10,
      border: '1px solid grey',
      borderRadius: 5
    }

    return (
      <Layout>
        <Header style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>

          <Menu
            theme='dark'
            mode='horizontal'
            selectedKeys={[round]}
            style={{ lineHeight: '64px' }}
            onSelect={({key}) => this.mutate('round')(key)}
          >
            {['R1', 'R2'].map(round => (
              <Menu.Item key={round}>{round}</Menu.Item>
            ))}
          </Menu>

          <RangePicker
            value={dateRange}
            onChange={this.mutate('dateRange')}
          />

          <Select multiple
            style={{width: 400}}
            placeholder='Limit Evaluators'
            value={evaluators}
            onChange={this.mutate('evaluators')}
          >
            {evaluatorOptions.map(name => (
              <Option key={name}>{name}</Option>
            ))}
          </Select>

          <Select value={source}
            style={{ width: 120 }}
            onChange={this.mutate('source')}
          >
            <Option key='Justice Democrats Website'>JD</Option>
            <Option key='BNC Website'>BNC</Option>
            <Option key='Research'>Research</Option>
            <Option key='Personal Contact'>Personal Contact</Option>
            <Option key='Nominator Call'>Nominator Call</Option>
          </Select>

          <Button type='primary' onClick={this.go} loading={loading} >
            Go
          </Button>
        </Header>
        <Content>
          {Object.keys(data).length > 0
            ? (
                <div>
                  <Card title={`${data.nominations} nominations from ${displaySource}`}
                    bodyStyle={{height: 0, padding: 0}}
                  />

                  <div style={tableStyle}>
                    <MyTable data={data.breakdown} label='Breakdown' />
                  </div>

                  <div style={tableStyle}>
                    <MyTable data={data.gender} label={`Gender Breakdown of Yes's`} />
                  </div>

                  <div style={tableStyle}>
                    <MyTable data={data.race} label={`Race Breakdown of Yes\'s`} />
                  </div>

                  {round == 'R2' && (
                    <div>
                      <div style={tableStyle}>
                        {/* <MyTable data={data.tickets} label='Race Breakdown of Yes\'s' /> */}
                      </div>
                    </div>
                  )}
                </div>
              )
            : false
          }
          {/* Gender Table */}

        </Content>
      </Layout>
    )
  }
}
