﻿function map1860Tyf(mapId, map_container) {

    if (map_container === "map_1"){
        if(this.map1) {
            this.map1.remove();
        };
        map1 = L.map(map_container, {
            crs: L.CRS.Simple,
            minZoom: minZoom_1860_tyf,
            zoomSnap: 0.25,
            zoomDelta: 0.25,
            wheelPxPerZoomLevel: 80
        });
    
        const maxNativeZoom = maxNativeZoom_1860_tyf;
        const maxZoom = maxZoom_1860_tyf;
        const image_width = image_width_1860_tyf;
        const image_height = image_height_1860_tyf;
        const minZoom = minZoom_1860_tyf;
    
        var t_map = { map_1851_ymkz:"1851_横浜村並近傍之図", map_1859_ykjz:"1859_横浜開港地割之図", map_1860_tyf: "1860_東海道名所之内横浜風景", map_1860_ymi: "1860_横浜名所一覧（海岸）", map_1861_gkyz:"1861_御開港横濱之図", map_1861_syf: "1861_再改横浜風景", map_1865_gkyzz:"1865_御開港横浜之全図", map_1868_ymzz: 3, map_now: "現在" };
        var z_map = { map_1851_ymkz: 2, map_1859_ykjz: 3, map_1860_tyf: 7, map_1860_ymi: 7, map_1861_gkyz: 2, map_1861_syf: 4, map_1865_gkyzz: 4, map_1868_ymzz: 3, map_now: 16 };
        const geojson_spot = "spot_1860_tyf_n.geojson";
    
        var Map_b = {
        };
    
        var nw = map1.unproject([0, 0], maxNativeZoom);
        var se = map1.unproject([image_width, image_height], maxNativeZoom);
        var bounds = L.latLngBounds(nw, se);
        map1.setMaxBounds(bounds);
        map1.fitBounds(bounds.pad(0.1));

        if (previous_status_1[current_mapId_1]["zoom"] === 0) {
            map1.setView([0, 0], 4);
        }
        else {
            var previous_pos = previous_status_1[current_mapId_1]["latlng"];
    
            var previous_pos_array = JSON.parse(previous_pos);
            var previous_latLng = new L.latLng(previous_pos_array[0], previous_pos_array[1]);
    
            console.log("previous_pos:" + previous_pos);
            var previous_zoom = previous_status_1[current_mapId_1]["zoom"];
            map1.setView(previous_latLng, previous_zoom);
            console.log("previous_latLng, previous_zoom:" + previous_latLng + "," + previous_zoom);
        }
    
        L.tileLayer('tiles/' + mapId + '/{z}/{x}/{y}.jpg', {
            maxZoom: maxZoom,
            minZoom: minZoom,
            bounds: bounds,
            attribution: attribution
        }).addTo(map1);
    
        //sidebar
    //    var sidebar = L.control.sidebar(sidebarId, {
    //        position: 'right'
    //    });
    //    map.addControl(sidebar);
        //    sidebar.show();
    
        if (window.location.href.indexOf("debug") > 0) {
            var pointer = L.marker(bounds.getCenter(), {
                draggable: true
            }).on('drag', function (e) {
                update_coord_references(map1, this, e.latlng);
            }).bindPopup().addTo(map1);
    
            map1.on('zoomend', function (e) {
                var z = map1.getZoom();
                var w = Math.ceil(image_width / Math.pow(2, (maxNativeZoom - z)));
                var h = Math.ceil(image_height / Math.pow(2, (maxNativeZoom - z)));
                console.log('zoom level: %d, image size: %dx%d', z, w, h);
            });
        };
    
    
        // functions ----------------------------------------------------------
    
        /*
            function point2latLng(point) {
                if (L.Util.isArray(point[0])) {
                    var latLngs = [];
                    for (var i = 0, len = point.length; i < len; i++) {
                        latLngs[i] = map.unproject(point[i], maxNativeZoom);
                    }
                    return latLngs;
                }
                return map.unproject(point, maxNativeZoom);
            }
        */
        function digit_format(num) {
            return (('    ') + num.toFixed(2)).substr(-8);
        }
    
        function update_coord_references(map1, marker, latLng) {
            var p = map1.project(latLng, map1.getZoom());
            var pMax = map1.project(latLng, maxNativeZoom);
            var content = '<pre class="coords">'
                //            + 'lng: ' + ', ' + 'lat: ' + '\n'
                + digit_format(latLng.lng) + ',' + digit_format(latLng.lat) + '\n'
                //            + '  x: ' + ', ' + '  y: ' + '\n'
                + digit_format(p.x) + ',' + digit_format(p.y) + '\n'
                //            + '  X: ' + ', ' + '  Y: ' + '\n'
                + digit_format(pMax.x) + ',' + digit_format(pMax.y)
                + '</pre>';
            marker.getPopup().setContent(content).openOn(map1);
        }
    
        // Point style
        var stationStyle = {
            opacity: 0.9,
            fillOpacity: 0.7
        };
    
        //    L.control.scale({ maxWidth: 250, imperial: false }).addTo(map);
    
        function onGetJson(mapId, data, marker, layerName) {
            function showPopup(e, feature) {
                var imgContainer = $(feature.properties.URL);
                var img = imgContainer.find("img");
    
                var break_year = feature.properties.author.length > 30 ? "<br>" : "";
                var break_volume = feature.properties.volume == null ? "" : "<br>";
                var break_description = feature.properties.description == null ? "" : "<br><br>";
                var content = feature.properties.pid + "<br>"
                    + feature.properties.spot + "<br>"
                    + feature.properties.URL + "<br>"
                    + feature.properties.author + break_year + "【" + feature.properties.publication_year + "】" + "<br>"
                    + (feature.properties.volume || "") + break_volume
                    + "転載元：" + feature.properties.source
                    + break_description + (feature.properties.description || "");
    
    
                var buttons = []
    
                for (var mapKey in feature.properties.map_coordinates) {                
                    if (mapKey != mapId) {
                        var jumpCoordinates = feature.properties.map_coordinates[mapKey];
                        // Create ボタン
                        var lon = jumpCoordinates[0];
                        var lat = jumpCoordinates[1];
    
                        var originalMapInfo = btoa(JSON.stringify({
                            mapId: mapId,
                            lat: feature.properties.map_coordinates[mapId][1],
                            lon: feature.properties.map_coordinates[mapId][0]
                        }));
    
    
                        buttons.push(
                            "<button class='button' type='button' onclick='gotoMap(\"" + mapKey + "\"," + lat + "," + lon + "," + z_map[mapKey] + ", \""
                            + btoa(unescape(encodeURIComponent(content))) + "\", \"" + originalMapInfo
                            + "\");'>" + t_map[mapKey] + "</button><br>");
    
                    }
                }
    
                img.load(function () {
                    hover_bubble = L.responsivePopup({ hasTip: false })
                        .setContent(content
                            + "<br>"
                            + buttons.join("")
                        )
                        .setLatLng(e.latlng)
                        .openOn(map1);
    
                });
            }
    
            function showSidebar(e, feature) {
                document.getElementById(sidebarId).innerHTML = "BLAH BLAH BLAH " + feature.properties.pid;
                sidebar.show();
            }
    
            var overlay = L.geoJson(data, {
                onEachFeature: function (feature, layer) {
                    if (isMobile.any()) {
                        var clickTimer = null;
                        layer.on('click', function (e) {
                            e.originalEvent.stopPropagation();
                            e.originalEvent.preventDefault();
                            if (clickTimer == null) {
                                clickTimer = setTimeout(function () {
                                    showPopup(e, feature);
                                    clickTimer = null;
                                }, 500);
                            }
                            else {
                                showSidebar(e, feature);
                                clearTimeout(clickTimer);
                                clickTimer = null;
                            }
                        });
                    }
                    else {
                        layer.on('mouseover', function (e) { showPopup(e, feature) });
                        // layer.on('mouseout', function (e) { map.closePopup() });
                        //                    layer.on('click', function (e) { showSidebar(e, feature) });
                    }
                }
                , pointToLayer: function (feature, latlng) {
                    var coords = feature.properties.map_coordinates[mapId];
                    if (coords != null) {
                        latlng = new L.LatLng(coords[1], coords[0]);
                        marker = L.divIcon({ className:feature.properties.icon_style, iconSize: [15, 15] });             
                        return L.marker(latlng, { icon: marker });
                    }
                }
            });
            overlay.addTo(map1);
            control.addOverlay(overlay, layerName); // Add the layer to the Layer Control.
        }
    
            // kaikou_mae_1833-1858
            var layerName_1 = "<span style=\"display: inline-block; width: 85%; color:black; background-color: rgb(201, 233, 183);\">1833-1858:開港前</span>"
                + "<br>"
                + "<table>"
                + "<tr><td width=10></td><td><div class=\"circle_t53\"></div></td><td>1834_東海道五十三次</td></tr>"
                + "<tr><td width=10></td><td><div class=\"circle_ss\"></div></td><td>1855_ペリー提督横浜上陸の図</td></tr>"
                + "<tr><td width=10></td><td><div class=\"circle_m53\"></div></td><td>1855_五十三次名所図会</td></tr>"
                + "<tr><td width=10></td><td><div class=\"circle_edo\"></div></td><td>1858_名所江戸百景</td></tr>"
                + "<tr><td width=10></td><td><div class=\"circle_f36\"></div></td><td>1858_冨士三十六景</td></tr>"
                + "</table>";
            var kaikou_maeMarker = L.divIcon({ className: 'circle_kaikou_mae', iconSize: [15, 15] });
            $.getJSON("./gj/kaikou_mae_1833-1858_n.geojson", function (data) {
                onGetJson(mapId, data, kaikou_maeMarker, layerName_1);
            });
    
            // kaikou_chokugo_1859-1865
            var layerName_2 = "<span style=\"display: inline-block; width: 85%; color:black; background-color: rgb(201, 233, 183);\">1859-1865:開港直後</span>"
                + "<br>"
                + "<table>"
    //            + "<tr><td><div class=\"circle_at\"></td><td>1860_新田間橋</td></tr>"
                + "<tr><td width=10></td><td><div class=\"circle_ym\"></td><td>1860_横浜名所一覧</td></tr>"
                + "<tr><td width=10></td><td><div class=\"circle_yh\"></td><td>1860_横浜本町之図</td></tr>"
                + "<tr><td width=10></td><td><div class=\"circle_ky\"></td><td>1860_神名川横浜新開港図</td></tr>"
                + "<tr><td width=10></td><td><div class=\"circle_ykk\"></td><td>1862_横浜開港見聞誌</td></tr>"
                + "</table>";
            var kaikou_chokugoMarker = L.divIcon({ className: 'circle_kaikou_chokugo', iconSize: [15, 15] });
            $.getJSON("./gj/kaikou_chokugo_1859-1865_n.geojson", function (data) {
                onGetJson(mapId, data, kaikou_chokugoMarker, layerName_2);
            });
    
            function spotOverlay(data, layerName) {
                var spot_geoj = L.geoJSON(data, {
                    style: function (feature) { return feature.properties.style },
                    onEachFeature: function (feature, layer) {
                        layer.on('mouseover', function (e) {
                            var breaks = feature.properties.description.length > 0 ? "<br><br>" : "";
                            var hover_bubble = new L.responsivePopup({ offset: new L.Point(0, -5), closeButton: false, autoPan: true })
                                .setContent(feature.properties.name + breaks + feature.properties.description)
                                .setLatLng(e.latlng)
                                .openOn(map1);
                        });
                        //            layer.on('mouseout', function (e) { map.closePopup() });
                    }
                });
                spot_geoj.addTo(map1)
                control.addOverlay(spot_geoj, layerName); // Add the layer to the Layer Control.
            }
        
        
            var layerName_chimei = "<span style=\"display: inline-block; width: 85%; color:black; background-color: rgb(201, 233, 183);\">地名等コメント</span>";
            $.getJSON("./gj/" + geojson_spot, function (data) {
                spotOverlay(data, layerName_chimei)
            });
    
        // Create the control and add it to the map;
        var control = L.control.layers(Map_b); // Grab the handle of the Layer Control, it will be easier to find.
        control.addTo(map1);
    

    }

    else if (map_container === "map_2"){
        if(this.map2) {
            this.map2.remove();
        };
        map2 = L.map(map_container, {
            crs: L.CRS.Simple,
            minZoom: minZoom_1860_tyf,
            zoomSnap: 0.25,
            zoomDelta: 0.25,
            wheelPxPerZoomLevel: 80
        });

//$(function () {
//    var mapId = mapId;
//    const sidebarId = 'sidebar_1860_tyf';
//    const map = current_mapId;
    const maxNativeZoom = maxNativeZoom_1860_tyf;
    const maxZoom = maxZoom_1860_tyf;
    const image_width = image_width_1860_tyf;
    const image_height = image_height_1860_tyf;
    const minZoom = minZoom_1860_tyf;

    var t_map = { map_1851_ymkz:"1851_横浜村並近傍之図", map_1859_ykjz:"1859_横浜開港地割之図", map_1860_tyf: "1860_東海道名所之内横浜風景", map_1860_ymi: "1860_横浜名所一覧（海岸）", map_1861_gkyz:"1861_御開港横濱之図", map_1861_syf: "1861_再改横浜風景", map_1865_gkyzz:"1865_御開港横浜之全図", map_1868_ymzz: 3, map_now: "現在" };
    var z_map = { map_1851_ymkz: 2, map_1859_ykjz: 3, map_1860_tyf: 7, map_1860_ymi: 7, map_1861_gkyz: 2, map_1861_syf: 4, map_1865_gkyzz: 4, map_1868_ymzz: 3, map_now: 16 };
    const geojson_spot = "spot_1860_tyf_n.geojson";

    var Map_b = {
    };

    var nw = map2.unproject([0, 0], maxNativeZoom);
    var se = map2.unproject([image_width, image_height], maxNativeZoom);
    var bounds = L.latLngBounds(nw, se);
    map2.setMaxBounds(bounds);
    map2.fitBounds(bounds.pad(0.1));
    
    if (previous_status_2[current_mapId_2]["zoom"] === 0) {
        map2.setView([0, 0], 4);
    }
    else {
        var previous_pos = previous_status_2[current_mapId_2]["latlng"];
    
        var previous_pos_array = JSON.parse(previous_pos);
        var previous_latLng = new L.latLng(previous_pos_array[0], previous_pos_array[1]);
    
        console.log("previous_pos:" + previous_pos);
        var previous_zoom = previous_status_2[current_mapId_2]["zoom"];
        map2.setView(previous_latLng, previous_zoom);
        console.log("previous_latLng, previous_zoom:" + previous_latLng + "," + previous_zoom);
    }

    L.tileLayer('tiles/' + mapId + '/{z}/{x}/{y}.jpg', {
        maxZoom: maxZoom,
        minZoom: minZoom,
        bounds: bounds,
        attribution: attribution
    }).addTo(map2);

    //sidebar
//    var sidebar = L.control.sidebar(sidebarId, {
//        position: 'right'
//    });
//    map.addControl(sidebar);
    //    sidebar.show();

    if (window.location.href.indexOf("debug") > 0) {
        var pointer = L.marker(bounds.getCenter(), {
            draggable: true
        }).on('drag', function (e) {
            update_coord_references(map2, this, e.latlng);
        }).bindPopup().addTo(map2);

        map2.on('zoomend', function (e) {
            var z = map2.getZoom();
            var w = Math.ceil(image_width / Math.pow(2, (maxNativeZoom - z)));
            var h = Math.ceil(image_height / Math.pow(2, (maxNativeZoom - z)));
            console.log('zoom level: %d, image size: %dx%d', z, w, h);
        });
    };


    // functions ----------------------------------------------------------

    /*
        function point2latLng(point) {
            if (L.Util.isArray(point[0])) {
                var latLngs = [];
                for (var i = 0, len = point.length; i < len; i++) {
                    latLngs[i] = map.unproject(point[i], maxNativeZoom);
                }
                return latLngs;
            }
            return map.unproject(point, maxNativeZoom);
        }
    */
    function digit_format(num) {
        return (('    ') + num.toFixed(2)).substr(-8);
    }

    function update_coord_references(map2, marker, latLng) {
        var p = map2.project(latLng, map2.getZoom());
        var pMax = map2.project(latLng, maxNativeZoom);
        var content = '<pre class="coords">'
            //            + 'lng: ' + ', ' + 'lat: ' + '\n'
            + digit_format(latLng.lng) + ',' + digit_format(latLng.lat) + '\n'
            //            + '  x: ' + ', ' + '  y: ' + '\n'
            + digit_format(p.x) + ',' + digit_format(p.y) + '\n'
            //            + '  X: ' + ', ' + '  Y: ' + '\n'
            + digit_format(pMax.x) + ',' + digit_format(pMax.y)
            + '</pre>';
        marker.getPopup().setContent(content).openOn(map2);
    }

    // Point style
    var stationStyle = {
        opacity: 0.9,
        fillOpacity: 0.7
    };

    //    L.control.scale({ maxWidth: 250, imperial: false }).addTo(map);

    function onGetJson(mapId, data, marker, layerName) {
        function showPopup(e, feature) {
            var imgContainer = $(feature.properties.URL);
            var img = imgContainer.find("img");

            var break_year = feature.properties.author.length > 30 ? "<br>" : "";
            var break_volume = feature.properties.volume == null ? "" : "<br>";
            var break_description = feature.properties.description == null ? "" : "<br><br>";
            var content = feature.properties.pid + "<br>"
                + feature.properties.spot + "<br>"
                + feature.properties.URL + "<br>"
                + feature.properties.author + break_year + "【" + feature.properties.publication_year + "】" + "<br>"
                + (feature.properties.volume || "") + break_volume
                + "転載元：" + feature.properties.source
                + break_description + (feature.properties.description || "");


            var buttons = []

            for (var mapKey in feature.properties.map_coordinates) {                
                if (mapKey != mapId) {
                    var jumpCoordinates = feature.properties.map_coordinates[mapKey];
                    // Create ボタン
                    var lon = jumpCoordinates[0];
                    var lat = jumpCoordinates[1];

                    var originalMapInfo = btoa(JSON.stringify({
                        mapId: mapId,
                        lat: feature.properties.map_coordinates[mapId][1],
                        lon: feature.properties.map_coordinates[mapId][0]
                    }));


                    buttons.push(
                        "<button class='button' type='button' onclick='gotoMap(\"" + mapKey + "\"," + lat + "," + lon + "," + z_map[mapKey] + ", \""
                        + btoa(unescape(encodeURIComponent(content))) + "\", \"" + originalMapInfo
                        + "\");'>" + t_map[mapKey] + "</button><br>");

                }
            }

            img.load(function () {
                hover_bubble = L.responsivePopup({ hasTip: false })
                    .setContent(content
                        + "<br>"
                        + buttons.join("")
                    )
                    .setLatLng(e.latlng)
                    .openOn(map2);

            });
        }

        function showSidebar(e, feature) {
            document.getElementById(sidebarId).innerHTML = "BLAH BLAH BLAH " + feature.properties.pid;
            sidebar.show();
        }

        var overlay = L.geoJson(data, {
            onEachFeature: function (feature, layer) {
                if (isMobile.any()) {
                    var clickTimer = null;
                    layer.on('click', function (e) {
                        e.originalEvent.stopPropagation();
                        e.originalEvent.preventDefault();
                        if (clickTimer == null) {
                            clickTimer = setTimeout(function () {
                                showPopup(e, feature);
                                clickTimer = null;
                            }, 500);
                        }
                        else {
                            showSidebar(e, feature);
                            clearTimeout(clickTimer);
                            clickTimer = null;
                        }
                    });
                }
                else {
                    layer.on('mouseover', function (e) { showPopup(e, feature) });
                    // layer.on('mouseout', function (e) { map.closePopup() });
                    //                    layer.on('click', function (e) { showSidebar(e, feature) });
                }
            }
            , pointToLayer: function (feature, latlng) {
                var coords = feature.properties.map_coordinates[mapId];
                if (coords != null) {
                    latlng = new L.LatLng(coords[1], coords[0]);
                    marker = L.divIcon({ className:feature.properties.icon_style, iconSize: [15, 15] });             
                    return L.marker(latlng, { icon: marker });
                }
            }
        });
        overlay.addTo(map2);
        control.addOverlay(overlay, layerName); // Add the layer to the Layer Control.
    }

        // kaikou_mae_1833-1858
        var layerName_1 = "<span style=\"display: inline-block; width: 85%; color:black; background-color: rgb(201, 233, 183);\">1833-1858:開港前</span>"
            + "<br>"
            + "<table>"
            + "<tr><td width=10></td><td><div class=\"circle_t53\"></div></td><td>1834_東海道五十三次</td></tr>"
            + "<tr><td width=10></td><td><div class=\"circle_ss\"></div></td><td>1855_ペリー提督横浜上陸の図</td></tr>"
            + "<tr><td width=10></td><td><div class=\"circle_m53\"></div></td><td>1855_五十三次名所図会</td></tr>"
            + "<tr><td width=10></td><td><div class=\"circle_edo\"></div></td><td>1858_名所江戸百景</td></tr>"
            + "<tr><td width=10></td><td><div class=\"circle_f36\"></div></td><td>1858_冨士三十六景</td></tr>"
            + "</table>";
        var kaikou_maeMarker = L.divIcon({ className: 'circle_kaikou_mae', iconSize: [15, 15] });
        $.getJSON("./gj/kaikou_mae_1833-1858_n.geojson", function (data) {
            onGetJson(mapId, data, kaikou_maeMarker, layerName_1);
        });

        // kaikou_chokugo_1859-1865
        var layerName_2 = "<span style=\"display: inline-block; width: 85%; color:black; background-color: rgb(201, 233, 183);\">1859-1865:開港直後</span>"
            + "<br>"
            + "<table>"
//            + "<tr><td><div class=\"circle_at\"></td><td>1860_新田間橋</td></tr>"
            + "<tr><td width=10></td><td><div class=\"circle_ym\"></td><td>1860_横浜名所一覧</td></tr>"
            + "<tr><td width=10></td><td><div class=\"circle_yh\"></td><td>1860_横浜本町之図</td></tr>"
            + "<tr><td width=10></td><td><div class=\"circle_ky\"></td><td>1860_神名川横浜新開港図</td></tr>"
            + "<tr><td width=10></td><td><div class=\"circle_ykk\"></td><td>1862_横浜開港見聞誌</td></tr>"
            + "</table>";
        var kaikou_chokugoMarker = L.divIcon({ className: 'circle_kaikou_chokugo', iconSize: [15, 15] });
        $.getJSON("./gj/kaikou_chokugo_1859-1865_n.geojson", function (data) {
            onGetJson(mapId, data, kaikou_chokugoMarker, layerName_2);
        });

        function spotOverlay(data, layerName) {
            var spot_geoj = L.geoJSON(data, {
                style: function (feature) { return feature.properties.style },
                onEachFeature: function (feature, layer) {
                    layer.on('mouseover', function (e) {
                        var breaks = feature.properties.description.length > 0 ? "<br><br>" : "";
                        var hover_bubble = new L.responsivePopup({ offset: new L.Point(0, -5), closeButton: false, autoPan: true })
                            .setContent(feature.properties.name + breaks + feature.properties.description)
                            .setLatLng(e.latlng)
                            .openOn(map2);
                    });
                    //            layer.on('mouseout', function (e) { map.closePopup() });
                }
            });
            spot_geoj.addTo(map2)
            control.addOverlay(spot_geoj, layerName); // Add the layer to the Layer Control.
        }
    
    
        var layerName_chimei = "<span style=\"display: inline-block; width: 85%; color:black; background-color: rgb(201, 233, 183);\">地名等コメント</span>";
        $.getJSON("./gj/" + geojson_spot, function (data) {
            spotOverlay(data, layerName_chimei)
        });

    // Create the control and add it to the map;
    var control = L.control.layers(Map_b); // Grab the handle of the Layer Control, it will be easier to find.
    control.addTo(map2);

//});
}
}
