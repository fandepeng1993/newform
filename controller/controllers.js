/**
 * Created by Administrator on 2017/6/19.
 */
angular.module('controller',['ngSanitize','mgcrea.ngStrap','gridster'])
    .controller('controllers',function($scope,CommonDataService,$popover){
    	//当前页面所属菜单的menuCode
        var menuCode;
    	//根据权限渲染页面
    	$(document).ready(function(){
    		menuCode = Request["menuCode"];
    		$.ajax({
    		      url: "../../sessionAdmin/getPri",
    		      datatype: "json",
    		      type: "get",
    		      data: {},
    		      success: function (data, status, xhr) {
    		    	  var pathname = window.location.pathname;
    		    	  var url = pathname.substring(pathname.indexOf("/", 1) + 1, pathname.length);
    		    	  $.each(eval("(" + data + ")"), function(index, item) {
    		      			if(item.menuUrl == url) {
    		      				if(item.menuName == "查看") {
    		      					//初始化
    		      					getMenuByPid(1,1);
    		      				} else if(item.menuName == "增加") {
    		      					//$("#add-g").show();
    		      				} else if(item.menuName == "修改") {
    		      					//$("#update-g").show();
    		      				} else if(item.menuName == "删除") {
    		      					//$("#delete-g").show();
    		      				}
    		      			}
    		    	  });
    		      } 
    		});
    		
    		/**
		    *	获取menu菜单数组，grade为级别；1--主菜单；2--子菜单
		    */
			function getMenuByPid(id,grade) {
				$.ajax({
				      url: "../../menuAdmin/getMenuByPid/" + id,
				      datatype: "json",
				      type: "get",
				      data: {},
				      success: function (data, status, xhr) {
				    	  var str = "";
				    	  if(grade == 1) {
				    		  //填充主菜单的下拉菜单
				    		  $.each(eval("(" + data + ")"), function(index, item) {
				    			  str = str + "<option value='" + item.menuId + "'>" + item.menuName + "</option>";
					      	  });
				    		  $("#mainMenus").empty();
				    		  $("#mainMenus").append(str);
				    		  fillSubMenus();
				    	  } else {
							  //填充子菜单的下拉菜单
				    		  $.each(eval("(" + data + ")"), function(index, item) {
				    			  str = str + "<option value='" + item.menuId + "' menuCode='" + item.menuCode + "'>" + item.menuName + "</option>";
					      	  });
				    		  $("#subMenus").empty();
				    		  $("#subMenus").append(str);
				    		  fillCurMenuCode();
				    	  }
				      } 
				});
			}
		    
		    var fillSubMenus = function() {
		    	var menuPId = $("#mainMenus").val();
		    	getMenuByPid(menuPId,2);
		    }
		    
		    var fillCurMenuCode = function() {
		    	var curMenuCode = $("#subMenus option:checked").attr("menuCode");
		    	$scope.curMenuCode = curMenuCode;
		    	fillTable(curMenuCode);
		    }
			
			var forms = null;
			/**
			 * 填充已保存的表单元素
			 */
			function fillTable(menuCode) {
				$.ajax({
					url: "../../formAdmin/formsByMenuCode/" + menuCode,
					datatype: "json",
					type: "get",
					data: {},
					success: function (data, status, xhr) {
						var tableElements = eval("(" + data + ")");
						
						var maxColNum = 3;
						var maxRowNum = 4;
						//获取最大列数
						$.each(tableElements, function (index, item) {
							item.icon = "";
							item.minSizeX = 1;
							item.minSizeY = 1;
							item.sizeX = 1;
							item.sizeY = 1;
							item.row = item.elementIndex-1;
							item.col = 0;
							if(item.options != "") {
								item.options = angular.fromJson(item.options);
							}
							if((item.col + item.sizeX) > maxColNum) {
								maxColNum = item.col + item.sizeX;
							}
							if((item.row + item.sizeY) > maxRowNum) {
								maxRowNum = item.row + item.sizeY;
							}
						});
						
						console.log(maxRowNum, maxColNum);
						initTableData = getInitTableData(maxRowNum, maxColNum);
				        initVariables();
				        $scope.standardItems = tableElements;
				        
				        $scope.$apply();
					} 
				});
			}
			
			$("#mainMenus").change(function() {
				fillSubMenus();
			});
			
			$("#subMenus").change(function() {
				fillCurMenuCode();
			});
			
		    /*管理员-角色-添加*/
			function admin_role_add(title,url,w){
				new UserCommon().layer_show(title,url,w);
			}
    	});
    	
		/**
		 * 之上为获取权限及菜单代码切换部分，以下为自动化表单部分。
		 */
    	
        //data-mcs- data-mcs-axis="x"
        var timer=new Date().getTime();
        var ul_li = $(".form_title_ul li");
        $(".form_title_ul li").click(function(){
            $(this).addClass("active").siblings().removeClass("active");
        });
        $scope.showPop = function(){
            $(".form_fix_bg").show();
            $(".form_pop").animate({right:"0px"});
        };
        $scope.hidePop = function(){
            $(".form_pop").animate({right:"-500px"});
            $(".form_fix_bg").hide();
        };
        $scope.showRight = function(){
            $(".form_content_r_content_p").show();
            $(".form_content_r_content_c").hide();
        };

        //初始化table为rowNum行，colNum列
        var getInitTableData = function (rowNum, colNum) {
        	var row = {"cols":new Array(colNum)};
        	var rows = new Array();
        	for(var i=0; i<rowNum; i++) {
        		rows.push(row);
        	}
        	var initTableData = {
        			  "rows": rows,
        			  "paixu": new Array(colNum)
        			};
        	return initTableData;
        }
        
        var initTableData = getInitTableData(4, 3);
        
		var initVariables = function () {
			$scope.xrow=initTableData.rows;
			$scope.paixu=initTableData.paixu;
			$scope.widthes=650+'px';
			$scope.topes=53+'px';
			$scope.otherread=true;
			$scope.isInEdit=true;
			$scope.isView = false;
		}
		initVariables();
		
		//添加列
        $scope.form_editRow=function(a,inx,c){
               //console.log(inx);
               //从inx 0开始 A:65
               if(a<0&&$scope.paixu.length>3){
                   for(var i=$scope.standardItems.length-1;i>=0;i--){
                       if($scope.standardItems[i].col<=inx && inx < $scope.standardItems[i].col+$scope.standardItems[i].sizeX){
                           $scope.standardItems.splice(i,1);
                       }
                   }
                   $scope.paixu.splice(inx,c);
                   for(var i=0;i<$scope.xrow.length;i++){
                       ($scope.xrow)[i].cols.splice(inx,c);
                       if($scope.standardItems[i].col>inx){
                           $scope.standardItems[i].col--;
                       }

                   }
                   $scope.widthes=parseInt($scope.widthes)-201+'px';
                   $('#mCSB_1_container').css('width',$scope.widthes);
                   $('.form_table_in').mCustomScrollbar("scrollTo","right");
                   $scope.gridsterConfiguration.columns=$scope.paixu.length;
               }
               else if(a>0&&$scope.paixu.length<8) {
                   if(c<1){
                       for(var i=0;i<$scope.standardItems.length;i++){
                           $scope.standardItems[i].col+=1;
                       }
                   }
                   $scope.paixu.splice(inx+c,0,'clo-add');
                   for(var i=0;i<$scope.xrow.length;i++){
                       ($scope.xrow)[i].cols = new Array($scope.paixu.length);
                   }
                   $scope.widthes=parseInt($scope.widthes)+201+'px';
                   $('#mCSB_1_container').css('width',$scope.widthes);
                   $('.form_table_in').mCustomScrollbar("scrollTo","right");
                   $scope.gridsterConfiguration.columns=$scope.paixu.length;
               }
               else {
                   return;
               }
           };
           //向上或者下添加行数
           $scope.form_editColumn=function(a,inx,c){
               //console.log(inx);
               //inx 从0开始 0，1，2 ，3，4...
               if(a<0){
                   for(var i=$scope.standardItems.length-1;i>=0;i--){
                       //console.log($scope.standardItems[i].row,inx);
                       if($scope.standardItems[i].row<=inx && inx < $scope.standardItems[i].row+$scope.standardItems[i].sizeY){
                           $scope.standardItems.splice(i,1);
                       }
                   }
                   $scope.xrow.splice(inx,c);
                   for(var i=0;i<=$scope.standardItems.length-1;i++){
                       if($scope.standardItems[i].row>inx){
                           $scope.standardItems[i].row--;
                       }
                   }
               }else {
                   //console.log(inx);
                   if(c<1){
                       for(var j=0;j<$scope.standardItems.length;j++){
                           $scope.standardItems[j].row+=1;
                       }
                   }
                   var rowadd=new Array($scope.paixu.length);
                   $scope.xrow.splice(inx+c+1,0,{"cols":rowadd});

               }
           };
           //表单框点击函数
           $scope.moveIn=function(a,b){
               $scope.dataMata=a;
               $scope.indexPo=b;
               $scope.titlesdata= a.label;
               //$scope.$watch(dataMata,function(oldd,newd){
               //   console.log(newd);
               //});
               for(var i=0;i<$scope.standardItems.length;i++){
                  if(i!=b){
                      $scope.standardItems[i].isActive=false;
                  }else {
                      $scope.standardItems[b].isActive=true;
                  }
               }
           };
           //复制节点
           $scope.copyNode=function(e){
               var objs= {};
               for(var key in e) {
                   eval("objs." + key + "=e." + key);
               }
               //objs=Object.create(e);
               //objs.$$hashKey = null;
               objs.col = null;
               objs.row = null;
               objs.options=[{value:'选项1',text:'选项1'}];
               objs.selectedstate='';
               $scope.appendEle(objs);
               //$scope.standardItems.push(objs);

           };
           //$scope.deleteNode=function(){
           //    console.log(456)
           //};
           $scope.deleteIcon=function(b){
              $scope.standardItems.splice(b,1);
              $scope.dataMata='';
           };
           $scope.newRowNum={rows: 0};
           $scope.appendEle=function(e){
              var objs= {};
              for(var key in e) {
                  eval("objs." + key + "=e." + key);
              }
              //objs=Object.create(e);
              objs.menuCode = $scope.curMenuCode;
              objs.options=[{value:'请选择',text:'请选择'}];
              objs.selectedstate='';
              //var arraytemp=[];
              if($scope.standardItems.length<=0){
                $scope.standardItems.push(objs);
                //arraytemp.push(objs.row+objs.sizeY);
              }else {
                //objs.row=Math.max.apply(null,arraytemp);
                //objs.col=0;
                $scope.standardItems.push(objs);
                //arraytemp.push(objs.row+objs.sizeY);
              }
              setTimeout(function (){
                $("li[name='standardItems']").last().click();
                var expandRows = $scope.newRowNum.rows-$scope.xrow.length;
                var rowadd=new Array($scope.paixu.length);
                var inx=($scope.xrow.length-1)+expandRows;
                for(var i=0;i<expandRows;i++){
                  $scope.xrow.splice(inx,0,{"cols":rowadd});
                }
                $("li[name='standardItems']").last().click();
              },50);
           };

           $scope.elementstag = elementsJson;
           
           $scope.data={
                   approvalType:'reimburse'
           };
           $scope.gridsterConfiguration = {
               isMobile: false,
               columns:$scope.paixu.length,
               defaultSizeX: 1,
               defaultSizeY: 1,
               resizable: {
                   enabled: true
               },
               draggable: {
                   enabled: true,
                   handle: '.my-class'
               },
               margins: [1,3]
           };
           $scope.departMent ={
               states:["电商部","财务部","人事部","外贸部","内贸部","技术部"]
           };
           $scope.personName={
               states:["王鹏翔","李邓珂","于高峰","田丰","季忠宇","洪浩远"]
           };
           $scope.personDepart={
               states:["电商王鹏翔","电商李邓珂","电商于高峰","电商田丰","电商季忠宇","电商洪浩远"]
           };
           $scope.click=function(e){
               $(e.target).toggleClass('checked');
           };
           $scope.standardItems = [];
           $scope.isLoading=false;
           $scope.$watch('standardItems.length',function(newVale,oldValue,scope){
               //console.log($scope.isInEdit);
               if(newVale!=oldValue){
                   $scope.isInEdit=true;
                   //console.log($scope.isInEdit);
               }
           })

        //保存表单元素信息
        $scope.saveFormElements = function() {
          $scope.isInEdit=false;
          //$scope.isLoading=true;
          console.log($scope.standardItems);
        };
    })
    .directive('myDirective',function(){
        return {
            restrict : "AE",
            scope:{
                clickdata:'=',
                titledata:'=',
                typedata:'=',
                newrownum:'=',
                xrow:'=',
                paixu:'='
            },
            //compile和link一起，link不执行
            link:function(scope,element,attrs){
               scope.setclick=function(e){
                   $(e.target).toggleClass('checked');
                   if($(e.target).hasClass("checked")){
                      scope.clickdata.isEmpty=true
                   }else {
                       scope.clickdata.isEmpty=false
                   }
               };
                scope.addItem=function(a){
                    //console.log(scope.clickdata);
                    var inxs=(scope.xrow.length-1);
                    var rowadd=new Array(scope.paixu.length);
                    scope.clickdata.options.splice(a+1,0,{value:'选项',text:'选项'});
                    var heights=$('#element-'+scope.clickdata.row+'-'+scope.clickdata.col).height();

                    if(scope.clickdata.minSizeY*50<heights+20){
                        scope.clickdata.minSizeY++;
                    }
                    if(scope.newrownum.rows>=inxs-1){
                        scope.xrow.splice(1,0,{"cols":rowadd});
                    }
                    //console.log(scope.xrow.length);
                   //scope.$apply();
                };
                scope.arrayForceUpdate=function(a){
                    if(a.value==""){
                        a.value='选项'
                    }
                };
                scope.deleteItem=function(a){
                    var heights=$('#element-'+scope.clickdata.row+'-'+scope.clickdata.col).height();
                    if(scope.clickdata.minSizeY*50>heights+20){
                        scope.clickdata.minSizeY--;
                    }
                    scope.clickdata.options.splice(a,1);
                };
                scope.itemsChange=function(){
                    setTimeout(function(){
                        var heights=$('#element-'+scope.clickdata.row+'-'+scope.clickdata.col).height();
                        var expand=heights-50*scope.clickdata.minSizeY;
                        scope.clickdata.minSizeY=scope.clickdata.minSizeY+Math.ceil(expand/50);
                        scope.$apply();
                    },50);
                }
            },
            templateUrl:'../../form/template/form.Directive.html'
        }
    })
    .directive('myDirectivelist',function(){
        return{
            restrict:'AE',
            //require:'^myDirective',
            scope:true,
            link:function(scope,element,attrs){
                //console.log(scope);
            },
            templateUrl:'../../form/template/form.ListDirective.html'
        }
    })
    //预览表单
    .controller('modalctrl',function($scope){
            //console.log(123);
        $scope.isView = true;
        $scope.otherread=false;
        var str = angular.toJson($scope.standardItems);
        $scope.sercoundItems=angular.fromJson(str);
        $scope.gridsterOpts = {
            isMobile: false,
            columns:$scope.paixu.length,
            defaultSizeX: 1,
            defaultSizeY: 1,
            resizable: {
                enabled: false
            },
            draggable: {
                enabled: false,
                handle: '.my-class'
            },
            margin: [0,0]
        };

        $scope.hideModel = function() {
          $scope.isView = false;
        };

        //$scope.sercoundItems = [
        //    { sizeX: 2, sizeY: 1, row: 0, col: 0 },
        //    { sizeX: 2, sizeY: 2, row: 0, col: 2 }
        //];
        //    setTimeout(function(){
        //
        //    },1000);

    })
    //提交表单使用
    .controller('creatSubmitFormCtrl',function($scope){
            //console.log(123);
    	$scope.paixu = ["","",""];
    	var initData = function () {
    		//初始化展示表单所需的元素数据。
    		$scope.sercoundItems = angular.fromJson('[{"title":"文本输入框","icon":"icon-dingdan","sizeX":1,"sizeY":1,"row":3,"col":0,"element":"textarea","typeclass":"type-textarea","isActive":false,"isReadonly":false,"label":"","type_placeholder":"文本输入框","isEmpty":false,"Dplaceh":"","isLabelPortrait":"false","elementId":"textInput","isDisable":"false","isVisible":"false","isEditable":"true","event":null,"errorMsg":"wroung","menuCode":"textInput1","name":"textInput","defaultValue":"defaultValue","options":[{"value":"选项1","text":"选项1"}],"selectedstate":""},{"title":"文本输入框","icon":"icon-dingdan","sizeX":1,"sizeY":1,"row":3,"col":2,"element":"textarea","typeclass":"type-textarea","isActive":true,"isReadonly":false,"label":"","type_placeholder":"文本输入框","isEmpty":false,"Dplaceh":"","isLabelPortrait":"false","elementId":"textInput","isDisable":"false","isVisible":"false","isEditable":"true","event":null,"errorMsg":"wroung","menuCode":"textInput1","name":"textInput","defaultValue":"defaultValue","options":[{"value":"选项1","text":"选项1"}],"selectedstate":""},{"title":"文本输入框","icon":"icon-dingdan","sizeX":1,"sizeY":1,"row":5,"col":2,"element":"textarea","typeclass":"type-textarea","isActive":false,"isReadonly":false,"label":"","type_placeholder":"文本输入框","isEmpty":false,"Dplaceh":"","isLabelPortrait":"false","elementId":"textInput","isDisable":"false","isVisible":"false","isEditable":"true","event":null,"errorMsg":"wroung","menuCode":"textInput1","name":"textInput","defaultValue":"defaultValue","options":[{"value":"选项1","text":"选项1"}],"selectedstate":""},{"title":"时长","icon":"icon-jishiqi","minSizeY":3,"minSizeX":3,"row":0,"col":0,"element":"period","typeclass":"type-period","isActive":false,"isReadonly":false,"label":"","type_placeholder":"时长","isEmpty":true,"accuracy":"day","starttime":"2017-07-06T02:14:54.788Z","endtime":null,"starttimes":"开始时间","endtimes":"结束时间","timeDifference":0,"elementId":"period","isDisable":"false","isVisible":"false","isEditable":"true","event":null,"errorMsg":"wroung","menuCode":"textperiod1","name":"period","defaultValue":"defaultValue","options":[{"value":"选项1","text":"选项1"}],"selectedstate":"","sizeX":3,"sizeY":3},{"title":"日期时间","icon":"icon-riqishijian","minSizeX":2,"minSizeY":1,"row":5,"col":0,"element":"datetime","typeclass":"type-datetime","isActive":false,"isReadonly":false,"label":"","type_placeholder":"日期时间","isEmpty":false,"tempValue":"201","temptimeValue":"","tempdateValue":"","isLabelPortrait":"false","elementId":"datetime","isDisable":"false","isVisible":"false","isEditable":"true","event":null,"errorMsg":"wroung","menuCode":"textdatetime1","name":"datetime","defaultValue":"defaultValue","options":[{"value":"选项1","text":"选项1"}],"selectedstate":"","sizeX":2}]');
    	};
    	
    	//定义定时器的执行次数
    	var intervalNum = 0;
    	//定义定时器，用于检测表单元素是否取回，取回后触发构建表单函数。
    	var checkEleInterval = window.setInterval(function() {
    		intervalNum++;
    		if(typeof(element) != "undefined") {
    			initData();
        		setTimeout(function() {
        			//初始化层的大小
        			initLayerSize();
        		},50);
    			window.clearInterval(checkEleInterval);
    		}
    		if(intervalNum > 20) window.clearInterval(checkEleInterval);
    	},10);
    	
        $scope.isView = true;
        $scope.otherread=false;
        /*var str = angular.toJson($scope.standardItems);
        $scope.sercoundItems=angular.fromJson(str);*/
        $scope.sercoundItems = [];
        $scope.gridsterOpts = {
            isMobile: false,
            columns:$scope.paixu.length,
            defaultSizeX: 1,
            defaultSizeY: 1,
            resizable: {
                enabled: false
            },
            draggable: {
                enabled: false,
                handle: '.my-class'
            },
            margin: [0,0]
        };

        $scope.hideModel = function() {
          $scope.isView = false;
        };

        //$scope.sercoundItems = [
        //    { sizeX: 2, sizeY: 1, row: 0, col: 0 },
        //    { sizeX: 2, sizeY: 2, row: 0, col: 2 }
        //];
        //    setTimeout(function(){
        //
        //    },1000);

    });

