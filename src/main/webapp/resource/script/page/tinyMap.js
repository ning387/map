/**
 * Created by Ning on 2017/5/8.
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

N.main={
    init:function () {
        var that=this;
        this.map=new AMap.Map("gaode-mapContainer");
        this.amapGeocoder=N.amapGeocoder;
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

        AMap.event.addListener(this.map, "click", function (e) {
            that.clickHandler(e.lnglat.lat,e.lnglat.lng);
        });

        $("#searchInput").keydown(function(event) {
            if (event.keyCode == 13) {
                that.showLocation($("#searchInput").val());
            }
        })
    },
    clickHandler:function (lat,lng) {
        var that = this;
        var curkey="gaode";
        var latlngs = N.utils.getAllLatlng(lat, lng, curkey);
        that.getAddress({lat: latlngs[curkey].lat, lng: latlngs[curkey].lng}, curkey, function (result) {
            result.regeocode.locations = latlngs;
            that.showOneMarker(result.regeocode);
        })
    },
    /**
     * 展示地址
     * @param address
     */
    showLocation:function(address) {
        var that=this;
        this.getLocationByAddress(address,function(result){
            result.geocodes[0].locations=N.utils.getAllLatlng(result.geocodes[0].location["lat"],result.geocodes[0].location["lng"],"gaode");
            result.geocodes[0].id=_.uniqueId();
            that.showOneMarker(result.geocodes[0]);
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
     * 展示一个marker
     * @param data {locations:{"gaode":{lat,lng},"baidu":{lat,lng},...},formattedAddress}
     */
    showOneMarker:function (geocode) {
        if(geocode==null)
            return;

        this.map.clearMap();
        var latlng=geocode.locations["gaode"];

        var icon = new AMap.Icon({
            image : '/resource/image/mark_bs.png',//24px*24px
            size : new AMap.Size(24,33)})
        new AMap.Marker({
            icon:icon,
            position: [latlng.lng, latlng.lat],
            content:"",
            map: this.map,
            extData:geocode
        })
    },
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
N.main.init();