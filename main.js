

// Tạo view cho map
const mapView = new ol.View({
    center: ol.proj.fromLonLat([107.405934, 16.458786]),
    zoom:6 ,
})

// tạo một map
const map = new ol.Map({
    target:'map', //gán map cho id 
    view: mapView,
})
//Tạo một lớp map nền
const osmTile = new ol.layer.Tile({
    title: 'Open Street Map', //đặt tên layer //hiển thị true
    source: new ol.source.OSM(), //nguồn map
    type:'base',
})

map.addLayer(osmTile); //thêm layer vào map
//Tạo lớp nền vệ tinh
const satellite = new ol.layer.Tile({
    title: 'Satellite',
    visible: false,
    source: new ol.source.TileJSON({
        url:'https://api.maptiler.com/maps/satellite/tiles.json?key=WljwXjAj1vnRqpgh1v0E',
    }),
    type: 'base',
});

map.addLayer(satellite);

//Tạo lớp rỗng
const nonebase = new ol.layer.Tile({
    title:'none',
    visible:false,
    type:'base',
})
// Tạo nhóm lớp nền
const baseGroup = new ol.layer.Group({
    title:'base',
    layers:[osmTile,nonebase],
    fold:true,
})
//map.addLayer(baseGroup);


const vietnamTile = new ol.layer.Tile({
    title:'Tinh Vietnam',
    source: new ol.source.TileWMS({
        url:'http://localhost:8080/geoserver/webgis_air_vinhlong/wms?',
        params: {
            'LAYERS':'webgis_air_vinhlong:hcTinh',
            'TILED':true,
        },
        serverType:'geoserver',
        visible:true,
    })  
});



const vietnamTile_1 = new ol.layer.Tile({
    title:'Hanh Chinh Viet Nam',
    source: new ol.source.TileWMS({
        url:'http://localhost:8080/geoserver/webgis_air_vinhlong/wms?',
        params: {
            'LAYERS':'webgis_air_vinhlong:hcVN',
            'TILED':true,
        },
        serverType:'geoserver',
        visible:true,
    })  
});

map.addLayer(vietnamTile_1);
map.addLayer(vietnamTile);

// const layersgroup = new ol.layer.Group({
//     title:'Hanh chinh',
//     layers:[vietnamTile,vietnamTile_1],
//     fold:true,
// })
//map.addLayer(layersgroup);



// const layerSwitcher = new ol.control.LayerSwitcher({
//     activationMode:'click',
//     startActive:false,
//     groupSelectStyle:'children',
// })

