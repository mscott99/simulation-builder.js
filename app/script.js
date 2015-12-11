
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
		drawing.fillRect(x,y,1,1);
	},
	line  :  function(originX,originY,goalX,goalY){
	
			drawing.moveTo(originX,originY);
			drawing.lineTo(goalX,goalY);
			drawing.stroke();
		},
	
	drawLine : function(point1,point2){
		drawing.moveTo(point1.x,point1.y);
			drawing.lineTo(point2.x,point2.y);
			drawing.stroke();
	},
	drawGivenLine : function(line){
		if(line.isConverted){
		drawing.moveTo(line.point1.x,line.point1.y);
			drawing.lineTo(line.point2.x,line.point2.y);
			drawing.stroke();
		}else{
			base.line(0,0,1000,1000);
		}
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
	this.isConverted = false;
}

Point.prototype.convert= function(){
	return{
		x:this.x*canvas.clientWidth/(this.z+canvas.clientWidth)+canvas.clientWidth/2,
		y:this.y*canvas.clientHeight/(this.z+canvas.clientHeight)+canvas.clientHeight/2,
		isConverted:true
		}
}

//this is used when we only want to draw one point: not very often
Point.prototype.draw = function(){
	base.point(this.x*canvas.clientWidth/(this.z+canvas.clientWidth)+canvas.clientWidth/2,this.y*canvas.clientHeight/(this.z+canvas.clientHeight)+canvas.clientHeight/2);
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
	this.isConverted = false;
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
	this.mainPoints=[point1,point2,point3];
	//this line makes a fictionnal center point of the figure, then takes the difference with point 2 and adds it on to its own value(of the center point)
	this.mainPoints[3] = new Point(point1.x+point3.x-point2.x,point1.y+point3.y-point2.y, point1.z+point3.z-point2.z);
	
	var order =[[0,1][3,2][3,0][2,1]];
	for(var x=0; x<4;x++){
		var origin = order[x][0];
		var goal = order[x][1];
	var coefficientx = (this.mainPoints[goal].x-this.mainPoints[origin].x)/(linesBetweenPoint1_Point2+1);
	var coefficienty = (this.mainPoints[goal].y-this.mainPoints[origin].y)/(linesBetweenPoint1_Point2+1);
	var coefficientz = (this.mainPoints[goal].z-this.mainPoints[origin].z)/(linesBetweenPoint1_Point2+1);
	if(x==0 || x==1){
		var numLines = linesBetweenPoint1_Point2;
	}else{
		var numLines = linesBetweenPoint2_Point3;
	}
	for(var l=0;l<numLines;l++){
	this.minorPoints[x][l]=new Point(coefficientx*(l+1),coefficienty*(l+1), coefficientz*(l+1));
	}
}
}
base.inputScale();




