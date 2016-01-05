
var canvas = document.getElementById("c");
var drawing = canvas.getContext("2d");



//var realLine = generator.generateLine(3,3,100,100);
//base.line(realLine.originX,realLine.originY, realLine.goalX,realLine.goalY);
//drawing.arc(100,100,50,3,4);

var base ={
    background: function(){
      drawing.fillStyle= "#5bd75b";
    drawing.fillRect(0,0,canvas.clientWidth,canvas.clientHeight);  
    },
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
		this.mainPoints = [x1, y1];
}else{
	this.point1 = new Point(x1,y1,z1);
	this.point2 = new Point(x2,y2,z2);
	this.mainPoints = [this.point1, this.point2];
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
				
			
				
			}
		
			
			
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
		//function is not working
		this.findArray = function(point1, point2){
			var isLinked = false;
			for(var arrays in this.minorPoints){
				for(var array in arrays){
					
						if(array[0].equals(point1) && array[array.length-1].equals(point2)){
							isLinked = true;
							return array;
						
						}
						else if(array[0] == point2 && array[array.length - 1]==point1){
							isLinked = true;
							return array.reverse();
						}
				}
			}
			if(isLinked ==false){
				alert("There is no array of points between the two entered points");
			}
		}
		this.complementary = function(point){
			switch(point){
				case 0: return 1;
				case 1: return 0;
				case 2: return 3;
				case 3: return 2;
			}
		}
		
		this.findComplementaryArray = function(array){
			for(x=0;x<4;x++){
				if(this.minorPoints[x] == array){
					return this.minorPoints[this.complementary(x)]	
				}
				else if(this.minorPoints[x].reverse() == array){
					return this.minorPoints[this.complementary(x)].reverse();
				}
			}
		}
}

var smallestOf = function(first, second){
	if(first<=second){
		return first;
		
	}else{
		return second;
	}
}


function Triangle(grid, linkedPoint1,linkedPoint2, definerPoint){
	this.mainPoints = [grid.mainPoints[linkedPoint1], grid.mainPoints[linkedPoint2], definerPoint];
	this.mainLines = [new Line(this.mainPoints[0],this.mainPoints[1],0,0,0,0,true),new Line(this.mainPoints[1],this.mainPoints[2],0,0,0,0,true),new Line(this.mainPoints[2],this.mainPoints[0],0,0,0,0,true)]
	
	
	for(var x = 0; x<3; x++){
		this.mainLines[x].draw();
	}
	//function may be working, function used do not work
	this.badassLines= function(grid){
		var borderPoints = grid.findArray(this.mainPoints[0],this.mainPoints[1]);
		this.lines;
		for(var z = 0; z< borderPoints.length; z++){
			this.lines.add(new Line(borderPoints[z], this.mainPoints[2],0,0,0,0,true));
			this.lines[z].draw();
		}
	}
}//left to do on triangles: append them completely to surface, apend them with the same angle, without outside borders, and make plane constructor class

function TriangleExtentionPoint(x,z,shape){
	var planePoint1 = shape.mainPoints[0];
	var planePoint2 = shape.mainPoints[1];
	var planePoint3 = shape.mainPoints[2];
	//in equation ax + bz +cy + d = 0
	var a = (planePoint2.z - planePoint1.z)*(planePoint3.y-planePoint1.y)-(planePoint3.z-planePoint1.z)*(planePoint2.y-planePoint1.y);
	var b = (planePoint2.y - planePoint1.y)*(planePoint3.x-planePoint1.x)-(planePoint3.y-planePoint1.y)*(planePoint2.x-planePoint1.x);
	var c = (planePoint2.x-planePoint1.x)*(planePoint3.z-planePoint1.z)-(planePoint3.x - planePoint1.x)*(planePoint2.z-planePoint1.z);
	var d = -(a*planePoint1.x + b*planePoint1.z + c*planePoint1.y);
	var Y = -(a*x + b*z+d)/c;
	
	return new Point(x,Y,z);
}

