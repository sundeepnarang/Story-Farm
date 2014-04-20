var num =0;
var object = {};
var socket = io.connect();
var down = false,
	leftAxis = [],
	leftAngle = [],
	rightAxis = [],
	rightAngle = [],
	dLAx = [],
	dLAn = [],
	dRAx = [],
	dRAn = [];

// socket.on("point",function(data){
	

// 	if(data[1]<50){
// 		var dispatchMouseEvent = function(target, var_args) {
// 		  var e = document.createEvent("MouseEvents");
// 		  // If you need clientX, clientY, etc., you can call
// 		  // initMouseEvent instead of initEvent
// 		  e.initEvent.apply(e, Array.prototype.slice.call(arguments, 1));
// 		  target.dispatchEvent(e);
// 		};
// 		dispatchMouseEvent($('.bottombar .icon')[0], 'mousedown', true, true);
// 	}
// 	console.log("point - ",data);
// });
// socket.on("leap",function(data,gesture,p){

// 	data = data.split(" ");
// 	for(i = 0;i<data.length;i++){
// 		data[i] = parseFloat(data[i]);

// 	}
// 	if(leftAxis){
// 		dLAx = leftAxis;
// 		dLAn = leftAngle;
// 		dRAx = rightAxis;
// 		dRAn = rightAngle;
// 	}
// 	leftAxis = data.splice(0,3);
// 	leftAngle = data.splice(0,3);
// 	rightAxis = data.splice(0,3);
// 	rightAngle = data;

// 	for(i=0;i<3;i++){
// 		dLAx[i] -= leftAxis[i];
// 		dLAn[i] -= leftAngle[i];
// 		dRAx[i] -= rightAxis[i];
// 		dRAn[i] -= rightAngle[i];
// 	}
// 	console.log(p)
// 	//console.log("leap - ",dLAx,dLAn,dRAx,dRAn,frame);
// 	if(gesture){
// 		if(gesture.length){
// 			console.log(gesture)
// 			console.log(gesture[0].type);
// 			if(gesture[0].type == "keyTap"){
// 				console.log("cool");
// 			}
// 		}
// 	}
// 	if(p.length == 3){
// 		$(".pointer").show();
// 		if(((data[2]+150)*3<=$(".canvass").height()-10)&&((data[2]+150)*3>0)){
// 			$(".pointer").css("top",((data[2]+150)*3)+'px');
// 			if ((data[2]+150)*3 >  ($(window).height()-120)) {
// 	    	//console.log("here - ",mouseY,down)
// 	        $('.bottombar').show(); // slide pagination up
// 	   		} else {
// 	    		if(!down){
// 	            	$('.bottombar').hide();
// 	        	} // slide pagination down
// 	    	}
// 	    }
// 		if(((data[0]+250)*4<=$(".canvass").width()-10)&&((data[0]+250)*4>0)){
// 			$(".pointer").css("left",((data[0]+250)*4)+'px')
// 			if ((data[0]+250)*4 >  ($(window).width()-100)) {
// 		        $('.rightbar').show(); // slide pagination up
// 		    } else {
// 		        $('.rightbar').hide(); // slide pagination down
// 		    }
// 		}
		
// 	}

// })
socket.on("register",function(objects,texture,number){
	console.log("register - ",arguments)
	object = objects;
	console.log("object-",object)

	if(texture!="default"){
		$('.canvass').css('background','white');
		$('.canvass').css('background-image','url('+texture+')');
		$('.canvass').css('background-repeat','repeat');
		$('.canvass').css('background-size','Cover');
	}
		num = number;
	for(i in object){
		console.log("here",i,object[i]);
		imgsrc = object[i].name.substring(0, object[i].name.length - 1);
		 $('.canvass').append('<div id ="'+object[i].name+'" class="object" style="left:'+object[i].pos.left+';top:'+object[i].pos.top+';width:'+object[i].dimensions.width+';height:'+object[i].dimensions.height+'"><img src="img/'+imgsrc+'.png"></div>');
        $('#'+object[i].name).draggable({
        	containment : ".canvass",
        	stop: function(){
        		socket.emit("updatePos",$(this).attr('id'),{left:$(this).css("left"),top:$(this).css("top")});
        	}
        });
        $('#'+object[i].name).resizable({
  			aspectRatio: true,
  			stop:function(){
        		socket.emit("updateDim",$(this).attr('id'),{width:$(this).css("width"),height:$(this).css("height")});
        	}
		});
  		//$('#object'+num).freetrans('controls', true);
		$('#'+object[i].name).dblclick(function(){
			console.log("remove - ",$(this).attr('id'))
      		socket.emit("remove",$(this).attr('id'));
      		delete object[$(this).attr('id')]
  			$(this).slideUp();
  			$(this).remove();
		});
	}
})
$(document).mousedown(function() {
    down = true;
}).mouseup(function() {
    down = false;  
    if($('bottombar').is(":hidden")){
    	$('.bottombar').hide();
    }
});

