function map1859Ykjz(mapId, map_container) {

    if (map_container === "map_1"){
        if(this.map1) {
            this.map1.remove();
        };
        map1 = L.map(map_container, {
            crs: L.CRS.Simple,
            minZoom: minZoom_1859_ykjz,
            zoomSnap: 0.25,
            zoomDelta: 0.25,
            wheelPxPerZoomLevel: 80
        });

        const maxNativeZoom = maxNativeZoom_1859_ykjz;
        const maxZoom = maxZoom_1859_ykjz;
        const image_width = image_width_1859_ykjz;
        const image_height = image_height_1859_ykjz;
        const minZoom = minZoom_1859_ykjz;

        var t_map = { map_1851_ymkz:"1851_横浜村並近傍之図", map_1859_ykjz:"1859_横浜開港地割之図", map_1860_tyf: "1860_東海道名所之内横浜風景", map_1860_ymi: "1860_横浜名所一覧（海岸）", map_1861_gkyz:"1861_御開港横濱之図", map_1861_syf: "1861_再改横浜風景", map_1865_gkyzz:"1865_御開港横浜之全図", map_1868_ymzz: 3, map_now: "現在" };
        var z_map = { map_1851_ymkz: 2, map_1859_ykjz: 3, map_1860_tyf: 7, map_1860_ymi: 7, map_1861_gkyz: 2, map_1861_syf: 4, map_1865_gkyzz: 4, map_1868_ymzz: 3, map_now: 16 };
        const geojson_title = "title_1859_ykjz.geojson";
        var Map_b = {
        };

        var nw = map1.unproject([0, 0], maxNativeZoom);
        var se = map1.unproject([image_width, image_height], maxNativeZoom);
        var bounds = L.latLngBounds(nw, se);
        map1.setMaxBounds(bounds);
        map1.fitBounds(bounds.pad(0.1));

        if (previous_status_1[current_mapId_1]["zoom"] === 0) {
            map1.setView([0, 0], 3);
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
            attribution: "<a href='https://www.ndl.go.jp/jp/use/reproduction/index.html' target='_blank'>国立国会図書館デジタルコレクション</a>"
        }).addTo(map1);

//    //sidebar
//    var sidebar = L.control.sidebar(sidebarId, {
//        position: 'right'
//    });
//    map.addControl(sidebar);

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
                latLngs[i] = map1.unproject(point[i], maxNativeZoom);
            }
            return latLngs;
        }
        return map1.unproject(point, maxNativeZoom);
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

        function onGetJson(data, marker, layerName) {
            var overlay = L.geoJson(data, {
                onEachFeature: function (feature, layer) {
                    layer.on('mouseover', function (e) {
                        var imgContainer = $(feature.properties.URL);
                        var img = imgContainer.find("img");
                        img.load(function () {
                            var hover_bubble = L.responsivePopup({ hasTip: false })
                                .setContent(feature.properties.pid + "<br>"
                                    + feature.properties.spot + "<br>"
                                    + feature.properties.URL + "<br>"
                                    + feature.properties.author + "【" + feature.properties.publication_year + "】" + "<br>"
                                    + feature.properties.volume + "<br>"
                                    + "転載元：" + feature.properties.source)
                                .setLatLng(e.latlng)
                                .openOn(map1);
                        });
                    });

                    //        layer.on('mouseout', function(e){ map.closePopup() });
                    /*
                                layer.on('click', function (e) {
                                    document.getElementById(sidebarId).innerHTML = "BLAH BLAH BLAH " + feature.properties.pid;
                                    sidebar.show();
                                });
                    */
                }
                , pointToLayer: function (feature, latlng) {
                    return L.marker(latlng, { icon: marker });
                }
            });
            overlay.addTo(map1);
            control.addOverlay(overlay, layerName); // Add the layer to the Layer Control.
        }

        function spotOverlay(data, layerName) {
            var spot_geoj = L.geoJSON(data, {
                style: function (feature) { return feature.properties.style },
                onEachFeature: function (feature, layer) {
                    layer.on('mouseover', function (e) {
                        var hover_bubble = new L.responsivePopup({ offset: new L.Point(0, -5), closeButton: false, autoPan: true })
                            .setContent(feature.properties.name + "<br><br>" + feature.properties.description)
                            .setLatLng(e.latlng)
                            .openOn(map1);
                    });
                    //            layer.on('mouseout', function (e) { map.closePopup() });
                }
            });
            spot_geoj.addTo(map1)
            control.addOverlay(spot_geoj, layerName); // Add the layer to the Layer Control.
        }

    /*
    $.getJSON("./gj/spot_ykj.geojson", function (data) {
        spotOverlay(data, "spot")
    });
    */

       function titleOverlay(data, layerName) {
            var title_geoj = L.geoJSON(data, {
                style: function (feature) { return feature.properties.style },
                onEachFeature: function (feature, layer) {
                    layer.on('mouseover', function (e) {
                        var imgContainer = $(feature.properties.URL);
                        var img = imgContainer.find("img");
                        img.load(function () {
                            var hover_bubble = L.responsivePopup({ hasTip: false })
                                .setContent(feature.properties.title + "<br>"
                                    + feature.properties.URL + "<br>"
                                    + feature.properties.author + "<br>"
                                    + feature.properties.publication_year + "<br>"
                                    + "転載元：" + feature.properties.source + "<br>"
                                    + feature.properties.description
                                    )
                            .setLatLng(e.latlng)
                                .openOn(map1);
                        });
                    });
                    //            layer.on('mouseout', function (e) { map.closePopup() });
                }
            });
            title_geoj.addTo(map1)
            control.addOverlay(title_geoj, layerName); // Add the layer to the Layer Control.
        }

        $.getJSON("./gj/" + geojson_title, function (data) {
            titleOverlay(data, "標題")
        });


        // Create the control and add it to the map;
            var control = L.control.layers(Map_b); // Grab the handle of the Layer Control, it will be easier to find.
            control.addTo(map1);
        //});
    }
    else if (map_container === "map_2"){
        if(this.map2) {
            this.map2.remove();
        };
        map2 = L.map(map_container, {
            crs: L.CRS.Simple,
            minZoom: minZoom_1859_ykjz,
            zoomSnap: 0.25,
            zoomDelta: 0.25,
            wheelPxPerZoomLevel: 80
            });

    //$(function () {
    //   var mapId = mapId;
    //    const sidebarId = 'sidebar_1859_ykjz'
    //    const map = current_mapId;
        const maxNativeZoom = maxNativeZoom_1859_ykjz;
        const maxZoom = maxZoom_1859_ykjz;
        const image_width = image_width_1859_ykjz;
        const image_height = image_height_1859_ykjz;
        const minZoom = minZoom_1859_ykjz;

        var t_map = { map_1851_ymkz:"1851_横浜村並近傍之図", map_1859_ykjz:"1859_横浜開港地割之図", map_1860_tyf: "1860_東海道名所之内横浜風景", map_1860_ymi: "1860_横浜名所一覧（海岸）", map_1861_gkyz:"1861_御開港横濱之図", map_1861_syf: "1861_再改横浜風景", map_1865_gkyzz:"1865_御開港横浜之全図", map_1868_ymzz: 3, map_now: "現在" };
        var z_map = { map_1851_ymkz: 2, map_1859_ykjz: 3, map_1860_tyf: 7, map_1860_ymi: 7, map_1861_gkyz: 2, map_1861_syf: 4, map_1865_gkyzz: 4, map_1868_ymzz: 3, map_now: 16 };
        const geojson_title = "title_1859_ykjz.geojson";

        var Map_b = {
        };

        var nw = map2.unproject([0, 0], maxNativeZoom);
        var se = map2.unproject([image_width, image_height], maxNativeZoom);
        var bounds = L.latLngBounds(nw, se);
        map2.setMaxBounds(bounds);
        map2.fitBounds(bounds.pad(0.1));

        if (previous_status_2[current_mapId_2]["zoom"] === 0) {
            map2.setView([0, 0], 3);
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
            attribution: "<a href='https://www.ndl.go.jp/jp/use/reproduction/index.html' target='_blank'>国立国会図書館デジタルコレクション</a>"
        }).addTo(map2);

