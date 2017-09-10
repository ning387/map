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
    <link href="/resource/css/function.css" rel="stylesheet"/>
    <link href="/resource/css/tinymap.css" rel="stylesheet"/>
</head>
<body>
<header class="g-head">
    <div class="m-searchBar">
         <input type="text" id="searchInput" class="form-control" placeholder="请输入您要查询的地点">
    </div>
</header>
<div id="gaode-mapContainer" class="g-mapContainer"></div>
<div class="g-content">
    <span>地点:</span>
    <span>经度:纬度:</span>
</div>
</body>
</html>
<script type="text/javascript" src="/resource/script/libs/jquery/jquery-2.1.4.min.js"></script>
<script type="text/javascript" src="/resource/script/libs/underscore/1.8.3/underscore.js"></script>
<script type="text/javascript" src="/resource/script/libs/bootstrap/js/bootstrap.js"></script>
<script type="text/javascript" src="/resource/script/libs/n9soft/n9commons.js"></script>
<script type="text/javascript" src="http://webapi.amap.com/maps?v=1.3&key=1b3148ed5f1667e0b03d004ca9c6029c&plugin=AMap.Geocoder,AMap.Autocomplete,AMap.Geolocation"></script>
<script type="text/javascript" src="/resource/script/page/commons.js"></script>
<script type="text/javascript" src="/resource/script/page/tinyMap.js"></script>