$(document).ready(function(){
	$('.bottombar').css("top",($(window).height()-128))
	$('.bottombar').css("width",($('.canvass').width()))
	$('.rightbar').css("left",($(window).width()-128))
	$('.rightbar').css("height",($('.canvass').height()))
	for(var i = 0;i<55;i++){
		$('.bottombar').append('<div id="img/LYR'+(i+1)+'.png" class="icon" style="left:'+(100*i+5)+'px;" ><img src="img/LYR'+(i+1)+'.png"></div>')
	}
	for(var i = 0;i<10;i++){
		$('.rightbar').append('<div id="textures/TEX'+(i+1)+'.jpg" class="icon" style="top:'+(100*i+5)+'px;background-image:url(\'textures/TEX'+(i+1)+'.jpg\');background-repeat:repeat;background-size:Cover;"></div>')
	}
	createCanvass()
	//$('.rightbar').css("top",($('.canvass').top()))
});

$(window).resize(function(){
	$('.bottombar').css("top",($(window).height()-128))
	$('.bottombar').css("width",($('.canvass').width()))
	$('.rightbar').css("left",($(window).width()-128))
	$('.rightbar').css("height",($('.canvass').height()))
	
//rightbar').css("top",($('.canvass').top()))
});


$(window).mousemove(function(e) {

    var mouseY = e.pageY - $(window).scrollTop(); // mouse y coordinate relative to window
    var mouseX = e.pageX - $(window).scrollLeft();
    if ((mouseY >  ($(window).height()-120))&&(!$('.rightbar').is(':visible')) ){
    	//console.log("here - ",mouseY,down)
        $('.bottombar').show(); // slide pagination up
    } else {
    	if(!down){
            $('.bottombar').hide();
        } // slide pagination down
    }
    //console.log(mouseX,$(window).width()-80)
    if ((mouseX >  ($(window).width()-100)) &&(!$('.bottombar').is(':visible'))){
        $('.rightbar').show(); // slide pagination up
    } else {
        $('.rightbar').hide(); // slide pagination down
    }

});

function createCanvass(){
	$(".bottombar .icon").draggable({
		 opacity: 0.7, 
      helper: function(event){
        return $( this ).find("img").clone().appendTo('body').css('max-height','90px');
      }, 
      drag: function(event, ui){
        $(this).css('color', 'red');
      },
      stop: function(){
        $(this).css('color', 'white');
      }
	});  
	  $(".canvass").droppable({
	    accept : ".icon",
	    drop: function( event, ui){
	    	console.log(ui.draggable.attr('id').split('/')[1].split('.')[0],num);
	    	temp = ui.draggable.attr('id').split('/')[1].split('.')[0]
	    	pos = ui.helper.offset();
	    	//console.log(event.clientX,event.clientY,ui.helper.offset());
	        $('.canvass').append('<div id ="'+temp+num+'" class="object" style="left:'+pos.left+'px;top:'+pos.top+'px;width:100px;height:100px;"><img src="'+ui.draggable.attr("id")+'"></div>');
	        $('#'+temp+num).draggable({
	        	containment : ".canvass",
	        	stop: function(){
	        		socket.emit("updatePos",$(this).attr('id'),{left:$(this).css("left"),top:$(this).css("top")});
	        	}
	        });
	        $('#'+temp+num).resizable({
      			aspectRatio: true,
      			stop:function(){
	        		socket.emit("updateDim",$(this).attr('id'),{width:$(this).css("width"),height:$(this).css("height")});
	        	}
    		});
	  		//$('#object'+num).freetrans('controls', true);
    		$('#'+temp+num).dblclick(function(){
      			
      			console.log("remove - ",$(this).attr('id'))
      			socket.emit("remove",$(this).attr('id'));
      			delete object[$(this).attr('id')]
      			$(this).slideUp();
      			$(this).remove();
    		});
    		object[temp] = {name : temp+num}
    		object[temp].pos = {left : pos.left,top:pos.top}
    		object[temp].dimensions = {width: $('#'+temp+num).css("width"), height: $('#'+temp+num).css("height")}
	        socket.emit("createObject",object[temp],num);
	        num = num+1;
	    }
  	});

	$(".rightbar .icon").click(function(){
		$('.canvass').css('background','white');
		$('.canvass').css('background-image','url('+$(this).attr('id')+')');
		$('.canvass').css('background-repeat','repeat');
		$('.canvass').css('background-size','Cover');
		socket.emit("changeTexture",$(this).attr('id'));
	});

}