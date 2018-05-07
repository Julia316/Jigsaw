window.onload=function(){
	
	var oMask=null;
	var oWrapIn=document.getElementById('wrapIn');
	var oUl=document.getElementById('ul1');
	var aLi=0;
	var num=9;
	var nun=0;
	var controlTime=0;
	var html='';
	var oTime=0;
	var oSecond=document.getElementById('second');;
	var aTip=document.getElementById("tipBox").getElementsByTagName("span");
	var oRefresh=aTip[2].getElementsByTagName("img")[0];

	var iZindex=2;
	var arr=[];
	var count=0;
	
	var oBtnS=null;
	var onOff=true;
	var onOff2=false;
	var controlOnOff=true;
	var refreshOnOff=true;
	var timer=null;
	
	controlDrag();//控制器
	
				
	//初始化    
	function init(){
		if(oMask!=null){
			oWrapIn.removeChild(oMask);	
		}			
		oMask=document.createElement('div');
		oMask.className="mask";        
		oMask.style.display="block";
		oMask.innerHTML="<div class='Start'><div class='tcBtn'><img id='btnS' src='img/btnS.png'/></div></div>";
		oMask.style.width=oUl.offsetWidth+"px";
		oMask.style.height=oUl.offsetHeight+"px";	
		oWrapIn.appendChild(oMask);	
		start();
	}
	//创建Li	
	function createLi(){       
		html='';
		if(num==9){
			oUl.style.width="606px";
			oUl.style.height="606px";
		}else if(num==16){
			oUl.style.width="608px";
			oUl.style.height="608px";
		}else if(num==25){
			oUl.style.width="610px";
			oUl.style.height="610px";
		}
		
		for(var i=0;i<num;i++){
			html+="<li></li>";
		}
		oUl.innerHTML=html;
		aLi=oUl.getElementsByTagName('li');
		var w=oUl.offsetWidth-Math.sqrt(num)*2;		
		for(var i=0;i<aLi.length;i++){
			aLi[i].style.width=w/Math.sqrt(num)+"px";
			aLi[i].style.height=w/Math.sqrt(num)+"px";
			aLi[i].style.backgroundImage="url(img/pass"+nun+".jpg)";
			aLi[i].style.backgroundPositionX=-aLi[i].offsetLeft+'px';
			aLi[i].style.backgroundPositionY=-aLi[i].offsetTop+'px';
			aLi[i].style.backgroundRepeat="no-repeat";
		}
		init();
	}
	//布局转换
	function start(){
		arr=[];
		for(var i=0;i<aLi.length;i++){ 
			arr.push([aLi[i].offsetTop,aLi[i].offsetLeft]);
		}
		for(var i=0;i<aLi.length;i++){
			aLi[i].style.position="absolute";
			aLi[i].style.top=arr[i][0]+"px";
			aLi[i].style.left=arr[i][1]+"px";		
		}			
		
		for(var i=0;i<aLi.length;i++){
	        aLi[i].index=i;
			aLi[i].OIndex=i;
			drag(aLi[i]);			    
		}
		startBtn();
	}			
	/*点击开始按钮*/
    function startBtn(){
		oBtnS=document.getElementById('btnS');
		oBtnS.onclick=function(){ 
			oMask.style.display="none";
			controlOnOff=false;
			refreshOnOff=false;
			oRefresh.style.cursor="not-allowed";
			var randomArr=[];
			for(var i=0;i<num;i++){
				randomArr.push(i);
			}
			randomArr.sort(function(n1,n2){
				return Math.random()-0.5;
			});	
			randomArr.sort(function(n1,n2){
				return Math.random()-0.5;
			});			
			for(var i=0;i<aLi.length;i++){
				startMove(aLi[i],{"top":arr[randomArr[i]][0],"left":arr[randomArr[i]][1]});
				aLi[i].index=randomArr[i];
			}
			testTime(); //开始计时
		}	     	
    }	 	 	
	/*拖拽函数*/
	function drag(obj){
		var disX=0;
		var disY=0;
		obj.onmousedown=function(ev){
			if(onOff){
				obj.style.zIndex=iZindex++;
				var ev=ev||event;
				disX=ev.clientX-obj.offsetLeft;
				disY=ev.clientY-obj.offsetTop;
				document.onmousemove=function(ev){				
					var ev=ev||event;
					obj.style.left=ev.clientX-disX+"px";
					obj.style.top=ev.clientY-disY+"px";
					
					for(var i=0;i<aLi.length;i++){
						aLi[i].className="";
					}
					var nL=closestLi(obj);
					if(nL){
						obj.className="focus";
	                    nL.className="focus";
					}			
					
				}
				document.onmouseup=function(){
					document.onmousemove=document.onmouseup=null;
					var nL=closestLi(obj);
					if(nL){				
						var temp=0;
						startMove(obj,{"top":arr[nL.index][0],"left":arr[nL.index][1]});
						startMove(nL,{"top":arr[obj.index][0],"left":arr[obj.index][1]});
						obj.className="";
	                    nL.className="";
						temp=obj.index;
						obj.index=nL.index;
						nL.index=temp;					
					}else{
						startMove(obj,{"top":arr[obj.index][0],"left":arr[obj.index][1]});
					};
					
	                testSuc();
	
				};
				return false;
			}else{
				return false;
			};
		};
	}
    /*碰撞检测*/
    function collide(obj1,obj2){
		var L1=obj1.offsetLeft;
		var R1=obj1.offsetLeft+obj1.offsetWidth;
		var T1=obj1.offsetTop;
		var B1=obj1.offsetTop+obj1.offsetHeight;
		var L2=obj2.offsetLeft;
		var R2=obj2.offsetLeft+obj2.offsetWidth;
		var T2=obj2.offsetTop;
		var B2=obj2.offsetTop+obj2.offsetHeight;	
		
		if(L1>R2||R1<L2||T1>B2||B1<T2){
			return false;
		}else{
			return true;
		}
	}
    /*测定距离*/
	function distance(obj1,obj2){
		var a=obj1.offsetLeft-obj2.offsetLeft;
		var b=obj1.offsetTop-obj2.offsetTop;
		return Math.sqrt(Math.pow(a,2)+Math.pow(b,2));
	}
    /*寻找最近的Li*/
	function closestLi(obj){
		var value=9999;
		var index=-1;
		for(var i=0;i<aLi.length;i++){
			if(collide(obj,aLi[i])&&obj!=aLi[i]){
				var c=distance(obj,aLi[i]);
				if(c<value){
					value=c;
					index=i;
				}
			}			
		}
		if(index!=-1){
			return aLi[index];
		}else{
			return false;
		}
	}
    /*判断拼图是否完成*/
    function testSuc(){
    	count=0;
		for(var t=0;t<aLi.length;t++){			
		    if(aLi[t].index==aLi[t].OIndex){
				count++;
			}
		}
		if(count==aLi.length){
			oUl.style.boxShadow=" 0 0 18px rgba(251,234,173,1), inset 0 0 18px rgba(251,234,173,1), 0 0 0 #000";
			oUl.style.opacity=0.8;
			onOff=false;
			clearInterval(timer); //关闭计时
			setTimeout(function(){
				oMask.style.zIndex=9999;
	            oMask.style.display="block";        
	            oMask.innerHTML="<div class='Success'><div class='Tip'></div><div class='tcBtn2'><img id='btnS' src='img/btnA.png'/></div></div>";
	            oUl.style.opacity=1;
	            oUl.style.boxShadow="";
                onOff=true;	 
                controlOnOff=true;
                refreshOnOff=true;
                oRefresh.style.cursor="pointer";
                start();
                startBtn();
			},1800);
			
		}
		console.log("正确的个数："+count);   
    }
    /*判断时间是否已经结束*/
    function testTime(){
    	oTime=controlTime;
    	console.log(controlTime);
    	var oTimeOld=oTime;    	
    	oSecond.style.color="#7d7454";
    	var oBar=document.getElementById('bar');
    	oBar.style.background="#90c800";
    	oBar.style.left=0;
    	var ratio=oBar.offsetWidth/oTime;
    	oSecond.innerHTML=oTime+"s";
    	
    	
    	timer=setInterval(function(){
    		oTime--; 
    		oSecond.innerHTML=oTime+"s";
    		startMove(oBar,{"left":Math.floor((oTime-oTimeOld)*ratio)});
    		if(oTime<=5){
    			oBar.style.background="red";
    		}
    		if(oTime==0){
    			clearInterval(timer);
    			oSecond.style.color="red";
    			oSecond.innerHTML=oTime+"s";
    			onOff=false;
				setTimeout(function(){
					oMask.style.zIndex=9999;
		            oMask.style.display="block";        
		            oMask.innerHTML="<div class='fail'><div class='Tip2'></div><div class='tcBtn2'><img id='btnS' src='img/btnA.png'/></div></div>";
	                onOff=true;	
	                controlOnOff=true;
	                refreshOnOff=true;
	                oRefresh.style.cursor="pointer";
	                start();
	                startBtn();
				},1000);    			
    	    };
    	},1000);
    	
    }
   
    /*控制器*/ 
    function controlDrag(){   	
    	var oLH=document.getElementById("LH");
    	var HandleL=oLH.getElementsByTagName('img')[0];
    	var oRH=document.getElementById("RH");
    	var HandleR=oRH.getElementsByTagName('img')[0];

    	var maxWidthL=oLH.offsetWidth-HandleL.offsetWidth;
    	var maxWidthR=oRH.offsetWidth-HandleR.offsetWidth;
    	
    	controlTime=30;
    	
    	handle(HandleL,maxWidthL);
    	handle(HandleR,maxWidthR);
    	function handle(obj,max){	    		
	    	obj.onmousedown=function(ev){
	    		if(controlOnOff){
	    		var ev=ev||event;
	    		var disX=ev.clientX-obj.offsetLeft;
	    		document.onmousemove=function(ev){
	    			var ev=ev||event;
	    			var L=ev.clientX-disX;
	    			if(L<0){
	    				L=0;
	    			}else if(L>max){
	    				L=max;
	    			}
	    			if(obj==HandleR){
		    			if(L<max/4){
		    				L=0;
		    				num=9;	    				
		    			}else if(L>=max/4 &&L<(max/4*3)){
		    				L=max/2;
		    				num=16;
		    			}else if(L>(max/4*3)){
		    				L=max;
		    				num=25;
		    			};
		    			aTip[1].innerHTML="难度："+ Math.sqrt(num)+"x"+Math.sqrt(num);
	    			}else{
	    			    controlTime=parseInt((1-L/max)*270+30);
	    			    aTip[0].innerHTML="时间："+ controlTime+"s"; 
	    			    oSecond.innerHTML=controlTime+"s";
	    			}
	    			obj.style.left=L+"px";
	    			
	    		};
				document.onmouseup=function(){
					document.onmousemove=document.onmouseup=null;
					onOff2=true;					
					sele();//选择图片
					createLi();//创建Li
                    for(var i=0;i<aLi.length;i++){
                    	aLi[i].style.margin=0;
                    }
				};
				return false;
				}
	    	}
    	}   
    	if(onOff2==false){	
            sele();//选择图片
            createLi();//创建Li
		}    	
    }
    /*换图*/
    function sele(){
	    oRefresh.onclick=function(){ 
	    	if(refreshOnOff){
			    nun=Math.round(Math.random()*3);
			    for(var i=0;i<aLi.length;i++){
			    	aLi[i].style.backgroundImage="url(img/pass"+nun+".jpg)";
			    }	    		
	    	}

    	}
  	
    }
}