<%--
  Created by IntelliJ IDEA.
  User: Ning
  Date: 2017/3/15
  Time: 21:11
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <title>大象地图_经纬度查询_经纬度地图_经纬度转换_经纬度定位_批量_地名转经纬_经纬转地名</title>
    <meta name="Keywords" content="经纬度查询,经纬度地图,经纬度转换,经纬度定位,地名转经纬度,经纬度转地名,批量经纬查询,经纬度在线查询,高德查经纬">
    <meta name="Description" content="用于经纬度查询的在线经纬度地图,批量经纬度查询工具, 基于高德地图、百度地图、Google地图等经纬查询，实现经纬度定位,地名查询经纬度,经纬度查询地名的功能">
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta http-equiv="Cache-Control" content="no-siteapp">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
    <meta name="format-detection" content="telephone=no,adress=no">
    <meta name="baidu-site-verification" content="3nl8yUXocm" />
    <link href="/favicon.ico" rel="shortcut icon" type="image/x-icon" />
    <link href="/resource/script/libs/bootstrap/css/bootstrap.css" rel="stylesheet"/>
    <link href="/resource/css/reset.css" rel="stylesheet"/>
    <link href="/resource/script/libs/bootstrap/css/buttons.css" rel="stylesheet"/>
    <link href="/resource/script/libs/bootstrap/plugins/font-Awesome/css/font-awesome.min.css" rel="stylesheet">
    <link href="/resource/script/libs/bootstrap/plugins/icheck/skins/all.css?v=1.0.2" rel="stylesheet">
    <link href="/resource/css/index.css" rel="stylesheet"/>
</head>

