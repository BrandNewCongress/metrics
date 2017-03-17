import React, { Component } from 'react'
import { Table } from 'antd'

export default class MyTable extends Component {
  render () {
    const { data, label } = this.props

    return (
      <Table columns={Object.keys(data).map(k => ({
          title: k.toUpperCase(),
          key: k,
          dataIndex: k
        }))}
        dataSource={[data]}
        pagination={false}
        title={() => label}
        size='middle'
      />
    )
  }
}
