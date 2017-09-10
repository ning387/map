/**
 * Created by Ning on 2017/3/15.
 */
window.N={};

N.amapGeocoder= new AMap.Geocoder({
    radius:0
});

N.geolocation = new AMap.Geolocation({
    enableHighAccuracy: true,//是否使用高精度定位，默认:true
    timeout: 10000,          //超过10秒后停止定位，默认：无穷大
    maximumAge: 0,           //定位结果缓存0毫秒，默认：0
    convert: true,           //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
    showButton: true,        //显示定位按钮，默认：true
    buttonPosition: 'LB',    //定位按钮停靠位置，默认：'LB'，左下角
    buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
    showMarker: true,        //定位成功后在定位到的位置显示点标记，默认：true
    showCircle: true,        //定位成功后用圆圈表示定位精度范围，默认：true
    panToLocation: true,     //定位成功后将定位到的位置作为地图中心点，默认：true
    zoomToAccuracy:true      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
});

N.options={
    provider:{
        baidu:{key:"baidu",name:"百度"},
        gaode:{key:"gaode",name:"高德"},
        google:{key:"google",name:"谷歌"},
        tencent:{key:"tencent",name:"腾迅"},
        googleEarth:{key:"googleEarth",name:"谷歌地球"}
    }
}
N.map={
    map:{},
    init:function (clickHandler,markerClickHandler) {
        this.model=N.model;
        this.clickHandler=clickHandler;
        this.markerClickHandler=markerClickHandler;
        _.docWork();
        var that=this;
        $("#zoomInBtn").click(function () {
            that.curMap.zoomIn();
        })
        $("#zoomOutBtn").click(function () {
            that.curMap.zoomOut();
        })

        $(".m-mapTypeController .mapType").click(function () {
            that.curMap.setMapType($(this).data("type"));
        })
    },
    initMap:function (key) {
        var that=this,map;
        this.map[key]={};
        this.map[key]["key"]=key;
        this.map[key]["markers"]={};
        this.map[key]["mapContainerId"]=this.getMapId(key);

        if (key == N.options.provider.gaode.key) {
            this.map[key]["map"]=map=new AMap.Map(this.getMapId(key));
            this.map[key]["createMarker"]=this.createMarkerByAMap;
            this.map[key]["showInfoWindow"]=this.showInfoWindowByAMap;
            this.map[key]["infoWindow"]=new AMap.InfoWindow({size:new AMap.Size(400,340),offset:new AMap.Pixel(0,-15)});
            this.map[key]["clearMap"]=function () {
                map.clearMap();
                map["markers"]={};
            };
            this.map[key]["closeInfoWindow"]=function () {
                that.map[key]["infoWindow"].close();
            }
            this.map[key]["removeById"]=function (id) {
                if(_.isArray(id)){
                    id.forEach(function (item) {
                        that.map[key]["removeById"](item);
                    })
                }
                else{
                    var marker=that.map[key]["markers"][id];
                    if(marker){
                        marker.hide();
                        delete that.map[key]["markers"][id];
                    }
                }

            }
            this.map[key]["zoomIn"]=function () {
                that.map[key]["map"].zoomIn();
            };
            this.map[key]["zoomOut"]=function () {
                that.map[key]["map"].zoomOut();
            };
            this.map[key]["getZoom"]=function () {
                return that.map[key]["map"].getZoom();
            };

            this.map[key]["mapType"]={};
            this.map[key]["mapType"]["sate"]=[new AMap.TileLayer.Satellite()];
            this.map[key]["mapType"]["admin"]=[new AMap.TileLayer()];
            this.map[key]["setMapType"]=function (type) {
                that.map[key]["map"].setLayers(that.map[key]["mapType"][type])
            }

            AMap.event.addListener(map, "click", function (e) {
                that.clickHandler(e.lnglat.lat,e.lnglat.lng,key);
            });
            AMap.event.addListener(map, "zoomend", function () {
                that.onZoomEnd(that.map[key]["map"].getZoom());
            });

            this.map[key].setZoomAndCenter=function (lat,lng,zoom) {
                if(zoom==null)
                    that.map[key]["map"].setCenter(new AMap.LngLat(lng,lat));
                else
                    that.map[key]["map"].setZoomAndCenter(zoom,new AMap.LngLat(lng,lat));
            }

            this.map[key].getZoomAndCenter=function () {
                var c=that.map[key]["map"].getCenter();
                return [c.lat,c.lng,that.map[key]["map"].getZoom()];
            }
        }
        else if(key == N.options.provider.baidu.key){
            this.map[key]["map"]= map=new BMap.Map(this.getMapId(key));
            this.map[key]["createMarker"]=this.createMarkerByBMap;
            this.map[key]["showInfoWindow"]=this.showInfoWindowByBMap;
            this.map[key]["infoWindow"]=new BMap.InfoWindow("",{width : 400, height: 340,title : "",offset:new BMap.Size(-3,0)});
            this.map[key]["map"].addEventListener("click", function(e){
                if(e.overlay&&e.overlay.extData)
                    return;
                that.clickHandler(e.point.lat,e.point.lng,key);
            });
            this.map[key].setZoomAndCenter=function (lat,lng,zoom) {
                if(zoom==null)
                    that.map[key]["map"].setCenter(new BMap.Point(lng, lat));
                else
                    that.map[key]["map"].centerAndZoom(new BMap.Point(lng, lat), zoom+1);
            }

            this.map[key].getZoomAndCenter=function (){
                var c=that.map[key]["map"].getCenter();
                return [c.lat,c.lng,that.map[key].getZoom()-1];
            }
            this.map[key]["clearMap"]=function () {
                map.clearOverlays();
                map["markers"]={};
            }
            this.map[key]["removeById"]=function (id) {
                if(_.isArray(id))
                    id.forEach(function (item) {
                        that.map[key]["removeById"](item);
                    })
                else{
                    var marker=that.map[key]["markers"][item];
                    if(marker){
                        marker.hide();
                        delete that.map[key]["markers"][item];
                    }
                }
            }
            this.map[key]["closeInfoWindow"]=function () {
                that.map[key]["map"].closeInfoWindow();
            }

            this.map[key]["zoomIn"]=function () {
                that.map[key]["map"].zoomIn();
            };
            this.map[key]["zoomOut"]=function () {
                that.map[key]["map"].zoomOut();
            };
            this.map[key]["getZoom"]=function () {
                return that.map[key]["map"].getZoom();
            };

            this.map[key]["mapType"]={};
            this.map[key]["mapType"]["sate"]=BMAP_SATELLITE_MAP;
            this.map[key]["mapType"]["admin"]=BMAP_NORMAL_MAP;
            this.map[key]["setMapType"]=function (type) {
                that.map[key]["map"].setMapType(that.map[key]["mapType"][type]);
            }
            this.map[key]["map"].addEventListener("zoomend", function(){
                that.onZoomEnd(that.map[key]["map"].getZoom()-1);
            });


            map.enableScrollWheelZoom();//启动鼠标滚轮缩放地图
            map.enableKeyboard();//启动键盘操作地图
          //  map.disableContinuousZoom();
        }
        else if(key == N.options.provider.google.key){
            // this.map[key]["map"]=map= new google.maps.Map(document.getElementById(this.getMapId(key)), {
            //     center: {lat: 27, lng: 120},
            //     scrollwheel: true,
            //     zoom: 8
            // });
            // this.map[key]["createMarker"]=this.createMarkerByGMap;
            // this.map[key]["showInfoWindow"]=this.showInfoWindowByGMap;
            // this.map[key]["infoWindow"]=new google.maps.InfoWindow(new google.maps.InfoWindowOptions({pixelOffset:new google.maps.Size(0,-15)}));
            // this.map[key]["clearMap"]=function () {
            //     map.clearMap();
            //     map["markers"]={};
            // };
            // this.map[key]["closeInfoWindow"]=function () {
            //     that.map[key]["infoWindow"].close();
            // }
            // this.map[key]["removeById"]=function (id) {
            //     var marker=that.map[key]["markers"][id];
            //     if(marker){
            //         marker.hide();
            //         delete that.map[key]["markers"][id];
            //     }
            // }
            // this.map[key]["zoomIn"]=function () {
            //     that.map[key]["map"].zoomIn();
            // };
            // this.map[key]["zoomOut"]=function () {
            //     that.map[key]["map"].zoomOut();
            // };
            // this.map[key]["getZoom"]=function () {
            //     return that.map[key]["map"].getZoom();
            // };
            //
            // this.map[key]["mapType"]={};
            // this.map[key]["mapType"]["sate"]=[new AMap.TileLayer.Satellite()];
            // this.map[key]["mapType"]["admin"]=[new AMap.TileLayer()];
            // this.map[key]["setMapType"]=function (type) {
            //     that.map[key]["map"].setLayers(that.map[key]["mapType"][type])
            // }
            //
            // this.map[key]["map"].addListener(map, "click", function (e) {
            //     that.clickHandler(e.lnglat.lat,e.lnglat.lng,key);
            // });
            // this.map[key]["map"].addListener(map, "zoomend", function () {
            //     that.onZoomEnd(that.map[key]["map"].getZoom());
            // });
            //
            // this.map[key].setZoomAndCenter=function (lat,lng,zoom) {
            //     that.map[key]["map"].setCenter(new google.maps.LatLng(lat,lng));
            //     if(arguments.length==3)
            //         that.map[key]["map"].setZoom(zoom);
            // }
            //
            // this.map[key].getZoomAndCenter=function () {
            //     var c=that.map[key]["map"].getCenter();
            //     return [c.lat,c.lng,that.map[key]["map"].getZoom()];
            // }
        }
        this.map[key].setZoomAndCenter(N.model.curCenter[0],N.model.curCenter[1],N.model.curCenter[2]);

    },
    clearMap:function () {
        if(this.curMap!=null){
            this.curMap.clearMap();
            this.curMap.closeInfoWindow();
        }
    },
    onZoomEnd:function (zoom) {
        $(".m-mapZoomController span").text(zoom+"级");
    },
    showMap:function (key) {
        var that=this;
        if(this.curMap!=null){
            if(this.curMap["key"]==key)
                return;
            var latlng=this.curMap.getZoomAndCenter();
            var templatlng=N.utils.getLatlng(latlng[0],latlng[1],this.curMap["key"],key);
            N.model.curCenter=[templatlng.lat,templatlng.lng,latlng[2]];
            $("#"+this.curMap.mapContainerId).hide();
        }
        $("#"+this.getMapId(key)).show();
        this.initMap(key);
        this.curMap=this.map[key];
        $("#"+this.curMap.mapContainerId).show();
        this.setZoomAndCenter(N.model.curCenter);
        this.curMap.clearMap();
        this.redraw();
    },

    redraw:function () {
        this.curMap.clearMap();
        var  that=this;
        var data=N.model.data;
        if(data){
            data.forEach(function (item) {
                that.showOneMarker(item,true);
            })
        }
    },
    getMapId:function (key) {
        return key+"-mapContainer";
    },

    /**
     * 展示一个marker
     * @param data {locations:{"gaode":{lat,lng},"baidu":{lat,lng},...},formattedAddress}
     */
    showOneMarker:function (geocode,hidePopup) {
        if(geocode==null)
            return;
        var name,latlng=geocode.locations[this.curMap.key];
        if(N.model.showName)
            name=geocode.addressComponent.street==""||geocode.addressComponent.streetNumber==""?geocode.formattedAddress:geocode.addressComponent.street+geocode.addressComponent.streetNumber;
        this.model.curMarker=this.createMarker(latlng.lat, latlng.lng,this.curMap.map,name,geocode);
        if(!hidePopup){
            this.showInfoWindowByData(geocode);
        }
    },

    showInfoWindowByData:function (data) {
        var latlng=data.locations[this.curMap.key];
        var content=N.utils.getFormatContent(data.formattedAddress,data.locations,data.id);
        this.showInfoWindow(content,latlng.lat,latlng.lng,this.curMap);
    },

    showInfoWindow:function (content,lat,lng,mapOptions) {
        if(this.curMap!=null)
            return this.curMap.showInfoWindow(content,lat,lng,mapOptions);
        else
            return null;
    },
    closeInfoWindow:function () {
        if(this.curMap!=null)
            this.curMap.closeInfoWindow();
    },
    createMarker:function (lat,lng,map,name,data) {
        if(this.curMap!=null){
            var marker=this.curMap.createMarker(lat,lng,map,name,data);
            this.curMap["markers"][data.id]=marker;
            return marker;
        }
        else
            return null;
    },

    createMarkerByAMap:function (lat,lng,map,name,data) {
        var icon = new AMap.Icon({
                image : '/resource/image/mark_bs.png',//24px*24px
                size : new AMap.Size(24,33)})
        var marker=new AMap.Marker({
            icon:icon,
            position: [lng, lat],
            content:name?_.template(N.model.markerTemplate)({name:name}):name,
            map: map,
            extData:data
        })
        var that=this;
        marker.on("click",function (e) {
            N.map.markerClickHandler(e.target.G.extData);
        })
        return marker;
    },
    createMarkerByBMap:function (lat,lng,map,name,data) {
        var myIcon = new BMap.Icon("/resource/image/mark_bs.png", new BMap.Size(24, 33));
        var marker = new BMap.Marker(new BMap.Point(lng, lat),{icon: myIcon});
        map.addOverlay(marker);
        marker.extData=data;
        if(name){
            var w=-1*(name.length*10>150?150:name.length*10)/2-15;
            var label=new BMap.Label(name,{offset:new BMap.Size(w, 20),position:new BMap.Point(lng, lat)});
            label.setStyle({fontFamily: "Microsoft YaHei",
                border:"1px solid #B3AB96",display:"inline-block",maxWidth:"150px",
                overflow:"hidden",fontSize:"12px",
                textOverflow:"ellipsis",
                whiteSpace: "nowrap",
                backgroundColor:"#0099FF",color:" #FFF",padding:"3px 5px",borderRadius:"4px"})
            map.addOverlay(label);
        }
        marker.addEventListener("click", function(e){
            N.map.markerClickHandler(e.target.extData);
        })

        return {map:map,
                 marker:marker,
                 label:label,
                 hide:function(){
                     this.map.removeOverlay(this.marker);
                     if(this.label)
                        this.map.removeOverlay(this.label);
                 }};
    },
    createMarkerByGMap:function (lat,lng,map,name,data) {
        var icon = new google.maps.Icon({
            image : '/resource/image/mark_bs.png',//24px*24px
            size : new google.maps.Size(24,33)})

        var label=new google.maps.MarkerLabel({text:name});

        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(lat, lng),
            map: map,
            icon:icon,
            label:label
        });

        marker.extData=data;
        marker.addListener("click",function (e) {
            N.map.markerClickHandler();
        })
        return marker;
    },
    showInfoWindowByAMap:function (content,lat,lng,mapOptions) {
        var infoWindow= mapOptions["infoWindow"];
        infoWindow.setContent(content);
        infoWindow.open(mapOptions["map"],new AMap.LngLat(lng,lat));
    },
    showInfoWindowByBMap:function (content,lat,lng,mapOptions) {
        var infoWindow= mapOptions["infoWindow"];
        infoWindow.setContent(content);
        mapOptions["map"].openInfoWindow(infoWindow, new BMap.Point(lng, lat));
    },
    showInfoWindowByGMap:function (content,lat,lng,mapOptions) {
        var infoWindow= mapOptions["infoWindow"];
        infoWindow.setContent(content);
        infoWindow.open(mapOptions["map"],new google.maps.LatLng(lat,lng));
    },
    setZoomAndCenter:function (lat,lng,zoom) {
        if(this.curMap!=null){
              if(_.isArray(lat)){
                  lng=lat[1];
                  zoom=lat[2];
                  lat=lat[0];
              }
              this.curMap.setZoomAndCenter(lat,lng,zoom);
        }
    },
    removeById:function (id) {
        if(this.curMap)
           this.curMap.removeById(id);
    },
}

