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
          //$scope.widthes=650+'px';
          //$scope.topes=53+'px';
          $scope.otherread=true;
          $scope.isInEdit=true;
          $scope.isView = false;
           //添加列
            $scope.form_editRow=function(a,inx,c){
                //console.log(inx);
                //从inx 0开始 A:65
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
           $scope.form_editColumn=function(a,inx,c){
               //inx 从0开始 0，1，2 ，3，4...
               console.log(inx);
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
                       console.log(inx);
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
               console.log(a);
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
               console.log(e);
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
              },50);
           };

           $scope.elementstag=[
               {   title:'文本输入框',
                   icon:'icon-dingdan',
                   sizeX: 1, sizeY: 1,
                   row:null, col:null,
                   typeclass:'type-textarea',
                   isActive:false,
                   isReadonly:false,
                   label:'',
                   type_placeholder:'文本输入框',
                   isEmpty:false,
                   Dplaceh:'',
                   isLabelPortrait:"false",
                   element:'textarea',
                   type:'',
                   elementId:'',
                   isDisable:'false',
                   isVisible:'false',
                   isEditable:'true',
                   event:null,
                   errorMsg:'不能为空！',
                   menuCode:'',
                   name:'',
                   defaultValue:'defaultValue'
               },
               {   title:'单选框',
                   icon:'icon-danxuan',
                   sizeX: 1,
                   sizeY:1,
                   row:null, col:null,
                   typeclass:'type-radio',
                   isActive:false,
                   isReadonly:false,
                   label:'',
                   type_placeholder:'单选框',
                   isEmpty:false,
                   itemlayout:'0',
                   isLabelPortrait:"false",
                   element:'input',
                   type:'radio',
                   elementId:'',
                   isDisable:'false',
                   isVisible:'false',
                   isEditable:'true',
                   event:null,
                   errorMsg:'不能为空！',
                   menuCode:'',
                   name:'',
                   defaultValue:0

               },
               {   title:'复选框',
                   icon:'icon-fuxuan',
                   sizeX: 1, minSizeY: 1,
                   row: null, col: null,
                   typeclass:'type-checkbox',
                   isActive:false,
                   isReadonly:false,
                   label:'',
                   type_placeholder:'复选框',
                   isEmpty:true,
                   itemlayout:'0',
                   isLabelPortrait:"false",
                   isitemPortrait:'true',
                   element:'input',
                   type:'checkbox',
                   elementId:'',
                   isDisable:'false',
                   isVisible:'false',
                   isEditable:'true',
                   event:null,
                   errorMsg:'不能为空！',
                   menuCode:'',
                   name:'',
                   defaultValue:'选项'
               },
               {   title:'下拉框',
                   icon:'icon-xiala',
                   sizeX: 1, sizeY: 1,
                   row: null, col: null,
                   typeclass:'type-select',
                   isActive:false,
                   isReadonly:false,
                   label:'',
                   type_placeholder:'下拉框',
                   isEmpty:true,
                   isLabelPortrait:"false",
                   element:'select',
                   type:'',
                   elementId:'',
                   isDisable:'false',
                   isVisible:'false',
                   isEditable:'true',
                   event:null,
                   errorMsg:'不能为空！',
                   menuCode:'',
                   name:'',
                   defaultValue:''

               }, {   title:'日期',
                   icon:'icon-rili',
                   sizeX: 1, sizeY: 1,
                   row:null, col:null,
                   element:'input',
                   type:'date',
                   typeclass:'type-date',
                   isActive:false,
                   isReadonly:false,
                   label:'',
                   type_placeholder:'日期',
                   isEmpty:false,
                   tempdateValue:'',
                   isLabelPortrait:"false",
                   elementId:'textDate',
                   isDisable:'false',
                   isVisible:'false',
                   isEditable:'true',
                   event:null,
                   errorMsg:'wroung',
                   menuCode:'textDate1',
                   name:'textDate',
                   defaultValue:'defaultValue'
               },
               {   title:'时间',
                   icon:'icon-iconfonttime',
                   sizeX: 1, sizeY: 1,
                   row:null, col:null,
                   element:'input',
                   type:'time',
                   typeclass:'type-time',
                   isActive:false,
                   isReadonly:false,
                   label:'',
                   type_placeholder:'时间',
                   isEmpty:false,
                   temptimeValue:'',
                   isLabelPortrait:"false",
                   elementId:'textTime',
                   isDisable:'false',
                   isVisible:'false',
                   isEditable:'true',
                   event:null,
                   errorMsg:'wroung',
                   menuCode:'textTime1',
                   name:'textTime',
                   defaultValue:'defaultValue'

               },
               {   title:'日期时间',
                   icon:'icon-riqishijian',
                   minSizeX: 2, minSizeY: 1,
                   sizeX: 2, sizeY: 1,
                   row:null, col:null,
                   element:'input',
                   type:'datetime',
                   typeclass:'type-datetime',
                   isActive:false,
                   isReadonly:false,
                   label:'',
                   type_placeholder:'日期时间',
                   isEmpty:false,
                   temptimeValue:'',
                   tempdateValue:'',
                   isLabelPortrait:"false",
                   elementId:'datetime',
                   isDisable:'false',
                   isVisible:'false',
                   isEditable:'true',
                   event:null,
                   errorMsg:'wroung',
                   menuCode:'textdatetime1',
                   name:'datetime',
                   defaultValue:'defaultValue'
               },
             {   title:'隐藏表单',
                 icon:'icon-riqishijian',
                 minSizeX: 1, minSizeY: 1,
                 sizeX: 1, sizeY: 1,
                 row:null, col:null,
                 element:'input',
                 type:'hidden',
                 typeclass:'type-datetime',
                 isActive:false,
                 isReadonly:false,
                 label:'',
                 type_placeholder:'隐藏表单',
                 isEmpty:false,
                 temptimeValue:'',
                 tempdateValue:'',
                 isLabelPortrait:"false",
                 elementId:'datetime',
                 isDisable:'false',
                 isVisible:'false',
                 isEditable:'true',
                 event:null,
                 errorMsg:'wroung',
                 menuCode:'textdatetime1',
                 name:'datetime',
                 defaultValue:'defaultValue'
             },
               {   title:'数字',
                   icon:'icon-shuzi',
                   sizeX: 1, sizeY: 1,
                   row:null, col:null,
                   element:'input',
                   type:'number',
                   typeclass:'type-number',
                   isActive:false,
                   isReadonly:false,
                   label:'',
                   type_placeholder:'数字',
                   isEmpty:false,
                   units:'',
                   Dplaceh:'',
                   isLabelPortrait:"false",
                   elementId:'number',
                   isDisable:'false',
                   isVisible:'false',
                   isEditable:'true',
                   event:null,
                   errorMsg:'wroung',
                   menuCode:'textnumber1',
                   name:'number',
                   defaultValue:123
               },
               {
                   title:'附件',
                   icon:'icon-attachment',
                   minSizeY:1,minSizeX:2,
                   sizeX: 2, sizeY: 1,
                   row:null, col:null,
                   element:'input',
                   type:'file',
                   typeclass:'type-attachment',
                   isActive:false,
                   isReadonly:false,
                   label:'',
                   isEmpty:true,
                   type_placeholder:'附件',
                   elementId:'attachment',
                   isDisable:'false',
                   isVisible:'false',
                   isEditable:'true',
                   event:null,
                   errorMsg:'wroung',
                   menuCode:'textattachment1',
                   name:'attachment',
                   defaultValue:'defaultValue'
               },
               {   title:'邮箱',
                   icon:'icon-renminbi',
                   sizeX: 1, sizeY: 1,
                   row:null, col:null,
                   element:'input',
                   type:'email',
                   typeclass:'type-email',
                   isActive:false,
                   isReadonly:false,
                   label:'',
                   itemvalue:'',
                   type_placeholder:'邮箱',
                   isEmpty:false,
                   Dplaceh:'',
                   isLabelPortrait:"false",
                   elementId:'email',
                   isDisable:'false',
                   isVisible:'false',
                   isEditable:'true',
                   event:null,
                   errorMsg:'wroung',
                   menuCode:'textemail1',
                   name:'email',
                   defaultValue:'defaultValue'
               },
               {   title:'只读文本',
                   icon:'icon-yan',
                   minSizeY:1,minSizeX:2,
                   sizeX: 2, sizeY: 1,
                   row:null, col:null,
                   element:'',
                   type:'',
                   typeclass:'type-readText',
                   isActive:false,
                   isReadonly:false,
                   label:'',
                   type_placeholder:'',
                   isEmpty:false,
                   tempValue:'',
                   elementId:'textView',
                   isDisable:'false',
                   isVisible:'false',
                   isEditable:'true',
                   event:null,
                   errorMsg:'wroung',
                   menuCode:'texttextView1',
                   name:'textView',
                   defaultValue:''
               },
               {   title:'时长',
                   icon:'icon-jishiqi',
                   //sizeX:3, sizeY: 3,
                   minSizeY:3,minSizeX:3,
                   sizeX:3, sizeY: 3,
                   row:null, col:null,
                   element:'',
                   type:'',
                   typeclass:'type-period',
                   isActive:false,
                   isReadonly:false,
                   label:'',
                   type_placeholder:'时长',
                   isEmpty:true,
                   accuracy:'day',
                   starttime:'',
                   endtime:'',
                   starttimes:'开始时间',
                   endtimes:'结束时间',
                   timeDifference:0,
                   elementId:'period',
                   isDisable:'false',
                   isVisible:'false',
                   isEditable:'true',
                   event:null,
                   errorMsg:'wroung',
                   menuCode:'textperiod1',
                   name:'period',
                   defaultValue:'defaultValue'
               }
           ];

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

