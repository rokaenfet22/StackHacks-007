let element_name_arr = ["1","2","3","4","5","6","7","8","9"] //List of ID's
let element_arr = []
element_name_arr.forEach(function(item,index){
  element_arr.push(document.getElementById(item))
})
//"animate__fadeInDown"
let left_fade = "animate__fadeInLeft"
let right_fade = "animate__fadeInRight"

function checkVisible( elm, evalType ) {
    evalType = evalType || "visible";

    var vpH = $(window).height(), // Viewport Height
        st = $(window).scrollTop(), // Scroll Top
        y = $(elm).offset().top,
        elementHeight = $(elm).height();

    if (evalType === "visible") return ((y < (vpH + st)) && (y > (st - elementHeight)));
    if (evalType === "above") return ((y < (vpH + st)));
}

window.addEventListener("scroll",function(event){
    element_arr.forEach(function(item,index){
        if (checkVisible(item,"visible")){
            if (index%2==0){
                var desired_fade = left_fade
            }else{
                var desired_fade = right_fade
            }
            item.classList.add(desired_fade)
            }else{
            item.classList.remove(left_fade)
            item.classList.remove(right_fade)
            }
        })
})