window.N.main={
    init:function () {
        var that=this;
        this.amapGeocoder=N.amapGeocoder;
        N.map.init();
        N.map.clickHandler=function (lat,lng,curkey) {
            var latlngs=N.utils.getAllLatlng(lat,lng,curkey);
            curkey="gaode";
            that.getAddress({lat:latlngs[curkey].lat,lng:latlngs[curkey].lng},curkey,function (result) {
                result.regeocode.locations=latlngs;
                result.regeocode.id=_.uniqueId();
                if(N.model.mode==0){
                    N.map.clearMap();
                    N.model.clearData();
                }

                N.map.showOneMarker(result.regeocode);
                N.model.pushData(result.regeocode);
                that.showListAction(result.regeocode);
            })
        };
        N.map.markerClickHandler=function (data) {
            N.map.showInfoWindowByData(data);
            that.showListAction(data);
        };

        $("#searchInput").keydown(function(event) {
            if (event.keyCode == 13) {
                that.showLocation($("#searchInput").val());
            }
        })

        $("#searchBtn").click(function () {
            that.showLocation($("#searchInput").val());
        });

        //实例化Autocomplete
        var autoOptions = {
            city: "", //城市，默认全国
            input:"searchInput"//使用联想输入的input的id
        };
        this.autocomplete= new AMap.Autocomplete(autoOptions);
        AMap.event.addListener(this.autocomplete, "select", function (e){
            // $("#searchInput").val(e.poi.name);
            // that.getAddress(e.poi.location,function (result) {
            //     result.regeocode.location=e.poi.location;
            // })
            that.showLocation(e.poi.name);
        });

        $(document).ready(function(){
            $("#remember-btn,#name-btn").iCheck({
                checkboxClass: 'icheckbox_square-blue',
                radioClass: 'iradio_square-blue',
                increaseArea: '20%' // optional
            });
        });
        $("#providerBar .j-swBtn").click(function () {
            N.map.showMap($(this).data("value"));
        });
        $(".m-mapContainer").hide();

        N.geolocation.getCityInfo(function (status,result) {
            if(result){
                N.model.curCenter=[result.center[1],result.center[0],13];
            }
            $("#providerBar .j-swBtn:first").click();
        })

        $("#remember-btn").on('ifChanged', function(event){
            N.model.mode=$(this).prop("checked")?1:0;
            $("#sSide,#mSide").toggle();

            if(!N.model.mode)
               that.clear();
        });

        $("#name-btn").on('ifChanged', function(event){
            N.model.showName=$(this).prop("checked");
            N.map.redraw();
        });

        $(".m-markerTableC").css("height",($(window).height()-240)+"px");

        $("#favoriteBtn").click(function () {
           _.addFavorite();
        });

        $(document).on("click",".j-selTable tbody tr",function () {
            var id=$(this).data("id");
            var o=_.find(N.model.data,function (item) {
                return item.id==id;
            })
            N.map.showInfoWindowByData(o);
            N.map.setZoomAndCenter(o["locations"][N.map.curMap["key"]]["lat"],o["locations"][N.map.curMap["key"]]["lng"]);
        });

        $(document).on("click","#clearBtn",function (event) {
            var ids=[];
            $(".j-selTable tbody tr td:first-child input[type='checkbox']:checked").each(function () {
                ids.push(String($(this).parent().parent().data("id")));
            })
            N.map.removeById(ids);
            N.map.closeInfoWindow();
            N.model.removeById(ids);

            event.stopPropagation();
        });


        // $("#clearBtn").click(function () {
        //     bootbox.confirm("您确定要清空地图上的标记点吗?", function(result){
        //         if(result)
        //             that.clear();
        //     });
        // })
        bootbox.setLocale("zh_CN");

        $("#latlngTypeSelect li").click(function () {
            $("#latlngTypeBtn").html(_.template($("#inputMapTypeBtn").html())({name:$(this).data("log")}));
            $("#latlngTypeBtn").attr("data-value",$(this).data("value"));
        })

        $("#inputLatlngSearchBtn").click(function () {
            N.map.clickHandler(Number($("#inputLat").val()),Number($("#inputLng").val()),$("#latlngTypeBtn").attr("data-value"))
        });
    },

    clickDelPopupBtn:function (id) {
        N.map.removeById(id);
        N.map.closeInfoWindow();
        N.model.removeById(id);
    },

    showListAction:function (data) {
        var a=$(_.strFormat(".j-selTable tbody tr[data-id={0}]",data.id));
        a.siblings().removeClass("z-sel");
        a.addClass("z-sel");
    },

    /**
     * 展示地址
     * @param address
     */
    showLocation:function (address) {
        var that=this;
        this.getLocationByAddress(address,function(result){
            result.geocodes[0].locations=N.utils.getAllLatlng(result.geocodes[0].location["lat"],result.geocodes[0].location["lng"],"gaode");
            result.geocodes[0].id=_.uniqueId();
            if(N.model.mode==0){
                N.map.clearMap();
                N.model.clearData();
            }
            N.map.showOneMarker(result.geocodes[0]);
            N.model.pushData(result.geocodes[0]);
            that.showListAction(result.geocodes[0]);
        });
    },
    /**
     * 根据地址获取经纬
     * @param address
     * @param callback
     */
    getLocationByAddress:function (address,callback) {
        this.amapGeocoder.getLocation(address, function(status, result) {
            if (status === 'complete' && result.info === 'OK') {
                callback(result)
            }else{
                //获取经纬度失败
            }
        });
    },
    /**
     * 根据经纬获取地址
     * @param latlng
     * @param callback
     */
    getAddress:function (latlng,fromType,callback) {
        latlng=N.utils.getLatlng(latlng.lat,latlng.lng,fromType,"gaode");
        this.amapGeocoder.getAddress(new AMap.LngLat(latlng.lng,latlng.lat), function(status, result) {
            if (status === 'complete' && result.info === 'OK') {
                callback(result);
            }else{
                //获取地址失败
            }
        });
    },
    clear:function () {
        N.map.clearMap();
        N.model.clearData();
    }
}
N.utils={
    getFormatContent:function (title,latlngs,id) {
        var model=N.model;
        var tbody="";
        for(var o in latlngs)
        {
            tbody+=_.template(model.poitbodyTemplate)({name:N.options.provider[o]["name"],lat:Number(latlngs[o]["lat"]).toFixed(9),lng:Number(latlngs[o]["lng"]).toFixed(9)});
        }
        return _.template(model.poiTemplate)({title:title,tbody:tbody,id:id});;
    },
    getAllLatlng:function (lat,lng,fromType) {
        var provider=N.options.provider;
        var result={};
        for(var s in provider)
        {
            result[provider[s]["key"]]=N.utils.getLatlng(lat,lng,fromType,provider[s]["key"]);
        }
        return result;
    },
    /**
     * 经纬度转换
     * @param latlng
     * @param fromType
     * @param toType
     */
    getLatlng:function (lat,lng,fromType,toType) {
        var latlon;
        var provider=N.options.provider;
        if(toType==provider.gaode.key||toType==provider.tencent.key||toType==provider.google.key){
            if(fromType==provider.gaode.key||fromType==provider.tencent.key||fromType==provider.google.key)
                return {lat:lat,lng:lng};
            else if(fromType==provider.baidu.key){
                latlon= GPS.bd_decrypt(lat,lng);
                return {lat:latlon.lat,lng:latlon.lon};
            }
            else if(fromType==provider.googleEarth.key){
                latlon= GPS.gcj_encrypt(lat,lng);
                return {lat:latlon.lat,lng:latlon.lon};
            }
        }
        else if(toType==provider.baidu.key){
            if(fromType==provider.gaode.key||fromType==provider.tencent.key||fromType==provider.google.key){
                latlon= GPS.bd_encrypt(lat,lng);
                return {lat:latlon.lat,lng:latlon.lon};
            }
            else if(fromType==provider.baidu.key){
                return {lat:lat,lng:lng};
            }
            else if(fromType==provider.googleEarth.key){
                latlon = GPS.gcj_encrypt(lat,lng);
                latlon = GPS.bd_encrypt(latlon.lat,latlon.lon);
                return {lat:latlon.lat,lng:latlon.lon};
            }
        }
        else if(toType==provider.googleEarth.key){
            if(fromType==provider.gaode.key||fromType==provider.tencent.key||fromType==provider.google.key){
                latlon= GPS.gcj_decrypt_exact(lat,lng);
                return {lat:latlon.lat,lng:latlon.lon};
            }
            else if(fromType==provider.baidu.key){
                latlon = GPS.bd_decrypt(lat,lng);
                latlon = GPS.gcj_decrypt_exact(latlon.lat,latlon.lon);
                return {lat:latlon.lat,lng:latlon.lon};
            }
            else if(fromType==provider.googleEarth.key){
                return {lat:lat,lng:lng};
            }
        }
    }
}

