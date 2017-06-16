//tongyou.la 2015 common by ghost

//tyui
var ty={render:[],api:"../api_v2/"};

ty.loadPage=function(p){
    var hash = p.pageid;
    if(p.arg) hash += '/'+p.arg;
    // if(p.reload)   hash += '/'+p.reload;
    if(p.callback) hash += '/'+p.callback;
    window.location.href = hash;
}

//切换页面
ty.switchPage=ty.sp=function(id,silence){

    if(id==-1){
        $("body").data("ty-reload","0");
        window.history.go(-1);
        return;
    }

    if(!id)return false;
    var $page=kap.switchPage(id);
    if(!$page)return false;
    if(!$page.data("ty-tools")){
        var menus=[];
    }else{
        var menus=$page.data("ty-tools").split(",");
    }
    $(".ty-tools").removeClass("ty-tools-current");
    for(var i=0;i<menus.length;i++){
        var menu=menus[i];
        $(menu).addClass('ty-tools-current');
    }
    if($(".ty-menu-top .ty-tools-current").length>0 && $(".ty-menu-bottom .ty-tools-current").length>0){
        $("body").removeClass("ty-view-top");
        $("body").removeClass("ty-view-bottom");
        $("body").addClass("ty-view-all");
    }else if($(".ty-menu-top .ty-tools-current").length>0){
        $("body").removeClass("ty-view-all");
        $("body").removeClass("ty-view-bottom");
        $("body").addClass("ty-view-top");
    }else if($(".ty-menu-bottom .ty-tools-current").length>0){
        $("body").removeClass("ty-view-all");
        $("body").removeClass("ty-view-top");
        $("body").addClass("ty-view-bottom");
    }else{
        $("body").removeClass("ty-view-all");
        $("body").removeClass("ty-view-top");
        $("body").removeClass("ty-view-bottom");
    }
    $(".ty-menu-top-hide").removeClass("ty-menu-top-hide");

    var render_click=ty.render["click"];
    if(render_click!=null){
        if(!silence){
            $page.find("[data-ty-target]").unbind().click(function(){
                render_click($(this));
            });
        }
    }


    var render=ty.render[$page.attr("id")];
    if(render!=null)render($page,silence);




    return $page;

}

//底部弹出
ty.popBottom=function(arg){
    //arg:{title:,html:,submit:{label:,callback},cancel:,height:}
    if(!arg.submit){
        arg.submit={label:'确定',callback:function(){}}
    }else{
        if(!arg.submit.callback){
            arg.submit.callback=function(){}
        }
        if(!arg.submit.label){
            arg.submit.label="确定";
        }
    }
    var html='<div class="ty-popbottom">';
    html+='<div class="title">'+arg.title+'<span class="btn-close" data-icon="&#x103;"></span></div>';
    html+='<div class="content">'+arg.html+'</div>';
    html+='<div class="btn-submit">'+arg.submit.label+'</div>'
    html+='</div>';
    if(!arg.height)arg.height=200;
    var $t=kap.popBottom({
        html:html,
        blur:true,
        height:arg.height
    });
    $t.find(".content").css("height",arg.height-110);
    $t.find(".btn-submit").click(function(){
        arg.submit.callback();
        kap.popBottom(false);
    });
    $t.find(".btn-close").click(function(){
        if(arg.cancel!=null){
            arg.cancel();
        }
        kap.popBottom(false);
    });
    return $t;

}

//分享
ty.showShare=function(arg){
    if(arg){
        if($(".ty-win-share").length<1){
            $("body").append($("#template_share").html());
        }
        kap.mask(true);
        $(".ty-win-share").unbind().click(function(){
            ty.showShare(false);
        })
        $(".ty-win-share").show();
    }else{
        kap.mask(false);
       $(".ty-win-share").hide();
    }
}