<body>
    <nav class="g-navBox">
        <ul class="m-menuLeft">
            <li>全国景点经纬度</li>
            <li>全国城市经纬度</li>
            <li>全国乡镇经纬度</li>
            <li>经纬格式转换</li>
        </ul>
        <ul class="m-menuRight">
            <li>反馈意见</li>
            <li>联系我们</li>
            <li>服务协议</li>
        </ul>
    </nav>
    <header class="g-head">
        <div class="m-logo">
            <img src="/resource/image/logo.png">
            <span class="publicity">做最好用的经纬度查询工具</span>
        </div>
        <div class="m-searchBar">
            <div class="m-searchC">
                <input type="text" id="searchInput" class="form-control" placeholder="请输入您要查询的地点">
                <ul class="m-scMenu">
                    <li id="favoriteBtn" class="j-swBtn z-sel"><i class="icon-star icon-large"></i> 收藏</li>
                    <li class="j-swBtn"><i class="icon-book icon-large"></i> 帮助</li>
                    <li class="j-swBtn"><i class="icon-comments icon-large"></i> 加群</li>
                    <li class="j-swBtn"><i class="icon-heart icon-large"></i> 投票</li>
                </ul>
            </div>
            <a id="searchBtn" class="u-searchBtn"><i  class="icon-search icon-2x"></i></a>
        </div>
        <div id="inputlatlng-panel" class="m-inputlatlng">
            <form>
                <div class="form-group f-fl">
                    <div class="input-group">
                        <span class="input-group-addon">纬度:</span>
                        <input type="text" id="inputLat" class="form-control" placeholder="">
                    </div>
                    <div class="input-group">
                        <span class="input-group-addon">经度:</span>
                        <input type="text" id="inputLng"  class="form-control"  placeholder="">
                    </div>
                </div>
                <div class="m-dropdownMenu">
                    <button id="latlngTypeBtn" type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" data-value="googleEarth">GPS <span class="caret"></span></button>
                    <ul id="latlngTypeSelect" class="dropdown-menu">
                        <li data-value="googleEarth" data-log="GPS"><a>经纬数据来自GPS</a></li>
                        <li data-value="gaode" data-log="高德"><a>经纬数据来自高德地图</a></li>
                        <li data-value="baidu" data-log="百度"><a>经纬数据来自百度地图</a></li>
                        <li data-value="google" data-log="谷歌"><a>经纬数据来自Google地图</a></li>
                        <li data-value="tencent" data-log="腾迅"><a>经纬数据来自腾迅地图</a></li>
                    </ul>
                </div>
            </form>
            <span id="inputLatlngSearchBtn" class="u-searchBtn"><i  class="icon-search icon-2x"></i></span>
        </div>
    </header>
    <div id="sSide" class="g-side">
        <nav class="m-menuGroup">
            <div class="m-menuBtn">
                <a class="button  button-circle button-caution" title="批量经纬度转地名"><i class="icon-screenshot icon-large"></i></a>
                <a class="menuBtnlabel" title="批量经纬度转地名">批量经纬度转地名</a>
            </div>
            <div class="m-menuBtn">
                <a class="button  button-circle button-highlight" title="批量地名转经纬度"><i class="icon-random"></i></a>
                <a class="menuBtnlabel" title="批量地名转经纬度">批量地名转经纬度</a>
            </div>
            <div class="m-menuBtn">
                <a class="button  button-circle button-royal" title="批量经纬格式转换"><i class="icon-retweet icon-large"></i></a>
                <a class="menuBtnlabel" title="批量经纬格式转换">批量经纬格式转换</a>
            </div>
        </nav>
        <div class="m-notice popover left">
            <div class="arrow"></div>
            <h3 class="popover-title">公告</h3>
            <div class="popover-content">
                <p style="text-indent:1em;">您好，欢迎来到大象地图。</p>
                <br>
                <p>（1）鼠标左键点击地图，可获取经纬点信息</p>
                <p>（2）地图具备多点记录功能</p>
                <br>
                <p style="float:right">2017-06-09</p>
                <br>
            </div>
        </div>
        <%--<div class="m-ad">--%>
            <%--<a href="https://s.click.taobao.com/66Kviow" target="_blank">--%>
                <%--<img src="/resource/image/ad1.png">--%>
            <%--</a>--%>
            <%--<p class="title"><a href="https://s.click.taobao.com/66Kviow" target="_blank">--%>
                <%--Ipanema 2017新品夏情侣人字拖 巴西男女 夹脚拖鞋夏黑色沙滩鞋</a></p>--%>
            <%--<div class="content">--%>
                <%--<div class="price">--%>
                    <%--<span>￥</span><span>149.00</span><span>月销：1521</span>--%>
                <%--</div>--%>
                <%--<div class="shop">--%>
                    <%--<img src="/resource/image/tianmaoIcon.png">--%>
                    <%--<a href="https://s.click.taobao.com/66Kviow" target="_blank">--%>
                        <%--ipanema旗舰店</a>--%>
                <%--</div>--%>
            <%--</div>--%>
        <%--</div>--%>
    </div>
    <div id="mSide" class="g-side" hidden>
        <ul class="m-scMenu">
            <li class="item"><i class="icon-screenshot icon-large"></i> 批量经纬度查询</li>
            <li class="item"><i class="icon-retweet icon-large"></i> 批量经纬格式转换</li>
        </ul>
        <div class="f-cb">
            <%--<div class="m-ad m-ad-1">--%>
                <%--<a href="https://s.click.taobao.com/t?e=m%3D2%26s%3DlZtDbubAZTUcQipKwQzePDAVflQIoZepK7Vc7tFgwiFRAdhuF14FMe45wh2k1ytilovu%2FCElQOuNpbUO9iYDebJQ9R8qmP5TthBtTAnCmWIEnjbuSOog73Es4zbGlStEcSpj5qSCmbA%3D" target="_blank">--%>
                    <%--<img src="/resource/image/ad5.png">--%>
                <%--</a>--%>
                <%--<p class="title">--%>
                    <%--<a href="https://s.click.taobao.com/t?e=m%3D2%26s%3DlZtDbubAZTUcQipKwQzePDAVflQIoZepK7Vc7tFgwiFRAdhuF14FMe45wh2k1ytilovu%2FCElQOuNpbUO9iYDebJQ9R8qmP5TthBtTAnCmWIEnjbuSOog73Es4zbGlStEcSpj5qSCmbA%3D" target="_blank">--%>
                    <%--回归麻的健康生活--%>
                    <%--</a>--%>
                <%--</p>--%>
                <%--<div class="shop">--%>
                    <%--<img src="/resource/image/tianmaoIcon.png">--%>
                    <%--<a href="https://s.click.taobao.com/t?e=m%3D2%26s%3DPI5bgy%2BjlXIcQipKwQzePCperVdZeJviK7Vc7tFgwiFRAdhuF14FMSFTgn0Gvskq8sviUM61dt2NpbUO9iYDeWuD9cMNkKxsCOQw8iYVaVrJw0oIZJ8qksMOg9KeHwuTRIhXpwzXCM5Pf2BYFhAHdPEYvyG77nqGsd%2B%2Ff4Fhw9b%2BScqIfI2efIxhskxwl8fgqzJmWNATuCvx5NeZiB8woPnbwxf8dPyZAre0qaX4IitK9VItTuH50ml74Tq19%2FO1XDY6hLNiIX3bVRCH%2BLcrbwjHW3cVFfgDPHBAcbKVKyXwq6S2zolgFe8Trg3C96kymSuqx78MO5jJBhLccSvIcanhNMNMFTiuzuscdZC5nUxBbUjYebxGwLmT0znmksroAROFRc23FvlNWYR0D2Fe6IJ9nroFRMncMmeCX2msowQZ8L6SbmLe1NBOMF%2B2xWtUww6D0p4fC5NxKmPmpIKZsA%3D%3D" target="_blank">--%>
                    <%--远港旗舰店--%>
                    <%--</a>--%>
                <%--</div>--%>
            <%--</div>--%>
        </div>
        <div class="u-divider"></div>
        <div class="m-multiBody">
            <div class="m-listBtnGroup">
                <a id="showAllTableBtn" class="button button-rounded  u-button-1"><i class="icon-table icon-large"></i> 展开表格</a>
                <a id="clearBtn" class="button button-rounded  u-button-1"><i class="icon-trash icon-large"></i> 删除</a>
            </div>
            <div class="m-markerTableC">
                <table class="table m-markerTable j-selTable">
                    <thead>
                         <tr>
                             <th><input type="checkbox"></th>
                             <th>地点</th>
                             <th>纬度</th>
                             <th>经度</th>
                         </tr>
                    </thead>
                    <tbody>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    <div class="g-mapNavBox">
        <ul id="providerBar" class="m-mapNav">
            <li class="j-swBtn" data-value="gaode">高德地图</li>
            <li class="j-swBtn" data-value="baidu">百度地图</li>
        </ul>
        <div class="m-choosePanel">
            <input id="remember-btn" type="checkbox" />
            <label for="remember-btn" >多点记录</label>
            <input id="name-btn" type="checkbox" checked="true"  />
            <label for="name-btn">地名</label>
        </div>
    </div>
    <div class="g-mapContainer">
        <div id="gaode-mapContainer" class="m-mapContainer"></div>
        <div id="baidu-mapContainer" class="m-mapContainer"></div>
        <div id="google-mapContainer" class="m-mapContainer"></div>
        <div class="btn-group-vertical m-mapZoomController">
            <button id="zoomInBtn" class="btn btn-default"><i class="glyphicon glyphicon-plus"></i></button>
            <span>级</span>
            <button id="zoomOutBtn" class="btn btn-default"><i class="glyphicon glyphicon-minus"></i></button>
        </div>
        <div class="m-mapTypeController">
            <div data-type="admin" class="mapType">
                <span>地图</span>
            </div>
            <div data-type="sate" class="mapType">
                <span>卫星</span>
            </div>
        </div>
    </div>
    <div class="g-foot">
        <span class="m-cpy">© 2017 大象地图  闽ICP备12021866号-2</span>
    </div>
