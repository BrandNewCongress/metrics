import React, { Component } from 'react'
import { Button, Input, Col, Select, InputNumber, DatePicker, Spin } from 'antd'
import request from 'superagent'
import toSpaceCase from 'to-space-case'

const { Option, OptGroup } = Select
const { RangePicker } = DatePicker

const operations = [
  { name: 'breakdown', label: 'Breakdown' },
  { name: 'count', label: 'Count' }
]

const models = [
  'People', 'Nominations', 'Nominee Evaluations', 'Contact Logs'
]

export default class Query extends Component {
  state = {
    operation: null,
    model: null,
    attribute: null,
    secondaryAttribute: null,
    attributeOptions: [],
    linkedModelOptions: [],
    secondaryAttributeOptions: [],
    dateRange: [],
    loading: false,
    filterBy: null,
    filterVal: [],
    filterOptions: []
  }

  go = () => {
    this.setState({loading: true})

    const {
      operation, model, attribute, secondaryAttribute, filterBy, filterVal
    } = this.state

    const dateRange = this.state.dateRange.map(m => m.toDate().toString())

    const query = Object.assign(
      { operation, model, attribute, secondaryAttribute, dateRange },
      filterBy
        ? {[filterBy]: filterVal}
        : {}
    )

    request.get(window.API_ENDPOINT + '/query')
      .query(query)
      .end((err, res) => err
        ? this.setState({err})
        : (
            this.props.displayQuery(query, res.body),
            this.setState({loading: false})
          )
      )
  }

  isComplex = () => this.state.linkedModelOptions && this.state.linkedModelOptions
    .filter(([m,M]) => this.state.attribute == m).length > 0

  mutate = attr => val => {
    this.state[attr] = val

    if (attr == 'model') {
      this.state.attributeOptions = []
      this.askForAttributes(val)
    }

    if (attr == 'attribute') {
      if (this.isComplex()) {
        this.state.secondaryAttributeOptions = []
        const model = this.state.linkedModelOptions.filter(([m,M]) => m == val)[0][1]
        this.askForAttributes(model, true)
      } else {
        this.state.secondaryAttribute = null
        this.state.secondaryAttributeOptions = []
      }
    }

    if (attr == 'filterBy') {
      this.askForValues(this.state.model, val)
    }

    this.forceUpdate()
  }

  askForAttributes = (model, secondary) => request.get(window.API_ENDPOINT + '/model-options')
    .query({model})
    .end((err, res) => err
      ? this.setState({err})
      : secondary
        ? this.setState({
            secondaryAttributeOptions: res.body.attributeOptions
          })
        : this.setState({
            linkedModelOptions: res.body.linkedModelOptions,
            attributeOptions: res.body.attributeOptions
          })
    )

  askForValues = (model, attribute) => request.get(window.API_ENDPOINT + '/attribute-options')
    .query({model, attribute})
    .end((err, res) => err
      ? this.setState({err})
      : this.setState({filterOptions: res.body})
    )

  render () {
    const {
      operation, model, attribute, dateRange, loading, secondaryAttribute,
      attributeOptions, linkedModelOptions, secondaryAttributeOptions,
      filterBy, filterOptions, filterVal
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
                <Select style={{width: 200, ...itemStyle}}
                  onChange={this.mutate('attribute')}
                  value={attribute}
                >
                  <OptGroup label='Linked Models'>
                    {linkedModelOptions.map(m => (
                      <Option value={m[0]}>{m[0]}</Option>
                    ))}
                  </OptGroup>
                  <OptGroup label='Attributes'>
                    {attributeOptions.map(o => (
                      <Option value={o}>{toSpaceCase(o)}</Option>
                    ))}
                  </OptGroup>
                </Select>
              )
            : (
                <Spin style={itemStyle} />
              )
          : null
        }

        {this.isComplex() && (
          <div style={{color: 'white'}}>
            's
            <Select style={{width: 200, ...itemStyle}}
              onChange={this.mutate('secondaryAttribute')}
              value={secondaryAttribute}
            >
              {secondaryAttributeOptions.map(o => (
                <Option value={o}>{toSpaceCase(o)}</Option>
              ))}
            </Select>
          </div>
        )}

        {operation == 'count' && model || model && attribute != null
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

        {dateRange.length == 2 && (
          <div style={{color: 'white', ...itemStyle}}>
            including only where
            <Select style={{width: 200, ...itemStyle}}
              onChange={this.mutate('filterBy')}
              value={filterBy}
            >
              {attributeOptions.map(o => (
                <Option value={o}>{toSpaceCase(o)}</Option>
              ))}
            </Select>
            is one of
            <Select multiple style={{width: 200, ...itemStyle}}
              onChange={this.mutate('filterVal')}
              value={filterVal}
            >
              {filterOptions.map(o => (
                <Option value={o}>{o}</Option>
              ))}
            </Select>
          </div>
        )}

      </div>
    )
  }
}