//图集
ty.textPics=function($target){ //正文内文图，可重复设置
    if(!$target)var $target=$(".text-pics");
    $target.each(function(){
        //图片比
        //dom改造
        var $set=$(this);
        if($set.find(".pics").length>0)return;
        $set.find("img").wrapAll('<div class="pics"></div>');
        $set.height($set.width()*$set.data("height")/$set.data("width"));
        $set.append('<span class="pos"></span>');
        //改造完成
        var $pics=$set.find(".pics");
        var $pic_items=$pics.find("img");
        var $pos=$set.find(".pos");
        var cw=$set.width();
        var _count=$pic_items.length;
        var _pidx=0;
        $set.data("pos",0);
        $pic_items.each(function(i){
            $(this).css({
                width:cw,
                left:i*cw
            });
        });
        show(0);
        function show(idx){
            if(idx<0)idx=0;
            if(idx>$pic_items.length-1)idx=$pic_items.length-1;
            var np=-idx*cw;
            kap.css3trans($pics,"translateX("+np+"px)","0.5s");
            $set.data("pos",np);
            _pidx=idx;
            $pos.html((idx+1)+" / "+_count);

        }
        $set.bind("touchstart",function(e){
            var p=kap.pointerEventToXY(e);
            $(this).data("touch",p.x);
            $(this).data("touch-y",p.y);
            $set.data("touch-lock",false);
        });
        $set.bind("touchmove",function(e){
            if($set.data("touch-lock"))return;
            var p=kap.pointerEventToXY(e);
            var dis=p.x-$(this).data("touch");
            var disy=p.y-$(this).data("touch-y");
            if(Math.abs(disy)<Math.abs(dis)){
                //横向
                //if(!$set.data("touch-lock")){
                    e.preventDefault();
                    var np=$(this).data("pos")+dis;
                    kap.css3trans($pics,"translateX("+np+"px)");
                //}
            }else{
                $set.data("touch-lock",true);
            }
        });
        $set.bind("touchend",function(e){
            if($set.data("touch-lock"))return;
            var p=kap.pointerEventToXY(e);
            var disy=p.y-$(this).data("touch-y");
            var dis=p.x-$(this).data("touch");
            if(Math.abs(disy)+10<Math.abs(dis)){
                if(dis<-10){
                    show(_pidx+1);
                }else if(dis>10){
                    show(_pidx-1);
                }else{
                    show(_pidx);
                }
            }
        });
    });
}
ty.init=function(){
    kap.init();
    //菜单自动隐藏 data-ty-autohide=true
    var _scrollPos=$(window).scrollTop();
    $(".ty-menu-top,.ty-menu-bottom").data("ty-scrollpos",$(window).scrollTop());
    $(window).scroll(function(){
        if($(".ty-menu-top .ty-tools-current").data("ty-autohide")){
            var _top=$(window).scrollTop();
            var _scrollPos=$(".ty-menu-top").data("ty-scrollpos");
            if(_top>_scrollPos){
                if(!$(".ty-menu-top").hasClass("ty-menu-top-hide") && _top>50){
                    $(".ty-menu-top").addClass("ty-menu-top-hide");
                }
            }else if(_top<_scrollPos){
                if($(".ty-menu-top").hasClass("ty-menu-top-hide")){
                    $(".ty-menu-top").removeClass("ty-menu-top-hide");
                }
            }
            $(".ty-menu-top").data("ty-scrollpos",_top);
        }
        if($(".ty-menu-bottom .ty-tools-current").data("ty-autohide")){
            var _top=$(window).scrollTop();
            var _scrollPos=$(".ty-menu-bottom").data("ty-scrollpos");
            if(_top>_scrollPos){
                if(!$(".ty-menu-bottom").hasClass("ty-menu-bottom-hide")){
                    $(".ty-menu-bottom").addClass("ty-menu-bottom-hide");
                }
            }else if(_top<_scrollPos){
                if($(".ty-menu-bottom").hasClass("ty-menu-bottom-hide")){
                    $(".ty-menu-bottom").removeClass("ty-menu-bottom-hide");
                }
            }
            $(".ty-menu-bottom").data("ty-scrollpos",_top);
        }

    });
}

$(function(){
    ty.init();
});
