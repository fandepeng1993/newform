/**
 * Created by Administrator on 2017/6/19.
 */
angular.module('controller',['ngSanitize','mgcrea.ngStrap','gridster'])
    .controller('controllers',function($scope,CommonDataService,$popover,customFormService){
    	$scope.showTypeHidden = {isShow: true};
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
		    	var curSubMenuName = $("#subMenus option:checked").text();
		    	$scope.curMenuCode = curMenuCode;
		    	$scope.curSubMenuName = curSubMenuName;
		    	$scope.curMainMenuName = $("#mainMenus option:checked").text();
		    	$scope.dataMata = null;
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
						
						var constructObj = {
								maxColNum : 3,
								maxRowNum : 4
						}
						
						customFormService.initConstructObj(tableElements, constructObj);
						
						initTableData = getInitTableData(constructObj.maxRowNum, constructObj.maxColNum);
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
    	
    	/*$scope.initCheckBoxAndRadio = function() {
    		//填充radio和checkbox
			var radioArr = $("input[type='radio']");
			var checkboxArr = $("input[type='checkbox']");
			var valueMap = {};
			var checkboxMap = {};
			$.each(radioArr, function(index, item) {
				valueMap[$(item).attr("name")] = $("input[type='radio'][name='" + $(item).attr("name") + "']").val();
			});
			$.each(checkboxArr, function(index, item) {
				checkboxMap[$(item).attr("name")] = $("input[type='checkbox'][name='" + $(item).attr("name") + "']").val();
			});
			if(radioArr.length > 0) {
				radioArr.iCheck({
					radioClass: 'iradio_square-green',
					increaseArea: '20%'
				});
			}
			if(checkboxArr.length > 0) {
				checkboxArr.iCheck({
					checkboxClass: 'icheckbox_square-green',  //icheckbox_square-green/icheckbox_minimal-green/icheckbox_flat-green/icheckbox_polaris/icheckbox_futurico
					increaseArea: '20%'
				});
			}
			for(var key in valueMap) {
				if(key == "undefined") $("input[name='" + key + "'][value='" + valueMap[key] + "']").iCheck('check');
			}
			for(var key in checkboxMap) {
				if(key == "undefined") $("input[name='" + key + "'][value='" + valueMap[key] + "']").iCheck('check');
			}
    	};*/
    	
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
				/*var arrarys=new Array(3);
				arrarys.splice(1,1);
				
				console.log($scope.paixu,arrarys[3],arrarys);*/
				//$scope.widthes=650+'px';
				//$scope.topes=53+'px';
				$scope.otherread=true;
				$scope.isInEdit=true;
				$scope.isView = false;
				if(typeof($scope.gridsterConfiguration) != "undefined") {
					$scope.gridsterConfiguration.columns=$scope.paixu.length;
				}
			}
			initVariables();
		
			$scope.form_editColumn=function(a,inx,c){
                //console.log(inx);
                //从inx 0开始 A:65
				//删除列
                if(a<0&&$scope.paixu.length>3){
                    for(var i=$scope.standardItems.length-1;i>=0;i--){
                        if($scope.standardItems[i] && $scope.standardItems[i].col<=inx && inx < $scope.standardItems[i].col+$scope.standardItems[i].sizeX){
                            $scope.standardItems.splice(i,1);
                        }
                    }
                   
                    for(var k=0;k<=$scope.standardItems.length-1;k++){
                        if($scope.standardItems[k] && $scope.standardItems[k].col>inx){
                            $scope.standardItems[k].col--;
                        }
                    }
                    
                    $scope.paixu.splice(inx,c);
                   /* for(var z=0;z<lengthNUm;z++){
                        //if($scope.standardItems[])
                    		($scope.xrow)[z].cols.splice(inx,c);
                    	($scope.xrow)[z].cols = new Array($scope.paixu.length);
                    }*/

                    //$scope.widthes=parseInt($scope.widthes)-201+'px';
                    //$('#mCSB_1_container').css('width',$scope.widthes);
                    //$('.form_table_in').mCustomScrollbar("scrollTo","right");
                    $scope.gridsterConfiguration.columns=$scope.paixu.length;
                }
                else if(a>0 && $scope.paixu.length<8) {
                    if(c<1){
                        //向前添加列
                        for(var i=0;i<$scope.standardItems.length;i++){
                            if($scope.standardItems[i].col>inx-1){
                                $scope.standardItems[i].col++;
                            }
                        }
                    }
                    else if(c==1){
                       for(var j=0;j<$scope.standardItems.length;j++){
                           if($scope.standardItems[j].col>inx){
                               $scope.standardItems[j].col++;
                           }
                       }
                    }
                    $scope.paixu.splice(inx+c,0,'');
                    $scope.gridsterConfiguration.columns=$scope.paixu.length;
                }
                else {
                    return;
                }
                for(var i=0;i<$scope.xrow.length;i++){
                    ($scope.xrow)[i].cols = new Array($scope.paixu.length);	
                }
             
			};

			//向上或者下添加行数
			$scope.form_editRow=function(a,inx,c){
               //inx 从0开始 0，1，2 ，3，4...
               if(a<0){
                   for(var i=$scope.standardItems.length-1;i>=0;i--){
                       //删除行
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
                   //添加行
                   if(c<1){
                       //向上添加一行
//                       console.log(inx);
                       for(var j=0;j<$scope.standardItems.length;j++){
                           if($scope.standardItems[j].row>inx-1){
                               $scope.standardItems[j].row++;
                           }
                       }
                   }
                   else if(c==1){
                       //向下添加一行
                       for(var j=0;j<$scope.standardItems.length;j++){
                           if($scope.standardItems[j].row>inx){
                               $scope.standardItems[j].row++;
                           }
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
               setTimeout(function() {
            	   customFormService.initCheckBoxAndRadio();
        		   
        		   $("#showTypeHiddenInput").on('ifChecked', function() {
        			   $scope.showTypeHidden.isShow = true;
        			   $scope.$apply();
        		   });
        		   
        		   $("#showTypeHiddenInput").on('ifUnchecked', function() {
        			   $scope.showTypeHidden.isShow = false;
        			   $scope.$apply();
        		   });

        		   $("input[type='radio']").on('ifChecked', function() {
        			   var ngModelStr = $(this).attr("ng-model");
        			   if(typeof(ngModelStr) != "undefined" && ngModelStr.indexOf("clickdata") != -1) {
        				   var newStr = ngModelStr.replace(/clickdata/g, "$scope.dataMata");
//        				   console.log(newStr + " = " + $(this).val());
        				   eval(newStr + " = " + $(this).val());
        				   $scope.$apply();
        			   }
        		   });
        		   
        		   $("input[type='radio']").on('ifUnchecked', function() {
        		   });
               });
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
               margins: [1,1]
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
           });
           
        //保存表单元素信息
       	$scope.saveFormElements = function() {
    	   	$scope.isInEdit=false;
          	//$scope.isLoading=true;
    	   	//定义新的数组，实际是$scope.standardItems的深拷贝。
    	   	var copyStandardItems= [];
            for(var key in $scope.standardItems) {
            	//生成新的对象
            	var obj = {};
            	for(var objKey in $scope.standardItems[key]) {
            		obj[objKey] = $scope.standardItems[key][objKey];
            	}
            	copyStandardItems[key] = obj;
            }
          	//将部分属性转为可存储的json字符串类型。
          	$.each(copyStandardItems, function(index, item) {
          		if(typeof(item.options) == "object") {
					item.options = angular.toJson(item.options);
				}
          		if(typeof(item.event) == "object") {
					item.event = angular.toJson(item.event);
				}
          	});
          	//执行保存
          	$.ajax({
				url: "../../formAdmin/updateForms/" + $scope.curMenuCode,
				datatype: "text",
				type: "post",
				data: JSON.stringify(copyStandardItems),
				success: function (data) {
					var json = eval("(" + data + ")");
					if(json.status == 1) {
						new UserCommon().check("success",json.msg,null,"success");
					} else {
						new UserCommon().check("success",json.msg,null,"fail");
					}
				}
			});
        };
    })
    .directive('myDirective',function(customFormService){
        return {
            restrict : "AE",
            scope:{
                clickdata:'=',
                titledata:'=',
                typedata:'=',
                newrownum:'=',
                xrow:'=',
                paixu:'=',
                elementstag:'='
            },
            //compile和link一起，link不执行
            link:function(scope,element,attrs){
               scope.setclick=function(e){
                   $(e.target).toggleClass('checked');
                   if($(e.target).hasClass("checked")){
                      scope.clickdata.isEmpty=false;
                   }else {
                       scope.clickdata.isEmpty=true;
                   }
               };
               scope.addItem=function(a, fieldName){
            	   	//若不对options字段进行编辑
                   	if(typeof(fieldName) != "undefined") {
                   		if(eval("typeof(scope.clickdata." + fieldName + ") ")!= "object") {
                   			scope.clickdata[fieldName] = new Array();
                       	}
                   		scope.clickdata[fieldName].splice(a+1,0,{eventType:'',eventFun:''});
                   		return;
                   	}
            	   
                    //console.log(scope.clickdata);
                    var inxs=(scope.xrow.length-1);
                    var rowadd=new Array(scope.paixu.length);
                    
                    //若对options字段进行编辑
                    if(typeof(scope.clickdata.options) != "object") {
                    	scope.clickdata.options = new Array();
                    }
                    scope.clickdata.options.splice(a+1,0,{value:'选项',text:'选项'});
                    setTimeout(function() {
                    	var heights=$('#element-'+scope.clickdata.row+'-'+scope.clickdata.col).height();
                    	if(scope.clickdata.minSizeY*50<heights){
                    		scope.clickdata.minSizeY++;
                    	}
                    	if(scope.newrownum.rows>=inxs-1){
                    		scope.xrow.splice(1,0,{"cols":rowadd});
                    	}
                    	setTimeout(function(){
                    		customFormService.initCheckBoxAndRadio();
                    	});
                    	scope.$apply();
                    });
                };
                scope.arrayForceUpdate=function(a){
                    if(a.value==""){
                        a.value='选项'
                    }
                };
                scope.deleteItem=function(a, fieldName){
                	//若不对options字段进行编辑
                   	if(typeof(fieldName) != "undefined") {
                   		scope.clickdata[fieldName].splice(a,1);
                   		return;
                   	}
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
    .directive('repeatFinish',function(customFormService){
		return {
			scope: true, // 继承父级作用域并创建指令自己的作用域
	        // controller: function($scope, $element, $attrs, $transclude) {},
	        restrict: 'AE',
			link: function(scope,element,attr){
//				console.log("repeatFinish");
				if(typeof(scope.$index) == "undefined" || scope.$last == true){
					setTimeout(function() {
						customFormService.initCheckBoxAndRadio();
						$("#showTypeHiddenInput").on('ifChecked', function() {
							scope.showTypeHidden.isShow = true;
							scope.$apply();
						});
						
						$("#showTypeHiddenInput").on('ifUnchecked', function() {
							scope.showTypeHidden.isShow = false;
							scope.$apply();
						});
						
						//右侧radio
						/*if(typeof(scope.dataMata) != "undefined") {
							$("input[type='radio']").on('ifChecked', function() {
		        			   var ngModelStr = $(this).attr("ng-model");
		        			   if(typeof(ngModelStr) != "undefined" && ngModelStr.indexOf("clickdata") != -1) {
		        				   var newStr = ngModelStr.replace(/clickdata/g, "$scope.dataMata");
		        				   console.log(newStr + " = " + $(this).val());
		        				   eval(newStr + " = " + $(this).val());
		        				   $scope.$apply();
		        			   }
		        		   });
						}*/
					});
	        		   
				}
			}
		}
	})
    .directive('renderFinish',function(customFormService){
		return {
			scope: true, // 继承父级作用域并创建指令自己的作用域
	        // controller: function($scope, $element, $attrs, $transclude) {},
	        restrict: 'AE',
			link: function(scope,domElement,attr){
				if(scope.$last) {
					/*console.log('渲染执行完毕');*/
					setTimeout(function() {
						//初始化层的大小
						if(typeof(element) != "undefined") {
							//若是正常展示表单用于填写
							initLayerSize();
							//调用页面afterCreateCustomForm方法，触发之后的操作
							if(typeof(afterCreateCustomForm) != "undefined") afterCreateCustomForm();
							//根据event绑定相关事件
							$.each(element, function(index, item) {
								if(item.event != null && item.event != "") {
									var event = angular.fromJson(item.event);
									$.each(event, function(eventIndex, eventItem) {
										$("#" + item.elementId).bind(eventItem.eventType.substring(2), function() {
											eval(eventItem.eventFun);
										});
									});
								}
							});
							
							/*if(typeof(needFillFormId) != "undefined") {
							//若需要对表单进行填充
							setTimeout(function() {
								//填充表单
								new UserCommon().fillForm(needFillFormId, needFillFormData);
								//根据填充后的radio和checkbox的值，对radio和checkbox进行初始化
								customFormService.initCheckBoxAndRadio();
								//之后调用页面afterCreateCustomForm方法，触发之后的操作
								console.log(afterCreateCustomForm);
							});
						}*/
						} else {
							//若是展示表单用于构造
							customFormService.initCheckBoxAndRadio();
							$("#showTypeHiddenInput").on('ifChecked', function() {
								scope.showTypeHidden.isShow = true;
								scope.$apply();
							});
							
							$("#showTypeHiddenInput").on('ifUnchecked', function() {
								scope.showTypeHidden.isShow = false;
								scope.$apply();
							});
						}
					});
				}
		    	
			}
		}
	})
    //预览表单
    .controller('modalctrl',function($scope){
    	$scope.showTypeHidden = {isShow: false};
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
    	$scope.showTypeHidden = {isShow: false};
    	$scope.paixu = ["","",""];
    	var initData = function () {
//    		console.log(element);
    		$.each(element, function(index, item){
    			//将特定json数据转为可展示数据格式
    			if(item.options != "") {
					item.options = angular.fromJson(item.options);
				}
    			//将特定json数据转为可展示数据格式
    			if(item.event != "") {
					item.event = angular.fromJson(item.event);
				}
    		});
    		//初始化展示表单所需的元素数据。
    		$scope.sercoundItems = element;
    		$scope.$apply();
			//customFormService.initConstructObj(tableElements, constructObj);
    	};
    	
    	//定义定时器的执行次数
    	var intervalNum = 0;
    	//定义定时器，用于检测表单元素是否取回，取回后触发构建表单函数。
    	var checkEleInterval = window.setInterval(function() {
    		intervalNum++;
//    		console.log(typeof(element));
    		if(typeof(element) != "undefined") {
    			initData();
    			window.clearInterval(checkEleInterval);
    		}
    		if(intervalNum > 50) window.clearInterval(checkEleInterval);
    	},100);
    	
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