</body>
</html>
<script type="text/template" id="markerListItem">
    <tr data-id="<\%=id%>">
        <td><input type="checkbox"></td>
        <td ><\%=name%></td>
        <td><\%=lng%></td>
        <td><\%=lat%></td>
    </tr>
</script>
<script type="text/template" id="inputMapTypeBtn">
    <\%=name%> <span class="caret"></span>
</script>

<script type="text/javascript" src="/resource/script/libs/jquery/jquery-2.1.4.min.js"></script>
<script type="text/javascript" src="/resource/script/libs/underscore/1.8.3/underscore.js"></script>
<script type="text/javascript" src="/resource/script/libs/bootstrap/js/bootstrap.js"></script>
<script type="text/javascript" src="/resource/script/libs/bootstrap/plugins/bootbox/bootbox.min.js"></script>
<script type="text/javascript" src="/resource/script/libs/n9soft/n9commons.js"></script>
<script type="text/javascript" src="/resource/script/libs/bootstrap/plugins/icheck/icheck.js?v=1.0.2"></script>
<script type="text/javascript" src="http://webapi.amap.com/maps?v=1.3&key=1b3148ed5f1667e0b03d004ca9c6029c&plugin=AMap.Geocoder,AMap.Autocomplete,AMap.Geolocation"></script>
<script src="http://webapi.amap.com/ui/1.0/main.js"></script>
<script src="http://api.map.baidu.com/api?v=2.0&ak=dkGjl1HFTZj1isZ1ST1KYfICCaZUYYM5" type="text/javascript"></script>
<%--<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDIemFY49ozjL4uQFc4nMVilcUtWT1Sr6A"></script>--%>
<script type="text/javascript" src="/resource/script/page/index.src.js"></script>
<script>
    $(".m-menuLeft li,.m-menuRight li,.m-menuGroup a,.m-searchBar .m-scMenu li:not(.m-scMenu li:first-child),.g-side .m-scMenu li,#showAllTableBtn").click(function () {
        _.alert("该功能尚在建设中，敬请期待！");
    })
    window.N.main.init();
</script>
<script type="text/javascript" src="/resource/script/page/commons.js"></script>





