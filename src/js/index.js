/**
 * Index script
 * @author gongph<youremail.com>
 * @date 2012010111245
 */
;(function($) {
  'user strict';
  
  var CONST = {
    STR: {
      current: 'current'
    }
  }
  
  $(function() {
    // 点击切换
    $('.tab').on('click', function() {
      $(this).addClass(CONST.STR.current).siblings().removeClass(CONST.STR.current)
    })
  });
}(jQuery))
