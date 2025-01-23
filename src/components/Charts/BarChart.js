import React, { Component } from "react";
import Chart from "react-apexcharts";

class BarChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      series: [],
      options: {}
    };
  }

  componentDidMount() {
    const { barChartData, barChartOptions } = this.props;
    this.setState({
      series: barChartData,
      options: barChartOptions
    });
  }

  render() {
    const { series, options } = this.state;
    
    if (!series?.length || !Object.keys(options).length) {
      return null;
    }

    return (
      <Chart
        options={options}
        series={series}
        type='bar'
        width='100%'
        height='100%'
      />
    );
  }
}

export default BarChart;