//    //sidebar
//    var sidebar = L.control.sidebar(sidebarId, {
//        position: 'right'
//    });
//    map.addControl(sidebar);

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

        function point2latLng(point) {
            if (L.Util.isArray(point[0])) {
                var latLngs = [];
                for (var i = 0, len = point.length; i < len; i++) {
                    latLngs[i] = map2.unproject(point[i], maxNativeZoom);
                }
                return latLngs;
            }
            return map2.unproject(point, maxNativeZoom);
        }

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

        function onGetJson(data, marker, layerName) {
            var overlay = L.geoJson(data, {
                onEachFeature: function (feature, layer) {
                    layer.on('mouseover', function (e) {
                        var imgContainer = $(feature.properties.URL);
                        var img = imgContainer.find("img");
                        img.load(function () {
                            var hover_bubble = L.responsivePopup({ hasTip: false })
                                .setContent(feature.properties.pid + "<br>"
                                    + feature.properties.spot + "<br>"
                                    + feature.properties.URL + "<br>"
                                    + feature.properties.author + "【" + feature.properties.publication_year + "】" + "<br>"
                                    + feature.properties.volume + "<br>"
                                    + "転載元：" + feature.properties.source)
                                .setLatLng(e.latlng)
                                .openOn(map2);
                        });
                    });

                //        layer.on('mouseout', function(e){ map.closePopup() });
                /*
                            layer.on('click', function (e) {
                                document.getElementById(sidebarId).innerHTML = "BLAH BLAH BLAH " + feature.properties.pid;
                                sidebar.show();
                            });
                */
                }
                , pointToLayer: function (feature, latlng) {
                    return L.marker(latlng, { icon: marker });
                }
            });
            overlay.addTo(map2);
            control.addOverlay(overlay, layerName); // Add the layer to the Layer Control.
        }

        function spotOverlay(data, layerName) {
            var spot_geoj = L.geoJSON(data, {
                style: function (feature) { return feature.properties.style },
                onEachFeature: function (feature, layer) {
                    layer.on('mouseover', function (e) {
                        var hover_bubble = new L.responsivePopup({ offset: new L.Point(0, -5), closeButton: false, autoPan: true })
                            .setContent(feature.properties.name + "<br><br>" + feature.properties.description)
                            .setLatLng(e.latlng)
                            .openOn(map2);
                    });
                    //            layer.on('mouseout', function (e) { map.closePopup() });
                }
            });
            spot_geoj.addTo(map2)
            control.addOverlay(spot_geoj, layerName); // Add the layer to the Layer Control.
        }

    /*
    $.getJSON("./gj/spot_ykj.geojson", function (data) {
        spotOverlay(data, "spot")
    });
    */

       function titleOverlay(data, layerName) {
        var title_geoj = L.geoJSON(data, {
            style: function (feature) { return feature.properties.style },
            onEachFeature: function (feature, layer) {
                layer.on('mouseover', function (e) {
                    var imgContainer = $(feature.properties.URL);
                    var img = imgContainer.find("img");
                    img.load(function () {
                        var hover_bubble = L.responsivePopup({ hasTip: false })
                            .setContent(feature.properties.title + "<br>"
                                + feature.properties.URL + "<br>"
                                + feature.properties.author + "<br>"
                                + feature.properties.publication_year + "<br>"
                                + "転載元：" + feature.properties.source + "<br>"
                                + feature.properties.description
                                )
                        .setLatLng(e.latlng)
                            .openOn(map2);
                    });
                });
                //            layer.on('mouseout', function (e) { map.closePopup() });
            }
        });
        title_geoj.addTo(map2)
        control.addOverlay(title_geoj, layerName); // Add the layer to the Layer Control.
    }

    $.getJSON("./gj/" + geojson_title, function (data) {
        titleOverlay(data, "標題")
    });


        // Create the control and add it to the map;
        var control = L.control.layers(Map_b); // Grab the handle of the Layer Control, it will be easier to find.
        control.addTo(map2);

    }

}
