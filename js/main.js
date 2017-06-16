window.onload=function() {
	// 前面用到vw单位，但是低版本的设备可能不支持，那么就需要js来处理一下：
	document.documentElement.style.fontSize = window.innerWidth/3.2/2 + 'px';
    kap.switchPage("#page1");

};
$(function(){
    var updateOrientation = function() {
    var orientation = window.orientation;

    switch(orientation) {
      case 90: case -90:
        orientation = 'landscape';
      break;
      default:
        orientation = 'portrait';
    }

    // set the class on the HTML element (i.e. )
    document.body.parentNode.setAttribute('class', orientation);
  };

  // event triggered every 90 degrees of rotation
  window.addEventListener('orientationchange', updateOrientation, false);
})




































