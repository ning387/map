package com.n9soft.searchLocation.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Created by Ning on 2017/3/15.
 */
@Controller
public class IndexController {
    @RequestMapping("/index")
    private String index(){
        return "index";
    }
    @RequestMapping("/tinymap")
    private String tinymap(){
        return "tinymap";
    }
}