function Cube(point1, distance, lines){
	var pointA = new Point(point1.x-distance,point1.y, point1.z);
	var pointB = new Point(point1.x,point1.y+distance, point1.z);
	var pointC = new Point(point1.x,point1.y, point1.z+distance);
	var pointD = new Point(point1.x-distance,point1.y + distance, point1.z);
	var pointE = new Point(point1.x-distance,point1.y, point1.z+distance);
	var pointF = new Point(point1.x,point1.y + distance, point1.z+distance);
	var pointG = new Point(point1.x-distance,point1.y + distance, point1.z+distance);
	
	
	this.grids = [new Grid(pointA,point1, pointB, lines,lines),
					new Grid(point1, pointC, pointF, lines, lines),
					new Grid(pointC, point1, pointA, lines, lines),
					new Grid(pointC, pointE, pointG, lines, lines),
					new Grid(pointA,pointD, pointG,lines,lines),
					new Grid(pointF, pointG,pointD, lines, lines)]	
						
}
function Vector(x,y,z){
	this.x = x;
	this.y = y;
	this.z = z;
	this.drawFromOrigin = function(){
		(new Line(0,100,0,x,y+100,z, false)).draw();
	}
	this.norm = function(){
		return Math.sqrt(this.x^2+this.y^2+this.z^2);
	}
	
}
var produitVectoriel = function(vector1,vector2){
	return new Vector(vector1.y*vector2.z-vector1.z*vector2.y,   vector1.z*vector2.x-vector1.x*vector2.z,   vector1.x*vector2.y-vector1.y*vector2.x);
}
var produitVecteur = function(vector, coefficient){
	return new Vector(vector.x*coefficient,vector.y*coefficient,vector.z*coefficient)
}
window.addEventListener( 'keydown', doKeyDown, false);
var height = 700;
var width = 700;
var depth = 2000;

function doKeyDown(e) {
switch(e.keyCode){
    case 38: height -= 200;
    break;
    
    case 40: height += 200;
    break;
    case 37: width-= 200;
    break;
    case 39: width += 200;
    break;
    case 87: depth += 200;
    break;
    
    case 83: depth -= 200;
    
    
}


new Cube(new Point(width,height,depth),200,3);
}
 drawing.fillStyle= "#5bd75b";
    drawing.fillRect(0,0,canvas.clientWidth,canvas.clientHeight); 
//base.background();
//new Cube(new Point(width,height,depth),500,3);





//new Cube(new Point(width,height,depth),500,3);




/*
var point1 = new Point(0, 0,0);
var point2 = new Point(100,0,0);
var point3 = new Point(100,-100,0);
var point4 = new Point(0, -100,0);
var point5 = new Point(0,0,100);
var point6 = new Point(100,-25, 200);



 drawing.fillStyle= "#5bd75b";
    drawing.fillRect(0,0,canvas.clientWidth,canvas.clientHeight); 
var grid1 = new Grid(point1,point2,point3,4,4);
grid1 = null;
 drawing.fillStyle= "#5bd75b";
    drawing.fillRect(0,0,canvas.clientWidth,canvas.clientHeight); 
// var grid2 = new Grid(point1, point2, point4, 4, 5);   
    
    
//var grid2 = new Grid(point1, point3, point4,4,4);
/*
//comment

var grid3 = new Grid(point1,point6, point5, 4, 4);
var trianglePoint = new Point(0,0,-5);
var alignedPoint = TriangleExtentionPoint(trianglePoint.x,trianglePoint.z,grid1);
var triangle = new Triangle(grid1,0,1,trianglePoint);
triangle.badassLines(grid1);
var randomLine = new Line(500,500,500,-300,200,100, false);
randomLine.draw();
var trianglePoint = new Point(-350,200,1000);
var triangle = new Triangle(grid1,1,3,trianglePoint);
*/



//event function

