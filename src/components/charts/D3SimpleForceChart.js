import React from 'react'
import PropTypes from 'prop-types'
import * as d3 from 'd3'

class D3SimpleForceChart extends React.Component {
  componentDidMount() {
    const containerWidth = this.chartRef.parentElement.offsetWidth
    const data = this.props.data
    const colorList =['#FD7623','#3388B1','#D82952','#F3D737','#409071','#D64E52'];
    const margin = { top: 60, right: 60, bottom: 60, left: 60 }
    const width = containerWidth - margin.left - margin.right
    const height = 700 - margin.top - margin.bottom
    let chart = d3
      .select(this.chartRef)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
    let g = chart
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')') // 设最外包层在总图上的相对位置
    let simulation = d3
      .forceSimulation() // 构建力导向图
      .force(
        'link',
        d3
          .forceLink()
          .id(function(d, i) {
            return i
          })
          .distance(function(d) {
            //return d.value * 50
            return 250;
          })
      )
      .force('charge', d3.forceManyBody().strength(-20))
      .force('center', d3.forceCenter(width / 2, height / 2))

    let svgArea = d3.select(".container")
        .append("svg")
        .attr("viewBox", [0, 0, this.width, this.height])
        .call(d3.zoom().on("zoom",function () {
          g.attr("transform",d3.event.transform)
        }))

