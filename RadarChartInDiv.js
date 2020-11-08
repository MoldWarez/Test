class RadarChart
{
  constructor(X, Y, chartWidth, chartHeight, dimensions, p5)
    {
      this.dimensions = dimensions;
      this.marginWidth = 60;
      this.marginHeight = 60;
      this.X = X + this.marginWidth;
      this.Y = Y + this.marginHeight;
      this.chartWidth = chartWidth - (this.marginWidth * 2);
      this.chartHeight = chartHeight - (this.marginHeight * 2);
      this.angle = 360 / dimensions;
      this.centerX = X + (chartWidth / 2);
      this.centerY = Y + (chartHeight /2);
      this.axisLength = chartHeight / 2 - this.marginHeight;
      this.intervals = 10;
      this.intervalLength = this.axisLength / this.intervals;
      this.labelWidth = p5.percentX(15);
      this.labelHeight = p5.percentY(12);
      this.axisPointsX = [];
      this.axisPointsY = [];
    }
}

class Axis
{
  constructor(id, name, unit, axisValue)
  {
    this.id = id;
    this.name = name;
    this.unit = unit;
    this.axisValue = axisValue;
  }
}


export default class RadarChartInDiv
{
  constructor(canvasWidth, canvasHeight, powerStat, staminaStat, mobilityStat, techniquesStat, rangeStat, div)
  {
    new p5(function(p5)
    {
      let rc;
      p5.axes = [];
      let pulseIdx;
      
      p5.setup = function()
      {
        p5.createCanvas(canvasWidth, canvasHeight);
        
        var powerStatRandom = p5.nf(p5.random(1, 10), 1, 1);
        var staminaStatRandom = p5.nf(p5.random(1, 10), 1, 1);
        var mobilityStatRandom = p5.nf(p5.random(1, 10), 1, 1);
        var techniquesStatRandom = p5.nf(p5.random(1, 10), 1, 1);
        var rangeStatRandom = p5.nf(p5.random(1, 10), 1, 1);
        p5.axes.push(new Axis(1, "Power", powerStatRandom, powerStatRandom));
        p5.axes.push(new Axis(2, "Stamina", staminaStatRandom, staminaStatRandom));
        p5.axes.push(new Axis(3, "Mobility",  mobilityStatRandom,  mobilityStatRandom));
        p5.axes.push(new Axis(4, "Techniques", techniquesStatRandom, techniquesStatRandom));
        p5.axes.push(new Axis(5, "Range", rangeStatRandom, rangeStatRandom));
      
        p5.rc = new RadarChart(p5.percentX(0.5), p5.percentY(0.5), 360, 360, 5, p5);
      }
      
      p5.draw = function()
      {
        pulseIdx = p5.round(p5.frameCount * 0.2 % (p5.rc.intervals - 1));
        
        p5.background(0);
        p5.stroke(255);
        p5.strokeWeight(1);
        p5.point(p5.rc.centerX, p5.rc.centerY);
        
        p5.ContainerPoly();
        p5.RadarPoly(p5.axes);
        
        p5.rc.axisPointsX = [];
        p5.rc.axisPointsY = [];
        var xValue;
        var yValue;
        var ang = 0;
      
        for(var i = 0; i < p5.rc.dimensions; i++, ang += p5.rc.angle)
        {  //increment angle of the axis/dimension drawn i.e. increment by 360/3 deg for a chart of 3 dimentions/axis
      
          var len = p5.rc.intervalLength;
          p5.rc.axisPointsX.push(p5.getX(ang, p5.rc.axisLength + p5.rc.labelHeight/3));
          p5.rc.axisPointsY.push(p5.getY(ang, p5.rc.axisLength + p5.rc.labelHeight/3));
          
          p5.strokeWeight(1);
          p5.line(p5.rc.centerX, p5.rc.centerY, p5.rc.axisPointsX[i], p5.rc.axisPointsY[i]);    //draw the axis line
          
          p5.stroke(255);
          
          p5.displayLabels(ang, p5.axes[i]); 
          
          for(var index = 0; index < p5.rc.intervals; index++, len += p5.rc.intervalLength){
            var strokeOpacity = 100;
            if (index == pulseIdx || index == pulseIdx + 1 || index == pulseIdx - 1)
            {
              strokeOpacity = 255;
            }
            
            xValue = p5.getX(ang, len);
            yValue = p5.getY(ang, len);
            
            p5.strokeWeight(4);  //mark all the interval points on the axes drawn
            p5.stroke(255, 255, 255, strokeOpacity);
            p5.point(xValue,yValue);
            p5.strokeWeight(1);
            p5.stroke(255);
          }
        }
      }
      
      //get the x-axis co-ordinate of a point on the axis/dimension being drawn in the radar chart
      p5.getX = function(ang, len)
      {
        return (p5.rc.centerX + (len * p5.cos(p5.radians(ang))));    
      }
      
      //get the x-axis co-ordinate of a point on the axis/dimension being drawn in the radar chart
      p5.getY = function(ang, len)
      {
        return (p5.rc.centerY + (len * p5.sin(p5.radians(ang))));
      }  
      
      p5.RadarPoly = function(drawAxes)
      {
        p5.beginShape();
        var greenAmount = 100 + ((0.5 * (1 + p5.sin(2 * p5.PI * p5.frameCount * 0.003))) * 155);
        p5.fill(0, greenAmount, 0, 75);
        p5.stroke(255);
        p5.strokeWeight(2);
        for (var i = 0; i < drawAxes.length; i++)
        {
          var xValue = p5.getX(p5.rc.angle * i, p5.rc.intervalLength * (drawAxes[i].axisValue + 1));
          var yValue = p5.getY(p5.rc.angle * i, p5.rc.intervalLength * (drawAxes[i].axisValue + 1));
          p5.vertex(xValue, yValue);
        }
        p5.endShape(p5.CLOSE);
      }
      
      p5.ContainerPoly = function()
      {
        p5.beginShape();
        var greenAmount = 100 + ((0.5 * (1 + p5.sin(2 * p5.PI * p5.frameCount * 0.003 + 5))) * 155);
        p5.fill(0, greenAmount, 0, 30);
        p5.stroke(102, 102, 102, 50);
        p5.strokeWeight(2);
        for (var i = 0; i < p5.rc.dimensions; i++)
        {
          var xValue = p5.getX(p5.rc.angle * i, p5.rc.intervalLength * (11));
          var yValue = p5.getY(p5.rc.angle * i, p5.rc.intervalLength * (11));
          p5.vertex(xValue, yValue);
        }
        p5.endShape(p5.CLOSE);
      }
      
      p5.percentX = function(value)
      {
        return (value * p5.width)/100;
      }
      
      p5.percentY = function(value)
      {
        return (value * p5.height)/100;
      }
      
      p5.displayLabels = function(ang, axis)
      {
        var xValue = p5.getX(ang, p5.rc.axisLength + p5.rc.labelHeight / 4, p5.rc);
        var yValue = p5.getY(ang, p5.rc.axisLength + p5.rc.labelHeight / 4, p5.rc);              
                        
         if(ang >= 0 && ang < 90)
         {
          p5.textAlign(p5.LEFT, p5.BOTTOM);
          p5.text(axis.name + " (" + axis.unit + ")", xValue - p5.rc.labelWidth / 3, yValue + p5.rc.labelHeight / 2);        
         }
         if(ang >= 90 && ang < 180)
         {    
          p5.textAlign(p5.LEFT, p5.BOTTOM);   
          p5.text(axis.name + " (" + axis.unit + ")", xValue - p5.rc.labelWidth, yValue + p5.rc.labelHeight / 2);      
         }
         if(ang >= 180 && ang < 270)
         {     
          p5.textAlign(p5.LEFT, p5.BOTTOM);  
          p5.text(axis.name + " (" + axis.unit + ")", xValue - p5.rc.labelWidth, yValue - p5.rc.labelHeight / 6); 
         }
         if(ang >= 270 && ang < 360)
         { 
          p5.textAlign(p5.LEFT, p5.BOTTOM);      
          p5.text(axis.name + " (" + axis.unit + ")", xValue - p5.rc.labelWidth / 2, yValue - p5.rc.labelHeight / 6); 
         }
      
         p5.fill (255);
         p5.stroke(0);
      }
    }, div);
  }
}