N.model={
    curCenter:[],
    curMap:null,
    curMarker:null,
    clearData:function () {
        this.data=[];
        if(this.updateCallback)
            this.updateCallback(this.data);
    },
    pushData:function (item) {
        this.data.push(item);
        if(this.updateCallback)
            this.updateCallback(this.data);
    },
    removeById:function (id) {
        this.data=_.filter(this.data,function (item) {
            return _.isArray(id)?id.indexOf(item.id)==-1:item.id!=id;
        })
        if(this.updateCallback)
            this.updateCallback(this.data);
    },
    data:[],
    showName:true,
    mode:0,  //0：单个模式 1：多个模式
    poiTemplate:'<div class="m-poibox" data-id="<%=id%>">' +
                      '<div class="poi-title"><%=title%></div>' +
                      '<table class="table table-hover">' +
                          '<thead>' +
                             '<tr>' +
                               '<th>地图</th>'+
                                '<th>经度</th>'+
                                '<th>纬度</th>'+
                             '</tr>' +
                          '</thead>' +
                          '<tbody>' +
                             '<%=tbody%>'+
                          '</tbody>'+
                       '</table>' +
                      '<a class="btn btn-warning" onclick="N.main.clickDelPopupBtn(\'<%=id%>\')">' +
                        '<i class="icon-trash icon-large"></i> 删除' +
                      '</a>'+
                  '</div>',
    poitbodyTemplate:'<tr><td><%=name%></td><td><%=lng%></td><td><%=lat%></td></tr>',
    markerTemplate:'<div class="u-marker"><div><img src="/resource/image/mark_bs.png"></div><div><span class="f-toe"><%=name%></span></div></div>'
}

