import React, { Component } from 'react'
import { Button, Input, Col, Select, InputNumber, DatePicker, Spin } from 'antd'
import request from 'superagent'
import toSpaceCase from 'to-space-case'

const { Option } = Select
const { RangePicker } = DatePicker

const operations = [
  { name: 'breakdown', label: 'Breakdown' },
  { name: 'count', label: 'Count' }
]

const models = [
  'People', 'Nominations', 'Nominee Evaluations', 'Contact Logs'
]

const apiEndpoint = () => window.location.href.includes('localhost')
  ? 'http://localhost:8080/metrics'
  : 'https://api.brandnewcongress.org/metrics'

export default class Query extends Component {
  state = {
    operation: null,
    model: null,
    attributes: [],
    attributeOptions: [],
    dateRange: [],
    loading: false
  }

  go = () => {
    const {operation, model, attributes, dateRange} = this.state
    request.get(apiEndpoint() + '/query')
      .query({
        operation, model, attributes, dateRange
      })
      .end((err, res) => err
        ? this.setState({err})
        : this.props.displayQuery(res.body)
      )
  }

  mutate = attr => val => {
    if (attr == 'model') {
      this.setState({attributeOptions: []})
      this.askForAttributes(val)
    }

    this.setState({[attr]: val})
  }

  askForAttributes = (model) => request.get(apiEndpoint() + '/model-options')
    .query({model})
    .end((err, res) => err
      ? this.setState({err})
      : this.setState({attributeOptions: res.body})
    )

  render () {
    const {
      operation, model, attributes, attributeOptions, dateRange, loading
    } = this.state

    const itemStyle = {
      marginLeft: 5,
      marginRight: 5
    }

    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        minHeight: '64px'
      }}>
        <Select style={{width: 120, ...itemStyle}}
          onChange={this.mutate('operation')}
          value={operation}
        >
          {operations.map(o => (
            <Option value={o.name}>{o.label}</Option>
          ))}
        </Select>
        {operation && (
          <Select style={{width: 150, ...itemStyle}}
            onChange={this.mutate('model')}
            value={model}
          >
            {models.map(m => (
              <Option value={m}>{m}</Option>
            ))}
          </Select>
        )}
        {operation == 'breakdown' && model && (
          <div style={{color: 'white'}}>
            's
          </div>
        )}
        {model && operation == 'breakdown'
          ? attributeOptions.length > 0
            ? (
                <Select style={{width: 200, ...itemStyle}} multiple
                  onChange={this.mutate('attributes')}
                  value={attributes}
                >
                  {attributeOptions.map(o => (
                    <Option value={o}>{toSpaceCase(o)}</Option>
                  ))}
                </Select>
              )
            : (
                <Spin style={itemStyle} />
              )
          : null
        }
        {operation == 'count' && model || model && attributes.length > 0
          ? (
              <div style={{color: 'white', ...itemStyle}}>
                {'in dates'}
                <RangePicker
                  style={{marginLeft: 5}}
                  value={dateRange}
                  onChange={this.mutate('dateRange')}
                />
              </div>
            )
          : null
        }
        {dateRange.length == 2 && (
          <Button type='primary' onClick={this.go} loading={loading} >
            Go
          </Button>
        )}
      </div>
    )
  }
}
