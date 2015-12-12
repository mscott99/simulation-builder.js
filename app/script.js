
var canvas = document.getElementById("c");
var drawing = canvas.getContext("2d");



//var realLine = generator.generateLine(3,3,100,100);
//base.line(realLine.originX,realLine.originY, realLine.goalX,realLine.goalY);
//drawing.arc(100,100,50,3,4);

var base ={
	inputScale: function(){
		base.line(canvas.clientWidth/2,0,canvas.clientWidth/2,canvas.clientHeight);
		base.line(0,canvas.clientHeight/2,canvas.clientWidth,canvas.clientWidth/2);
	},
	point: function(x,y){
		drawing.fillRect(x+canvas.clientWidth/2,y+canvas.clientHeight/2,1,1);
	},
	
	line  :  function(originX,originY,goalX,goalY){
	
			drawing.moveTo(originX+canvas.clientWidth/2,originY+canvas.clientHeight/2);
			drawing.lineTo(goalX+canvas.clientWidth/2,goalY+canvas.clientHeight/2);
			drawing.stroke();
		},
	
	drawLine : function(point1,point2){
		drawing.moveTo(point1.x+canvas.clientWidth/2,point1.y+canvas.clientHeight/2);
			drawing.lineTo(point2.x+canvas.clientWidth/2,point2.y+canvas.clientHeight/2);
			drawing.stroke();
	},
	drawGivenLine : function(line){
		
		drawing.moveTo(line.point1.x,line.point1.y);
			drawing.lineTo(line.point2.x,line.point2.y);
			drawing.stroke();
		
	},
	simpleGrid : function(originX,originY,goalX,goalY,numLine,space){
		var x;
		for(x=0;x<numLine;x++){
		base.line(originX+x*space,originY,goalX+x*space,goalY);
		}
		drawing.stroke();
	},
	halfBlankLine: function(baseX,baseY,goalX,goalY, cutoffHeight){//this function needs the height of the cutoff in y
		var totalHeight = goalY-baseY; //the base is higher than goal
		var ratio = cutoffHeight/totalHeight;
		var newGoal = baseY+cutoffHeight;
		var totalWidth = goalX-baseX;
		var newGoalX = baseX + totalWidth*ratio;
		base.line(baseX,baseY,newGoalX, newGoal);
	},
	
	
	
	
	
	grid: function(baseX,baseY,goalX,goalY, cutoffHeight,numLine,space){
		var x;
		for(x=0;x<numLine;x++){
		base.halfBlankLine(baseX+x*space,baseY,goalX,goalY,cutoffHeight);
		}
		drawing.stroke();
	}
}
	
	



function Point(x,y,z){
	
	this.x = x;
	this.y = y;
	this.z = z;
	
}

Point.prototype.convert= function(){
	return{
		x:(this.x*canvas.clientWidth)/(this.z+canvas.clientWidth),
		y:(this.y*canvas.clientHeight)/(this.z+canvas.clientHeight),
		isConverted:true
		}
}

//this is used when we only want to draw one point: not very often
Point.prototype.draw = function(){
	base.point((this.x*canvas.clientWidth)/(this.z+canvas.clientWidth),(this.y*canvas.clientHeight)/(this.z+canvas.clientHeight));
}
//this function can take in two points or four coordinates. If called in two points,  enter twoPoints as true



function Line(x1,y1,z1,x2,y2,z2, fromTwoPoints){
	if(fromTwoPoints){
		this.point1=x1;
		this.point2 = y1;
}else{
	this.point1 = new Point(x1,y1,z1);
	this.point2 = new Point(x2,y2,z2);
}
	
}

Line.prototype.convert= function(){
	return{
		point1:this.point1.convert(),
		point2:this.point2.convert(),
		isConverted :true
			
		}
}

Line.prototype.draw = function(){
	var pointa =this.point1.convert();
	var pointb = this.point2.convert();
	base.line(pointa.x,pointa.y,pointb.x,pointb.y);
}
//point1 is linked to point 2 which is linked to point 3
function Grid(point1,point2,point3, linesBetweenPoint1_Point2, linesBetweenPoint2_Point3){
		this.minorPoints = [[0],[0],[0],[0]];//to create array of arrays
		this.mainPoints=[point1,point2,point3];
		
		//this line makes a fictionnal center point of the figure, then takes the difference with point 2 and adds it on to its own value(of the center point)
		this.mainPoints[3] = new Point(point1.x+point3.x-point2.x,point1.y+point3.y-point2.y, point1.z+point3.z-point2.z);
		
		var order =[[0,1],[3,2],[3,0],[2,1]];
		
		for(var x=0; x<4;x++){
			
			var origin = order[x][0];
			var goal = order[x][1];
			
			if(x==0 || x==1){
				var numLines = linesBetweenPoint1_Point2;
			}else{
				var numLines = linesBetweenPoint2_Point3;
			}
			
			var coefficientx = (this.mainPoints[goal].x-this.mainPoints[origin].x)/(numLines+1);
			var coefficienty = (this.mainPoints[goal].y-this.mainPoints[origin].y)/(numLines+1);
			var coefficientz = (this.mainPoints[goal].z-this.mainPoints[origin].z)/(numLines+1);
			
			
			 
			for(var l=0;l<numLines+2;l++){
				
				
				this.minorPoints[x][l]=new Point(this.mainPoints[origin].x+coefficientx*l,this.mainPoints[origin].y+coefficienty*l, this.mainPoints[origin].z+coefficientz*l);
				this.minorPoints[x][l].draw();
			
				
			}
		
			this.mainPoints[x].draw();
			
		}
		
		//creation of points finished
		//creation of lines start
		this.lines=[[0],[0]];
		for(var m=0;m<linesBetweenPoint1_Point2+2;m++){
			this.lines[0][m] = new Line(this.minorPoints[0][m],this.minorPoints[1][m],0,0,0,0,true);
			this.lines[0][m].draw();
		}
		
		for(var m=0;m< linesBetweenPoint2_Point3 +2;m++){
			this.lines[1][m] = new Line(this.minorPoints[2][m],this.minorPoints[3][m],0,0,0,0,true);
			this.lines[1][m].draw();
		}
		
		
		
		
}

function Triangle(grid, linkedPoint1,linkedPoint2, definerPoint){
	this.mainPoints = [grid.mainPoints[0], grid.mainPoints[1], definerPoint];
	this.mainLines = [new Line(this.mainPoints[0],this.mainPoints[1],0,0,0,0,true),new Line(this.mainPoints[1],this.mainPoints[2],0,0,0,0,true),new Line(this.mainPoints[2],this.mainPoints[0],0,0,0,0,true)]
	for(var x = 0; x<3; x++){
		this.mainLines[x].draw();
	}
}//left to do on triangles: append them completely to surface, apend them with the same angle, without outside borders, and make plane constructor class

var point1 = new Point(100, 50,10);
var point2 = new Point(-100,50,10);
var point3 = new Point(-100,-25,200);
var point4 = new Point(-150, -200,200);
var point5 = new Point(150,-200,200);
var point6 = new Point(100,-25, 200);
var line = new Line(point1,point2,0,0,0,0,true);

//comment
var grid1 = new Grid(point1,point2,point3,4,4);
var grid2 = new Grid(point2, point3, point4,4,4);
var grid3 = new Grid(point1,point6, point5, 4, 4);
var trianglePoint = new Point(0,0,-5);
var triangle = new Triangle(grid1,0,1,trianglePoint);



