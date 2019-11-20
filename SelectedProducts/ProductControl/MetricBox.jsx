import React, { Component } from 'react';
import ReactHighcharts from  'react-highcharts';
import styled from 'styled-components';
import GraphBuilder from '../../../../lib/graph-builder';
import LinesEllipsis from 'react-lines-ellipsis'

import MetricBoxTheme from "../../../../lib/graph-builder/Themer/MetricBoxTheme";
import { Formatter } from "../../../../lib/util";
import {
  GrowIcon,
  FalloffIcon
} from '../../common';

const Box = styled.div`
  height: 100%;
  width: ${props => props.width}%;
  cursor: pointer;
  position: relative;
  .value {
    font-weight: bold;
    font-size: 14px;
    color: #1E135F;
    margin: 5px 0px 5px;
  }
  
  .info{
     padding: 16px;
     transition: opacity 0.5s;
   }
   
  .label {
    font-weight: 600;
    line-height: 12px;
    font-size: 10px;
    color: rgba(30, 19, 95, 0.5);
    -webkit-line-clamp: 2;
    -moz-line-clamp: 2;
  }
  
  & > .mini-chart {
    top: 0px;
    position: absolute;
    height: 100%;
    width:100%;
    opacity: 0.1
    transition: opacity 0.5s;
  }

  & > .status-value {
    display: inline-block;
    text-align: center;
    position: relative;
    top: -22px;
    left: auto;
    text-align: center;
    width: 100%;
    padding: 5px;
    opacity: 0;
    font-family: Open Sans;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
    font-size: 10px;
    color: #1E135F;
    transition: opacity 0.5s;
    
    span{
      background: rgba(255,255,255,0.9);
      padding: 5px 5px;
      border-radius: 5px;
    }
  }

  &:hover {
    .info {
      opacity: 0;
    }

    & > .mini-chart, & > .status-value {
      opacity: 1
    }
  }

  &.active {
    color: ${props => props.color};

    .label, .value {
      color: ${props => props.color};
    }
  }
`;

export default class MetricBox extends Component {

  constructor(props){
    super(props);
    this.state = {
      graphConfig: this.getGraphConfig(props)
    };
  }


  selectMetric = (ev) => {
    ev.stopPropagation();
    const { onSelect, metric } = this.props;
    onSelect( metric );
  };

  onReflow(ev){
    const old = this.canvas.style.width;
    this.copyStyleToCanvas();
    const next = this.canvas.style.width;

    if(old !== next){
      this.reflow(this.props);
    }
  }

  componentDidUpdate(prevProps)
  {
    const {
      resultSet: nextResultSet,
      color: nextColor,
      historical: nextHistorical
    } = this.props;

    const {
      resultSet,
      color,
      historical,
    } = prevProps;

    if(resultSet !== nextResultSet || color !== nextColor || historical !== nextHistorical){
      const graphConfig = this.getGraphConfig(this.props);
      this.setState({graphConfig});
    }
  }

  getGraphConfig(props){
    const {
      resultSet,
      color,
      historical
    } = props;

    if(!resultSet){
      return {};
    }
    const builder = GraphBuilder.smallGraph(resultSet, color, historical);
    builder.addThemer( new MetricBoxTheme({}) );
    return builder.build()
  }

  render() {
    const {
      resultSet,
      metric,
      label,
      isSelected,
      color,
      width = 1,
      historical
    } = this.props;

    const{
      graphConfig
    } = this.state;

    let value = 'loading...';
    let diffBox = '';
    let graph = '';

    if(resultSet){
      const agg = Formatter.formatMetric(resultSet.current.aggregate(metric.aggregate_function), metric);
      value = `${agg.text}`;

      if(historical && resultSet.history){
        const change = Formatter.formatMetric(resultSet.change(metric), metric);
        const indicator = Number(change.value) < 0 && metric.direction ? <FalloffIcon/> : <GrowIcon/>;
        diffBox =
            <div className='status-value'><span>
              {change.text} {indicator}
            </span></div>;
      }
      graph = (<ReactHighcharts config = {graphConfig} isPureConfig={true} />);
    }

    //const metricName = metric.split('.')[1];
    //const id = metricName + '_graph_' + info.id;
    const selected = isSelected ? 'active' : '';

    //temporary until we convert dashboard and styler to react
    const style = selected ? {color} : {};
    return (
        <Box className={`${selected}`} width={width} onClick={this.selectMetric}>
          <div className='info' >
            <div className='value' style={style}>{value}</div>
            <LinesEllipsis className='label'
                text={label}
                maxLine='2'
                ellipsis=' ...'
                basedOn='letters'
                onReflow={this.onReflow}
                width = {width}/>

          </div>
          <div className='mini-chart'>
            {graph}
          </div>
          {diffBox}
        </Box>
    )
  }
}