     let positiveMarker = g.append("marker")
        .attr("id","positiveMarker")
        .attr("orient","auto")
        .attr("stroke-width",2)
        .attr("markerUnits", "strokeWidth")
        .attr("markerUnits", "userSpaceOnUse")
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 35)
        .attr("refY", 0)
        .attr("markerWidth", 12)
        .attr("markerHeight", 12)
        .append("path")
        .attr("d", "M 0 -5 L 10 0 L 0 5")
        .attr('fill', '#999')
        .attr("stroke-opacity", 0.6);
    let negativeMarker = g.append("marker")
        .attr("id","negativeMarker")
        .attr("orient","auto")
        .attr("stroke-width",2)
        .attr("markerUnits", "strokeWidth")
        .attr("markerUnits", "userSpaceOnUse")
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", -25)
        .attr("refY", 0)
        .attr("markerWidth", 12)
        .attr("markerHeight", 12)
        .append("path")
        .attr("d", "M 10 -5 L 0 0 L 10 5")
        .attr('fill', '#999')
        .attr("stroke-opacity", 0.6);


    let z = d3.scaleOrdinal() // 通用线条的颜色

    let link = g
      .append('g') // 画连接线
        .attr('class','links')
        .selectAll("path")
        .data(data.edges,function (d) {
          if(typeof (d.source) === 'object'){
            return d.source.id+"_"+d.relation+"_"+d.target.id
          }
          else{
            return d.source+"_"+d.relation+"_"+d.target
          }
        })
        .join("path")
        .attr("marker-end", "url(#positiveMarker)")
        //.attr("stroke-width", d => Math.sqrt(d.value))
        .attr("id",function (d) {
          if(typeof (d.source) === 'object'){
            return d.source.id+"_"+d.relation+"_"+d.target.id
          }
          else{
            return d.source+"_"+d.relation+"_"+d.target
          }
        })
        .attr("class","link")
        .style('stroke-width','2px')
        .style('stroke','#037693')

    // let linkText = g
    //   .append('g') // 画连接连上面的关系文字
    //   .selectAll('text')
    //   .data(data.edges,function (d) {
    //     if(typeof (d.source) === 'object'){
    //       return d.source.id+"_"+d.relation+"_"+d.target.id
    //     }
    //     else{
    //       return d.source+"_"+d.relation+"_"+d.target
    //     }
    //   })
    //     .join("text")
    //     .style('text-anchor','middle')
    //     .style('fill', 'black')
    //     .style('font-size', '10px')
    //     .style('font-weight', 'bold');

      let linkText = g
          .append('g') // 画连接连上面的关系文字
          .selectAll('text')
          .data(data.edges,function (d){
              return d.source+"_"+d.relation+"_"+d.target
          })
          .enter()
          .append('text')
          .text(function(d) {
              return d.relation
          })
          .attr('class', 'link-text')


    let node = g
      .append('g') // 画圆圈和文字
        .selectAll("circle")
        .data(data.nodes)
        .join("circle")
        .attr("r", 30)
        .attr('class', 'node')
        .attr("fill",  colorList[2])
        .on("click",function (d){

        })
        .call(
            d3
                .drag()
                .on('start', dragstarted)
                .on('drag', dragged)
                .on('end', dragended)
        )
      .on('mouseover', function(d, i) {
        //显示连接线上的文字
        // linkText.style('fill-opacity', function(edge) {
        //   if (edge.source === d || edge.target === d) {
        //     return 1
        //   }
        // })
        //连接线加粗
        // link
        //   .style('stroke-width', function(edge) {
        //     if (edge.source === d || edge.target === d) {
        //       return '2px'
        //     }
        //   })
        //   .style('stroke', function(edge) {
        //     if (edge.source === d || edge.target === d) {
        //       return '#ec1e1e'
        //     }
        //   })
      })
      .on('mouseout', function(d, i) {
        //隐去连接线上的文字
        // linkText.style('fill-opacity', function(edge) {
        //   if (edge.source === d || edge.target === d) {
        //     return 0
        //   }
        // })
        //连接线减粗
        // link
        //   .style('stroke-width', function(edge) {
        //     if (edge.source === d || edge.target === d) {
        //       return '1px'
        //     }
        //   })
        //   .style('stroke', function(edge) {
        //     if (edge.source === d || edge.target === d) {
        //       return '#ddd'
        //     }
        //   })
      })

    node
        .append('title')
        .text(d=>d.name)

    let nodeText = g.append("g")
        .selectAll("text")
        .data(data.nodes)
        .join("text")
        .text(d => d.name)
        .attr("dx",function () {
          return this.getBoundingClientRect().width/2*(-1)
        })
        .attr("dy",50)
        .attr("class","nodeName")

    simulation // 初始化力导向图
      .nodes(data.nodes)
      .on('tick', ticked)

    simulation.force('link').links(data.edges)

    chart
      .append('g') // 输出标题
      .attr('class', 'bar--title')
      .append('text')
      .attr('fill', '#33afe8')
      .attr('font-size', '16px')
      .attr('font-weight', '700')
      .attr('text-anchor', 'middle')
      .attr('x', containerWidth / 2)
      .attr('y', 20)
      .text('人物关系图')
    function select(d){
      var _this = this
      let data = {}
      for(var i in d.obj){
        let ifArray = d.obj[i] instanceof Array
        if(!ifArray){
          data[i] = d.obj[i]
        }
      }
      //_this.$refs.detailPanel.currentNode= data
      //_this.$refs.detailPanel.ifShow = true
    }
    function ticked() {
      // 力导向图变化函数，让力学图不断更新
      link
        .attr('x1', function(d) {
          return d.source.x
        })
        .attr('y1', function(d) {
          return d.source.y
        })
        .attr('x2', function(d) {
          return d.target.x
        })
        .attr('y2', function(d) {
          return d.target.y
        })
          .attr("d", function(d){
            if(d.source.x<d.target.x){
              return "M "+d.source.x+" "+ d.source.y +" L "+d.target.x+" "+d.target.y
            }
            else{
              return "M "+d.target.x+" "+ d.target.y +" L "+d.source.x+" "+d.source.y
            }
          })
          .attr("marker-end",function (d) {
            if(d.source.x>d.target.x){
              return "url(#positiveMarker)"
            }
            else{
             return null
            }
          })
          .attr("marker-start",function (d) {
            if(d.source.x>d.target.x){
              return null
            }
            else{
              return "url(#negativeMarker)"
            }
          })
      linkText
        .attr('x', function(d) {
          return (d.source.x + d.target.x) / 2
        })
        .attr('y', function(d) {
          return (d.source.y + d.target.y) / 2
        })
      node.attr('transform', function(d) {
        return 'translate(' + d.x + ',' + d.y + ')'
      })
        nodeText
            .attr("x",d=>d.x)
            .attr("y",d=>d.y)
    }

    function dragstarted(d) {
      if (!d3.event.active) {
        simulation.alphaTarget(0.3).restart()
      }
      d.fx = d.x
      d.fy = d.y
    }

    function dragged(d) {
      d.fx = d3.event.x
      d.fy = d3.event.y
    }

    function dragended(d) {
      if (!d3.event.active) {
        simulation.alphaTarget(0)
      }
      d.fx = null
      d.fy = null
    }
  }
  render() {
    return (
      <div className="force-chart--simple">
        <svg ref={r => (this.chartRef = r)} />
      </div>
    )
  }
}
D3SimpleForceChart.propTypes = {
  data: PropTypes.shape({
    nodes: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired
        // href:PropTypes.string.isRequired,
      }).isRequired
    ).isRequired,
    edges: PropTypes.arrayOf(
      PropTypes.shape({
        source: PropTypes.number.isRequired,
        target: PropTypes.number.isRequired,
        relation: PropTypes.string.isRequired
      }).isRequired
    ).isRequired
  }).isRequired
}

export default D3SimpleForceChart
