import React from "react";
import _ from "lodash";
import { Table, Form, Row, Col, Button } from "react-bootstrap";

class RadioInputTable extends React.Component {
  state = {
    checkbox: true,
  };

  handleGridReady = (params) => {
    console.log("params", params);
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  };

  handleCheck = (index, columnNumber) => {
    //columnNumber 1-4 respectively
    return (e) => {
      console.log(e);

      console.log(e.currentTarget.checked);
      console.log(index, columnNumber);
      // this.setState({ checkbox: !e.currentTarget.checked });
    };
  };

  isCellValueChecked = (rowData, colIndex) => {
    const { columns } = _.get(this.props, 'uiSchema.ui:options', {});
    const formData = this.props.formData;
    const selectedColumn = columns[colIndex];
    const rowValues = formData[rowData];
    return _.includes(rowValues, selectedColumn);
  }

  renderCell(rowData, colIndex) {
    return (
      <Form.Check
        checked={this.isCellValueChecked(rowData, colIndex)}
        onChange={this.handleCheck(colIndex, 1)}
        type="radio"
        style={{ display: "flex", justifyContent: "center" }}
      />
    )
  }


  render() {
    const { rows, columns } = _.get(this.props, 'uiSchema.ui:options', {});
    return (
      <Table responsive>
        <thead>
          <tr>
            <th></th>
            {_.map(columns, (data, index) => (
              <th key={index}>{data}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {_.map(rows, (rowData, rowIndex) => (
            <tr>
              <td key={rowIndex}>{rowData}</td>
              {_.map(columns, (colData, colIndex) => (
                <td key={colIndex}>
                  {this.renderCell(rowData, colIndex)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    )
  }
}

export default RadioInputTable;
