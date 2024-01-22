import React, { Component } from 'react';
import { Table } from '@finos/perspective';
import { ServerRespond } from './DataStreamer';
import { DataManipulator, Row } from './DataManipulator';
import './Graph.css';

interface IProps {
  data: ServerRespond[];
}

interface PerspectiveViewerElement extends HTMLElement {
  load: (table: Table) => void;
}

class Graph extends Component<IProps, {}> {
  table: Table | undefined;

  componentDidMount() {
    // Get element from the DOM.
    const elem = document.getElementsByTagName('perspective-viewer')[0] as unknown as PerspectiveViewerElement;

    const schema = {
      ratio: 'float',
      upper_bound: 'float',
      lower_bound: 'float',
      trigger_alert: 'boolean',
      price_abc: 'float',
      price_def: 'float',
      timestamp: 'date',
    };

    if (window.perspective && window.perspective.worker()) {
      this.table = window.perspective.worker().table(schema);
    }

    if (this.table) {
      // Load the `table` in the `<perspective-viewer>` DOM reference.
      elem.load(this.table);
      elem.setAttribute('view', 'y_line');
      elem.setAttribute('row-pivots', '["timestamp"]');
      elem.setAttribute('columns', '["ratio", "lower_bound", "upper_bound", "trigger_alert"]');
      elem.setAttribute('aggregates', JSON.stringify({
        ratio: 'avg',
        upper_bound: 'avg',
        lower_bound: 'avg',
        trigger_alert: 'distinct count',
      }));
    }
  }

  componentDidUpdate() {
    if (this.table) {
      const rowData = DataManipulator.generateRow(this.props.data);
      const rowArray: Row[] = [rowData];

      // Convert rowArray to a different structure before updating the table
      const dataForUpdate = rowArray.map(row => ({
        'timestamp': row.timestamp instanceof Date ? row.timestamp.toISOString() : row.timestamp,
        'ratio': row.ratio,
        'upper_bound': row.upper_bound,
        'lower_bound': row.lower_bound,
        'trigger_alert': row.trigger_alert !== undefined ? row.trigger_alert : null,
      }));

      // Update the configuration object to include the necessary properties
      const config: any = {
        'timestamp': true,
        'ratio': true,
        'upper_bound': true,
        'lower_bound': true,
        'trigger_alert': true,
      };

      // Use the updated configuration
      this.table.update(dataForUpdate as any, config);
    }
  }

  render() {
    return React.createElement('perspective-viewer');
  }
}

export default Graph;