N.model.updateCallback=function (data) {
    var s="",address;
    data.forEach(function (item) {
        address=//item.geocode.addressComponent.street==""||item.geocode.addressComponent.streetNumber==""?
            item.formattedAddress;
           // :item.geocode.addressComponent.city+item.geocode.addressComponent.district+item.geocode.addressComponent.street+item.geocode.addressComponent.streetNumber;
        s+=_.template($("#markerListItem").html())({name:address,id:item.id,lat:Number(item.locations.googleEarth.lat).toFixed(5),lng:Number(item.locations.googleEarth.lng).toFixed(5)});
    })
    $(".j-selTable tbody").html(s);

}


var GPS = {
    PI : 3.14159265358979324,
    x_pi : 3.14159265358979324 * 3000.0 / 180.0,
    delta : function (lat, lon) {
        // Krasovsky 1940
        //
        // a = 6378245.0, 1/f = 298.3
        // b = a * (1 - f)
        // ee = (a^2 - b^2) / a^2;
        var a = 6378245.0; //  a: 卫星椭球坐标投影到平面地图坐标系的投影因子。
        var ee = 0.00669342162296594323; //  ee: 椭球的偏心率。
        var dLat = this.transformLat(lon - 105.0, lat - 35.0);
        var dLon = this.transformLon(lon - 105.0, lat - 35.0);
        var radLat = lat / 180.0 * this.PI;
        var magic = Math.sin(radLat);
        magic = 1 - ee * magic * magic;
        var sqrtMagic = Math.sqrt(magic);
        dLat = (dLat * 180.0) / ((a * (1 - ee)) / (magic * sqrtMagic) * this.PI);
        dLon = (dLon * 180.0) / (a / sqrtMagic * Math.cos(radLat) * this.PI);
        return {'lat': dLat, 'lon': dLon};
    },

    //WGS-84 to GCJ-02
    gcj_encrypt : function (wgsLat, wgsLon) {
        if (this.outOfChina(wgsLat, wgsLon))
            return {'lat': wgsLat, 'lon': wgsLon};

        var d = this.delta(wgsLat, wgsLon);
        return {'lat' : wgsLat + d.lat,'lon' : wgsLon + d.lon};
    },
    //GCJ-02 to WGS-84
    gcj_decrypt : function (gcjLat, gcjLon) {
        if (this.outOfChina(gcjLat, gcjLon))
            return {'lat': gcjLat, 'lon': gcjLon};

        var d = this.delta(gcjLat, gcjLon);
        return {'lat': gcjLat - d.lat, 'lon': gcjLon - d.lon};
    },
    //GCJ-02 to WGS-84 exactly
    gcj_decrypt_exact : function (gcjLat, gcjLon) {
        var initDelta = 0.01;
        var threshold = 0.000000001;
        var dLat = initDelta, dLon = initDelta;
        var mLat = gcjLat - dLat, mLon = gcjLon - dLon;
        var pLat = gcjLat + dLat, pLon = gcjLon + dLon;
        var wgsLat, wgsLon, i = 0;
        while (1) {
            wgsLat = (mLat + pLat) / 2;
            wgsLon = (mLon + pLon) / 2;
            var tmp = this.gcj_encrypt(wgsLat, wgsLon)
            dLat = tmp.lat - gcjLat;
            dLon = tmp.lon - gcjLon;
            if ((Math.abs(dLat) < threshold) && (Math.abs(dLon) < threshold))
                break;

            if (dLat > 0) pLat = wgsLat; else mLat = wgsLat;
            if (dLon > 0) pLon = wgsLon; else mLon = wgsLon;

            if (++i > 10000) break;
        }
        //console.log(i);
        return {'lat': wgsLat, 'lon': wgsLon};
    },
    //GCJ-02 to BD-09
    bd_encrypt : function (gcjLat, gcjLon) {
        var x = gcjLon, y = gcjLat;
        var z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * this.x_pi);
        var theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * this.x_pi);
        var bdLon = z * Math.cos(theta) + 0.0065;
        var bdLat = z * Math.sin(theta) + 0.006;
        return {'lat' : bdLat,'lon' : bdLon};
    },
    //BD-09 to GCJ-02
    bd_decrypt : function (bdLat, bdLon) {
        var x = bdLon - 0.0065, y = bdLat - 0.006;
        var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * this.x_pi);
        var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * this.x_pi);
        var gcjLon = z * Math.cos(theta);
        var gcjLat = z * Math.sin(theta);
        return {'lat' : gcjLat, 'lon' : gcjLon};
    },
    //WGS-84 to Web mercator
    //mercatorLat -> y mercatorLon -> x
    mercator_encrypt : function(wgsLat, wgsLon) {
        var x = wgsLon * 20037508.34 / 180.;
        var y = Math.log(Math.tan((90. + wgsLat) * this.PI / 360.)) / (this.PI / 180.);
        y = y * 20037508.34 / 180.;
        return {'lat' : y, 'lon' : x};
        /*
         if ((Math.abs(wgsLon) > 180 || Math.abs(wgsLat) > 90))
         return null;
         var x = 6378137.0 * wgsLon * 0.017453292519943295;
         var a = wgsLat * 0.017453292519943295;
         var y = 3189068.5 * Math.log((1.0 + Math.sin(a)) / (1.0 - Math.sin(a)));
         return {'lat' : y, 'lon' : x};
         //*/
    },
    // Web mercator to WGS-84
    // mercatorLat -> y mercatorLon -> x
    mercator_decrypt : function(mercatorLat, mercatorLon) {
        var x = mercatorLon / 20037508.34 * 180.;
        var y = mercatorLat / 20037508.34 * 180.;
        y = 180 / this.PI * (2 * Math.atan(Math.exp(y * this.PI / 180.)) - this.PI / 2);
        return {'lat' : y, 'lon' : x};
        /*
         if (Math.abs(mercatorLon) < 180 && Math.abs(mercatorLat) < 90)
         return null;
         if ((Math.abs(mercatorLon) > 20037508.3427892) || (Math.abs(mercatorLat) > 20037508.3427892))
         return null;
         var a = mercatorLon / 6378137.0 * 57.295779513082323;
         var x = a - (Math.floor(((a + 180.0) / 360.0)) * 360.0);
         var y = (1.5707963267948966 - (2.0 * Math.atan(Math.exp((-1.0 * mercatorLat) / 6378137.0)))) * 57.295779513082323;
         return {'lat' : y, 'lon' : x};
         //*/
    },
    // two point's distance
    distance : function (latA, lonA, latB, lonB) {
        var earthR = 6371000.;
        var x = Math.cos(latA * this.PI / 180.) * Math.cos(latB * this.PI / 180.) * Math.cos((lonA - lonB) * this.PI / 180);
        var y = Math.sin(latA * this.PI / 180.) * Math.sin(latB * this.PI / 180.);
        var s = x + y;
        if (s > 1) s = 1;
        if (s < -1) s = -1;
        var alpha = Math.acos(s);
        var distance = alpha * earthR;
        return distance;
    },
    outOfChina : function (lat, lon) {
        if (lon < 72.004 || lon > 137.8347)
            return true;
        if (lat < 0.8293 || lat > 55.8271)
            return true;
        return false;
    },
    transformLat : function (x, y) {
        var ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x));
        ret += (20.0 * Math.sin(6.0 * x * this.PI) + 20.0 * Math.sin(2.0 * x * this.PI)) * 2.0 / 3.0;
        ret += (20.0 * Math.sin(y * this.PI) + 40.0 * Math.sin(y / 3.0 * this.PI)) * 2.0 / 3.0;
        ret += (160.0 * Math.sin(y / 12.0 * this.PI) + 320 * Math.sin(y * this.PI / 30.0)) * 2.0 / 3.0;
        return ret;
    },
    transformLon : function (x, y) {
        var ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x));
        ret += (20.0 * Math.sin(6.0 * x * this.PI) + 20.0 * Math.sin(2.0 * x * this.PI)) * 2.0 / 3.0;
        ret += (20.0 * Math.sin(x * this.PI) + 40.0 * Math.sin(x / 3.0 * this.PI)) * 2.0 / 3.0;
        ret += (150.0 * Math.sin(x / 12.0 * this.PI) + 300.0 * Math.sin(x / 30.0 * this.PI)) * 2.0 / 3.0;
        return ret;
    }
};
