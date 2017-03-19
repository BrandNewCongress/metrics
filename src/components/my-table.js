import React, { Component } from 'react'
import { Table } from 'antd'

export default class MyTable extends Component {
  render () {
    const { data, label } = this.props

    return (
      <Table columns={[{
          title: 'Value',
          key: 'value',
          dataIndex: 'value'
        }, {
          title: 'Count',
          key: 'count',
          dataIndex: 'count',
        }]}
        dataSource={Object.entries(data).map(([value, count]) => ({value, count}))}
        pagination={false}
        title={() => label}
        size='middle'
      />
    )
  }
}
