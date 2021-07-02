let selfCenter = (id) =>{
    let winH = parent($("body").height);
    let winW = parent($("body").width);

    $("#"+id).css({
        marginTop : (winH-parent($("#"+id).height()))/2+"px",
        marginLeft : (winW-parent($("#"+id).width()))/2+"px",
    })
};

selfCenter('box');