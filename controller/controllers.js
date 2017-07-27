/**
 * Created by Administrator on 2017/6/19.
 */
angular.module('controller',['ngSanitize','mgcrea.ngStrap','gridster'])
    .controller('controllers',function($scope,CommonDataService,$popover){
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


        CommonDataService.getData('json/test.json?'+timer).then(function(data){
          $scope.xrow=data.data.rows;
          $scope.paixu=data.data.paixu;
          $scope.otherread=true;
          $scope.isInEdit=true;
          $scope.isView = false;
           //添加列
            $scope.form_editRow=function(a,inx,c){
                //console.log(inx);
                //从inx 0开始 A:65
                if(a<0&&$scope.paixu.length>3){

                    for(var i=$scope.standardItems.length-1;i>=0;i--){
                        if($scope.standardItems[i] && $scope.standardItems[i].col<=inx && inx < $scope.standardItems[i].col+$scope.standardItems[i].sizeX){
                            $scope.standardItems.splice(i,1);
                        }
                    }
                    for(var i=0;i<=$scope.standardItems.length-1;i++){
                        if($scope.standardItems[i] && $scope.standardItems[i].col>inx){
                            $scope.standardItems[i].col--;
                        }
                    }
                    $scope.paixu.splice(inx,c);
                    for(var i=0;i<$scope.xrow.length;i++){
                        ($scope.xrow)[i].cols.splice(inx,1);
                    }

                   /* $('.form_table_in').mCustomScrollbar("scrollTo","right");*/
                    $scope.gridsterConfiguration.columns=$scope.paixu.length;
                }
                else if(a>0 && $scope.paixu.length<8) {

                    if(c<1){
                        //向前添加列
                        $scope.paixu.splice(inx,0,'');
                        for(var m=0;m<$scope.xrow.length;m++){
                            ($scope.xrow)[m].cols.splice(inx,0,'');

                        }
                        for(var i=$scope.standardItems.length-1;i>=0;i--){
                            if($scope.standardItems[i].col>inx-1){
                                $scope.standardItems[i].col++;
                            }
                        }
                    }
                    else if(c==1){
                        //向后添加列
                        $scope.paixu.splice(inx+c,0,'');
                        for(var m=0;m<$scope.xrow.length;m++){
                            ($scope.xrow)[m].cols.splice(inx+c,0,'');
                        }
                       for(var j=$scope.standardItems.length-1;j>=0;j--){
                           if($scope.standardItems[j].col>inx){
                               $scope.standardItems[j].col++;
                           }
                       }
                    }
                   /* $('.form_table_in').mCustomScrollbar("scrollTo","right");*/
                    $scope.gridsterConfiguration.columns=$scope.paixu.length;
                }
                else {
                    return;
                }
            };

           //向上或者下添加行数
           $scope.form_editColumn=function(a,inx,c){
               //inx 从0开始 0，1，2 ，3，4...
               if(a<0){
                   for(var i=$scope.standardItems.length-1;i>=0;i--){
                       //删除行
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
                   //添加行
                   if(c<1){
                       //向上添加一行
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
             /*  $scope.$watch(dataMata,function(oldd,newd){
                  console.log(newd);
               });*/
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
             /*  console.log(e);*/
               //var objs= {};
               //for(var key in e) {
               //    eval("objs." + key + "=e." + key);
               //}
               objs=Object.create(e);
               objs.$$hashKey = null;
               objs.col = null;
               objs.row = null;
               objs.options=[{value:'选项1',text:'选项1'}];
               //$scope.appendEle(objs);
               $scope.standardItems.push(objs);

           };
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
               objs.options=[{value:'选项1',text:'选项1'}];
              /*objs.selectedstate='';*/
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
                  //console.log($scope.standardItems);
              },50);
           };

           $scope.elementstag=elementsJson;

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
           $scope.departMent ={
               states:["电商部","财务部","人事部","外贸部","内贸部","技术部"]
           };
           $scope.personName={
               states:["王鹏翔","李邓珂","于高峰","田丰","季忠宇","洪浩远"]
           };
           $scope.personDepart={
               states:["电商王鹏翔","电商李邓珂","电商于高峰","电商田丰","电商季忠宇","电商洪浩远"]
           };
           $scope.standardItems = [];
           $scope.isLoading=false;
           $scope.$watch('standardItems.length',function(newVale,oldValue,scope){
               if(newVale!=oldValue){
                   $scope.isInEdit=true;
               }
           })
        });

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
            templateUrl:'template/form.Directive.html'
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
            templateUrl:'template/form.ListDirective.html'
        }
    })
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
            margin: [1,1]
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