// map.addControl(layerSwitcher);

 function basechoose(event) {
    var selectedLayer = event.target.value;
    console.log(selectedLayer);
    var layers = map.getLayers().getArray();

    layers.forEach(function(layer) {
        if(layer.get('type') == 'base'){
        if (layer.get('title') === selectedLayer) {
            layer.setVisible(true);
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

//Vị trí chuột
 const mousePoisition = new ol.control.MousePosition({ //tạo một công cụ
    className:'mousePosition', 
    projection:'EPSG:4326', //đặt hệ toạ độ hiển thị
    coordinateFormat: function(coordinate){return ol.coordinate.format(coordinate,'{y}, {x}',6);}
 }) //set kiểu hiển thị để hiện thị toạ độ, sử dụng ol.coordinate.format để set lại kiểu hiển thị

 map.addControl(mousePoisition);

 //ScaleBar

 const scalebar = new ol.control.ScaleLine({
    bar: true, //hiển thị thước
    text:true,//hiển thị tỉ lệ bản đồ
 })

 map.addControl(scalebar);

//Thêm lớp phủ là popup thông tin của điểm
const container = document.getElementById('popup');
const content  = document.getElementById('popup-content');
const closer = document.getElementById('popup-closer');

const popup = new ol.Overlay({
    element:container,
    autoPan:true,
    autoPanAnimation:{
        duration:250,
    },
})

map.addOverlay(popup);

closer.onclick = ()=>{
    popup.setPosition(undefined);
    closer.blur();
    return false;
}

//Thêm nút home
const homeButton = document.createElement('button');
homeButton.innerHTML='<img src="image/home.png" alt="" style="width:20px; height:20px">';
homeButton.className = 'myButton';

const homeElement = document.createElement('div');
homeElement.className = 'homeButtonDiv';
homeElement.appendChild(homeButton);

const homeControl = new ol.control.Control({
    element:homeElement,
    
})

homeButton.addEventListener('click',()=>{
    location.href = "index.html"
})
map.addControl(homeControl);
//Thêm nút toàn màn hình
const fsButton = document.createElement('button');
fsButton.innerHTML='<img src="image/fullscreen.png" alt="" style="width:20px; height:20px">';
fsButton.className = 'myButton';

const fsElement = document.createElement('div');
fsElement.className = 'fsButtonDiv';
fsElement.appendChild(fsButton);

const fsControl = new ol.control.Control({
    element:fsElement,
})
map.addControl(fsControl);
fsButton.addEventListener('click',()=>{
    const mapEle = document.getElementById("map");

    if(mapEle.requestFullscreen){
        mapEle.requestFullscreen();
    }else if(mapEle.msRequestFullscreen){
        mapEle.msRequestFullscreen();
    }else if(mapEle.mozRequestFullscreen){
        mapEle.mozRequestFullscreen();
    }else if(mapEle.mswebkitRequestFullscreen){
        mapEle.mswebkitRequestFullscreen();
    }
})

//Bật tắt trường thông tin
var featureInfoButton = document.createElement('button');
featureInfoButton.innerHTML='<img src="image/info.png" alt="" style="width:20px; height:20px">';
featureInfoButton.className = 'myButton';
featureInfoButton.id = 'featureInfoButton';

var featureInfoElement = document.createElement('div');
featureInfoElement.className = 'featureInfoDiv';
featureInfoElement.appendChild(featureInfoButton);

var featureInfoControl = new ol.control.Control({
    element:featureInfoElement,
    
})
var featureInfoflag = false;
featureInfoButton.addEventListener('click',()=>{
    featureInfoButton.classList.toggle('clicked');
    featureInfoflag = !featureInfoflag;
})


map.addControl(featureInfoControl);

map.on('singleclick',(evt)=>{
    if(featureInfoflag){
        content.innerHTML='';
        const resolution = mapView.getResolution();
        const url  = vietnamTile.getSource().getFeatureInfoUrl(evt.coordinate, resolution,'EPSG:3857', {
            'INFO_FORMAT':'application/json',
            "propertyName":'country,province',
        });

        if(url){
            $.getJSON(url, function(data){
                const feature = data.features[0];
                const props = feature.properties;
                content.innerHTML = "<h3>Country: </h3> <p>" + props.country.toUpperCase()+"</p> </br> <h3>Province:</h3> <p>" + props.province.toUpperCase() + "</p>";
                popup.setPosition(evt.coordinate)
            });
        }else{
            popup.setPosition(undefined);
        }
    }
});

// tạo thước đo đường và vùng
var rulerButton = document.createElement('button');
rulerButton.innerHTML='<img src="image/ruler.png" alt="" style="width:20px; height:20px">';
rulerButton.className = 'myButton';
rulerButton.id = 'rulerButton';

var rulerElement = document.createElement('div');
rulerElement.className = 'rulerDiv';
rulerElement.appendChild(rulerButton);

var rulerControl = new ol.control.Control({
    element:rulerElement,
    
})
map.addControl(rulerControl);

var rulerflag = false;
rulerButton.addEventListener('click',()=>{
    rulerButton.classList.toggle('clicked');
    document.getElementById('map').style.cursor ='default';
    rulerflag = !rulerflag;
    if(rulerflag){
        map.removeInteraction(draw);
        addInteraction('LineString');
    }else{
        map.removeInteraction(draw);
        source.clear();
        const elements = document.getElementsByClassName('ol-tooltip ol-tooltip-static');
        while(elements.length>0) elements[0].remove();
    }
})


//Vùng
var polygonButton = document.createElement('button');
polygonButton.innerHTML='<img src="image/polygon.png" alt="" style="width:20px; height:20px">';
polygonButton.className = 'myButton';
polygonButton.id = 'polygonButton';

var polygonElement = document.createElement('div');
polygonElement.className = 'polygonDiv';
polygonElement.appendChild(polygonButton);

var polygonControl = new ol.control.Control({
    element:polygonElement,
})
map.addControl(polygonControl);

var polygonflag = false;
polygonButton.addEventListener('click',()=>{
    polygonButton.classList.toggle('clicked');
    polygonflag = !polygonflag;
    document.getElementById('map').style.cursor = 'default';
    if(polygonflag){
        map.removeInteraction(draw);
        addInteraction('Polygon');
    }else{
        map.removeInteraction(draw);
        source.clear();
        const elements = document.getElementsByClassName('ol-tooltip ol-tooltip-static');
        while (elements.length>0) elements[0].remove();
    }
})

/** 
 * @type {String}
*/
var continuePolygonMsg = "Click to continue polygon, double click to complete";
/** 
 *  @type {String}
*/ 

var continueLineStringMsg = "Click to continue LineString, double click to complete";
var draw;

var source = new ol.source.Vector();
var vector = new ol.layer.Vector({
    source: source,
    style: new ol.style.Style({
        fill: new ol.style.Fill({
            color: 'rgba(255,255,255,0.2)',        
        }),
        stroke: new ol.style.Stroke({
            color:'#ffcc33',
            width:2,
        }),
        image: new ol.style.Circle({
            radius: 7,
            fill: new ol.style.Fill({
                color: '#ffcc33',        
            }),
        })
    })
})
map.addLayer(vector);

function addInteraction(intType){
    draw = new ol.interaction.Draw({
        source: source,
        type: intType,
        style: new ol.style.Style({
            fill: new ol.style.Fill({
                color: 'rgba(200,200,200,0.6)',
            }),
            stroke: new ol.style.Stroke({
                color:'rgba(0,0,0,0.5)',
                lineDash:[10,10],
                width:2,
            }),
            image: new ol.style.Circle({
                radius:5,
                stroke: new ol.style.Stroke({
                    color:'rgba(0,0,0,0.7)',
                }),
                fill: new ol.style.Fill({
                    color:'rgba(255,255,255,0.2)',
                })
            })
        })
    });
    map.addInteraction(draw);
    createMeasureTooltip();
    createHelpTooltip();

    /**
     * @type {import("../src/ol/Feature.js").default} 
     */
    var sketch;
     /**
      * @param {import ("../src/ol/WebBrowserEvent").default} evt
      */
     var pointerMoveHandle = function(evt){
        if(evt.dragging){
            return
        }
        /**@type {string} */
        var helpMsg ="Click to start drawing"

        if(sketch){
            var geom = sketch.getGeometry();
        };
     };
     map.on('pointermove',pointerMoveHandle);
//var listener
     draw.on('drawstart',(evt)=>{
        sketch = evt.feature;
        /** @type {import("../src/ol/coordinate.js").Coordinate|undefined} */
        var tooltipCoord = evt.coordinate;

        sketch.getGeometry().on('change',function(evt){
            var geom = evt.target;
            var output;
            if(geom instanceof ol.geom.Polygon){
                output = formatArea(geom);
                tooltipCoord = geom.getInteriorPoint().getCoordinates();
            }else if(geom instanceof ol.geom.LineString){
                output = formatLength(geom);
                tooltipCoord = geom.getLastCoordinate();
            }
            measureTooltipElement.innerHTML = output;
            measureTooltip.setPosition(tooltipCoord);
        });
     });
     draw.on('drawend',()=>{
        measureTooltipElement.className = 'ol-tooltip ol-tooltip-static';
        measureTooltip.setOffset([0, -7]);

        sketch = null;
        measureTooltipElement = null;
        createMeasureTooltip();
     })
}

/**
 * @type {HTMLElement}
 */

var helpTooltipElement;


/**
 * @type {Overlay}
 */

var helpTooltip;

function createHelpTooltip(){
    if(helpTooltipElement){
        helpTooltipElement.parentNode.removeChild(helpTooltipElement);
    }
    helpTooltipElement = document.createElement('div');
    helpTooltipElement.className = 'ol-tooltip hidden';
    helpTooltip = new ol.Overlay({
        element: helpTooltipElement,
        offset: [15, 0],
        positioning: 'center-left',
    });
    map.addOverlay(helpTooltip);
}
console.log(helpTooltipElement);
if(polygonflag){
    map.getViewport().addEventListener('mouseout',()=>{
        helpTooltipElement.classList.add('hidden');
    });
}



/**
 * @type {HTMLElement}
 */
var measureTooltipElement;

/**
 * @type {Overlay}
 */

var measureTooltip;
function createMeasureTooltip(){
    if(measureTooltipElement){
        measureTooltipElement.parentNode.removeChild(measureTooltipElement);
    }
    measureTooltipElement = document.createElement('div');
    measureTooltipElement.className = 'ol-tooltip ol-tooltip-measure';
    measureTooltip = new ol.Overlay({
        element: measureTooltipElement,
        offset: [0, -15],
        positioning: 'bottom-left',
    });
    map.addOverlay(measureTooltip);
}

/**
 * 
 * 
 * @param {Polygon} polygon
 * @return {String}
 */

var formatLength = function(line){
    var length = ol.sphere.getLength(line)
    var output;
    if(length>100){
        output = Math.round((length/1000)*100)/100 +' '+'km'
    }else{
        output = Math.round(length*100)/100 +' '+'m'
    }
    return output;
}


var formatArea = (polygon)=>{
    var area = ol.sphere.getArea(polygon);
    var output;
    if(area>10000){
        output = Math.round((area/1000000)*100) / 100 + " "+'km<sup>2</sup>'
    }else{
        output  = Math.round(area * 100)/100+ " "+'m<sup>2</sup>'
    }
    return output;
}

//Tạo công cụ zoomIn zoomOut

var zoomInInteraction = new ol.interaction.DragBox();

zoomInInteraction.on('boxend',()=>{
    var zoomInExtent = zoomInInteraction.getGeometry().getExtent();
    map.getView().fit(zoomInExtent);
})

var zoominButton = document.createElement('button');
zoominButton.innerHTML='<img src="image/zoomin.png" alt="" style="width:20px; height:20px">';
zoominButton.className = 'myButton';
zoominButton.id = 'zoominButton';

var zoominElement = document.createElement('div');
zoominElement.className = 'zoominDiv';
zoominElement.appendChild(zoominButton);

var zoominControl = new ol.control.Control({
    element:zoominElement,
})



var zoominflag = false;
zoominButton.addEventListener('click',()=>{
    zoominButton.classList.toggle('clicked');
    zoominflag = !zoominflag;
    
    if(zoominflag){
        document.getElementById('map').style.cursor = 'zoom-in';
        map.addInteraction(zoomInInteraction);
        
    }else{
       map.removeInteraction(zoomInInteraction);
       document.getElementById('map').style.cursor = 'default';
    }
})
map.addControl(zoominControl);

//Zoomout

var zoomOutInteraction = new ol.interaction.DragBox();

zoomOutInteraction.on('boxend',()=>{
    var zoomOutExtent = zoomOutInteraction.getGeometry().getExtent();
    map.getView().setCenter(ol.extent.getCenter(zoomOutExtent));

    mapView.setZoom(mapView.getZoom()-1);
})

var zoomoutButton = document.createElement('button');
zoomoutButton.innerHTML='<img src="image/zoomout.png" alt="" style="width:20px; height:20px">';
zoomoutButton.className = 'myButton';
zoomoutButton.id = 'zoomoutButton';

var zoomoutElement = document.createElement('div');
zoomoutElement.className = 'zoomoutDiv';
zoomoutElement.appendChild(zoomoutButton);

var zoomoutControl = new ol.control.Control({
    element:zoomoutElement,
})



var zoomoutflag = false;
zoomoutButton.addEventListener('click',()=>{
    zoomoutButton.classList.toggle('clicked');
    zoomoutflag = !zoomoutflag;
    
    if(zoomoutflag){
        document.getElementById('map').style.cursor = 'zoom-out';
        map.addInteraction(zoomOutInteraction);
        
    }else{
       map.removeInteraction(zoomOutInteraction);
       document.getElementById('map').style.cursor = 'default';
    }
})
map.addControl(zoomoutControl);

//Tạo nút mở truy vấn

var geojson;
var featureOverlay;

var queryButton = document.createElement('button');
queryButton.innerHTML='<img src="image/query.png" alt="" style="width:20px; height:20px">';
queryButton.className = 'myButton';
queryButton.id = 'queryButton';

var queryElement = document.createElement('div');
queryElement.className = 'queryDiv';
queryElement.appendChild(queryButton);

var queryControl = new ol.control.Control({
    element:queryElement,
})
var queryflag = false;
queryButton.addEventListener('click',()=>{
    queryButton.classList.toggle('clicked');
    queryflag = !queryflag;
    if(queryflag){
        if(geojson){
            geojson.getSource().clear();
            map.removeLayer(geojson);
        }

        if(featureOverlay){
            featureOverlay.getSource().clear();
            map.removeLayer(geojson);
        }

        document.getElementById('attQueryDiv').style.display = 'block'; 
        bolIdentify = false;
        addMapLayerList();
    }else{
        document.getElementById('attQueryDiv').style.display = 'none';
        document.getElementById('attListDiv').style.display = 'none';

        if(geojson){
            geojson.getSource().clear();
            map.removeLayer(geojson);
        }
        if(featureOverlay){
            featureOverlay.getSource().clear();
            map.removeLayer(featureOverlay);
        }
    }
});
map.addControl(queryControl)


function addMapLayerList(){
    $(document).ready(function(){
        $.ajax({
            type: "GET",
            url: "http://localhost:8080/geoserver/wfs?request=getCapabilities",
            dataType:'xml',
            success: function(xml){
                var select = $('#selectLayer');
                select.append("<option class='ddindent' value=''</option>");
                $(xml).find('FeatureType').each(function(){
                    $(this).find('Name').each(function(){
                        var value = $(this).text();
                        select.append("<option class='ddindent' value='"+ value+"'>"+value+"</option>")
                    })
                })
            }

        })
    })
};
$(function(){
    document.getElementById("selectLayer").onchange = function(){
        var select = document.getElementById('selectAttribute');
        while(select.options.length > 0){
            select.remove(0);
        }
        var value_layer = $(this).val();
        $(document).ready(function(){
            $.ajax({
                type:'GET',
                url:"http://localhost:8080/geoserver/wfs?service=WFS&request=DescribeFeatureType&version=1.1.0&typeName=" + value_layer,
                dataType:'xml',
                success: function(xml){
                    var select = $('#selectAttribute');

                    select.append("<option class='ddindent' value=''></option>")
                    $(xml).find('xsd\\:sequence').each(function(){
                        $(this).find('xsd\\:element').each(function(){
                            var value = $(this).attr('name');
                           
                            var type = $(this).attr('type');
                           
                            if(value !='geom' && 'the_geom'){
                                select.append("<option class='ddindent' value='"+ type+"'>"+value+"</option>")
                            }
                        })

                    })
                }
            })
        })
    }
    document.getElementById("selectAttribute").onchange = function(){
        var operator = document.getElementById('selectOperator');
        while(operator.options.length > 0){
            operator.remove(0);
        }
        var value_type = $(this).val();
        console.log(value_type);
        var value_attribute = $('#selectAttribute option:selected').text();
        operator.options[0] = new Option('Seclect operator',"");
        if(value_type == 'xsd:short'|| value_type == 'xsd:int'||value_type == 'xsd:double'||value_type =='xsd:long'){
            var operator1 = document.getElementById("selectOperator");
            operator1.options[1] = new Option('Greater than', '>');
            operator1.options[2] = new Option('Less than', '<');
            operator1.options[3] = new Option('Equal to', '=');
        }
        else if (value_type == 'xsd:string'){
            var operator1= document.getElementById('selectOperator');
            operator1.options[1] = new Option('Like', 'Like');
            operator1.options[2] = new Option('Equal to', '=');
        }
    }



    document.getElementById('attQryRun').onclick = function(){
        map.set('isLoading', 'YES');
    
        if(featureOverlay){
            featureOverlay.getSource().clear();
            map.removeLayer(featureOverlay);
        }
        var layer = document.getElementById("selectLayer");
        var attribute = document.getElementById('selectAttribute');
        var operator = document.getElementById('selectOperator');
        var txt = document.getElementById('enterValue');
    
        if(layer.options.selectedIndex==0){
            alert('select Layer')
        }else if(attribute.options.selectedIndex == -1){
            alert('select Attribute')
        }else if(operator.options.selectedIndex <= 0){
            alert('select operator')
        }else if(txt.value.length <= 0){
            alert('Enter value ')
        }else{
            var value_layer = layer.options[layer.selectedIndex].value;
            var value_attribute = attribute.options[attribute.selectedIndex].text;
            var value_operator = operator.options[operator.selectedIndex].value;
            var value_txt = txt.value;
    
            if(value_operator == 'Like'){
                value_txt = "%25" + value_txt+"%25";
            }else{
                value_txt = value_txt;
            };
    
            var url= "http://localhost:8080/geoserver/ows?service=WFS&version=1.1.0&request=GetFeature&typeName=" +value_layer +"&CQL_FILTER="+value_attribute+"+"+value_operator+"+'"+value_txt+"'&outputFormat=application/json";
            console.log(url);
            newaddGeoJsonToMap(url);
            newpopulateQueryTable(url);
            setTimeout(function(){newaddRowHandlers(url);},300);
            map.set('isloading','NO');
        };
    };
});

function newaddGeoJsonToMap(url){
    if(geojson){
        geojson.getSource().clear();
        map.removeLayer(geojson);
    }
    var style = new ol.style.Style({
        stroke: new ol.style.Stroke({
            color:'#FFFF00',
            width:3
        }),
        image: new ol.style.Circle({
            radius:7,
            fill: new ol.style.Fill({
                color: '#FFFF00',
            })
        })
    })

    geojson = new ol.layer.Vector({
        source: new ol.source.Vector({
            url:url,
            format: new ol.format.GeoJSON()
        }),
        style: style,
    });
    geojson.getSource().on('addfeature',function(){
        map.getView().fit(
            geojson.getSource().getExtent(),
            {duration: 1590, size: map.getSize(), maxZoom: 21}   
        );
    });
    map.addLayer(geojson);
};
function newpopulateQueryTable(url){
    if(typeof attributePanel !== 'undefined'){
        if(attributePanel.parentElement !== null){
            attributePanel.close();
        }
    }
    $.getJSON(url,function(data){
        var col = [];
        col.push('id');
        for(var i=0;i<data.features.length;i++){
            for(var key in data.features[i].properties){
                if(col.indexOf(key) === -1){
                    col.push(key);
                }
            }
        }
        var table = document.createElement('table');


        table.setAttribute("class","table table-bordered table-hover table-condensed");
        table.setAttribute('id','attQryTable');


        var tr= table.insertRow(-1);

        for(var i=0; i<col.length;i++){
            var th = document.createElement("th");
            th.innerHTML = col[i];
            tr.appendChild(th);
        }

        for(var i=0; i<data.features.length;i++){
            tr=table.insertRow(-1);
            for(var j=0;j<col.length;j++){
                var tabCell = tr.insertCell(-1);
                if(j==0){
                    tabCell.innerHTML = data.features[i]['id'];
                }else{
                    tabCell.innerHTML = data.features[i].properties[col[j]];
                }
            }
        }
        var tabDiv = document.getElementById('attListDiv');
        var deltab = document.getElementById('attQrytable');
        if(deltab){
            tabDiv.removeChild(deltab);
        }
        tabDiv.appendChild(table);
        document.getElementById('attListDiv').style.display ='block';
    });
    var highlightStyle = new ol.style.Style({
        fill: new ol.style.Fill({
            color:'rgba(255,0,255,0.3)',
        }),
        stroke: new ol.style.Stroke({
            color: '#FF00FF',
            width: 3,
        }),
        image: new ol.style.Circle({
            radius:10,
            fill: new ol.style.Fill({
                color:'#FF00FF',
            })
        })
    });
    featureOverlay = new ol.layer.Vector({
        source: new ol.source.Vector(),
        map:map,
        style: highlightStyle
    })
};
function newaddRowHandlers(){
    var table = document.getElementById('attQryTable');
    var rows = document.getElementById('attQryTable').rows;
    var heads = table.getElementsByTagName('th');
    var col_no;
    for(var i = 0; i < heads.length;i++){
        var head = heads[i];
        if(head.innerHTML=='id'){
            col_no = i+1;
        }
    }
    for(i = 0;i < rows.length ;i++){
        rows[i].onclick = function(){
            return function(){
                featureOverlay.getSource().clear();
                $(function(){
                    $('#attQryTable td').each(function(){
                        $(this).parent("tr").css("background-color",'white');
                    })
                })
                var cell = this.cells[col_no - 1];
                var id = cell.innerHTML;
                $(function(){
                    $("#attQryTable td:nth-child(" + col_no + ")").each(function(){
                        if($(this).text() == id){
                            $(this).parent("tr").css("background-color","#d1d8e2");
                        }
                    });
                });
                var features = geojson.getSource().getFeatures();

                for(i=0;i < features.length;i++){
                    if(features[i].getId()==id){
                        featureOverlay.getSource().addFeature(features[i]);

                        featureOverlay.getSource().on('addfeature',function(){
                            map.getView().fit(
                                featureOverlay.getSource().getExtent(),
                                {duration: 1590,size: map.getSize(), maxZoom:24}
                            )
                        })
                    }
                }
            }
        }(rows[i]);
    }
}



