function basechoose(event) {
    var selectedLayer = event.target.value; // lấy giá trị thẻ input
    console.log(selectedLayer);
    var layers = map.getLayers().getArray(); //lấy ra các phần tử trong map

    layers.forEach(function(layer) { //lập qua các phần tử 
        if(layer.get('type') == 'base'){ //Lọc những phần tử có type là base
        if (layer.get('title') === selectedLayer) {
            layer.setVisible(true); //set hiển thị theo giá trị checked
        } else {
            layer.setVisible(false);
        }
    }
    });
};

function toggleLayer(event){                        //Hàm bắt sự kiện onchange
    var lyrname = event.target.value;             //Tạo biến gán value khi check (tên của layer)
    var checkedStatus = event.target.checked;     //Trạng thái check hay no check (true or false)
    var lyrlist = map.getLayers();
    console.log(lyrlist);                //Lấy thông tin các layer từ ham getLayer
    lyrlist.forEach(element => {
        if(lyrname == element.get('title')){
            element.setVisible(checkedStatus);
        }
    });
}
function selectAll(event){
    var checkedStatus = event.target.checked;
    if(checkedStatus){
        document.getElementById('checkboxlayer1').checked = true;
        document.getElementById('checkboxlayer2').checked = true;
        var lyrlist = map.getLayers().getArray();
        console.log(lyrlist);
        lyrlist.forEach(element =>{
            if(element.get('title') == 'Tinh Vietnam'){
                element.setVisible(true);
            }
        })
    }else{
        document.getElementById('checkboxlayer1').checked = false;
        document.getElementById('checkboxlayer2').checked = false;
    }
}