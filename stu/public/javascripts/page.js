/**
 * Created by qingpeng.tian on 2016/12/19.
 */
$(function() {
    $('.btnPage a').on('click',function(event){
        //event.preventDefault(); ajax 提交的时候使用
        $(this).parent('li').addClass('active').siblings().removeClass('active');
    });

})