
var chart = {};

var polledSurveyId = null;

var timeoutId = null;

var pollSurveyResults = function(){
  $.get('/surveys/' + polledSurveyId + '/responses', function(res){
    if (res) {
      for (var q in res) {
        if (res.hasOwnProperty(q)) {
          var d = JSON.parse("[" + res[q].replace(/\'/g, '"') + "]");
          if (chart[q + "_container_pie"]) chart[q + "_container_pie"].series[0].setData(d);
          if (chart[q + "_container_bar"]) chart[q + "_container_bar"].series[0].setData(d);
        }
      }
    }
  }, "json");

  timeoutId = setTimeout(pollSurveyResults, 30000);
};


function show_pie_chart(description, surveyId, target, responses) {
  chart[target + "_pie"] = new Highcharts.Chart({
    chart: {
      renderTo: target,
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false
    },
    title: {
      text: description
    },
    tooltip: {
      formatter: function() {
        return '<b>'+ this.point.name +'</b>: '+ Math.round(this.percentage*100)/100 +' %';
      }
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          color: '#000000',
          connectorColor: '#000000',
          formatter: function() {
            return '<b>'+ this.point.name +'</b>: '+ Math.round(this.percentage*100)/100 +' %';
          }
        }
      }
    },
    credits: {
        enabled: false
    },
      series: [{
      type: 'pie',
      name: 'response data',
      data: responses
    }]
  });

  if (!polledSurveyId || polledSurveyId !== surveyId) {
    polledSurveyId = surveyId;
    if (timeoutId) clearTimeout(timeoutId);
    pollSurveyResults();
  }
}

function show_bar_chart(description, surveyId, target, options, responses) {
  chart[target + "_bar"] = new Highcharts.Chart({
    chart: {
        renderTo: target,
        type: 'bar'
    },
    title: {
        text: description
    },
    xAxis: {
        categories: options,
        title: {
            text: null
        }
    },
    yAxis: {
        min: 0,
        title: {
            text: null
        }
    },
    tooltip: {
        formatter: function() {
            return ''+
                this.series.name +': '+ Math.round(this.y * 10)/10 +'';
        }
    },
    plotOptions: {
        bar: {
            dataLabels: {
                enabled: true,
                formatter:function(){return''+Math.round(this.y * 10)/10+''}
            }
        }
    },
    credits: {
        enabled: false
    },
    series: [{
        name: 'Number of responses',
        data: responses
    }]
  });
  if (!polledSurveyId || polledSurveyId !== surveyId) {
    polledSurveyId = surveyId;
    if (timeoutId) clearTimeout(timeoutId);
    pollSurveyResults();
  }
}
