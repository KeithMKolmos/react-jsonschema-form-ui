import expect from 'expect';
import React, { Component } from 'react';
import Form from '@rjsf/core';
import {render, unmountComponentAtNode} from 'react-dom';

import { ArrayFieldTemplate, CurrencyWidget, PercentWidget, RawHTMLField, ReactDatePickerWidget, ReactSelectWidget, ReactSignatureCanvasField, StatesWidget } from 'src/';

const widgets = {
  CurrencyWidget: CurrencyWidget,
  PercentWidget: PercentWidget,
  ReactDatePickerWidget: ReactDatePickerWidget,
  ReactSelectWidget: ReactSelectWidget,
  StatesWidget: StatesWidget
};

const fields = {
  RawHTMLField: RawHTMLField,
  ReactSignatureCanvasField: ReactSignatureCanvasField
};

const log = (type) => console.log.bind(console, type);

const schema = {
  type: "object",
  required: [],
  properties: {
    test_react_select_without_enumNames: {
      title: "Test React Select (WITHOUT enumNames)",
      type: "string",
      enum: ["1", "2", "3"]
    },
    test_react_select_with_enumNames: {
      title: "Test React Select (WITH enumNames)",
      type: "string",
      enum: ["1", "2", "3"],
      enumNames: ["One", "Two", "Three"]
    },
    test_react_select_createable: {
      title: "Test React Select (createable)",
      type: "string",
      enum: ["1", "2", "3"]
    },
    test_react_select_array: {
      title: "Test React Select (ARRAY)",
      type: "array",
      items: {
        type: "string",
        enum: ["1", "2", "3"],
        enumNames: ["One", "Two", "Three"]
      },
      uniqueItems: true
    },
    test_react_select_remote: {
      title: "Test React Select (Remote)",
      type: "array",
      items: {
        type: "string",
        enum: []
      },
      uniqueItems: true
    },
    currency: {
      title: "Currency Demo",
      type: "number"
    },
    percent: {
      title: "Percent",
      type: "number"
    },
    date: {
      title: "Date",
      type: "string"
    },
    array_template: {
      type: "array",
      title: "Custom Array Template",
      minItems: 1,
      items: {
        type: "object",
        properties: {
          string: {
            type: "string",
            title: "String"
          },
          checkbox: {
            type: "boolean",
            title: "Checkbox"
          },
          select: {
            type: "string",
            enum: [],
            title: "Remote Select"
          }
        }
      }
    },
    us_states: {
      type: "string",
      title: "US States"
    },
    signature: {
      type: "string",
      title: "Signer",
      format: "data-url"
    },
    raw_html: {
      type: "string",
      title: "Raw HTML"
    }
  }
};

const uiSchema = {
  test_react_select_with_enumNames:{
    "ui:widget": "ReactSelectWidget"
  },
  test_react_select_without_enumNames: {
    "ui:widget": "ReactSelectWidget",
    "ui:options": {
      "isSearchable": true,
      "isClearable": true,
      "remote": {
        "headers": {},
        "paths": {}
      }
    }
  },
  test_react_select_createable: {
    "ui:widget": "ReactSelectWidget",
    "ui:options": {
      "isCreateable": true,
      "isMulti": true
    }
  },
  test_react_select_array: {
    "ui:widget": "ReactSelectWidget"
  },
  test_react_select_remote: {
    "ui:widget": "ReactSelectWidget",
    "ui:options": {
      "isMulti": true,
      "remote": {
        "url": "https://api.airtable.com/v0/appB2bqf1uwbjCLul/Assignees?&view=Main%20View",
        "headers": {
          "Authorization": "Bearer keyKM5nPQi7efGQ9Z"
        },
        "paths":{
          "record": ["records"],
          "value": ["id"],
          "label": ["fields", "Name"]
        }
      }
    }
  },
  currency: {
    "ui:widget": "CurrencyWidget",
    "ui:options": {
      "precision": 2
    }
  },
  percent: {
    "ui:widget": "PercentWidget",
    "ui:options": {
      "digits": 0
    }
  },
  date: {
    "ui:widget": "ReactDatePickerWidget",
    "ui:options": {
      "format": "YYYY-MM-DD"
    }
  },
  array_template: {
    items: {
      select: {
        "ui:widget": "ReactSelectWidget",
        "ui:options": {
          "isMulti": false,
          "remote": {
            "url": "https://api.airtable.com/v0/appB2bqf1uwbjCLul/Assignees?&view=Main%20View",
            "headers": {
              "Authorization": "Bearer keyKM5nPQi7efGQ9Z"
            },
            "paths":{
              "record": ["records"],
              "value": ["id"],
              "label": ["fields", "Name"]
            }
          }
        }
      }
    }
  },
  signature: {
    "ui:field": "ReactSignatureCanvasField",
    "ui:options": {
      "width": 300,
      "height": 100
    }
  },
  us_states: {
    "ui:widget": "StatesWidget"
  },
  raw_html: {
    "ui:field": "RawHTMLField",
    "ui:options": {html: "<h1>Hi</h1>"}
  }
};

class FormComponent extends Component {
  constructor(props){
    super(props)
    this.state = {
      ...props
    }
  }

  render(){
    return (
      <div className="App">
        <br /><br />
        <div className="row">
          <div className="col-md-4">
            <h2>Test Form</h2>
            <br />
            <Form
              schema={this.state.schema}
              uiSchema={this.state.uiSchema}
              ArrayFieldTemplate={ArrayFieldTemplate}
              widgets={widgets}
              fields={fields}
              onChange={log("changed")}
              onSubmit={log("submitted")}
              onError={log("errors")}
              // disabled={true}
            >
            </Form>
          </div>
        </div>
      </div>
    );
  }
}

describe('FormComponent', () => {
  let node;

  beforeEach(() => {
    node = document.createElement('div');
  })

  afterEach(() => {
    unmountComponentAtNode(node);
  })

  it('Show form normal mode', () => {
    render(<FormComponent schema={schema} uiSchema={uiSchema} />, node, () => {
      expect(node.innerHTML).toNotContain('No Signature');

      expect(node.innerHTML).toContain('Test React Select (WITHOUT enumNames)');
    })
  })

  it('Show form readyOnly mode', () => {
    render(<FormComponent schema={{...schema, readOnly: true}} uiSchema={uiSchema} />, node, () => {
      expect(node.innerHTML).toContain('No Signature');

      const inputElements = node.getElementsByTagName('input');
      const inputList = Array.prototype.slice.call(inputElements);
      inputList.forEach((element) => {
        expect(element.hasAttribute('disabled') || element.hasAttribute('readonly') ).toBeTruthy();
      });
    })
  })
})